<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\BorrowerController;
use App\Http\Controllers\Admin\NotificationController;
// Before Login
Route::prefix('borrower')->group(function(){
    Route::post('/login', [AuthController::class , 'loginBorrower']);
    Route::post('/register', [AuthController::class, 'registerBorrower']);
    Route::post('/verifyloginotp', [AuthController::class, 'verifyBorrowerLogin']);
    Route::post('/generate-otp', [AuthController::class, 'generateBorrowerOTP']);

});

// After Login
Route::prefix('borrower')->middleware(['auth:sanctum', 'isBorrower'])->group(function () {
    Route::post('/search-registration-number', [BorrowerController::class, 'searchRegistrationNumber']);
    Route::get('/cr_data', [BorrowerController::class, 'cr_data']);
    Route::get('/borrower-history', [BorrowerController::class, 'borrowerHistory']);
    Route::get('/get-borrower-details', [BorrowerController::class, 'borrowerDetails']);
    
    Route::post('/updateprofile', [BorrowerController::class, 'updateprofile']);
    Route::post('/updatekyc', [BorrowerController::class, 'updatekyc']);
    Route::post('update-userprofileimage', [BorrowerController::class, 'updateUserProfile']);
    Route::get('/get-borrower-installment', [BorrowerController::class, 'getInstallments']);
    Route::get('/get-borrower-installment/{id}', [BorrowerController::class, 'getInstallmentById']);

    //Notifications
    Route::get('/get_latest_notification_borrower', [NotificationController::class, 'get_latest_notification_user']);
    Route::get('/notifications', [NotificationController::class, 'get_user_notifications']);

    Route::post('/logout', [AuthController::class , 'logout']);

});

?>