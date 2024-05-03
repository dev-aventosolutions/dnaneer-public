<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Hash;
use Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    // use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    // public function showLinkRequestForm() {
    //     return view('auth.passwords.email');
    // }

    //defining which password broker to use, in our case its the admins
    protected function broker() {
        return Password::broker('users');
    }

    public function forgot() {
        $credentials = request()->validate(['email' => 'required|email']);

        Password::sendResetLink($credentials);
        return response()->json([
            'status' => 'success',
            'message' => 'Reset password link sent on your email id.'
        ], 201);
    }

    public function reset(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required'
        ]);
     
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $reset_password_status = Password::reset($request->all(), function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });

        if ($reset_password_status == Password::INVALID_TOKEN) {
            return response()->json([
                'status' => 'success',
                'message' => 'Invalid token provided.'
            ], 400);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Password has been successfully changed.'
        ], 201);
    }
}
