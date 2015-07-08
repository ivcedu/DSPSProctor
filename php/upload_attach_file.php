<?php
    require("config.php");
    $output_dir = "C:/xampp/htdocs/DSPSProctor/attach_files/";

    if(isset($_FILES["files"]))
    {    
        $fileString = $_FILES["files"]["name"][0];
        
        $pos_1 = strpos($fileString, "<{PID}>");
        $proctor_id = substr($fileString, 0, $pos_1);
        
        $pos_2 = strpos($fileString, "<{UID}>");
        $uid = substr($fileString, $pos_1 + 7, $pos_2 - ($pos_1 + 7));
        
        $file_name = substr($fileString, $pos_2 + 7);
        $file_link_name = $proctor_id."_".$uid."_".$file_name;

        $result = move_uploaded_file($_FILES["files"]["tmp_name"][0], $output_dir.$file_link_name);
        $AttachmentID = insertAttachToDB($dbConn, $proctor_id, $file_link_name, $file_name);

        echo json_encode($AttachmentID); 
    }
    
    function insertAttachToDB($dbConn, $proctor_id, $file_link_name, $file_name) {        
        $query = "INSERT INTO [IVCDSPS].[dbo].[Attachment] "
                    ."(ProctorID, FileLinkName, FileName) "
                    ."VALUES ('$proctor_id', '$file_link_name', '$file_name')";

        $cmd = $dbConn->prepare($query);
        $cmd->execute();
        $ResultID = $dbConn->lastInsertId();
        
        return $ResultID;
    }