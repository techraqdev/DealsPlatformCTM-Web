import React, { lazy } from 'react';

import { Navigate } from 'react-router-dom';
import { config } from '../common/environment';
import Loadable from '../layouts/full-layout/loadable/Loadable';

/* ***Layouts**** */
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */

const Error = Loadable(lazy(() => import('../views/authentication/Error')));

// const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Login = config.IsPwcEnvironment ? Loadable(lazy(() => import('../views/authentication/Login'))) : Loadable(lazy(() => import('../views/authentication/LoginJWT')));

const ResetPassword = Loadable(lazy(() => import('../views/authentication/ResetPassword')));
const ProjectAction = Loadable(lazy(() => import('../views/public/ProjectAction')));

const ARouter = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '', element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: '404', element: <Error /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'projectProcess/:id', element: <ProjectAction /> },
      { path: '*', element: <Login /> },
    ],
  },
];

export default ARouter;
