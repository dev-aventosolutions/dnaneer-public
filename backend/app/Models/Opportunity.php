<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Documents;

class Opportunity extends Model
{
    public $timestamps = true;
    use HasFactory;
    // protected $fillable = [
    //     'user_id',
    //     'financing_structure',
    //     'financing_type',
    //     'net_roi',
    //     'tenor',
    //     'risk_score',
    //     'distributed_returns',
    //     'requested_amount',
    //     'fund_status',
    // ];

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

    public function industry() {
		  return $this->hasOne('App\Models\Industries','id', 'industry_id');
    }

    public function documents() {
      // return $this->hasMany(Documents::class);
      return $this->hasMany('App\Models\Documents','module_id', 'id')->where('module', 'opportunity');
    }

    public function investments() {
      return $this->hasMany('App\Models\Investments','opportunity_id', 'id')->join('users','users.id', 'investments.user_id');
    }

    public function installments() {
      return $this->hasMany('App\Models\Installments','opportunity_id', 'id');
    }

    public function loan() {
		  return $this->hasOne(Loan::class);
    }
    
}
