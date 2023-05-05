import { Grid, Button, AppBar, Toolbar } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Spinner from '../spinner/Spinner';
import { useParams } from 'react-router';
import { IProjectActionResponse, processProjectActionApi } from './projectActionApi';
import { experimentalStyled, useMediaQuery, Container, Box } from '@mui/material';
import Header from '../../layouts/full-layout/header/Header';
import { TopbarHeight } from '../../assets/global/Theme-variable';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';
import { truncate } from 'fs';

const ProjectAction: FC = () => {
  const [disableLoader, setDisableLoader] = React.useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectStatusData, setProjectStatusData] = React.useState({
    isInitial: true,
    message: '',
    status: 'no',
  });
  useEffect(() => {
    const processProjectAction = async () => {
      const projData = await processProjectActionApi(id);
      if (projData && projData.data && projData.data.status == 200) {
        const letPay = {
          isInitial: false,
          message: projData.data.data.message,
          status: projData.data.data.status ? 'yes' : 'no',
        };
        setProjectStatusData(letPay);
      } else {
        const letPay = {
          isInitial: false,
          message: 'Error Occured',
          status: 'no',
        };
        setProjectStatusData(letPay);
      }
    };

    if (id) {
      processProjectAction();
    }
  }, [id]);

  const MainWrapper = experimentalStyled('div')(() => ({
    display: 'flex',
    minHeight: '100vh',
    overflow: 'hidden',
    width: '100%',
    fontFamily: 'HelveticaNeueLTPro-Roman',
  }));

  const PageWrapper = experimentalStyled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',

    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('lg')]: {
      paddingTop: TopbarHeight,
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: '64px',
    },
  }));

  return (
    <MainWrapper>
      <AppBar>
        <Toolbar>
          <LogoIcon logoWidth={150}></LogoIcon>
        </Toolbar>
      </AppBar>
      <PageWrapper>
        <Container maxWidth="sm" className="projectstatusdata">
          <div id="content">
            <div
              className="overlay project-action"
              style={{ display: projectStatusData.isInitial ? 'flex' : 'none !important' }}
            >
              <div className="fallback-spinner">
                <div className="loading component-loader">
                  <div className="effect-1 effects" />
                  <div className="effect-2 effects" />
                  <div className="effect-3 effects" />
                </div>
                <span className="loading-text">Processing.... Please wait...</span>
              </div>
            </div>

            {(() => {
              if (projectStatusData.status == 'yes' && !projectStatusData.isInitial) {
                return (
                  <div className="notify successbox">
                    <h1>Success!</h1>
                    <span className="alerticon">
                      <i className="fa fa-check"></i>
                    </span>
                    <p>{projectStatusData.message}</p>
                  </div>
                );
              }
              return null;
            })()}

            {(() => {
              if (projectStatusData.status == 'no' && !projectStatusData.isInitial) {
                return (
                  <div className="notify errorbox">
                    <h1>Error!</h1>
                    <span className="alerticon">
                      <i className="fa fa-times"></i>
                    </span>
                    <p>{projectStatusData.message}</p>
                  </div>
                );
              }

              return null;
            })()}
          </div>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default ProjectAction;
