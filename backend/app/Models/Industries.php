<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Opportunity;

class Industries extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

}
