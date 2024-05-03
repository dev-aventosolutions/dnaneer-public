<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'opportunity_id',
        'principal_amount',
        'net_roi',
        'annual_interest_rate',
        'annual_interest_amount',
        'total_amount_before_fees',
        'origination_rate',
        'origination_fee',
        'borrower_to_receive',
        'carrying_fee',
        'borrower_to_pay',
        'tenor',
        'status',
        'dnaneer_carrying_fee',
        'net_repayment',
        'return'
    ];
}