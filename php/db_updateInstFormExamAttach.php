<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $ExamAttach = filter_input(INPUT_POST, 'ExamAttach');

    $query = "UPDATE [IVCDSPS].[dbo].[InstForm] "
            . "SET ExamAttach = '".$ExamAttach."' "
            . "WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);