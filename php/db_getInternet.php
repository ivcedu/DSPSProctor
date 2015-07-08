<?php
    require("config.php");
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[Internet]";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);