<?
$data=$_POST['data'];
if (!file_exists('db')) {
  mkdir('db', 0777, true);
}
$fn="db/".microtime(true).".json";
file_put_contents ($fn,$data);