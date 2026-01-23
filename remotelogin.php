<?php
session_start();
$url = "https://eg.hbl.in/api/login"; // example API endpoint
$data = [
    "username" => "yourUsername",
    "password" => "yourPassword"
];

$options = [
    "http" => [
        "header" => "Content-type: application/x-www-form-urlencoded\r\n",
        "method" => "POST",
        "content" => http_build_query($data),
        "ignore_errors" => true
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

$result = json_decode($response, true);

if($result['status']) {
    $_SESSION['token'] = $result['data']['token'];
    echo "Logged in successfully!";
} else {
    echo "Login failed: ".$result['message'];
}
?>
