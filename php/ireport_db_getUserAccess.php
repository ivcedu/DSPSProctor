<?php
    require("config_ireport.php");
    
    $Username = filter_input(INPUT_POST, 'Username');

    $query = "SELECT UserAccessID FROM [IREPORT].[dbo].[UserAccess] WHERE Username = '".$Username."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data["UserAccessID"]);