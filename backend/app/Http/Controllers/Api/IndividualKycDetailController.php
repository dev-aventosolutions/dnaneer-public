<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IndividualKycDetail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserAccounts;
use Illuminate\Support\Facades\File;
use PDF;

class IndividualKycDetailController extends Controller
{
    public function storeKYC(Request $request)
    {
        $user_id = $request->user_id;
        if($request->kyc_step == 1){
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'kyc_step' => 'required',
                'user_id' => 'required',
                'education' => 'required',
                'employee' => 'required',
                'current_company' => 'required_if:employee,Yes',
                'current_position' => 'required_if:employee,Yes',
                'current_experience' => 'required_if:employee,Yes'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $individualKYC = IndividualKYCDetail::updateOrCreate([
                'user_id'   => $user_id,
            ],[
                'education' => $request->education,
                'employee' => $request->employee,
                'current_company' => $request->employee == "Yes" ? $request->current_company : null,
                'current_position' => $request->employee == "Yes" ? $request->current_position : null,
                'current_experience' => $request->employee == "Yes" ? $request->current_experience : null,
                'high_level_mission' => $request->high_level_mission,
                'senior_position' => $request->senior_position,
                'marriage_relationship' => $request->marriage_relationship
            ]);

            $user = User::where('id', $request->user_id)->first();
            $user->kyc_step = 1;
            $user->save();
    
            // Return the saved model instance with HTTP 201 Created status
            return response()->json([
                'status' => 'success',
                'message' => 'KYC details added successfully.',
                'data' => [
                    $individualKYC
                ],
            ], 200);
        }

        if ($request->kyc_step == 2){
            $validator = Validator::make($request->all(), [
                'kyc_step' => 'required',
                'user_id' => 'required',
                'source_of_income' => 'required',
                'average_income' => 'required',
                'net_worth' => 'required',
                'investment_objectives' => 'required',
                'investment_knowledge' => 'required',
                'iban' => 'required',
                'bank_id' => 'required',
                // 'poa_file' => 'required|file',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $individualKYC = IndividualKYCDetail::updateOrCreate([
                'user_id'   => $user_id,
            ],[
                'source_of_income' => $request->source_of_income,
                'average_income' => $request->average_income,
                'net_worth' => $request->net_worth,
                'investment_objectives' => $request->investment_objectives,
                'investment_knowledge' => $request->investment_knowledge
            ]);

            $account = UserAccounts::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                'personal_iban_number' => $request->iban,
                'bank_id'    => $request->bank_id,
            ]);

            $user = User::where('id', $request->user_id)->first();
            $user->kyc_step = 2;
            $user->save();
    
            // Return the saved model instance with HTTP 201 Created status
            return response()->json([
                'status' => 'success',
                'message' => 'KYC details added successfully.',
                'data' => [
                    $individualKYC
                ],
            ], 200);

        }

        if ($request->kyc_step == 3){
            $validator = Validator::make($request->all(), [
                'kyc_step' => 'required',
                'user_id' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $poaAgreement = $request->poa_agreement;
            $pdf = PDF::loadHTML($poaAgreement);
            $pdfPath = "storage/app/storage/dnaneer/poa-agreements/individual/poa-agreement-" . time() . '.pdf';

            // Ensure the directory exists
            if (!File::exists(dirname($pdfPath))) {
                File::makeDirectory(dirname($pdfPath), 0755, true, true);
            }

            $pdf->save($pdfPath);
            $user = User::where('id', $request->user_id)->first();
            $user->poa_agreement = $pdfPath;
            $user->kyc_step = 3;
            $user->save();
            
            $notification_data = [
                'user_id' => $user->id,
                'title' => 'KYC form submission',
                'text' => 'Thanks you for kyc form submission. Please wait for admin approval.',
                'url' => null,
                'admin_text' => 'An individual user '.$user->name.' submitted the kyc form.',
                'admin_url' => null
            ];

            AddNotification($notification_data, true);

            // Return the saved model instance with HTTP 201 Created status
            return response()->json([
                'status' => 'success',
                'message' => 'KYC details added successfully.',
                'data' => [
                    // $individualKYC
                ],
            ], 200);

        }

    }
}

