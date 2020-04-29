<?php
	// Get the client id and secret by registering your application on https://www.iconfinder.com/account/applications
	$CLIENT_ID = "K4e9kRehil3X77YkPJF1eHKuJId8NvGpHhvwIHKD6ogwLJHPL4pBPw9StFTHWEnn";
	$CLIENT_SECRET = "tGiNhT7AzlPp7B63jpRAuLDsNsJNgIKN8PIYCus6XenpsItvr48VRUNsLuiuN8dm";
	
	// Request token
	$AUTH_URL = "https://www.iconfinder.com/api/v3/oauth2/token";
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $AUTH_URL);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=jwt_bearer&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET");
	$result = curl_exec($ch);
	curl_close($ch); 
		
	// Prepare response
 	header('Content-type: application/json');

    echo $result;

	// return JWT to requesting app
	// if($result == FALSE) {
	// 	// Something went wrong.
	// 	echo json_encode(array("error" => "CURL request failed."));
	// }
	// else {
	//     $result_decoded = json_decode($result);
		
	// 	if(array_key_exists("error", $result_decoded) or !array_key_exists("access_token", $result_decoded)) {
	// 		// Use this for additional error handling.
	// 		echo $result;
	// 	}
	// 	else {
	// 		// Print successful response.
			
    //         // $result = str_replace('{', '', $result);
    //         // $result = str_replace('"', '', $result);
    //         // $result = str_replace('access_token', '', $result);
    //         // $result = str_replace(':', '', $result);
    //         // $result = str_replace(',', '', $result);
    //         // $result = str_replace('token_type', '', $result);
    //         // $result = str_replace('JWT', '', $result);
    //         // $result = str_replace('}', '', $result);

    //         // { " access_token : , token_type JWT }

    //         echo $result;

	// 		// $curl = curl_init();
    //         // curl_setopt($curl,CURLOPT_URL,"https://api.iconfinder.com/v3/user?access_token=$result");
    //         // // https://api.iconfinder.com/v3/icons/search?query=car
    //         // // curl_setopt($curl,CURLOPT_HEADER,false);
    //         // curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
    //         // $json = curl_exec($curl);
    //         // curl_close($curl);
    //         // header("Content-Type: text/json; charset=utf-8");
    //         // echo $json;

	// 	}
	// }



?>