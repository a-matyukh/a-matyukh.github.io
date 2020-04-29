<?php
$category = $_POST['category'];
$folder = $_POST['folder'];

$dir = opendir ("../../imgs/board/$category/$folder/");
while ($file = readdir ($dir)) {
    if (( $file != ".") && ($file != "..")) {
        $id = uniqid();
        $array[] = "<img src='./imgs/board/$category/$folder/$file' id='pin$id' onload='makeCell(this)' ondragstart='handleDragStart(event)'>";
    }
}
echo json_encode($array);
closedir ($dir);

?>