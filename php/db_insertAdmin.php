<?php
    require("config.php");
    
    $AdminName = filter_input(INPUT_POST, 'AdminName');
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');
    
    $AdminName = str_replace("'", "''", $AdminName);
    $AdminEmail = str_replace("'", "", $AdminEmail);

    $query = "INSERT INTO [IVCDSPS].[dbo].[Admin] (AdminName, AdminEmail, AdminSetting) "
                ."VALUES ('$AdminName', '$AdminEmail', 'All Admin')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);