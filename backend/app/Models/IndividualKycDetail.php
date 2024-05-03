<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Banks;

class IndividualKycDetail extends Model
{
    use HasFactory;

    protected $table = 'individual_kyc_details';
    public $timestamps = true;
    protected $fillable = [
        'user_id',
        'education',
        'employee',
        'current_company',
        'current_position',
        'current_experience',
        'source_of_income',
        'average_income',
        'net_worth',
        // 'plan_to_invest',
        'investment_objectives',
        'investment_knowledge',
        'reject_note',
        'high_level_mission',
        'senior_position',
        'marriage_relationship'
    ];

    public function bank()
    {
        return $this->belongsTo(Banks::class, 'bank_id')->select('id', 'name');
    }
}
