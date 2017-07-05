<?php
    require("config.php");
    $output_dir = "C:/xampp/htdocs/DSPSProctor/attach_files/";

    if(isset($_FILES["files"]))
    {    
        $fileString = $_FILES["files"]["name"][0];
        
        $pos_1 = strpos($fileString, "_fileIndex_");
        $exampdf_id = substr($fileString, 0, $pos_1);
        
        $file_name = substr($fileString, $pos_1 + 11);
        $file_link_name = $exampdf_id . "_" . $file_name;
        
        $file_name = str_replace("'", "", $file_name);
        $file_link_name = str_replace("'", "", $file_link_name);

        $result = move_uploaded_file($_FILES["files"]["tmp_name"][0], $output_dir.$file_link_name);
        $result = updateExamPDFLinkFileNmae($dbConn, $exampdf_id, $file_link_name);

        echo json_encode($result); 
    }
    
    function updateExamPDFLinkFileNmae($dbConn, $exampdf_id, $file_link_name) {        
        $query = "UPDATE [IVCDSPS].[dbo].[ExamPDF] "
                    . "SET FileLinkName = '".$file_link_name."' "
                    . "WHERE ExamPDFID = '".$exampdf_id."'";

        $cmd = $dbConn->prepare($query);
        $result = $cmd->execute(); 
        
        return $result;
    }