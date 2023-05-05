import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { IWidgetCard } from '../../models/LayoutModels';

const WidgetCard = (props: IWidgetCard) => (
  <Box>
    <Typography
      variant="h4"
      sx={{
        mb: 2,
      }}
    >
      {props&&props.title}
    </Typography>
  </Box>
);

// WidgetCard.propTypes = {
//   title: PropTypes.string.isRequired,
// };

export default WidgetCard;
