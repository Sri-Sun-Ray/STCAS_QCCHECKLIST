<?php
ob_start();
session_start();
set_time_limit(180); // 3 minutes total execution limit for PDF uploads
ini_set('memory_limit', '256M');
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json');

// Shutdown handler to convert fatal PHP errors or timeouts into valid JSON responses
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) ob_clean();
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'message' => 'PHP Fatal Error: ' . $error['message'] . ' in ' . basename($error['file']) . ' line ' . $error['line']
        ]);
    }
});

// Define WFMS Constants as per Requirement
define("WFMS_ACTIVITY", "Wayside QA Audit");
define("WFMS_FILE", "Wayside QA Audit Report");

function sendJsonResponse($data) {
    if (ob_get_length()) ob_clean();
    http_response_code(200);
    echo json_encode($data);
    exit;
}

// Ensure user is logged in
if (!isset($_SESSION['username'])) {
    sendJsonResponse(['success' => false, 'message' => 'Unauthorized access. Please log in.']);
}

$reportId = $_POST['reportId'] ?? null;
$stationId = $_POST['stationId'] ?? null;
$reportFileName = $_POST['fileName'] ?? $_POST['file_name'] ?? null;

// WFMS Base URL
$wfmsBaseUrl = "https://eg.hbl.in:5100/api"; 

// Get data from Frontend
$wfmsToken = $_POST['wfms_token'] ?? '';
$wfmsStationName = $_POST['wfms_station_name'] ?? '';

if (!$wfmsToken || !$wfmsStationName || $wfmsStationName === 'undefined') {
    sendJsonResponse(['success' => false, 'message' => 'WFMS Authentication or Station selection missing. Please select a station from the dropdown.']);
}

try {
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=station_info", 'root', 'Hbl@1234');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Get Report Details (try by reportId, fallback to fileName)
    $report = null;
    if ($reportId && $reportId !== 'undefined' && $reportId !== 'null' && $reportId !== '') {
        $stmt = $pdo->prepare("SELECT id, file_name, last_uploaded_hash FROM report WHERE id = :id");
        $stmt->execute(['id' => $reportId]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$report && $reportFileName) {
        $stmt = $pdo->prepare("SELECT id, file_name, last_uploaded_hash FROM report WHERE file_name = :fname");
        $stmt->execute(['fname' => $reportFileName]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$report) {
        sendJsonResponse(['success' => false, 'message' => 'Report not found in local database.']);
    }

    $reportId = $report['id'];

    $filePath = 'uploads/reports/' . $report['file_name'];
    if (!file_exists($filePath) || !realpath($filePath)) {
        sendJsonResponse(['success' => false, 'message' => 'Report file found in DB but missing on disk: ' . $report['file_name']]);
    }

    $activityId = $_POST['activityId'] ?? null;
    $docId = $_POST['docId'] ?? null;

    // 1. Direct Activity Document Upload (Advances WFMS Portal UI Revision)
    $actUploadRes = null;
    if ($activityId && $docId && $activityId !== 'undefined' && $docId !== 'undefined' && $activityId !== 'null' && $docId !== 'null') {
        $actFields = [
            "activityId" => $activityId,
            "docId" => $docId
        ];
        $actUploadRes = uploadWithUserToken("$wfmsBaseUrl/activity/upload", $actFields, $filePath, $wfmsToken);
    }

    // 2. Station File Record Linkage
    $fields = [
        "stationName" => $wfmsStationName,
        "activityName" => WFMS_ACTIVITY, // "Wayside QA Audit"
        "fileName" => WFMS_FILE       // "Wayside QA Audit Report"
    ];
    $stationUploadRes = uploadWithUserToken("$wfmsBaseUrl/station-file", $fields, $filePath, $wfmsToken);

    $isSuccess = ($actUploadRes && isset($actUploadRes['status']) && $actUploadRes['status']) ||
                 ($stationUploadRes && isset($stationUploadRes['status']) && $stationUploadRes['status']);

    if ($isSuccess) {
        // 3. Update local record
        $localHash = hash_file('sha256', $filePath);
        $updateStmt = $pdo->prepare("UPDATE report SET last_uploaded_hash = :hash WHERE id = :id");
        $updateStmt->execute(['hash' => $localHash, 'id' => $reportId]);
        
        sendJsonResponse(['success' => true, 'message' => 'Report pushed to WFMS Wayside activity successfully!']);
    } else {
        $errorMsg = ($stationUploadRes['message'] ?? null) ?: ($actUploadRes['message'] ?? 'WFMS rejected the upload.');
        sendJsonResponse(['success' => false, 'message' => "WFMS Error: $errorMsg"]);
    }

} catch (PDOException $e) {
    sendJsonResponse(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Throwable $t) {
    sendJsonResponse(['success' => false, 'message' => 'Server error: ' . $t->getMessage()]);
}

/**
 * Helper: Upload file to WFMS using User Token
 * Configured with forced HTTP 1.1, dedicated connection, and strict header handling to prevent stalls or HTTP 100 errors.
 */
function uploadWithUserToken($url, $fields, $filePath, $token) {
    $ch = curl_init($url);
    $realPath = realpath($filePath);
    if (!$realPath) {
        return ['status' => false, 'message' => 'File path invalid'];
    }
    $fields['file'] = new CURLFile($realPath, 'application/pdf', basename($filePath));

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    // Crucial socket & HTTP settings to prevent cURL hangs / socket buffering / HTTP 100 bugs on Express/multer
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, true);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'x-app-module: WFMS2',
        'Expect:'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    // Fallback if cURL captures intermediate 100 Continue status code
    if ($httpCode === 100 || $httpCode === 0) {
        $respCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        if ($respCode > 0) {
            $httpCode = $respCode;
        }
    }
    
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    curl_close($ch);

    // Write debug log for tracking exact server communication
    $logMsg = "[" . date('Y-m-d H:i:s') . "] POST $url\n";
    $logMsg .= "Fields: " . json_encode(array_diff_key($fields, ['file' => 1])) . "\n";
    $logMsg .= "File: " . $realPath . "\n";
    $logMsg .= "HTTP Code: $httpCode\n";
    $logMsg .= "cURL Errno ($errno): " . ($err ?: "None") . "\n";
    $logMsg .= "Response: " . $response . "\n";
    $logMsg .= "----------------------------------------\n";
    @file_put_contents(__DIR__ . '/wfms_debug.log', $logMsg, FILE_APPEND);

    if ($errno || $httpCode === 0 || $response === false) {
        $errorDetail = $err ?: "Network connection lost or request timed out.";
        if ($errno === CURLE_OPERATION_TIMEDOUT) {
            $errorDetail = "WFMS Server timed out after 60 seconds. The server at eg.hbl.in:5100 took too long to process the report.";
        }
        return ['status' => false, 'message' => "WFMS Connection Failed (HTTP $httpCode): $errorDetail"];
    }

    $decoded = json_decode($response, true);
    if (!is_array($decoded)) {
        return ['status' => false, 'message' => "Invalid response from WFMS (HTTP $httpCode): " . strip_tags($response)];
    }
    return $decoded;
}
?>
