<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\BorrowerRequest;
use App\Models\BorrowerDocuments;
use App\Models\UserAccounts;
use App\Models\FinancialAdvisor;
use App\Models\Opportunity;
use App\Models\Installments;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BorrowerAdminController extends Controller
{
    function getBorrowers(){
        $borrowers = User::select('users.*', 'borrower_requests.cr_number','user_accounts.user_id','user_accounts.dnaneer_account_no','user_accounts.personal_iban_number','user_accounts.bank_id','user_accounts.balance')->where('user_type', 3)->where('is_admin', '<>', 1)
        ->leftjoin('borrower_requests', 'users.id', 'borrower_requests.user_id')
        ->leftjoin('user_accounts', 'users.id', 'user_accounts.user_id')->orderBy('users.created_at', 'desc')->paginate(10);
        return response()->json([
            'status' => 'success',
            'data' => [
                $borrowers
            ],
        ], 200);
    }

    function updateProfileData(Request $request){
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
            'bank_id' => 'required',
            'advisor_id' => 'required'
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
            'company_endorsement' => $request->company_endorsement,
            'high_level_mission' => $request->high_level_mission,
            'senior_position' => $request->senior_position,
            'marriage_relationship' => $request->marriage_relationship,
            'seeking_amount' => $request->seeking_amount,
            'repayment_duration' => $request->repayment_duration,
            'existing_obligations' => $request->existing_obligations,
        ]);

        $user = User::where('id', $request->user_id)->first();
        $user->phone_number = $request->phone_number;
        $user->name = $request->name;
        $user->advisor_id = !empty($request->advisor_id) ? $request->advisor_id : null;
        $user->save();

        $accounts = UserAccounts::where('user_id', $request->user_id)->first();
        $accounts->personal_iban_number = $request->personal_iban_number;
        $accounts->bank_id = $request->bank_id;
        $accounts->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Your data has been updated.'
        ], 200);
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
            $doc->save();
        }
        return response()->json([
            "success" => true,
            "message" => "Document updated successfully.",
            "file" => $doc
        ]);

    }

    function get_single_borrower(Request $request, $id){
        $user =  User::where('id', $id)->where('user_type', 3)->first();
        if(!empty($user)){
            // $profile =  User::with('borrower','classification' , 'accounts', 'advisor', 'borrower_documents')->find($user->id);
            $borrower = BorrowerRequest::select('users.*', 'borrower_requests.cr_number','borrower_requests.business_name','borrower_requests.business_activity','borrower_requests.legal_type','borrower_requests.capital','borrower_requests.cr_expiry_date','borrower_requests.address','borrower_requests.saudi_id_number','borrower_requests.position','borrower_requests.phone_number','borrower_requests.dob','borrower_requests.repayment_duration','borrower_requests.status','borrower_requests.seeking_amount','borrower_requests.existing_obligations','borrower_requests.high_level_mission','borrower_requests.high_level_mission','borrower_requests.senior_position','borrower_requests.marriage_relationship','user_accounts.dnaneer_account_no','user_accounts.personal_iban_number','user_accounts.bank_id','user_accounts.balance', 'banks.name as bank_name')->with('borrower_documents')
            ->join('users', 'users.id', 'borrower_requests.user_id')
            ->leftjoin('user_accounts', 'users.id', 'user_accounts.user_id')
            ->leftjoin('banks', 'banks.id', 'user_accounts.bank_id')
            ->where('users.id', $user->id)->first();
            $advisors = FinancialAdvisor::get();
            $borrower_request = BorrowerRequest::where('user_id', $id)->first();
            $opp_data = null;
            $installments = null;
            if(!empty($borrower_request)){
                $opp_data = Opportunity::where('borrower_request_id', $borrower_request->id)->first();
                $installments = Installments::where('borrower_request_id', $borrower_request->id)->get();
            }
            return response()->json([
                'status' => 'success',
                'data' => [
                    $borrower,
                ],
                'advisors' => $advisors,
                'opportunity' => $opp_data,
                'installments' =>$installments
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Borrower not found.',
            ], 200);
        }
     }

     function borrower_requests(Request $request){

        $borrower_requests = BorrowerRequest::with('user')->orderBy('borrower_requests.created_at', 'desc')->paginate(10);
        return response()->json([
            'status' => 'success',
            'data' => [
                $borrower_requests
            ],
        ], 200);
     }

     function borrower_requests_by_id(Request $request, $id){
        $borrower_requests = BorrowerRequest::with('user','accounts','borrower_documents_for_single_request')->where('id', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => [
                $borrower_requests
            ],
        ], 200);
     }

    function update_request(Request $request){
        $validator = Validator::make($request->all(), [
            'request_id' => 'required|integer',
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $req = BorrowerRequest::where('id', $request->request_id)->first();
        if(!empty($req)){
            $req->status = $request->status;
            $req->save();
            if($request->status == "approved"){
                $user = user::find($req->user_id);
                $user->kyc_step = 5;
                $user->save();
                SendOTP($req->user_id, 'Borrower_Accepted');
            }
            if($request->status == "rejected"){
                $user = user::find($req->user_id);
                $user->kyc_step = 4;
                $user->save();
                SendOTP($req->user_id, 'Borrower_Rejected');
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Borrower request status has been updated.',
                'data' => [
                    $req
                ]
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Borrower request not found'
            ], 400);
        }

    }

    function borrowerHistory(Request $request, $id){
        $data = BorrowerRequest::with('opportunity.installments', 'opportunity.loan', 'opportunity.investments.user')->where('user_id',$id)->get();
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], 200);
    }

    function exportBorrowersCSV(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'page_no' => 'required|integer',
                'per_page' => 'required|integer',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $pageNumber = $request->page_no;
            $perPage = $request->per_page;
            $totalRecordsCount = $perPage * $pageNumber;

            $borrowers = User::select('users.*', 'borrower_requests.cr_number','user_accounts.user_id','user_accounts.dnaneer_account_no','user_accounts.personal_iban_number','user_accounts.bank_id','user_accounts.balance')->where('user_type', 3)->where('is_admin', '<>', 1)
            ->leftjoin('borrower_requests', 'users.id', 'borrower_requests.user_id')
            ->leftjoin('user_accounts', 'users.id', 'user_accounts.user_id')
            ->orderBy('users.created_at', 'desc')
            ->limit($totalRecordsCount)
            ->get();

            foreach ($borrowers as $borrower) {
                $borrower->wathq = json_decode($borrower->wathq);
            }

            $csvData = "Company,Name,Email,CR Number,Created Date,Status\n";

            foreach ($borrowers as $borrower) {
                $csvData .= $borrower->wathq->crName . "," . $borrower->name . "," . $borrower->email . "," . $borrower->wathq->crNumber . "," . $borrower->created_at . "," . $borrower->status . "\n";
            }
    
            // Generate a unique filename for the CSV
            $filename = "borrowers_" . time() . ".csv";
            $storagePath = 'dnaneer/borrowers/csv_files/' . $filename;

            // Save the CSV file to the public disk
            Storage::disk('public')->put($storagePath, $csvData);

            $fileUrl = asset('storage/' . $storagePath);
    
            // Return a response with a link to the generated file
            return response()->json([
                'status' => 'success',
                'data' => $fileUrl
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'false',
                'exception' => $th->getMessage()
            ], 400);
        }
    }

    function exportBorrowerRequestsCSV(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'page_no' => 'required|integer',
                'per_page' => 'required|integer',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $pageNumber = $request->page_no;
            $perPage = $request->per_page;
            $totalRecordsCount = $perPage * $pageNumber;

            $borrowerRequests = BorrowerRequest::with('user')
                ->orderBy('borrower_requests.created_at', 'desc')            
                ->limit($totalRecordsCount)
                ->get();

            $csvData = "Company,Name,Email,CR Number,Status\n";

            foreach ($borrowerRequests as $borrower) {
                $csvData .= $borrower->business_name . "," . $borrower->name . "," . $borrower->user->email . "," . $borrower->cr_number . "," . $borrower->status . "\n";
            }
    
            // Generate a unique filename for the CSV
            $filename = "borrower_requests_" . time() . ".csv";
            $storagePath = 'dnaneer/borrower_requests/csv_files/' . $filename;

            // Save the CSV file to the public disk
            Storage::disk('public')->put($storagePath, $csvData);
            $fileUrl = asset('storage/' . $storagePath);
    
            // Return a response with a link to the generated file
            return response()->json([
                'status' => 'success',
                'data' => $fileUrl
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'false',
                'exception' => $th->getMessage()
            ], 400);
        }
    }
}
