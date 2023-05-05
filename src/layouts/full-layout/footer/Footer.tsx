import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box sx={{ p: 3, textAlign: 'left' }}>
    <Typography className="fontsize12">
      © 2022 PricewaterhouseCoopers Private Limited (a limited liability company in India). All
      rights reserved. &apos;PwC&apos; refers to the India member firm and may sometimes refer to
      the PwC network. Each member firm is a separate legal entity. Please see{' '}
      <a href="https://www.pwc.com/structure" target="_blank" rel="noreferrer">
        www.pwc.com/structure
      </a>{' '}
      for further details. 
      {/* <br/>
      In case of any queries or clarifications, please refer to {' '}
      <a href="https://docs.google.com/forms/d/16wxsjIqwQXN_nAv9lAbg3py64xbfAiQEhbMGmjTdzwk/edit" target="_blank" rel="noreferrer">
      Help/FAQ
      </a>. */}
    </Typography>
  </Box>
);

export default Footer;
