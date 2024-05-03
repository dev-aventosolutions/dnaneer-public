<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Opportunity;
use App\Models\Installments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function createLoan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'opportunity_id' => 'required|integer|unique:loans|exists:opportunities,id',
                'principal_amount' => 'required|numeric',
                'net_roi' => 'required|numeric',
                'annual_interest_rate' => 'required|numeric',
                'annual_interest_amount' => 'required|numeric',
                'total_amount_before_fees' => 'required|numeric',
                'origination_rate' => 'required|numeric',
                'origination_fee' => 'required|numeric',
                'borrower_to_receive' => 'required|numeric',
                'carrying_fee' => 'required|numeric',
                'borrower_to_pay' => 'required|numeric',
                'tenor' => 'required|integer',
                'dnaneer_carrying_fee' => 'required|numeric',
                'net_repayment' => 'required|numeric',
                'return' => 'required|numeric',
                'installments' => 'required|array',
                'installments.*.amount' => 'required|numeric',
                'installments.*.due_date' => 'required|date_format:Y-m-d',
                'installments.*.principal' => 'required|numeric',
                'installments.*.interest' => 'required|numeric',
                'installments.*.fees' => 'required|numeric',
                'installments.*.status' => 'required',
                'installments.*.description' => 'nullable|string',
            ]);
            if ($validator->fails()) {
                $error = $validator->errors()->first();
                return response()->json([
                    'success' => false,
                    'message' => $error
                ], 422);
            }

            DB::beginTransaction();

            $loan = Loan::create([
                'opportunity_id' => $request->opportunity_id,
                'principal_amount' => $request->principal_amount,
                'net_roi' => $request->net_roi,
                'annual_interest_rate' => $request->annual_interest_rate,
                'annual_interest_amount' => $request->annual_interest_amount,
                'total_amount_before_fees' => $request->total_amount_before_fees,
                'origination_rate' => $request->origination_rate,
                'origination_fee' => $request->origination_fee,
                'borrower_to_receive' => $request->borrower_to_receive,
                'carrying_fee' => $request->carrying_fee,
                'borrower_to_pay' => $request->borrower_to_pay,
                'tenor' => $request->tenor,
                'status' => 'active',
                'dnaneer_carrying_fee' => $request->dnaneer_carrying_fee,
                'net_repayment' => $request->net_repayment,
                'return' => $request->return
            ]);

            if ($loan) {
                $opportunity = Opportunity::where('id', $request->opportunity_id)->first();
                $borrower_request_id = $opportunity->borrower_request_id;

                $allInstallments = [];
                $installments = $request->installments;

                foreach ($installments as $installment) {
                    $tempArray['opportunity_id'] = $request->opportunity_id;
                    $tempArray['amount'] = $installment['amount'];
                    $tempArray['due_date'] = $installment['due_date'];
                    $tempArray['principal'] = $installment['principal'];
                    $tempArray['interest'] = $installment['interest'];
                    $tempArray['fees'] = $installment['fees'];
                    $tempArray['description'] = $installment['description'];
                    $tempArray['status'] = $installment['status'];
                    $tempArray['borrower_request_id'] = $borrower_request_id;
                    $tempArray['loan_id'] = 1;
                    $tempArray['created_at'] = Date('Y-m-d H:i:s');
                    $tempArray['updated_at'] = Date('Y-m-d H:i:s');
                    array_push($allInstallments, $tempArray);
                }
                Installments::insert($allInstallments);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Loan and installments have been created successfully'
            ], 201);

        } catch (\Throwable $th) {
            DB::rollBack();
            return $th->getMessage();
        }
    }

    public function getLoans(Request $request)
    {
        try {
            $per_page = $request->input('per_page', 10);
            $page_no = $request->input('page_no', 1);
            $status = $request->input('status');

            $loans = Loan::when($request->has('status'), function ($query) use ($request) {
                // Add where clause only if 'status' is present in the request
                return $query->where('status', $request->status);
            })
            ->paginate($per_page, ['*'], 'page_no', $page_no);

            return response()->json([
                'success' => true,
                'data' => $loans
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'false',
                'exception' => $th->getMessage()
            ], 400);
        }
    }

    public function updateLoan(Request $request)
    {
        try {
            $loan = Loan::find($request->loan_id);
            return response()->json([
                'success' => true,
                'data' => 'Loan updated successfully'
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'false',
                'exception' => $th->getMessage()
            ], 400);
        }
    }
}
