<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowerRequest extends Model
{
    use HasFactory;
    protected $table = "borrower_requests";
    public $timestamps = true;
    protected $fillable = [
        'user_id',
        'cr_number',
        'business_name',
        'business_activity',
        'legal_type',
        'capital',
        'cr_expiry_date',
        'address',
        'name',
        'saudi_id_number',
        'position',
        'phone_number',
        'dob',
        'company_endorsement',
        'seeking_amount',
        'repayment_duration',
        'existing_obligations',
        'reject_note',
        'high_level_mission',
        'senior_position',
        'marriage_relationship',
        'step'
    ];
    
    public function user() {
        return $this->hasOne('App\Models\User','id', 'user_id');
    }

    public function accounts() {
        return $this->hasOne('App\Models\UserAccounts','user_id', 'user_id')->join('banks', 'banks.id', 'user_accounts.bank_id');
    }

    public function bank()
    {
        return $this->belongsTo(Banks::class, 'bank_id')->select('id', 'name');
    }

    public function opportunity()
    {
        return $this->belongsTo(Opportunity::class, 'id', 'borrower_request_id');
    }

    public function borrower_documents() {
        return $this->hasMany('App\Models\BorrowerDocuments','user_id', 'id');
    }

    public function borrower_documents_for_single_request() {
        return $this->hasMany('App\Models\BorrowerDocuments','user_id', 'user_id');
    }
}
