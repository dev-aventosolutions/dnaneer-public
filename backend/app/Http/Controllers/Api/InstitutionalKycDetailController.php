<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InstitutionalKycDetail;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use OSS\Core\OssException;
use OSS\OssClient;
use Illuminate\Support\Facades\Validator;
use App\Models\Documents;
use App\Models\UserAccounts;
use Illuminate\Support\Facades\Notification;
use App\Notifications\InstitutionalKYCNotification;

class InstitutionalKycDetailController extends Controller
{
    
    public function searchRegistrationNumber(Request $request){
        return get_wathq_info($request);
    }
    public function storeKYC(Request $request)
    {
        if($request->kyc_step == 1){
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'kyc_step' => 'required',
                'user_id' => 'required',
                'registration_number' => 'required',
                'company_name' => 'required',
                'establishment_date' => 'required',
                'address' => 'required',
                'legal_structure' => 'required',
                'investor_name' => 'required',
                'position' => 'required',
                'certificate_documents.*' => 'required|mimes:pdf',
                'id_number' => 'required',
                // 'phone_number' => 'required',
                // 'date_of_birth' => 'required',
            ],[
                'certificate_documents.*.required' => 'Please upload an documents',
                'certificate_documents.*.mimes' => 'Only pdf files are allowed'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            
            $crn = $request->registration_number;
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

                    $user = User::where('id', $request->user_id)->first();
                    $user->kyc_step = 1;
                    // $user->national_id = $request->id_number;
                    // $user->dob = $request->date_of_birth;
                    $user->name = $request->investor_name;
                    $user->wathq = json_encode($responseData);
                    $user->save();

                    $institutionalKYC = InstitutionalKycDetail::updateOrCreate([
                        'user_id'   => $request->user_id,
                    ],[
                    'registration_number' => $request->registration_number,
                    'company_name' => $request->company_name,
                    'establishment_date' => $request->establishment_date,
                    'address' => $request->address,
                    'legal_structure' => $request->legal_structure,
                    'investor_name' => $request->investor_name,
                    'id_number' => $request->id_number,
                    'position' => $request->position
                    // 'phone_number' => $request->phone_number,
                    // 'date_of_birth' => $request->date_of_birth,
                    // 'high_level_mission' => $request->high_level_mission,
                    // 'senior_position' => $request->senior_position,
                    // 'marriage_relationship' => $request->marriage_relationship
                    ]);

                    if ($files = $request->file('certificate_documents')) {
                        $path = 'public/dnaneer/'.$request->user_id.'/institutional/documents';
                        foreach ($files as $key => $file) {
                            $path = $file->store($path);
                            $name = $file->getClientOriginalName();
                            $pathnew = str_replace('public', 'storage', $path);
                            $documents_data[$key]['module_id'] = $institutionalKYC->id;
                            $documents_data[$key]['link'] = $pathnew;
                            $documents_data[$key]['original_name'] = $name;
                            $documents_data[$key]['user_id'] = $request->user_id;
                            $documents_data[$key]['module'] = "kyc_legal_documents";
                            $documents_data[$key]['created_at'] = date('Y-m-d H:i:s');
                        }
                        $documents = Documents::insert($documents_data);
                    }

                    // Return the saved model instance with HTTP 201 Created status
                    return response()->json([
                        'status' => 'success',
                        'message' => 'KYC details added successfully.',
                        'data' => $institutionalKYC,
                    ], 201);

                }else{
                     // The request failed.
                    return response()->json([
                        'error' => 'error',
                        'statusCode' => $statusCode,
                    ], $statusCode);
                }
            }
        }
        if ($request->kyc_step == 2){
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'kyc_step' => 'required',
                'user_id' => 'required',
                'source_of_income' => 'required',
                'annual_revenue' => 'required',
                // 'annual_investment_amount' => 'required',
                'iban' => 'required',
                'legal_documents.*' => 'required|mimes:pdf',
                'bank_documents.*' => 'required|mimes:pdf'

                // 'other_documents.*' => 'required|mimes:pdf'
                ],[
                    'legal_documents.*.required' => 'Please upload an documents',
                    'legal_documents.*.mimes' => 'Only pdf files are allowed',
                    'bank_documents.*.required' => 'Please upload an documents',
                    'bank_documents.*.mimes' => 'Only pdf files are allowed',
                    // 'legal_documents.*.max' => 'Sorry! Maximum allowed size for an image is 20MB',
                    // 'other_documents.*.required' => 'Please upload an documents',
                    // 'other_documents.*.mimes' => 'Only pdf files are allowed',
                    // 'other_documents.*.max' => 'Sorry! Maximum allowed size for an image is 20MB',
                ]
            );
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }
            $user_id = $request->user_id;
            // // Create a new instance of InstitutionalKYC model
            // $institutionalKYC = InstitutionalKycDetail::where('user_id', $user_id)->first();
            // $institutionalKYC->source_of_income = $request->source_of_income;
            // $institutionalKYC->annual_revenue = $request->annual_revenue;
            // $institutionalKYC->investment_amount = $request->investment_amount;
            // // Save the model instance to the database
            // $institutionalKYC->save();

            $institutionalKYC = InstitutionalKycDetail::updateOrCreate([
                'user_id'   => $user_id,
            ],[
                'source_of_income' => $request->source_of_income,
                'annual_revenue' => $request->annual_revenue,
                'investment_amount' => $request->investment_amount,
                // 'annual_investment_amount' => $request->annual_investment_amount
            ]);
            $account = UserAccounts::updateOrCreate([
                'user_id'   => $user_id,
            ],[
                'personal_iban_number' => $request->iban,
                'bank_id'    => $request->bank_id,
            ]);
            Documents::whereIn('module', ['kyc_other_documents', 'kyc_legal_documents'])->where('user_id',$request->user_id)->delete();
            if ($files = $request->file('legal_documents')) {
                $path = 'public/dnaneer/'.$user_id.'/institutional/documents';
                foreach ($files as $key => $file) {
                    $path = $file->store($path);
                    $name = $file->getClientOriginalName();
                    $pathnew = str_replace('public', 'storage', $path);
                    $documents_data[$key]['module_id'] = $institutionalKYC->id;
                    $documents_data[$key]['link'] = $pathnew;
                    $documents_data[$key]['original_name'] = $name;
                    $documents_data[$key]['user_id'] = $user_id;
                    $documents_data[$key]['module'] = "kyc_legal_documents";
                    $documents_data[$key]['created_at'] = date('Y-m-d H:i:s');
                }
                $documents = Documents::insert($documents_data);
            }

            if ($files = $request->file('other_documents')) {
                $path = 'public/dnaneer/'.$user_id.'/institutional/documents';
                foreach ($files as $key => $file) {
                    $path = $file->store($path);
                    $name = $file->getClientOriginalName();
                    $pathnew = str_replace('public', 'storage', $path);
                    $documents_data[$key]['module_id'] = $institutionalKYC->id;
                    $documents_data[$key]['link'] = $pathnew;
                    $documents_data[$key]['original_name'] = $name;
                    $documents_data[$key]['user_id'] = $user_id;
                    $documents_data[$key]['module'] = "kyc_other_documents";
                    $documents_data[$key]['created_at'] = date('Y-m-d H:i:s');
                }
                $documents = Documents::insert($documents_data);
            }

            if ($files = $request->file('bank_documents')) {
                $path = 'public/dnaneer/'.$user_id.'/institutional/documents';
                foreach ($files as $key => $file) {
                    $path = $file->store($path);
                    $name = $file->getClientOriginalName();
                    $pathnew = str_replace('public', 'storage', $path);
                    $documents_data[$key]['module_id'] = $institutionalKYC->id;
                    $documents_data[$key]['link'] = $pathnew;
                    $documents_data[$key]['original_name'] = $name;
                    $documents_data[$key]['user_id'] = $user_id;
                    $documents_data[$key]['module'] = "kyc_other_documents";
                    $documents_data[$key]['created_at'] = date('Y-m-d H:i:s');
                }
                $documents = Documents::insert($documents_data);
            }

            $user = User::where('id', $request->user_id)->first();
            $user->kyc_step = 2;
            $user->save();
            // Return the saved model instance with HTTP 201 Created status
            return response()->json([
                'status' => 'success',
                'message' => 'KYC details added successfully.',
                'files' => Documents::whereIn('module', ['kyc_other_documents', 'kyc_legal_documents'])->where('user_id',$request->user_id)->get(),
                'data' => $institutionalKYC,
            ], 201);
        }
        if ($request->kyc_step == 3){
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'kyc_step' => 'required',
                'user_id' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user = User::where('id', $request->user_id)->first();
            $user->kyc_step = 3;
            $user->save();

            $notification_data = [
                'user_id' => $user->id,
                'title' => 'KYC form submission',
                'text' => 'Thanks you for kyc form submission. Please wait for admin approval.',
                'url' => null,
                'admin_text' => 'An institutional user '.$user->name.' submitted the kyc form.',
                'admin_url' => null
            ];

            AddNotification($notification_data, true);

            //Admin Notification 
            // $adminNotification = getAdmin();
            // Notification::send($adminNotification, new InstitutionalKYCNotification($user, 'admin'));
            // //User Notification
            // Notification::send($user, new InstitutionalKYCNotification($user, 'user'));
            
            return response()->json([
                'status' => 'success',
                'message' => 'KYC details added successfully.'
            ], 201);
        }
       
    }


    public function addUserProfileImage(Request $request)
    {
        // Get the uploaded file
        $file = $request->file('image');

        // Set up the OSS client
        $accessKeyId = env('ALIBABA_CLOUD_ACCESS_KEY_ID');
        $accessKeySecret = env('ALIBABA_CLOUD_ACCESS_KEY_SECRET');
        $endpoint = env('ALIBABA_CLOUD_OSS_ENDPOINT');
        $bucket = env('ALIBABA_CLOUD_OSS_BUCKET');
        try {
            $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
        } catch (OssException $e) {
            // Handle exception
            return response()->json(['error' => $e->getMessage()]);
        }

        // Generate a unique filename for the uploaded file
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();

        // Upload the file to OSS
        try {
            $ossClient->putObject($bucket, $filename, $file->get(), [
                OssClient::OSS_HEADERS => [
                    'Content-Type' => $file->getClientMimeType()
                ]
            ]);
        } catch (OssException $e) {
            // Handle exception
            return response()->json(['error' => $e->getMessage()]);
        }

        // Update the user's profile image URL in the database
        $user = User::find($request->user_id);
        $user->profile_image_url = $filename;
        $user->save();

        // Return the updated user object
        return response()->json($user);
    }
}
