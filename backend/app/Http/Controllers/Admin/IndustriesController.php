<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Industries;

class IndustriesController extends Controller
{

    function get_industries(Request $request){
        $industries = Industries::where('status',1)->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $industries
            ],
        ], 200);
    }
    function create_industry(Request $request){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $exist = Industries::where('name', $request->name)->exists();
        if($exist){
            return response()->json([
                'status' => 'error',
                'message' => 'Duplicate Industry name found.'
            ], 422);
        }
        $industries = new Industries();
        $industries->name = $request->name;
        $industries->status = 1;
        $industries->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Industy added successfully.',
            'data' => [
                $industries
            ],
        ], 201);
        
    }

    function update_industry(Request $request, $id){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            "name" => 'required|unique:industries,name,'.$id,
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $industries = Industries::where('id', $id)->first();
        $industries->name = $request->name;
        $industries->status = $request->status;
        $industries->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Industy updated successfully.',
            'data' => [
                $industries
            ],
        ], 200);
        
    }

    function get_single_industry(Request $request, $id){
        $industries = Industries::where('id', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => [
                $industries
            ],
        ], 200);
    }

    function delete_industry(Request $request, $id){
        $industries = Industries::where('id', $id)->delete();
        if($industries){
            return response()->json([
                'status' => 'success',
                'message' => 'Industry deleted successfully.',
            ], 200);
        }else{
            return response()->json([
                'status' => 'error',
                'message' => 'Some problem in deleting data.'
            ], 400);
        }
        
    }

    

}

?>