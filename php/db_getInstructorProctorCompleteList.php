<?php
    require("config.php");
    
    $InstEmail = filter_input(INPUT_POST, 'InstEmail');
    
    $query = "SELECT pct.ProctorID, pct.SectionNum, pct.CourseID, pct.StuName, stu.[Status], stp.Step, "
                . "CONVERT(datetime, pct.TestDate + ' ' + pct.TestTime) AS TestDT "
                . "FROM [IVCDSPS].[dbo].[Proctor] AS pct LEFT JOIN [IVCDSPS].[dbo].[Status] AS stu ON pct.StatusID = stu.StatusID "
                . "LEFT JOIN [IVCDSPS].[dbo].[Step] AS stp ON pct.StepID = stp.StepID "
                . "WHERE pct.StatusID <> 1 AND pct.StatusID <> 2 AND pct.InstEmail = '".$InstEmail."' "
                . "ORDER BY TestDT ASC";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);