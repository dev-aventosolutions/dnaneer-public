<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\FinancialAdvisor;
use Illuminate\Support\Facades\Storage;

class FinancialAdvisorController extends Controller
{
    function get_advisor(Request $request){
        $FinancialAdvisor = FinancialAdvisor::get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $FinancialAdvisor
            ],
        ], 200);
    }
    function create_advisor(Request $request){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:financial_advisors',
            'phone_no' => 'required',
            'whatsapp_no' => 'required',
            'image' => 'required|mimes:png,jpg,jpeg|max:5048',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $path = null;
        if ($file = $request->file('image')) {
            $path = 'public/dnaneer/advisor';
            $path = $file->store($path);
            $name = $file->getClientOriginalName();
            $path = str_replace('public', 'storage', $path);
        }
        $FinancialAdvisor = new FinancialAdvisor();
        $FinancialAdvisor->name = $request->name;
        $FinancialAdvisor->email = $request->email;
        $FinancialAdvisor->phone_no = $request->phone_no;
        $FinancialAdvisor->whatsapp_no = $request->whatsapp_no;
        $FinancialAdvisor->image = $path;
        $FinancialAdvisor->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Financial Advisor added successfully.',
            'data' => [
                $FinancialAdvisor
            ],
        ], 201);
        
    }

    function update_advisor(Request $request, $id){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'phone_no' => 'required',
            'whatsapp_no' => 'required',
            "email" => 'required|unique:financial_advisors,email,'.$id,
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $FinancialAdvisor = FinancialAdvisor::where('id', $id)->first();
        $FinancialAdvisor->name = $request->name;
        $FinancialAdvisor->email = $request->email;
        $FinancialAdvisor->phone_no = $request->phone_no;
        $FinancialAdvisor->whatsapp_no = $request->whatsapp_no;
        
        if ($file = $request->file('image')) {
            $path = 'public/dnaneer/advisor';
            $path = $file->store($path);
            $name = $file->getClientOriginalName();
            $path = str_replace('public', 'storage', $path);
            $FinancialAdvisor->image = $path;

        }
        
        $FinancialAdvisor->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Financial advisor updated successfully.',
            'data' => [
                $FinancialAdvisor
            ],
        ], 200);
        
    }

    function get_single_advisor(Request $request, $id){
        $FinancialAdvisor = FinancialAdvisor::where('id', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => [
                $FinancialAdvisor
            ],
        ], 200);
    }

    function delete_advisor(Request $request, $id){
        $FinancialAdvisor = FinancialAdvisor::where('id', $id)->delete();
        if($FinancialAdvisor){
            return response()->json([
                'status' => 'success',
                'message' => 'Financial advisor deleted successfully.',
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Some problem in deleting data.'
            ], 400);
        }
        
    }

    function export_advisors_csv(Request $request) {
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

            $financialAdvisors = FinancialAdvisor::limit($totalRecordsCount)->get();
            $csvData = "Name,Email,Date,Phone,WhatsApp\n";

            foreach ($financialAdvisors as $financialAdvisor) {
                $csvData .= $financialAdvisor->name . "," . $financialAdvisor->email . "," . $financialAdvisor->created_at . "," . $financialAdvisor->phone_no . "," . $financialAdvisor->whatsapp_no . "\n";
            }

            // Generate a unique filename for the CSV
            $filename = "financial_advisors_" . time() . ".csv";
            $storagePath = 'dnaneer/financial_advisors/csv_files/' . $filename;

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
