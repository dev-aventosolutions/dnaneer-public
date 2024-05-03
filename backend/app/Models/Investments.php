<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investments extends Model
{
    use HasFactory;
    public $timestamps = true;
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function opportunity()
    {
        return $this->belongsTo(Opportunity::class);
    }
}
