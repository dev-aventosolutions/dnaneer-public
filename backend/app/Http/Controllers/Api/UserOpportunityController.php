<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Investments;
use App\Models\Transactions;
use Illuminate\Support\Str;
use DB;
use Auth;
use App\Models\User;
use App\Models\UserAccounts;
use App\Notifications\InvestNowNotification;
use Illuminate\Support\Facades\Notification;


class UserOpportunityController extends Controller
{
    public function index()
    {
        $userOpportunities = Opportunity::select('opportunities.*', 'industries.name as industry_name', 'locations.name as location', 'financing_types.name as financing_type', 'financing_structures.name as financing_structure')
        ->leftjoin('industries', 'opportunities.industry_id', 'industries.id')
        ->leftjoin('financing_types', 'opportunities.financing_type_id', 'financing_types.id')
        ->leftjoin('financing_structures', 'opportunities.financing_structure_id', 'financing_structures.id')
        ->leftjoin('locations', 'opportunities.location_id', 'locations.id')
        ->with('documents')
        ->where('opportunities.opportunity_status', 'active')
        ->orwhere('opportunities.opportunity_status', 'comingsoon')
        ->orwhere('opportunities.opportunity_status', 'defaulted')
        ->orderBy('created_at','desc')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Investor opportunities List',
            'data' => $userOpportunities,
        ], 200);
    }

    public function investNow(Request $request){
        try {
            DB::beginTransaction(); //start transaction
            $invest = new Investments();
            $invest->user_id = $request->user_id;
            $invest->opportunity_id = $request->opportunity_id;
            $invest->amount = $request->amount;
            $invest->save();

            if($invest){
                $transaction = new Transactions();
                $transaction->investment_id = $invest->id;
                $transaction->user_id = $request->user_id;
                $transaction->title = "Investment";
                $transaction->ref_number = Str::random(10);
                $transaction->amount = $request->amount;
                $transaction->transaction_type = "debit";
                $transaction->type = "investment";
                $transaction->status = "active";
                $transaction->save();

                $opportunity = Opportunity::find($request->opportunity_id);
                $opportunity->fund_collected = $opportunity->fund_collected + $request->amount;
                

                $account = UserAccounts::where('user_id', Auth::id())->first();
                $account->balance = $account->balance - $request->amount;
                $account->save();

                if($opportunity->fund_collected == $opportunity->fund_needed){
                    $opportunity->opportunity_status = 'completed';
                }
                $opportunity->save();
                //Admin Notification 
                // $adminNotification = getAdmin();
                // Notification::send($adminNotification, new InvestNowNotification($transaction, 'admin', $opportunity));
                // //User Notification
                // $userNotification = getCurrentUser($request->user_id);
                // Notification::send($userNotification, new InvestNowNotification($transaction, 'user', $opportunity));

                DB::commit();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Investment submitted successfully.',
                ], 200);
            }
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
    
    function getTransactions(){

        $transaction = User::where('id', Auth::id())->where('is_admin', 0)->with('transactions')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Transactions',
            'data' => $transaction
        ], 200);
    }
    
    function get_single_opportunity(Request $request, $id){

        $invested = Investments::where('user_id', Auth::id())->where('opportunity_id', $id)->exists();

        $opportunity = Opportunity::select('opportunities.*', 'industries.name as industry_name', 'locations.name as location', 'financing_types.name as financing_type', 'financing_structures.name as financing_structure')
        ->leftjoin('industries', 'opportunities.industry_id', 'industries.id')
        ->leftjoin('financing_types', 'opportunities.financing_type_id', 'financing_types.id')
        ->leftjoin('financing_structures', 'opportunities.financing_structure_id', 'financing_structures.id')
        ->leftjoin('locations', 'opportunities.location_id', 'locations.id')
        ->with('documents')
        ->with('investments')
        ->where('opportunities.id', $id)
        ->orderBy('created_at','desc')->first();

        if(!empty($opportunity)){
            $opportunity->already_invested = $invested;
            return response()->json([
                'status' => 'success',
                'data' => [
                    $opportunity
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'success',
                'message' => 'Not found.'
            ], 400);
        }
    }

    function my_investments(Request $request){

        $Investments = Investments::join('opportunities', 'investments.opportunity_id', 'opportunities.id')->where('investments.user_id', Auth::id())->get();
        if(!empty($Investments)){
            return response()->json([
                'status' => 'success',
                'data' => [
                    $Investments
                ],
            ], 200);
        }else{
            return response()->json([
                'status' => 'success',
                'message' => 'Not found.'
            ], 400);
        }

    }

    function get_investment_by_id($id){
        $investment = Investments::select('investments.id as id', 'opportunities.*','users.name', 'users.national_id', 'users.dob', 'users.mode')->join('opportunities', 'investments.opportunity_id', 'opportunities.id')->join('users', 'users.id', 'investments.user_id')->where('investments.user_id', Auth::id())->where('investments.id', $id)->first();
        if(!empty($investment)){
            return response()->json([
                'status' => 'success',
                'data' =>$investment
            ], 200);
        }else{
            return response()->json([
                'status' => 'success',
                'message' => 'Not found.'
            ], 400);
        }
    }

}
