import React, { useState } from 'react';
import { experimentalStyled, useMediaQuery, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import Footer from './footer/Footer';
import Customizer from './customizer/Customizer';
import { TopbarHeight } from '../../assets/global/Theme-variable';
import Spinner from '../../views/spinner/Spinner';

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

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const customizer = useSelector((state: any) => state.CustomizerReducer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  return (
    <MainWrapper className={customizer.activeMode === 'dark' ? 'darkbg' : ''}>
      <Header
        sx={{
          paddingLeft: isSidebarOpen && lgUp ? '265px' : '',
          backgroundColor: customizer.activeMode === 'dark' ? '#20232a' : '#fff !important',
        }}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        toggleMobileSidebar={() => setMobileSidebarOpen(true)}
      />
      <Sidebar
        isSidebardir={customizer.activeDir === 'ltr' ? 'left' : 'right'}
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper>
        <Container
          maxWidth={false}
          sx={{
            paddingTop: '0px',
            paddingLeft: isSidebarOpen && lgUp ? '212px!important' : '0px !important',
            paddingRight: isSidebarOpen && lgUp ? '0px!important' : '0px !important',
          }}
        >
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
          <Spinner></Spinner>
            <Outlet />
          </Box>
          <Customizer />
          <Footer />
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
