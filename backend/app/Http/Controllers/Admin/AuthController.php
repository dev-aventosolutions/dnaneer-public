<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Auth;

class AuthController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function login(Request $request)
    {

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        if(Auth::attempt(['email' => strtolower($request->email), 'password' => $request->password])){
            $user = Auth::user();
            if($user->is_admin == 1){
                $token = $user->createToken('DnaneerApp')->plainTextToken;
                return response()->json([
                    'token' => $token,
                    'user' => $user
                ], 200);
            }else{
                return response()->json([
                    'message' => 'Unauthorized Action performed.'
                ], 401);
            }
            
        }

        // Authentication failed
        return response()->json([
            'message' => 'Invalid email or password.'
        ], 401);
    }

    public function logout()
    {
        if (Auth::check()) {
            $token = Auth::user()->tokens();
            $token->delete();
            return response()->json([
                'message' => 'Admin is logout',
            ], 200);
        } 
        else{
            // Authentication failed
            return response()->json([
                'message' => 'Unauthorised.'
            ], 401);
        } 
    }

}

?>
