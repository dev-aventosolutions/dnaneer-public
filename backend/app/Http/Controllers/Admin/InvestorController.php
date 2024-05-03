<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\UserAccounts;
use App\Models\Investments;
use App\Models\IndividualKycDetail;
use App\Models\InstitutionalKycDetail;
use Hash;
use App\Models\TransferRequest;
use App\Models\UpgradeRequests;
use App\Models\UserClassification;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AdminKYCAcceptRejectNotification;
use Illuminate\Support\Facades\Storage;
use PDF;

class InvestorController extends Controller
{

    function getInvestor(Request $request){
        $investors = User::where('is_admin', '<>', 1)->where('user_type', '<>', 3);

        if ($request->has('mode')) {
            $investors->where('mode', $request->mode);
        }

        if ($request->has('userType')) {
            $investors->where('user_type', $request->userType);
        }

        $investors = $investors->join('user_accounts', 'users.id', 'user_accounts.user_id')
            ->orderBy('users.created_at', 'desc')
            ->paginate();

        return response()->json([
            'status' => 'success',
            'data' => [
                $investors
            ],
        ], 200);
    }

    function getSingleInvestor(Request $request, $id){
       $user =  User::where('id', $id)->first();
        if ($user->user_type === 1) {
            $profile =  User::with('individual','classification' , 'accounts', 'advisor', 'documents')->find($user->id);
        } elseif ($user->user_type === 2) {
            $profile =  User::with('institutional','classification' ,'accounts', 'advisor', 'documents')->find($user->id);
        }
    
       return response()->json([
            'status' => 'success',
            'data' => [
                $profile
            ],
        ], 200);
    }

    function updateIndividualInvestor(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        if(!empty($user)){
            // $user->phone_number = $request->phone_number;
            // $user->name = $request->name;
            // $user->email = $request->email;
            // $user->national_id = $request->national_id;
            $user->dob = $request->dob;
            // $user->mode = $request->mode;
            $user->advisor_id = $request->advisor_id;
            $user->classification_id = $request->classification_id;
            $user->save();
    
            $account = UserAccounts::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                'dnaneer_account_no' => $request->dnaneer_account_no,
                'personal_iban_number' => $request->personal_iban_number,
                'dnaneer_iban' => $request->dnaneer_iban,
                'bank_id'    => $request->bank_id,
                'balance'   => $request->balance
            ]);

            $account = IndividualKycDetail::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                'education' => $request->education,
                'employee' => $request->employee,
                'current_company' => $request->current_company,
                'current_position' => $request->current_position,
                'current_experience' => $request->current_experience,
                'source_of_income' => $request->source_of_income,
                'average_income' => $request->average_income,
                'net_worth' => $request->net_worth,
                'plan_to_invest' => $request->plan_to_invest,
                'marriage_relationship' => $request->marriage_relationship,
                'high_level_mission' => $request->high_level_mission,
                'senior_position' => $request->senior_position
                
            ]);

            return response()->json([
                'status' => 'true',
                'message' => 'Investor data updated successfully.'
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Investor not found'
            ], 400);
        }
        

    }
    function updateInstitutionalInvestor(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        if(!empty($user)){
            $user->dob = $request->dob;
            $user->advisor_id = $request->advisor_id;
            $user->classification_id = $request->classification_id;
            $user->save();
    
            $account = UserAccounts::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                'dnaneer_account_no' => $request->dnaneer_account_no,
                'personal_iban_number' => $request->personal_iban_number,
                'dnaneer_iban' => $request->dnaneer_iban,
                'bank_id'    => $request->bank_id,
                'balance'   => $request->balance
            ]);

            $account = InstitutionalKycDetail::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
            'investor_name' => $request->investor_name,
            'id_number' => $request->id_number,
            'position' => $request->position,
            'phone_number' => $request->phone_number,
            'source_of_income' => $request->source_of_income,
            'annual_revenue' => $request->annual_revenue,
            'marriage_relationship' => $request->marriage_relationship,
            'high_level_mission' => $request->high_level_mission,
            'senior_position' => $request->senior_position
            ]);

            return response()->json([
                'status' => 'true',
                'message' => 'Investor data updated successfully.'
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Investor not found'
            ], 400);
        }
        

    }

    function getInvestments(Request $request, $id){

        $user = User::find($id)->first();
        if(!empty($user)){
            $user = $user->where('is_admin', 0)->with('investments')->get();
            return response()->json([
                'status' => 'success',
                'data' => [
                    $user
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Investor not found'
            ], 400);
        }
    }

    function getTransactions(Request $request, $id){

        $user = User::find($id)->first();
        if(!empty($user)){
            $user = User::where('id', $id)->where('is_admin', 0)->with('transactions')->get();
            return response()->json([
                'status' => 'success',
                'data' => [
                    $user
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Investor not found'
            ], 400);
        }
    }

    function acceptInvestment(Request $request){
        $validator = Validator::make($request->all(), [
            'investment_id' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $investment = Investments::where('id', $request->investment_id)->first();
        if(!empty($investment)){
            $investment->status = $request->status;
            $investment->save();
            return response()->json([
                'status' => 'success',
                'data' => [
                    $investment
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Unable to update, something went wrong.'
            ], 400);
        }
    }

    public function vipRequests(){
        $vip = UpgradeRequests::select('upgrade_requests.id as id', 'users.id as user_id', 'email', 'user_type', 'upgrade_requests.criteria_id', 'mode', 'upgrade_requests.document')
        ->join('users', 'users.id', '=', 'upgrade_requests.user_id')
        ->where('upgrade_requests.status', 0)
        ->get();
        foreach ($vip as $key => $req) {
            $criteria = \App\Models\Criteria::select('name')->whereIn('id', json_decode($req->criteria_id))->get();
            $vip[$key]['criteria'] = $criteria;
            unset($vip[$key]['criteria_id']);
        }


        return response()->json([
            'status' => 'success',
            'data' => [
                $vip
            ],
        ], 201);
    }

    function acceptVIPRequests(Request $request){
        $validator = Validator::make($request->all(), [
            'status' => 'required',
            'user_id' => 'required',
            'reject_note' => 'required_if:status,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $req =  UpgradeRequests::where('user_id', $request->user_id)->first();
        if($request->status == "approved"){
            if(!empty($req)){
                $req->status = 1;
                $req->save();
    
                $user = User::where('id', $request->user_id)->first();
                $user->mode = 'vip';
                $user->save();
                return response()->json([
                    'status' => 'true',
                    'message' => 'User mode changed to vip successfully.'
                ], 200);
            }else{
                return response()->json([
                    'status' => 'false',
                    'message' => 'Something went wrong.'
                ], 400);
            }
        }elseif($request->status == "rejected"){
            if(!empty($req)){
                $req->status = 0;
                $req->reject_note = $request->reject_note;
                $req->save();
    
                $user = User::where('id', $request->user_id)->first();
                $user->mode = 'vip';
                $user->save();
                return response()->json([
                    'status' => 'true',
                    'message' => 'User mode changed to vip successfully.'
                ], 200);
            }else{
                return response()->json([
                    'status' => 'false',
                    'message' => 'Something went wrong.'
                ], 400);
            }
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Something went wrong.'
            ], 400);
        }
    }

    public function KYCUsers(){
        $users = User::whereIn('user_type', [1,2])->with('kycdocuments')->where('kyc_step', 3)->where('is_admin', '<>', 1)->get();
        return response()->json([
            'status' => 'success',
            'message' => 'KYC users.',
            'data' => [
                $users
            ],
        ], 201);
    }

    public function KYCRejectedUsers(){
        $users = User::whereIn('user_type', [1,2])->with('kycdocuments')->where('kyc_step', 4)->where('is_admin', '<>', 1)->get();
        return response()->json([
            'status' => 'success',
            'message' => 'KYC rejected users.',
            'data' => [
                $users
            ],
        ], 201);
    }

    public function AcceptInvestorKyc(Request $request){
        $validator = Validator::make($request->all(), [
            'status' => 'required',
            'user_id' => 'required',
            'reject_note' => 'required_if:status,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $user = User::find($request->user_id);
        if($request->status == "approved"){
            $user->kyc_step = 5;
        }

        if($request->status == "rejected"){
            if($user->user_type == 1){
                $detail = IndividualKycDetail::where('user_id',$request->user_id)->first();
                $detail->reject_note = $request->reject_note;
                $detail->save();
            }else{
                $detail = InstitutionalKycDetail::where('user_id',$request->user_id)->first();
                $detail->reject_note = $request->reject_note;
                $detail->save();
            }
            $user->kyc_step = 4;
        }
        $user->save();

       //User Notification
    //    Notification::send($user, new AdminKYCAcceptRejectNotification($user, $request->status));

        return response()->json([
            'status' => 'success',
            'message' => 'KYC updated successfully.',
            'data' => [
                $user
            ],
        ], 201);
    }

    function getadmins(){
        $users = User::where('is_admin', 1)->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $users
            ],
        ], 200);
    }

    public function createSubAdmin(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the user
        $user = new User();
        $user->user_type = 0;
        $user->is_admin = 1;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Admin added successfully.',
            'data' => [
                $user
            ],
        ], 201);
    }

    function getTransferRequest(Request $request){
        $status = $request->status;
        if($status == "all"){
            $transfer_requests = TransferRequest::select('users.name as user_name', 'email', 'user_type','mode','transfer_requests.created_at', 'banks.name as bank_name','transfer_requests.*')
            ->join('users', 'transfer_requests.user_id', 'users.id')
            ->join('banks', 'transfer_requests.bank_id', 'banks.id')
            ->orderBy('created_at', 'desc')->get();
        }else{
            $transfer_requests = TransferRequest::select('users.name as user_name', 'email', 'user_type','mode','transfer_requests.created_at', 'banks.name as bank_name','transfer_requests.*')
            ->join('users', 'transfer_requests.user_id', 'users.id')
            ->join('banks', 'transfer_requests.bank_id', 'banks.id')
            ->where('transfer_requests.status', $status)
            ->orderBy('created_at', 'desc')->get();
        }
        
        return response()->json([
            'status' => 'success',
            'data' => [
                $transfer_requests
            ],
        ], 201);
    }

    function transfer_request_by_id(Request $request, $id){
       
        $transfer_request = TransferRequest::where('id', $id)->first();
        if(!empty($transfer_request)){
            $user_id = $transfer_request->user_id;
            $user = User::select('user_type')->where('id', $user_id)->first();
            if(!empty($user)){
                if($user->user_type == 1){
                  $data = TransferRequest::with('user','individual','bank')->where('id', $id)->first();
                  return response()->json([
                    'status' => 'success',
                    'data' => $data,
                ], 201);

                }elseif($user->user_type == 2){
                    $data = TransferRequest::with('user','institutional','bank')->where('id', $id)->first();
                    return response()->json([
                      'status' => 'success',
                      'data' => $data,
                  ], 201);
                }else{
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid user type.'
                    ], 401);
                }

            }
        }
    }

    

    function updateTransferRequest(Request $request){
        $validator = Validator::make($request->all(), [
            'status' => 'required',
            'id' => 'required',
            'reject_note' => 'required_if:status,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = TransferRequest::where('id', $request->id)->first();
        if(!empty($data)){
            if($request->status == "approved"){
                //Transfer the fund to the account.
                $data->status = 'approved';
                $data->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Transfer request approved successfully.',
                    'data' => [
                        $data
                    ],
                ], 201);
            }

            if($request->status == "rejected"){
                //Reject the Fund request with Reject reason.
                $account = UserAccounts::where('user_id', $data->user_id)->first();
                $running_balance = ($account->balance + $data->amount);
                $account->balance = $running_balance;
                $account->save();
                //Update data in TranserRequest
                $data->status = 'rejected';
                $data->reject_reason = $request->reject_note;
                $data->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Transfer request rejected successfully.',
                    'data' => [
                        $data
                    ],
                ], 201);
            }
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong.'
            ], 401);
        }
    }

    function GetClassifications(){
        $data= UserClassification::select('id','name')->where('status',1)->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $data
            ],
        ], 201);
    }

    function get_investment_by_id($id){
        $investment = Investments::select('investments.id as id', 'investments.*', 'users.name', 'opportunities.opportunity_number')->where('investments.id', $id)
        ->join('users','users.id', 'investments.user_id')
        ->join('opportunities','opportunities.id', 'investments.opportunity_id')
        ->first();
        if(!empty($investment)){
            return response()->json([
                'status' => 'success',
                'data' => $investment,
            ], 201);
        }else{
            return response()->json([
                'status' => 'failed',
                'data' => null,
                'message' => 'No record found.'
            ], 400);
        }

    }

    function exportInvestorsCSV(Request $request) {
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

            $investors = User::whereIn('user_type', [1, 2])->where('is_admin', '<>', 1)
                ->leftjoin('user_accounts', 'users.id', 'user_accounts.user_id')
                ->orderBy('users.created_at', 'desc')
                ->limit($totalRecordsCount)
                ->get();

            $csvData = "Email,IBAN Account #,Dnaneer Account #,Creation Date,Type,Mode,Status\n";

            foreach ($investors as $investor) {
                $csvData .= $investor->email . "," . $investor->personal_iban_number . "," . $investor->dnaneer_iban . "," . $investor->created_at . "," . $investor->user_type . "," . $investor->mode . "," . $investor->status . "\n";
            }
    
            // Generate a unique filename for the CSV
            $filename = "investors_" . time() . ".csv";
            $storagePath = 'dnaneer/investors/csv_files/' . $filename;

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

    function exportInvestorPDF(Request $request) {
        try {
            $user = User::where('id', $request->investor_id)->first();
            $data = [];
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
            $data['user_type'] = $user->user_type;
           
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

            // Generate the PDF
            // $fileName = $profile->name . " " . time();
            $pdf = PDF::loadView('pdf.investor-pdf-template', $data);
            return $pdf->download('document.pdf');
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'false',
                'exception' => $th->getMessage()
            ], 400);
        }
    }
}
