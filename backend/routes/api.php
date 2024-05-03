<?php
require __DIR__.'/admin.php';

require __DIR__.'/borrower.php';

use App\Http\Controllers\Api\IndividualKycDetailController;
use App\Http\Controllers\Api\InstitutionalKycDetailController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ANBController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\UserOpportunityController;
use App\Http\Controllers\Api\OTPController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\Admin\NotificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
    Route::post('/update-pdf', [PDFController::class, 'updatePDF']);

    Route::get('get-anb-balance', [ANBController::class, 'getBalance']);
    Route::get('get-anb-statement', [ANBController::class, 'getStatement']);
    Route::get('get-anb-eodstatement', [ANBController::class, 'getEodStatement']);
    
     
    Route::get('send-mail', [UserController::class, 'html_email']);
    Route::get('jwt-token', [UserController::class, 'jwtToken']);
    Route::post('nafath-callback', [UserController::class, 'nafathCallBackURL']);
    Route::get('decode-callback', [UserController::class, 'decodeJwt']);

    // Before Login Route
    Route::controller(AuthController::class)->group(function(){
        Route::post('login', 'login');
        Route::post('signup', 'signup');
        Route::post('/signup-institutional', 'signupInstitutional');
        Route::post('/generate-otp', 'generateOTP');
        Route::post('/verify-otp', 'verifyOtp');
        Route::post('/verify-login-otp', 'verifyLoginOtp');
        Route::get('bank_list', 'bankList');
    });
    Route::post('password/email', [ForgotPasswordController::class, 'forgot']);
    Route::post('password/reset', [ForgotPasswordController::class, 'reset'])->name('password.reset');

    //Wathq Routes
    Route::post('/search-registration-number', [InstitutionalKycDetailController::class, 'searchRegistrationNumber']);
    //Nafath Routes
    Route::post('/send-nafath-notification', [UserController::class, 'sendNafathRequest']);
    Route::post('/nafath-notification-status', [UserController::class, 'nafathRequestStatus']);

    // After Login Route
    Route::middleware(['auth:sanctum'])->group(function(){
        Route::post('logout',[AuthController::class,'logout']);
        Route::get('/deactivate', [UserController::class, 'deactivate']);
        Route::post('/change_password', [UserController::class, 'changePassword']);

        Route::get('/poa-agreement', [UserController::class, 'poa_agreement']);

        Route::post('/institutional-kyc-details', [InstitutionalKycDetailController::class, 'storeKYC']);
        Route::post('/individual-kyc-details', [IndividualKycDetailController::class, 'storeKYC']);
        Route::get('/get-user', [UserController::class, 'userDetail']);
        Route::post('/upgrade-account', [UserController::class, 'upgradeAccount']);
        Route::get('/investor-opportunities', [UserOpportunityController::class, 'index']);
        Route::get('/get_single_opportunity/{id}', [UserOpportunityController::class, 'get_single_opportunity']);
        Route::get('/my_investments', [UserOpportunityController::class, 'my_investments']);
        Route::get('/get_investment_by_id/{id}', [UserOpportunityController::class, 'get_investment_by_id']);
        Route::get('/get_classifications', [UserController::class, 'get_classifications']);
        
        Route::post('update_individual_investor', [UserController::class, 'updateIndividualInvestor']);
        Route::post('update_institutional_investor', [UserController::class, 'updateInstitutionalInvestor']);

        Route::post('fund_transfer', [UserController::class, 'fundTransfer']);
        
        Route::post('/invest-now', [UserOpportunityController::class, 'investNow']);
        Route::get('/get-transactions', [UserOpportunityController::class, 'getTransactions']);
        Route::post('update-userprofileimage', [UserController::class, 'updateUserProfile']);
        Route::get('/send-absher-otp', [OTPController::class, 'sendAbsherOTP']);
        Route::post('/verify-absher-otp', [OTPController::class, 'verifyAbsherOTP']);
        Route::post('/send-unifonic-otp', [OTPController::class, 'unifonicSendOTP']);
        Route::post('/verify-unifonic-otp', [OTPController::class, 'verifyUnifonicSendOTP']);

        //Notifications
        Route::get('/get_latest_notification_user', [NotificationController::class, 'get_latest_notification_user']);
        Route::get('/notifications', [NotificationController::class, 'get_user_notifications']);
    });

    // Nafath routes to verify contact person
    Route::post('verify-institute-contact-person', [UserController::class, 'verifyInstituteContactPerson']);
    Route::post('verify-contact-person-nafath-code', [UserController::class, 'verifyContactPersonNafathCode']);

    Route::post('/investor-profile-image', [InstitutionalKycDetailController::class, 'addUserProfileImage']);
