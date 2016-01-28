<?php
    require("config.php");
    
    $AdminID = filter_input(INPUT_POST, 'AdminID');
    $AdminName = filter_input(INPUT_POST, 'AdminName');
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');

    $query = "UPDATE [IVCDSPS].[dbo].[Admin] "
                . "SET AdminName = '".$AdminName."', ".AdminEmail." = '".$AdminEmail."' "
                . "WHERE AdminID = '".$AdminID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);