<?php
    require("config.php");
    
    $query = "SELECT pct.*, stu.[Status], stp.Step "
                ."FROM [IVCDSPS].[dbo].[Proctor] AS pct LEFT JOIN [IVCDSPS].[dbo].[Status] AS stu ON pct.StatusID = stu.StatusID "
                ."LEFT JOIN [IVCDSPS].[dbo].[Step] AS stp ON pct.StepID = stp.StepID "
                ."WHERE pct.StatusID = 1 OR pct.StatusID = 2 OR pct.StatusID = 7";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);