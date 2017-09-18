<?php
    require("config.php");
    
    $InstEmail = filter_input(INPUT_POST, 'InstEmail');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[InstExamFile] WHERE InstEmail = '".$InstEmail."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);