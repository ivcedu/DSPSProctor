<?php
    require("config.php");
    
    $IVCHoliday = filter_input(INPUT_POST, 'IVCHoliday');
    
    $query = "SELECT TOP(1) * FROM [IVCDSPS].[dbo].[IVCHoliday] WHERE IVCHoliday = '".$IVCHoliday."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);