<?php
    require("config_tardis.php");
    
    $query = "SELECT TermCode FROM [Tardis].[dbo].[CurrentTerm]";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['TermCode']);