<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NafathOTPNotification;
use App\Notifications\RegisterIndividualNotification;
use App\Notifications\UpgradeAccountNotification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Config;
use App\Models\Investments;
use App\Models\UserAccounts;
use Storage;
use App\Models\IndividualKycDetail;
use App\Models\InstitutionalKycDetail;
use App\Models\UpgradeRequests;
use App\Models\Documents;
use App\Models\TransferRequest;
use SoapClient;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Firebase\JWT\JWT;
use Firebase\JWT\KEY;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use DomainException;
use InvalidArgumentException;
use UnexpectedValueException;
use App\Models\UserClassification;
use App\Models\Opportunity;

class UserController extends Controller
{
    public function html_email() {
        $recipientEmail = 'ijazali531@gmail.com';
        $message = 'Hello, this is a text email!';

        Mail::raw($message, function ($email) use ($recipientEmail) {
            $email->to($recipientEmail)
                ->subject('Text Email Subject');
        });
        return 'Email sent successfully!';

     }

    function jwtToken(){
        $key = 'Dnaneer-Developer-Team';
        $payload = [
            'iss' => 'http://example.org',
            'aud' => 'http://example.com',
            'iat' => 1356999524,
            'nbf' => 1357000000
        ];

        /**
         * IMPORTANT:
         * You must specify supported algorithms for your application. See
         * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40
         * for a list of spec-compliant algorithms.
         */
        $jwt = JWT::encode($payload, $key, 'HS256');

        dd($jwt);
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));

        print_r($decoded);

        /*
        NOTE: This will now be an object instead of an associative array. To get
        an associative array, you will need to cast it as such:
        */

        $decoded_array = (array) $decoded;

        /**
         * You can add a leeway to account for when there is a clock skew times between
         * the signing and verifying servers. It is recommended that this leeway should
         * not be bigger than a few minutes.
         *
         * Source: http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#nbfDef
         */
        JWT::$leeway = 60; // $leeway in seconds
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    }


    public function decodeCallBack(){
        $data = '{"token":"eyJraWQiOiJlbG0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMDY3MzA1NDU2IiwiZmF0aGVyTmFtZSI6ItmF2K3ZhdivIiwiZ2VuZGVyIjoiTSIsImRhdGVPZkJpcnRoRyI6IjA0LTExLTE5OTAiLCJ0cmFuc0lkIjoiYjUwYTRlYTYtM2M0Yy00YTc1LTlhOGQtNzk2Zjc0YTJkNWU4IiwiZGF0ZU9mQmlydGhIIjoiMTctMDQtMTQxMSIsImdyYW5kRmF0aGVyTmFtZSI6ItmF2LXYt9mB2YkiLCJpc3MiOiJodHRwczpcL1wvbmFmYXRoLmFwaS5lbG0uc2EiLCJuYXRpb25hbGl0eUNvZGUiOiIxMTMiLCJuaW4iOiIxMDY3MzA1NDU2IiwiZW5nbGlzaFRoaXJkTmFtZSI6Ik1VU1RBRkEiLCJpZFZlcnNpb25OdW1iZXIiOjYsImZhbWlseU5hbWUiOiLYp9mE2KzZh9mG2YoiLCJsb2dJZCI6MTkyMzQ2NjQ0MywiZXhwIjoxNjg3NTk5ODYzLCJpZElzc3VlUGxhY2UiOiLYp9mE2K_Ysdi52YrYqSIsImlhdCI6MTY4NzU5OTcxMywianRpIjoiNjQ5NmJhMjYxMTE3OSIsIm5hdGlvbmFsQWRkcmVzcyI6W3sic3RyZWV0TmFtZSI6IkFobWFkIFNhbWVoIEFsIEtoYWxkaSIsImNpdHkiOiJKRUREQUgiLCJhZGRpdGlvbmFsTnVtYmVyIjoiNDA5NiIsImRpc3RyaWN0IjoiQWwgTXVyamFuIERpc3QuIiwidW5pdE51bWJlciI6IjUiLCJpc1ByaW1hcnlBZGRyZXNzIjoiZmFsc2UiLCJidWlsZGluZ051bWJlciI6IjY3MjciLCJwb3N0Q29kZSI6IjIzNzE1IiwibG9jYXRpb25Db29yZGluYXRlcyI6IjM5LjEwNjIyMDA3IDIxLjY5NzI0ODE4In0seyJzdHJlZXROYW1lIjoiUHJpbmNlIFNhdWQgQmluICBNdWhhbW1hZCBCaW4gIFNhdWQiLCJjaXR5IjoiUklZQURIIiwiYWRkaXRpb25hbE51bWJlciI6Ijc5MjIiLCJkaXN0cmljdCI6IktpbmcgRmFoZCBEaXN0LiIsInVuaXROdW1iZXIiOiI1NSIsImlzUHJpbWFyeUFkZHJlc3MiOiJmYWxzZSIsImJ1aWxkaW5nTnVtYmVyIjoiMzE4OSIsInBvc3RDb2RlIjoiMTIyNzQiLCJsb2NhdGlvbkNvb3JkaW5hdGVzIjoiNDYuNjcwMjc3MzggMjQuNzQ2NDU3NjYifV0sImlkSXNzdWVEYXRlIjoiMjctMTItMTQ0MSIsImlkRXhwaXJ5RGF0ZUciOiIyMi0wNi0yMDI1IiwiZW5nbGlzaExhc3ROYW1lIjoiQUxKVUhBTkkiLCJlbmdsaXNoRmlyc3ROYW1lIjoiQkFERVIiLCJpZEV4cGlyeURhdGUiOiIyNi0xMi0xNDQ2IiwiYXVkIjoiaHR0cHM6XC9cL2JhY2tlbmQuZG5hbmVlci5jb21cL2FwaVwvbmFmYXRoLWNhbGxiYWNrIiwiZmlyc3ROYW1lIjoi2KjYr9ixIiwibmJmIjoxNjg3NTk5NzEzLCJQZXJzb25JZCI6MTA2NzMwNTQ1NiwibmF0aW9uYWxpdHkiOiJTQVUiLCJTZXJ2aWNlTmFtZSI6Ik9wZW5BY2NvdW50Iiwiandrc191cmkiOiJodHRwczpcL1wvbmFmYXRoLmFwaS5lbG0uc2FcL2FwaVwvdjFcL21mYVwvandrIiwiaWRJc3N1ZURhdGVHIjoiMTctMDgtMjAyMCIsImVuZ2xpc2hTZWNvbmROYW1lIjoiTU9IQU1NRUQiLCJzdGF0dXMiOiJDT01QTEVURUQifQ.oAadSrcoMBMveeRy4EdEehzWviSoNBFm9OP1lqJ5ydwo_f2MA91wgcwFa8ZC0c8JRMy70IiL79gjj01RAKLfYIn6jdvVdSGlnU0V20LqZeSjq4J9mRjTD8ySjhOhYKeKNfXqSwoLAALCsx8Im_wy6S5KS6ZNsnfzS6tkw56_HxQC5TmUhsCbDtu3KekS4D5j0aQnMJKZndP1wpCHeCj9e8nt41ztuCNSiBSyXQ8fwvoJxDW3DR_30wMfw4qOVu_5qvVTqWo_mVq0uTunlVFGzs96XT6zv0vITzJROdHqmkPN7nrZMoxHHP7T1GvX2hIbPt4ahc6SYcq_k4o0_qzrxQ","transId":"b50a4ea6-3c4c-4a75-9a8d-796f74a2d5e8","requestId":"6496ba2611179"}';
        $decoded_data = json_decode($data);
        $token = $decoded_data->token;

        // $token = explode('.', $token);
        $transId = $decoded_data->transId;
        $requestId = $decoded_data->requestId;
        $key = '{
            "keys": [
                {
                    "kty": "RSA",
                    "e": "AQAB",
                    "use": "sig",
                    "kid": "elm",
                    "alg": "RS256",
                    "n": "pVXsvUMjiBWnbdmzpLF7OUNXfFF-AXKuwuui6dzUSZgg4hTyG_-OLePOCMAM8jxf_FNriZVt_DHK4nInLNP9pCoAXaaL6yaneG_NYXUIqGR3SoZgVUdV3saVSGpuwRCS0JksZ_2DslMnrrYxQORfUjnzWaAwnXHuowlCjaczjTRYiDBhOvj-ozw6sFg96x9MV-0Ou0TIPrRn5Z1LUykIOGvk5IOkuMQtnVO6mcAdWjf0pWp71E2oaDWkUawTyLzTti3k7SHHiQpi_3x-3vMiZNpLbyHL3pdOxxZK0vKO8HCxiR0WUt_JO1RNV-8p0XKNKXA9eBbFi8_uEb_BFZIoCw"
                }
            ]
        }';
        $key = json_decode($key);
        $publicKey = $key->keys[0]->n;

        
        $x = $this->decodeNafathToken($token, $key);
        dd($x);
    }


    function decodeJwt(){
        $token = "eyJraWQiOiJlbG0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMDY3MzA1NDU2IiwiZmF0aGVyTmFtZSI6ItmF2K3ZhdivIiwiZHJpdmluZ0xpY2Vuc2VzIjpbXSwiZ2VuZGVyIjoiTSIsImRhdGVPZkJpcnRoRyI6IjA0LTExLTE5OTAiLCJ0cmFuc0lkIjoiN2UzZDBmOGUtZGFmMC00NWNkLTlmNWEtMjY2ZmU4YzcwMzY3IiwiZGF0ZU9mQmlydGhIIjoiMTctMDQtMTQxMSIsImdyYW5kRmF0aGVyTmFtZSI6ItmF2LXYt9mB2YkiLCJpc3MiOiJodHRwczpcL1wvbmFmYXRoLmFwaS5lbG0uc2EiLCJuYXRpb25hbGl0eUNvZGUiOiIxMTMiLCJuaW4iOiIxMDY3MzA1NDU2IiwiZW5nbGlzaFRoaXJkTmFtZSI6Ik1VU1RBRkEiLCJpZFZlcnNpb25OdW1iZXIiOjYsImZhbWlseU5hbWUiOiLYp9mE2KzZh9mG2YoiLCJsb2dJZCI6MTk0NjMzNDA3NywiZXhwIjoxNjg5MjQ1MTU1LCJpZElzc3VlUGxhY2UiOiLYp9mE2K_Ysdi52YrYqSIsImlhdCI6MTY4OTI0NTAwNSwianRpIjoiNjRhZmQ1MGNkYjgyYiIsIm5hdGlvbmFsQWRkcmVzcyI6W3sic3RyZWV0TmFtZSI6IlByaW5jZSBTYXVkIEJpbiAgTXVoYW1tYWQgQmluICBTYXVkIiwiY2l0eSI6IlJJWUFESCIsImRpc3RyaWN0IjoiS2luZyBGYWhkIERpc3QuIiwiYWRkaXRpb25hbE51bWJlciI6Ijc5MjIiLCJidWlsZGluZ051bWJlciI6IjMxODkiLCJ1bml0TnVtYmVyIjoibnVsbCIsImlzUHJpbWFyeUFkZHJlc3MiOiJ0cnVlIiwicG9zdENvZGUiOiIxMjI3NCIsImxvY2F0aW9uQ29vcmRpbmF0ZXMiOiI0Ni42NzAyNzczOCAyNC43NDY0NTc2NiJ9LHsic3RyZWV0TmFtZSI6IkFobWFkIFNhbWVoIEFsIEtoYWxkaSIsImNpdHkiOiJKRUREQUgiLCJkaXN0cmljdCI6IkFsIE11cmphbiBEaXN0LiIsImFkZGl0aW9uYWxOdW1iZXIiOiI0MDk2IiwiYnVpbGRpbmdOdW1iZXIiOiI2NzI3IiwidW5pdE51bWJlciI6Im51bGwiLCJpc1ByaW1hcnlBZGRyZXNzIjoiZmFsc2UiLCJwb3N0Q29kZSI6IjIzNzE1IiwibG9jYXRpb25Db29yZGluYXRlcyI6IjM5LjEwNjIyMDA3IDIxLjY5NzI0ODE4In1dLCJpZElzc3VlRGF0ZSI6IjI3LTEyLTE0NDEiLCJpZEV4cGlyeURhdGVHIjoiMjItMDYtMjAyNSIsImVuZ2xpc2hMYXN0TmFtZSI6IkFMSlVIQU5JIiwiZW5nbGlzaEZpcnN0TmFtZSI6IkJBREVSIiwiaWRFeHBpcnlEYXRlIjoiMjYtMTItMTQ0NiIsImF1ZCI6Imh0dHBzOlwvXC9iYWNrZW5kLmRuYW5lZXIuY29tXC9hcGlcL25hZmF0aC1jYWxsYmFjayIsImZpcnN0TmFtZSI6Itio2K_YsSIsIm5iZiI6MTY4OTI0NTAwNSwiUGVyc29uSWQiOjEwNjczMDU0NTYsIm5hdGlvbmFsaXR5IjoiU0FVIiwiU2VydmljZU5hbWUiOiJPcGVuQWNjb3VudCIsImp3a3NfdXJpIjoiaHR0cHM6XC9cL25hZmF0aC5hcGkuZWxtLnNhXC9hcGlcL3YxXC9tZmFcL2p3ayIsImlkSXNzdWVEYXRlRyI6IjE3LTA4LTIwMjAiLCJlbmdsaXNoU2Vjb25kTmFtZSI6Ik1PSEFNTUVEIiwic3RhdHVzIjoiQ09NUExFVEVEIn0.OlrAvDIAlkOLaIXdZZcGn8Egm9L8fgXY8N-xWab7fej1Y0b0WLTDldOBvspGfsHdywtcl9R1Vl7bjSCYWY76EGibipmzVsoAv2L_C8IDL648OaDMH2iDvBp6qOTPRiGBUPbrCz_xj4jY4G_QkK06pJjTgqUpWEQAxNbD22uzWXzlcJMLcb6eI0oXY5RsjfTgzmE1rIy88kL6_YYcw3FroCBIEFy4ZGKUbDrWczn2XsQ2jzko93vik_qQ2rRoF4Bd9IsKd5SgwgzyD-QJqezmznKFmaMvVASRSxVJj-UvgIGr-lPrbj6gFn1lKzV3xiyNvg7D0BdfVQUJWn4Rjoxjfg";
        $data = (json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $token)[1])))));

        dd($data);
    }
    public function nafathCallBackURL(Request $request){
        \Log::channel('nafath')->info("Hit coming");
        $encoded_data = json_encode($request->all());
        \Log::channel('nafath')->info("Data: ". $encoded_data);
        $data = $request->all();
        // $data = '{"token":"eyJraWQiOiJlbG0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMDY3MzA1NDU2IiwiZmF0aGVyTmFtZSI6ItmF2K3ZhdivIiwiZHJpdmluZ0xpY2Vuc2VzIjpbXSwiZ2VuZGVyIjoiTSIsImRhdGVPZkJpcnRoRyI6IjA0LTExLTE5OTAiLCJ0cmFuc0lkIjoiN2UzZDBmOGUtZGFmMC00NWNkLTlmNWEtMjY2ZmU4YzcwMzY3IiwiZGF0ZU9mQmlydGhIIjoiMTctMDQtMTQxMSIsImdyYW5kRmF0aGVyTmFtZSI6ItmF2LXYt9mB2YkiLCJpc3MiOiJodHRwczpcL1wvbmFmYXRoLmFwaS5lbG0uc2EiLCJuYXRpb25hbGl0eUNvZGUiOiIxMTMiLCJuaW4iOiIxMDY3MzA1NDU2IiwiZW5nbGlzaFRoaXJkTmFtZSI6Ik1VU1RBRkEiLCJpZFZlcnNpb25OdW1iZXIiOjYsImZhbWlseU5hbWUiOiLYp9mE2KzZh9mG2YoiLCJsb2dJZCI6MTk0NjMzNDA3NywiZXhwIjoxNjg5MjQ1MTU1LCJpZElzc3VlUGxhY2UiOiLYp9mE2K_Ysdi52YrYqSIsImlhdCI6MTY4OTI0NTAwNSwianRpIjoiNjRhZmQ1MGNkYjgyYiIsIm5hdGlvbmFsQWRkcmVzcyI6W3sic3RyZWV0TmFtZSI6IlByaW5jZSBTYXVkIEJpbiAgTXVoYW1tYWQgQmluICBTYXVkIiwiY2l0eSI6IlJJWUFESCIsImRpc3RyaWN0IjoiS2luZyBGYWhkIERpc3QuIiwiYWRkaXRpb25hbE51bWJlciI6Ijc5MjIiLCJidWlsZGluZ051bWJlciI6IjMxODkiLCJ1bml0TnVtYmVyIjoibnVsbCIsImlzUHJpbWFyeUFkZHJlc3MiOiJ0cnVlIiwicG9zdENvZGUiOiIxMjI3NCIsImxvY2F0aW9uQ29vcmRpbmF0ZXMiOiI0Ni42NzAyNzczOCAyNC43NDY0NTc2NiJ9LHsic3RyZWV0TmFtZSI6IkFobWFkIFNhbWVoIEFsIEtoYWxkaSIsImNpdHkiOiJKRUREQUgiLCJkaXN0cmljdCI6IkFsIE11cmphbiBEaXN0LiIsImFkZGl0aW9uYWxOdW1iZXIiOiI0MDk2IiwiYnVpbGRpbmdOdW1iZXIiOiI2NzI3IiwidW5pdE51bWJlciI6Im51bGwiLCJpc1ByaW1hcnlBZGRyZXNzIjoiZmFsc2UiLCJwb3N0Q29kZSI6IjIzNzE1IiwibG9jYXRpb25Db29yZGluYXRlcyI6IjM5LjEwNjIyMDA3IDIxLjY5NzI0ODE4In1dLCJpZElzc3VlRGF0ZSI6IjI3LTEyLTE0NDEiLCJpZEV4cGlyeURhdGVHIjoiMjItMDYtMjAyNSIsImVuZ2xpc2hMYXN0TmFtZSI6IkFMSlVIQU5JIiwiZW5nbGlzaEZpcnN0TmFtZSI6IkJBREVSIiwiaWRFeHBpcnlEYXRlIjoiMjYtMTItMTQ0NiIsImF1ZCI6Imh0dHBzOlwvXC9iYWNrZW5kLmRuYW5lZXIuY29tXC9hcGlcL25hZmF0aC1jYWxsYmFjayIsImZpcnN0TmFtZSI6Itio2K_YsSIsIm5iZiI6MTY4OTI0NTAwNSwiUGVyc29uSWQiOjEwNjczMDU0NTYsIm5hdGlvbmFsaXR5IjoiU0FVIiwiU2VydmljZU5hbWUiOiJPcGVuQWNjb3VudCIsImp3a3NfdXJpIjoiaHR0cHM6XC9cL25hZmF0aC5hcGkuZWxtLnNhXC9hcGlcL3YxXC9tZmFcL2p3ayIsImlkSXNzdWVEYXRlRyI6IjE3LTA4LTIwMjAiLCJlbmdsaXNoU2Vjb25kTmFtZSI6Ik1PSEFNTUVEIiwic3RhdHVzIjoiQ09NUExFVEVEIn0.OlrAvDIAlkOLaIXdZZcGn8Egm9L8fgXY8N-xWab7fej1Y0b0WLTDldOBvspGfsHdywtcl9R1Vl7bjSCYWY76EGibipmzVsoAv2L_C8IDL648OaDMH2iDvBp6qOTPRiGBUPbrCz_xj4jY4G_QkK06pJjTgqUpWEQAxNbD22uzWXzlcJMLcb6eI0oXY5RsjfTgzmE1rIy88kL6_YYcw3FroCBIEFy4ZGKUbDrWczn2XsQ2jzko93vik_qQ2rRoF4Bd9IsKd5SgwgzyD-QJqezmznKFmaMvVASRSxVJj-UvgIGr-lPrbj6gFn1lKzV3xiyNvg7D0BdfVQUJWn4Rjoxjfg","transId":"7e3d0f8e-daf0-45cd-9f5a-266fe8c70367","requestId":"64afd50cdb82b"}';
        $user = null;
        if(!empty($data)){
            // $data1 = json_decode(json_encode($data));
            // $data = json_decode($data);
            // \Log::channel('nafath')->info("Data: ". varr_dump($data1). var_dump($data));
            $token = $data['token'];
            $requestId = $data['requestId'];
            $transId = $data['transId'];
            $nafath_data = (json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $token)[1])))));
            $user = user::where('transid', $transId)->where('requestid', $requestId)->first();

            if(!empty($user)){
                $user->nafath = json_encode($nafath_data);
                $user->name = $nafath_data->englishFirstName. ' '. $nafath_data->englishLastName;
                $user->dob = Carbon::createFromFormat('m-d-Y', $nafath_data->dateOfBirthG)->format('Y-m-d');
                $user->save();
                \Log::channel('nafath')->info("User Updated");
            }else{
                \Log::channel('nafath')->info("User not found against TransID.");
            }
        }else{
            \Log::channel('nafath')->info("Empty Response.");
        }

    }

    public function sendNafathRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'user_id' => 'required',
            'national_id' => 'required|min:10|max:10|unique:users',
            'dob' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'phone_number' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $nationalId = $request->input('national_id');
        $locale = $request->input('locale', 'ar');
        $requestId = $request->input('request_id', uniqid());
        // $requestId = 'd5e189a6-c551-43bb-b893-bd70e92c1fef';
        // $callbackurl = env('SITE_URL')."/api/nafath-callback";

        $end_point = "/mfa/request?local=$locale&requestId=".$requestId;
        if(env('APP_ENV') == 'Production'){
            $url = Config::get('services.nafath.prod_url').$end_point;
        }else{
            $url = Config::get('services.nafath.stg_url').$end_point;
        }
        $data = [
            // 'request' => [
                'nationalId' => $nationalId,
                'service' => "OpenAccount"
            // ]
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'APP-ID:'.Config::get('services.nafath.app_id'),
            'APP-KEY:'.Config::get('services.nafath.app_key'),
        ));

        $response = curl_exec($ch);
        $err = curl_error($ch);

        curl_close($ch);

        if ($err) {
            return response()->json(['error' => $err], 500);
        } else {
            $responseData = json_decode($response, true);
            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            // $statusText = curl_getinfo($ch, CURLINFO_HTTP_MESSAGE);
            $exist = User::where('email', $request->email)->exists();

            if ($statusCode >= 200 && $statusCode < 300) {
                if(!$exist){
                    // Create the user
                    $user = new User();
                    $user->national_id = $request->national_id;
                    $user->phone_number = $request->phone_number;
                    $user->dob = $request->dob;
                    $user->user_type = 1;
                    $user->email = $request->email;
                    $user->transid = $responseData['transId'];
                    $user->requestid = $requestId;
                    $user->password = Hash::make($request->password);
                    $user->save();

                    $userAccount = new UserAccounts();
                    $userAccount->user_id = $user->id;
                    $userAccount->dnaneer_account_no = null;
                    $userAccount->personal_iban_number= null;
                    $userAccount->bank_id = null;
                    $userAccount->balance = 0.00;
                    $userAccount->save();

                    //Admin Notification 
                    // $adminNotification = getAdmin();
                    // Notification::send($adminNotification, new RegisterIndividualNotification($user, 'admin'));
                    // //User Notification
                    // $userNotification = getCurrentUser($user->id);
                    // Notification::send($userNotification, new RegisterIndividualNotification($user, 'user'));
                }else{
                    //If user not approve nafath then came again.
                    $user = User::where('email', $request->email)->first();
                    $user->national_id = $request->national_id;
                    $user->phone_number = $request->phone_number;
                    $user->dob = $request->dob;
                    $user->user_type = 1;
                    $user->email = $request->email;
                    $user->transid = $responseData['transId'];
                    $user->requestid = $requestId;
                    $user->password = Hash::make($request->password);
                    $user->save();
                }
                // The request was successful.
                return response()->json([
                    'transId' => $responseData['transId'],
                    'random' => $responseData['random'],
                ]);
            } else {
                // The request failed.
                return response()->json([
                    'error' => 'error',
                    'statusCode' => $statusCode,
                    'message' => $responseData['message']
                ], $statusCode);
            }
        }
    }

    public function nafathRequestStatus(Request $request){
        $validator = Validator::make($request->all(), [
            'nationalId' => 'required|min:10',
            // 'dob' => 'required',
            // 'email' => 'required|email',
            // 'password' => 'required|min:8',
            'transId' => 'required',
            'random' => 'required|integer'

        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $nationalId = $request->input('nationalId');
        $random = $request->input('random');
        $transId = $request->input('transId');
        $end_point = "/mfa/request/status";
        if(env('APP_ENV') == 'Production'){
            $url = Config::get('services.nafath.prod_url').$end_point;
        }else{
            $url = Config::get('services.nafath.stg_url').$end_point;
        }
        $data = [
                'nationalId' => $nationalId,
                'transId' => $transId,
                'random' => $random
            ];
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'APP-ID:'.Config::get('services.nafath.app_id'),
            'APP-KEY:'.Config::get('services.nafath.app_key'),
        ));

        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);


        if ($err) {
            return response()->json(['error' => $err], 500);
        } else {
            $responseData = json_decode($response, true);
            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            // $statusText = curl_getinfo($ch, CURLINFO_HTTP_MESSAGE);

            if ($statusCode >= 200 && $statusCode < 300) {
                // The request was successful.
                if($responseData['status'] == "COMPLETED"){
                    $user = User::where('transid', $request->transId)->first();
                    $userData = Auth::loginUsingId($user->id);
                    $token = $userData->createToken('DnaneerApp')->plainTextToken;
                    return response()->json([
                        'status' => 'success',
                        'code' => 200,
                        'message' => 'User registered successfully.',
                        'token' => $token,
                        'data' => [
                            'user' => $userData
                        ],
                    ], 200);
                }else{
                    return response()->json([
                        'status' => $responseData['status'],
                    ],401);
                }

            } else {
                // The request failed.
                return response()->json([
                    'error' => 'error',
                    'statusCode' => $statusCode,
                ], $statusCode);
            }
        }
    }

    function userDetail(){
        $user = Auth::user();

        if ($user->user_type === 1) {
            $profile = User::with('individual.bank', 'accounts', 'advisor','classification')->find($user->id);
        } elseif ($user->user_type === 2) {
            $profile =  User::with('institutional.bank','accounts', 'advisor','classification', 'kycdocuments')->find($user->id);
        }
        $profile->total_investment = Investments::where('user_id', $user->id)->where('status', 'approved')->sum('amount');
        $annual_roi= Investments::join('opportunities', 'opportunities.id', 'investments.opportunity_id')->where('investments.user_id', $user->id)->where('investments.status', 'approved')->average('annual_roi');
        $net_roi= Investments::join('opportunities', 'opportunities.id', 'investments.opportunity_id')->where('investments.user_id', $user->id)->where('investments.status', 'approved')->sum('net_roi');
        $profile->total_roi = number_format($annual_roi, 2);
        $profile->total_net_roi = $net_roi;
        $profile->unrealized_profit = $this->calculateUnrealizeProfit();
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $profile,
            ],
        ], 200);
    }

    function calculateUnrealizeProfit(){
        $unrealize_profit = 0;
        $user_id = Auth::id();
        $investments = Investments::where('user_id',$user_id)->where('status', 'approved')->get();
        if(!empty($investments)){
            foreach ($investments as $key => $inv) {
                $op_id = $inv->opportunity_id;
                $op = Opportunity::where('id', $op_id)->where('opportunity_status', 'active')->first();
                if(!empty($op)){
                    $net_roi = $op->net_roi;
                    $amount = $inv->amount;
                    $unrealize_profit += $amount/$net_roi;
                }
            }
        }
        return $unrealize_profit;
    }

    function updateUserProfile(Request $request){
        $validator = Validator::make($request->all(),[ 
            'image' => 'required|mimes:png,jpg,jpeg|max:5048',
        ]);   

      if($validator->fails()) {          
          return response()->json(['error'=>$validator->errors()], 401);                        
       }  
       $user_id = Auth::id();
      if ($file = $request->file('image')) {
          $path = 'public/dnaneer/'.$user_id.'/profile';
          $path = $file->store($path);
          $name = $file->getClientOriginalName();
          $path = str_replace('public', 'storage', $path);

          $save = User::find($user_id);
          $save->profile_image_url= $path;
          $save->save();
            
          return response()->json([
              "success" => true,
              "message" => "Profile image successfully uploaded",
              "file" => $path
          ]);

      }
    }

    function upgradeAccount(Request $request){
        $criteria_id = $request->criteria_id;
        // $outputString = str_replace('"', '', $criteria_id);

        // Convert the modified string back to an array
        // $criteria_id = json_decode($outputString);
        $user_id = Auth::id();
        $path = null;
        if ($file = $request->file('file')) {
            $documents_data = [];
            $folder_path = 'public/dnaneer/'.$user_id.'/upgrade';
            $path = $file->store($folder_path);
            $name = $file->getClientOriginalName();
            $path = str_replace('public', 'storage', $path);
            // $documents_data['module_id'] = $upgrade->id;
            // $documents_data['link'] = $path;
            // $documents_data['original_name'] = $name;
            // $documents_data['user_id'] = $user_id;
            // $documents_data['module'] = "upgrade";
            // $documents = Documents::insert($documents_data);
        }
        $upgrade = UpgradeRequests::updateOrCreate([
            'user_id' => $user_id,
        ],[
            'criteria_id' => $criteria_id,
            'status' => 0,
            'document' => $path
        ]);
        //update user mode status to waiting
        $user = User::where('id', $user_id)->first();
        $user->mode = 'waiting';
        $user->save();
        SendOTP($user_id, 'Vip request');
        //User Notification
        // Notification::send($user, new UpgradeAccountNotification($user, 'user'));
        // //Admin Notification 
        // $adminNotification = getAdmin();
        // Notification::send($adminNotification, new UpgradeAccountNotification($user, 'admin'));
        
        return response()->json([
            'status' => 'success',
            'message' => 'Request sent successfully.'
        ], 200);

    }

    function updateIndividualInvestor(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'employee' => 'required',
            'current_company' => 'required_if:employee,Yes',
            'current_position' => 'required_if:employee,Yes',
            'current_experience' => 'required_if:employee,Yes'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        if(!empty($user)){
            // $user->phone_number = $request->phone_number;
            // $user->name = $request->name;
            // $user->email = $request->email;
            // $user->national_id = $request->national_id;
            $user->dob = $request->dob;
            // $user->mode = $request->mode;
            $user->save();
    
            $account = UserAccounts::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                // 'dnaneer_account_no'     => $request->dnaneer_account_no,
                'personal_iban_number' => $request->personal_iban_number,
                'bank_id'    => $request->bank_id,
                // 'balance'   => $request->balance
            ]);

            $account = IndividualKycDetail::where('user_id', $request->user_id)->first();
            if (!$account) {
                IndividualKycDetail::create([
                    'user_id' => $request->user_id,
                    'education' => $request->education,
                    'employee' => $request->employee,
                    'current_company' => $request->employee == 'Yes' ? $request->current_company : null,
                    'current_position' => $request->employee == 'Yes' ? $request->current_position : null,
                    'current_experience' => $request->employee == 'Yes' ? $request->current_experience : null,
                    'source_of_income' => $request->source_of_income,
                    'average_income' => $request->average_income,
                    'net_worth' => $request->net_worth,
                    'investment_objectives' => $request->investment_objectives, 
                    'investment_knowledge' => $request->investment_knowledge,
                    'reject_note' => $request->reject_note,
                    'high_level_mission' => $request->high_level_mission,
                    'senior_position' => $request->senior_position,
                    'marriage_relationship' => $request->marriage_relationship
                ]);
            } else {
                $account->education = $request->has('education') ? $request->education : $account->education;
                $account->employee = $request->has('employee') ? $request->employee : $account->employee;
                $account->current_company = $request->has('current_company') ?  $request->current_company : $account->current_company;
                $account->current_position = $request->has('current_position') ?  $request->current_position : $account->current_position;
                $account->current_experience = $request->has('current_experience') ?  $request->current_experience : $account->current_experience;
                $account->source_of_income = $request->has('source_of_income') ? $request->source_of_income : $account->source_of_income;
                $account->average_income = $request->has('average_income') ? $request->average_income : $account->average_income;
                $account->net_worth = $request->has('net_worth') ? $request->net_worth : $account->net_worth;
                $account->investment_objectives = $request->has('investment_objectives') ? $request->investment_objectives : $account->investment_objectives;
                $account->investment_knowledge = $request->has('investment_knowledge') ? $request->investment_knowledge : $account->investment_knowledge;
                $account->marriage_relationship = $request->has('marriage_relationship') ? $request->marriage_relationship : $account->marriage_relationship;
                $account->high_level_mission = $request->has('high_level_mission') ? $request->high_level_mission : $account->high_level_mission;
                $account->senior_position = $request->has('senior_position') ? $request->senior_position : $account->senior_position;
                $account->save();
            }

            // $account = IndividualKycDetail::updateOrCreate([
            //     'user_id'   => $request->user_id,
            // ],[
            //     'education' => $request->has('education') ? $request->education : $account->education,
            //     'employee' => $request->has('employee') ? $request->employee : $account->employee,
            //     'current_company' => $request->employee == "Yes" ? ($request->has('current_company') ?  $request->current_company : $account->current_company) : null,
            //     'current_position' => $request->employee == "Yes" ? $request->current_position : null,
            //     'current_experience' => $request->employee == "Yes" ? $request->current_experience : null,
            //     'source_of_income' => $request->has('source_of_income') ? $request->source_of_income : $account->source_of_income,
            //     'average_income' => $request->has('average_income') ? $request->average_income : $account->average_income,
            //     'net_worth' => $request->has('net_worth') ? $request->net_worth : $account->net_worth,
            //     'plan_to_invest' => $request->plan_to_invest,
            //     'marriage_relationship' => $request->has('marriage_relationship') ? $request->marriage_relationship : $account->marriage_relationship,
            //     'high_level_mission' => $request->has('high_level_mission') ? $request->high_level_mission : $account->high_level_mission,
            //     'senior_position' => $request->has('senior_position') ? $request->senior_position : $account->senior_position
            // ]);

            return response()->json([
                'status' => 'true',
                'message' => 'Investor data updated successfully.'
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Investor not found'
            ], 400);
        }
    }

    function updateInstitutionalInvestor(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);
        if(!empty($user)){

            $validator = Validator::make($request->all(), [
                'phone_number' => 'required|unique:users,phone_number,' . $user->phone_number
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user->dob = $request->dob;
            $user->phone_number = $request->has('phone_number') ? $request->investor_name : $user->phone_number;
            $user->national_id = $request->has('id_number') ? $request->id_number : $user->id_number;
            $user->save();
    
            $account = UserAccounts::updateOrCreate([
                'user_id'   => $request->user_id,
            ],[
                // 'dnaneer_account_no'     => $request->dnaneer_account_no,
                'personal_iban_number' => $request->personal_iban_number,
                'bank_id'    => $request->bank_id,
                // 'balance'   => $request->balance
            ]);

            $account = InstitutionalKycDetail::where('user_id', $request->user_id)->first();
            if (!$account) {
                InstitutionalKycDetail::create([
                    'user_id' => $request->user_id,
                    'investor_name' => $request->investor_name,
                    'id_number' => $request->id_number,
                    'position' => $request->position,
                    'phone_number' => $request->phone_number,
                    'source_of_income' => $request->source_of_income,
                    'annual_revenue' => $request->annual_revenue,
                    'marriage_relationship' => $request->marriage_relationship,
                    'high_level_mission' => $request->high_level_mission,
                    'senior_position' => $request->senior_position,
                    'annual_investment_amount' => $request->annual_investment_amount
                ]);
            } else {
                $account->investor_name = $request->has('investor_name') ? $request->investor_name : $account->investor_name;
                $account->id_number = $request->has('id_number') ? $request->id_number : $account->id_number;
                $account->position = $request->has('position') ? $request->position : $account->position;
                $account->phone_number = $request->has('phone_number') ? $request->phone_number : $account->phone_number;
                $account->source_of_income = $request->has('source_of_income') ? $request->source_of_income : $account->source_of_income;
                $account->annual_revenue = $request->has('annual_revenue') ? $request->annual_revenue : $account->annual_revenue;
                $account->marriage_relationship = $request->has('marriage_relationship') ? $request->marriage_relationship : $account->marriage_relationship;
                $account->high_level_mission = $request->has('high_level_mission') ? $request->high_level_mission : $account->high_level_mission;
                $account->senior_position = $request->has('senior_position') ? $request->senior_position : $account->senior_position;
                $account->annual_investment_amount = $request->has('annual_investment_amount') ? $request->annual_investment_amount : $account->annual_investment_amount;

                $account->save();
            }

            // $account = InstitutionalKycDetail::updateOrCreate([
            //     'user_id'   => $request->user_id,
            // ],[
            // 'investor_name' => $request->investor_name,
            // 'id_number' => $request->id_number,
            // 'position' => $request->position,
            // 'phone_number' => $request->phone_number,
            // 'source_of_income' => $request->source_of_income,
            // 'annual_revenue' => $request->annual_revenue,
            // 'marriage_relationship' => $request->marriage_relationship,
            // 'high_level_mission' => $request->high_level_mission,
            // 'senior_position' => $request->senior_position
            // ]);

            return response()->json([
                'status' => 'true',
                'message' => 'Investor data updated successfully.'
            ], 200);
        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'Investor not found'
            ], 401);
        }
    }

    function deactivate(){
        $user_id = Auth::id();
        $user = User::where('id',$user_id)->update(['status'=> 0]);
        //Send OTP according to user Type
        SendOTP($user_id, 'Deactivation');
        
        $token = Auth::user()->tokens();
        $token->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'User Deactivated successfully.'
        ], 200);
    }
    
    function changePassword(Request $request){

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        // Generate OTP and send via Unifonic SMS
        if(env('APP_ENV') == 'Production'){
            $otp = mt_rand(1000, 9999); 
        }else{
            $otp = 1111;
        }
        
        //send otp via Unifonic SMS
        $url = env('unifonic_url').'rest/Messages/Send';
        $params = [
            'AppSid' => 'vc6dDxg4KYwfGyMg1XDRwUJFLDedei',
            'Recipient' => $user->phone_number,
            'Body' => "Your OTP is $otp",
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        
        curl_close($ch);

        $data = json_decode($response);
        if ($data->success == 'false') {
            return response()->json([
                'status' => 'false',
                'message' => 'Something went wrong when sending OTP.'
            ], 400);
        } else {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'false',
                    'message' => 'The provided current password does not match your actual password.'
                ], 401);
            }
            
            $user->password = Hash::make($request->new_password);
            $user->save();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Password changed successfully.'
            ], 200);
        }
    }

    public function fundTransfer(Request $request){
        $validator = Validator::make($request->all(), [
            // 'bank_id' => 'required',
            // 'personal_iban_number' => 'required|min:24|max:24',
            'amount' => 'required|digits_between:0,9'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if(Auth::user()){
            $user_id = Auth::id();
            SendOTP($user_id, 'Withdraw');
            $account = UserAccounts::where('user_id', $user_id)->first();
            if(empty($account)){
                return response()->json([
                    'status' => 'false',
                    'message' => 'User account not exist.'
                ], 401);
            }
            if($account->balance >= $request->amount){
                $running_balance = ($account->balance - $request->amount);
                $account->balance = $running_balance;
                $account->save();
                //Store data in TransferRequest Table
                $data = new TransferRequest();
                $data->user_id = $user_id;
                $data->personal_iban_number = $account->personal_iban_number;
                $data->bank_id = $account->bank_id;
                $data->amount = $request->amount;
                $data->status = 'pending';
                $data->save();
                return response()->json([
                    'status' => 'true',
                    'message' => 'Transfer request generated successfully.',
                    'data' => $data
                ], 200);
            }else{
                return response()->json([
                    'status' => 'false',
                    'message' => 'Insufficient fund for this request.'
                ], 401);
            }

        }else{
            return response()->json([
                'status' => 'false',
                'message' => 'User not Authorized.'
            ], 401);
        }
    }

    function get_classifications(){
        $classification = UserClassification::select('id','name')->where('status',1)->get();
        return response()->json([
            'status' => 'true',
            'data' => $classification
        ], 200);
    }

    function poa_agreement(Request $request){
        $user = Auth::user();
        $address = null;
        $firstName = null;
        $familyName = null;
        $view = null;
        $data = [];

        if(!empty($user)){
            if($user->user_type == 1){//individual user
                // $details = IndividualKycDetail::where('user_id', $user->id)->first();

                if(!empty($user->nafath)){
                    $nafath = json_decode($user->nafath);
                    $firstName = $nafath->firstName;
                    $familyName = $nafath->familyName;
                    $fatherName = $nafath->fatherName;
                    $investorName = $firstName.' '.$familyName;
                    // $dobG = $nafath->dateOfBirthG;
                    $dobH = $nafath->dateOfBirthH;

                    if(!empty($nafath->nationalAddress)){
                        $address = $nafath->nationalAddress[0]->streetName. ', '. $nafath->nationalAddress[0]->city. ', '. $nafath->nationalAddress[0]->district;
                    }

                    $view = 'pdf.individual-poa-agreement';

                    $data = [
                        'investor_name' => $investorName,
                        'submission_date' => date('d-m-Y'),
                        'national_id' => $user->national_id,
                        'dob' => $dobH,
                        'address' => $address
                    ];
                }
            }
            if($user->user_type == 2){ //institutional user
                // InstitutionalKycDetail::where('user_id', $user->id)->first();
                if(!empty($user->wathq)){
                    $wathq = json_decode($user->wathq);
                    $institutionalKycDetails = InstitutionalKycDetail::where('user_id', $user->id)->first();
                    $companyName = $user->name;
                    // $familyName = $wathq->familyName;
                    // $fatherName = $wathq->fatherName;
                    if(!empty($wathq->address)){
                        $address = $wathq->address->general->address;
                    }
                    $contactPerson = null;
                    if(!empty($user->nafath)){
                        $nafath = json_decode($user->nafath);
                        $contactPerson = $nafath->firstName . ' ' . $nafath->familyName;
                    }

                    $view = 'pdf.institutional-poa-agreement';

                    $data = [
                        'company_name' => $wathq->crName,
                        'submission_date' => date('d-m-Y'),
                        'cr_issuing_date' => $wathq->issueDate,
                        'cr_number' => $wathq->crNumber,
                        'address' => $wathq->location->name,
                        'contact_person_name' => ($contactPerson != null) ? $contactPerson : $institutionalKycDetails->investor_name
                    ];
                }
            }
        }

        $data['logo'] = base64_encode(file_get_contents(public_path('images/pdf-logo.png')));
        $data['submission_date'] = date('d-m-Y');
        $data['serial_number'] = '01'.date("d").date("m").date("y");
        
        // Render the Blade view and get its content
        // $htmlContent = View::make('pdf/pdf-template', compact('logo', 'investor_name', 'submission_date','national_id','dob'))->render();
            
        // return response()->json([
        //      $htmlContent
        // ]);
        return view($view)->with(['data' => $data]);
    }

    public function verifyInstituteContactPerson(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'national_id' => 'required|min:10|max:10|unique:users',
            "locale" => "required|string|max:3",
            "phone_number" => "required|string|max:15"
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $nationalId = $request->national_id;
            $locale = $request->locale;
            $phoneNumber = $request->phone_number;
            $requestId = $request->input('request_id', uniqid());
            $email = $request->user['email'];
    
            $end_point = "/mfa/request?local=$locale&requestId=".$requestId;
            if(env('APP_ENV') == 'Production'){
                $url = Config::get('services.nafath.prod_url').$end_point;
                $appId = Config::get('services.nafath.app_id');
                $appKey = Config::get('services.nafath.app_key');
            }else{
                $url = Config::get('services.nafath.stg_url').$end_point;
                $appId = Config::get('services.nafath.stg_app_id');
                $appKey = Config::get('services.nafath.stg_app_key');
            }
            
            $request = [
                'nationalId' => $nationalId,
                'service' => "OpenAccount"
            ];
    
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'APP-ID:'.$appId,
                'APP-KEY:'.$appKey,
            ));
    
            $response = curl_exec($ch);
            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $err = curl_error($ch);
    
            curl_close($ch);

            $responseData = json_decode($response, true);
            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($err) {
                return response()->json([
                    'error' => 'error',
                    'statusCode' => $statusCode,
                    'message' => $responseData['message']
                ], $statusCode);
            } else {
                if ($statusCode >= 200 && $statusCode < 300) {
                    User::where('email', $email)->update([
                        'national_id' => $nationalId,
                        'transid' => $responseData['transId'],
                        'requestid' => $requestId,
                        'phone_number' => $phoneNumber
                    ]);
                    // $user = User::where('email', $email)->first();
                    // dump($user);
                    return response()->json([
                        'transId' => $responseData['transId'],
                        'random' => $responseData['random'],
                    ]);
                } else {
                    return response()->json([
                        'error' => 'error',
                        'statusCode' => $statusCode,
                        'message' => $responseData['message']
                    ], $statusCode);
                }
            }
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function verifyContactPersonNafathCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nationalId' => 'required|min:10',
                'transId' => 'required',
                'random' => 'required|string'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $nationalId = $request->nationalId;
            $random = $request->random;
            $transId = $request->transId;

            $end_point = "/mfa/request/status";
            if(env('APP_ENV') == 'Production'){
                $url = Config::get('services.nafath.prod_url').$end_point;
                $appId = Config::get('services.nafath.app_id');
                $appKey = Config::get('services.nafath.app_key');
            }else{
                $url = Config::get('services.nafath.prod_url').$end_point;
                $appId = Config::get('services.nafath.app_id');
                $appKey = Config::get('services.nafath.app_key');
            }

            $data = [
                'nationalId' => $nationalId,
                'transId' => $transId,
                'random' => $random
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'APP-ID:'.$appId,
                'APP-KEY:'.$appKey,
            ));
    
            $response = curl_exec($ch);
            $err = curl_error($ch);
            curl_close($ch);

            $responseData = json_decode($response, true);
            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($err) {
                return response()->json([
                    'error' => 'error',
                    'statusCode' => $statusCode,
                    'message' => $responseData['message']
                ], $statusCode);
            } else {
                if ($statusCode >= 200 && $statusCode < 300) {
                    // The request was successful.
                    if($responseData['status'] == "COMPLETED"){
                        $user = User::where('transid', $request->transId)->first();
                        $userData = Auth::loginUsingId($user->id);
                        $token = $userData->createToken('DnaneerApp')->plainTextToken;
                        return response()->json([
                            'status' => 'success',
                            'code' => 200,
                            'message' => 'User registered successfully.',
                            'token' => $token,
                            'data' => [
                                'user' => $userData
                            ],
                        ], 200);
                    }else{
                        return response()->json([
                            'status' => $responseData['status'],
                        ], 401);
                    }
                } else {
                    return response()->json([
                        'error' => 'error',
                        'statusCode' => $statusCode,
                    ], $statusCode);
                }
            }
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}


?>