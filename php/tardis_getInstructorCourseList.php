<?php
    require("config.php");
    
    $InstructorUID = filter_input(INPUT_POST, 'InstructorUID');
    $TermCode = filter_input(INPUT_POST, 'TermCode');

    $query = "SELECT * FROM [SKYBLAST.SOCCCD.EDU].[Tardis].[dbo].[CourseInfo] "
            . "WHERE InstructorUID = '".$InstructorUID."' AND TermCode = '".$TermCode."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);