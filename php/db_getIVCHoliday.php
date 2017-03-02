<?php
    require("config.php");
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[IVCHoliday]";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);