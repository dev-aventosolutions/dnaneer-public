<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccounts extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dnaneer_account_no',
        'personal_iban_number',
        'bank_id',
        'balance',
        'dnaneer_iban'
    ];

}
