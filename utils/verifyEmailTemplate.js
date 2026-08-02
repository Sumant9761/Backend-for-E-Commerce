const VerificationEmail = (username, otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            margin: 20px 0;
            letter-spacing: 2px;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hi ${username} Please Verify Your Email Address</h1>
      
        <p>Thank You for registering with Ecommerce App. Please use the OTP below to verify your email address:</p>
        
        <div class="code">${otp}</div>
        <p>If you didn't request this verification, please ignore this email.</p>
        
        <div class="footer">
            <p>&copy; 2026 Ecommerce App. All rights reserved</p>
        </div>
    </div>
</body>
</html>
  `;
};

export default VerificationEmail;
