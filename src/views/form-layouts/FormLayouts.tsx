import React from 'react';
import { Grid } from '@mui/material';

import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Form Layouts',
  },
];

const FormLayouts = () => (
  <PageContainer title="Form Layouts" description="this is innerpage">
    {/* breadcrumb */}
    <Breadcrumb title="Form Layouts" items={BCrumb} />
    {/* end breadcrumb */}
    <Grid container spacing={0}>
      <Grid item lg={12} md={12} xs={12}>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
      </Grid>
    </Grid>
  </PageContainer>
);

export default FormLayouts;
