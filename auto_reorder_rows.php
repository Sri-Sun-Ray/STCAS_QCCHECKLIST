<?php
/**
 * auto_reorder_rows.php
 * Use this script when you increase the number of standard rows in script.js / observations.html
 * to automatically shift your existing custom rows forward.
 */

$conn = new mysqli("localhost", "root", "Hbl@1234", "station_info");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// ============================================================
// CONFIGURATION: UPDATE THESE NUMBERS WHEN YOU UPDATE THE CODE
// ============================================================
$OLD_MAX_STANDARD = 64; // The previous number of standard points
$NEW_MAX_STANDARD = 68; // The new number of standard points
$SECTION_PREFIX   = "1."; // Prefix for Section 2.0 (label 1.0)
$SECTION_ID       = "2_0";
// ============================================================

$shift = $NEW_MAX_STANDARD - $OLD_MAX_STANDARD;

if ($shift <= 0) {
    echo "<h3>No shift needed.</h3>";
    echo "New Max ($NEW_MAX_STANDARD) is not greater than Old Max ($OLD_MAX_STANDARD).";
    exit;
}

echo "<h2>Migrating Custom Rows</h2>";
echo "Shifting custom rows by <b>+$shift</b> to make room for new standard points ($OLD_MAX_STANDARD -> $NEW_MAX_STANDARD)...<br><br>";

// 1. Fetch custom rows that need shifting
// We order DESC to avoid primary key collisions if we were updating IDs, 
// though here we are updating S_no which isn't a unique key in these tables.
$sql = "SELECT id, s_no, description FROM row_templates WHERE section_id = ? AND s_no LIKE '$SECTION_PREFIX%' ORDER BY id DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $SECTION_ID);
$stmt->execute();
$result = $stmt->get_result();

$rows_to_shift = [];
while ($row = $result->fetch_assoc()) {
    $parts = explode('.', $row['s_no']);
    if (count($parts) == 2) {
        $num = intval($parts[1]);
        // Only shift rows that fall within the old "custom" range (anything > OLD_MAX)
        if ($num > $OLD_MAX_STANDARD) {
            $rows_to_shift[] = [
                'id' => $row['id'],
                'old_sno' => $row['s_no'],
                'new_sno' => $SECTION_PREFIX . ($num + $shift),
                'desc' => $row['description']
            ];
        }
    }
}

if (empty($rows_to_shift)) {
    echo "No custom rows found that need shifting.";
} else {
    echo "Found " . count($rows_to_shift) . " custom rows to shift:<br><ul>";
    
    foreach ($rows_to_shift as $row) {
        $old = $row['old_sno'];
        $new = $row['new_sno'];
        $id  = $row['id'];
        $desc = $row['desc'];

        echo "<li>Shifting <b>$old</b> ($desc) to <b>$new</b>... ";

        // A. Update row_templates
        $conn->query("UPDATE row_templates SET s_no = '$new' WHERE id = $id");

        // B. Update observations (verification_of_equipment_serial_numbers)
        $conn->query("UPDATE verification_of_equipment_serial_numbers SET S_no = '$new' WHERE S_no = '$old'");

        // C. Update images table
        $conn->query("UPDATE images SET s_no = '$new' WHERE s_no = '$old'");
        
        echo "<span style='color: green;'>Done</span></li>";
    }
    echo "</ul>";
}

$conn->close();
echo "<br><b style='color: blue;'>Reordering Completed Successfully!</b><br>";
echo "You can now refresh your checklist page.";
?>
