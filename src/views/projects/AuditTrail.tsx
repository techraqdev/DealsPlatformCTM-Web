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
  Paper,
  ListItem,
  ListItemText,
  Grid,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Checkbox,
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import jq from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive/js/dataTables.responsive';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import { useNavigate } from 'react-router-dom';
import { exportAuditLogsExcel } from './projectApi';
import { toastMessage } from '../../common/toastMessage';
import { MessageType, Project_Wf_StatusTypes } from '../../common/enumContainer';
import { uploadExtentions, projectSearchToken, pwc_isAdmin } from '../../common/constants/common.constant';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getStorage, setStorage } from '../../common/helpers/storage.helper';
import { getTaxonomyDataByCategories, getProjectStatus } from './taxonomyApi';
import {
  taxonomyCategory,
  taxonomyMin,
  auditSearch,
  projectStatus,
  drpCheckAllItems,
} from './taxonomyModels';
import AuditTrailDataTable from './AuditTrailDataTable';

const AuditTrail: FC = () => {
  const isValidInput = true;


  //const getProjectSearchStorage = () => {
  //const storage = getStorage(projectSearchToken);
  //   const searchFilterLocal: auditSearch = {
  //     sbu: [],
  //     projectStatusList: [],
  //     projectName: '',

  //   };
  //   const filteredStorage = storage == undefined || storage == null ? searchFilterLocal : storage;
  //   if (
  //     (filteredStorage != null && filteredStorage.projectStatusList == null) ||
  //     filteredStorage.projectStatusList.length == 0
  //   )
  //     filteredStorage.projectStatusList = defaultProjList;
  //   return filteredStorage;
  // };

  const searchFilter: auditSearch = {
    projectCode: '',
    projectName: '',
    userName: '',
    resetGrid: false,
    dateFrom: null,
    dateTo: null,
  };

  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [projectC, setProjectC] = useState(searchFilter.projectCode ?? '');
  const [projectN, setProjectN] = useState(searchFilter.projectName ?? '');
  const [userN, setUserN] = useState(searchFilter.userName ?? '');
  const [srcTable, setSrcTable] = useState(searchFilter.srcTable ?? '');

  const [searchParams, setSearchParams] = React.useState(searchFilter);
  const tableId = '#audit_List';

  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);

  const updateSearchParams = () => {
    searchFilter.projectCode = searchFilter.resetGrid == true ? '' : projectC;
    searchFilter.projectName = searchFilter.resetGrid == true ? '' : projectN;
    searchFilter.userName = searchFilter.resetGrid == true ? '' : userN;
    searchFilter.dateFrom = searchFilter.resetGrid == true ? null : fromDate;
    searchFilter.dateTo = searchFilter.resetGrid == true ? null : toDate;
    searchFilter.srcTable = searchFilter.resetGrid == true ? '' : srcTable;
  };

  const BCrumb = [
    {
      to: '/db/projects',
      title: 'Audit Logs',
    },
    {
      title: 'Projects',
    },
  ];

  const getTaxonomyResult = async () => {
    const result = await getTaxonomyDataByCategories([taxonomyCategory.SBU]);
    if (result) {
      setTaxynomyDataData(result);
    }
  };
  const getProjectStatusList = async () => {
    const result = await getProjectStatus(1);
    if (result) {
      setProjectStatusData(result);
    }
  };

  useEffect(() => {
    // if (searchFilter && searchFilter.isNavigationFromOtherPage) {
    //   const dt = jq(tableId).DataTable();
    //   dt.ajax.reload();
    // }
    getTaxonomyResult();
    getProjectStatusList();
  }, []);



  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);

  const [projectStatusData, setProjectStatusData] = React.useState<projectStatus[]>([]);

  const handleSearch = (event: any) => {
    if (event.key === 'Enter') {
      searchProject();
    }
  };

  const searchProject = () => {
    searchFilter.resetGrid = false;
    setSearchItems();
    setSearchParams(searchFilter);
  };

  const clearSearch = () => {
    setFromDate(null);
    setToDate(null);
    setProjectC('');
    setProjectN('');
    setUserN('');
    setSrcTable('');
    searchFilter.resetGrid = true;
    setSearchItems();
    setSearchParams(searchFilter);
  };

  const setSearchItems = () => {
    updateSearchParams();
    setSearchParams(searchFilter);
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

  const handleProjectC = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setProjectC(e.target.value);
  };

  const handleProjectN = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setProjectN(e.target.value);
  };

  const handleUserN = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setUserN(e.target.value);
  };  

  const handleSrcTableN = (event) => {
    if (isValidInput) setSrcTable(event.target.value);
  };

  const downloadAuditLogs = async () => {
    searchFilter.resetGrid = false;
    updateSearchParams();
    await exportAuditLogsExcel(searchFilter);
    setSearchParams(searchFilter);
  };

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
      </div>
      <Card className="project-list">
        <CardContent>
          <div>
            <div
              className="row"
              style={{ marginBottom: '6px' }}
              onKeyDown={(event: any) => {
                handleSearch(event);
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={projectC}
                    name="projectC"
                    onChange={handleProjectC}
                    id="txtProjectC"
                    placeholder="Project Code"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={projectN}
                    name="projectN"
                    onChange={handleProjectN}
                    id="txtProjectN"
                    placeholder="Project Name"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={userN}
                    name="userName"
                    onChange={handleUserN}
                    id="txtUserName"
                    placeholder="User Email"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      inputFormat="yyyy-MM-dd"
                      onChange={(newValue) => {
                        setFromDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} id="txtFromDate" />}
                      maxDate={toDate}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="To Date"
                      inputFormat="yyyy-MM-dd"
                      value={toDate}
                      onChange={(newValue) => {
                        setToDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} id="txtToDate" />}
                      minDate={fromDate}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    <InputLabel>Source Table</InputLabel>
                    <Select
                      value={srcTable}
                      onChange={handleSrcTableN}
                      input={<OutlinedInput label="Source Table" />}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={'projects'}>Projects</MenuItem>
                      <MenuItem value={'input form'}>Input Form</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                // id="btnSearch"
                color="secondary"
                variant="contained"
                className="buttons-bg"
                style={{ margin: '5px' }}
                onClick={searchProject}
              >
                Search
              </Button>
              <Button
                // id="btnClear"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="reset-buttons-bg"
                onClick={clearSearch}
              >
                Clear
              </Button>
              <Button
                // id="btnClear"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={downloadAuditLogs}
              >
                Export to Excel
              </Button>
            </div>
            <AuditTrailDataTable searchParam={searchParams}></AuditTrailDataTable>

          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default AuditTrail;
