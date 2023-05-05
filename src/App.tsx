import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import RTL from './layouts/full-layout/customizer/RTL';
import ThemeSettings from './layouts/full-layout/customizer/ThemeSettings';
import Router from './routes/Router';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './index.css';
import Login from './views/authentication/Login';
import './layouts/full-layout/Menu.css';
import { ToastContainer } from 'react-toastify';
import { getStorage } from './common/helpers/storage.helper';
import Spinner from './views/spinner/Spinner';
import { pwc_isAuthorise } from './common/constants/common.constant';
import ErrorBoundary from './common/ErrorBoundary';
import ARouter from './routes/AnonymousRoues';
const App = () => {
  const routing: any = useRoutes(Router);
  const aRouting: any = useRoutes(ARouter);

  const theme = ThemeSettings();
  const customizer = useSelector((state: any) => state.CustomizerReducer);
 

  const isAuthorise = getStorage(pwc_isAuthorise);
  return (
    // <ErrorBoundary>
    //   {!isAuthorise ? (
    //     <>{aRouting}</>
    //   ) : (
    //     <>
    //       <ThemeProvider theme={theme}>
    //         <RTL direction={customizer.activeDir}>
    //           <CssBaseline />
    //           {routing}
    //         </RTL>
    //       </ThemeProvider>
    //     </>
    //   )}
    //   <ToastContainer />
    // </ErrorBoundary>

    <ErrorBoundary>
      {!isAuthorise ? (
        <>{aRouting}</>
      ) : (
        <>
          <ThemeProvider theme={theme}>
            <RTL direction={customizer.activeDir}>
              <CssBaseline />
              {routing}
            </RTL>
          </ThemeProvider>
        </>
      )}
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
