<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installments extends Model
{
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'opportunity_id',
        'amount',
        'due_date',
        'principal',
        'interest',
        'fees',
        'description',
        'status'
    ];

    public function opportunity() {
        return $this->hasOne('App\Models\Opportunity','id', 'opportunity_id');
    }

    public function borrower_request() {
        return $this->hasOne('App\Models\BorrowerRequest','id', 'borrower_request_id');
    }

  
}
