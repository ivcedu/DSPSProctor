<?php
    require("config.php");
     
    $IVCHolidayID = filter_input(INPUT_POST, 'IVCHolidayID');

    $query = "DELETE FROM [IVCDSPS].[dbo].[IVCHoliday] WHERE IVCHolidayID = '".$IVCHolidayID."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();

    echo json_encode($result);