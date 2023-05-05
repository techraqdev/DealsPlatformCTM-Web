import { Grid, Button, Container } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import * as React from 'react';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';
import { config } from '../../common/environment';
import { get } from '../../common/api-middleware/commonData.api';
import { clearStorage, setStorage } from '../../common/helpers/storage.helper';
import {
  pwc_token,
  pwc_isAuthorise,
  pwc_menu,
  pwc_username,
  pwc_isAdmin,
} from '../../common/constants/common.constant';
import { useNavigate } from 'react-router';
import Spinner from '../spinner/Spinner';
import { useAuth, UserManager } from 'oidc-react';
import { toastMessage } from '../../common/toastMessage';
import { MessageType } from '../../common/enumContainer';

const Login: React.FC = () => {
  const [disableLoader, setDisableLoader] = React.useState(false);

  const authInfo = useAuth();

  const navigate = useNavigate();
  const RefreshPage = () => {
    setTimeout(() => window.location.reload(), 5000);
  };

  const getMenu = async () => {
    const baseUrl = `${config.Resource_Url}`;
    const queryUrl = 'identity/menus';
    const result: any = await get(baseUrl, queryUrl);
    if (result && result.data) {
      clearStorage(pwc_menu);
      setStorage(pwc_menu, result.data);
    } else {
      setStorage(pwc_menu, '');
    }
    window.location.reload();
  };

  const authenticate = async () => {
    const baseUrl = `${config.Resource_Url}`;
    const queryUrl = 'identity/me';
    try {
      setDisableLoader(false);

      const result: any = await get(baseUrl, queryUrl);

      clearStorage(pwc_menu);
      setDisableLoader(true);
      setStorage(pwc_isAuthorise, false);
      setStorage(pwc_isAdmin, false);

      if (result && result.data && result.data.isAutheticated) {
        
        setStorage(pwc_isAuthorise, true);
        setStorage(pwc_isAdmin, result.data.isAdmin);

        getMenu();
      } else {
        if (!result && result.data && result.data.isAutheticated) {
          navigate('/auth');
        }
        setStorage(pwc_isAuthorise, false);
      }
    } catch (error) {
      // toastMessage(MessageType.Error, internal_error);
      // setDisableLoader(true);
    }
    setDisableLoader(true);
    RefreshPage();
    // window.location.reload();
  };

  const handleResponse = async (response: any) => {
    if (response !== null) {
      localStorage.removeItem(pwc_token);
      localStorage.setItem(pwc_token, response.id_token);
      setStorage(pwc_username, response.profile?.name);
      //here we will get menu
      authenticate();
    }
  };

  const handleLogin = (loginType: any) => {
    if (loginType === 'popup') {
      const config1 = new UserManager(authInfo.userManager.settings);

      config1
        .signinPopup()
        .then((response) => {
          handleResponse(response);
        })
        .catch((e) => {
          toastMessage(MessageType.Error, 'Unable to login');
          console.log(e);
        });
    } else if (loginType === 'redirect') {
      const config1 = new UserManager(authInfo.userManager.settings);
      config1
        .signinPopup()
        .then((response) => {
          handleResponse(response);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <Container>
      <PageContainer title="Login" description="this is Login page">
        <Grid style={{ padding: '22px', textAlign: 'center' }}>
          <LogoIcon logoWidth={250} />
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={1} sm={2} md={4}></Grid>
          {!disableLoader ? (
            <Grid
              item
              xs={10}
              sm={8}
              md={4}
              style={{
                marginTop: '6%',
                boxShadow: '0 0 15px #dfe6f5',
                borderRadius: '10px',
                paddingLeft: '0px',
                paddingRight: '0px',
              }}
            >
              <h1
                style={{
                  textAlign: 'center',
                  color: '#7d7d7d',
                  paddingBottom: '50px',
                  fontSize: '1.8em',
                }}
              >
                India Deals Credentials Tool
              </h1>
              <div style={{ margin: '10%', textAlign: 'center' }}>
                <Button
                  color="secondary"
                  variant="contained"
                  size="large"
                  onClick={() => handleLogin('popup')}
                  sx={{
                    pt: '14px',
                  }}
                  style={{ backgroundColor: '#f59c1a', textTransform: 'none' }}
                >
                  Sign in with PwC email
                </Button>
              </div>
            </Grid>
          ) : (
            <Spinner></Spinner>
          )}
          <Grid item xs={1} sm={2} md={4}></Grid>
        </Grid>
      </PageContainer>
    </Container>
  );
};

export default Login;
