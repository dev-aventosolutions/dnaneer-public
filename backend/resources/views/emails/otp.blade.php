<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Add some basic styling for the email */
      body {
        font-family: Arial, sans-serif;
        background: #ffffff;
        margin: 0 auto;
        padding: 0;
        text-align: center;
        width: 700px;
      }
      .container {
        background-color: #ffffff;
        width: max-content;
        margin: 0 auto;
      }
      p {
        text-align: right;
      }
      .otp {
        font-size: 25px;
        font-weight: bold;
      }
      .logo {
        display: flex;
        justify-content: end;
        margin-bottom: 50px;
      }
      .footer {
        background: #5b2cd3;
        height: 85px;
        margin-top: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="{{ asset('images/dnaneer-otp-logo.svg') }}" width="169" height="42" />
      </div>
      <p>عميلنا العزيز</p>
      <p>:شكراً لتسجيلك في منصة دنانير، الرجاء استخدام رمز التحقق</p>
      <br />
      <p class="otp">{{$otp}}</p>
      <br />
      <p>!مشاركة الرمز يعرضك للاحتيال</p>
      <p>شكراً</p>
      <p>شركة دنانير للتمويل</p>
    </div>
    <div class="footer">
      <p>Dnaneer © Copyright 2023, All Rights Reserved</p>
    </div>
  </body>
</html>