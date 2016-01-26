<?php
    require("config.php");
    
    $SearchOption = filter_input(INPUT_POST, 'SearchOption');
    $SearchValue = filter_input(INPUT_POST, 'SearchValue');
    $sql_options = "";
    
    if ($SearchOption !== "All") {
        switch ($SearchOption) {
            case "Student ID":
                $sql_options = " AND pct.StuID LIKE '".$SearchValue."%'";
                break;
            case "Instructor Name":
                $sql_options = " AND pct.InstName LIKE '".$SearchValue."%'";
                break;
            case "Course Name":
                $sql_options = " AND pct.CourseID LIKE '".$SearchValue."%'";
                break;
            default:
                break;
        }
    }
    
    $query = "SELECT pct.*, stu.[Status], stp.Step "
                . "FROM [IVCDSPS].[dbo].[Proctor] AS pct LEFT JOIN [IVCDSPS].[dbo].[Status] AS stu ON pct.StatusID = stu.StatusID "
                . "LEFT JOIN [IVCDSPS].[dbo].[Step] AS stp ON pct.StepID = stp.StepID "
                . "WHERE (pct.StatusID = 1 OR pct.StatusID = 2 OR pct.StatusID = 7)".$sql_options." "
                . "ORDER BY pct.DateSubmitted DESC";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);