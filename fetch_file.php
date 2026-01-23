<?php
session_start();

if(!isset($_SESSION['token'])){
    die("Not logged in");
}

$locoFileUrl = "https://eg.hbl.in/wfms/account/activities/details/yourfile.db"; // Replace dynamically
$localPath = "uploads/yourfile.db";

$headers = [
    "Authorization: Bearer ".$_SESSION['token'],
    "x-app-client: Wizard"
];

$ch = curl_init($locoFileUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($ch);
curl_close($ch);

if($response) {
    file_put_contents($localPath, $response);
    echo "File downloaded successfully!";
} else {
    echo "Failed to download file.";
}
?>
