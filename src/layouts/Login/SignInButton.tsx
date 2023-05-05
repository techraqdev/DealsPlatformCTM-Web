import React from 'react';
//import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
//import { loginRequest } from '../../authConfig';
/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
  //const { instance } = useMsal();

  const handleLogin = (loginType: any) => {
    //if (loginType === 'popup') {
    //  instance.loginPopup(loginRequest).catch((e) => {
    //    console.log(e);
    //  });
    //} else if (loginType === 'redirect') {
    //  instance.loginRedirect(loginRequest).catch((e) => {
    //    console.log(e);
    //  });
    //}
  };
  return (
    <Button
      color="secondary"
      variant="contained"
      size="large"
      fullWidth
      onClick={() => handleLogin('popup')}
      sx={{
        pt: '10px',
        pb: '10px',
      }}
      className="buttons-bg"
    >
      Sign In
    </Button>
  );
};
