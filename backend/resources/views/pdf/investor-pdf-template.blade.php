<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" media="screen" href="https://fontlibrary.org//face/xb-riyaz" type="text/css"/>
    <title>Investor Detail</title>
    <style>
        .bold-text {
            font-weight: bold;
            font-size: large;
        }
        .xb-riyaz-font {
            font-family: 'XBRiyazRegular';
            font-weight: normal;
            font-style: normal;
        }
    </style>
</head>

<body>
    <div>
        <div class="card shadow">
            <div class="card-header py-3">
                <h6 class="bold-text">Name: {{$name}}</h6>
                <h6 class="bold-text">Dnaneer Account Number: {{$dnaneer_account_no}}</h6>
                <h6 class="bold-text">Email: {{$email}}</h6>
                <h6 class="bold-text">National ID Number: {{$national_id_number}}</h6>
                <h6 class="bold-text">IBAN: {{$iban}}</h6>
            </div>
            <div class="card-body">
                <h3>Personal Information</h3>
                <br>

                @if($user_type == 1)

                <div class="row row-cols-md-3 mb-3">
                    <h6>Education:</h6>
                    <h6>Employed:</h6>
                    <h6>Company:</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Position:</h6>
                    <h6>Years of Experience:</h6>
                    <h6>National ID Number:</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Email:</h6>
                </div>

                @elseif ($user_type == 2)

                <div class="row row-cols-md-3 mb-3">
                    <h6 class="xb-riyaz-font">Company: {{$company_name}}</h6>
                    <h6>Position: {{$position}}</h6>
                    <h6>National ID Number: {{$national_id_number}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6 class="xb-riyaz-font">Address: {{$address}}</h6>
                    <h6>Email: {{$email}}</h6>
                </div>

                @endif

                <h3>Financial Information</h3>
                <br>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Source of Income: {{$source_of_income}}</h6>
                    <h6>Yearly Avgrage Income: {{$annual_revenue}}</h6>
                    @if($user_type == 1)
                    <h6>Net worth: {{$net_worth}}</h6>
                    @endif
                </div>
                <h3>Financial Advisor</h3>
                <br>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Advisor Name: {{$advisor_name}}</h6>
                    <h6>Phone Number: {{$advisor_phone_no}}</h6>
                    <h6>Email: {{$advisor_email}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>WhatsApp Number: {{$advisor_whatsapp_no}}</h6>
                </div>

                <h3>Banking Information</h3>
                <br>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Bank Name: {{$bank_name}}</h6>
                    <h6>IBAN: {{$iban}}</h6>
                </div>
                <h3>Wallet Information</h3>
                <br>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Wallet ID: {{$dnaneer_account_no}}</h6>
                    <h6>Balance: {{$balance}}</h6>
                </div>

                @if($user_type == 1)

                <h3>Nafath Information</h3>
                <br>
                <div class="row row-cols-md-3 mb-3">
                    <h6>CR-Number: {{$balance}}</h6>
                    <h6>CR-Entity Number: {{$balance}}</h6>
                    <h6>Status: {{$balance}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Address: {{$balance}}</h6>
                    <h6>Location: {{$balance}}</h6>
                    <h6>Expiry Date: {{$balance}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Paid Amount: {{$balance}}</h6>
                    <h6>Subscribed Amount: {{$balance}}</h6>
                    <h6>Announced Amount: {{$balance}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Share Price: {{$balance}}</h6>
                    <h6>Shares Count: {{$balance}}</h6>
                </div>

                @elseif ($user_type == 2)

                <h3>Wathq Information</h3>
                <br>
                <div class="row row-cols-md-3 mb-3">
                    <h6>CR-Number: {{$cr_number}}</h6>
                    <h6>CR-Entity Number: {{$cr_entity_number}}</h6>
                    <h6 class="xb-riyaz-font">Status: {{$status}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6 class="xb-riyaz-font">Address: {{$address}}</h6>
                    <h6 class="xb-riyaz-font">Location: {{$location}}</h6>
                    <h6>Expiry Date: {{$expiry_date}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Paid Amount: {{$paid_amount}}</h6>
                    <h6>Subscribed Amount: {{$subscribed_amount}}</h6>
                    <h6>Announced Amount: {{$announced_amount}}</h6>
                </div>
                <div class="row row-cols-md-3 mb-3">
                    <h6>Share Price: {{$share_price}}</h6>
                    <h6>Shares Count: {{$shares_count}}</h6>
                </div>

                @endif

                <h3>General Information</h3>
                <br>
                <p>
                    Are you assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country? {{$high_level_missions == 1 ? 'YES' : 'NO'}}
                </p>
                <p>
                    Are you in a senior management position or a job in an international organization? {{$senior_position == 1 ? 'YES' : 'NO'}}
                </p>
                <p>
                    Do you have a blood or marriage relationship, up to the second degree, with someone who is assigned to high-level missions in the Kingdom of Saudi Arabia or in a foreign country, or in senior management positions or a job in an international organization? {{$marriage_relationship == 1 ? 'YES' : 'NO'}}
                </p>
            </div>
        </div>
    </div>
</body>

</html>