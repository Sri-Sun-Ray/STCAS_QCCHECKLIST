<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Ensure user is logged in
if (!isset($_SESSION['username'])) {
    die("Unauthorized access. Please log in.");
}

$username = $_SESSION['username'] ?? '';
$employee_name = $_SESSION['employee_name'] ?? 'Unknown Employee';
$role = $_SESSION['role'] ?? 'user';

require_once __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Smalot\PdfParser\Parser;

// Diagnostic logger - Item 2e: Write diagnostics to storage/summary_debug.log
function logSummaryDebug($message) {
    $dir = __DIR__ . '/storage';
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    $logFile = $dir . '/summary_debug.log';
    $time = date('Y-m-d H:i:s');
    @file_put_contents($logFile, "[{$time}] {$message}\n", FILE_APPEND);
}

logSummaryDebug("Summary Report generation initiated by user: {$username} (Role: {$role})");

// Get optional search / system filter from GET query parameter
$searchFilter = isset($_GET['search']) ? trim($_GET['search']) : '';

// Database Connection - REUSE EXACT QUERY AS LIST PAGE
try {
    $pdo = new PDO("mysql:host=localhost;dbname=station_info", 'root', 'Hbl@1234');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($role === 'admin') {
        $sqlQuery = "SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id 
                               FROM report 
                               ORDER BY upload_date DESC";
        $stmt = $pdo->prepare($sqlQuery);
        $stmt->execute();
    } else {
        $sqlQuery = "SELECT id, file_name, upload_date, DATE_FORMAT(upload_date, '%H:%i') AS upload_time, user_id 
                               FROM report 
                               WHERE user_id = :username 
                               ORDER BY upload_date DESC";
        $stmt = $pdo->prepare($sqlQuery);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
    }

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    logSummaryDebug("Fetched " . count($reports) . " total reports from database.");
} catch (PDOException $e) {
    logSummaryDebug("Database Error: " . $e->getMessage());
    die("Database Error: " . $e->getMessage());
}

function normalizeStationName($raw) {
    $name = trim($raw);
    $name = strtoupper($name);
    // Normalize station names by stripping trailing " OC" or "OC"
    $name = preg_replace('/\s+OC$/i', '', $name);
    $name = preg_replace('/OC$/i', '', $name);
    return trim($name);
}

// 1. Group and filter reports
$groupedReports = [];

foreach ($reports as $r) {
    $fileName = $r['file_name'];

    // Match exact Status "Not Completed" logic from viewReports.php:
    preg_match('/_Report_([^_]+)_Version[\w-]+\.(pdf)$/i', $fileName, $statusMatch);
    $statusCaptured = isset($statusMatch[1]) ? trim($statusMatch[1]) : '';
    $statusText = strtolower($statusCaptured);

    // Rule 1: Use only reports with Status = "Not Completed". Ignore Completed ones.
    if ($statusText === 'completed') {
        continue;
    }

    // Extract station name, date, version
    $stationName = '';
    $version = 1;

    if (preg_match('/^(.*?)_([0-9]{4}-[0-9]{2}-[0-9]{2})_Report_.*_Version-?(\d+)/i', $fileName, $m)) {
        $stationName = $m[1];
        $version = (int)$m[3];
    } elseif (preg_match('/^([^_]+)/', $fileName, $m)) {
        $stationName = $m[0];
    }

    $normName = normalizeStationName($stationName);
    if (empty($normName)) {
        continue;
    }

    $uploadTimestamp = strtotime($r['upload_date']);
    $groupedReports[$normName][] = [
        'id' => $r['id'],
        'file_name' => $fileName,
        'raw_station' => $stationName,
        'norm_station' => $normName,
        'upload_date' => $r['upload_date'],
        'timestamp' => $uploadTimestamp,
        'version' => $version
    ];
}

// Edge case: No Not Completed reports found -> Render INSIDE normal page layout with header
if (empty($groupedReports)) {
    logSummaryDebug("No 'Not Completed' reports found.");
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Summary Report - HBL Engineering Ltd.</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; }
        h1, h2 { text-align: center; margin: 0; }
        .container { padding: 20px; }
        .profile { position: absolute; right: 20px; color: white; font-size: 14px; }
        .btn { padding: 8px 16px; background-color: #6c757d; color: white; text-decoration: none; border-radius: 5px; display: inline-block; }
        .card { background: white; border: 1px solid #ddd; padding: 30px; text-align: center; margin-top: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
      </style>
    </head>
    <body>
    <header style="display: flex; align-items: center; justify-content: center; background-color: #00457C; color: white; padding: 20px; position: relative;">
        <img src="hbl_logo.jpg" alt="HBL Engineering Ltd. Logo" style="position: absolute; left: 20px; height: 50px;">
        <div>
          <h1>HBL Engineering Ltd.</h1>
          <h2>Rail Signaling Division</h2>
        </div>
        <div class="profile">User: <?php echo htmlspecialchars($username); ?> | Employee: <?php echo htmlspecialchars($employee_name); ?></div>
    </header>

    <div class="container">
        <a href="viewReports.php" class="btn">Back to Reports</a>

        <div class="card">
          <h2>No 'Not Completed' Reports Found</h2>
          <p style="color: #666; margin-top: 10px;">There are currently no reports with Status <strong>'Not Completed'</strong> matching your criteria.</p>
        </div>
    </div>
    </body>
    </html>
    <?php
    exit;
}

// Rule 2: Pick LATEST per station (most recent Upload Date + Time, ties broken by highest Version)
$latestReports = [];
foreach ($groupedReports as $normStation => $list) {
    usort($list, function($a, $b) {
        if ($a['timestamp'] !== $b['timestamp']) {
            return $b['timestamp'] - $a['timestamp'];
        }
        return $b['version'] - $a['version'];
    });
    $latestReports[$normStation] = $list[0];
}

ksort($latestReports);
logSummaryDebug("Identified " . count($latestReports) . " unique stations with latest Not Completed reports.");

$obsTables = [
    "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas", "installation_of_kavach_equipment",
    "networking_rack", "ips", "dc_convertor", "pdu", "smocip", "outdoor_cabling", "relay_rack", "riu",
    "laying_of_sectional_ofc_cable", "gps_gsm_antenna", "rfid_tags", "tag_to_tag_distance"
];

// Dynamically fetch actual observation_text (Aspect in reports) from database tables
$dbAspects = [];
foreach ($obsTables as $tbl) {
    try {
        $stmt = $pdo->query("SELECT S_no, observation_text FROM {$tbl} WHERE observation_text IS NOT NULL AND TRIM(observation_text) <> '' GROUP BY S_no, observation_text");
        while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sno = trim($r['S_no']);
            $text = trim(html_entity_decode($r['observation_text'], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $text = strip_tags($text);
            if (!isset($dbAspects[$sno]) && $text !== '') {
                $dbAspects[$sno] = $text;
            }
        }
    } catch (Exception $e) {
        logSummaryDebug("Table {$tbl} aspect fetch error: " . $e->getMessage());
    }
}

// Master Checklist Definitions (Section, S_no, Aspect / Observation text from report)
$checklistMaster = [
    // Section 2: Building
    ['sno' => '2.1', 'section' => '2_Building', 'obs' => 'KAVACH Building Works'],

    // Section 3: Tower
    ['sno' => '3.1', 'section' => '3_Tower', 'obs' => 'Tower Installation'],

    // Section 4.1: PDU
    ['sno' => '4.1.1', 'section' => '4.1_PDU', 'obs' => 'Installation'],
    ['sno' => '4.1.2', 'section' => '4.1_PDU', 'obs' => 'Installation'],
    ['sno' => '4.1.3', 'section' => '4.1_PDU', 'obs' => 'Cabling'],
    ['sno' => '4.1.4', 'section' => '4.1_PDU', 'obs' => 'Cabling'],
    ['sno' => '4.1.5', 'section' => '4.1_PDU', 'obs' => 'Cabling'],
    ['sno' => '4.1.6', 'section' => '4.1_PDU', 'obs' => 'Earthing'],
    ['sno' => '4.1.7', 'section' => '4.1_PDU', 'obs' => 'Earthing'],
    ['sno' => '4.1.8', 'section' => '4.1_PDU', 'obs' => 'Functionality'],

    // Section 4.2: DC-DC Converter
    ['sno' => '4.2.1', 'section' => '4.2_DC-DC Converter', 'obs' => 'Installation'],
    ['sno' => '4.2.2', 'section' => '4.2_DC-DC Converter', 'obs' => 'Cabling'],
    ['sno' => '4.2.3', 'section' => '4.2_DC-DC Converter', 'obs' => 'Earthing'],
    ['sno' => '4.2.4', 'section' => '4.2_DC-DC Converter', 'obs' => 'Earthing'],
    ['sno' => '4.2.5', 'section' => '4.2_DC-DC Converter', 'obs' => 'Functionality'],

    // Section 5.1: Kavach Unit
    ['sno' => '5.1.1', 'section' => '5.1_Kavach unit', 'obs' => 'Installation'],
    ['sno' => '5.1.2', 'section' => '5.1_Kavach unit', 'obs' => 'Cabling'],
    ['sno' => '5.1.3', 'section' => '5.1_Kavach unit', 'obs' => 'Earthing'],
    ['sno' => '5.1.4', 'section' => '5.1_Kavach unit', 'obs' => 'Earthing'],
    ['sno' => '5.1.5', 'section' => '5.1_Kavach unit', 'obs' => 'Termination Unit'],
    ['sno' => '5.1.6', 'section' => '5.1_Kavach unit', 'obs' => 'Termination Unit'],

    // Section 5.2: SMOCIP
    ['sno' => '5.2.1', 'section' => '5.2_SMOCIP', 'obs' => 'Installation'],
    ['sno' => '5.2.2', 'section' => '5.2_SMOCIP', 'obs' => 'Termination Unit'],
    ['sno' => '5.2.3', 'section' => '5.2_SMOCIP', 'obs' => 'Termination Unit'],
    ['sno' => '5.2.4', 'section' => '5.2_SMOCIP', 'obs' => 'Termination Unit'],
    ['sno' => '5.2.5', 'section' => '5.2_SMOCIP', 'obs' => 'Earthing'],
    ['sno' => '5.2.6', 'section' => '5.2_SMOCIP', 'obs' => 'Earthing'],
    ['sno' => '5.2.7', 'section' => '5.2_SMOCIP', 'obs' => 'Functionality'],
    ['sno' => '5.2.8', 'section' => '5.2_SMOCIP', 'obs' => 'Functionality'],
    ['sno' => '5.2.9', 'section' => '5.2_SMOCIP', 'obs' => 'Checksum'],

    // Section 5.3: GPS GSM
    ['sno' => '5.3.1', 'section' => '5.3_GPS GSM', 'obs' => 'Installation'],
    ['sno' => '5.3.2', 'section' => '5.3_GPS GSM', 'obs' => 'Installation'],
    ['sno' => '5.3.3', 'section' => '5.3_GPS GSM', 'obs' => 'Cabling'],
    ['sno' => '5.3.4', 'section' => '5.3_GPS GSM', 'obs' => 'Cabling'],
    ['sno' => '5.3.5', 'section' => '5.3_GPS GSM', 'obs' => 'Cabling'],

    // Section 5.4: RIU
    ['sno' => '5.4.1', 'section' => '5.4_RIU', 'obs' => 'Installation'],
    ['sno' => '5.4.2', 'section' => '5.4_RIU', 'obs' => 'Cabling'],
    ['sno' => '5.4.3', 'section' => '5.4_RIU', 'obs' => 'Cabling'],
    ['sno' => '5.4.4', 'section' => '5.4_RIU', 'obs' => 'Earthing'],
    ['sno' => '5.4.5', 'section' => '5.4_RIU', 'obs' => 'Earthing'],
    ['sno' => '5.4.6', 'section' => '5.4_RIU', 'obs' => 'FDMS Box installation'],

    // Section 5.5: EI
    ['sno' => '5.5.1', 'section' => '5.5_EI', 'obs' => 'Installation'],
    ['sno' => '5.5.2', 'section' => '5.5_EI', 'obs' => 'Cabling'],
    ['sno' => '5.5.3', 'section' => '5.5_EI', 'obs' => 'Earthing'],
    ['sno' => '5.5.4', 'section' => '5.5_EI', 'obs' => 'Earthing'],
    ['sno' => '5.5.5', 'section' => '5.5_EI', 'obs' => 'EI Interface test report'],

    // Section 6.1: RTU
    ['sno' => '6.1.1', 'section' => '6.1_RTU', 'obs' => 'RTU Fixing'],
    ['sno' => '6.1.2', 'section' => '6.1_RTU', 'obs' => 'RTU Fixing'],
    ['sno' => '6.1.3', 'section' => '6.1_RTU', 'obs' => 'RTU Earthing'],
    ['sno' => '6.1.4', 'section' => '6.1_RTU', 'obs' => 'RTU Earthing'],
    ['sno' => '6.1.5', 'section' => '6.1_RTU', 'obs' => 'OFC cable termination'],
    ['sno' => '6.1.6', 'section' => '6.1_RTU', 'obs' => 'OFC cables spliced'],
    ['sno' => '6.1.7', 'section' => '6.1_RTU', 'obs' => '110V Power cable termination'],
    ['sno' => '6.1.8', 'section' => '6.1_RTU', 'obs' => '110V Power cable termination'],
    ['sno' => '6.1.9', 'section' => '6.1_RTU', 'obs' => '110V Power cable termination'],
    ['sno' => '6.1.10', 'section' => '6.1_RTU', 'obs' => 'Cabiling'],
    ['sno' => '6.1.11', 'section' => '6.1_RTU', 'obs' => 'Radio Configuration'],

    // Section 6.2: RF Antenna
    ['sno' => '6.2.1', 'section' => '6.2_RF Antenna Installation', 'obs' => 'RF antenna installation and Audit'],
    ['sno' => '6.2.2', 'section' => '6.2_RF Antenna Installation', 'obs' => 'RF antenna installation and Audit'],

    // Section 7.0: OFC Networking Rack
    ['sno' => '7.1', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Installation'],
    ['sno' => '7.2', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Installation'],
    ['sno' => '7.3', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Cabling'],
    ['sno' => '7.4', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Cabling'],
    ['sno' => '7.5', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Earthing'],
    ['sno' => '7.6', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Earthing'],
    ['sno' => '7.7', 'section' => '7.0_OFC Networking Rack', 'obs' => 'Earthing'],
    ['sno' => '7.8', 'section' => '7.0_OFC Networking Rack', 'obs' => 'FDMS Box Installation in Network Rack'],
    ['sno' => '7.9', 'section' => '7.0_OFC Networking Rack', 'obs' => 'FDMS Box Installation in Network Rack'],
    ['sno' => '7.10', 'section' => '7.0_OFC Networking Rack', 'obs' => 'OFC cable continuity check, after splicing'],

    // Section 8.0: Relay Rack
    ['sno' => '8.1', 'section' => '8.0_Relay Rack', 'obs' => 'Installation'],
    ['sno' => '8.2', 'section' => '8.0_Relay Rack', 'obs' => 'Wiring'],
    ['sno' => '8.3', 'section' => '8.0_Relay Rack', 'obs' => 'Wiring'],
    ['sno' => '8.4', 'section' => '8.0_Relay Rack', 'obs' => 'Wiring'],
    ['sno' => '8.5', 'section' => '8.0_Relay Rack', 'obs' => 'Continuity Test / Bell Test'],
    ['sno' => '8.6', 'section' => '8.0_Relay Rack', 'obs' => 'Earthing'],
    ['sno' => '8.7', 'section' => '8.0_Relay Rack', 'obs' => 'Earthing'],

    // Section 9.0: Earthing
    ['sno' => '9.1', 'section' => '9.0_Earthing', 'obs' => 'Installation'],
    ['sno' => '9.2', 'section' => '9.0_Earthing', 'obs' => 'Earth Resistance Measurement'],
    ['sno' => '9.2.1', 'section' => '9.0_Earthing', 'obs' => 'Earth Resistance Measurement'],
    ['sno' => '9.3', 'section' => '9.0_Earthing', 'obs' => 'Test Reports'],
    ['sno' => '9.4', 'section' => '9.0_Earthing', 'obs' => 'Labeling'],

    // Section 10.0: Indoor Wiring
    ['sno' => '10.1', 'section' => '10_Indoor wiring', 'obs' => 'Redundant cabling'],
    ['sno' => '10.2', 'section' => '10_Indoor wiring', 'obs' => 'SMOCIP'],
    ['sno' => '10.3', 'section' => '10_Indoor wiring', 'obs' => 'No Joints'],
    ['sno' => '10.4', 'section' => '10_Indoor wiring', 'obs' => 'Color Coding'],
    ['sno' => '10.5', 'section' => '10_Indoor wiring', 'obs' => 'Tagging/Labeling'],
    ['sno' => '10.6', 'section' => '10_Indoor wiring', 'obs' => 'Termination & Connection'],

    // Section 11: Outdoor Cabling
    ['sno' => '11.1', 'section' => '11_Outdoor Cabling', 'obs' => 'Cable route plan for OFC & Power cable (Relay Room to Tower)'],
    ['sno' => '11.2', 'section' => '11_Outdoor Cabling', 'obs' => 'Cable route markers'],

    // Section 12: RFID Tag
    ['sno' => '12.1', 'section' => '12_RFID Tag', 'obs' => 'RFID Tag Installation'],
    ['sno' => '12.2', 'section' => '12_RFID Tag', 'obs' => 'RFID Tag Installation'],
    ['sno' => '12.3', 'section' => '12_RFID Tag', 'obs' => 'RFID Tag data Validation and Placement verification'],
    ['sno' => '12.4', 'section' => '12_RFID Tag', 'obs' => 'Verify replacement of RFID Point Tags with the new FRP Tag Mounting Base'],

    // Section 13: Components Inspection
    ['sno' => '13.1', 'section' => '13_Components Inspection', 'obs' => 'Materials Inspection (Which are not Inspected by RDSO or Consignee)'],
];

// If database has specific aspect text for any sno, prioritize the DB aspect
foreach ($checklistMaster as &$mItem) {
    if (isset($dbAspects[$mItem['sno']])) {
        $mItem['obs'] = $dbAspects[$mItem['sno']];
    }
}
unset($mItem);

// Add Section 1: fetch real observation names from DB (e.g. "Stationary Kavach Unit")
// Use a per-S_no canonical text: pick one non-empty observation_text per S_no
$sec1Map = [];
try {
    $sec1Stmt = $pdo->query(
        "SELECT S_no, observation_text
         FROM verification_of_equipment_serial_numbers
         WHERE observation_text IS NOT NULL AND TRIM(observation_text) <> ''
         GROUP BY S_no
         ORDER BY CAST(SUBSTRING_INDEX(S_no, '.', -1) AS UNSIGNED)"
    );
    while ($sec1Row = $sec1Stmt->fetch(PDO::FETCH_ASSOC)) {
        $sno = trim($sec1Row['S_no']);
        $obsText = trim($sec1Row['observation_text']);
        // Decode HTML entities stored in DB (e.g. &amp; -> &)
        $obsText = html_entity_decode($obsText, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $obsText = strip_tags($obsText);
        if (!isset($sec1Map[$sno])) {
            $sec1Map[$sno] = $obsText;
        }
    }
} catch (Exception $e) {
    logSummaryDebug("Section 1 observation_text fetch error: " . $e->getMessage());
}

// Find highest Section 1 index
$maxSec1 = 77;
foreach (array_keys($sec1Map) as $s) {
    $p = explode('.', $s);
    if (isset($p[1]) && (int)$p[1] > $maxSec1) {
        $maxSec1 = (int)$p[1];
    }
}

// For any S_no 1.1–1.max, fall back to DB aspect or numbered label
for ($i = 1; $i <= $maxSec1; $i++) {
    $sno = "1.$i";
    $obsLabel = $sec1Map[$sno] ?? ($dbAspects[$sno] ?? "Equipment serial number verification ($sno)");
    $checklistMaster[] = [
        'sno'     => $sno,
        'section' => '1.0_Serial Number verification',
        'obs'     => $obsLabel
    ];
}

// Build station name -> station_id mapping for database queries
$stationIdMap = [];
try {
    $stmtStations = $pdo->query("SELECT station_id, station_name FROM station");
    while ($stRow = $stmtStations->fetch(PDO::FETCH_ASSOC)) {
        $stNorm = normalizeStationName($stRow['station_name']);
        $stUpper = strtoupper(trim($stRow['station_name']));
        $stationIdMap[$stNorm][] = $stRow['station_id'];
        $stationIdMap[$stUpper][] = $stRow['station_id'];
    }
} catch (Exception $e) {
    logSummaryDebug("Station lookup error: " . $e->getMessage());
}

$obsTables = [
    "verification_of_equipment_serial_numbers", "tower", "rtu", "rf_antennas", "installation_of_kavach_equipment",
    "networking_rack", "ips", "dc_convertor", "pdu", "smocip", "outdoor_cabling", "relay_rack", "riu",
    "laying_of_sectional_ofc_cable", "gps_gsm_antenna", "rfid_tags", "tag_to_tag_distance"
];

$parser = new Parser();
$stationPendingMap = [];
$stationNaMap = [];
$stationDateMap = [];
$skippedReports = [];

// Parse pending and not applicable points from each station's latest report
foreach ($latestReports as $station => $rep) {
    $relPath = 'uploads/reports/' . $rep['file_name'];
    $pdfPath = __DIR__ . '/' . $relPath;
    $uploadDateFormatted = date('d/m/y', $rep['timestamp']);
    $stationDateMap[$station] = $uploadDateFormatted;
    $stationNaMap[$station] = [];

    // 1. Fetch NA (Not Applicable) items from Database
    $rawSt = strtoupper(trim($rep['raw_station']));
    $normSt = $station;
    $matchedIds = [];
    if (isset($stationIdMap[$normSt])) $matchedIds = array_merge($matchedIds, $stationIdMap[$normSt]);
    if (isset($stationIdMap[$rawSt])) $matchedIds = array_merge($matchedIds, $stationIdMap[$rawSt]);
    $matchedIds = array_unique($matchedIds);

    foreach ($matchedIds as $sid) {
        foreach ($obsTables as $tbl) {
            try {
                $q = "SELECT S_no, observation_status FROM {$tbl} WHERE station_id = ?";
                $obsStmt = $pdo->prepare($q);
                $obsStmt->execute([$sid]);
                while ($obsRow = $obsStmt->fetch(PDO::FETCH_ASSOC)) {
                    $stVal = trim($obsRow['observation_status'] ?? '');
                    if (strcasecmp($stVal, 'Not Applicable') === 0 || strcasecmp($stVal, 'NA') === 0 || strcasecmp($stVal, 'N/A') === 0) {
                        $stationNaMap[$station][$obsRow['S_no']] = true;
                    }
                }
            } catch (Exception $e) {}
        }
    }

    $fileExists = file_exists($pdfPath) ? 'Y' : 'N';

    if ($fileExists === 'N') {
        logSummaryDebug("Station {$station}: PDF file missing at path: {$relPath}");
        $skippedReports[] = [
            'file_name' => $rep['file_name'],
            'station' => $station,
            'upload_date' => $rep['upload_date'],
            'path_checked' => $relPath,
            'file_exists' => 'N',
            'reason' => 'Report PDF file not found in uploads directory'
        ];
        continue;
    }

    try {
        $pdf = $parser->parseFile($pdfPath);
        $text = $pdf->getText();

        $expectedTotal = null;
        $pendingSet = [];

        if (($pos = strpos($text, "The following are the pending items")) !== false) {
            $pendingText = substr($text, $pos);
            if (($endPos = strpos($pendingText, "Note :")) !== false) {
                $pendingText = substr($pendingText, 0, $endPos);
            }

            // Extract Expected Total count line if present (e.g. "Total 168")
            if (preg_match('/Total\s+(\d+)/i', $pendingText, $totMatch)) {
                $expectedTotal = (int)$totMatch[1];
            }

            // Strip "Section <number>" title strings to avoid counting section title numbers
            $cleanPendingText = preg_replace('/Section\s+\d+(?:\.\d+)?(?::|\s)/i', '', $pendingText);

            preg_match_all('/\b\d+\.\d+(?:\.\d+)?\b/', $cleanPendingText, $matches);
            $pendingSet = array_flip(array_unique($matches[0]));
        }

        $actualCount = count($pendingSet);

        // Validation Rule D2: Check if actual parsed Open count matches report pending total
        if ($expectedTotal !== null && $actualCount !== $expectedTotal) {
            logSummaryDebug("Station {$station}: Mismatch - Expected {$expectedTotal}, got {$actualCount}");
            $skippedReports[] = [
                'file_name' => $rep['file_name'],
                'station' => $station,
                'upload_date' => $rep['upload_date'],
                'path_checked' => $relPath,
                'file_exists' => 'Y',
                'reason' => "count mismatch (expected {$expectedTotal}, got {$actualCount})"
            ];
            continue;
        }

        logSummaryDebug("Station {$station}: Successfully parsed {$actualCount} pending points.");
        $stationPendingMap[$station] = $pendingSet;

        // 2. Fetch NA (Not Applicable) items from PDF text
        $bodyText = $text;
        if (($pos = strpos($bodyText, "The following are the pending items")) !== false) {
            $bodyText = substr($bodyText, 0, $pos);
        }

        // Section-level NA in PDF (e.g. "2.0 Building (New Building ... Not Applicable")
        // Note: Only Sections 2 to 13 can have full-section Not Applicable collapse. Section 1 (Serial numbers) is NEVER collapsed.
        if (preg_match_all('/(?:^|\n)\s*(?:Section\s+)?([2-9]|1[0-3])\.0\s+[^\r\n]*?Not Applicable/i', $bodyText, $secMatches)) {
            foreach ($secMatches[1] as $secNum) {
                foreach ($checklistMaster as $item) {
                    $parts = explode('.', $item['sno']);
                    if ($parts[0] == $secNum) {
                        $stationNaMap[$station][$item['sno']] = true;
                    }
                }
            }
        }

        // Subsection-level NA in PDF (e.g. "5.5 EI Protocol Converter: Not Applicable")
        if (preg_match_all('/(?:^|\n)\s*(4\.1|4\.2|5\.1|5\.2|5\.3|5\.4|5\.5)[^:\r\n]*:\s*Not Applicable/i', $bodyText, $subMatches)) {
            foreach ($subMatches[1] as $subSec) {
                foreach ($checklistMaster as $item) {
                    if (strpos($item['sno'], $subSec) === 0) {
                        $stationNaMap[$station][$item['sno']] = true;
                    }
                }
            }
        }

        // Row-level NA in PDF (matching individual lines with S_no followed by Not Applicable)
        $bodyLines = explode("\n", $bodyText);
        foreach ($bodyLines as $bLine) {
            if (stripos($bLine, 'Not Applicable') !== false) {
                if (preg_match('/^\s*(\d+\.\d+(?:\.\d+)?)/', $bLine, $rowMatch)) {
                    $matchedSno = $rowMatch[1];
                    // Skip X.0 as section collapse handles whole sections
                    if (!preg_match('/^\d+\.0$/', $matchedSno)) {
                        $stationNaMap[$station][$matchedSno] = true;
                    }
                }
            }
        }

        logSummaryDebug("Station {$station}: Identified " . count($stationNaMap[$station]) . " Not Applicable (NA) points.");
    } catch (Exception $e) {
        logSummaryDebug("Station {$station}: PDF parse exception - " . $e->getMessage());
        $skippedReports[] = [
            'file_name' => $rep['file_name'],
            'station' => $station,
            'upload_date' => $rep['upload_date'],
            'path_checked' => $relPath,
            'file_exists' => 'Y',
            'reason' => 'PDF parse error: ' . $e->getMessage()
        ];
    }
}

$parsedStations = array_keys($stationPendingMap);

// Include all checklist items regardless of Open/Close/NA status
$validRows = [];
$stationOpenTotals = array_fill_keys($parsedStations, 0);
$stationCloseTotals = array_fill_keys($parsedStations, 0);
$stationNaTotals = array_fill_keys($parsedStations, 0);

foreach ($checklistMaster as $item) {
    $sno = $item['sno'];
    $rowStatuses = [];

    foreach ($parsedStations as $st) {
        if (isset($stationPendingMap[$st][$sno])) {
            $rowStatuses[$st] = 'Open';
            $stationOpenTotals[$st]++;
        } elseif (isset($stationNaMap[$st][$sno])) {
            $rowStatuses[$st] = 'NA';
            $stationCloseTotals[$st]++; // NA comes for closed points only
            $stationNaTotals[$st]++;
        } else {
            $rowStatuses[$st] = 'Close';
            $stationCloseTotals[$st]++;
        }
    }

    $item['statuses'] = $rowStatuses;
    $validRows[] = $item;
}

// Rule D1: Sort rows numerically by section number so 1.0 Serial Number verification comes FIRST, then 2, 3... 13
usort($validRows, function($a, $b) {
    $partsA = explode('.', $a['sno']);
    $partsB = explode('.', $b['sno']);

    $mainA = (int)($partsA[0] ?? 0);
    $mainB = (int)($partsB[0] ?? 0);
    if ($mainA !== $mainB) return $mainA - $mainB;

    $subA = (int)($partsA[1] ?? 0);
    $subB = (int)($partsB[1] ?? 0);
    if ($subA !== $subB) return $subA - $subB;

    $subsubA = (int)($partsA[2] ?? 0);
    $subsubB = (int)($partsB[2] ?? 0);
    return $subsubA - $subsubB;
});

// Construct Excel document using PhpSpreadsheet
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setTitle("Site Audit Summary Report");

// Header and Cell Styles
$titleStyle = [
    'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => '00457C']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER]
];

$headerStyle = [
    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '00457C']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
];

$openStyle = [
    'font' => ['bold' => true, 'color' => ['rgb' => '9C0006']],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FFC7CE']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
];

$closeStyle = [
    'font' => ['bold' => true, 'color' => ['rgb' => '006100']],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'C6EFCE']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
];

$naStyle = [
    'font' => ['bold' => true, 'color' => ['rgb' => '595959']],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E0E0E0']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
];

$totalRowStyle = [
    'font' => ['bold' => true, 'size' => 11],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'D9E1F2']],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_MEDIUM]]
];

$numStations = count($parsedStations);
$totalPointsColIndex = 5 + $numStations;
$closedColIndex = 6 + $numStations;
$openColIndex = 7 + $numStations;
$lastColIndex = $openColIndex;

$totalPointsColLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalPointsColIndex);
$closedColLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($closedColIndex);
$openColLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($openColIndex);
$lastColLetter = $openColLetter;

// Title Row — merged ONLY within frozen columns (A:D) so heading does NOT scroll horizontally
$sheet->mergeCells("A1:D1");
$sheet->setCellValue('A1', 'HBL Engineering Ltd. - In-process Site Audit Summary Report');
$sheet->getStyle("A1:D1")->applyFromArray($titleStyle);
$sheet->getStyle("A1:D1")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$sheet->getRowDimension(1)->setRowHeight(28);

// Green bottom border under title row (row 1) — applied across ALL columns so line is visible full-width
$sheet->getStyle("A1:{$lastColLetter}1")->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM);
$sheet->getStyle("A1:{$lastColLetter}1")->getBorders()->getBottom()->getColor()->setRGB('00B050');

// Row 2: Thin green separator bar — fill the entire row green for visibility
$sheet->getRowDimension(2)->setRowHeight(5);
$sheet->getStyle("A2:{$lastColLetter}2")->getFill()->setFillType(Fill::FILL_SOLID);
$sheet->getStyle("A2:{$lastColLetter}2")->getFill()->getStartColor()->setRGB('00B050');

// Row 3: Header Row (station name on line 1, "Uploaded: DD/MM/YY" on line 2)
$sheet->getRowDimension(3)->setRowHeight(40);

$sheet->setCellValue('A3', "Sr. No");
$sheet->setCellValue('B3', "Section");
$sheet->setCellValue('C3', "Serial No");
$sheet->setCellValue('D3', "Observations");

$colIndex = 5;
foreach ($parsedStations as $st) {
    $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
    $upDate = $stationDateMap[$st] ?? '';
    $headerLabel = "{$st}\nUploaded: {$upDate}";
    $sheet->setCellValue("{$colLetter}3", $headerLabel);
    $colIndex++;
}

$sheet->setCellValue("{$totalPointsColLetter}3", "Total points");
$sheet->setCellValue("{$closedColLetter}3", "closed");
$sheet->setCellValue("{$openColLetter}3", "Open");
$sheet->getStyle("A3:{$lastColLetter}3")->applyFromArray($headerStyle);

// Data Rows start directly below header row (Row 4) — row 2 is the green separator
$currRow = 4;
$srNo = 1;

foreach ($validRows as $vr) {
    $sheet->setCellValue("A{$currRow}", $srNo);
    $sheet->setCellValue("B{$currRow}", $vr['section']);
    $sheet->setCellValue("C{$currRow}", $vr['sno']);
    $sheet->setCellValue("D{$currRow}", $vr['obs']);

    $sheet->getStyle("A{$currRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle("C{$currRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $colIndex = 5;
    $rowOpenCount = 0;
    $rowCloseCount = 0;
    $rowNaCount = 0;

    foreach ($parsedStations as $st) {
        $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
        $stVal = $vr['statuses'][$st] ?? 'Close';
        $sheet->setCellValue("{$colLetter}{$currRow}", $stVal);

        if ($stVal === 'Open') {
            $sheet->getStyle("{$colLetter}{$currRow}")->applyFromArray($openStyle);
            $rowOpenCount++;
        } elseif ($stVal === 'NA') {
            $sheet->getStyle("{$colLetter}{$currRow}")->applyFromArray($naStyle);
            $rowCloseCount++; // NA comes for closed points only
            $rowNaCount++;
        } else {
            $sheet->getStyle("{$colLetter}{$currRow}")->applyFromArray($closeStyle);
            $rowCloseCount++;
        }
        $colIndex++;
    }

    $rowTotalPoints = $rowCloseCount + $rowOpenCount;

    $sheet->setCellValue("{$totalPointsColLetter}{$currRow}", $rowTotalPoints);
    $sheet->setCellValue("{$closedColLetter}{$currRow}", $rowCloseCount);
    $sheet->setCellValue("{$openColLetter}{$currRow}", $rowOpenCount);

    $sheet->getStyle("A{$currRow}:{$lastColLetter}{$currRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
    $sheet->getStyle("{$totalPointsColLetter}{$currRow}:{$lastColLetter}{$currRow}")->getFont()->setBold(true);
    $sheet->getStyle("{$totalPointsColLetter}{$currRow}:{$lastColLetter}{$currRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    $currRow++;
    $srNo++;
}

// Grand Totals calculation
$grandTotalClosed = array_sum($stationCloseTotals);
$grandTotalOpen = array_sum($stationOpenTotals);
$grandTotalPoints = $grandTotalClosed + $grandTotalOpen;
$grandTotalPct = $grandTotalPoints > 0 ? (round(($grandTotalClosed / $grandTotalPoints) * 100, 2) . '%') : '0%';

// Summary Row 1: Total points
$sheet->setCellValue("A{$currRow}", '');
$sheet->setCellValue("B{$currRow}", 'Total points');
$sheet->setCellValue("C{$currRow}", '');
$sheet->setCellValue("D{$currRow}", '');
$sheet->mergeCells("B{$currRow}:D{$currRow}");

$colIndex = 5;
foreach ($parsedStations as $st) {
    $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
    $stTotal = ($stationCloseTotals[$st] ?? 0) + ($stationOpenTotals[$st] ?? 0);
    $sheet->setCellValue("{$colLetter}{$currRow}", $stTotal);
    $colIndex++;
}
$sheet->setCellValue("{$totalPointsColLetter}{$currRow}", $grandTotalPoints);
$sheet->setCellValue("{$closedColLetter}{$currRow}", '');
$sheet->setCellValue("{$openColLetter}{$currRow}", '');
$sheet->getStyle("A{$currRow}:{$lastColLetter}{$currRow}")->applyFromArray($totalRowStyle);
$sheet->getRowDimension($currRow)->setRowHeight(22);
$currRow++;

// Summary Row 2: Total closed points
$sheet->setCellValue("A{$currRow}", '');
$sheet->setCellValue("B{$currRow}", 'Total closed points');
$sheet->setCellValue("C{$currRow}", '');
$sheet->setCellValue("D{$currRow}", '');
$sheet->mergeCells("B{$currRow}:D{$currRow}");

$colIndex = 5;
foreach ($parsedStations as $st) {
    $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
    $stClosed = $stationCloseTotals[$st] ?? 0;
    $sheet->setCellValue("{$colLetter}{$currRow}", $stClosed);
    $colIndex++;
}
$sheet->setCellValue("{$totalPointsColLetter}{$currRow}", '');
$sheet->setCellValue("{$closedColLetter}{$currRow}", $grandTotalClosed);
$sheet->setCellValue("{$openColLetter}{$currRow}", '');
$sheet->getStyle("A{$currRow}:{$lastColLetter}{$currRow}")->applyFromArray($totalRowStyle);
$sheet->getRowDimension($currRow)->setRowHeight(22);
$currRow++;

// Summary Row 3: Total open points
$sheet->setCellValue("A{$currRow}", '');
$sheet->setCellValue("B{$currRow}", 'Total open points');
$sheet->setCellValue("C{$currRow}", '');
$sheet->setCellValue("D{$currRow}", '');
$sheet->mergeCells("B{$currRow}:D{$currRow}");

$colIndex = 5;
foreach ($parsedStations as $st) {
    $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
    $stOpen = $stationOpenTotals[$st] ?? 0;
    $sheet->setCellValue("{$colLetter}{$currRow}", $stOpen);
    $colIndex++;
}
$sheet->setCellValue("{$totalPointsColLetter}{$currRow}", '');
$sheet->setCellValue("{$closedColLetter}{$currRow}", '');
$sheet->setCellValue("{$openColLetter}{$currRow}", $grandTotalOpen);
$sheet->getStyle("A{$currRow}:{$lastColLetter}{$currRow}")->applyFromArray($totalRowStyle);
$sheet->getRowDimension($currRow)->setRowHeight(22);
$currRow++;

// Summary Row 4: Total % of completion
$sheet->setCellValue("A{$currRow}", '');
$sheet->setCellValue("B{$currRow}", 'Total % of completion');
$sheet->setCellValue("C{$currRow}", '');
$sheet->setCellValue("D{$currRow}", '');
$sheet->mergeCells("B{$currRow}:D{$currRow}");

$colIndex = 5;
foreach ($parsedStations as $st) {
    $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
    $stClosed = $stationCloseTotals[$st] ?? 0;
    $stOpen = $stationOpenTotals[$st] ?? 0;
    $stTotal = $stClosed + $stOpen;
    $stPct = $stTotal > 0 ? (round(($stClosed / $stTotal) * 100, 2) . '%') : '0%';
    $sheet->setCellValue("{$colLetter}{$currRow}", $stPct);
    $colIndex++;
}
$sheet->setCellValue("{$totalPointsColLetter}{$currRow}", $grandTotalPct);
$sheet->setCellValue("{$closedColLetter}{$currRow}", '');
$sheet->setCellValue("{$openColLetter}{$currRow}", '');
$sheet->getStyle("A{$currRow}:{$lastColLetter}{$currRow}")->applyFromArray($totalRowStyle);
$sheet->getRowDimension($currRow)->setRowHeight(22);

// Freeze panes at E4 — rows 1-3 (title, green separator, header) and cols A-D always visible
$sheet->freezePane('E4');

// Auto-fit column widths
foreach (range(1, $lastColIndex) as $col) {
    $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
    $sheet->getColumnDimension($colLetter)->setAutoSize(true);
}

// Skipped Reports Sheet (Item 2a: Columns - Sr. No, Report File Name, Station Name, Upload Date, Path checked, File exists (Y/N), Reason for Skipping)
if (!empty($skippedReports)) {
    $skipSheet = $spreadsheet->createSheet();
    $skipSheet->setTitle("Skipped reports");
    $skipSheet->setCellValue('A1', 'Sr. No');
    $skipSheet->setCellValue('B1', 'Report File Name');
    $skipSheet->setCellValue('C1', 'Station Name');
    $skipSheet->setCellValue('D1', 'Upload Date');
    $skipSheet->setCellValue('E1', 'Path checked');
    $skipSheet->setCellValue('F1', 'File exists (Y/N)');
    $skipSheet->setCellValue('G1', 'Reason for Skipping');
    $skipSheet->getStyle("A1:G1")->applyFromArray($headerStyle);
    $skipSheet->getRowDimension(1)->setRowHeight(25);

    $sRow = 2;
    foreach ($skippedReports as $idx => $sr) {
        $skipSheet->setCellValue("A{$sRow}", $idx + 1);
        $skipSheet->setCellValue("B{$sRow}", $sr['file_name']);
        $skipSheet->setCellValue("C{$sRow}", $sr['station']);
        $skipSheet->setCellValue("D{$sRow}", $sr['upload_date']);
        $skipSheet->setCellValue("E{$sRow}", $sr['path_checked']);
        $skipSheet->setCellValue("F{$sRow}", $sr['file_exists']);
        $skipSheet->setCellValue("G{$sRow}", $sr['reason']);
        $skipSheet->getStyle("A{$sRow}:G{$sRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
        $sRow++;
    }

    foreach (range('A', 'G') as $col) {
        $skipSheet->getColumnDimension($col)->setAutoSize(true);
    }
}

// Output headers for filename Summary_Report_<System>_<YYYY-MM-DD>.xlsx
$systemName = !empty($searchFilter) ? preg_replace('/[^A-Za-z0-9_-]/', '_', $searchFilter) : 'Wayside_QC_Ratlam';
$todayDate = date('Y-m-d');
$downloadFileName = "Summary_Report_{$systemName}_{$todayDate}.xlsx";

logSummaryDebug("Sending XLSX stream attachment: {$downloadFileName}");

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header("Content-Disposition: attachment; filename=\"{$downloadFileName}\"");
header('Cache-Control: max-age=0');

$spreadsheet->setActiveSheetIndex(0);

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;
