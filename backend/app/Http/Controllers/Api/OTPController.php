<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use SoapClient;
use App\Models\AbsherOTP;
use Illuminate\Support\Facades\Validator;
use App\Models\OTPLogs;
use Auth;
use App\Models\InstitutionalKycDetail;
use App\Models\User;
use PDF;
use Illuminate\Support\Facades\File;

class OTPController extends Controller
{
    public function sendAbsherOTP(){
        $user_id =  Auth::id();
        $national_id = null;
        $user = User::where('id',$user_id)->first();
        if($user->user_type == 1){ //individual
            if(!empty($user->national_id)){
                $national_id = $user->national_id;
            }else{
                return response()->json([
                    'status' => 'success',
                    'message' => 'Please update national Id first.',
                ], 400);
            }
        }

        if($user->user_type == 2){ //institutional
            $institutional_detail =  InstitutionalKycDetail::where('user_id', $user_id)->first();
            if(!empty($institutional_detail->id_number)){
                $national_id = $institutional_detail->id_number;
            }else{
                return response()->json([
                    'status' => 'success',
                    'message' => 'Please update national Id first.',
                ], 400);
            } 
            
        }

        // Path to the .p12 file
        $p12FilePath = public_path('storage/certificate/dnaneer.p12');
        $passphrase = '1234';

        // Check if the .pem file already exists, if not, convert the .p12 file
        $pemFilePath = public_path('storage/certificate/dnaneer.pem');
        if (!file_exists($pemFilePath)) {
            // Read the .p12 file
            $p12Content = file_get_contents($p12FilePath);

            // Convert the .p12 file to .pem format
            $pemCertContent = '';
            if (openssl_pkcs12_read($p12Content, $certs, $passphrase)) {
                $pemCertContent = $certs['cert'] . "\n" . $certs['pkey'];
                file_put_contents($pemFilePath, $pemCertContent);
            } else {
                // Handle the error when reading or converting the .p12 file
                // ...
                }
            } else {
                // If the .pem file already exists, use its content
                $pemCertContent = file_get_contents($pemFilePath);
            }

            // Create an array with the SSL options
            $sslOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'local_cert' => $pemFilePath,
                    'passphrase' => $passphrase,
                ],
            ];

            // Set the SOAP endpoint URL and WSDL file path
            $endpointUrl = 'https://otp.absher.sa/AbsherOTPService';
            $wsdlPath = 'https://otp.absher.sa/AbsherOTPService?wsdl';

            try {
                // Create a stream context with the SSL options
                $context = stream_context_create($sslOptions);

                // Create the SOAP client with the stream context and WSDL file path
                $soapClient = new SoapClient($wsdlPath, [
                    'stream_context' => $context,
                    'location' => $endpointUrl,
                ]);

                // Call the SOAP methods
                // ...

                $clientId = '7016651718-0001';
                $clientAuthorization = 'lg69kiq+5nRJgEhuIckRf3FUua05GixacQFGcvICnLcAR8mp3MtM92XXzXOUS0MJ';
                $operatorId = $national_id; //'1117260792'; //'1069454542';
                $customerId =$national_id; //'1117260792'; //'1069454542';
                $language = 'AR';
                $reason = 'OTP CODE';
                $otpType = 'GENERATED_4_DIGITS';
                $otpTemplateId = 'Dnaneer-OTP-01';
                $param1 = 'الوكالة بالإستثمار';
                $param2 = 'hello@dnaneer.com';

                // Create the SOAP request
                $soapRequest = [
                    'clientId' => $clientId,
                    'clientAuthorization' => $clientAuthorization,
                    'operatorId' => $operatorId,
                    'customerId' => $customerId,
                    'language' => $language,
                    'reason' => $reason,
                    'otpType' => $otpType,
                    'otpTemplate' => [
                        'otpTemplateId' => $otpTemplateId,
                        'otpParams' => [
                            'Param' => [
                                [
                                    'Name' => 'Param1',
                                    'Value' => $param1,
                                ],
                                [
                                    'Name' => 'Param2',
                                    'Value' => $param2,
                                ],
                            ],
                        ],
                    ],
                ];

                // Make the SOAP request
                $response = $soapClient->sendOTPWithDynamicTemplate($soapRequest);
                // Return the response or perform further actions
                // $response = json_decode($response); // this is commented because of sometimes structure issue.
                $absher = new AbsherOTP();
                $absher->client_id =  $response->clientId;
                $absher->customer_id =$response->customerId;
                $absher->status =$response->status;
                $absher->transaction_id =$response->transactionId;
                $absher->otp =$response->verificationCode;
                $absher->save();

                return response()->json([
                    'status' => 'success',
                    'data' => $soapRequest,
                ], 200);

            } catch (SoapFault $e) {
                // Handle SOAP errors
                $errorMessage = $e->getMessage();
                // ...
            }
       
    }

    function verifyAbsherOTP(Request $request){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'otp' => 'required',
            'customer_id' => 'required',
            'user_id' => 'required',
            'poa_agreement' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $absher = AbsherOTP::where('customer_id', $request->customer_id)->where('otp', $request->otp)->orderBy('created_at', 'desc')->first();
        if(!empty($absher)){
            // Get the current time and calculate the difference with the OTP generation time.
            $currentTime = time();
            $otpGenerationTime = strtotime($absher->created_at);
            $timeDifference = $currentTime - $otpGenerationTime;
            // If the time difference is greater than 60 seconds, fail the OTP.
            if ($timeDifference > 60) {
                // OTP generation time is greater than 60 seconds, so handle the failure.
                return response()->json(['message' => 'OTP Expired.'], 400);
            }else{
                $absher->status = 1;
                $absher->save();

                $poaAgreement = $request->poa_agreement;
                $pdf = PDF::loadHTML($poaAgreement);
                $pdfPath = "storage/app/storage/dnaneer/poa-agreements/institutional/poa-agreement-" . time() . '.pdf';
                
                // Ensure the directory exists
                if (!File::exists(dirname($pdfPath))) {
                    File::makeDirectory(dirname($pdfPath), 0755, true, true);
                }

                $pdf->save($pdfPath);
               
                // Update the database record with the PDF path
                $user = User::find($request->user_id); // Replace with the appropriate model and ID
                $user->poa_agreement = $pdfPath;
                $user->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'OTP verfied successfully.',
                ], 200);
            }
            
        }else{
            return response()->json([
                'status' => 'success',
                'message' => 'OTP verification failed.',
            ], 400);
        }
    }

    function unifonicSendOTP(Request $request){
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required'
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

        //send otp via Unifonic SMS
        $url = env('unifonic_url').'rest/Messages/Send';
        // dd($url);
        $params = [
            'AppSid' => 'vc6dDxg4KYwfGyMg1XDRwUJFLDedei',
            'Recipient' => $request->input('phone_number'),
            'Body' => "Your OTP is $otp",
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        
        curl_close($ch);

        $data = json_decode($response);
        // if($data->success == "false"){
        //     return response()->json([
        //         'success' => false,
        //         'message' => $data->message,
        //     ], 400);
        // }else{
            $optObj = new OTPLogs();
            $optObj->source = $request->phone_number;
            $optObj->otp = $otp;
            $optObj->client_ip = $request->ip();
            $optObj->save();
            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully.',
                'data' => $data->data
            ], 200);
        // }
        
    }

    function verifyUnifonicSendOTP(Request $request){
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required',
            'otp' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = OTPLogs::where('source', $request->phone_number)->whereDate('created_at', Date('Y-m-d'))->orderBy('created_at', 'desc')->first();
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
}
