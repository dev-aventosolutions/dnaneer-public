<?php

namespace App\Providers;

use App\Models\User;
use App\Notifications\NafathOTPNotification;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
// use Nafath\NafathOTPNotification;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if(env('APP_ENV') == 'Production'){
            \URL::forceScheme('https');
        }

    }

    public function sendNafathOTP(Request $request)
{
    // Validate the input
    $validator = Validator::make($request->all(), [
        'national_id' => 'required|numeric',
    ]);

    if ($validator->fails()) {
        // Return the response
        return response()->json([
            'status' => 'error',
            'message' => $validator->errors(),
        ], 400);
    }

    // Generate a Nafath OTP
    if(env('EMAIL_OTP') == 'Production'){
        $nafath_otp = mt_rand(1000, 9999); 
    }else{
        $nafath_otp = 1111;
    }

    // Get the user from the user table
    $user = User::where('national_id', $request->national_id)->first();

    // Send the Nafath OTP to the user's Nafath app
    $user->notify(new NafathOTPNotification($nafath_otp));

    // Return the response
    return response()->json([
        'status' => 'success',
        'message' => 'A Nafath OTP has been sent to your Nafath app.',
    ], 200);
}

}
