<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Location;

class LocationController extends Controller
{

    function get_location(Request $request){
        $Location = Location::get();
        return response()->json([
            'status' => 'success',
            'data' => [
                $Location
            ],
        ], 200);
    }
    function create_location(Request $request){
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
        $exist = Location::where('name', $request->name)->exists();
        if($exist){
            return response()->json([
                'status' => 'error',
                'message' => 'Duplicate location name found.'
            ], 422);
        }
        $Location = new Location();
        $Location->name = $request->name;
        $Location->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Location added successfully.',
            'data' => [
                $Location
            ],
        ], 201);
        
    }

    function update_location(Request $request, $id){
        // Validate the request data
        $validator = Validator::make($request->all(), [
            "name" => 'required|unique:Location,name,'.$id,
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $Location = Location::where('id', $id)->first();
        $Location->name = $request->name;
        $Location->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Location updated successfully.',
            'data' => [
                $Location
            ],
        ], 200);
        
    }

    function get_single_location(Request $request, $id){
        $Location = Location::where('id', $id)->first();
        return response()->json([
            'status' => 'success',
            'data' => [
                $Location
            ],
        ], 200);
    }

    function delete_location(Request $request, $id){
        $Location = Location::where('id', $id)->delete();
        if($Location){
            return response()->json([
                'status' => 'success',
                'message' => 'Location deleted successfully.',
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