<?php
    $output_dir = "C:/xampp/htdocs/DSPSProctor/attach_files/";

    if(isset($_FILES["files"])) {    
        $file_link_name = $_FILES["files"]["name"][0];
        $file_link_name = str_replace("'", "", $file_link_name);

        $result = move_uploaded_file($_FILES["files"]["tmp_name"][0], $output_dir.$file_link_name);
        echo json_encode($result); 
    }