<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\OTPLogs;
use Illuminate\Support\Facades\Hash;
use App\Models\UserAccounts;
use App\Models\Banks;
use Illuminate\Support\Carbon;
use App\Models\BorrowerRequest;
use App\Models\FinancialAdvisor;
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvestNowNotification;
use App\Notifications\RegisterInstitutionalNotification;
use App\Notifications\RegisterBorrowerNotification;
use App\Models\Opportunity;
use Config;

class AuthController extends Controller
{
    
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function signup(Request $request)
    {
        // Validate the request
        if ($request->user_type == 1) {
            $validator = Validator::make($request->all(), [
                'user_type' => 'required|in:1,2',
                'phone_number' => $request->user_type == 1 ? 'required|numeric|unique:users' : '',
        ], [
                'phone_number.unique' => 'The phone number has already been registered.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 400);
            }

            // Generate OTP and send via Unifonic SMS
            if(env('EMAIL_OTP') == 'Production'){
                $otp = mt_rand(1000, 9999); 
            }else{
                $otp = 1111;
            }

            //send otp via Unifonic SMS
            $url = env('unifonic_url').'rest/Messages/Send';
            $otp_msg = "من فضلك استخدم رمز التحقق: ".$otp." العملية: تسجيل مستثمر جديد شركة دنانير للتمويل مشاركة الرمز يعرضك للاحتيال";
            $params = [
                'AppSid' => 'vc6dDxg4KYwfGyMg1XDRwUJFLDedei',
                'Recipient' => $request->input('phone_number'),
                'Body' => $otp_msg,
            ];
            

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);

            curl_close($ch);

            $optObj = new OTPLogs();
            $optObj->source = $request->phone_number;
            $optObj->otp = $otp;
            $optObj->client_ip = $request->ip();
            $optObj->save();
            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully.',
            ], 200);

        } else if ($request->user_type == 2) {
            $validator = Validator::make($request->all(), [
                'user_type' => 'required|in:1,2',
                // 'phone_number' => $request->user_type == 1 ? 'required|numeric|unique:users' : '',
                'email' => $request->user_type == 2 ? 'required|email|unique:users' : '',
                'password' => $request->password == 2 ? 'required_if:user_type,2|min:8' : '',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first()
                ], 400);
            }

            // Generate OTP and send via Unifonic SMS
            if(env('EMAIL_OTP') == 'Production'){
                $otp = mt_rand(1000, 9999);
            }else{
                $otp = 1111;
            }
            //Sending OTP via Email to type 2 user.
            $email = $request->input('email');
            Mail::to($email)->send(new OtpMail($otp));

            $optObj = new OTPLogs();
            $optObj->source = $email;
            $optObj->otp = $otp;
            $optObj->client_ip = $request->ip();
            $optObj->save();
        }
        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully.',
        ], 200);
    }

    public function signupInstitutional(Request $request){
        $validator = Validator::make($request->all(), [
            'user_type' => 'required|in:1,2',
            // 'phone_number' => $request->user_type == 1 ? 'required|numeric|unique:users' : '',
            'email' => $request->user_type == 2 ? 'required|email|unique:users' : '',
            'password' => $request->password == 2 ? 'required_if:user_type,2|min:8' : '',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        // Create the user
        $user = new User();
        $user->user_type = $request->user_type;
        $user->email = $request->email;
        $user->mode = 'vip';
        $user->password = Hash::make($request->password);
        $user->save();
        // $userData = User::where('id', $user->id)->get();

        $userAccount = new UserAccounts();
        $userAccount->user_id = $user->id;
        $userAccount->dnaneer_account_no = null;
        $userAccount->personal_iban_number= null;
        $userAccount->bank_id = null;
        $userAccount->balance = 0.00;
        $userAccount->save();

        //Admin Notification 
        // $adminNotification = getAdmin();
        // Notification::send($adminNotification, new RegisterInstitutionalNotification($user, 'admin'));
        // //User Notification
        // Notification::send($user, new RegisterInstitutionalNotification($user, 'user'));

        $token = $user->createToken('DnaneerApp')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully.',
            'token' => $token,
            'data' => [
                'user' => $user
            ],
        ], 200);
    }

    /**
     * Generate OTP for a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function generateOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Generate OTP and send via Unifonic SMS
        if(env('EMAIL_OTP') == 'Production'){
            $otp = mt_rand(1000, 9999); 
        }else{
            $otp = 1111;
        }

        Mail::to($request->email)->send(new OtpMail($otp));

        $optObj = new OTPLogs();
        $optObj->source = $request->email;
        $optObj->otp = $otp;
        $optObj->client_ip = $request->ip();
        $optObj->save();
        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully.',
        ], 200);
        
    }

    /**
     * Verify OTP for a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'source' => 'required',
            'otp' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = OTPLogs::where('source', $request->source)->whereDate('created_at', Date('Y-m-d'))->orderBy('created_at', 'desc')->first();
        if(!empty($data)){
            // Get the current time and calculate the difference with the OTP generation time.
            $currentTime = time();
            $otpGenerationTime = strtotime($data->created_at);
            $timeDifference = $currentTime - $otpGenerationTime;
            // If the time difference is greater than 60 seconds, fail the OTP.
            if ($timeDifference > 60) {
                // OTP generation time is greater than 60 seconds, so handle the failure.
                return response()->json(['message' => 'OTP Expired.'], 400);
            } else {
                // OTP is valid. Proceed with the further verification process.
                if($data->otp == $request->otp){
                    $data->verified = 1;
                    $data->save();
                    return response()->json([
                        'success' => true,
                        'message' => 'OTP verfied successfully.',
                    ], 200);
                }else{
                    return response()->json([
                        'success' => false,
                        'message' => 'OTP verification failed.',
                    ], 400);
                }
            }
        }else{
            return response()->json([
                'success' => false,
                'message' => 'OTP verification failed. Send again!',
            ], 400);
        }
    }

    public function verifyLoginOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_type' => 'required|in:1,2',
            'otp' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = OTPLogs::where('source', $request->email)->orderBy('created_at', 'desc')->first();
        if(!empty($data)){
            // Get the current time and calculate the difference with the OTP generation time.
            $currentTime = time();
            $otpGenerationTime = strtotime($data->created_at);
            $timeDifference = $currentTime - $otpGenerationTime;
            // If the time difference is greater than 60 seconds, fail the OTP.
            if ($timeDifference > 60) {
                // OTP generation time is greater than 60 seconds, so handle the failure.
                return response()->json(['message' => 'OTP Expired.'], 400);
            }else{
                $data->verified = 1;
                $data->save();
                if(Auth::attempt(['email' => strtolower($request->email), 'password' => $request->password])){
                    $user = Auth::user();
        
                    if(intval($request->user_type) !== intval($user->user_type)){
                        return response()->json([
                            'message' => 'Invalid user type for this user.',
                        ], 401);
                    }
                    if($user->status == 0){
                        return response()->json([
                            'message' => 'User account deactivated. Please contact customer support.',
                        ], 401);
                    }
                    if(intval($data->otp) == intval($request->otp)){
                        $data->verified = 1;
                        $data->save();
                        if ($user->nafath != null) {
                            $token = $user->createToken('DnaneerApp')->plainTextToken;
                            return response()->json([
                                'status' => 'success',
                                'message' => 'User login successfully.',
                                'data' => [
                                    'token' => $token,
                                    'user' => $user
                                ],
                            ], 200);   
                        } else {
                            $nationalId = $user->national_id;
                            $locale = 'ar';
                            $requestId = $request->input('request_id', uniqid());
                    
                            $end_point = "/mfa/request?local=$locale&requestId=".$requestId;
                            if(env('APP_ENV') == 'Production'){
                                $url = Config::get('services.nafath.prod_url').$end_point;
                                $appId = Config::get('services.nafath.app_id');
                                $appKey = Config::get('services.nafath.app_key');
                            }else{
                                $url = Config::get('services.nafath.stg_url').$end_point;
                                $appId = Config::get('services.nafath.stg_app_id');
                                $appKey = Config::get('services.nafath.stg_app_key');
                            }
                            
                            $request = [
                                'nationalId' => $nationalId,
                                'service' => "OpenAccount"
                            ];
                            
                            $ch = curl_init($url);
                            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request));
                            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                                'Content-Type: application/json',
                                'APP-ID:'.$appId,
                                'APP-KEY:'.$appKey,
                            ));
                    
                            $response = curl_exec($ch);
                            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                            $err = curl_error($ch);
                    
                            curl_close($ch);

                            $responseData = json_decode($response, true);
                            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                            if ($err) {
                                return response()->json([
                                    'error' => 'error',
                                    'statusCode' => $statusCode,
                                    'message' => $responseData['message']
                                ], $statusCode);
                            } else {
                                if ($statusCode >= 200 && $statusCode < 300) {
                                    User::where('id', Auth::id())->update([
                                        'transid' => $responseData['transId'],
                                        'requestid' => $requestId
                                    ]);
                                    return response()->json([
                                        'transId' => $responseData['transId'],
                                        'random' => $responseData['random'],
                                    ]);
                                } else {
                                    return response()->json([
                                        'error' => 'error',
                                        'statusCode' => $statusCode,
                                        'message' => $responseData['message']
                                    ], $statusCode);
                                }
                            }
                        }
                    }else{
                        return response()->json([
                            'success' => false,
                            'message' => 'OTP verification failed.',
                        ], 400);
                    }
                }else{
                    // Authentication failed
                    return response()->json([
                        'message' => 'Invalid email or password.'
                    ], 401);
                }
            }
            
        }else{
            return response()->json([
                'success' => false,
                'message' => 'OTP verification failed. Send again!',
            ], 400);
        }
    }

    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'user_type' => 'required|in:1,2,3',
            // 'phone_number' => $request->user_type == 1 ? 'required|numeric|unique:users' : '',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $nafath = User::select('user_type','nafath')->where('email', strtolower($request->email))->first();
        if(!empty($nafath)){
            if($nafath->user_type == 1 && empty($nafath->nafath)){
                return response()->json([
                    'message' => 'incomplete_nafath',
                ], 401);
            }
        }

        if(Auth::attempt(['email' => strtolower($request->email), 'password' => $request->password])){
            $user = Auth::user();
            if(intval($request->user_type) !== intval($user->user_type)){
                return response()->json([
                    'message' => 'Invalid user type for this user.',
                ], 401);
            }
            if($user->status == 0){
                return response()->json([
                    'message' => 'User account deactivated. Please contact customer support.',
                ], 401);
            }
            if(env('EMAIL_OTP') == 'Production'){
                $otp = mt_rand(1000, 9999); 
            }else{
                $otp = 1111;
            }
            $optObj = new OTPLogs();
            $optObj->source = $request->email;
            $optObj->otp = $otp;
            $optObj->client_ip = $request->ip();
            $optObj->save();
            $otp_msg = "من فضلك استخدم رمز التحقق: ".$otp." العملية: تسجيل الدخول شركة دنانير للتمويل مشاركة الرمز يعرضك للاحتيال";
            Mail::to($request->email)->send(new OtpMail($otp_msg));
            return response()->json([
                'success' => true,
                'message' => 'OTP Sent successfully.',
            ], 200);
        }

        // Authentication failed
        return response()->json([
            'message' => 'Invalid email or password.'
        ], 401);
    }

    public function logout()
    {
        if (Auth::check()) {
            $token = Auth::user()->tokens();
            $token->delete();
            return response()->json([
                'message' => 'User is logout',
            ], 200);
        } 
        else{
            // Authentication failed
            return response()->json([
                'message' => 'Unauthorised.'
            ], 401);
        } 
    }

    public function bankList(){
        $banks = Banks::select('id as value','name as label', 'logo')->where('status',1)->get();
        return response()->json([
            'success' => true,
            'data' => $banks
        ], 200);
    }

    public function generateBorrowerOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cr_number' => 'required|unique:borrower_requests,cr_number',
            'email'=> 'required|email|unique:users',
        ],[
            'cr_number.unique' => 'This company is already registerd.'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        //Call Search Registration Number to Verify its correct or not.
        $data = get_wathq_info($request);
        $data = $data->getData();
        if($data->statusCode == 200){
            // Generate OTP and send via Unifonic SMS
             if(env('EMAIL_OTP') == 'Production'){
                 $otp = mt_rand(1000, 9999); 
             }else{
                $otp = 1111;
             }

            Mail::to($request->email)->send(new OtpMail($otp));

            $optObj = new OTPLogs();
            $optObj->source = $request->email;
            $optObj->otp = $otp;
            $optObj->client_ip = $request->ip();
            $optObj->save();
            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully.',
            ], 200);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'Commercial Registration Number is not correct.',
            ], 400);
        }
    }

    public function registerBorrower(Request $request){
        $validator = Validator::make($request->all(), [
            'otp' => 'required',
            'cr_number' => 'required|unique:borrower_requests',
            'email'=> 'required|email|unique:users',
            'password' => 'required|min:8',
        ], [
            'cr_number.unique' => 'This company is already registerd.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }
        try {
            //Call Search Registration Number to Verify its correct or not.
            $crn = $request->cr_number;
            // API URL & KEY //1010621840
            $wathqAPIUrl = env('wathq_url').$crn;
            $apiKey = env('wathq_key'); 
            $ch = curl_init($wathqAPIUrl);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
            // curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'APIkey: '.$apiKey,
            ));
            $response = curl_exec($ch);
            $err = curl_error($ch);
            curl_close($ch);

            if ($err) {
                return response()->json(['error' => $err], 500);
            } else {
                $responseData = json_decode($response, true);
                $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                // $statusText = curl_getinfo($ch, CURLINFO_HTTP_MESSAGE);
                if ($statusCode >= 200 && $statusCode < 300) {
                    // Create the user
                    $user = new User();
                    $user->user_type = 3;
                    $user->email = $request->email;
                    $user->password = Hash::make($request->password);
                    $user->wathq = json_encode($responseData);
                    $user->save();
                    $userData = User::where('id', $user->id)->first();

                    // $cr_data = $responseData->data;
                    $borrowerKyc = new BorrowerRequest();
                    $borrowerKyc->user_id = $userData->id;
                    $borrowerKyc->cr_number = $responseData['crNumber'];
                    $borrowerKyc->business_name = $responseData['crName'];
                    $borrowerKyc->business_activity = !empty($responseData['activities']) ? $responseData['activities']['isic'][0]['nameEn']: null;
                    $borrowerKyc->legal_type = !empty($responseData['businessType']) ? $responseData['businessType']['name']: null;
                    $borrowerKyc->capital = !empty($responseData['capital']) ? $responseData['capital']['announcedAmount']: null;
                    $borrowerKyc->cr_expiry_date = !empty($responseData['company']) ? (!empty($responseData['company']['endDate']) ? Carbon::createFromFormat('Y/m/d', $responseData['company']['endDate'])->format('Y-m-d') : null) : null;
                    $borrowerKyc->address = !empty($responseData['address']) ? $responseData['address']['general']['address'] : null;
                    $borrowerKyc->save();
                    
                    $userAccount = new UserAccounts();
                    $userAccount->user_id = $userData->id;
                    $userAccount->dnaneer_account_no = null;
                    $userAccount->personal_iban_number= null;
                    $userAccount->bank_id = null;
                    $userAccount->balance = 0.00;
                    $userAccount->save();

                    //Admin Notification 
                    // $adminNotification = getAdmin();
                    // Notification::send($adminNotification, new RegisterBorrowerNotification($user, 'admin'));
                    // //User Notification
                    // $userNotification = getCurrentUser($user->id);
                    // Notification::send($userNotification, new RegisterBorrowerNotification($user, 'user'));
                    
                    $token = $user->createToken('DnaneerApp')->plainTextToken;
                    return response()->json([
                        'status' => 'success',
                        'message' => 'User registered successfully.',
                        'token' => $token,
                        'data' => [
                            'user' => $userData
                        ],
                    ], 200);

                }else{
                    // The request failed.
                    return response()->json([
                        'error' => 'error',
                        'statusCode' => $statusCode,
                    ], $statusCode);
                }

            }
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
        

    }

    public function loginBorrower(Request $request){

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if(Auth::attempt(['email' => strtolower($request->email), 'password' => $request->password])){
            $user = Auth::user();

            // Generate OTP and send via Unifonic SMS
            if(env('EMAIL_OTP') == 'Production'){
                $otp = mt_rand(1000, 9999); 
            }else{
                $otp = 1111;
            }
            $msg = 'Your login otp code is '.$otp;
            Mail::to($request->email)->send(new OtpMail($msg));

            $optObj = new OTPLogs();
            $optObj->source = $request->email;
            $optObj->otp = $otp;
            $optObj->client_ip = $request->ip();
            $optObj->save();
            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully.',
            ], 200);
            
            // if($user->status == 0){
            //     return response()->json([
            //         'message' => 'User account deactivated. Please contact customer support.',
            //     ], 401);
            // }
            // $token = $user->createToken('DnaneerApp')->plainTextToken;
            // if($user->kyc_step == 3){
            //     return response()->json([
            //         'status' => 'success',
            //         'message' => 'Verification is still pending. Wait for the admin approval.',
            //         'data' => [
            //             'token' => $token,
            //             'user' => $user
            //         ],
            //     ], 200);
            // }
            // if($user->kyc_step == 4){
            //     return response()->json([
            //         'status' => 'success',
            //         'message' => 'Your request has been rejected. Please contact contact support.',
            //         'data' => [
            //             'token' => $token,
            //             'user' => $user
            //         ],
            //     ], 200);
            // }
           
            // return response()->json([
            //     'status' => 'success',
            //     'message' => 'User login successfully.',
            //     'data' => [
            //         'token' => $token,
            //         'user' => $user
            //     ],
            // ], 200);
        }else{
            // Authentication failed
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }
    }
    
    public function verifyBorrowerLogin(Request $request){
        $validator = Validator::make($request->all(), [
            'otp' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = OTPLogs::where('source', $request->email)->orderBy('created_at', 'desc')->first();
        if(!empty($data)){
            // Get the current time and calculate the difference with the OTP generation time.
            $currentTime = time();
            $otpGenerationTime = strtotime($data->created_at);
            $timeDifference = $currentTime - $otpGenerationTime;
            // If the time difference is greater than 60 seconds, fail the OTP.
            if ($timeDifference > 60) {
                // OTP generation time is greater than 60 seconds, so handle the failure.
                return response()->json(['message' => 'OTP Expired.'], 400);
            }else{
                $data->verified = 1;
                $data->save();
                if(Auth::attempt(['email' => strtolower($request->email), 'password' => $request->password])){
                    $user = Auth::user();
                    $advisor = FinancialAdvisor::where('id', $user->advisor_id)->first();
                    $borrower_request = BorrowerRequest::where('user_id', $user->id)->first();
                    $opp = Opportunity::where('borrower_request_id', $borrower_request->id)->first();
                    $cards = [];
                    if(!empty($opp)){
                        $cards = [
                            'loan_amount' => $opp->fund_collected,
                            'repayment_period' => $borrower_request->repayment_duration,
                            'financing_rate' => $opp->annual_roi,
                            'status' => $borrower_request->status
                        ];
                    }
                    if(intval($data->otp) == intval($request->otp)){
                        $data->verified = 1;
                        $data->save();
                        if($user->status == 0){
                            return response()->json([
                                'message' => 'User account deactivated. Please contact customer support.',
                            ], 401);
                        }
                        $token = $user->createToken('DnaneerApp')->plainTextToken;
                        if($user->kyc_step == 3){
                            return response()->json([
                                'status' => 'success',
                                'message' => 'Verification is still pending. Wait for the admin approval.',
                                'data' => [
                                    'token' => $token,
                                    'user' => $user,
                                    'advisor' => $advisor,
                                    'borrower_request' =>$borrower_request,
                                    'dashboard_cards' => $cards
                                ],
                            ], 200);
                        }
                        if($user->kyc_step == 4){
                            return response()->json([
                                'status' => 'success',
                                'message' => 'Your request has been rejected. Please contact contact support.',
                                'data' => [
                                    'token' => $token,
                                    'user' => $user,
                                    'advisor' => $advisor,
                                    'borrower_request' =>$borrower_request,
                                    'dashboard_cards' => $cards
                                ],
                            ], 200);
                        }
                        return response()->json([
                            'status' => 'success',
                            'message' => 'User login successfully.',
                            'data' => [
                                'token' => $token,
                                'user' => $user,
                                'advisor' => $advisor,
                                'borrower_request' =>$borrower_request,
                                'dashboard_cards' => $cards
                            ],
                        ], 200);
                    }else{
                        return response()->json([
                            'success' => false,
                            'message' => 'OTP verification failed.',
                        ], 400);
                    }
                }else{
                    // Authentication failed
                    return response()->json([
                        'message' => 'Invalid email or password.'
                    ], 401);
                }
            }
        }
    }
}
