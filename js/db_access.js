// LDAP get ////////////////////////////////////////////////////////////////////
function getLoginUserInfo(php_file, user, pass) {
    var result = new Array();
    $.ajax({
        type:"POST",
        datatype:"json",
        url:php_file,
        data:{username:user, password:pass},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

// search LDAP user ////////////////////////////////////////////////////////////
function ldap_getUser(userID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/ldap_searchUser.php",
        data:{userID:userID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tardis get DB ///////////////////////////////////////////////////////////////
function tardis_getCurrentTerm() {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/tardis_getCurrentTerm.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function tardis_getStudentCourseList(StudentID, TermCode) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/tardis_getStudentCourseList.php",
        data:{StudentID:StudentID, TermCode:TermCode},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// get DB //////////////////////////////////////////////////////////////////////
function db_getAdmin(AdminEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdmin.php",
        data:{AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByID(AdminID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByID.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getProctor(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getProctor.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAccom(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAccom.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getInstForm(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getInstForm.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getExamGuide(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getExamGuide.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminProctorList(SearchOption, SearchValue) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminProctorList.php",
        data:{SearchOption:SearchOption, SearchValue:SearchValue},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminProctorCompleteList(SearchField, Value) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminProctorCompleteList.php",
        data:{SearchField:SearchField, Value:Value},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getInstProctorList(InstEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getInstProctorList.php",
        data:{InstEmail:InstEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getInstProctorCompleteList(InstEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getInstructorProctorCompleteList.php",
        data:{InstEmail:InstEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getProctorLog(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getProctorLog.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAttachment(AttachmentID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAttachment.php",
        data:{AttachmentID:AttachmentID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAttachmentList(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAttachmentList.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getSEOption() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getSEOption.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCalType() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCalType.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getInternet() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getInternet.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getTransaction(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getTransaction.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getExamPDF(ExamPDFID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getExamPDF.php",
        data:{ExamPDFID:ExamPDFID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getExamPDFList(ProctorID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getExamPDFList.php",
        data:{ProctorID:ProctorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getIVCBLDList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getIVCBLDList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// insert DB ///////////////////////////////////////////////////////////////////
function db_insertProctor(StuName, StuEmail, StuID, InstName, InstEmail, CourseID, SectionNum, TestDate, TestTime, Comments) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertProctor.php",
        data:{StuName:StuName, StuEmail:StuEmail, StuID:StuID, InstName:InstName, InstEmail:InstEmail, CourseID:CourseID, 
                SectionNum:SectionNum, TestDate:TestDate, TestTime:TestTime, Comments:Comments},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertAccom(ProctorID, TimeOneHalf, DoubleTime, AltMedia, Reader, EnlargeExam, UseOfComp, Other, txtOther, Scribe, Scantron, WrittenExam, Distraction) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAccom.php",
        data:{ProctorID:ProctorID, TimeOneHalf:TimeOneHalf, DoubleTime:DoubleTime, AltMedia:AltMedia, Reader:Reader, EnlargeExam:EnlargeExam, 
                UseOfComp:UseOfComp, Other:Other, txtOther:txtOther, Scribe:Scribe, Scantron:Scantron, WrittenExam:WrittenExam, Distraction:Distraction},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertInstForm(ProctorID, TAllotMin, Mailbox, MailboxBldID, Bldg, ProfessorPU, Faculty, FacultyBldID, Office, StuDelivery, ScanEmail, SEOptionID, ExamAttach) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertInstForm.php",
        data:{ProctorID:ProctorID, TAllotMin:TAllotMin, Mailbox:Mailbox, MailboxBldID:MailboxBldID, Bldg:Bldg, ProfessorPU:ProfessorPU, Faculty:Faculty, FacultyBldID:FacultyBldID, Office:Office, 
                StuDelivery:StuDelivery, ScanEmail:ScanEmail, SEOptionID:SEOptionID, ExamAttach:ExamAttach},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertExamGuide(ProctorID, Notes, Book, Calculator, CalTypeID, CalTypeOther, Dictionary, ScratchPaper, Scantron, Computer, InternetID) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertExamGuide.php",
        data:{ProctorID:ProctorID, Notes:Notes, Book:Book, Calculator:Calculator, CalTypeID:CalTypeID, CalTypeOther:CalTypeOther, Dictionary:Dictionary, 
                ScratchPaper:ScratchPaper, Scantron:Scantron, Computer:Computer, InternetID:InternetID},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertTransaction(ProctorID, LoginName, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertTransaction.php",
        data:{ProctorID:ProctorID, LoginName:LoginName, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertProctorLog(ProctorID, LoginUser, StepID, StatusID) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertProctorLog.php",
        data:{ProctorID:ProctorID, LoginUser:LoginUser, StepID:StepID, StatusID:StatusID},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertExamPDF(ProctorID, FileName, ExamPDF) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertExamPDF.php",
        data:{ProctorID:ProctorID, FileName:FileName, ExamPDF:ExamPDF},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertAdmin(AdminName, AdminEmail) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAdmin.php",
        data:{AdminName:AdminName, AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

// update DB ///////////////////////////////////////////////////////////////////
function db_updateProctorStatus(ProctorID, StatusID, Column) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateProctorStatus.php",
        data:{ProctorID:ProctorID, StatusID:StatusID, Column:Column},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateProctorStep(ProctorID, StepID, Column) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateProctorStep.php",
        data:{ProctorID:ProctorID, StepID:StepID, Column:Column},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateProctorInstPhone(ProctorID, InstPhone) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateProctorInstPhone.php",
        data:{ProctorID:ProctorID, InstPhone:InstPhone},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateProctorTestDT(ProctorID, TestDate, TestTime) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateProctorTestDT.php",
        data:{ProctorID:ProctorID, TestDate:TestDate, TestTime:TestTime},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateInstForm(ProctorID, TAllotMin, Mailbox, MailboxBldID, Bldg, ProfessorPU, Faculty, FacultyBldID, Office, StuDelivery, ScanEmail, SEOptionID, ExamAttach) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateInstForm.php",
        data:{ProctorID:ProctorID, TAllotMin:TAllotMin, Mailbox:Mailbox, MailboxBldID:MailboxBldID, Bldg:Bldg, ProfessorPU:ProfessorPU, Faculty:Faculty, FacultyBldID:FacultyBldID, Office:Office, 
                StuDelivery:StuDelivery, ScanEmail:ScanEmail, SEOptionID:SEOptionID, ExamAttach:ExamAttach},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateExamGuide(ProctorID, Notes, Book, Calculator, CalTypeID, CalTypeOther, Dictionary, ScratchPaper, Scantron, Computer, InternetID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateExamGuide.php",
        data:{ProctorID:ProctorID, Notes:Notes, Book:Book, Calculator:Calculator, CalTypeID:CalTypeID, CalTypeOther:CalTypeOther, Dictionary:Dictionary, 
                ScratchPaper:ScratchPaper, Scantron:Scantron, Computer:Computer, InternetID:InternetID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateInstFormExamAttach(ProctorID, ExamAttach) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateInstFormExamAttach.php",
        data:{ProctorID:ProctorID, ExamAttach:ExamAttach},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateInstFormExamReceived(ProctorID, ExamReceived) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateInstFormExamReceived.php",
        data:{ProctorID:ProctorID, ExamReceived:ExamReceived},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateAdmin(AdminID, AdminName, AdminEmail) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAdmin.php",
        data:{AdminID:AdminID, AdminName:AdminName, AdminEmail:AdminEmail},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

// delete DB ///////////////////////////////////////////////////////////////////
function db_deleteExamPDF(ExamPDFID) {
    var Result = false;
    $.ajax({  
        url: "php/db_deleteExamPDF.php",  
        type: "POST",  
        data:{ExamPDFID:ExamPDFID},
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

function db_deleteExamPDFAll(ProctorID) {
    var Result = false;
    $.ajax({  
        url: "php/db_deleteExamPDFAll.php",  
        type: "POST",  
        data:{ProctorID:ProctorID},
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

function db_deleteAdmin(AdminID) {
    var Result = false;
    $.ajax({  
        url: "php/db_deleteAdmin.php",  
        type: "POST",  
        data:{AdminID:AdminID},
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

// pdf file verification ///////////////////////////////////////////////////////
function pdfGetTotalPages(file_data) {
    var Result = "";
    $.ajax({  
        url: "php/pdf_getTotalPages.php",  
        type: "POST",  
        data: file_data,
        processData: false,  
        contentType: false,  
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

// upload attach file //////////////////////////////////////////////////////////
//function uploadAttachFile(file_data) {
//    var Result = "";
//    $.ajax({  
//        url: "php/upload_attach_file.php",  
//        type: "POST",  
//        data: file_data,
//        processData: false,  
//        contentType: false,  
//        async: false,
//        success:function(data) {
//            Result = JSON.parse(data);
//        }  
//    });
//    return Result;
//}

//function deleteAttachFile(FileLinkName) {
//    var Result = "";
//    $.ajax({  
//        url: "php/delete_attach_file.php",  
//        type: "POST",  
//        data:{FileLinkName:FileLinkName},
//        async: false,
//        success:function(data) {
//            Result = JSON.parse(data);
//        }  
//    });
//    return Result;
//}