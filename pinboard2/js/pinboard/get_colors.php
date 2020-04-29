<?php
  $type = $_POST['type'];;
  $curl = curl_init();
  curl_setopt($curl,CURLOPT_URL,"http://www.colourlovers.com/api/colors/$type&format=json&numResults=100");
  curl_setopt($curl,CURLOPT_HEADER,false);
  curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
  $json = curl_exec($curl);
  curl_close($curl);

  header("Content-Type: text/json; charset=utf-8");
  echo $json;
?>