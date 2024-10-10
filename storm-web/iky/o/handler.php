<?php
error_log("Handler.php accessed");

header("Access-Control-Allow-Origin: https://domain-anda.com");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    error_log("POST request received");
    error_log("POST data: " . print_r($_POST, true));

    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'location':
                $latitude = $_POST['lat'];
                $longitude = $_POST['lon'];
                error_log("Location received: Lat: $latitude, Lon: $longitude");
                $result = saveLocation($latitude, $longitude);
                echo json_encode($result);
                break;
            case 'search':
                $searchTerm = $_POST['searchTerm'];
                $results = searchMissingPersons($searchTerm);
                echo json_encode($results);
                break;
            case 'add':
                $data = $_POST['data'];
                $result = addMissingPerson($data);
                echo json_encode($result);
                break;
        }
    }
}

function saveLocation($latitude, $longitude) {
    $data = date('Y-m-d H:i:s') . " - Lat: $latitude, Lon: $longitude\n";
    $result = file_put_contents('locations.log', $data, FILE_APPEND);
    if ($result === false) {
        error_log("Failed to write to locations.log");
        return ['success' => false, 'message' => 'Gagal menyimpan lokasi'];
    }
    error_log("Location saved successfully");
    return ['success' => true, 'message' => 'Lokasi berhasil disimpan'];
}

function searchMissingPersons($term) {
    // Implementasi pencarian
    // Contoh sederhana:
    $data = json_decode(file_get_contents("missing_persons.json"), true);
    $results = array_filter($data, function($person) use ($term) {
        return stripos($person['name'], $term) !== false;
    });
    return array_values($results);
}

function addMissingPerson($data) {
    // Implementasi penambahan data
    // Contoh sederhana:
    $currentData = json_decode(file_get_contents("missing_persons.json"), true);
    $currentData[] = $data;
    file_put_contents("missing_persons.json", json_encode($currentData));
    return ['success' => true];
}

?>