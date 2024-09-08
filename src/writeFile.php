<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Ensure JSON response

try {
    // Get the JSON input
    $input = file_get_contents('php://input');
    if ($input === false) {
        throw new Exception('Failed to read input');
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input: ' . json_last_error_msg());
    }

    // Extract file name and content
    if (!isset($data['fileName']) || !isset($data['fileContent'])) {
        throw new Exception('Missing fileName or fileContent in input');
    }

    $directory = __DIR__ . '/resources/comments/';
    if (!is_dir($directory)) {
        mkdir($directory, 0777, true); // Create the directory if it doesn't exist
    }

    $fileName = $directory . $data['fileName'];
    $fileContent = $data['fileContent'];
    if (file_put_contents($fileName, $fileContent) === false) {
        throw new Exception('Failed to write to file');
    }

    // Respond with success
    $response = ['status' => 'success', 'message' => 'File written successfully'];
    echo json_encode($response);
} catch (Exception $e) {
    // Log the error
    error_log("Error: " . $e->getMessage());

    // Respond with error
    http_response_code(500);
    $errorResponse = ['status' => 'error', 'message' => $e->getMessage()];
    error_log("Error Response: " . json_encode($errorResponse)); // Log the error response
    echo json_encode($errorResponse);
}
?>