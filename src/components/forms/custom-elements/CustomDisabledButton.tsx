import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const CustomDisabledButton = styled((props) => <Button {...props} />)(({ theme }) => ({
  backgroundColor: `${theme.palette.mode === 'dark' ? 'rgba(73,82,88,0.12)' : '#ecf0f3'}`,
}));


export const CustomPrimaryButton = styled((props) => <Button {...props} />)(({ theme }) => ({
  color: `${theme.palette.mode === 'dark' ? '#fff' : '#fff'}`,
  backgroundColor: `${theme.palette.mode === 'dark' ? '#d85604' : '#d85604'}!important`,
  '&:hover': {
    color: `${
      theme.palette.mode === 'dark'
        ? '#fff'
        : '#fff'
    }`,
    backgroundColor: `${theme.palette.mode === 'dark' ? '#d85604' : '#d85604'}!important`,
  },
}));

export const CustomDefaultButton = styled((props) => <Button {...props} />)(({ theme }) => ({
  color: `${theme.palette.mode === 'dark' ? '#fff' : 'black'}`,
  backgroundColor: `${theme.palette.mode === 'dark' ? '#e1e5ec' : '#e1e5ec'}!important`,
  '&:hover': {
    color: `${
      theme.palette.mode === 'dark'
        ? 'black'
        : 'black'
    }`,
    backgroundColor: `${theme.palette.mode === 'dark' ? '#e1e5ec' : '#e1e5ec'}!important`,
  },
}));

export default CustomDisabledButton;
