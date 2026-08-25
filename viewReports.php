<?php
session_start(); // Start session

// Ensure user is logged in
if (!isset($_SESSION['username'])) {
    die("Unauthorized access. Please log in.");
}

// Fetch user details from session
$username = $_SESSION['username']; // `username` is the `user_id` in reports table
$employee_name = $_SESSION['employee_name'] ?? 'Unknown Employee';
$role = $_SESSION['role'] ?? 'user'; // Default to user role

// Database connection
try {
    $pdo = new PDO("mysql:host=localhost;dbname=station_info", 'root', 'Hbl@1234');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query based on role
    if ($role === 'admin') {
        $stmt = $pdo->prepare("SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id 
                               FROM report 
                               ORDER BY upload_date DESC");
    } else {
        $stmt = $pdo->prepare("SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id 
                               FROM report 
                               WHERE user_id = :username 
                               ORDER BY upload_date DESC");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    }

    $stmt->execute();
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reports - HBL Engineering Ltd.</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; }
    h1, h2 { text-align: center; margin: 0; }
    .container { padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    table, th, td { border: 1px solid #ddd; }
    th, td { padding: 10px; text-align: left; }
    th { background-color: #00457C; color: white; }
    td a { color: #00457C; text-decoration: none; }
    td a:hover { text-decoration: underline; }
    .btn { padding: 5px 10px; margin: 5px; cursor: pointer; color: white; border: none; border-radius: 5px; display: inline-block; }
    .view-btn { background-color: #17a2b8; }
    .edit-btn { background-color: #ffc107; }
    .download-btn { background-color: #28a745; }
    .upload-btn { background-color: #6f42c1; display:inline-block;}
    .back-btn { background-color: #6c757d; }

    /* WFMS Integration Modals */
    .wfms-modal {
        display: none;
        position: fixed;
        z-index: 3000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        justify-content: center;
        align-items: center;
    }
    .wfms-modal-content {
        background-color: #fff;
        padding: 25px;
        border-radius: 8px;
        width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    .wfms-modal-header {
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 1.2rem;
        font-weight: bold;
        color: #3f51b5;
    }
    .wfms-form-group {
        margin-bottom: 15px;
    }
    .wfms-form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
    }
    .wfms-form-group input, .wfms-form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .wfms-btn-row {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 2s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .status-label { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .completed { color: green; background-color: #d3ffd3; }
    .not-completed { color: red; background-color: #ffd3d3; }
    .profile { position: absolute; right: 20px; color: white; font-size: 14px; }
    #search-input { padding: 10px; width: 300px; margin-top: 20px; }
  </style>
</head>
<body>

<header style="display: flex; align-items: center; justify-content: center; background-color: #00457C; color: white; padding: 20px; position: relative;">
    <img src="hbl_logo.jpg" alt="HBL Engineering Ltd. Logo" style="position: absolute; left: 20px; height: 50px;">
    <div>
      <h1>HBL Engineering Ltd.</h1>
      <h2>Electronics Group</h2>
    </div>
    <div class="profile">User: <?php echo htmlspecialchars($username); ?> | Employee: <?php echo htmlspecialchars($employee_name); ?></div>
</header>

<div class="container">
    <!-- Back Button -->
    <a href="index.html" class="btn back-btn">Back to Home</a>

    <!-- Search Bar on the Right -->
    <div style="text-align: right;">
      <input type="text" id="search-input" placeholder="Search by Station ID...">
    </div>

    <h2>Your Uploaded Reports</h2>
    <?php if ($reports): ?>
        <table id="report-table">
            <thead>
                <tr>
                    <th>Report</th>
                    <th>Upload Date</th>
                    <th>Upload Time</th>
                    <?php if ($role === 'admin'): ?> <th>User ID</th> <?php endif; ?>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($reports as $report): ?>
                <?php
                // Extract Station Name or ID and look up real numeric station_id from DB
                $station_id = null;
                $report_date = null;

                if (preg_match('/^(.*?)_([0-9]{4}-[0-9]{2}-[0-9]{2})_Report_/i', $report['file_name'], $matches)) {
                    $extracted_name = trim($matches[1]);
                    $report_date = $matches[2];

                    if (is_numeric($extracted_name)) {
                        $station_id = $extracted_name;
                    } else {
                        $stStmt = $pdo->prepare("SELECT station_id FROM station WHERE station_name = :name LIMIT 1");
                        $stStmt->execute(['name' => $extracted_name]);
                        $stRow = $stStmt->fetch(PDO::FETCH_ASSOC);
                        if ($stRow && !empty($stRow['station_id'])) {
                            $station_id = $stRow['station_id'];
                        } else {
                            $station_id = $extracted_name;
                        }
                    }
                } elseif (preg_match('/^([^_]+)/', $report['file_name'], $stationMatches)) {
                    $station_id = trim($stationMatches[0]);
                }

                if (empty($station_id)) {
                    $station_id = 'N/A';
                }

                // Values as fallbacks
                if (!$report_date && isset($report['upload_date'])) {
                    $report_date = substr($report['upload_date'], 0, 10);
                }

                // Modified regex to handle:
                // - a dash after "Version" (e.g., _Version-1)
                // - optional second ".pdf" (e.g., .pdf.pdf)
                preg_match('/_Report_([^_]+)_Version[\w-]+\.(pdf)$/i', $report['file_name'], $statusMatch);
                $statusCaptured = isset($statusMatch[1]) ? trim($statusMatch[1]) : '';
                $statusText = strtolower($statusCaptured);
                $statusLabel = ($statusText === 'completed') 
                    ? '<span class="status-label completed">Completed</span>' 
                    : '<span class="status-label not-completed">Not Completed</span>';
                ?>
                <tr data-station-id="<?php echo htmlspecialchars($station_id); ?>" data-report-date="<?php echo htmlspecialchars($report_date); ?>">
                    <td><?php echo htmlspecialchars($report['file_name']); ?></td>
                    <td><?php echo htmlspecialchars(date('d/m/y', strtotime($report['upload_date']))); ?></td>
                    <td><?php echo htmlspecialchars($report['upload_time']); ?></td>
                    <?php if ($role === 'admin'): ?> 
                        <td><?php echo htmlspecialchars($report['user_id']); ?></td>
                    <?php endif; ?>
                    <td><?php echo $statusLabel; ?></td>
                    <td>
                        <a href="uploads/reports/<?php echo htmlspecialchars($report['file_name']); ?>" class="btn view-btn">View</a>
                        <a href="create.html?station_id=<?php echo htmlspecialchars($station_id); ?>" class="btn edit-btn">Edit</a>
                        <a href="uploads/reports/<?php echo htmlspecialchars($report['file_name']); ?>" download class="btn download-btn">Download</a>
                        <button class="btn upload-btn" onclick="openWFMSLogin(event, '<?php echo htmlspecialchars($report['id']); ?>', '<?php echo htmlspecialchars($station_id); ?>', '<?php echo htmlspecialchars($report['file_name']); ?>')">Push to WFMS</button>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>No reports available.</p>
    <?php endif; ?>
</div>

<!-- WFMS Login Modal -->
<div id="wfmsLoginModal" class="wfms-modal">
    <div class="wfms-modal-content">
        <div class="wfms-modal-header">Login to WFMS</div>
        <div class="wfms-form-group">
            <label>Username</label>
            <input type="text" id="wfms_user" placeholder="WFMS Username">
        </div>
        <div class="wfms-form-group">
            <label>Password</label>
            <input type="password" id="wfms_pass" placeholder="WFMS Password">
        </div>
        <div id="login_error" style="color:red; font-size:0.9rem; margin-bottom:10px; display:none;"></div>
        <div class="wfms-btn-row">
            <button class="btn back-btn" onclick="closeWFMSModal('wfmsLoginModal')">Cancel</button>
            <button class="btn upload-btn" id="loginBtn" onclick="doWFMSLogin()">Login & Next</button>
        </div>
    </div>
</div>

<!-- WFMS Station Selection Modal -->
<div id="wfmsStationModal" class="wfms-modal">
    <div class="wfms-modal-content">
        <div class="wfms-modal-header">Select Assigned Station</div>
        <p style="font-size: 0.9rem; color: #666;">Choosing from your WFMS assignments:</p>
        <div class="wfms-form-group">
            <label>Assigned Station</label>
            <select id="wfms_station_select">
                <option value="">Loading assignments...</option>
            </select>
        </div>
        <div id="station_error" style="color:red; font-size:0.9rem; margin-bottom:10px; display:none;"></div>
        <div class="wfms-btn-row">
            <button class="btn back-btn" onclick="closeWFMSModal('wfmsStationModal')">Cancel</button>
            <button class="btn upload-btn" id="pushBtn" onclick="doFinalPush()">Push Report</button>
        </div>
    </div>
</div>

<script>
  let currentReportId = null;
  let currentStationId = null;
  let currentFileName = null;
  let wfmsToken = null;
  let assignedActivities = [];

  function openWFMSLogin(event, reportId, stationId, fileName) {
    if (!navigator.onLine) {
        alert("No internet connection. Please check your connectivity to push to WFMS.");
        return;
    }
    const btn = event ? (event.currentTarget || event.target) : null;
    const tr = btn ? btn.closest('tr') : null;
    currentReportId = reportId || (btn ? btn.getAttribute('data-report-id') : '');
    currentStationId = stationId || (btn ? btn.getAttribute('data-station-id') : '');
    currentFileName = fileName || (tr ? tr.cells[0]?.textContent?.trim() : '');

    if (wfmsToken && assignedActivities && assignedActivities.length > 0) {
        openStationSelection();
    } else {
        document.getElementById('wfmsLoginModal').style.display = 'flex';
    }
  }

  function closeWFMSModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  async function doWFMSLogin() {
    const user = document.getElementById('wfms_user').value;
    const pass = document.getElementById('wfms_pass').value;
    const errorDiv = document.getElementById('login_error');
    const btn = document.getElementById('loginBtn');

    if (!user || !pass) {
        errorDiv.innerText = "Please enter WFMS credentials";
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Connecting...';

    try {
        const response = await fetch('wfms_proxy.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=login&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`
        });
        const result = await response.json();

        if (result.status) {
            wfmsToken = result.data.token;
            closeWFMSModal('wfmsLoginModal');
            openStationSelection();
        } else {
            errorDiv.innerText = result.message || "Invalid WFMS credentials";
            errorDiv.style.display = 'block';
        }
    } catch (e) {
        errorDiv.innerText = "Error connecting to WFMS Server";
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerText = "Login & Next";
    }
  }

  async function openStationSelection() {
    document.getElementById('wfmsStationModal').style.display = 'flex';
    const select = document.getElementById('wfms_station_select');
    select.innerHTML = '<option value="">Fetching your assigned stations...</option>';

    try {
        // Fetch user's assigned activities directly
        const response = await fetch('wfms_proxy.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=get_assignments&token=${wfmsToken}`
        });
        const result = await response.json();

        if (result.status && result.data.data) {
            assignedActivities = result.data.data;
            
            // Extract unique stations from the assigned activities
            const stationsMap = new Map();
            assignedActivities.forEach(act => {
                const stObj = act.station || act.stationId; // Fallback for different API structures
                if (stObj && (stObj._id || stObj.id)) {
                    const id = stObj._id || stObj.id;
                    stationsMap.set(id, {
                        id: id,
                        name: stObj.name || "Unnamed Station",
                        code: stObj.code || ''
                    });
                }
            });

            if (stationsMap.size === 0) {
                select.innerHTML = '<option value="">No active assignments found for you.</option>';
            } else {
                select.innerHTML = '<option value="">-- Choose Assigned Station --</option>';
                stationsMap.forEach((st) => {
                    const opt = document.createElement('option');
                    opt.value = st.id;
                    opt.text = st.name + (st.code ? " (" + st.code + ")" : "");
                    opt.setAttribute('data-station-name', st.name);
                    select.appendChild(opt);
                });
            }
        } else {
            select.innerHTML = '<option value="">Error loading your assignments.</option>';
        }
    } catch (e) {
        select.innerHTML = '<option value="">Connection error.</option>';
    }
  }

  async function doFinalPush() {
    const wfmsStationId = document.getElementById('wfms_station_select').value;
    const errorDiv = document.getElementById('station_error');
    const btn = document.getElementById('pushBtn');

    errorDiv.style.display = 'none';

    if (!wfmsToken) {
        errorDiv.innerText = "Session expired. Please log in to WFMS again.";
        errorDiv.style.display = 'block';
        setTimeout(() => {
            closeWFMSModal('wfmsStationModal');
            document.getElementById('wfmsLoginModal').style.display = 'flex';
        }, 1200);
        return;
    }

    if (!wfmsStationId) {
        errorDiv.innerText = "Please select a valid station from the dropdown.";
        errorDiv.style.display = 'block';
        return;
    }

    try {
        // Verify if "Wayside QA Audit" task exists for the selected station
        const targetActivity = assignedActivities.find(act => {
            const stObj = act.station || act.stationId;
            const stId = stObj ? (stObj._id || stObj.id || stObj) : null;
            const actName = act.name || '';
            return stId === wfmsStationId && actName.toLowerCase().includes('wayside qa audit');
        });

        if (!targetActivity) {
            errorDiv.innerText = "Access Denied: The 'Wayside QA Audit' task for this station is NOT assigned to you in WFMS.";
            errorDiv.style.display = 'block';
            btn.disabled = false;
            btn.innerText = "Push Report";
            return;
        }

        const select = document.getElementById('wfms_station_select');
        const selectedOpt = select.options[select.selectedIndex];
        let stationName = selectedOpt ? selectedOpt.getAttribute('data-station-name') : '';

        if (!stationName) {
            const stObj = targetActivity ? (targetActivity.station || targetActivity.stationId) : null;
            if (typeof stObj === 'string') {
                stationName = stObj;
            } else if (stObj && typeof stObj === 'object') {
                stationName = stObj.name || stObj.stationName || stObj.station_name || '';
            }
        }

        if (!stationName && selectedOpt) {
            const txt = selectedOpt.text.split('(')[0].trim();
            if (txt && !txt.startsWith('--')) {
                stationName = txt;
            }
        }

        if (!stationName || stationName.startsWith('--')) {
            errorDiv.innerText = "Please select a valid station from the dropdown list.";
            errorDiv.style.display = 'block';
            return;
        }

        // 2. Access verified, proceed to upload
        btn.disabled = true;
        btn.innerHTML = '<span class="loader"></span> Uploading...';

        const targetDoc = (targetActivity.outputDocs || []).find(d => d.name === 'Wayside QA Audit Report') || (targetActivity.outputDocs || [])[0];
        const docId = targetDoc ? (targetDoc._id || targetDoc.id || '') : '';

        const formData = new FormData();
        formData.append('reportId', currentReportId || '');
        formData.append('stationId', currentStationId || '');
        formData.append('fileName', currentFileName || '');
        formData.append('wfms_token', wfmsToken || '');
        formData.append('wfms_station_name', stationName);
        formData.append('activityId', targetActivity._id || '');
        formData.append('docId', docId);

        const uploadResponse = await fetch('upload-to-wfms.php', {
            method: 'POST',
            body: formData
        });
        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
            alert("Success: " + uploadResult.message);
            location.reload();
        } else {
            errorDiv.innerText = uploadResult.message;
            errorDiv.style.display = 'block';
            btn.disabled = false;
            btn.innerText = "Push Report";
        }
    } catch (e) {
        errorDiv.innerText = "Error: " + e.message;
        errorDiv.style.display = 'block';
        btn.disabled = false;
        btn.innerText = "Push Report";
    }
  }
</script>

</body>
</html>
