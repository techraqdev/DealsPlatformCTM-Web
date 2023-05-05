import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { projectSearchToken, userSearchToken } from '../common/constants/common.constant';
import Loadable from '../layouts/full-layout/loadable/Loadable';
import ProfileData from '../layouts/Login/ProfileData';
import CtmDownload from '../views/ctm/download/download';
import CtmProjectView from '../views/ctm/projects/ctmDetailView';
import CtmProjectList from '../views/ctm/projects/CtmProjectList';
import CtmViewProject from '../views/ctm/projects/ctmView';
import CtmProjectUpload from '../views/ctm/projects/projectDetailsUpoad';
import EditCtmProjectUpload from '../views/ctm/projects/editProjectDetailsUpoad';
import ReportAnIssuesUpoad from '../views/ctm/projects/reportAnIssuesUpoad';
import Dashboard from '../views/dashboards/Dashboard';
import AddProject from '../views/projects/AddProject';
import DbDownload from '../views/projects/DbDownload';
import InputForm from '../views/projects/InputForm';
import InputFormV1 from '../views/projects/InputForm-v1';
import ProjectContainer from '../views/projects/ProjectContainer';
import ViewProject from '../views/projects/ViewProject';
import AddUser from '../views/users/addUser/addUser';
import UserList from '../views/users/UserList';
import AuditTrail from '../views/projects/AuditTrail';

import CfibProjectList from '../views/ctm/cfib/CfibProjectList';
import CfibAddProject from '../views/ctm/cfib//AddProject';
import CfibEditProject from '../views/ctm/cfib//EditProject';
import ViewCtmProjectUpload from '../views/ctm/download/viewProjectDetailsUpoad';
import ReportAnIssues from '../views/ctm/projects/reportAnIssues';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */

const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/ResetPassword')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/db/projects/downloads" /> },
      { path: '/profile', element: <ProfileData /> },
      {
        path: '/db/projects',
        exact: true,
        element: <ProjectContainer />,
        storageDependent: projectSearchToken,
      },
      {
        path: '/db/projects/audit',
        exact: true,
        element: <AuditTrail />,
        storageDependent: projectSearchToken,
      },
      {
        path: '/db/projects/:projId/form',
        exact: true,
        element: <InputFormV1 />,
        storageDependent: projectSearchToken,
      },
      { path: '/db/projects/downloads', exact: true, element: <DbDownload /> },
      { path: '/db/dashboard', exact: true, element: <Dashboard /> },
      {
        path: '/admin/users',
        exact: true,
        element: <UserList />,
        storageDependent: userSearchToken,
      },
      {
        path: '/admin/addUser',
        exact: true,
        element: <AddUser />,
        storageDependent: userSearchToken,
      },
      {
        path: '/admin/editUser/:userId',
        exact: true,
        element: <AddUser />,
        storageDependent: userSearchToken,
      },
      {
        path: '/db/project/add',
        exact: true,
        element: <AddProject />,
        storageDependent: projectSearchToken,
      },
      {
        path: '/db/project/edit/:projId',
        exact: true,
        element: <AddProject />,
        storageDependent: projectSearchToken,
      },
      {
        path: '/db/project/view/:projId',
        exact: true,
        element: <ViewProject />,
        storageDependent: projectSearchToken,
      },
      {
        path: '/ctm/project/view/:projId',
        exact: true,
        element: <CtmViewProject />,
        storageDependent: projectSearchToken,
      },
      { path: '/ctm/projects', exact: true, element: <CtmProjectList /> },
      { path: '/ctm/project/upload/:projId/:isfrom', exact: true, element: <CtmProjectUpload /> },
      { path: '/ctm/project/upload/:projId', exact: true, element: <CtmProjectUpload /> },
      { path: '/ctm/project/view/:projId', exact: true, element: <CtmProjectView /> },
      { path: '/ctm/projects/downloads', exact: true, element: <CtmDownload /> },
      { path: '/ctm/project/edit/:projId/:isfrom', exact: true, element: <EditCtmProjectUpload /> },
      {
        path: '/ctm/project/report/:projId/:disputeNo',
        exact: true,
        element: <ReportAnIssuesUpoad />,
      },
      {
        path: '/ctm/projects/downloads/view/:projId',
        exact: true,
        element: <ViewCtmProjectUpload />,
      },
      { path: '/ctm/project/reportanissues', exact: true, element: <ReportAnIssues /> },
      {
        path: '/ctm/project/upload/:projId/:isfrom/:isUpdate',
        exact: true,
        element: <CtmProjectUpload />,
      },
      { path: '/cfib/projects', exact: true, element: <CfibProjectList /> },
      {
        path: '/cfib/project/add',
        exact: true,
        element: <CfibAddProject />,
        storageDependent: projectSearchToken,
      },
      { path: '/cfib/project/view/:projId', exact: true, element: <CfibEditProject /> },
      { path: '/cfib/project/edit/:projId', exact: true, element: <CfibEditProject /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: 'auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'login', element: <Login /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
