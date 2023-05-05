import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';
import { IBaseCard } from '../../models/LayoutModels';


const BaseCard = (props: IBaseCard) => (
  <Card
    sx={{
      width: '100%',
      p: 0,
    }}
  >
    <CardHeader title={props && props.title} />

    <Divider />
    <CardContent>{props && props.children}</CardContent>
  </Card>
);
export default BaseCard;
