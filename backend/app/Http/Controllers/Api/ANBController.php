<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Config;

class ANBController extends Controller
{
    
    
    private function getAccessToken(){
        $client_id = Config::get('services.banks.anb_client_id');
        $client_secret = Config::get('services.banks.anb_client_secret');
        $endpoint = "/v1/b2b-auth/oauth/accesstoken";
        // if(env('APP_ENV') == 'Production'){
        //     $url = Config::get('services.banks.anb_prod_url').$endpoint;
        // }else{
            $url = Config::get('services.banks.anb_stg_url').$endpoint;
        // }


        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => 'grant_type=client_credentials&client_id='.$client_id.'&client_secret='.$client_secret,
        CURLOPT_HTTPHEADER => array(
            'accept: application/json',
            'Content-Type: application/x-www-form-urlencoded',
            'Cookie: TS01a57a22=01e0c4dd0d9e87d78c5f0430b9d1d2eb373c69026d9d61e7818bb997957c8a1a5c4cba481496561729d331b4907393f360d3e713f8'
        ),
        ));
        $response = curl_exec($curl);

        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            return $response;
        }
    }

    public function getBalance(Request $request){
        $accountNumber = $request->accountNumber;
        $bearerToken = $this->getAccessToken();
        $data =  json_decode($bearerToken,true);
        $bearerToken = $data['access_token'];
        $endpoint = "/v1/report/account/balance?accountNumber=".$accountNumber;
        // if(env('APP_ENV') == 'Production'){
        //     $url = Config::get('services.banks.anb_prod_url').$endpoint;
        // }else{
            $url = Config::get('services.banks.anb_stg_url').$endpoint;
        // }

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'accept: application/json; charset=utf-8',
            'Authorization: Bearer '.$bearerToken,
            //'Cookie: TS01a57a22=01e0c4dd0d9e87d78c5f0430b9d1d2eb373c69026d9d61e7818bb9>
        ),
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        return json_decode($response,true);
    }

    public function getStatement(Request $request){
        $date = Date('Y-m-d');
        $pre_date = date('Y-m-d', strtotime('-1 day', strtotime($date)));
        $fromDate = date("Y-m-d", strtotime ( '-1 month' , strtotime ( $date ) )) ;
        
        $accountNumber = $request->accountNumber;
        $fromDate = $request->fromDate ? $request->fromDate : $fromDate;
        $toDate = $request->toDate ? $request->toDate : $pre_date;

        $max = $request->max;
        $offset = $request->offset;
        $type = $request->type;

        $bearerToken = $this->getAccessToken();
        $data =  json_decode($bearerToken,true);
        $bearerToken = $data['access_token'];
        $endpoint = "/v2/report/account/statement?accountNumber=".$accountNumber."&fromDate=".$fromDate."&toDate=".$toDate."&max=".$max."&offset=".$offset."&type=".$type;
        // if(env('APP_ENV') == 'Production'){
        //     $url = Config::get('services.banks.anb_prod_url').$endpoint;
        // }else{
            $url = Config::get('services.banks.anb_stg_url').$endpoint;
        // }

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'accept: application/json; charset=utf-8',
            'Authorization: Bearer '.$bearerToken,
            //'Cookie: TS01a57a22=01e0c4dd0d9e87d78c5f0430b9d1d2eb373c69026d9d61e7818bb9>
        ),
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        return json_decode($response,true);
    }

    public function getEodStatement(Request $request){
        $order = $request->order;
        $page = $request->page;
        $take = $request->take;
        $date = $request->date;

        $bearerToken = $this->getAccessToken();
        $data =  json_decode($bearerToken,true);
        $bearerToken = $data['access_token'];
        $endpoint = "/v1/report/eod-statement?order=".$order."&page=".$page."&take=".$take."&date=".$date;
        // if(env('APP_ENV') == 'Production'){
        //     $url = Config::get('services.banks.anb_prod_url').$endpoint;
        // }else{
            $url = Config::get('services.banks.anb_stg_url').$endpoint;
        // }

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'accept: application/json; charset=utf-8',
            'Authorization: Bearer '.$bearerToken,
            //'Cookie: TS01a57a22=01e0c4dd0d9e87d78c5f0430b9d1d2eb373c69026d9d61e7818bb9>
        ),
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        return json_decode($response,true);
    }

}
