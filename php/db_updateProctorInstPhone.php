<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $InstPhone = filter_input(INPUT_POST, 'InstPhone');

    $query = "UPDATE [IVCDSPS].[dbo].[Proctor] "
                ."SET InstPhone = '".$InstPhone."' "
                ."WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);