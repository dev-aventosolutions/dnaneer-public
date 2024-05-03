<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BorrowerRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\BorrowerDocuments;
use App\Models\UserAccounts;
use App\Models\Installments;

class BorrowerController extends Controller
{
    public function searchRegistrationNumber(Request $request){
        return get_wathq_info($request);
    }

    public function cr_data(){
        $user_id = Auth::id();
        $data = BorrowerRequest::with('user','borrower_documents_for_single_request','accounts')->where('user_id', $user_id)->first();
        return response()->json([
            'status' => 'success',
            'data' => [
                'data' => $data
            ],
        ], 200);
    }

    public function updatekyc(Request $request){
        if($request->step == 1){
            $validator = Validator::make($request->all(), [
                'user_id' => 'required',
                'name' => 'required',
                'dob' => 'required',
                'saudi_id_number' => 'required',
                'position' => 'required',
                // 'phone_number' => 'required|unique:borrower_requests,phone_number',
                'phone_number' => 'required',
                'company_endorsement' =>'required'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 422);
            }
    
            $detail = BorrowerRequest::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                'name' => $request->name,
                'dob' => $request->dob,
                'saudi_id_number' => $request->saudi_id_number,
                'position' => $request->position,
                'phone_number' => $request->phone_number,
                'company_endorsement' => $request->company_endorsement,
                'high_level_mission' => $request->high_level_mission,
                'senior_position' => $request->senior_position,
                'marriage_relationship' => $request->marriage_relationship,
                'step' => 1
            ]);
    
            $user = User::where('id', $request->user_id)->first();
            $user->phone_number = $request->phone_number;
            $user->name = $request->name;
            $user->kyc_step = 1;
            $user->save();

            return response()->json([
                'status' => 'true',
                'message' => 'Borrower KYC data updated successfully.'
            ], 200);
        }elseif($request->step == 2){
            //Documents Work here

            // $validator = Validator::make($request->all(), [
            //     'Commercial_Registration' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Article_of_Association' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'VAT_registration_certificate' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Saudization_certificate' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'GOSI_certificate' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Chamber_of_Commerce_certificate' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     // 'Additional_documents' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Partner_agreement' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Bank_statement_for_the_last_12_months' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Financial_statements_for_the_last_fiscal_year' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     'Bank_account_identification_certificate' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',
            //     // 'Bank_Additional_documents' => 'required|mimes:pdf,png,jpg,jpeg,docx,xlsx',                
            //     ],[
            //         'Commercial_Registration.required' => 'Please upload required document.',
            //         'Commercial_Registration.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Article_of_Association.required' => 'Please upload required document.',
            //         'Article_of_Association.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'VAT_registration_certificate.required' => 'Please upload required document.',
            //         'VAT_registration_certificate.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Saudization_certificate.required' => 'Please upload required document.',
            //         'Saudization_certificate.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'GOSI_certificate.required' => 'Please upload required document.',
            //         'GOSI_certificate.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Chamber_of_Commerce_certificate.required' => 'Please upload required document.',
            //         'Chamber_of_Commerce_certificate.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         // 'Additional_documents.required' => 'Please upload required document.',
            //         // 'Additional_documents.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Partner_agreement.required' => 'Please upload required document.',
            //         'Partner_agreement.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Bank_statement_for_the_last_12_months.required' => 'Please upload required document.',
            //         'Bank_statement_for_the_last_12_months.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Financial_statements_for_the_last_fiscal_year.required' => 'Please upload required document.',
            //         'Financial_statements_for_the_last_fiscal_year.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         'Bank_account_identification_certificate.required' => 'Please upload required document.',
            //         'Bank_account_identification_certificate.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         // 'Bank_Additional_documents.required' => 'Please upload required document.',
            //         // 'Bank_Additional_documents.mimes' => 'Only pdf,png,jpg,jpeg,docx,xlsx files are allowed',
            //         // 'files.*.max' => 'Sorry! Maximum allowed size for an image is 20MB',
            //     ]);
            // if ($validator->fails()) {
            //     return response()->json(['message' => $validator->errors()->first()], 422);
            // }
            $user_id = $request->user_id;
            $iban = $request->iban;

            $basepath = 'public/dnaneer/borrower/'.$user_id.'/kyc';

            if($request->file('Commercial_Registration')){
                $documents_data = [];
                $file = $request->file('Commercial_Registration');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Commercial Registration' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Article_of_Association')){
                $documents_data = [];
                $file = $request->file('Article_of_Association');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Article Of Association' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('VAT_registration_certificate')){
                $documents_data = [];
                $file = $request->file('VAT_registration_certificate');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'VAT Registration Certificate' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Saudization_certificate')){
                $documents_data = [];
                $file = $request->file('Saudization_certificate');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Saudization Certificate' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('GOSI_certificate')){
                $documents_data = [];
                $file = $request->file('GOSI_certificate');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'GOSI Certificate' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Chamber_of_Commerce_certificate')){
                $documents_data = [];
                $file = $request->file('Chamber_of_Commerce_certificate');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Chamber Of Commerce Certificate' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Additional_documents')){
                $documents_data = [];
                $file = $request->file('Additional_documents');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Additional Documents' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Partner_agreement')){
                $documents_data = [];
                $file = $request->file('Partner_agreement');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Partners Agreement To Hire Authorized Person To Request Funding' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Bank_statement_for_the_last_12_months')){
                $documents_data = [];
                $file = $request->file('Bank_statement_for_the_last_12_months');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Bank Statement For The Last 12 Months';
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Financial_statements_for_the_last_fiscal_year')){
                $documents_data = [];
                $file = $request->file('Financial_statements_for_the_last_fiscal_year');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Financial Statements For The Last Fiscal Year' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Bank_account_identification_certificate')){
                $documents_data = [];
                $file = $request->file('Bank_account_identification_certificate');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Bank Account Identification Certificate' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }
            if($request->file('Bank_Additional_documents')){
                $documents_data = [];
                $file = $request->file('Bank_Additional_documents');
                $path = $file->store($basepath);
                $name = $file->getClientOriginalName();
                $pathnew = str_replace('public', 'storage', $path);
                $documents_data['link'] = $pathnew;
                $documents_data['type'] = 'Bank Additional Documents' ;
                $documents_data['user_id'] = $user_id;
                $documents_data['original_name'] = $name;
                $documents_data['created_at'] = Date('Y-m-d H:i:s');
                $documents_data['updated_at'] = Date('Y-m-d H:i:s');
                $documents = BorrowerDocuments::insert($documents_data);
            }

            $borrower_request = BorrowerRequest::where('user_id', $request->user_id)->first();
            $borrower_request->step = 2;
            $borrower_request->save();

            $user = User::where('id', $request->user_id)->first();
            $user->kyc_step = 2;
            $user->save();

            $accounts = UserAccounts::where('user_id', $user_id)->first();
            $accounts->personal_iban_number = $iban;
            $accounts->bank_id = $request->bank_id;
            $accounts->save();
            return response()->json([
                'status' => 'true',
                'message' => 'KYC Files Uploaded successfully.'
            ], 200);
        }elseif($request->step == 3){
            $validator = Validator::make($request->all(), [
                'user_id' => 'required',
                'seeking_amount' => 'required',
                'repayment_duration' => 'required',
                'existing_obligations' => 'required'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()->first()], 422);
            }
    
            $detail = BorrowerRequest::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                'seeking_amount' => $request->seeking_amount,
                'repayment_duration' => $request->repayment_duration,
                'existing_obligations' => $request->existing_obligations,
                'step' => 3
            ]);
            $user = User::where('id', $request->user_id)->first();
            $user->kyc_step = 3;
            $user->save();
            //Send SMS

            SendOTP($request->user_id, 'Borrower step3');
            return response()->json([
                'status' => 'true',
                'message' => 'Borrower KYC data updated successfully.'
            ], 200);
        }

    }

    function updatedocs(Request $request){
        $validator = Validator::make($request->all(),[ 
            'id' => 'required|integer',
        ]);   

      if($validator->fails()) {          
          return response()->json(['error'=>$validator->errors()->first()], 401);                        
       }
       $doc = BorrowerDocuments::where('id', $request->id)->first();
       $user_id = $doc->user_id;
       $basepath = 'public/dnaneer/borrower/'.$user_id.'/kyc';
       if($request->file('file')){
            $documents_data = [];
            $file = $request->file('file');
            $path = $file->store($basepath);
            $name = $file->getClientOriginalName();
            $pathnew = str_replace('public', 'storage', $path);
            $doc->link = $pathnew;
            $doc->original_name = $name;
            $doc->updated_at = Date('Y-m-d H:i:s');
            $doc->save();
        }
        return response()->json([
            "success" => true,
            "message" => "Document updated successfully.",
            "file" => $doc
        ]);

    }

    function updateUserProfile(Request $request){
        $validator = Validator::make($request->all(),[ 
            'image' => 'required|mimes:png,jpg,jpeg|max:5048',
        ]);   

      if($validator->fails()) {          
          return response()->json(['error'=>$validator->errors()->first()], 401);                        
       }  
       $user_id = Auth::id();
      if ($file = $request->file('image')) {
          $path = 'public/dnaneer/'.$user_id.'/profile';
          $path = $file->store($path);
          $name = $file->getClientOriginalName();
          $path = str_replace('public', 'storage', $path);

          $save = User::find($user_id);
          $save->profile_image_url= $path;
          $save->save();
            
          return response()->json([
              "success" => true,
              "message" => "Profile image successfully uploaded",
              "file" => $path
          ]);

      }
    }
    
    function borrowerDetails(){
        $user_id = Auth::id();
        $profile = User::with('borrower.bank','accounts', 'advisor','classification', 'borrower_documents')->find($user_id);
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $profile,
            ],
        ], 200);
    }

    function getInstallments(Request $request){
        if (Auth::check()) {
            $user_id = Auth::id();
            $user = BorrowerRequest::where('user_id', $user_id)->first();
            if(!empty($user)){
                $installments = Installments::where('borrower_request_id', $user->id)->get();
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'installments' => $installments,
                    ],
                ], 200);
            }else{
                return response()->json([
                    'status' => 'failed',
                    'message' => 'No Borrower request against this user.'
                ], 401);
            }
            
        } else {
            return response()->json([
            'status' => 'failed',
            'message' => 'UnAuthorized user.'
        ], 401);
        }
    }

    function getInstallmentById($id){
        $data = Installments::with('opportunity', 'borrower_request')->where('borrower_request_id', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], 200);
    }

    function updateprofile(Request $request){
        $validator = Validator::make($request->all(),[ 
            'user_id' => 'required|integer',
            'name' => 'required',
            'dob' => 'required',
            'saudi_id_number' => 'required',
            'position' => 'required',
            'phone_number' => 'required',
            'seeking_amount' => 'required',
            'repayment_duration' => 'required',
            'existing_obligations' => 'required',
            'personal_iban_number' => 'required',
            'bank_id' => 'required'
        ]);   

      if($validator->fails()) {          
          return response()->json(['error'=>$validator->errors()->first()], 401);                        
       }  
       $detail = BorrowerRequest::updateOrCreate([
        'user_id'   => $request->user_id,
        ],[
            'name' => $request->name,
            'dob' => $request->dob,
            'saudi_id_number' => $request->saudi_id_number,
            'position' => $request->position,
            'phone_number' => $request->phone_number,
            'seeking_amount' => $request->seeking_amount,
            'repayment_duration' => $request->repayment_duration,
            'existing_obligations' => $request->existing_obligations,
        ]);

        $user = User::where('id', $request->user_id)->first();
        $user->phone_number = $request->phone_number;
        $user->name = $request->name;
        $user->save();

        $accounts = UserAccounts::where('user_id', $request->user_id)->first();
        $accounts->personal_iban_number = $request->personal_iban_number;
        $accounts->bank_id = $request->bank_id;
        $accounts->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile data has been updated.'
        ], 200);
    }

    function borrowerHistory(){
        if(Auth::check()){
            $data = BorrowerRequest::with('opportunity.installments')->where('user_id',Auth::id())->get();
            return response()->json([
                'status' => 'success',
                'data' => $data,
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Unauthenticated.'
            ], 200);
        }
    }
}
