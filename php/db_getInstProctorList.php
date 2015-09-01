<?php
    require("config.php");
    
    $InstEmail = filter_input(INPUT_POST, 'InstEmail');
    
    $query = "SELECT pct.*, stu.[Status], stp.Step "
                ."FROM [IVCDSPS].[dbo].[Proctor] AS pct LEFT JOIN [IVCDSPS].[dbo].[Status] AS stu ON pct.StatusID = stu.StatusID "
                ."LEFT JOIN [IVCDSPS].[dbo].[Step] AS stp ON pct.StepID = stp.StepID "
                ."WHERE (pct.StepID = 2 OR pct.StepID = 4) AND pct.StatusID = 2 AND pct.InstEmail = '".$InstEmail."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);