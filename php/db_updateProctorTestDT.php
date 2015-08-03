<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $TestDate = filter_input(INPUT_POST, 'TestDate');
    $TestTime = filter_input(INPUT_POST, 'TestTime');

    $query = "UPDATE [IVCDSPS].[dbo].[Proctor] "
                ."SET TestDate = '".$TestDate."', TestTime = '".$TestTime."' "
                ."WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);