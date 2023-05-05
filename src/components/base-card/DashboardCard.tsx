import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardHeader, CardContent } from '@mui/material';
import { IDashboardCard } from '../../models/LayoutModels';



const DashboardCard = (props: IDashboardCard) => (
  <Card
    sx={{
      p: props && props.custompadding,
      '& .MuiCardContent-root:last-child': {
        pb: props && props.custompadding,
      },
    }}
  >
    <CardHeader
      sx={{
        p: props && props.customheaderpadding,
        display: {
          xs: props && props.customdisplay,
          lg: 'flex',
          sm: 'flex',
        },
      }}
      title={
        <Typography
          variant="h3"
          sx={{
            mb: {
              xs: props && props.custommargin,
            },
          }}
        >
          {props && props.title}
        </Typography>
      }
      subtitle={props && props.subtitle}
      action={(props && props.action) || ''}
    />
    {/* content area */}
    <CardContent
      sx={{
        p: props && props.custompadding,
      }}
    >
      {props && props.children}
    </CardContent>
  </Card>
);
export default DashboardCard;
