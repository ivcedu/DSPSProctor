<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    
    $query = "SELECT inst.TAllotMin,"
            . "inst.Mailbox, "
            . "(SELECT BLDCODE FROM [IVCDSPS].[dbo].[IVCBLD] WHERE IVCBLDID = inst.MailboxBldID) AS MailBuilding, "
            . "inst.Bldg, "
            . "inst.ProfessorPU, "
            . "inst.Faculty, "
            . "(SELECT BLDCODE FROM [IVCDSPS].[dbo].[IVCBLD] WHERE IVCBLDID = inst.FacultyBldID) AS FacultyBuilding, "
            . "inst.Office, "
            . "inst.StuDelivery, "
            . "inst.ScanEmail, "
            . "seop.SEOption, "
            . "inst.ExamAttach "
            . "FROM [IVCDSPS].[dbo].[InstForm] AS inst LEFT JOIN [IVCDSPS].[dbo].[SEOption] AS seop ON inst.SEOptionID = seop.SEOptionID "
            . "WHERE inst.ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    echo json_encode($data);