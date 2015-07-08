<?php
    require("config.php");
    
    $AttachmentID = filter_input(INPUT_POST, 'AttachmentID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[Attachment] WHERE AttachmentID = '".$AttachmentID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);