import React, { FC, useState, useEffect } from 'react';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import {
  Card,
  CardContent,
  styled,
  Grid,
  Paper,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  OutlinedInput,
  FormControl,
  Select,
  Autocomplete,
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { IAddProject, IViewProps, IProjectWfDTO } from './projectModels';
import { getProByProjId, saveProject, updataProject, projectWfSubmit, getProjectWfNextActionsByProjectAPI } from './projectApi';
import { toastMessage } from '../../common/toastMessage';
import {
  MessageType,
  Project_Wf_Actions,
  Project_Wf_StatusTypes,
} from '../../common/enumContainer';
import { useParams } from 'react-router';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { getTaxonomyDataByCategories } from './taxonomyApi';
import { taxonomyCategory, taxonomyMin } from './taxonomyModels';
import { internal_error, pwf_submit } from '../../common/constants/common.constant';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { pwc_isAdmin } from '../../common/constants/common.constant';
import { getStorage } from '../../common/helpers/storage.helper';
import { Option } from 'react-multi-select-component';

const AddProject: FC = () => {
  const navigate = useNavigate();
  const initialModel: IProjectWfDTO = {};
  const intValues: IAddProject = {
    projectCode: '',
    name: '',
    taskCode: '',
    clientName: '',
    hoursBooked: '',
    projectPartner: '',
    billingAmount: '',
    clienteMail: '',
    taskManager: '',
    projectTypeId: undefined,
    projectId: undefined,
    legalEntityId: 0,
    sbuId: 0,
    clientContactName: '',
    startDate: null,
    debtor: '',
    restrictedReason: '',
  };
  const viewData: IViewProps = {
    showMarkasQuotable: false,
    showMarkasNonQuotable: false,
    showMarkasRestricted: false,
    showOverridesRestriction: false,
    showConfirmRestriction: false,
    showRemoveRestriction: false,
    showRestrictionReason: false,
  };
  const [viewProps, setViewProps] = React.useState(viewData);
  const confirmText1 = "Are you sure to do the action?";
  const confirmText2 = "This will be submitted to the Partner for confirmation";
  const showOverrideRestictionText = "This will be submitted to the Manager for inputting data";

  const { projId } = useParams();
  const [initialValues, setInitialValues] = useState(intValues);
  const [openWFPop, setOpenWFPop] = useState(false);
  const [projectWFModel, setProjectWfModel] = useState(initialModel);
  const [taxonomyData, setTaxonomyData] = React.useState<taxonomyMin[]>([]);
  // const [isClientEmailValReq, setIsClientEmailValReq] = useState(false);
  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [wfPopupText, setWfPopupText] = useState(confirmText1);
  const [autorizeManagerPartner, setAutorizeManagerPartner] = useState(false);
  const [restrictionReasonData, setRestrictionReasonData] = React.useState<Option[]>([]);
  const [restrictionReasonText, setRestrictionReasonText] = React.useState('');
  const [restrictionReason, setRestrictionReason] = React.useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [restrictionReasonValue, setRestrictionReasonValue] = React.useState('');

  const BCrumb = [
    {
      to: '/db/projects',
      title: 'Projects',
    },
    {
      title: (projId ? 'Edit ' : 'Add ') + 'Project',
    },
  ];

  useEffect(() => {
    getTaxonomyResult();
    if (projId) {
      getProjectByProjId();
      getProjectWfNextActionsByProject();
    }
  }, [projId]);

  const getProjectWfNextActionsByProject = async () => {
    const wfNextActions = await getProjectWfNextActionsByProjectAPI(projId);
    debugger;
    if (wfNextActions && wfNextActions.data) {
      if (!wfNextActions.data.notManagerPartner) {
        setViewProps(wfNextActions.data);
        setRestrictionReasonValue(wfNextActions.data.restrictionReason);
      } else {
        setAutorizeManagerPartner(true);
      }
    }
  };

  const getProjectByProjId = async () => {
    const projData = await getProByProjId(projId);
    debugger;
    if (projData && projData.data) {
      setInitialValues(projData.data);
    }
  };

  const getTaxonomyResult = async () => {
    const result = await getTaxonomyDataByCategories([
      taxonomyCategory.PwcLegalEntity,
      taxonomyCategory.SBU,
      taxonomyCategory.RestrictionResons,
    ]);
    if (result) {
      setTaxonomyData(result);
      setRestrictionReasonData(
        result
          .filter((data) => data.categoryId === taxonomyCategory.RestrictionResons)
          .map((taxonomy) => ({ value: taxonomy.id, label: taxonomy.name })),
      );
    }
  };

  const validate = (values: any) => {
    const errors: any = {};

    if (!values.projectCode) {
      errors.projectCode = 'Required field';
    }
    if (values.projectCode.length > 20) {
      errors.projectCode = 'Project Code must be less than 20 characters';
    }
    if (!values.taskCode) {
      errors.taskCode = 'Required field';
    }
    if (values.taskCode.length > 20) {
      errors.taskCode = 'Task Code must be less than 20 characters';
    }
    if (!values.name) {
      errors.name = 'Required field';
    }
    if (!values.clientName) {
      errors.clientName = 'Required field';
    }
    if (!values.projectPartner) {
      errors.projectPartner = 'Required field';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.projectPartner)) {
      errors.projectPartner = 'Invalid project partner';
    }
    if (!values.taskManager) {
      errors.taskManager = 'Required field';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.taskManager)) {
      errors.taskManager = 'Invalid task manager';
    }
    if (!values.startDate) {
      errors.startDate = 'Required field';
    }

    // if (
    //   values.clienteMail &&
    //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.clienteMail)
    // ) {
    //   errors.clienteMail = 'Invalid client email';
    // }

    // email('Invalid Email').required('Email is required'),
    if (Number(values.legalEntityId) <= 0) {
      errors.legalEntityId = 'Required field';
    }

    if (Number(values.sbuId) <= 0) {
      errors.sbuId = 'Required field';
    }
    if (!values.hoursBooked) {
      if (values.hoursBooked != 0) {
        errors.hoursBooked = 'Required field';
      }
    } else if (values.hoursBooked <= -1) {
      errors.hoursBooked = 'hours booked must be greater than or equal to 0';
    }
    if (!values.billingAmount) {
      if(values.billingAmount != 0) {
        errors.billingAmount = 'Required field';
      }
    } else if (values.billingAmount <= -1) {
      errors.billingAmount = 'billing amount must be greater than or equal to 0';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validate,
    onSubmit: (values: any) => {
      saveProjectData(values);
    },
  });

  const saveProjectData = async (values: any) => {
    debugger;
    const check = {
      projectId: values.projectId,
      projectCode: values.projectCode,
      name: values.name,
      taskCode: values.taskCode,
      clientName: values.clientName,
      clienteMail: values.clienteMail,
      projectPartner: values.projectPartner,
      taskManager: values.taskManager,
      hoursBooked: values.hoursBooked ? Number(values.hoursBooked) : 0,
      billingAmount: values.billingAmount ? Number(values.billingAmount) : 0,
      projectTypeId: 1,
      sbuId: Number(values.sbuId),
      legalEntityid: Number(values.legalEntityId),
      clientContactName: values.clientContactName,
      startDate: values.startDate,
      debtor: values.debtor
    };
    if (values.projectId) {
      debugger;
      const res = await updataProject(values.projectId, check);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        navigate('/db/projects');
      }
    } else {
      debugger;
      const res = await saveProject(check);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        navigate('/db/projects');
      }
    }
  };
  const handleWfChange = async () => {
    debugger;
    if (projectWFModel.ProjectWfStatustypeId == Project_Wf_StatusTypes.Restricted) {
      if (restrictionReasonText) {
        formik.submitForm();
        projectWFModel.projectId = projId;
        projectWFModel.RestrictedReason = restrictionReason;
        const res = await projectWfSubmit(projectWFModel);
        if (res && res.data && res.data.status === 200) {
          toastMessage(MessageType.Success, pwf_submit);
          navigate(`/db/projects`);          
        } else {
          toastMessage(MessageType.Error, internal_error);
          window.location.reload();
        }
      } else {
        setErrorMsg('Please select one of the reason');
      }
    } else {
      formik.submitForm();
      projectWFModel.projectId = projId;
      const res = await projectWfSubmit(projectWFModel);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, pwf_submit);
        if (projectWFModel.ProjectWfStatustypeId == Project_Wf_StatusTypes.Quotable) {
          if (viewProps.showOverridesRestriction) {
            navigate(`/db/projects`);
          } else {
            navigate(`/db/projects/${projId}/form`);
          }
        } else {
          navigate(`/db/projects`);

          // window.location.reload();
        }
      } else {
        toastMessage(MessageType.Error, internal_error);
        window.location.reload();
      }
    }  
  };
  const constrctWfModel = (wfStatusTypeId: number, wfActionId) => {
    const values: IProjectWfDTO = {
      projectId: projId,
      ProjectWfStatustypeId: wfStatusTypeId,
      ProjectWfActionId: wfActionId,
    };
    setProjectWfModel(values);
  };
  const ShowMarkasQuotable = () => {
    constrctWfModel(Project_Wf_StatusTypes.Quotable, Project_Wf_Actions.MarkasQuotable);
    setWfPopupText(confirmText1);

    setOpenWFPop(true);
  };
  const ShowMarkasNonQuotable = () => {
    constrctWfModel(Project_Wf_StatusTypes.NotQuotable, Project_Wf_Actions.MarkasNonQuotable);
    setWfPopupText(confirmText1);
    setOpenWFPop(true);

  };
  const ShowMarkasRestricted = () => {
    setRestrictionReason('');
    setRestrictionReasonText('');
    setErrorMsg('');
    constrctWfModel(Project_Wf_StatusTypes.Restricted, Project_Wf_Actions.MarkasRestricted);
    setWfPopupText(confirmText2);
    setOpenWFPop(true);
  };
  const ShowOverridesRestriction = () => {
    constrctWfModel(Project_Wf_StatusTypes.Quotable, Project_Wf_Actions.OverridesRestriction);
    setWfPopupText(showOverrideRestictionText);
    setOpenWFPop(true);
  };
  const ShowConfirmRestriction = () => {
    constrctWfModel(
      Project_Wf_StatusTypes.RestrictionConfirmed,
      Project_Wf_Actions.ConfirmRestriction,
    );
    setWfPopupText(confirmText1);

    setOpenWFPop(true);
  };
  const ShowRemoveRestriction = () => {
    constrctWfModel(Project_Wf_StatusTypes.Quotable, Project_Wf_Actions.RemoveRestriction);
    setWfPopupText(confirmText1);

    setOpenWFPop(true);
  };

  const handleRestriction = (event, target) => {
    debugger;
    setRestrictionReason(target.value);
    setRestrictionReasonText(target.label);
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <PageContainer title={(projId ? 'Edit ' : 'Add ') + 'Project'} description="project details">
        {/* breadcrumb */}
        <Breadcrumb title={(projId ? 'Edit ' : 'Add ') + 'Project'} items={BCrumb} />
        {/* end breadcrumb */}
        {!autorizeManagerPartner ? (
          <Card>
            <CardContent>
              <div className="row pull-right">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  onClick={() => {
                    navigate('/db/projects');
                  }}
                  className="reset-buttons-bg"
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  type="submit"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                >
                  Save
                </Button>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="projectCode"
                    label="Project Code"
                    fullWidth
                    size="small"
                    disabled={projId && !isAdmin ? true : false}
                    onChange={formik.handleChange}
                    value={formik.values.projectCode}
                    error={formik.touched.projectCode && Boolean(formik.errors.projectCode)}
                    helperText={formik.touched.projectCode && formik.errors.projectCode}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="name"
                    label="Project Name"
                    fullWidth
                    size="small"
                    disabled={projId && !isAdmin ? true : false}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="taskCode"
                    label="Task Code"
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    disabled={projId && !isAdmin ? true : false}
                    value={formik.values.taskCode}
                    error={formik.touched.taskCode && Boolean(formik.errors.taskCode)}
                    helperText={formik.touched.taskCode && formik.errors.taskCode}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="clientName"
                    label="Client Name"
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    value={formik.values.clientName}
                    error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                    helperText={formik.touched.clientName && formik.errors.clientName}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="hoursBooked"
                    label="Hours Booked"
                    fullWidth
                    disabled={projId && !isAdmin ? true : false}
                    type="number"
                    size="small"
                    onChange={formik.handleChange}
                    value={formik.values.hoursBooked}
                    error={formik.touched.hoursBooked && Boolean(formik.errors.hoursBooked)}
                    helperText={formik.touched.hoursBooked && formik.errors.hoursBooked}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="projectPartner"
                    label="Project Partner"
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    value={formik.values.projectPartner}
                    error={formik.touched.projectPartner && Boolean(formik.errors.projectPartner)}
                    helperText={formik.touched.projectPartner && formik.errors.projectPartner}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="billingAmount"
                    label="Billing Amount"
                    fullWidth
                    type="number"
                    size="small"
                    disabled={projId && !isAdmin ? true : false}
                    onChange={formik.handleChange}
                    error={formik.touched.billingAmount && Boolean(formik.errors.billingAmount)}
                    value={formik.values.billingAmount}
                    helperText={formik.touched.billingAmount && formik.errors.billingAmount}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="taskManager"
                    label="Task Manager"
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    value={formik.values.taskManager}
                    error={formik.touched.taskManager && Boolean(formik.errors.taskManager)}
                    helperText={formik.touched.taskManager && formik.errors.taskManager}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="clienteMail"
                    label="Client Email"
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    //error={formik.touched.clienteMail && Boolean(formik.errors.clienteMail)}
                    value={formik.values.clienteMail}
                    helperText={formik.touched.clienteMail && formik.errors.clienteMail}
                  ></CustomTextField>
                </Grid>

                <Grid item xs={12} md={4} xl={4}>
                  <FormControl sx={{ m: 0, width: '100%' }}>
                    <InputLabel id="sbu-select-label" className="multi-select-dropdown-outline">
                      SBU
                    </InputLabel>
                    <CustomSelect
                      labelId="sbu-select-label"
                      id="sbuId"
                      name="sbuId"
                      disabled={projId && !isAdmin ? true : false}
                      displayEmpty
                      error={formik.touched.sbuId && Boolean(formik.errors.sbuId)}
                      onChange={formik.handleChange}
                      input={<OutlinedInput label="SBU" className="multi-select-dropdown-outline" />}
                      renderValue={(selected) => {
                        if (selected) {
                          const selectedName = taxonomyData.find((x) => x.id == selected)?.name;
                          return selectedName;
                        }
                      }}
                      value={formik.values.sbuId}
                      fullWidth
                      className="multi-select-dropdown"
                      size="small"
                    >
                      {taxonomyData
                        .filter((x) => x.categoryId == taxonomyCategory.SBU)
                        .map((taxonomy) => (
                          <MenuItem
                            key={taxonomy.id}
                            value={taxonomy.id}
                            className="multi-select-dropdown"
                          >
                            {taxonomy.name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <FormControl sx={{ m: 0, width: '100%' }}>
                    <InputLabel
                      id="legalEntity-select-label"
                      className="multi-select-dropdown-outline"
                    >
                      Legal Entity
                    </InputLabel>
                    <CustomSelect
                      labelId="legalEntity-select-label"
                      id="legalEntityId"
                      name="legalEntityId"
                      disabled={projId && !isAdmin ? true : false}
                      error={formik.touched.legalEntityId && Boolean(formik.errors.legalEntityId)}
                      displayEmpty
                      input={
                        <OutlinedInput
                          label="Legal Entity"
                          className="multi-select-dropdown-outline"
                        />
                      }
                      renderValue={(selected) => {
                        if (selected) {
                          const selectedName = taxonomyData.find((x) => x.id == selected)?.name;
                          return selectedName;
                        }
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.legalEntityId?.toString()}
                      fullWidth
                      className="multi-select-dropdown-outline"
                      size="small"
                    >
                      {taxonomyData
                        .filter((x) => x.categoryId == taxonomyCategory.PwcLegalEntity)
                        .map((taxonomy) => (
                          <MenuItem
                            key={taxonomy.id}
                            value={taxonomy.id}
                            className="multi-select-dropdown"
                          >
                            {taxonomy.name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="clientContactName"
                    label="Client Contact Name"
                    fullWidth
                    size="small"
                    onChange={formik.handleChange}
                    value={formik.values.clientContactName}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <CustomTextField
                    id="debtor"
                    label="Debtor"
                    fullWidth
                    disabled={projId && !isAdmin ? true : false}
                    size="small"
                    onChange={formik.handleChange}
                    value={formik.values.debtor}
                  ></CustomTextField>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={formik.values.startDate}
                      disabled={projId && !isAdmin ? true : false}
                      inputFormat="yyyy-MM-dd"
                      onChange={(value) => formik.setFieldValue('startDate', value, true)}
                      renderInput={(params) =>
                        <TextField {...params} id="startDate"
                          error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                          helperText={formik.touched.startDate && formik.errors.startDate}
                        />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                {viewProps && viewProps.showRestrictionReason && (
                  <CustomTextField
                    id="reason"
                    label="Reason for Restriction"
                    fullWidth
                    size="small"
                    value={restrictionReasonValue}                   
                    inputProps={{ readOnly: true }}
                  ></CustomTextField>
                )}
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '30px !important' }}
                >
                  {viewProps && viewProps.showMarkasQuotable && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ShowMarkasQuotable}
                    >
                      Yes, the engagement is over and can be used as a Credential
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  {viewProps && viewProps.showMarkasNonQuotable && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ShowMarkasNonQuotable}
                    >
                      No, the engagement cannot be used as a Credential as yet
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  {viewProps && viewProps.showMarkasRestricted && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ShowMarkasRestricted}
                    >
                      {/* Due to EL / ToB restriction, this project cannot be used as a credential */}
                      This Project should not be used as a Credential
                    </Button>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  {viewProps && viewProps.showOverridesRestriction && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ShowOverridesRestriction}
                    >
                      No, this engagement can be used as Credential
                    </Button>
                  )}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  {viewProps && viewProps.showConfirmRestriction && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ShowConfirmRestriction}
                    >
                      Approve Restriction
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  {viewProps && viewProps.showRemoveRestriction && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ShowRemoveRestriction}
                    >
                      Remove Restriction
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <Dialog
              open={openWFPop}
              onClose={() => {
                setOpenWFPop(false);
              }}
              id="Dilog_Box_Projects"
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{ }</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <p>{wfPopupText === confirmText2 && (
                    <Autocomplete
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={restrictionReasonData}
                      value={
                        restrictionReasonText === ''
                          ? { label: '', value: '' }
                          : { label: restrictionReasonText, value: restrictionReason }
                      }
                      onChange={handleRestriction}
                      renderInput={(params) => (
                        <TextField {...params} label="Reason" size="small" />
                      )}
                      style={{ width: '300px', padding: '12px 12px' }}
                    />
                  )}
                  {wfPopupText === confirmText2 && (
                    <span className="Mui-error" style={{ margin: '2px 15px' }}>{errorMsg}<br/></span>
                  )}
                  
                  {/* Are you sure to do the action? */}
                  {wfPopupText}</p>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    setOpenWFPop(false);
                  }}
                  className="reset-buttons-bg"
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleWfChange}
                  autoFocus
                  className="buttons-bg"
                >
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Grid container spacing={1} className="mt-25 mb25">
                <div>
                  <p> You are not authorised to access this page, please contact <b>administrator</b> for details.</p>
                </div>
              </Grid>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </Form>
  );
};

export default AddProject;
