export const htmlActivateAccount = (code: number): string => {
	return `<html lang=“ar” dir=“rtl">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تفعيل الحساب</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      text-align: center;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    p {
      color: #555;
    }
    .activation-code {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>تفعيل الحساب</h1>
    <p>: شكرا لك على إنشاء حساب. لتفعيل حسابك، يرجى استخدام رمز التفعيل التالي المكون من 6 أرقام</p>
    <p class="activation-code">${code}</p>
    <p>.إذا لم تطلب هذا التفعيل، فيرجى تجاهل هذا البريد الإلكتروني</p>
    <div class="footer">
      <p>.هذا هو البريد الإلكتروني الآلي. يرجى عدم الرد</p>
    </div>
  </div>
</body>
</html>`;
};
