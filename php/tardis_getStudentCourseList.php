<?php
    require("config.php");
    
    $StudentID = filter_input(INPUT_POST, 'StudentID');
    $TermCode = filter_input(INPUT_POST, 'TermCode');

    $query = "SELECT crif.InstructorName, crif.InstructorUID, crif.CourseID, crif.SectionNum, crif.CourseTitle "
            . "FROM [TOPSPIN.SOCCCD.EDU\TOPSPIN].[Tardis].[dbo].[StudentCourses] AS stcr "
            . "LEFT JOIN [TOPSPIN.SOCCCD.EDU\TOPSPIN].[Tardis].[dbo].[CourseInfo] AS crif ON stcr.SectionNum = crif.SectionNum AND stcr.TermCode = crif.TermCode "
            . "WHERE crif.CollegeCode = 'I' AND crif.CourseID <> 'TU 301' AND stcr.TermCode = '" . $TermCode . "' AND stcr.StudentID = '" . $StudentID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);