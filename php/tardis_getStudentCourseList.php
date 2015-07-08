<?php
    require("config_tardis.php");
    
    $StudentID = filter_input(INPUT_POST, 'StudentID');
    $TermCode = filter_input(INPUT_POST, 'TermCode');

    $query = "SELECT crif.InstructorName, crif.InstructorUID, crif.CourseID, crif.SectionNum, crif.CourseTitle "
                . "FROM [Tardis].[dbo].[StudentCourses] AS stcr LEFT JOIN [Tardis].[dbo].[CourseInfo] AS crif ON stcr.SectionNum = crif.SectionNum AND stcr.TermCode = crif.TermCode "
                . "WHERE stcr.StudentID = '" . $StudentID . "' AND stcr.TermCode = '" . $TermCode . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);