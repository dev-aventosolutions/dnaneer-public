<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'wathq' => [
        'app_url' => env('wathq_url'),
        'app_key' => env('wathq_key'),
        
    ],
    
    'nafath' => [
        'app_id' => env('nafath_app_id'),
        'stg_app_id' => env('nafath_stg_app_id'),
        'app_key' => env('nafath_app_key'),
        'stg_app_key' => env('nafath_stg_app_key'),
        'stg_url'=>env('nafath_stg'), 
        'prod_url' =>env('nafath_prod')
    ],

    'banks' => [
        'anb_stg_url' => env('anb_staging_url'),
        'anb_prod_url' => env('anb_prod_url'),
        'anb_client_id' => env('anb_client_id'),
        'anb_client_secret' => env('anb_client_secret'),
    ]

];
