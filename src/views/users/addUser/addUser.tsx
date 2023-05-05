import React, { useState, useEffect } from 'react';
import { toastMessage } from '../../../common/toastMessage';
import { MessageType } from '../../../common/enumContainer';
import { IAddUsers, IRoles } from '../userModels';
// import { getRoles, saveUser } from '../adminService';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, OutlinedInput } from '@mui/material';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import CustomFormLabel from '../../../components/forms/custom-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/custom-elements/CustomSelect';
// import useRouter from 'use-react-router';
import { Select } from '@mui/material';
import { post, get } from '../../../common/api-middleware/commonData.api';
import { config } from '../../../common/environment';
import { getUserByIdApi, saveUser } from '../userApi';
import { useNavigate } from 'react-router-dom';

//@ts-ignore
const AddUser = (props) => {
  // const history = useHistory();

  const { userId } = useParams();

  useEffect(() => {
    if (userId) getUsersById(userId);
  }, []);
  const navWidth = {
    width: '100%',
  };

  const user: IAddUsers = {
    roleId: '',
    email: '',
    mobileNumber: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    designation: '',
    costCenterName: '',
    costCenterLevel1: '',
    costCenterLevel2: '',
    reportingPartner: '',
    activeUser: '1',
  };

  const rolesData: IRoles[] = [];

  const [rolesList, setRoles] = useState(rolesData);
  const [userDetails, setUserDetails] = useState(user);
  const navigate = useNavigate();

  useEffect(() => {
    getRolesList();
  }, []);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 'auto !important',
      },
    },
    variant: 'menu' as "menu",
    getContentAnchorEl: null
  };

  const getUsersById = async (userId: string) => {
    const result = await getUserByIdApi(userId);
    if (result) {
      const editUsers: IAddUsers = result.data;
      setUserDetails({ ...editUsers });
    }
  };

  const reDirectToList = () => {
    navigate('/admin/users');
  };

  const handleOnSubmit = (values: any) => {
    saveUserDetails(values);
  };
  const getRolesList = async () => {
    const roles: IRoles[] = [
      { roleId: 'c41121ed-b6fb-c9a6-bc9b-574c82929e7e', name: 'Admin' },
      { roleId: 'c41121ed-b6fb-c9a6-bc9b-574c82929e7b', name: 'User' },
    ];
    // const result = await getRoles();
    setRoles(roles);
  };

  const saveUserDetails = async (userDetails: any) => {
    // userDetails.CallBackUIUrl = config.CallBack_Url + 'confirmEmail/';
    const result = await saveUser(userDetails, userId ? userId : '');
    if (result.data.status === 200) {
      if (userId) toastMessage(MessageType.Success, 'User Updated Successfully');
      else toastMessage(MessageType.Success, 'User Added Successfully');
      reDirectToList();
      // navigate('/admin/users');
    } else toastMessage(MessageType.Error, 'Internal Server Error Occured.Please try Again ..');

    // history.push('/admin/users');
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const BCrumb = [
    {
      to: '/admin/users',
      title: 'Users',
    },
    {
      title: (userId ? 'Edit ' : 'Add ') + 'User',
    },
  ];

  const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
  return (
    <div>
      <Formik
        initialValues={userDetails}
        enableReinitialize
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('First Name is required'),
          // lastName: Yup.string().required('Last Name is required'),

          roleId: Yup.string().required('Role is required'),
          email: Yup.string().email('Invalid Email').required('Email is required'),
          designation: Yup.string().required('Designation is required'),
          costCenterName: Yup.string().required('Cost Center is required'),
        })}
        onSubmit={handleOnSubmit}
        render={({ errors, values, handleChange, handleSubmit, setFieldValue, touched }) => (
          <PageContainer title={(userId ? 'Edit ' : 'Add ') + 'User'} description="user details">
            {/* breadcrumb */}
            <Breadcrumb title={(userId ? 'Edit ' : 'Add ') + 'User'} items={BCrumb} />
            {/* end breadcrumb */}
            <Card>
              <CardContent>
                <Form className={'formWidth'} noValidate onSubmit={handleSubmit}>
                  <div className="row pull-right">
                    <Button
                      id="btnClear"
                      color="secondary"
                      variant="contained"
                      style={{ marginRight: '5px' }}
                      onClick={reDirectToList}
                      className="reset-buttons-bg"
                    >
                      Cancel
                    </Button>
                    <Button
                      id="btnSearch"
                      color="secondary"
                      variant="contained"
                      type="submit"
                      className="buttons-bg"
                    >
                      Save
                    </Button>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} xl={4}>
                      <CustomTextField
                        id="firstName"
                        label="Full Name"
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        value={values.firstName}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      ></CustomTextField>
                    </Grid>
                    {/* <Grid item xs={12} md={4} xl={4}>
                      <CustomTextField
                        id="lastName"
                        label="Last Name"
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        value={values.lastName}
                      ></CustomTextField>
                    </Grid> */}
                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Email</CustomFormLabel> */}

                      <CustomTextField
                        id="email"
                        label="Email"
                        onChange={handleChange}
                        value={values.email}
                        variant="outlined"
                        fullWidth
                        size="small"
                        // isinvalid={!!errors.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      ></CustomTextField>
                      {/* {errors.email} */}
                    </Grid>
                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel id="role-select-label">Role</CustomFormLabel> */}
                      <CustomSelect
                        labelId="role-select-label"
                        id="role-select"
                        name="role"
                        displayEmpty
                        onChange={(event: any) => {
                          setFieldValue('roleId', event.target.value);
                        }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <legend style={{ fontSize: '0.75em' }}>
                                <span>Select Role</span>
                              </legend>
                            );
                          }
                          const selectedName = rolesList.find((x) => x.roleId == selected)?.name;
                          return selectedName;
                        }}
                        value={values.roleId}
                        fullWidth
                        size="small"
                        error={touched.roleId && Boolean(errors.roleId)}
                      >
                        {rolesList &&
                          rolesList.map((cat: any, i: number) => {
                            return (
                              <MenuItem key={i} value={cat.roleId}>
                                {cat.name}
                              </MenuItem>
                            );
                          })}
                      </CustomSelect>
                      {touched.roleId && Boolean(errors.roleId) && (
                        <p className="Mui-error" style={{ margin: '2px 15px' }}>
                          {errors.roleId}
                        </p>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Designation</CustomFormLabel> */}

                      <CustomTextField
                        id="designation"
                        label="Designation"
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        value={values.designation}
                        // isinvalid={!!errors.designation}
                        error={touched.designation && Boolean(errors.designation)}
                        helperText={touched.designation && errors.designation}
                      ></CustomTextField>
                      {/* {errors.designation} */}
                    </Grid>

                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Mobile</CustomFormLabel> */}

                      <CustomTextField
                        id="mobileNumber"
                        fullWidth
                        size="small"
                        label="Mobile"
                        onChange={handleChange}
                        value={values.mobileNumber}
                        // isinvalid={!!errors.mobileNumber}
                        error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                        helperText={touched.mobileNumber && errors.mobileNumber}
                      ></CustomTextField>
                      {/* {errors.mobileNumber} */}
                    </Grid>

                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Employee ID</CustomFormLabel> */}

                      <CustomTextField
                        id="employeeId"
                        fullWidth
                        label="Employee ID"
                        size="small"
                        onChange={handleChange}
                        value={values.employeeId}
                        // isinvalid={!!errors.employeeId}
                        error={touched.employeeId && Boolean(errors.employeeId)}
                        helperText={touched.employeeId && errors.employeeId}
                      ></CustomTextField>
                      {/* {errors.employeeId} */}
                    </Grid>

                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Cost Center - Name</CustomFormLabel> */}

                      <CustomTextField
                        id="costCenterName"
                        fullWidth
                        label="Cost Center- Name"
                        size="small"
                        onChange={handleChange}
                        value={values.costCenterName}
                        // isinvalid={!!errors.costCenterName}
                        error={touched.costCenterName && Boolean(errors.costCenterName)}
                        helperText={touched.costCenterName && errors.costCenterName}
                      ></CustomTextField>

                      {/* {errors.costCenterName} */}
                    </Grid>

                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Cost Center Level 1</CustomFormLabel> */}

                      <CustomTextField
                        id="costCenterLevel1"
                        label="Cost Center Level 1"
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        value={values.costCenterLevel1}
                      ></CustomTextField>
                    </Grid>

                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Cost Center Level 2</CustomFormLabel> */}

                      <CustomTextField
                        id="costCenterLevel2"
                        fullWidth
                        label="Cost Center Level 2"
                        size="small"
                        onChange={handleChange}
                        value={values.costCenterLevel2}
                      // isinvalid={!!errors.email}
                      ></CustomTextField>
                    </Grid>

                    <Grid item xs={12} md={4} xl={4}>
                      {/* <CustomFormLabel>Reporting Partner</CustomFormLabel> */}

                      <CustomTextField
                        id="reportingPartner"
                        label="Reporting Partner"
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        value={values.reportingPartner}
                      // isinvalid={!!errors.email}
                      ></CustomTextField>
                    </Grid>
                    <Grid item xs={12} md={2} xl={2}>
                      <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={values.activeUser}
                          onChange={(event: any) => {
                            setFieldValue('activeUser', event.target.value);
                          }}
                          input={<OutlinedInput label="Status" />}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value={'1'}>Active</MenuItem>
                          <MenuItem value={'2'}>InActive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Form>
              </CardContent>
            </Card>
          </PageContainer>
        )}
      />
    </div>
  );
};

export default AddUser;
