<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('individual-poa', function () {

    $data = [
        'logo' => base64_encode(file_get_contents(public_path('images/pdf-logo.png'))),
        'investor_name' => 'شركة اميرسف المالية',
        'submission_date' => '24-01-2023',
        'national_id' => '1234567890',
        'dob' => '21-05-1997',
        'address' => 'المملكة العربية السعودية، مدينة الرياض، حي: الفلاح',
        'serial_number' => 12345533,
        'contact_person_name' => 'Muhammad Safee'
    ];

    return view('pdf.individual-poa-agreement')->with([
        'data' => $data
    ]);
});

Route::get('institutional-poa', function () {
    $userId = 17;
    $user = User::find($userId);
    $wathq = json_decode($user->wathq);
    $data = [
        'logo' => base64_encode(file_get_contents(public_path('images/pdf-logo.png'))),
        // 'company_name' => $wathq->crName,
        'company_name' => 'شركة اميرسف المالية',
        'submission_date' => '24-01-2023',
        'cr_number' => $wathq->crNumber,
        'cr_issuing_date' => '21-05-1997',
        'address' => 'المملكة العربية السعودية، مدينة الرياض، حي: الفلاح',
        'serial_number' => 12345533,
        'contact_person_name' => 'مجدي موسى'
    ];

    return view('pdf.institutional-poa-agreement')->with([
        'data' => $data
    ]);
});

Route::get('/poa', function () {
    $logo = base64_encode(file_get_contents(public_path('images/pdf-logo.png')));
    $investor_name = "Ijaz Ali";
    $submission_date = date('d-m-Y');
    $national_id = '1117260792';
    $dob = "1995-06-12";
    $address = '0000 الرياض 14258-0000';
    // Render the Blade view and get its content
    $htmlContent = View::make('pdf/pdf-template', compact('logo', 'investor_name', 'submission_date', 'national_id', 'dob', 'address'))->render();

    return response()->json([
        $htmlContent
    ]);
    return view('pdf.pdf-template', compact('logo', 'investor_name', 'submission_date', 'national_id', 'dob'));
});

Route::get('poa-agreement', function () {
    $data = [
        'logo' => base64_encode(file_get_contents(public_path('images/pdf-logo.png'))),
        'investor_name' => "Ijaz Ali",
        'submission_date' => date('d-m-Y'),
        'national_id' => '1117260792',
        'dob' => "1995-06-12",
        'address' => '0000 الرياض 14258-0000'
    ];
    return view('pdf/pdf-template')->with($data);
});

Route::get('investor-pdf', function () {
            $user = User::where('id', 46)->first();
            $data = [];
            $data['user_type'] = $user->user_type;
            if ($user->user_type === 1) {
                $profile =  User::with('individual','classification' , 'accounts', 'advisor', 'documents')->find($user->id);
                $profile->nafath = json_decode($profile->nafath);

                // Personal Information
                $data['education'] = $profile->individual->education;
                $data['employed'] = $profile->individual->employee;
                $data['company'] = $profile->individual->current_company;
                $data['position'] = $profile->individual->current_position;
                $data['years_of_experience'] = $profile->individual->current_experience;
                $data['national_id_number'] = $profile->national_id;

                // Financial Information
                $data['source_of_income'] = $profile->individual->source_of_income;
                $data['yearly_average_income'] = $profile->individual->average_income;
                $data['net_worth'] = $profile->individual->net_worth;

                // Nafath Information
                $data['full_name'] = $profile->nafath->englishFirstName . $profile->nafath->englishLastName . $profile->nafath->englishSecondName . $profile->nafath->englishThirdName;
                $data['اسْم ثُلاثيّ'] = $profile->nafath->firstName . $profile->nafath->familyName . $profile->nafath->fatherName . $profile->nafath->grandFatherName;
                $data['date_of_birth'] = $profile->nafath->dateOfBirthG . " (G) " . $profile->nafath->dateOfBirthH . " (H)";
                $data['gender'] = $profile->nafath->gender;
                $data['nationality'] = $profile->nafath->nationality;
                $data['service_name'] = $profile->nafath->ServiceName;
                $data['id_expiry_date'] = $profile->nafath->idExpiryDateG . " (G) " . $profile->nafath->idExpiryDate . " (H)";
                $data['city'] = $profile->nafath->nationalAddress[0]->city;
                $data['district'] = $profile->nafath->nationalAddress[0]->district;
                $data['post_code'] = $profile->nafath->nationalAddress[0]->postCode;
                $data['street_name'] = $profile->nafath->nationalAddress[0]->streetName;
                $data['building_number'] = $profile->nafath->nationalAddress[0]->buildingNumber;
                $data['additional_number'] = $profile->nafath->nationalAddress[0]->additionalNumber;
                $data['is_priary_address'] = $profile->nafath->nationalAddress[0]->isPrimaryAddress;
                $data['location_coordinates'] = $profile->nafath->nationalAddress[0]->locationCoordinates;

                // General Information
                $data['high_level_missions'] = $profile->individual->high_level_mission;
                $data['senior_position'] = $profile->individual->senior_position;
                $data['marriage_relationship'] = $profile->individual->marriage_relationship;

            } elseif ($user->user_type === 2) {
                $profile =  User::with('institutional','classification' ,'accounts', 'advisor', 'documents')->find($user->id);
                $profile->wathq = json_decode($profile->wathq);

                // Personal Information
                $data['company_name'] = $profile->institutional->company_name;
                $data['position'] = $profile->institutional->position;
                $data['national_id_number'] = $profile->institutional->id_number;
                $data['address'] = $profile->wathq->address->general->address;
                $data['email'] = $profile->email;

                // Financial Information
                $data['source_of_income'] = $profile->institutional->source_of_income;
                $data['annual_revenue'] = $profile->institutional->annual_revenue;

                // Wathq Information
                $data['cr_number'] = $profile->institutional->registration_number;
                $data['cr_entity_number'] = $profile->wathq->crEntityNumber;
                $data['status'] = $profile->wathq->status->name;
                $data['location'] = $profile->wathq->location->name;
                $data['expiry_date'] = $profile->wathq->expiryDate;
                $data['paid_amount'] = $profile->wathq->capital->paidAmount;
                $data['subscribed_amount'] = $profile->wathq->capital->subscribedAmount;
                $data['announced_amount'] = $profile->wathq->capital->announcedAmount;
                $data['share_price'] = isset($profile->wathq->capital->share) ? $profile->wathq->capital->share : '-';
                $data['shares_count'] = $profile->wathq->parties[0]->sharesCount;

                // General Information
                $data['high_level_missions'] = $profile->institutional->high_level_mission;
                $data['senior_position'] = $profile->institutional->senior_position;
                $data['marriage_relationship'] = $profile->institutional->marriage_relationship;
            }

            // Header Information
            $data['name'] = $profile->name;
            $data['dnaneer_account_no'] = $profile->accounts->dnaneer_account_no;
            $data['national_id_number'] = $profile->national_id;
           
            // Financial Advisor
            $data['advisor_name'] = isset($profile->advisor->name) ? $profile->advisor->name : '-';
            $data['advisor_phone_no'] = isset($profile->advisor->phone_no) ? $profile->advisor->phone_no : '-';
            $data['advisor_email'] = isset($profile->advisor->email) ? $profile->advisor->email : '-';
            $data['advisor_whatsapp_no'] = isset($profile->advisor->whatsapp_no) ? $profile->advisor->whatsapp_no : '-';

            // Banking Information
            $data['bank_name'] = $profile->accounts->name;
            $data['iban'] = $profile->accounts->personal_iban_number;

            // Wallet Information
            $data['dnaneer_account_no'] = $profile->accounts->dnaneer_account_no;
            $data['balance'] = $profile->accounts->balance;
            return view('pdf.investor-pdf-template')->with($data);
});
