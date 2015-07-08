<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    
    $query = "SELECT * FROM [IVCDSPS].[dbo].[InstForm] AS inst LEFT JOIN [IVCDSPS].[dbo].[SEOption] AS seop ON inst.SEOptionID = seop.SEOptionID "
            ."WHERE inst.ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);