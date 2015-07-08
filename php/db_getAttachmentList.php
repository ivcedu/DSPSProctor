<?php
    require("config.php");
    
    $ProctorID= filter_input(INPUT_POST, 'ProctorID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[Attachment] WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);