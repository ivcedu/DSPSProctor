<?php
    require("config.php");
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[Admin] ORDER BY AdminName ASC";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);