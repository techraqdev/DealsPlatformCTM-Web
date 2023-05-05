import { get } from '../../common/api-middleware/commonData.api';
import { config } from '../../common/environment';
import { dashboardItemType } from './dashboardModel';

const baseUrl = `${config.Resource_Url}`;
export const getDashboardData = async () => {
  const queryUrl = 'dashboard';
  const result = await get(baseUrl, queryUrl);
  return <dashboardItemType[]>result.data;
};
