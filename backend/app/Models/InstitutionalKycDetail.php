<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Banks;

class InstitutionalKycDetail extends Model
{
    use HasFactory;
    protected $table = 'institutional_kyc_details';

    protected $fillable = [
        'user_id',
        'registration_number',
        'company_name',
        'establishment_date',
        'address',
        'legal_structure',
        'investor_name',
        'id_number',
        'position',
        'phone_number',
        'date_of_birth',
        'source_of_income',
        'annual_revenue',
        'investment_amount',
        'reject_note',
        'high_level_mission',
        'senior_position',
        'marriage_relationship'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents() {
        return $this->hasMany('App\Models\Documents','module_id', 'id')->where('module', 'kyc_legal_documents')->orWhere('module', 'kyc_other_documents');
    }

    public function bank()
    {
        return $this->belongsTo(Banks::class, 'bank_id')->select('id', 'name');
    }
}
