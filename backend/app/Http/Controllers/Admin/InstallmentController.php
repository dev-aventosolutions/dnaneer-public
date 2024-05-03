<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Installments;

class InstallmentController extends Controller
{
    function get_installment(Request $request, $id){
        $Installments = Installments::where('opportunity_id', $id)->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $Installments
            ],
        ], 200);
    }
    function create_installment(Request $request){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'opportunity_id' => 'required',
            'amount' => 'required',
            'due_date' => 'required',
            'principal' => 'required',
            'interest' => 'required',
            'fees' => 'required',
            'loan_id' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $Installments = new Installments();
        $Installments->opportunity_id = $request->opportunity_id;
        $Installments->amount = $request->amount;
        $Installments->due_date = $request->due_date;
        $Installments->principal = $request->principal;
        $Installments->interest = $request->interest;
        $Installments->fees = $request->fees;
        $Installments->description = isset($request->description) ? $request->description : null;
        $Installments->loan_id = $request->loan_id;
        $Installments->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Installment added successfully.',
            'data' => [
                $Installments
            ],
        ], 201);
        
    }

    function update_installment(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'opportunity_id' => 'required',
            'amount' => 'required',
            'due_date' => 'required',
            'principal' => 'required',
            'interest' => 'required',
            'fees' => 'required',
            'loan_id' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $Installments = Installments::where('id', $id)->first();
        $Installments->opportunity_id = $request->opportunity_id;
        $Installments->amount = $request->amount;
        $Installments->due_date = $request->due_date;
        $Installments->principal = $request->principal;
        $Installments->interest = $request->interest;
        $Installments->fees = $request->fees;
        $Installments->description = isset($request->description) ? $request->description : null;
        $Installments->loan_id = $request->loan_id;
        $Installments->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Installment updated successfully.',
            'data' => [
                $Installments
            ],
        ], 200);
        
    }

    function get_single_installment(Request $request, $id){
        $Installments = Installments::where('id', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => [
                $Installments
            ],
        ], 200);
    }

    function delete_installment(Request $request, $id){
        $Installments = Installments::where('id', $id)->delete();
        if($Installments){
            return response()->json([
                'status' => 'success',
                'message' => 'Installments deleted successfully.',
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Some problem in deleting data.'
            ], 400);
        }
        
    }

    function update_opporrtunity_installment(Request $request){
        $validator = Validator::make($request->all(), [
            'opportunity_id' => 'required|integer', // Example: Ensure opportunity_id is present and an integer.
            'installments' => 'required|array|min:1', // Example: Ensure installments is an array with at least one element.
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $installments = $request->installments;

        if (!empty($installments)) {
            foreach ($installments as $ins) {
                if (isset($ins['id'])) { // Check if 'id' key exists
                    $Installment = Installments::where('opportunity_id', $request->opportunity_id)->where('id',$ins['id'])->first();
                    if ($Installment) {
                        $Installment->fill([
                            'opportunity_id' => $request->opportunity_id,
                            'amount' => $ins['amount'], // Use $ins data here
                            'due_date' => $ins['due_date'],
                            'principal' => $ins['principal'],
                            'interest' => $ins['interest'],
                            'fees' => $ins['fees'],
                            'description' => $ins['description'],
                            'status' => $ins['status'],
                        ])->save();
                    }
                }
            }
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Installments updated successfully.',
            'data' => $request->all()
        ], 200);
        dd();
    }
}
