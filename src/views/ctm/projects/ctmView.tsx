import React, { FC, useState, useEffect } from 'react';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import {
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { IAddProject, IViewProps, IWfActions } from '../../projects/projectModels';
import {
  getProByProjId,
  saveProject,
  updataProject,
  getProjectCtmWfNextActionsByProjectAPI,
  projectCtmWfSubmit,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import {
  Ctm_Project_Wf_Actions,
  Ctm_Project_Wf_StatusTypes,
  MessageType,
  Project_Wf_Actions,
  Project_Wf_StatusTypes,
} from '../../../common/enumContainer';
import { useParams } from 'react-router';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import { IProjectWfDTO } from '../../projects/projectModels';
import { internal_error, pwf_submit } from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories } from '../../projects/taxonomyApi';
import { taxonomyMin, taxonomyCategory } from '../../projects/taxonomyModels';
import CustomSelect from '../../../components/forms/custom-elements/CustomSelect';

const CtmViewProject: FC = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();

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
  };

  const workflowButtons: any = {
    engageCtm: false,
    notEngageCtm: false,
    onGoingEngage: false,
    engageCompleted: false,
  };

  //set default data and to do remove
  const defaultConformationAction = "Are you sure to do the action?";
  const viewData: IWfActions[] = [];
  const [viewProps, setViewProps] = React.useState(viewData);
  const { projId } = useParams();
  const [initialValues, setInitialValues] = useState(intValues);
  const [openWFPop, setOpenWFPop] = useState(false);
  const [projectWFModel, setProjectWfModel] = useState(initialModel);
  const [taxonomyData, setTaxonomyData] = React.useState<taxonomyMin[]>([]);
  const [conformationText, setConformationText] = useState(defaultConformationAction);

  const BCrumb = [
    {
      to: '/ctm/projects',
      title: 'Projects',
    },
    {
      title: 'View Project',
    },
  ];

  useEffect(() => {
    if (projId) {
      getTaxonomyResult();
      getProjectByProjId();
      getProjectWfNextActionsByProject();
    }
  }, [projId]);

  const getProjectWfNextActionsByProject = async () => {
    const wfNextActions = await getProjectCtmWfNextActionsByProjectAPI(projId);

    if (wfNextActions && wfNextActions.data) {
      setViewProps(wfNextActions.data);
    }
  };

  const getProjectByProjId = async () => {
    const projData = await getProByProjId(projId);

    if (projData && projData.data) {
      setInitialValues(projData.data);
    }
  };

  const getTaxonomyResult = async () => {
    const result = await getTaxonomyDataByCategories([
      taxonomyCategory.PwcLegalEntity,
      taxonomyCategory.SBU,
    ]);
    if (result) {
      setTaxonomyData(result);
    }
  };

  const validate = (values: any) => {
    const errors: any = {};

    if (!values.projectCode) {
      errors.projectCode = 'Required field';
    }
    if (!values.name) {
      errors.name = 'Required field';
    }
    if (!values.taskCode) {
      errors.taskCode = 'Required field';
    }
    if (!values.clientName) {
      errors.clientName = 'Required field';
    }
    if (!values.projectPartner) {
      errors.projectPartner = 'Required field';
    }
    if (!values.taskManager) {
      errors.taskManager = 'Required field';
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
      sbuId: values.sbuId,
      legalEntityId: values.legalEntityId,
    };
    if (values.projectId) {
      const res = await updataProject(values.projectId, check);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        navigate('/ctm/projects');
      }
    } else {
      const res = await saveProject(check);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        navigate('/ctm/projects');
      }
    }
  };
  const handleWfChange = async () => {
    debugger;
    projectWFModel.projectId = projId;
    const res = await projectCtmWfSubmit(projectWFModel);
    if (res && res.data && res.data.status === 200) {
      toastMessage(MessageType.Success, pwf_submit);
      if (projectWFModel.ProjectWfStatustypeId == Ctm_Project_Wf_StatusTypes.EngagementOngoing
        || projectWFModel.ProjectWfStatustypeId == Ctm_Project_Wf_StatusTypes.CannotbeUsedforCTM
      || projectWFModel.ProjectWfStatustypeId == Ctm_Project_Wf_StatusTypes.CannotbeusedConfirmed
      || projectWFModel.ProjectWfStatustypeId == Ctm_Project_Wf_StatusTypes.CanbeUsedforCTM
      ) {
        navigate(`/ctm/projects`);
      } else if (
        projectWFModel.ProjectWfStatustypeId == Ctm_Project_Wf_StatusTypes.EngagementCompleted
      ) {
        navigate(`/ctm/project/upload/${projId}`);
      } else {
        setConformationText(defaultConformationAction);
        window.location.reload();
      }
    } else {
      toastMessage(MessageType.Error, internal_error);
      setConformationText(defaultConformationAction);
      window.location.reload();
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

  const ctmWereUsed = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.CanbeUsedforCTM,
      Ctm_Project_Wf_Actions.MarkAsCanBeUsed,
    );
    setOpenWFPop(true);
  };

  const ctmWereNotUsed = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.CannotbeUsedforCTM,
      Ctm_Project_Wf_Actions.MarkAsCannotBeUsed,
    );
    setConformationText("It will be submitted to the Partner for confirmation.");
    setOpenWFPop(true);
  };

  const ctmOnGoingEngagement = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.EngagementOngoing,
      Ctm_Project_Wf_Actions.MarkAsEngagementOngoing,
    );
    setOpenWFPop(true);
  };

  const ctmEngagementCompleated = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.EngagementCompleted,
      Ctm_Project_Wf_Actions.MarkAsEngagementCompleted,
    );
    setOpenWFPop(true);
  };

  const ctmConfirmCannotBeUsed = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.CannotbeusedConfirmed,
      Ctm_Project_Wf_Actions.ConfirmCannotBeUsed,
    );
    setOpenWFPop(true);
  };

  const ctmRejectCannotbeUsed = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.CanbeUsedforCTM,
      Ctm_Project_Wf_Actions.RejectCannotbeUsed,
    );
    setOpenWFPop(true);
  };
  const ctmEmailTriggered = () => {
    constrctWfModel(Ctm_Project_Wf_StatusTypes.NotResponded, Ctm_Project_Wf_Actions.EmailTriggered);
    setOpenWFPop(true);
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <PageContainer title={(projId ? 'Edit ' : 'Add ') + 'Project'} description="project details">
        {/* breadcrumb */}
        <Breadcrumb title={(projId ? 'Edit ' : 'Add ') + 'Project'} items={BCrumb} />
        {/* end breadcrumb */}
        <Card>
          <CardContent>
            <div className="row pull-right">
              <Button
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                onClick={() => {
                  navigate('/ctm/projects');
                }}
                className="reset-buttons-bg"
              >
                Back
              </Button>
            </div>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4} xl={4}>
                <CustomTextField
                  id="projectCode"
                  label="Project Code"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  value={formik.values.projectCode}
                  error={formik.touched.projectCode && Boolean(formik.errors.projectCode)}
                  helperText={formik.touched.projectCode && formik.errors.projectCode}
                  inputProps={{ readOnly: true }}
                ></CustomTextField>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <CustomTextField
                  id="name"
                  label="Project Name"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  inputProps={{ readOnly: true }}
                ></CustomTextField>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <CustomTextField
                  id="taskCode"
                  label="Task Code"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  value={formik.values.taskCode}
                  error={formik.touched.taskCode && Boolean(formik.errors.taskCode)}
                  helperText={formik.touched.taskCode && formik.errors.taskCode}
                  inputProps={{ readOnly: true }}
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
                  inputProps={{ readOnly: true }}
                ></CustomTextField>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <CustomTextField
                  id="hoursBooked"
                  label="Hours Booked"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  value={formik.values.hoursBooked}
                  // helperText={formik.touched.hoursBooked && formik.errors.hoursBooked}
                  inputProps={{ readOnly: true }}
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
                  inputProps={{ readOnly: true }}
                ></CustomTextField>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <CustomTextField
                  id="billingAmount"
                  label="Billing Amount"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  value={formik.values.billingAmount}
                  // helperText={formik.touched.billingAmount && formik.errors.billingAmount}
                  inputProps={{ readOnly: true }}
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
                  inputProps={{ readOnly: true }}
                ></CustomTextField>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <CustomTextField
                  id="clienteMail"
                  label="Client Email"
                  fullWidth
                  size="small"
                  onChange={formik.handleChange}
                  value={formik.values.clienteMail}
                  helperText={formik.touched.clienteMail && formik.errors.clienteMail}
                  inputProps={{ readOnly: true }}
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
                    displayEmpty
                    inputProps={{ readOnly: true }}
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
                    inputProps={{ readOnly: true }}
                    displayEmpty
                    input={
                      <OutlinedInput
                        label="Legal Entity"
                        className="multi-select-dropdown-outline"
                      />
                    }
                    onChange={formik.handleChange}
                    renderValue={(selected) => {
                      if (selected) {
                        const selectedName = taxonomyData.find((x) => x.id == selected)?.name;
                        return selectedName;
                      }
                    }}
                    value={formik.values.legalEntityId}
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.MarkAsCanBeUsed,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmWereUsed}
                    >
                      CTM was used in the engagement
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.MarkAsCannotBeUsed,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmWereNotUsed}
                    >
                      CTM was not used in the engagement
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.MarkAsEngagementOngoing,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmOnGoingEngagement}
                    >
                      The engagement is ongoing
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.MarkAsEngagementCompleted,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmEngagementCompleated}
                    >
                      The engagement has been completed and information can be uploaded
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.ConfirmCannotBeUsed,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmConfirmCannotBeUsed}
                    >
                      I confirm, CTM was not used
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.RejectCannotbeUsed,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmRejectCannotbeUsed}
                    >
                      CTM was used
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
                {viewProps &&
                  viewProps.filter(
                    (x) => x.projectWfActionId == Ctm_Project_Wf_Actions.EmailTriggered,
                  ).length > 0 && (
                    <Button
                      color="secondary"
                      variant="contained"
                      style={{ margin: '5px' }}
                      className="buttons-bg"
                      onClick={ctmEmailTriggered}
                    >
                      Trigger Email
                    </Button>
                  )}
              </Grid>
            </Grid>
          </CardContent>
          <Dialog
            open={openWFPop}
            onClose={() => {
              setConformationText(defaultConformationAction);
              setOpenWFPop(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{ }</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {conformationText}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  setConformationText(defaultConformationAction);
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
      </PageContainer>
    </Form>
  );
};

export default CtmViewProject;
