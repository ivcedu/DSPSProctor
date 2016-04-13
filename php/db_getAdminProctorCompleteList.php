<?php
    require("config.php");
    
    $SearchField = filter_input(INPUT_POST, 'SearchField');
    $Value = filter_input(INPUT_POST, 'Value');
    $sql_search_option = "";
    
    if ($SearchField !== "All") {
        switch ($SearchField) {
            case "Student ID":
                $sql_search_option = " AND pct.StuID LIKE '".$Value."%'";
                break;
            case "Instructor Name":
                $sql_search_option = " AND pct.InstName LIKE '%".$Value."%'";
                break;
            case "Course Name":
                $sql_search_option = " AND pct.CourseID LIKE '".$Value."%'";
                break;
        }
    }
    
    $query = "SELECT pct.*, stu.[Status], stp.Step "
                ."FROM [IVCDSPS].[dbo].[Proctor] AS pct LEFT JOIN [IVCDSPS].[dbo].[Status] AS stu ON pct.StatusID = stu.StatusID "
                ."LEFT JOIN [IVCDSPS].[dbo].[Step] AS stp ON pct.StepID = stp.StepID "
                ."WHERE (pct.StatusID <> 1 AND pct.StatusID <> 2)".$sql_search_option;
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);