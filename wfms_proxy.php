<?php
// wfms_proxy.php
// Proxy to handle WFMS API calls from the Checklist UI

ob_start(); // Start buffering to catch any accidental output
header('Content-Type: application/json');

$action = $_POST['action'] ?? '';
$wfmsBaseUrl = "https://wfms.upskill365.com/api";

if ($action === 'login') {
    $user = $_POST['user'] ?? '';
    $pass = $_POST['pass'] ?? '';
    
    $ch = curl_init("$wfmsBaseUrl/login");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['username' => $user, 'password' => $pass]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'x-app-module: WFMS2'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    ob_end_clean(); // Clear everything else and only keep the result
    if ($error) {
        echo json_encode(['status' => false, 'message' => "Login Connection Error: $error"]);
    } else {
        echo $response;
    }
    exit;
}

if ($action === 'get_all_stations') {
    $token = $_POST['token'] ?? '';
    
    // Fetch all stations from WFMS (Fixed route to /stations)
    $ch = curl_init("$wfmsBaseUrl/stations");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'x-app-module: WFMS2'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    ob_end_clean();
    if ($error) {
        echo json_encode(['status' => false, 'message' => "Stations Connection Error: $error"]);
    } else {
        echo $response;
    }
    exit;
}

if ($action === 'get_assignments') {
    $token = $_POST['token'] ?? '';
    
    // Fixed: The route is /api/activity/all
    $url = "https://wfms.upskill365.com/api/activity/all?pageNo=1&pageSize=500&dashboard=1";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Ignore SSL errors on localhost
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'x-app-module: WFMS2'
    ]);
    
    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    ob_end_clean();
    if ($error) {
        echo json_encode(['status' => false, 'message' => "Connection Error: $error"]);
    } else {
        echo $response;
    }
    exit;
}

echo json_encode(['status' => false, 'message' => 'Invalid action']);
?>
