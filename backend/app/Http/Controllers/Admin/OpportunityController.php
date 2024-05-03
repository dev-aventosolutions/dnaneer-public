<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Auth;
use App\Models\Opportunity;
use Illuminate\Validation\Rule;
use DB;
use App\Models\Banks;
use App\Models\FinancingStructure;
use App\Models\FinancingType;
use App\Models\Location;
use App\Models\Industries;
use App\Models\Documents;
use App\Models\Installments;
use App\Models\Investments;
use App\Models\UserAccounts;
use App\Models\Transactions;
use App\Models\Cities;
use App\Models\BorrowerRequest;
use App\Models\User;
use App\Models\UserClassification;

use Illuminate\Support\Facades\Storage;

class OpportunityController extends Controller
{

    function opportunity_approve(Request $request){
        $validator = Validator::make($request->all(), [
            'status' => 'required',
            'reject_note' => 'required_if:status,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id = $request->opportunity_id;
        $status = $request->status;
        $op = Opportunity::where('id',$id)->first();
        $borrower_request_id = $op->borrower_request_id;
        if(!empty($op)){
            $op->opportunity_status = $status;
            
            if($status == "rejected"){
                //here we need to reverse every transaction and investment.
                $amount = 0;
                $investments = Investments::where('opportunity_id', $id)->get();
                foreach ($investments as $key => $inv) {
                    $inv->status = $status;
                    $inv->save();
                    $amount = $amount + $inv->amount;
                    
                    $transaction = Transactions::where('investment_id', $inv->id)->first();
                    $transaction->status = $status;
                    $transaction->save();

                    $account = UserAccounts::where('user_id', $inv->user_id)->first();
                    $account->balance = $account->balance + $transaction->amount;
                    $account->save();
                }
                $op->reject_note = $request->reject_note;
                $op->fund_collected = ($op->fund_collected - $amount);
                $op->save();

                return response()->json([
                    'status' => 'success',
                    'data' => [
                        $op
                    ],
                ], 200);
            }
    
            if($status == "closed"){
                $op->save();
                //close and make installments
                $installment_array = [];
                $installments = $request->installments;
                foreach ($installments as $key => $ins) {
                    $installment_array[$key]['opportunity_id'] = $op->id;
                    $installment_array[$key]['borrower_request_id'] = $op->borrower_request_id;
                    $installment_array[$key]['amount'] = $ins['amount'];
                    $installment_array[$key]['due_date'] = $ins['due_date'];
                    $installment_array[$key]['principal'] = $ins['principal'];
                    $installment_array[$key]['interest'] = $ins['interest'];
                    $installment_array[$key]['fees'] = $ins['fees'];
                    $installment_array[$key]['description'] = $ins['description'];
                    $installment_array[$key]['status'] = $ins['status'];
                    $installment_array[$key]['created_at'] = Date('Y-m-d H:i:s');
                }

                $installment_success = Installments::insert($installment_array);
                $br_request = BorrowerRequest::select('id','user_id')->where('id', $borrower_request_id)->first();
                if(!empty($br_request)){
                    $user = User::where('id', $br_request->user_id)->where('user_type', 3)->first();
                    if(!empty($user)){
                        $user->kyc_step = 5;
                        $user->save();
                        return response()->json([
                            'status' => 'success',
                            'data' => [
                                $installment_array
                            ],
                        ], 200);
                    }else{
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Borrower Not found.'
                        ], 400);
                    }
                   
                }else{
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Borrower Request Not found.'
                    ], 400);
                }
            }
        }

    }

    function opportunityListing(Request $request){
        $opportunity = Opportunity::select('opportunities.*', 'industries.name as industry_name', 'cities.name as city_name', 'financing_types.name as financing_type', 'financing_structures.name as financing_structure')
        ->leftjoin('industries', 'opportunities.industry_id', 'industries.id')
        ->leftjoin('financing_types', 'opportunities.financing_type_id', 'financing_types.id')
        ->leftjoin('financing_structures', 'opportunities.financing_structure_id', 'financing_structures.id')
        ->leftjoin('cities', 'opportunities.location_id', 'cities.id')
        ->with('documents')
        ->with('investments')
        ->orderBy('created_at','desc')->get();

        if(!empty($opportunity)){
            return response()->json([
                'status' => 'success',
                'data' => [
                    $opportunity
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Not found.'
            ], 400);
        }
    }

    function create_opportunity(Request $request){
        $validator = Validator::make($request->all(), [
            "opportunity_number" => "required",
            "industry_id" => "required|integer",
            "annual_roi" => "required",
            "net_roi" => "required",
            "risk_score" => "required",
            "duration" => "required",
            "repayment_period" => "required",
            "fund_collected" => "required",
            "fund_needed" => "required",
            "financing_structure_id" => "required",
            "financing_type_id" => "required",
            "due_date" => "required",
            "distributed_returns" => "required",
            "cr_number" => "required",
            "annual_revenue" => "required",
            "establishment_date" => "required",
            "location_id" => "required",
            "custom_created_at" => "required",
            'files.*' => 'required|mimes:pdf'
            ],[
                'files.*.required' => 'Please upload an documents',
                'files.*.mimes' => 'Only pdf files are allowed',
                // 'files.*.max' => 'Sorry! Maximum allowed size for an image is 20MB',
            ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $exist = Opportunity::where('opportunity_number', $request->opportunity_number)->exists();
        if($exist){
            return response()->json([
                'status' => 'error',
                'message' => 'Duplicate opportunity number found.'
            ], 422);
        }
        try {
            DB::beginTransaction(); //start transaction
            $user_id = Auth::id();

            $opportunity = new Opportunity();
            //Basic Details
            $opportunity->opportunity_number = $request->opportunity_number;
            $opportunity->industry_id = $request->industry_id;
            $opportunity->risk_score = $request->risk_score;
            $opportunity->duration = $request->duration;
            $opportunity->repayment_period = $request->repayment_period;
            $opportunity->custom_created_at = $request->custom_created_at;
            //Financing Details
            $opportunity->financing_structure_id = $request->financing_structure_id;
            $opportunity->financing_type_id = $request->financing_type_id;
            $opportunity->annual_roi = $request->annual_roi;
            $opportunity->net_roi = $request->net_roi;
            $opportunity->created_at = $request->created_at;
            $opportunity->due_date = $request->due_date;
            $opportunity->distributed_returns = $request->distributed_returns;
            $opportunity->fund_needed = $request->fund_needed;
            $opportunity->fund_collected = $request->fund_collected;
            
            //Company Details
            $opportunity->status = 1;
            $opportunity->cr_number = $request->cr_number;
            $opportunity->company_name = $request->company_name;
            $opportunity->establishment_date = $request->establishment_date;
            $opportunity->company_location = $request->company_location;
            $opportunity->company_legal_structure = $request->company_legal_structure;
            $opportunity->annual_revenue = $request->annual_revenue;
            $opportunity->location_id = $request->location_id;
            $opportunity->created_by = $user_id;
            $opportunity->opportunity_status = $request->opportunity_status;
            //Contact Details
            $opportunity->contact_name =$request->contact_name;
            $opportunity->contact_email =$request->contact_email;
            $opportunity->contact_phone_number =$request->contact_phone_number;
            $opportunity->bank_id =$request->bank_id;
            $opportunity->iban =$request->iban;
            $opportunity->borrower_request_id =$request->borrower_request_id;
            
            $opportunity->save();
            $documents_data = null;
            if ($files = $request->file('files')) {
                $path = 'public/dnaneer/'.$user_id.'/opportunity/documents';
                // $data = UploadFiles($user_id, $opportunity->id, $request->module,$files, $path);
                foreach ($files as $key => $file) {
                    // dd($file);
                    $pathnew = $file->store($path);
                    $name = $file->getClientOriginalName();
                    $path = str_replace('public', 'storage', $pathnew);
                    $documents_data[$key]['module_id'] = $opportunity->id;
                    $documents_data[$key]['link'] = $path;
                    $documents_data[$key]['original_name'] = $name;
                    $documents_data[$key]['user_id'] = $user_id;
                    $documents_data[$key]['module'] = 'opportunity';
                }
                $documents = Documents::insert($documents_data);
            }
            DB::commit();

            // return the response
            return response()->json([
                'status' => 'success',
                'message' => 'Opportunity created successfully.',
                'files' => Documents::where('module', 'opportunity')->where('module_id',$opportunity->id)->get(),
                'data' => $opportunity,
            ], 201);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return response()->json([
                'status' => 'false',
                'message' => 'Failed to insert data.',
                'exception' => $th->getMessage() 
            ], 400);
        }
        
    }

    function update_opportunity(Request $request, $id){
        $validator = Validator::make($request->all(), [
            "opportunity_number" => 'required|unique:opportunities,opportunity_number,'.$id,
            "industry_id" => "required|integer",
            "annual_roi" => "required",
            "net_roi" => "required",
            "risk_score" => "required",
            "duration" => "required",
            "repayment_period" => "required",
            "fund_collected" => "required",
            "fund_needed" => "required",
            "financing_structure_id" => "required",
            "financing_type_id" => "required",
            "due_date" => "required",
            "distributed_returns" => "required",
            "cr_number" => "required",
            "annual_revenue" => "required",
            "establishment_date" => "required",
            "location_id" => "required",
            "custom_created_at" => "required"
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $opportunity = Opportunity::where('id', $id)->first();
        //Basic Details
        $opportunity->opportunity_number = $request->opportunity_number;
        $opportunity->industry_id = $request->industry_id;
        $opportunity->risk_score = $request->risk_score;
        $opportunity->duration = $request->duration;
        $opportunity->repayment_period = $request->repayment_period;
        $opportunity->custom_created_at = $request->custom_created_at;
        //Financing Details
        $opportunity->financing_structure_id = $request->financing_structure_id;
        $opportunity->financing_type_id = $request->financing_type_id;
        $opportunity->annual_roi = $request->annual_roi;
        $opportunity->net_roi = $request->net_roi;
        $opportunity->created_at = $request->created_at;
        $opportunity->due_date = $request->due_date;
        $opportunity->distributed_returns = $request->distributed_returns;
        $opportunity->fund_needed = $request->fund_needed;
        $opportunity->fund_collected = $request->fund_collected;
        $opportunity->opportunity_status = $request->opportunity_status;

        //Company Details
        $opportunity->status = $request->status;
        $opportunity->cr_number = $request->cr_number;
        $opportunity->company_name = $request->company_name;
        $opportunity->establishment_date = $request->establishment_date;
        $opportunity->company_location = $request->company_location;
        $opportunity->company_legal_structure = $request->company_legal_structure;
        
        
        $opportunity->annual_revenue = $request->annual_revenue;
        $opportunity->location_id = $request->location_id;
        
        //Contact Details
        $opportunity->contact_name =$request->contact_name;
        $opportunity->contact_email =$request->contact_email;
        $opportunity->contact_phone_number =$request->contact_phone_number;
        $opportunity->bank_id =$request->bank_id;
        $opportunity->iban =$request->iban;
        $opportunity->borrower_request_id =$request->borrower_request_id;

        $opportunity->created_by = Auth::id();

        $opportunity->save();

        // return the response
        return response()->json([
            'status' => 'success',
            'message' => 'Opportunity updated successfully.',
            'data' => [
                $opportunity
            ],
        ], 201);
    }

    function get_single_opportunity(Request $request, $id){

        $opportunity = Opportunity::select('opportunities.*', 'industries.name as industry_name', 'cities.name as city_name', 'financing_types.name as financing_type', 'financing_structures.name as financing_structure')
        ->leftjoin('industries', 'opportunities.industry_id', 'industries.id')
        ->leftjoin('financing_types', 'opportunities.financing_type_id', 'financing_types.id')
        ->leftjoin('financing_structures', 'opportunities.financing_structure_id', 'financing_structures.id')
        ->leftjoin('cities', 'opportunities.location_id', 'cities.id')
        ->with('documents','installments')
        ->where('opportunities.id', $id)
        ->orderBy('opportunities.created_at','desc')
        ->with(['investments'=>function($query){
            $query->select('users.id as user_id','opportunity_id', 'investments.id as key','investments.amount', 'investments.status','users.email','investments.created_at');
        }])->first();
        

        if(!empty($opportunity)){
            return response()->json([
                'status' => 'success',
                'data' => [
                    $opportunity
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Not found.'
            ], 400);
        }
    }

    function delete_opportunity(Request $request, $id){

        $opportunity = Opportunity::where('id', $id)->delete();
        if($opportunity){
            return response()->json([
                'status' => 'success',
                'message' => 'Opportunity deleted successfully.',
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Some problem in deleting data.'
            ], 400);
        }
    }

    function opportunity_dropdown_data(){
        $data['borrower_request'] = $this->getBorrowerRequests();
        $data['financing_structure'] = FinancingStructure::select('id','name')->get();
        $data['financing_type'] = FinancingType::select('id','name')->get();
        $data['classifications'] = UserClassification::select('id','name')->where('status',1)->get();
        $data['bank_list'] = Banks::select('id','name','logo')->where('status',1)->get();
        $data['industries'] = Industries::select('id','name')->where('status',1)->get();
        $data['cities'] = Cities::select('id','name')->where('status',1)->get();

        
        
        $data['opportunity_status'] = ['active','inactive','comingsoon','closed','rejected','settled'];
        return response()->json([
            'status' => 'success',
            'data' => [
                $data
            ],
        ], 200);
    }

    function unlink_borrower_request(Request $request){
        $validator = Validator::make($request->all(), [
            'opportunity_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $op = Opportunity::find($request->opportunity_id);
        if(!empty($op)){
            $op->borrower_request_id = null;
            $op->save();
            return response()->json([
                'status' => 'success',
                'data' => $this->getBorrowerRequests(),
            ], 200);
        }else{
            return response()->json([
                'status' => 'failed',
                'message' => 'No data Found'
            ], 400);
        }

    }

    private function getBorrowerRequests(){
        $fullfiled_ids = Opportunity::pluck('borrower_request_id')->toArray();
        //  Filter out null values
        $filteredArray = array_filter($fullfiled_ids, function ($value) {
            return $value !== null;
        });
        // Get distinct values
        $distinctValues = array_unique($filteredArray);
        // Convert the result to a simple array
        $finalValues = array_values($distinctValues);
        return $data =  BorrowerRequest::select('borrower_requests.id as id','cr_number','business_name','borrower_requests.name','users.email','borrower_requests.phone_number' )
        ->join('users', 'borrower_requests.user_id', 'users.id')
        ->whereNotIn('borrower_requests.id',$finalValues)
        ->where('borrower_requests.status','approved')->get();
    }
    
    function installment_status(){
        $data = ['paid', 'overdue','scheduled', 'pending'];

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], 200);
    }

}

?>