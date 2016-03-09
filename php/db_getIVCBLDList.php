<?php
    require("config.php");
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[IVCBLD] where Active = 1";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);