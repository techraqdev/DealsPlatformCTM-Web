import React, { FC, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Paper,
  ListItem,
  ListItemText,
  Grid,
  FormControl,
  Select,
  SelectChangeEvent,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Checkbox,
  Autocomplete,
} from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import jq from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive/js/dataTables.responsive';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import { useNavigate } from 'react-router-dom';
import {
  getCfibAllProject,
  deleteProject,
  projectBulkUpload,
  projectWfSubmit,
  projectDetailsUpload,
  projectSupportingFileUpload,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import {
  MessageType,
  Project_Wf_Actions,
  Project_Wf_StatusTypes,
} from '../../../common/enumContainer';
import {
  unauthorized_dw,
  unauthorized,
  internal_error,
  pwc_token,
  pwf_submit,
  uploadExtentions,
  cfib_projectSearchToken,
} from '../../../common/constants/common.constant';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getStorage, setStorage } from '../../../common/helpers/storage.helper';
import { renderDataTable } from '../../../common/helpers/datatables.net.helper';
import {
  getTaxonomyDataByCategories,
  getProjectStatus,
  getTaxonomyData,
} from '../../projects/taxonomyApi';
import {
  taxonomyCategory,
  taxonomyMin,
  projectSearch,
  projectCfibDetail,
  projectStatus,
  taxonomy,
} from '../../projects/taxonomyModels';
import CfibProjectTable from './cfibProjectDataTable';
import { sub } from 'date-fns';
import { MultiSelect, Option } from 'react-multi-select-component';

const CfibProjectList: FC = () => {
  let isValidInput = true;
  const navigate = useNavigate();
  // const getProjectSearchStorage = () => {
  //   const storage = getStorage(cfib_projectSearchToken);
  //   const searchFilterLocal: projectSearch = {
  //     sbu: [],
  //     projectStatusList: [],
  //     projectName: '',
  //     clientName: '',
  //     projectCode: '',
  //   };
  //   const filteredStorage = storage == undefined || storage == null ? searchFilterLocal : storage;
  //   if (
  //     (filteredStorage != null && filteredStorage.projectStatusList == null) ||
  //     filteredStorage.projectStatusList.length == 0
  //   )
  //     filteredStorage.projectStatusList = [
  //       Project_Wf_StatusTypes.NotResponded,
  //       Project_Wf_StatusTypes.Quotable,
  //       Project_Wf_StatusTypes.NotQuotable,
  //       Project_Wf_StatusTypes.Restricted,
  //       Project_Wf_StatusTypes.PartnerApprovalPending,
  //       Project_Wf_StatusTypes.RejectedbyPartner,
  //       Project_Wf_StatusTypes.ClientApprovalPending,
  //       Project_Wf_StatusTypes.RejectedbyClient,
  //       Project_Wf_StatusTypes.ClientSeekingMoreInfo,
  //     ];
  //   return filteredStorage;
  // };

  const getProjectCfibSearchStorage = () => {
    const storage = getStorage(cfib_projectSearchToken);
    const searchFilterLocal: projectCfibDetail = {
      year: 0,
      month: 0,
      sectorId: 0,
      subSectorId: 0,
      projectStatusID: 0,
    };
    const filteredStorage = storage == undefined || storage == null ? searchFilterLocal : storage;
    if (
      (filteredStorage != null && filteredStorage.projectStatusID == null) ||
      filteredStorage.projectStatusID.length == 0
    )
      filteredStorage.projectStatusID = [
        Project_Wf_StatusTypes.NotResponded,
        Project_Wf_StatusTypes.Quotable,
        Project_Wf_StatusTypes.NotQuotable,
        Project_Wf_StatusTypes.Restricted,
        Project_Wf_StatusTypes.PartnerApprovalPending,
        Project_Wf_StatusTypes.RejectedbyPartner,
        Project_Wf_StatusTypes.ClientApprovalPending,
        Project_Wf_StatusTypes.RejectedbyClient,
        Project_Wf_StatusTypes.ClientSeekingMoreInfo,
      ];
    return filteredStorage;
  };

  //const searchFilter: projectSearch = getProjectSearchStorage();
  const searchFilter1: projectCfibDetail = getProjectCfibSearchStorage();

  const [taxonomyData, setTaxonomyData] = React.useState<taxonomy[]>([]);
  const [sectorData, setSectorData] = React.useState<Option[]>([]);
  const [sector, setSector] = React.useState('');
  const [sectorText, setSectorText] = React.useState('');
  const [subSector, setSubSector] = React.useState('');
  const [subSectorText, setSubSectorText] = React.useState('');
  const [subSecData, setSubSecData] = React.useState<Option[]>([]);
  const [subSecDataParamText, setSubSecDataParamText] = React.useState([]);
  const [subSecDataParam, setSubSecDataParam] = React.useState(0);
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [years, setYears] = React.useState<string[]>([]);
  const [projectS, setProjectS] = React.useState(0);
  const [openFileUpload, setFileUpload] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);
  const [file, setUploadedFile] = useState('');
  const [statusData, setStatusData] = React.useState<Option[]>([]);
  const [status, setStatus] = React.useState('');
  const [statusText, setStatusText] = React.useState('');

  const [searchParams, setSearchParams] = React.useState(searchFilter1);
  const tableId = '#cfib_project_List';
  const handleFileUploadClose = () => {
    setFailedEmails([]);
    setFileUpload(false);
  };
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

  const handleMonthType = (event, target) => {
    setMonth(target);
  };
  const handleYearType = (event, target) => {
    setYear(target);
  };
  const handleSector = (event, target) => {
    debugger;
    setSector(target.value);
    setSectorText(target.label);
    setSubSector('');
    setSubSectorText('');
    bindSectorData(target.value);
  };
  const bindSectorData = (value: any) => {
    setSubSecData(getTaxonomyBasedOnValues(taxonomyCategory.SubSector, value));
  };
  const handleSubSector = (event, target) => {
    setSubSector(target.value);
    setSubSectorText(target.label);
  };
  const handleStatus = (event, target) => {
    setStatus(target.value);
    setStatusText(target.label);
  };
  const handleProjectStatus = (event) => {
    setProjectS(event.target.value);
  };
  const getTaxonomyBasedOnValues = (categoryId: any, selectedValues: any) => {
    const filteredValues = taxonomyData
      .filter((data) => data.categoryId === categoryId && data.parentId == selectedValues)
      .map((taxonomy) => ({
        value: taxonomy.taxonomyUUID,
        label: `${taxonomy.parentName} | ${taxonomy.name}`,
      }));
    return filteredValues;
  };

  const handleSearch = (event: any) => {
    if (event.key === 'Enter') {
      searchDbCred();
    }
  };
  const searchDbCred = () => {
    searchFilter1.resetGrid = false;
    setSearchItems();
    setSearchParams(searchFilter1);
  };

  const updateSearchParams = () => {
    searchFilter1.month =
      searchFilter1.resetGrid == true ? 0 : month === '' ? 0 : Number(getMonth(month));
    searchFilter1.year = searchFilter1.resetGrid == true ? 0 : year === '' ? 0 : Number(year);
    searchFilter1.sectorId =
      searchFilter1.resetGrid == true ? 0 : sector === '' ? 0 : Number(sector);
    searchFilter1.subSectorId =
      searchFilter1.resetGrid == true ? 0 : subSector === '' ? 0 : Number(subSector);
    searchFilter1.projectStatusID =
      searchFilter1.resetGrid == true ? 0 : status === '' ? 0 : Number(status);
  };

  const getData = (stringObject) => {
    if (stringObject != null && stringObject.length > 0) {
      return stringObject;
    } else return null;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('body', file);
      const response = await projectBulkUpload(formData);

      if (response && response.data.status === 200) {
        toastMessage(MessageType.Success, 'Projects Uploaded Successfully');
        setFileUpload(false);
        jq(tableId).DataTable().ajax.reload();
      } else {
        toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
      }
    } else {
      toastMessage(MessageType.Warning, 'Please upload  file');
    }
  };

  const setFile = (e: any) => {
    //@ts-ignore
    if (e.target.files[0]) {
      const extension = e.target.files[0].name.split('.').pop();
      if (!uploadExtentions.includes(extension)) {
        toastMessage(MessageType.Error, 'Please upload valid file ..');
        return;
      }

      setUploadedFile(e.target.files[0]);
    }
  };

  const BCrumb = [
    {
      to: '/cfib/projects',
      title: 'CFIB',
    },
    {
      title: 'Projects',
    },
  ];

  const getTaxonomyResult = async () => {
    const result = await getTaxonomyData();
    if (result) {
      setTaxonomyData(result);
      setSectorData(
        result
          .filter((data) => data.categoryId === taxonomyCategory.Sector)
          .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.displayName })),
      );
      setSubSecData(
        result
          .filter((data) => data.categoryId === taxonomyCategory.SubSector)
          .map((taxonomy) => ({
            value: taxonomy.taxonomyUUID,
            label: `${taxonomy.parentName} | ${taxonomy.name}`,
          })),
      );
    }
  };

  const getProjectStatusList = async () => {
    const result = await getProjectStatus(3);
    if (result) {
      setStatusData(
        result.map((status) => ({
          value: status.statusId,
          label: status.name,
        })),
      );
    }
  };
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = ['2015'];
    let startYear = 2016;
    while (startYear <= currentYear) {
      const year = startYear++;
      years.push(year.toString());
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

  useEffect(() => {
    getTaxonomyResult();
    getProjectStatusList();
    getYears();
  }, []);

  const handelKeyPress = (e: any) => {
    const code = e.keyCode || e.which;

    //59; 39 ' 34 " 45 - 40 ( 41 ) 35 #  Sql inject Characted not allowed
    if (
      code == 34 ||
      code == 35 ||
      code == 39 ||
      code == 40 ||
      code == 41 ||
      code == 45 ||
      code == 59
    ) {
      isValidInput = false;
      return false;
    }
    isValidInput = true;
    return true;
  };

  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);

  const [projectStatusData, setProjectStatusData] = React.useState<projectStatus[]>([]);

  const clearSearch = () => {
    setMonth('');
    setYear('');
    setSector('');
    setSectorText('');
    setSubSector('');
    setSubSectorText('');
    setStatus('');
    setStatusText('');
    setProjectS(0);
    searchFilter1.resetGrid = true;
    setSearchItems();
    setSearchParams(searchFilter1);
    setSubSecData(
      taxonomyData
        .filter((data) => data.categoryId === taxonomyCategory.SubSector)
        .map((taxonomy) => ({
          value: taxonomy.taxonomyUUID,
          label: `${taxonomy.parentName} | ${taxonomy.name}`,
        })),
    );
  };

  const setSearchItems = () => {
    updateSearchParams();
    setSearchParams(searchFilter1);
  };
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
  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
        <div style={{ width: '55%', textAlign: 'right' }}>
          <Button
            color="secondary"
            variant="contained"
            style={{ margin: '5px' }}
            onClick={() => {
              navigate('/cfib/project/add');
            }}
            className="buttons-bg"
          >
            Add Project
          </Button>
        </div>
      </div>
      <Card className="project-list">
        <CardContent>
          <div>
            <div
              style={{ marginBottom: '5px' }}
              onKeyDown={(event: any) => {
                handleSearch(event);
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: '90%' }}>
                    <Autocomplete
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={monthNames}
                      value={month}
                      onChange={handleMonthType}
                      renderInput={(params) => <TextField {...params} label="Month" size="small" />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: '90%' }}>
                    <Autocomplete
                      id="combo-box-demo"
                      disablePortal
                      disableClearable
                      options={years}
                      value={year}
                      onChange={handleYearType}
                      renderInput={(params) => <TextField {...params} label="Years" size="small" />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: '90%' }}>
                    <Autocomplete
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={sectorData}
                      value={
                        sectorText === ''
                          ? { label: '', value: '' }
                          : { label: sectorText, value: sector }
                      }
                      onChange={handleSector}
                      renderInput={(params) => (
                        <TextField {...params} label="Sector" size="small" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: '90%' }}>
                    <Autocomplete
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={subSecData}
                      value={
                        subSectorText === ''
                          ? { label: '', value: '' }
                          : { label: subSectorText, value: subSector }
                      }
                      onChange={handleSubSector}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub sector" size="small" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: '90%' }}>
                    <Autocomplete
                      disablePortal
                      disableClearable
                      id="combo-box-demo"
                      options={statusData}
                      value={
                        statusText === ''
                          ? { label: '', value: '' }
                          : { label: statusText, value: status }
                      }
                      onChange={handleStatus}
                      renderInput={(params) => (
                        <TextField {...params} label="Project Status" size="small" />
                      )}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} md={2} xl={2} style={{ display: 'none' }}>
                  <FormControl sx={{ m: 1, width: '90%' }}>
                    <InputLabel id="sbu-select-label" className="dbdropdown">
                      Project Status
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      value={projectS}
                      onChange={handleProjectStatus}
                      input={<OutlinedInput label="Project Status" className="dbdropdown" />}
                      className="multi-select-dropdown"
                      //error={formik.touched.sector && Boolean(formik.errors.sector)}
                    >
                      {taxonomyData
                        .filter((x) => x.categoryId == taxonomyCategory.TransactionStatus)
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
                </Grid> */}
                <Grid item xs={12} md={1} xl={1}>
                  <Button
                    // id="btnSearch"
                    color="secondary"
                    variant="contained"
                    className="buttons-bg"
                    style={{ marginBottom: '5px', width: '100%' }}
                    onClick={searchDbCred}
                  >
                    Search
                  </Button>
                </Grid>
                <Grid item xs={12} md={1} xl={1}>
                  <Button
                    id="btnClear"
                    color="secondary"
                    variant="contained"
                    style={{ marginBottom: '5px', width: '100%' }}
                    className="reset-buttons-bg"
                    onClick={clearSearch}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </div>
            <CfibProjectTable searchParam={searchParams}></CfibProjectTable>
            <Dialog
              open={openFileUpload}
              onClose={handleFileUploadClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form onSubmit={(e) => submit(e)}>
                <DialogTitle>{'Bulk Projects Upload'}</DialogTitle>
                <DialogContent>
                  <input type="file" onChange={(e) => setFile(e)} />

                  <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                    {failedEmails.map((email: any) => {
                      return (
                        <ListItem key={email.reason}>
                          <ListItemText primary={email.email + ' - ' + email.reason} />
                        </ListItem>
                      );
                    })}
                  </Paper>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="reset-buttons-bg"
                    onClick={handleFileUploadClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    type="submit"
                    className="buttons-bg"
                    autoFocus
                  >
                    Upload
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default CfibProjectList;
