<?php
header('Content-Type: application/json');

$repo = "C:\\xampp\\htdocs\\STCAS_QCCHECKLIST";
$git = '"C:\\Program Files\\Git\\bin\\git.exe"';

chdir($repo);

// fetch
exec("$git fetch origin 2>&1", $fetchOutput, $fetchCode);

if ($fetchCode !== 0) {
    echo json_encode([
        "status" => "error",
        "step" => "fetch",
        "output" => $fetchOutput
    ]);
    exit;
}

// compare
$local = trim(shell_exec("$git rev-parse HEAD"));
$remote = trim(shell_exec("$git rev-parse origin/main"));

if ($local === $remote) {
    echo json_encode(["status" => "uptodate"]);
    exit;
}

// pull
exec("$git reset --hard 2>&1", $r1, $c1);
exec("$git clean -fd 2>&1", $r2, $c2);
exec("$git pull origin main 2>&1", $pullOutput, $pullCode);

if ($pullCode === 0) {
    echo json_encode(["status" => "updated"]);
} else {
    echo json_encode([
        "status" => "error",
        "step" => "pull",
        "output" => $pullOutput
    ]);
}