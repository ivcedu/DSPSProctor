<?php
    require("config.php");
    
    $query = "SELECT TermCode FROM [SKYBLAST.SOCCCD.EDU].[Tardis].[dbo].[CurrentTerm]";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['TermCode']);