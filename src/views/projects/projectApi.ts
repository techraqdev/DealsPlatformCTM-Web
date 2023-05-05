import { config } from '../../common/environment';
import {
  get,
  post,
  put,
  deleteItem,
  postUploadModel,
  downloadFilePost,
} from '../../common/api-middleware/commonData.api';
import moment from 'moment';

export const getAllProject = config.Resource_Url + `Project/allprojects`;
export const getAllAditLogs = config.Resource_Url + `Project/allauditprojectsdata`;
export const getCTMAllProject = config.Resource_Url + `ctm/Project/allprojects`;
export const getCfibAllProject = config.Resource_Url + `cfib/Project/allprojects`;

const reourceUrl = config.Resource_Url;

export const saveProject = async (model: any) => {
  return await post(reourceUrl, 'project', model);
};

export const getProByProjId = async (projId: any) => {
  return await get(reourceUrl, `Project/${projId}`);
};

export const updataProject = async (projId: any, model: any) => {
  return await put(reourceUrl, `Project?projectid=${projId}`, model);
};

export const deleteProject = async (projId: any) => {
  return await deleteItem(reourceUrl, `Project/${projId}`);
};
export const deleteCfibProject = async (projId: any) => {
  return await deleteItem(reourceUrl, `Cfib/Project/${projId}`);
};

export const projectBulkUpload = async (data: any) => {
  const queryUrl = `Project/bulkupload`;
  return await postUploadModel(reourceUrl, queryUrl, data);
};

export const projectBulkUpload1 = async (data: any) => {
  const queryUrl = `Project/bulkupload1`;
  return await downloadFilePost(reourceUrl, queryUrl, data, 'Project Data_Errors.xlsx');
};

export const projectClientBulkUpload = async (data: any) => {
  const queryUrl = `Project/clientbulkupload`;
  return await postUploadModel(reourceUrl, queryUrl, data);
};

export const projectsBulkUploadEngagements = async (data: any) => {
  const queryUrl = `Project/engagementsbulkupload`;
  return await postUploadModel(reourceUrl, queryUrl, data);
};

export const projectsBulkUploadEngagementsError = async (data: any) => {
  const queryUrl = `Project/engagementsbulkuploadvalidation`;
  return await downloadFilePost(reourceUrl, queryUrl, data, 'Project Data_Errors.xlsx');
};

export const exportAuditLogsExcel = async (request: any) => {
  const queryUrl = 'Project/auditlogsexportexcel';
  await downloadFilePost(reourceUrl, queryUrl, request, 'Audit Logs_' + moment(new Date()).format('DDMMYY HH:mm') +'.xlsx');
};

export const projectWfSubmit = async (data: any) => {
  const queryUrl = 'Project/SubmitWF';
  return await post(reourceUrl, queryUrl, data);
};

export const exportDbCredsExcel = async (request: any) => {
  const queryUrl = 'ProjectCred/ExportExcel';
  downloadFilePost(reourceUrl, queryUrl, request, 'Project_Credentials.xlsx');
};

export const exportDbCredsPpt = async (request: any) => {
  const queryUrl = 'ProjectCred/ExportPPT';
  downloadFilePost(reourceUrl, queryUrl, request, 'Project_Credentials.pptx');
};

export const exportDbProjectsCredsExcel = async (request: any) => {
  const queryUrl = 'ProjectCred/projectsexportexcel';
  await downloadFilePost(reourceUrl, queryUrl, request, 'Project Data_' + moment(new Date()).format('DDMMYY HH:mm') +'.xlsx');
};

export const getProjectWfNextActionsByProjectAPI = async (projectId: any) => {
  const queryUrl = `Project/GetProjectWfNextActions/${projectId}`;
  return await get(reourceUrl, queryUrl);
};

export const projectDetailsUpload = async (data: any) => {
  const queryUrl = `ctm/project/processProductDetails`;
  return await postUploadModel(reourceUrl, queryUrl, data);
};

export const projectCtmDetails = async (data: any) => {
  const queryUrl = `ctm/project/UploadProjectDetails`;
  return await post(reourceUrl, queryUrl, data);
};

export const getProjectCtmDetails = async (projectId: any) => {
  const queryUrl = `ctm/ProjectCred/GetProjectCtmDetais/${projectId}`;
  return await get(reourceUrl, queryUrl);
};

export const exportDbCtmExcel = async (request: any) => {
  const queryUrl = 'Ctm/ProjectCred/downloadExcel';
  return downloadFilePost(reourceUrl, queryUrl, request, 'CTM_ProjectDetails.xlsx');
};

export const projectSupportingFileUpload = async (projId: any, data: any, isFrom:any) => {
  const queryUrl = `Ctm/Project/` + projId + `/`+isFrom+`/uploadSupportingFile`;
  return await postUploadModel(reourceUrl, queryUrl, data);
};

export const exportDbCtmZip = async (request: any) => {
  const queryUrl = 'Ctm/ProjectCred/downloadExcel';  
  return downloadFilePost(reourceUrl, queryUrl, request, 'CTM_ProjectDetails.zip');
};

export const getProjectCtmWfNextActionsByProjectAPI = async (projectId: any) => {
  const queryUrl = `Ctm/Project/GetProjectWfNextActions/${projectId}`;
  return await get(reourceUrl, queryUrl);
};

export const projectCtmWfSubmit = async (data: any) => {
  const queryUrl = 'ctm/Project/SubmitWF';
  return await post(reourceUrl, queryUrl, data);
};
export const projectCfibWfSubmit = async (data: any) => {
  const queryUrl = 'cfib/Project/SubmitWF';
  return await post(reourceUrl, queryUrl, data);
};
export const getProjectCfibWfNextActionsByProjectAPI = async (projectId: any) => {
  const queryUrl = `Cfib/Project/GetProjectWfNextActions/${projectId}`;
  return await get(reourceUrl, queryUrl);
};
export const getCfibProByProjId = async (projId: any) => {
  return await get(reourceUrl, `Cfib/Project/${projId}`);
};
export const projecReportIssue = async (data: any) => {
  const queryUrl = 'Ctm/ProjectCred/UpdateDuplicate';
  return await post(reourceUrl, queryUrl, data);
};
export const getReportIssueList = async (data) => {
  return await get(reourceUrl, `Ctm/ProjectCred/GetProjectReportIssue/${data}`);
};
export const deleteCtmProj = async (ctmProjId: any) => {
  const queryUrl = `ctm/ProjectCred/DeleteCtmProj/${ctmProjId}`;
  return await get(reourceUrl, queryUrl);
};
export const updateReportStatus = async (data: any) => {
  const queryUrl = 'Ctm/ProjectCred/UpdateMarkAsResolveOrNotAnIssue';
  return await post(reourceUrl, queryUrl, data);
};
export const projectReportAnIssueDetails = async (data: any) => {
  const queryUrl = `ctm/projectcred/UpdateReportAnIssueDetails`;
  return await post(reourceUrl, queryUrl, data);
};

export const projectCtmValidateDetails = async (data: any) => {
  const queryUrl = `ctm/project/ValidateRecord`;
  return await post(reourceUrl, queryUrl, data);
};

export const getctmsupportingfileApi = async (projectId: any) => {
  const queryUrl = `Ctm/Project/getctmsupportingfile/${projectId}`;
  return await get(reourceUrl, queryUrl);
};

export const downloadctmsupportingfileApi = async (projectId: any) => {
  const queryUrl = `Ctm/Project/downloadctmsupportingfile/${projectId}`;
  downloadFilePost(reourceUrl, queryUrl, null, 'ProjectSupportingDeatils.zip');
};

export const deleteDispute = async (ctmProjId: any, disputeNo:any) => {
  const queryUrl = `ctm/ProjectCred/DeleteDispute/${ctmProjId}/${disputeNo}`;
  return await get(reourceUrl, queryUrl);
};
