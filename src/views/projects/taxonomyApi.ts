import { config } from '../../common/environment';
import { get, post, put, deleteItem } from '../../common/api-middleware/commonData.api';
import { projectStatus, taxonomy, taxonomyMin } from './taxonomyModels';

const baseUrl = `${config.Resource_Url}`;
export const getTaxonomyData = async () => {
  const queryUrl = 'taxonomy/taxonomy';
  const result = await get(baseUrl, queryUrl);
  return <taxonomy[]>result.data;
};

export const saveProjectCred = async (model: any) => {
  return await post(config.Resource_Url, 'ProjectCred', model);
};
export const getProCredByProjId = async (projId: any) => {
  return await get(config.Resource_Url, `ProjectCred/${projId}`);
};
export const updataProjectCred = async (projId: any, model: any) => {
  return await put(config.Resource_Url, `ProjectCred?projectid=${projId}`, model);
};

export const getTaxonomyDataByCategories = async (categories) => {
  const result = await FetchTaxinomy(categories);
  return <taxonomyMin[]>result.data.data;
};

async function FetchTaxinomy(categories: any) {
  const queryUrl = 'taxonomy/GetTaxonomyByCategory';
  const result = await post(baseUrl, queryUrl, categories);
  return result;
}

export const getProjectStatus = async (projectTypeId: number) => {
  const result = await get(config.Resource_Url, `Project/GetProjectStatus/` + projectTypeId);
  return <projectStatus[]>result.data;
}

export const saveCfibProject = async (model: any) => {
  return await post(config.Resource_Url, 'cfib/project', model);
};

export const getCtmProjectDetails = async (projId: any) => {
  return await get(config.Resource_Url, `ctm/project/GetProjectCtmDetails/${projId}`);
};
export const getCfibProByAll = async (model: any) => {
  return await post(config.Resource_Url, 'cfib/project/checkproject', model);
};
export const getCfibProBySearch = async (model: any) => {
  return await post(config.Resource_Url, 'cfib/project/ProjectSearchFilter', model);
};

export const getReportDuplicate = async (projId: any, disputeNo: any) => {
  return await get(config.Resource_Url, `ctm/project/GetReportDuplicate/${projId}/${disputeNo}`);
};