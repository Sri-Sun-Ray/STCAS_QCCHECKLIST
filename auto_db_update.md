# 📘 From `collectTableData()` to Fully Automated DB Sync (Step-by-Step Guide)

This guide starts **exactly from the point where you already created `collectTableData()`** and shows how to complete the system.

---

## 🎯 Goal

* ❌ No Update button
* ✅ Auto-save when user edits
* ✅ Auto-sync DB when structure changes (deployment)
* ✅ No data mismatch / negative points

---

## ✅ Step 0 — You already have this

```javascript
function collectTableData(){
  const rows = document.querySelectorAll("#observations-tbody-2_0 tr");

  let data = [];

  rows.forEach((row) =>{
    const row_key = row.getAttribute("data-key");

    const sno = row.querySelector(".sno")?.innerText || "";
    const barcode = row.querySelector("input")?.value || "";
    const status = row.querySelector("select")?.value || "";
    const remarks = row.querySelector("textarea")?.value || "";

    data.push({
      row_key,
      sno,
      barcode,
      status,
      remarks
    });
  });

  return data;
}
```

✔ Good. This only **collects data**.
👉 Next we must **send it to DB automatically**

---

## ✅ Step 1 — Add Auto Save Function

```javascript
let saveTimer;

function autoSaveToDB() {

  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {

    const tableData = collectTableData();

    fetch("update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        station_id: document.getElementById("station-id").value,
        rows: tableData
      })
    })
    .then(res => res.text())
    .then(data => {
      console.log("Auto saved:", data);
    });

  }, 1000); // delay to avoid too many calls
}
```

---

## ✅ Step 2 — Trigger Auto Save (No Button Needed)

Modify your existing listeners:

```javascript
document.addEventListener("input", function (event) {
  if (event.target.matches("input, textarea")) {
    autoSaveToDB();
  }
});

document.addEventListener("change", function (event) {
  if (event.target.matches("select")) {
    autoSaveToDB();
  }
});
```

👉 Now DB updates automatically when user edits

---

## ✅ Step 3 — Create Backend File

Create:

```text
update.php
```

---

### Add this code:

```php
<?php

$conn = mysqli_connect("localhost", "root", "", "your_db");

$data = json_decode(file_get_contents("php://input"), true);

$station_id = $data['station_id'];
$rows = $data['rows'];

foreach ($rows as $row) {

    $row_key = $row['row_key'];
    $sno = $row['sno'];
    $barcode = $row['barcode'];
    $status = $row['status'];
    $remarks = $row['remarks'];

    mysqli_query($conn, "
        UPDATE your_table SET 
        S_no='$sno',
        barcode_kavach_main_unit='$barcode',
        observation_status='$status',
        remarks='$remarks'
        WHERE station_id='$station_id'
        AND row_key='$row_key'
    ");
}

echo "success";
?>
```

---

## ✅ Step 4 — Handle Structure Changes (IMPORTANT)

Create:

```text
sync_structure.php
```

---

### Add:

```php
<?php

$conn = mysqli_connect("localhost", "root", "", "your_db");

$master_rows = [
  "stationary-kavach-unit",
  "ppc_1",
  "ppc_2",
  "vcc_1",
  "vcc_2"
];

$stations = mysqli_query($conn, "SELECT DISTINCT station_id FROM your_table");

while ($station = mysqli_fetch_assoc($stations)) {

    $station_id = $station['station_id'];

    foreach ($master_rows as $index => $key) {

        $sno = "1." . ($index + 1);

        $check = mysqli_query($conn, "
            SELECT id FROM your_table 
            WHERE station_id='$station_id' 
            AND row_key='$key'
        ");

        if (mysqli_num_rows($check) == 0) {
            mysqli_query($conn, "
                INSERT INTO your_table (station_id, row_key, S_no)
                VALUES ('$station_id', '$key', '$sno')
            ");
        } else {
            mysqli_query($conn, "
                UPDATE your_table 
                SET S_no='$sno'
                WHERE station_id='$station_id'
                AND row_key='$key'
            ");
        }
    }

    $keys = "'" . implode("','", $master_rows) . "'";

    mysqli_query($conn, "
        DELETE FROM your_table 
        WHERE station_id='$station_id'
        AND row_key NOT IN ($keys)
    ");
}

echo "Sync complete";
?>
```

---

## ✅ Step 5 — Run Sync Automatically

### Option 1 (manual after deployment)

Open:

```text
http://localhost/your_project/sync_structure.php
```

---

### Option 2 (auto on page load)

```javascript
window.addEventListener("load", function () {
  fetch("sync_structure.php");
});
```

---

## 🎯 Final Behavior

| Action              | Result           |
| ------------------- | ---------------- |
| User edits input    | Auto saved       |
| Dropdown change     | Auto saved       |
| Add row (deploy)    | Auto added in DB |
| Delete row (deploy) | Auto removed     |
| No button needed    | ✅                |

---

## 🧠 Final Architecture

* `row_key` → identity (fixed)
* `S_no` → recalculated (display)
* `collectTableData()` → reads UI
* `autoSaveToDB()` → sends data
* `sync_structure.php` → handles structure

---

## 🚀 End Result

✔ Fully automatic system
✔ No manual update
✔ No data mismatch
✔ No negative points issue

---
