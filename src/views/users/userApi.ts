import {
  get,
  post,
  put,
  deleteItem,
  postUploadModel,
  downloadFilePost,
} from '../../common/api-middleware/commonData.api';
import { pwc_menu } from '../../common/constants/common.constant';
import { config } from '../../common/environment';
import { clearStorage, setStorage } from '../../common/helpers/storage.helper';
import moment from 'moment';

export const User_API = config.Resource_Url + `user`;

const baseURL = config.Resource_Url; //BASE_Catlog;

export const getUserByIdApi = async (userId: string) => {
  const queryUrl = `User/${userId}`;
  return await get(baseURL, queryUrl);
};

export const saveUser = async (model: any, userid: string) => {
  let queryUrl = 'User';
  if (userid) {
    queryUrl = `User/${userid}`;
    return await put(baseURL, queryUrl, model);
  } else {
    return await post(baseURL, queryUrl, model);
  }
};

export const deleteUserItem = async (userid: string) => {
  const queryUrl = `User/${userid}`;
  return await deleteItem(baseURL, queryUrl);
};

export const activateUserItem = async (model: any) => {
  const queryUrl = `User/activate`;
  return await post(baseURL, queryUrl, model);
};

export const fileUpload = async (data: any) => {
  const queryUrl = `User/BulkUpload`;
  return await postUploadModel(baseURL, queryUrl, data);
};

export const getMenus= async () => {
  const baseUrl = `${config.Resource_Url}`;
  const queryUrl = 'identity/menus';
  return await get(baseUrl, queryUrl);

};

export const exportAuditLogsExcel = async (request: any) => {
  const reourceUrl = `${config.Resource_Url}`;
  const queryUrl = `User/downloaduserdetails`;
  await downloadFilePost(reourceUrl, queryUrl, request, 'User_Details_' + moment(new Date()).format('DDMMYY HH:mm') +'.xlsx');
};


