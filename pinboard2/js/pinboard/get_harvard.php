<?php
  $query = $_POST['query'];;
  $curl = curl_init();
  curl_setopt($curl,CURLOPT_URL,"https://api.harvardartmuseums.org/object?apikey=dc9e22e0-7d69-11e9-944a-872d35822cd2");
  curl_setopt($curl,CURLOPT_HEADER,false);
  curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
  $json = curl_exec($curl);
  curl_close($curl);
  header("Content-Type: text/json; charset=utf-8");
  echo $json;
?>