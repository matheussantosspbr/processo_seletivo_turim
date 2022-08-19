<?php

include("class/consultas.php");




if (isset($_POST['gravar'])) {
  $db = new bd();
  $jsonStr = $_POST['json'];
  $json = json_decode($jsonStr, TRUE);
  $db->gravar($json);
  header('Location: index.php');
}

if (isset($_POST['ler'])) {
  $db = new bd();
  $json = $db->ler();

  $json = json_encode($json, JSON_UNESCAPED_UNICODE);

  header("Location: index.php?json=$json");
}
