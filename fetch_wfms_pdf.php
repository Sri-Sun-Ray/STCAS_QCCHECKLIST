<?php
session_start();

// ✅ Get session data from your app
$zone        = $_SESSION['zone']        ?? '';
$stationName = $_SESSION['stationName'] ?? '';
$username    = $_SESSION['username']    ?? '';  // stored during login to WFMS
$password    = $_POST['wfms_password']  ?? '';  // entered by user

if (!$username || !$password) {
    die("Missing WFMS login credentials");
}

// WFMS URLs
$loginUrl     = "https://eg.hbl.in/wfms/account/login";
$dashboardUrl = "https://eg.hbl.in/wfms/account/dashboard";

// Temporary cookie file
$cookieFile = tempnam(sys_get_temp_dir(), 'wfms_cookie');

// STEP 1: Log in to WFMS
$loginData = http_build_query([
    'username' => $username,
    'password' => $password,
]);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $loginUrl,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $loginData,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_COOKIEJAR      => $cookieFile,
    CURLOPT_COOKIEFILE     => $cookieFile,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
]);
$response = curl_exec($ch);

// Check login success
if (strpos($response, 'Dashboard') === false && strpos($response, 'dashboard') === false) {
    unlink($cookieFile);
    die("Login to WFMS failed. Check username/password.");
}

// STEP 2: Fetch Dashboard page
curl_setopt_array($ch, [
    CURLOPT_URL            => $dashboardUrl,
    CURLOPT_HTTPGET        => true,
    CURLOPT_RETURNTRANSFER => true,
]);
$dashboardHtml = curl_exec($ch);
curl_close($ch);

// STEP 3: Parse Dashboard HTML for matching row
libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadHTML($dashboardHtml);
$xpath = new DOMXPath($dom);

$rows = $xpath->query("//table//tr");
$pdfUrl = "";

foreach ($rows as $row) {
    $cols = $row->getElementsByTagName("td");
    if ($cols->length < 5) continue;

    $zoneCol     = trim($cols->item(2)->nodeValue ?? "");
    $stationCol  = trim($cols->item(3)->nodeValue ?? "");
    $inputDocs   = trim($cols->item(4)->nodeValue ?? "");

    if (stripos($zoneCol, $zone) !== false &&
        stripos($stationCol, $stationName) !== false &&
        stripos($inputDocs, "RFID TAG DATA") !== false)
    {
        // Action column (last col) usually contains <a href="file.pdf">
        $links = $cols->item($cols->length - 1)->getElementsByTagName("a");
        if ($links->length > 0) {
            $pdfUrl = $links->item(0)->getAttribute("href");
        }
        break;
    }
}

if (!$pdfUrl) {
    unlink($cookieFile);
    die("No RFID TAG DATA document found for $stationName ($zone).");
}

// STEP 4: Download PDF file
if (strpos($pdfUrl, "http") === false) {
    $pdfUrl = "https://eg.hbl.in" . $pdfUrl;
}

$pdfContent = file_get_contents($pdfUrl);
unlink($cookieFile);

if (!$pdfContent) {
    die("Failed to download RFID TAG DATA PDF.");
}

// ✅ Return PDF to frontend
header("Content-Type: application/pdf");
header("Content-Disposition: inline; filename=rfid_tag_data.pdf");
echo $pdfContent;
