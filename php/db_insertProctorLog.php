<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $LoginUser = filter_input(INPUT_POST, 'LoginUser');
    $StepID = filter_input(INPUT_POST, 'StepID');
    $StatusID = filter_input(INPUT_POST, 'StatusID');

    $query = "INSERT INTO [IVCDSPS].[dbo].[ProctorLog] (ProctorID, LoginUser, StepID, StatusID) "
                ."VALUES ('$ProctorID', '$LoginUser', '$StepID', '$StatusID')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);