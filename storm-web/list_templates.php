<?php

$files = scandir("./iky");

echo json_encode(array_slice($files,2));



?>
