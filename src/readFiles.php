<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Ensure JSON response

try {
    $directory = __DIR__ . '/resources/comments/';
    $messages = [];

    // Check if the directory exists
    if (!is_dir($directory)) {
        throw new Exception('Comments directory does not exist');
    }

    // Get all JSON files in the directory
    $files = glob($directory . '*.json');

    // Read and parse each file
    foreach ($files as $file) {
        $content = file_get_contents($file);
        if ($content === false) {
            throw new Exception('Failed to read file: ' . $file);
        }

        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON in file ' . $file . ': ' . json_last_error_msg());
        }

        // Add the message to the array
        if (isset($data['name']) && isset($data['message'])) {
            $messages[] = $data['name'] . ': ' . $data['message'];
        }
    }

    // Respond with success and the messages
    $response = ['status' => 'success', 'messages' => $messages];
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