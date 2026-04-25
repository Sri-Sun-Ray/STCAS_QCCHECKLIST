# WFMS Upload Workflow

## Overview
This document outlines the step-by-step workflow for the "Upload to WFMS" action on report cards in the dashboard. The goal is to make the process reliable and idempotent.

## Flow: UI (Dashboard) → STCAS (PHP) → WFMS (Node)
1. User clicks "Upload"
2. Check internet
3. Resolve `stationId` → `stationName` (WFMS)
4. Validate file slot (WFMS)
5. Compare version (hash check to avoid duplicate uploads)
6. Upload (WFMS)
7. Show success or "already up-to-date" message

## Step-by-Step Implementation

### 1. Dashboard UI Action
Add an **Upload** action next to View/Edit/Download.
On click, call a PHP endpoint:
```http
POST /upload-to-wfms
```
**Payload:**
```json
{
  "reportId": "RPT123",
  "stationId": "ST001",
  "reportType": "inspection_report"
}
```

### 2. Internet Check
Check connection on the frontend before initiating the request:
```javascript
if (!navigator.onLine) {
  alert("No internet connection");
  return;
}
```
*Note: Still rely on the server (PHP) catching connection errors to the WFMS API, as browser checks can be misleading.*

### 3. Resolve Station ID to Name
Call the WFMS helper API to get the station name:
```http
GET /getStationById?stationId=ST001
```
If not found, stop with a clear message: `"Station not found in WFMS"`.

### 4. Determine Activity & File Name
Keep activity and file name as constants if they are common. If multiple report types exist, map `reportType` to `activityName` and `fileName`.
```php
$activityName = "Inspection"; 
$fileName = "inspection_report.pdf";
```

### 5. Validate File Slot in WFMS
Verify that the destination slot is properly configured in WFMS:
```http
POST /getStationFiles
```
**Payload:**
```json
{
  "stationName": "Station_A",
  "files": [
    {
      "activity": "Inspection",
      "files": ["inspection_report.pdf"]
    }
  ]
}
```
If this returns empty, it indicates a configuration issue (wrong activity/file).

### 6. Prevent Duplicate Uploads
Compute a SHA-256 checksum of the local file and compare it with the last uploaded hash.
```php
$localHash = hash_file('sha256', $filePath);
```
If `$localHash` matches the last uploaded hash, return `"Already up to date"`.

### 7. Upload to WFMS
If the hash differs, proceed with the upload:
```http
POST /postStationFile
```
**Multipart form:**
- `stationName`
- `activityName`
- `fileName`
- `file`

The controller will save the file, increment the revision, and maintain history.

### 8. Update Local Record
Upon successful upload:
- Save the new hash to the local database.
- Optionally store the returned revision number.

## PHP Pseudo-Code Implementation

```php
function uploadToWFMS($reportId, $stationId) {

    // 1. Get station name
    $stationRes = callAPI("GET", "/getStationById?stationId=$stationId");
    if (!$stationRes) return "Station not found";

    $stationName = $stationRes["stationName"];

    // 2. Define constants
    $activityName = "Inspection";
    $fileName = "inspection_report.pdf";

    // 3. Validate slot
    $filesRes = callAPI("POST", "/getStationFiles", [
        "stationName" => $stationName,
        "files" => [[
            "activity" => $activityName,
            "files" => [$fileName]
        ]]
    ]);

    if (empty($filesRes)) return "Invalid activity/file mapping";

    // 4. Check hash
    $filePath = getReportPath($reportId);
    $localHash = hash_file('sha256', $filePath);
    $lastHash = getLastUploadedHash($reportId);

    if ($localHash === $lastHash) {
        return "Already up to date";
    }

    // 5. Upload
    $uploadRes = uploadFile("/postStationFile", [
        "stationName" => $stationName,
        "activityName" => $activityName,
        "fileName" => $fileName
    ], $filePath);

    if ($uploadRes) {
        saveHash($reportId, $localHash);
        return "Uploaded successfully";
    }

    return "Upload failed";
}
```

## Important Edge Cases

> [!WARNING]
> Ensure these edge cases are handled in the final implementation.

- **Station exists in STCAS but not in WFMS:** Show `"Station not configured in WFMS"`.
- **Wrong activity/fileName:** Show `"WFMS configuration mismatch"`.
- **Same file uploaded repeatedly:** Prevent using the hash check mechanism.
- **Network drop during upload:** Implement a retry mechanism or show a retry button to the user.

