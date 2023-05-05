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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
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
import { getTaxonomyData, saveCfibProject } from '../../projects/taxonomyApi';
import { taxonomyCategory, taxonomy, projectCfibDetail } from '../../projects/taxonomyModels';
import { pwc_isAdmin, pwf_submit, internal_error } from '../../../common/constants/common.constant';
import { getStorage } from '../../../common/helpers/storage.helper';
import { IProjectWfDTO, IViewProps, IWfActions } from '../../projects/projectModels';
import {
  projectCfibWfSubmit,
  getProjectCfibWfNextActionsByProjectAPI,
  getCfibProByProjId,
} from '../../projects/projectApi';
import { any } from 'prop-types';

const EditProject: FC = () => {
  const navigate = useNavigate();
  const { projId } = useParams();
  const [taxonomyData, setTaxonomyData] = React.useState<taxonomy[]>([]);
  const [sector, setSector] = React.useState('');
  const [subSector, setSubSector] = React.useState('');
  const [subSectorData, setSubSectorData] = React.useState<taxonomy[]>([]);
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [years, setYears] = React.useState<number[]>([]);
  const [file, setUploadedFile] = useState('');
  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [keyword, setKeyword] = React.useState('');

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
  const initialModel: IProjectWfDTO = {};
  const [viewProps, setViewProps] = React.useState(viewData);
  const [openWFPop, setOpenWFPop] = useState(false);
  const [projectWFModel, setProjectWfModel] = useState(initialModel);

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
    getProjectByProjId();
    getProjectWfNextActionsByProject();
  }, []);

  const wrapActions = function (acts: any) {
    let allCmds = "<span class='gridRowAct'>";
    if (acts != null) {
      acts.forEach(function (val, ind) {
        if (ind == 0) {
          allCmds += val;
        } else {
          allCmds += "<span class='cmdItem'></span>" + val;
        }
      });
    }
    allCmds += '</span>';
    return allCmds;
  };

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
    let startYear = 2015;
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
  const getMonthName = (row) => {
    switch (row) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  };
  const saveanduploadinfo = async (e: any) => {
    e.preventDefault();

    const inputdat = {
      Month: getMonth(month),
      Year: year,
      SubSectorId: subSector,
      UniqueIdentifier: keyword,
      ProjectId: projId,
    };

    const response = await saveCfibProject(inputdat);
    if (response && response.data && response.data.status === 200) {
      toastMessage(MessageType.Success, 'Data submitted successfully');
      navigate(`/ctm/project/upload/${projId}/cfib`);
    }
  };
  const saveandmarkasnoinfo = async (e: any) => {
    e.preventDefault();

    const inputdat = {
      Month: getMonth(month),
      Year: year,
      SubSectorId: subSector,
      UniqueIdentifier: keyword,
      ProjectId: projId,
    };

    const response = await saveCfibProject(inputdat);
    if (response && response.data && response.data.status === 200) {
      toastMessage(MessageType.Success, 'Data submitted successfully');
      const values: IProjectWfDTO = {
        projectId: projId,
        ProjectWfStatustypeId: Cfib_Project_Wf_StatusTypes.MarkedAsInformationNotAvailable,
        ProjectWfActionId: Cfib_Project_Wf_StatusTypes.MarkedAsInformationNotAvailable,
      };
      debugger;
      const res = await projectCfibWfSubmit(values);
      if (res && res.data && res.data.status === 200) {
          if (res.data.data.reportingMgrEmailAvail) {
              toastMessage(MessageType.Success, pwf_submit);
          } else {
              toastMessage(MessageType.Success, "Project Status Changed Successfully Email not sent due to Reporting parter not available");
          }
        navigate(`/cfib/projects`);
      }
    }
  };
  const getProjectWfNextActionsByProject = async () => {
    debugger;
    const wfNextActions = await getProjectCfibWfNextActionsByProjectAPI(projId);

    if (wfNextActions && wfNextActions.data) {
      setViewProps(wfNextActions.data);
    }
  };
  const getProjectByProjId = async () => {
    const projData = await getCfibProByProjId(projId);

    if (projData && projData.data) {
      setMonth(getMonthName(projData.data.month));
      setYear(projData.data.year);
      setSector(projData.data.parentId);
      setKeyword(projData.data.keyword);

      const result = await getTaxonomyData();
      const subsector = result.filter(
        (x) => x.parentId != null && x.categoryId == 6 && x.parentId == projData.data.parentId,
      );
      setSubSectorData(subsector);
      setSubSector(projData.data.subsectorId);
    }
  };
  const handleWfChange = async () => {
    projectWFModel.projectId = projId;
    const res = await projectCfibWfSubmit(projectWFModel);
    if (res && res.data && res.data.status === 200) {
      toastMessage(MessageType.Success, pwf_submit);
      //window.location.reload();
      navigate(`/cfib/projects`);
    } else {
      toastMessage(MessageType.Error, internal_error);
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

  const cfibConfirmNoInfo = () => {
    constrctWfModel(
      Cfib_Project_Wf_StatusTypes.InformationNotAvailableConfirmed,
      Cfib_Project_Wf_Actions.InformationNotAvailableConfirmed,
    );
    setOpenWFPop(true);
  };

  const cfibRejectNoInfo = () => {
    constrctWfModel(
      Cfib_Project_Wf_StatusTypes.InformationNotAvailableRejected,
      Cfib_Project_Wf_Actions.InformationNotAvailableRejected,
    );
    setOpenWFPop(true);
  };
  const cfibViewProjectData = () => {
    //window.open(`/ctm/project/edit/${projId}/cfib`, '_blank');
    navigate(`/ctm/project/edit/${projId}/cfib`);
  };
  const handleUniqueIdentifier = (value: any) => {
    setKeyword(value);
  };

  return (
    <Form onSubmit={(e) => submit(e)}>
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
                    inputProps={{ readOnly: true }}
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
                <FormControl sx={{ m: 0, width: '90%' }}>
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
                    inputProps={{ readOnly: true }}
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
                    inputProps={{ readOnly: true }}
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
                <FormControl sx={{ m: 0, width: '90%' }}>
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
                    inputProps={{ readOnly: true }}
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
                    value={keyword}
                    onChange={(event) => handleUniqueIdentifier(event.target.value)}
                    placeholder="Unique Identifier"
                  ></TextField>
                </FormControl>
              </Grid> */}
            </Grid>
            {viewProps &&
              viewProps.filter(
                (x) => x.projectWfActionId == Cfib_Project_Wf_Actions.InofrmationUploaded,
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
                    onClick={saveanduploadinfo}
                  >
                    Save &#38; Upload CTM Information
                  </Button>
                </Grid>
                
              )}
            {viewProps &&
              viewProps.filter(
                (x) =>
                  x.projectWfActionId == Cfib_Project_Wf_Actions.ProjectCreated ||
                  x.projectWfActionId == Cfib_Project_Wf_Actions.InofrmationUploaded,
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
                    No Information to upload
                  </Button>
                </Grid>
              )}
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
                    onClick={cfibConfirmNoInfo}
                  >
                    Confirm - Information not available
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
                    onClick={cfibRejectNoInfo}
                  >
                    Reject - Information not avaialable
                  </Button>
                </Grid>
              )}
              
              {viewProps &&
              viewProps.filter(
                (x) =>
                  x.projectWfActionId == Cfib_Project_Wf_Actions.ViewProjectData,
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
                    onClick={cfibViewProjectData}
                  >
                    View Uploaded Data
                  </Button>
                </Grid>
              )}
          </CardContent>
          <Dialog
            open={openWFPop}
            onClose={() => {
              setOpenWFPop(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure to do the action?
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
      </PageContainer>
    </Form>
  );
};

export default EditProject;
