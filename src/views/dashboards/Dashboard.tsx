import React, { useState, useEffect, FC } from 'react';
import { Container, Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import { dashboardItemType } from './dashboardModel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getDashboardData } from './dashboardApi';
import { useNavigate } from 'react-router-dom';
import { projectSearchToken } from '../../common/constants/common.constant';
import { projectSearch } from '../projects/taxonomyModels';
import { setStorage } from '../../common/helpers/storage.helper';
import createdIcon from '../../assets/images/icons/created.png';
import checkIcon from '../../assets/images/icons/check.png';
import quotableIcon from '../../assets/images/icons/quotable.png';
import banIcon from '../../assets/images/icons/ban.png';
import aprovalpendingIcon from '../../assets/images/icons/aprovalpending.png';
import rejectedIcon from '../../assets/images/icons/rejected.png';
import infoIcon from '../../assets/images/icons/info.png';
import aprovedIcon from '../../assets/images/icons/aproved.png';
import publishedIcon from '../../assets/images/icons/published.png';
import otherIcon from '../../assets/images/icons/other.png';
import pendingIcon from '../../assets/images/icons/pending.png';

const Dashboard: FC = () => {
  const [dashboardData, setDashboardData] = useState<dashboardItemType[]>([]);
  const [dashboardRemainingStatus, setDashboardRemainingStatus] = useState<statusInterface[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getDashboardResult();
  }, []);

  interface statusInterface {
    statusName: string;
    color: string;
    dashboardIcon: string;
  }

  const statusList: statusInterface[] = [
    { statusName: 'created', color: 'orange !important', dashboardIcon: createdIcon },
    {
      statusName: 'not responded',
      color: '#dc3545!important',
      dashboardIcon: checkIcon,
    },
    { statusName: 'quotable', color: '#ff8c00!important', dashboardIcon: quotableIcon },
    { statusName: 'restricted', color: 'brown!important', dashboardIcon: banIcon },
    {
      statusName: 'partner approval pending',
      color: '#007bff!important',
      dashboardIcon: aprovalpendingIcon,
    },
    {
      statusName: 'rejected by partner',
      color: '#7D1935!important',
      dashboardIcon: rejectedIcon,
    },
    {
      statusName: 'client approval pending',
      color: '#2f8e68!important',
      dashboardIcon: aprovalpendingIcon,
    },
    {
      statusName: 'rejected by client',
      color: '#6c757d!important',
      dashboardIcon: rejectedIcon,
    },
    {
      statusName: 'client seeking more info',
      color: '#90ee90!important',
      dashboardIcon: infoIcon,
    },
    { statusName: 'approved', color: '#28a745!important', dashboardIcon: aprovedIcon },
    { statusName: 'pending response', color: '#28a745!important', dashboardIcon: pendingIcon },
    { statusName: 'restriction confirmed', color: '#28a745!important', dashboardIcon: otherIcon },
    { statusName: 'Can be published as a credential', color: '#28a745!important', dashboardIcon: publishedIcon }
  ];

  const getDashboardResult = async () => {
    const result = await getDashboardData();
    if (result != null) {
      result.sort((a, b) => a.dashboardOrder - b.dashboardOrder);
      result.forEach(function (value) {
        const details = statusList.filter(x => x.statusName.toLocaleLowerCase() == value.projectStatus.toLocaleLowerCase());
        if (details != null && details.length > 0) {
          value.dashboardIcon = details[0].dashboardIcon;
        }
        else{
          value.dashboardIcon = otherIcon;
        }
      });

    }
    setDashboardData(result);
  };

  const gotoProjects = (statusId: any) => {
    const searchFilterLocal: projectSearch = {
      sbu: [],
      projectStatusList: [statusId],
      projectName: '',
      clientName: '',
      projectCode: '',
      isNavigationFromOtherPage: true,
    };
    setStorage(projectSearchToken, searchFilterLocal);
    navigate('/db/projects');
  };

  const BCrumb = [
    {
      to: '/db/dashboard',
      title: 'Open Tasks',
    },
    {
      title: 'Dashboard',
    },
  ];

  return (
    <PageContainer title="Project Dashboard" description="Project Dashboard">
      <Breadcrumb title="Dashboard" items={BCrumb} />
      <div>
        <Grid container>
          {dashboardData.map((d) => (
            <Grid key={d.projectStatusId} item xs={4} sx={{ padding: 0 }}>
              <Card
                key={d.projectStatusId}
                sx={{ padding: 0, borderRadius: 0, marginTop: 0 }}
                className="dashboard-card"
                onClick={() => gotoProjects(d.projectStatusId)}
              >
                <div className="box-dashboard">
                  <Typography
                    className="box-dashboard-icon dashboard-icon"
                    sx={{ backgroundColor: 'white !important' }}
                  >
                    <img src={d.dashboardIcon} style={{
                      height: '60px'
                    }}></img>
                  </Typography>
                  <div className="box-dashboard-content dashboard-content-body">
                    <span className="box-dashboard-text">{d.projectStatus}</span>
                    <span className="box-dashboard-number">
                      {' '}
                      {d.count}
                      <a className="anchor-more" href="#">
                        <i className="more-icon fa fa-plus"></i>
                      </a>
                    </span>
                  </div>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </PageContainer>
  );
};
export default Dashboard;
