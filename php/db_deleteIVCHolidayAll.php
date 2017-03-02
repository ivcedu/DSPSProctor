<?php
    require("config.php");

    $query = "DELETE FROM [IVCDSPS].[dbo].[IVCHoliday]";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();

    echo json_encode($result);