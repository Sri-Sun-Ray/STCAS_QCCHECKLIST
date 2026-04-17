@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: =========================
:: CONFIG
:: =========================
set "REPO_PATH=C:\xampp\htdocs\STCAS_QCCHECKLIST"
set "BRANCH=main"
set "REMOTE=origin"
set "LOG_FILE=%REPO_PATH%\auto-update.log"
set "LOCK_FILE=%REPO_PATH%\.update.lock"
set "GIT_EXE=git"

:: =========================
:: LOG FUNCTION
:: =========================
call :log "---------------- START ----------------"

:: Check repo path
if not exist "%REPO_PATH%" (
    call :log "ERROR: Repo path does not exist: %REPO_PATH%"
    goto :end
)

cd /d "%REPO_PATH%" || (
    call :log "ERROR: Failed to enter repo path."
    goto :end
)

:: Prevent overlapping runs
if exist "%LOCK_FILE%" (
    call :log "INFO: Another update process is already running. Exiting."
    goto :end
)

echo running > "%LOCK_FILE%"

:: Check if this is a git repo
%GIT_EXE% rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    call :log "ERROR: This folder is not a git repository."
    goto :cleanup
)

:: Check remote connectivity / internet silently
%GIT_EXE% ls-remote %REMOTE% >nul 2>&1
if errorlevel 1 (
    call :log "INFO: Remote not reachable or no internet. Skipping update."
    goto :cleanup
)

:: Fetch latest refs
%GIT_EXE% fetch %REMOTE% --prune >nul 2>&1
if errorlevel 1 (
    call :log "ERROR: git fetch failed."
    goto :cleanup
)

:: Get local commit
for /f %%i in ('%GIT_EXE% rev-parse HEAD 2^>nul') do set "LOCAL_COMMIT=%%i"
if not defined LOCAL_COMMIT (
    call :log "ERROR: Could not read local commit id."
    goto :cleanup
)

:: Get remote commit
for /f %%i in ('%GIT_EXE% rev-parse %REMOTE%/%BRANCH% 2^>nul') do set "REMOTE_COMMIT=%%i"
if not defined REMOTE_COMMIT (
    call :log "ERROR: Could not read remote commit id for %REMOTE%/%BRANCH%."
    goto :cleanup
)

call :log "INFO: Local commit  = !LOCAL_COMMIT!"
call :log "INFO: Remote commit = !REMOTE_COMMIT!"

:: If same, do nothing
if /i "!LOCAL_COMMIT!"=="!REMOTE_COMMIT!" (
    call :log "INFO: Already up to date."
    goto :cleanup
)

:: Check for local uncommitted changes
set "HAS_CHANGES="
for /f "delims=" %%i in ('%GIT_EXE% status --porcelain 2^>nul') do (
    set "HAS_CHANGES=1"
    goto :changes_found
)

:changes_found
if defined HAS_CHANGES (
    call :log "WARNING: Local uncommitted changes found. Skipping pull to avoid conflicts."
    goto :cleanup
)

:: Ensure fast-forward only
%GIT_EXE% merge-base --is-ancestor HEAD %REMOTE%/%BRANCH% >nul 2>&1
if errorlevel 1 (
    call :log "WARNING: Local branch has diverged from remote. Skipping pull."
    goto :cleanup
)

call :log "INFO: Update found. Pulling latest code..."

%GIT_EXE% pull --ff-only %REMOTE% %BRANCH% >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    call :log "ERROR: git pull failed."
    goto :cleanup
)

call :log "SUCCESS: Repository updated successfully."

goto :cleanup

:: =========================
:: CLEANUP
:: =========================
:cleanup
if exist "%LOCK_FILE%" del /f /q "%LOCK_FILE%" >nul 2>&1

:end
call :log "---------------- END ----------------"
endlocal
exit /b 0

:: =========================
:: LOG SUBROUTINE
:: =========================
:log
set "ts=%date% %time%"
>> "%LOG_FILE%" echo [%ts%] %~1
exit /b