<?
$data=$_POST['data'];
$fn="db/".microtime(true).".json";
file_put_contents ($fn,$data);