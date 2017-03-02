<?php
    require("config.php");
    
    $IVCHoliday = filter_input(INPUT_POST, 'IVCHoliday');

    $query = "INSERT INTO [IVCDSPS].[dbo].[IVCHoliday] (IVCHoliday) "
                ."VALUES ('$IVCHoliday')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);