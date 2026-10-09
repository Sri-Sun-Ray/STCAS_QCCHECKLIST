<?php
// Test script to check all cURL options against WFMS API endpoints
$wfmsBaseUrl = "https://eg.hbl.in:5100/api";
$dummyPdf = __DIR__ . '/dummy.pdf';
if (!file_exists($dummyPdf)) {
    file_put_contents($dummyPdf, "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 0\n/Kids []\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF");
}

function testCurlUpload($url, $fields, $headers) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_FORBID_REUSE, true);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $start = microtime(true);
    $response = curl_exec($ch);
    $duration = round(microtime(true) - $start, 3);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $responseCode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    curl_close($ch);

    return [
        'httpCode' => $httpCode,
        'responseCode' => $responseCode,
        'errno' => $errno,
        'err' => $err,
        'duration' => $duration,
        'response' => $response
    ];
}

echo "Testing /station-file with optimized headers...\n";
$fields = [
    'stationName' => 'GAMBHIRI ROAD',
    'activityName' => 'Wayside QA Audit',
    'fileName' => 'Wayside QA Audit Report',
    'file' => new CURLFile($dummyPdf, 'application/pdf', 'dummy.pdf')
];
$headers = [
    'Authorization: Bearer test_token',
    'x-app-module: WFMS2',
    'Expect:'
];

$res = testCurlUpload("$wfmsBaseUrl/station-file", $fields, $headers);
echo "HTTP Code: {$res['httpCode']} (Response Code: {$res['responseCode']}) in {$res['duration']}s\n";
echo "Errno: {$res['errno']} ({$res['err']})\n";
echo "Response: " . substr($res['response'], 0, 200) . "\n\n";

echo "Testing /activity/upload with optimized headers...\n";
$fieldsAct = [
    'activityId' => '643cf6aef7da9f6663fe54e1',
    'docId' => '643cf6aef7da9f6663fe54e2',
    'file' => new CURLFile($dummyPdf, 'application/pdf', 'dummy.pdf')
];
$resAct = testCurlUpload("$wfmsBaseUrl/activity/upload", $fieldsAct, $headers);
echo "HTTP Code: {$resAct['httpCode']} (Response Code: {$resAct['responseCode']}) in {$resAct['duration']}s\n";
echo "Errno: {$resAct['errno']} ({$resAct['err']})\n";
echo "Response: " . substr($resAct['response'], 0, 200) . "\n";
