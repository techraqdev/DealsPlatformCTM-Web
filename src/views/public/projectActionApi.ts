import { config } from '../../common/environment';
import {
  post,
} from '../../common/api-middleware/commonData.api';

const reourceUrl = config.Resource_Url;

export const processProjectActionApi = async (id: any) => {
  return await post(reourceUrl, 'projectAction', id);
};

export type IProjectActionResponse = {
    status: boolean;
    message: string;
    isInitial:boolean;
  };