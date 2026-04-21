<?php
header('Content-Type: application/json');

$repo = "C:\\xampp\\htdocs\\STCAS_QCCHECKLIST";
$git = '"C:\\Program Files\\Git\\bin\\git.exe"';

chdir($repo);

exec("$git fetch origin 2>&1", $out, $code);
if ($code !== 0) {
    echo json_encode(["status" => "error"]);
    exit;
}

$local = trim(shell_exec("$git rev-parse HEAD"));
$remote = trim(shell_exec("$git rev-parse origin/main"));

if ($local === $remote) {
    echo json_encode(["status" => "uptodate"]);
    exit;
}

exec("$git reset --hard 2>&1");
exec("$git clean -fd 2>&1");
exec("$git pull origin main 2>&1", $out, $code);

if ($code === 0) {
    echo json_encode(["status" => "updated"]);
} else {
    echo json_encode(["status" => "error"]);
}