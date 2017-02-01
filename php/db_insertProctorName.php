<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $StuFName = filter_input(INPUT_POST, 'StuFName');
    $StuLName = filter_input(INPUT_POST, 'StuLName');
    $InstFName = filter_input(INPUT_POST, 'InstFName');
    $InstLName = filter_input(INPUT_POST, 'InstLName');
    
    $StuFName = str_replace("'", "''", $StuFName);
    $StuLName = str_replace("'", "''", $StuLName);
    $InstFName = str_replace("'", "''", $InstFName);
    $InstLName = str_replace("'", "''", $InstLName);

    $query = "INSERT INTO [IVCDSPS].[dbo].[ProctorName] (ProctorID, StuFName, StuLName, InstFName, InstLName) "
                ."VALUES ('$ProctorID', '$StuFName', '$StuLName', '$InstFName', '$InstLName')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);