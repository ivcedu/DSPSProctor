<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $ExamReceived = filter_input(INPUT_POST, 'ExamReceived');

    $query = "UPDATE [IVCDSPS].[dbo].[InstForm] "
            . "SET ExamReceived = '".$ExamReceived."' "
            . "WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);