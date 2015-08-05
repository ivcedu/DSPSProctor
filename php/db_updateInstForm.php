<?php
    require("config.php");
    
    $ProctorID = filter_input(INPUT_POST, 'ProctorID');
    $TAllotMin = filter_input(INPUT_POST, 'TAllotMin');
    $Mailbox = filter_input(INPUT_POST, 'Mailbox');
    $MailboxBldID = filter_input(INPUT_POST, 'MailboxBldID');
    $Bldg = filter_input(INPUT_POST, 'Bldg');
    $ProfessorPU = filter_input(INPUT_POST, 'ProfessorPU');
    $Faculty = filter_input(INPUT_POST, 'Faculty');
    $FacultyBldID = filter_input(INPUT_POST, 'FacultyBldID');
    $Office = filter_input(INPUT_POST, 'Office');
    $StuDelivery = filter_input(INPUT_POST, 'StuDelivery');
    $ScanEmail = filter_input(INPUT_POST, 'ScanEmail');
    $SEOptionID = filter_input(INPUT_POST, 'SEOptionID');
    $ExamAttach = filter_input(INPUT_POST, 'ExamAttach');

    $query = "UPDATE [IVCDSPS].[dbo].[InstForm] "
            . "SET TAllotMin = '".$TAllotMin."', Mailbox = '".$Mailbox."', MailboxBldID = '".$MailboxBldID."', Bldg = '".$Bldg."', ProfessorPU = '".$ProfessorPU."', "
            . "Faculty = '".$Faculty."', FacultyBldID = '".$FacultyBldID."', Office = '".$Office."', StuDelivery = '".$StuDelivery."', ScanEmail = '".$ScanEmail."', "
            . "SEOptionID = '".$SEOptionID."', ExamAttach = '".$ExamAttach."' "
            . "WHERE ProctorID = '".$ProctorID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);