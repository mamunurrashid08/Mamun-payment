<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get data from request
$input = json_decode(file_get_contents('php://input'), true);

// Extract parameters
$api_key = $input['api_key'] ?? '';
$phone = $input['contacts'] ?? '';
$message = $input['msg'] ?? '';
$sender_id = $input['senderid'] ?? '';

// Validate required fields
if (empty($api_key) || empty($phone) || empty($message)) {
    echo json_encode([
        'success' => false,
        'error' => 'Missing required parameters'
    ]);
    exit();
}

// BulkSMSBD API endpoint
$api_url = "https://bulksmsdhaka.com/smsapi";

// Prepare data for API call
$postData = [
    'api_key' => $api_key,
    'type' => 'text',
    'contacts' => $phone,
    'senderid' => $sender_id,
    'msg' => $message
];

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    'Accept: application/json'
]);

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

// Handle cURL errors
if ($error) {
    echo json_encode([
        'success' => false,
        'error' => 'cURL Error: ' . $error
    ]);
    exit();
}

// Parse response
$responseData = json_decode($response, true);

// Check if response is successful
if ($httpCode === 200 || $httpCode === 201) {
    // Check response content for success indicators
    if (is_array($responseData)) {
        if (isset($responseData['success']) && $responseData['success']) {
            echo json_encode([
                'success' => true,
                'result' => $responseData,
                'message' => 'SMS sent successfully'
            ]);
        } elseif (isset($responseData['status']) && in_array(strtolower($responseData['status']), ['success', 'ok', 'sent'])) {
            echo json_encode([
                'success' => true,
                'result' => $responseData,
                'message' => 'SMS sent successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'SMS API returned unsuccessful response',
                'details' => $responseData
            ]);
        }
    } elseif (is_string($response)) {
        // Check if string response indicates success
        $responseLower = strtolower($response);
        if (strpos($responseLower, 'success') !== false || 
            strpos($responseLower, 'sent') !== false || 
            strpos($responseLower, 'ok') !== false) {
            echo json_encode([
                'success' => true,
                'result' => $response,
                'message' => 'SMS sent successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'SMS sending failed',
                'details' => $response
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid API response format',
            'details' => $response
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'HTTP Error: ' . $httpCode,
        'details' => $response
    ]);
}
?>