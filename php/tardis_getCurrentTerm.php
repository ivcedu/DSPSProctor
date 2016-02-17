<?php
    require("config.php");
    
    $query = "SELECT TermCode FROM [TOPSPIN.SOCCCD.EDU\TOPSPIN].[Tardis].[dbo].[CurrentTerm]";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['TermCode']);