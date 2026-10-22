<?php
header('Content-Type: application/json');

putenv('GIT_TERMINAL_PROMPT=0');
putenv('GIT_ASKPASS=echo');

$repo = "C:\\xampp\\htdocs\\STCAS_QCCHECKLIST";

// Dynamically locate git executable
$git = null;
$candidates = [
    'git',
    'C:\\Users\\Sushma\\AppData\\Local\\Programs\\Git\\cmd\\git.exe',
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files (x86)\\Git\\cmd\\git.exe'
];
foreach ($candidates as $cand) {
    @exec("\"$cand\" --version 2>&1", $candOut, $candCode);
    if ($candCode === 0) {
        $git = "\"$cand\"";
        break;
    }
}

if (!$git) {
    echo json_encode(["status" => "uptodate", "message" => "Git not found in PATH or standard paths."]);
    exit;
}

if (!is_dir($repo . '\\.git')) {
    echo json_encode(["status" => "uptodate", "message" => "No git repository found."]);
    exit;
}

chdir($repo);

$safeRepo = str_replace('\\', '/', $repo);
exec("$git config --global --add safe.directory $safeRepo");

$currentBranch = trim(shell_exec("$git rev-parse --abbrev-ref HEAD"));
if (!$currentBranch) {
    $currentBranch = 'develop';
}

exec("$git fetch origin $currentBranch 2>&1", $fetchOutput, $fetchCode);

if ($fetchCode !== 0) {
    // If fetch failed (e.g. offline/no internet), do not disrupt user with error banner
    echo json_encode([
        "status" => "uptodate",
        "message" => "Could not fetch updates from origin.",
        "debug" => $fetchOutput
    ]);
    exit;
}

$local = trim(shell_exec("$git rev-parse HEAD"));
$remote = trim(shell_exec("$git rev-parse origin/$currentBranch"));

if ($local === $remote) {
    echo json_encode(["status" => "uptodate"]);
    exit;
}

$backupDir = __DIR__ . '/backups';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0777, true);
}
$filename = $backupDir . '/auto_backup_' . date('Ymd_His') . '.sql';
$mysqldump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
if (file_exists($mysqldump)) {
    exec("\"$mysqldump\" -u root -pHbl@1234 station_info > \"$filename\"");
}

$commitBefore = trim(shell_exec("$git rev-parse HEAD"));

exec("$git reset --hard 2>&1", $r1, $c1);
exec("$git clean -fd 2>&1", $r2, $c2);
exec("$git pull origin $currentBranch 2>&1", $pullOutput, $pullCode);

$commitAfter = trim(shell_exec("$git rev-parse HEAD"));

if ($pullCode === 0) {
    if ($commitBefore !== $commitAfter) {
        $backupDir = __DIR__ . '/backups';
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0777, true);
        }
        $filename = $backupDir . '/auto_backup_' . date('Ymd_His') . '.sql';
        $mysqldump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
        if (file_exists($mysqldump)) {
            exec("\"$mysqldump\" -u root -pHbl@1234 station_info > \"$filename\"");
        }

        ob_start();
        if (file_exists('db_migration.php')) {
            include 'db_migration.php';
        }
        ob_end_clean();

        echo json_encode(["status" => "updated"]);
    } else {
        echo json_encode(["status" => "uptodate"]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "step" => "pull",
        "output" => $pullOutput
    ]);
}
?>