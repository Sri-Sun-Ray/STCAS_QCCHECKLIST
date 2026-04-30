<?php
$conn = mysqli_connect("localhost", "root", "Hbl@1234", "station_info");

// Replace this with a valid station ID from your database if needed
$station_id = '657554';

// Insert Row Template 1
$conn->query("INSERT INTO row_templates (section_id, s_no, description) VALUES ('2_0', '1.65', 'Custom Field Radio A')");
$id1 = $conn->insert_id;

// Insert Row Template 2
$conn->query("INSERT INTO row_templates (section_id, s_no, description) VALUES ('2_0', '1.66', 'Custom Field Radio B')");
$id2 = $conn->insert_id;

$key1 = "template_row_$id1";
$key2 = "template_row_$id2";

// Insert into main table
$conn->query("INSERT INTO verification_of_equipment_serial_numbers 
    (station_id, row_key, S_no, observation_text, barcode_kavach_main_unit, observation_status)
    VALUES 
    ('$station_id', '$key1', '1.65', 'Custom Field Radio A', 'BARCODE-1111', 'Matching'),
    ('$station_id', '$key2', '1.66', 'Custom Field Radio B', 'BARCODE-2222', 'Not Matching')");

echo "<h1>Test Data Inserted Successfully!</h1>";
echo "<p>Custom Row 1 inserted as S_no <strong>1.65</strong> (Key: $key1)</p>";
echo "<p>Custom Row 2 inserted as S_no <strong>1.66</strong> (Key: $key2)</p>";
echo "<hr>";
echo "<p>Now, simply refresh your Serial Number Verification webpage. <code>sync_structure.php</code> will run automatically and push these rows to <strong>1.69</strong> and <strong>1.70</strong>!</p>";
?>
