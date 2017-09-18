<?php
    require("config.php");
    
    $InstExamFileID = filter_input(INPUT_POST, 'InstExamFileID');
    
    $query = "SELECT TOP(1) * FROM [IVCDSPS].[dbo].[InstExamFile] WHERE InstExamFileID = '".$InstExamFileID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);