<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\OpportunityController;
use App\Http\Controllers\Admin\IndustriesController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\InvestorController;
use App\Http\Controllers\Admin\FinancialAdvisorController;
use App\Http\Controllers\Admin\InstallmentController;
use App\Http\Controllers\Admin\BorrowerAdminController;
use App\Http\Controllers\Admin\LoanController;
use App\Http\Controllers\Admin\NotificationController;

    // before Login Admin Routes
    Route::prefix('admin')->group(function(){
        Route::post('/login', [AuthController::class , 'Login']);
    });

 

    Route::prefix('admin')->middleware(['auth:sanctum', 'isAdmin'])->group(function () {
        Route::post('/logout', [AuthController::class , 'logout']);
        Route::get('/getadmins', [InvestorController::class , 'getadmins']);

        //Create subAdmin
        Route::post('/create_sub_admin', [InvestorController::class, 'createSubAdmin']);
        //Listing Routes
        Route::get('/oppurtunity_list', [OpportunityController::class, 'opportunityListing']);
        Route::post('/create_opportunity', [OpportunityController::class, 'create_opportunity']);
        Route::post('/update_opportunity/{id}', [OpportunityController::class, 'update_opportunity']);
        Route::get('/get_single_opportunity/{id}', [OpportunityController::class, 'get_single_opportunity']);
        Route::delete('/delete_opportunity/{id}', [OpportunityController::class, 'delete_opportunity']);
        Route::post('/opportunity_approve', [OpportunityController::class, 'opportunity_approve']);
        Route::post('/unlink-borrower-request', [OpportunityController::class, 'unlink_borrower_request']);
        Route::get('/installmentStatus', [OpportunityController::class, 'installment_status']);

        Route::get('/opportunity_dropdown_data', [OpportunityController::class, 'opportunity_dropdown_data']);
        Route::post('/upload_opportunity_documents', [OpportunityController::class, 'opportunity_documents']);

        //Industry Routes
        Route::get('/get_industries_list', [IndustriesController::class, 'get_industries']);
        Route::post('/create_industry', [IndustriesController::class, 'create_industry']);
        Route::post('/update_industry/{id}', [IndustriesController::class, 'update_industry']);
        Route::get('/get_single_industry/{id}', [IndustriesController::class, 'get_single_industry']);
        Route::delete('/delete_industry/{id}', [IndustriesController::class, 'delete_industry']);

        //Location Routes
        Route::get('/get_location_list', [LocationController::class, 'get_location']);
        Route::post('/create_location', [LocationController::class, 'create_location']);
        Route::post('/update_location/{id}', [LocationController::class, 'update_location']);
        Route::get('/get_single_location/{id}', [LocationController::class, 'get_single_location']);
        Route::delete('/delete_location/{id}', [LocationController::class, 'delete_location']);

        //Installment Routes
        Route::get('/get_installment/{id}', [InstallmentController::class, 'get_installment']);
        Route::post('/create_installment', [InstallmentController::class, 'create_installment']);
        Route::post('/update_installment/{id}', [InstallmentController::class, 'update_installment']);
        Route::get('/get_single_installment/{id}', [InstallmentController::class, 'get_single_installment']);
        Route::delete('/delete_installment/{id}', [InstallmentController::class, 'delete_installment']);

        //FinancialAdvisor Routes
        Route::get('/get_advisor_list', [FinancialAdvisorController::class, 'get_advisor']);
        Route::post('/create_advisor', [FinancialAdvisorController::class, 'create_advisor']);
        Route::post('/update_advisor/{id}', [FinancialAdvisorController::class, 'update_advisor']);
        Route::get('/get_single_advisor/{id}', [FinancialAdvisorController::class, 'get_single_advisor']);
        Route::delete('/delete_advisor/{id}', [FinancialAdvisorController::class, 'delete_advisor']);
        Route::post('export-advisors-csv', [FinancialAdvisorController::class, 'export_advisors_csv']);

        Route::get('get_transfer_request', [InvestorController::class, 'getTransferRequest']);
        Route::get('transfer_request_by_id/{id}', [InvestorController::class, 'transfer_request_by_id']);
        Route::post('update_transfer_request', [InvestorController::class, 'updateTransferRequest']);

        Route::get('get_investors', [InvestorController::class, 'getInvestor']);
        Route::get('get_single_investor/{id}', [InvestorController::class, 'getSingleInvestor']);
        Route::post('update_individual_investor', [InvestorController::class, 'updateIndividualInvestor']);
        Route::post('update_institutional_investor', [InvestorController::class, 'updateInstitutionalInvestor']);
        Route::get('get_investments/{id}', [InvestorController::class, 'getInvestments']);
        Route::get('get_investment_by_id/{id}', [InvestorController::class, 'get_investment_by_id']);
        Route::get('get_transactions/{id}', [InvestorController::class, 'getTransactions']);
        Route::post('accept_investment', [InvestorController::class, 'acceptInvestment']);
        Route::post('export-investors-csv', [InvestorController::class, 'exportInvestorsCSV']);
        Route::post('export-investor-pdf', [InvestorController::class, 'exportInvestorPDF']);
        
        Route::get('vip_requests', [InvestorController::class, 'vipRequests']);
        Route::post('accept_vip', [InvestorController::class, 'acceptVIPRequests']);
    
        Route::get('kyc_users', [InvestorController::class, 'KYCUsers']);
        Route::get('kyc_rejected_users', [InvestorController::class, 'KYCRejectedUsers']);
        Route::post('accept_invester_kyc', [InvestorController::class, 'AcceptInvestorKyc']);
        Route::get('get_classifications', [InvestorController::class, 'GetClassifications']);
        //Borrower Admin 
        Route::get('/get_borrowers', [BorrowerAdminController::class, 'getBorrowers']);
        Route::get('/get_single_borrower/{id}', [BorrowerAdminController::class, 'get_single_borrower']);
        Route::get('/borrower_requests', [BorrowerAdminController::class, 'borrower_requests']);
        Route::get('/borrower_requests_by_id/{id}', [BorrowerAdminController::class, 'borrower_requests_by_id']);
        Route::post('/update_request', [BorrowerAdminController::class, 'update_request']);
        Route::post('/update-profile-data', [BorrowerAdminController::class, 'updateProfileData']);
        Route::post('/updatedocs', [BorrowerAdminController::class, 'updatedocs']);
        Route::get('/borrower-history/{id}', [BorrowerAdminController::class, 'borrowerHistory']);
        Route::get('/notifications', [NotificationController::class, 'get_admin_notifications']);
        Route::get('/get_latest_notification_admin', [NotificationController::class, 'get_latest_notification_admin']);
        Route::post('export-borrowers-csv', [BorrowerAdminController::class, 'exportBorrowersCSV']);
        Route::post('export-borrower-requests-csv', [BorrowerAdminController::class, 'exportBorrowerRequestsCSV']);
        
        Route::post('/update_opporrtunity_installment', [InstallmentController::class, 'update_opporrtunity_installment']);

        // Loan Routes
        Route::post('create-loan', [LoanController::class, 'createLoan']);
        Route::get('get-loans', [LoanController::class, 'getLoans']);
        Route::post('update-loan', [LoanController::class, 'updateLoan']);        
    });

?>