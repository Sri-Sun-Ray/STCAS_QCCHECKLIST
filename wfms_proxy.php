<?php
// wfms_proxy.php
// Proxy to handle WFMS API calls from the Checklist UI

ob_start(); // Start buffering to catch any accidental output
header('Content-Type: application/json');

$action = $_POST['action'] ?? '';
$wfmsBaseUrl = "https://eg.hbl.in:5100/api";

if ($action === 'login') {
    $user = $_POST['user'] ?? '';
    $pass = $_POST['pass'] ?? '';

    $ch = curl_init("$wfmsBaseUrl/login");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['username' => $user, 'password' => $pass]));
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'x-app-module: WFMS2'
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    ob_clean(); // Clear any accidental output before sending JSON
    if ($error) {
        echo json_encode(['status' => false, 'message' => "Login Connection Error: $error"]);
    } else {
        echo $response;
    }
    ob_end_flush();
    exit;
}

if ($action === 'get_all_stations') {
    $token = $_POST['token'] ?? '';

    // Fetch all stations from WFMS (Fixed route to /stations)
    $ch = curl_init("$wfmsBaseUrl/stations");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'x-app-module: WFMS2'
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    ob_clean();
    if ($error) {
        echo json_encode(['status' => false, 'message' => "Stations Connection Error: $error"]);
    } else {
        echo $response;
    }
    ob_end_flush();
    exit;
}

if ($action === 'get_assignments') {
    $token = $_POST['token'] ?? '';

    // Fixed: The route is /api/activity/all
    $url = "https://eg.hbl.in:5100/api/activity/all?pageNo=1&pageSize=500&dashboard=1";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Ignore SSL errors on localhost
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'x-app-module: WFMS2'
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    ob_clean();
    if ($error) {
        echo json_encode(['status' => false, 'message' => "Connection Error: $error"]);
    } else {
        echo $response;
    }
    ob_end_flush();
    exit;
}

echo json_encode(['status' => false, 'message' => 'Invalid action']);
?>
