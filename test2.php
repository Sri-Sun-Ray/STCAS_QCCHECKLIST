<?php
$sectionRows = [
  ['S_no' => '2.1', 'observation_status' => 'Ok'],
  ['S_no' => '2.2', 'observation_status' => 'Ok'],
  ['S_no' => '2.3', 'observation_status' => 'Ok'],
];

$base = 1;
$closed = 0;

foreach($sectionRows as $obs) {
  if (in_array(trim($obs['observation_status']), ['Ok'])) $closed++;
}

$customCount = 0; // because 2.1-2.3 are in baseline
$total = $base + $customCount;

echo "Total: $total\n";
echo "Closed: $closed\n";
echo "Open: " . ($total - $closed) . "\n";
?>
