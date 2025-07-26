<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMS Test - Mamun Service</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Hind Siliguri', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #555;
        }
        
        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }
        
        .success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .error {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .loading {
            text-align: center;
            color: #667eea;
        }
        
        .config-info {
            background: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SMS API Test</h1>
        
        <div class="config-info">
            <strong>Current Configuration:</strong><br>
            API Key: c628f3e6ea38ae7892cebc1a4f09647a719964b1<br>
            Sender ID: Mamun eSvc<br>
            API URL: https://bulksmsdhaka.com/smsapi
        </div>
        
        <form id="smsTestForm">
            <div class="form-group">
                <label for="phone">ফোন নাম্বার (Phone Number):</label>
                <input type="tel" id="phone" name="phone" placeholder="01XXXXXXXXX" required>
            </div>
            
            <div class="form-group">
                <label for="message">মেসেজ (Message):</label>
                <textarea id="message" name="message" rows="4" placeholder="Your test message here..." required>Test SMS from Mamun Service. This is a test message to verify SMS API functionality.</textarea>
            </div>
            
            <button type="submit">SMS পাঠান (Send SMS)</button>
        </form>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        document.getElementById('smsTestForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const resultDiv = document.getElementById('result');
            const submitBtn = e.target.querySelector('button');
            
            // Validate phone number
            let formattedPhone = phone.replace(/^\+?88?/, '');
            if (!formattedPhone.startsWith('88')) {
                formattedPhone = '88' + formattedPhone;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'পাঠানো হচ্ছে...';
            resultDiv.style.display = 'block';
            resultDiv.className = 'result loading';
            resultDiv.innerHTML = '<strong>SMS পাঠানো হচ্ছে...</strong>';
            
            try {
                const response = await fetch('send_sms.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        api_key: 'c628f3e6ea38ae7892cebc1a4f09647a719964b1',
                        contacts: formattedPhone,
                        senderid: 'Mamun eSvc',
                        msg: message
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = `
                        <strong>✅ SMS সফলভাবে পাঠানো হয়েছে!</strong><br>
                        Phone: ${formattedPhone}<br>
                        Message: ${message}<br>
                        Response: ${JSON.stringify(result.result, null, 2)}
                    `;
                } else {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = `
                        <strong>❌ SMS পাঠাতে সমস্যা হয়েছে</strong><br>
                        Error: ${result.error}<br>
                        Details: ${JSON.stringify(result.details || {}, null, 2)}
                    `;
                }
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = `
                    <strong>❌ Network Error</strong><br>
                    Error: ${error.message}
                `;
            }
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'SMS পাঠান (Send SMS)';
        });
    </script>
</body>
</html>