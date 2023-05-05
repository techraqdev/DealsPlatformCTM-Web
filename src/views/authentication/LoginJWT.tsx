import React from 'react';
import { Grid, Box, Typography, FormGroup, FormControlLabel, Button } from '@mui/material';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';

import img1 from '../../assets/images/backgrounds/login-bg.svg';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import login from '../../common/api-middleware/login';

const LoginJWT = () => {
  const handleOnSubmit = (values: any) => {
    // login(formik);

    login(values);
  };
  return (
    <>
      <Formik
        initialValues={{
          userName: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          userName: Yup.string().required('Email Address is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={handleOnSubmit}
      >
        {({ errors, status, touched, handleChange, handleSubmit, values }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
              <Grid
                item
                xs={12}
                sm={12}
                lg={6}
                sx={{
                  background: (theme) => `${theme.palette.mode === 'dark' ? '#1c1f25' : '#ffffff'}`,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      position: {
                        xs: 'relative',
                        lg: 'absolute',
                      },
                      height: { xs: 'auto', lg: '100vh' },
                      right: { xs: 'auto', lg: '-50px' },
                      margin: '0 auto',
                    }}
                  >
                    {/* <img
                      src={img1}
                      alt="bg"
                      style={{
                        width: '100%',
                        maxWidth: '812px',
                      }}
                    /> */}
                  </Box>

                  <Box
                    sx={{
                      p: 4,
                      position: 'absolute',
                      top: '0',
                    }}
                  >
                    <LogoIcon logoWidth={250} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
                <Grid container spacing={0} display="flex" justifyContent="center">
                  <Grid item xs={12} lg={9} xl={6}>
                    <Box
                      sx={{
                        p: 4,
                      }}
                    >
                      <Typography fontWeight="700" variant="h4">
                        Welcome to CTM Platform
                      </Typography>

                      <Box
                        sx={{
                          mt: 4,
                        }}
                      >
                        <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
                        <CustomTextField
                          id="email"
                          name="userName"
                          onChange={handleChange}
                          value={values.userName}
                          variant="outlined"
                          fullWidth
                          className={
                            'form-control' +
                            (errors.userName && touched.userName ? ' is-invalid' : '')
                          }
                        />
                        <ErrorMessage
                          name="userName"
                          component="div"
                          className="invalid-feedback"
                        />
                        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                        <CustomTextField
                          id="password"
                          type="password"
                          variant="outlined"
                          name="password"
                          onChange={handleChange}
                          value={values.password}
                          className={
                            'form-control' +
                            (errors.password && touched.password ? ' is-invalid' : '')
                          }
                          fullWidth
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                        <Box
                          sx={{
                            display: {
                              xs: 'block',
                              sm: 'flex',
                              lg: 'flex',
                            },
                            alignItems: 'center',
                          }}
                        >
                          {/* <Box
                    sx={{
                      ml: 'auto',
                    }}
                  >
                    <Typography
                      component={Link}
                      to="/auth/reset-password"
                      fontWeight="500"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        mb: '16px',
                        color: 'primary.main',
                      }}
                    >
                      Forgot Password ?
                    </Typography>
                  </Box> */}
                        </Box>

                        {/* <Button
                          color="secondary"
                          variant="contained"
                          size="large"
                          type="submit"
                          sx={{
                            pt: '14px',
                          }}
                          style={{ backgroundColor: '#f59c1a', textTransform: 'none' }}
                        >
                          Sign in with
                        </Button> */}

                        <Button
                          color="secondary"
                          type="submit"
                          variant="contained"
                          style={{
                            margin: '5px',
                            height: '40px',
                            textTransform: 'none',
                          }}
                          className="button-login-bg"
                        >
                          Login
                        </Button>

                        {/* <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                    mt: '20px',
                    mb: '20px',
                    '&::before': {
                      content: '""',
                      background: (theme) =>
                        `${theme.palette.mode === 'dark' ? '#42464d' : '#ecf0f2'}`,
                      height: '1px',
                      width: '100%',
                      position: 'absolute',
                      left: '0',
                      top: '13px',
                    },
                  }}
                >
                  <Typography
                    component="span"
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      position: 'relative',
                      padding: '0 12px',
                      background: (theme) =>
                        `${theme.palette.mode === 'dark' ? '#282c34' : '#fff'}`,
                    }}
                  >
                    or sign in with
                  </Typography>
                </Box> */}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginJWT;
