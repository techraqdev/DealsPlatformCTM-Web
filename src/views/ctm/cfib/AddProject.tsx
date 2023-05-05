import React, { FC, useState, useEffect } from 'react';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import {
  Card,
  CardContent,
  Grid,
  InputLabel,
  Button,
  MenuItem,
  OutlinedInput,
  FormControl,
  Select,
  SelectChangeEvent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Form } from 'react-bootstrap';
import jq from 'jquery';
import { useNavigate } from 'react-router-dom';
import { toastMessage } from '../../../common/toastMessage';
import {
  MessageType,
  Cfib_Project_Wf_StatusTypes,
  Cfib_Project_Wf_Actions,
} from '../../../common/enumContainer';
import { useParams } from 'react-router';
import { useFormik } from 'formik';
import { getTaxonomyData, saveCfibProject, getCfibProByAll } from '../../projects/taxonomyApi';
import { taxonomyCategory, taxonomy, projectCtmDetail } from '../../projects/taxonomyModels';
import { pwc_isAdmin, pwf_submit } from '../../../common/constants/common.constant';
import { getStorage } from '../../../common/helpers/storage.helper';
import { IProjectWfDTO, IAddCfibProject, IWfActions } from '../../projects/projectModels';
import {
  projectCfibWfSubmit,
  getProjectCfibWfNextActionsByProjectAPI,
} from '../../projects/projectApi';

const AddProject: FC = () => {
  const navigate = useNavigate();
  const tableId = '#project_upload_List';

  const { projId } = useParams();
  const [taxonomyData, setTaxonomyData] = React.useState<taxonomy[]>([]);
  const [sector, setSector] = React.useState('');
  const [subSector, setSubSector] = React.useState('');
  const [subSectorData, setSubSectorData] = React.useState<taxonomy[]>([]);
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [years, setYears] = React.useState<number[]>([]);
  const [projectId, setProjectId] = useState('');
  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);
  const [openSaveInfo, setOpenSaveInfo] = useState(false);
  const [openSavenoInfo, setOpenSavenoInfo] = useState(false);
  const [uniqueIdentifier, setUniqueIdentifier] = React.useState('');
  const [actionType, setActionType] = React.useState('');
  const [openIdentifier, setOpenIdentifier] = useState(false);
  const [openNoinfoPop, setOpenNoinfoPop] = useState(false);

  const intValues: IAddCfibProject = {
    month: '',
    year: '',
    sector: '',
    subSector: '',
    uniqueIdentifier: '',
  };
  const [initialValues, setInitialValues] = useState(intValues);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const viewData: IWfActions[] = [];
  const [viewProps, setViewProps] = React.useState(viewData);

  const BCrumb = [
    {
      to: '/cfib/projects',
      title: 'Projects',
    },
    {
      title: (projId ? 'Edit ' : 'Add ') + 'Project',
    },
  ];

  useEffect(() => {
    getTaxonomyResult();
    getYears();
    // getProjectWfNextActionsByProject();
  }, []);

  const getTaxonomyResult = async () => {
    const result = await getTaxonomyData();
    if (result) {
      setTaxonomyData(result);
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();

    const inputdat = {
      Month: getMonth(month),
      Year: year,
      SubSectorId: subSector,
      UniqueIdentifier: uniqueIdentifier,
    };

    const response = await saveCfibProject(inputdat);
    if (response && response.data && response.data.status === 200) {
      toastMessage(MessageType.Success, 'Data submitted successfully');
      navigate(`/ctm/project/upload/${response.data.data.projectId}/cfib`);
    }
  };

  const handleMonthType = (event) => {
    setMonth(event.target.value);
  };
  const handleYearType = (event) => {
    setYear(event.target.value);
  };

  const handleSector = (event) => {
    setSector(event.target.value);
    setSubSector('');
    const subsector = taxonomyData.filter(
      (x) => x.parentId != null && x.categoryId == 6 && x.parentId == event.target.value,
    );
    setSubSectorData(subsector);
  };
  const handleSubSector = (event: SelectChangeEvent<typeof subSector>) => {
    setSubSector(event.target.value);
  };
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [2015];
    let startYear = 2016;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }
    const yearslst = years.sort((a, b) => (a < b ? 1 : -1));
    setYears(yearslst);
  };
  const getMonth = (Name) => {
    switch (Name) {
      case 'January':
        return 1;
      case 'February':
        return 2;
      case 'March':
        return 3;
      case 'April':
        return 4;
      case 'May':
        return 5;
      case 'June':
        return 6;
      case 'July':
        return 7;
      case 'August':
        return 8;
      case 'September':
        return 9;
      case 'October':
        return 10;
      case 'November':
        return 11;
      case 'December':
        return 12;
      default:
        return 0;
    }
  };
  const saveanduploadinfo = async () => {
    //e.preventDefault();
    const inputdat = {
      Month: getMonth(month),
      Year: year,
      SubSectorId: subSector,
      UniqueIdentifier: uniqueIdentifier,
      isNewAdd: true,
    };
    const projData = await getCfibProByAll(inputdat);
    if (projData && projData.data && projData.data.data) {
      setProjectId(projData.data.data.projectId);
      setOpenSaveInfo(true);
    } else {
      const response = await saveCfibProject(inputdat);
      if (response && response.data && response.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        navigate(`/ctm/project/upload/${response.data.data.projectId}/cfib`);
      }
    }
  };
  const saveandmarkasnoinfo = async () => {
    const inputdat = {
      Month: getMonth(month),
      Year: year,
      SubSectorId: subSector,
      UniqueIdentifier: uniqueIdentifier,
      isNewAdd: true,
    };
    const projData = await getCfibProByAll(inputdat);
    if (projData && projData.data && projData.data.data) {
      setOpenSavenoInfo(true);
    } else {
      const response = await saveCfibProject(inputdat);
      if (response && response.data && response.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        const values: IProjectWfDTO = {
          projectId: response.data.data.projectId,
          ProjectWfStatustypeId: Cfib_Project_Wf_StatusTypes.MarkedAsInformationNotAvailable,
          ProjectWfActionId: Cfib_Project_Wf_StatusTypes.MarkedAsInformationNotAvailable,
        };
        const res = await projectCfibWfSubmit(values);
        if (res && res.data && res.data.status === 200) {
          if (res.data.data.reportingMgrEmailAvail) {
            toastMessage(MessageType.Success, pwf_submit);
          } else {
            toastMessage(MessageType.Success, "Project Status Changed Successfully, Cannot send email as Reporting parter not assigned to the user");
          }
          navigate(`/cfib/projects`);
        }
      }
    }
  };
  const handleUniqueIdentifier = (value: any) => {
    setUniqueIdentifier(value);
  };
  const handleSaveInfoClose = () => {
    setOpenSaveInfo(false);
  };
  const handleSaveNoInfoClose = () => {
    setOpenSavenoInfo(false);
  };
  const submitNoInfoUpload = () => {
    saveandmarkasnoinfo();
    setOpenNoinfoPop(false);
  }
  const addorUpdateProject = async (btInfo) => {
    if (btInfo === 'add' && uniqueIdentifier == '') {
      toastMessage(MessageType.Error, 'Please provide Unique Identifier');
    } else {
      const inputdat = {
        Month: getMonth(month),
        Year: year,
        SubSectorId: subSector,
        UniqueIdentifier: uniqueIdentifier,
        isNewAdd: btInfo === 'add' ? true : false,
        ProjectId: projectId,
      };
      setOpenSaveInfo(false);
      const response = await saveCfibProject(inputdat);
      if (response && response.data && response.data.status === 200) {
        toastMessage(MessageType.Success, 'Data submitted successfully');
        if (btInfo === 'update') navigate(`/ctm/project/upload/${projectId}/cfib/update`);
        else navigate(`/ctm/project/upload/${response.data.data.projectId}/cfib`);
      }
    }
  };
  const addIdentifier = async () => {
    setOpenIdentifier(true);
  };
  const handleIdentifierClose = () => {
    setOpenIdentifier(false);
  };
  const cfibViewProjectData = () => {
    window.open(`/ctm/project/edit/${projectId}/cfib`, '_blank');
    //navigate(`/ctm/project/edit/${projId}/cfib`);
  };
  const validate = (values: any) => {
    const errors: any = {};

    if (!month) {
      errors.month = 'Required field';
    }
    if (!year) {
      errors.year = 'Required field';
    }
    if (!sector) {
      errors.sector = 'Required field';
    }
    if (!subSector) {
      errors.subSector = 'Required field';
    }
    if (openIdentifier) {
      if (!uniqueIdentifier) {
        errors.uniqueIdentifier = 'Required field';
      }
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validate,
    onSubmit: (values: any) => {
      if (actionType === 'saveanduploadinfo') {
        saveanduploadinfo();
      } else if (actionType === 'saveandmarkasnoinfo') {
        // saveandmarkasnoinfo();
        setOpenNoinfoPop(true);
      }
    },
  });

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
                  navigate('/cfib/projects');
                }}
                className="reset-buttons-bg"
              >
                Cancel
              </Button>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} xl={4}>
                <FormControl sx={{ m: 0, width: '100%' }}>
                  <InputLabel id="sbu-select-label" className="multi-select-dropdown-outline">
                    Month
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={month}
                    onChange={handleMonthType}
                    input={
                      <OutlinedInput label="Month" className="multi-select-dropdown-outline" />
                    }
                    className="multi-select-dropdown"
                    error={formik.touched.month && Boolean(formik.errors.month)}
                  >
                    {monthNames.map((month) => (
                      <MenuItem key={month} value={month} className="multi-select-dropdown">
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <FormControl sx={{ m: 0, width: '100%' }}>
                  <InputLabel
                    id="demo-multiple-checkbox-label"
                    className="multi-select-dropdown-outline"
                  >
                    Years
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={year}
                    onChange={handleYearType}
                    input={
                      <OutlinedInput label="Years" className="multi-select-dropdown-outline" />
                    }
                    className="multi-select-dropdown"
                    error={formik.touched.year && Boolean(formik.errors.year)}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year} className="multi-select-dropdown">
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <FormControl sx={{ m: 0, width: '100%' }}>
                  <InputLabel id="sbu-select-label" className="multi-select-dropdown-outline">
                    Sector
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={sector}
                    onChange={handleSector}
                    input={
                      <OutlinedInput label="Sector" className="multi-select-dropdown-outline" />
                    }
                    className="multi-select-dropdown"
                    error={formik.touched.sector && Boolean(formik.errors.sector)}
                  >
                    {taxonomyData
                      .filter((x) => x.categoryId == taxonomyCategory.Sector)
                      .map((taxonomy) => (
                        <MenuItem
                          key={taxonomy.taxonomyUUID}
                          value={taxonomy.taxonomyUUID}
                          className="multi-select-dropdown"
                        >
                          {taxonomy.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} xl={4}>
                <FormControl sx={{ m: 0, width: '100%' }}>
                  <InputLabel
                    id="demo-multiple-checkbox-label"
                    className="multi-select-dropdown-outline"
                  >
                    Sub sector
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={subSector}
                    onChange={handleSubSector}
                    input={
                      <OutlinedInput label="Sub Sector" className="multi-select-dropdown-outline" />
                    }
                    className="multi-select-dropdown"
                    error={formik.touched.subSector && Boolean(formik.errors.subSector)}
                  >
                    {subSectorData.map((taxonomy) => (
                      <MenuItem
                        key={taxonomy.taxonomyUUID}
                        value={taxonomy.taxonomyUUID}
                        className="multi-select-dropdown"
                      >
                        {taxonomy.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} md={4} xl={4}>
                <FormControl sx={{ m: 0, width: '90%' }}>
                  <TextField
                    size="small"
                    name="uniqueIdentifier"
                    id="txtUniqueIdentifier"
                    value={uniqueIdentifier}
                    //error={clientEmail ? false : true}
                    onChange={(event) => handleUniqueIdentifier(event.target.value)}
                    placeholder="Unique Identifier"
                    error={
                      formik.touched.uniqueIdentifier && Boolean(formik.errors.uniqueIdentifier)
                    }
                  ></TextField>
                </FormControl>
              </Grid> */}
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              xl={12}
              style={{ textAlign: 'end' }}
              sx={{ paddingTop: '0px !important' }}
            >
              <Button
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                type="submit"
                onClick={() => setActionType('saveanduploadinfo')}
              >
                Save &#38; Upload CTM Information
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              xl={12}
              style={{ textAlign: 'end' }}
              sx={{ paddingTop: '0px !important' }}
            >
              <Button
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                type="submit"
                onClick={() => setActionType('saveandmarkasnoinfo')}
              >
                No Information to upload
              </Button>
            </Grid>
            {viewProps &&
              viewProps.filter(
                (x) =>
                  x.projectWfActionId == Cfib_Project_Wf_Actions.InformationNotAvailableConfirmed,
              ).length > 0 && (
                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ margin: '5px' }}
                    className="buttons-bg"
                    onClick={saveandmarkasnoinfo}
                  >
                    Confirm - Information Not available
                  </Button>
                </Grid>
              )}
            {viewProps &&
              viewProps.filter(
                (x) =>
                  x.projectWfActionId == Cfib_Project_Wf_Actions.InformationNotAvailableRejected,
              ).length > 0 && (
                <Grid
                  item
                  xs={12}
                  md={12}
                  xl={12}
                  style={{ textAlign: 'end' }}
                  sx={{ paddingTop: '0px !important' }}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ margin: '5px' }}
                    className="buttons-bg"
                    onClick={saveandmarkasnoinfo}
                  >
                    Reject - Information Not avaialable
                  </Button>
                </Grid>
              )}
          </CardContent>
          <Dialog
            open={openSaveInfo}
            onClose={handleSaveInfoClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>
              <b>Data is already uploaded for selected Sector, Sub Sector and Period. <br /> Please provide Unique Identifier to proceed.</b>
            </DialogTitle>
            <DialogContent>
              <TextField
                size="small"
                name="projectC"
                id="txtProjectC"
                className="textbox-feild"
                value={uniqueIdentifier}
                onChange={(event) => handleUniqueIdentifier(event.target.value)}
                placeholder={'Unique Identifier (Optional for Update existing)'}
                error={formik.touched.uniqueIdentifier && Boolean(formik.errors.uniqueIdentifier)}
                multiline={true}
                rows={3}
                fullWidth
              ></TextField>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                className="reset-buttons-bg"
                onClick={handleSaveInfoClose}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                className="buttons-bg"
                onClick={cfibViewProjectData}
              >
                View Existing Data
              </Button>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                className="buttons-bg"
                onClick={() => addorUpdateProject('add')}
              >
                Add New
              </Button>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                className="buttons-bg"
                onClick={() => addorUpdateProject('update')}
              >
                Update Existing
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openSavenoInfo}
            onClose={handleSaveNoInfoClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle></DialogTitle>
            <DialogContent>
              <p>
                Data is already uploaded for selected Sector, Sub Sector and Period.
                {/* You have already submitted that no task to upload for the selected Sector, Sub
                Sector and Period. */}
              </p>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                className="reset-buttons-bg"
                onClick={handleSaveNoInfoClose}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openIdentifier}
            onClose={handleIdentifierClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>{'Add Unique Identifier '}</DialogTitle>
            <DialogContent>
              <FormControl sx={{ m: 0, width: '90%' }}>
                <TextField
                  size="small"
                  name="uniqueIdentifier"
                  id="txtUniqueIdentifier"
                  value={uniqueIdentifier}
                  //error={clientEmail ? false : true}
                  onChange={(event) => handleUniqueIdentifier(event.target.value)}
                  placeholder="Unique Identifier"
                  error={formik.touched.uniqueIdentifier && Boolean(formik.errors.uniqueIdentifier)}
                ></TextField>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                className="reset-buttons-bg"
                onClick={handleIdentifierClose}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                className="buttons-bg"
                onClick={() => addorUpdateProject('add')}
              >
                Add Unique Identifier
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openNoinfoPop}
            onClose={() => {
              setOpenNoinfoPop(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {/* <DialogTitle></DialogTitle> */}
            <DialogContent>
              <p>Are you sure to proceed</p>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  setOpenNoinfoPop(false);
                }}
                className="reset-buttons-bg"
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                onClick={submitNoInfoUpload}
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

export default AddProject;
