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
import jq from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive/js/dataTables.responsive';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import { useNavigate } from 'react-router-dom';
import { projectBulkUpload, projectBulkUpload1, projectClientBulkUpload, exportDbProjectsCredsExcel,
  projectsBulkUploadEngagements,projectsBulkUploadEngagementsError } from './projectApi';
import { toastMessage } from '../../common/toastMessage';
import { MessageType, Project_Wf_StatusTypes } from '../../common/enumContainer';
import { uploadExtentions, projectSearchToken, pwc_isAdmin } from '../../common/constants/common.constant';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getStorage, setStorage } from '../../common/helpers/storage.helper';
import { getTaxonomyDataByCategories, getProjectStatus } from './taxonomyApi';
import {
  taxonomyCategory,
  taxonomyMin,
  projectSearch,
  projectStatus,
  drpCheckAllItems,
} from './taxonomyModels';
import DbProjectTable from './projectListDataTable';

const ProjectList: FC = () => {
  let isValidInput = true;

  const defaultProjList = [
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

  const navigate = useNavigate();
  const getProjectSearchStorage = () => {
    const storage = getStorage(projectSearchToken);
    const searchFilterLocal: projectSearch = {
      sbu: [],
      projectStatusList: [],
      projectName: '',
      clientName: '',
      projectCode: '',
      isNavigationFromOtherPage: false,
    };
    const filteredStorage = storage == undefined || storage == null ? searchFilterLocal : storage;
    if (
      (filteredStorage != null && filteredStorage.projectStatusList == null) ||
      filteredStorage.projectStatusList.length == 0
    )
      filteredStorage.projectStatusList = defaultProjList;
    return filteredStorage;
  };

  const searchFilter: projectSearch = getProjectSearchStorage();

  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [projectC, setProjectC] = useState(searchFilter.projectCode ?? '');
  const [clientN, setClientN] = useState(searchFilter.clientName ?? '');
  const [projectN, setProjectN] = useState(searchFilter.projectName ?? '');
  const [openFileUpload, setFileUpload] = useState(false);
  const [openClientFileUpload, setOpenClientFileUpload] = useState(false);
  const [openClientProjectsFileUpload, setOpenClientProjectsFileUpload] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);
  const [file, setUploadedFile] = useState('');
  const [status, setStatus] = React.useState<number[]>(searchFilter.projectStatusList ?? []);
  const [sbuDataParam, setSbu] = React.useState<string[]>(searchFilter.sbu ?? []);

  const [searchParams, setSearchParams] = React.useState(searchFilter);
  const tableId = '#project_List';

  let skipSBUNormalFlow = false;
  let skipStatusNormalFlow = false;
  const [drpSBUCheckAll, setSBUDrpCheckAll] = useState(false);
  const [drpStatusCheckAll, setStatusDrpCheckAll] = useState(false);

  const handleFileUploadClose = () => {
    setFailedEmails([]);
    setFileUpload(false);
  };
  const handleFileUploadOpen = () => {
    setFileUpload(true);
  };
  const handleClientFileUploadClose = () => {
    setFailedEmails([]);
    setOpenClientFileUpload(false);
    setUploadedFile('');
  };
  const handleClientFileUploadOpen = () => {
    setOpenClientFileUpload(true);
    setUploadedFile('');
  };
  const handleClientProjectsFileUploadOpen = () => {
    setOpenClientProjectsFileUpload(true);
    setUploadedFile('');
  };
  const handleClientProjectsFileUploadClose = () => {    
    setOpenClientProjectsFileUpload(false);
    setUploadedFile('');
  };

  const updateSearchParams = () => {
    searchFilter.projectCode = searchFilter.resetGrid == true ? '' : projectC;
    searchFilter.projectName = searchFilter.resetGrid == true ? '' : projectN;
    searchFilter.clientName = searchFilter.resetGrid == true ? '' : clientN;
    searchFilter.sbu = searchFilter.resetGrid == true ? [] : getData(sbuDataParam);
    searchFilter.projectStatusList =
      searchFilter.resetGrid == true ? defaultProjList : getData(status);
  };

  const getData = (stringObject) => {
    if (stringObject != null && stringObject.length > 0) {
      return stringObject;
    } else return null;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    debugger;
    // let boolCheck = false;
    try{
      if (file) {
        const formData = new FormData();
        formData.append('body', file);
        const response = await projectBulkUpload(formData);

        if (response && response.data.status === 200) {
          debugger;
          if(response.data.data.uploadSucess === true)
            toastMessage(MessageType.Success, 'Projects Uploaded Successfully');
          else {
            if(response.data.data.projectsError != true)
            {
            await projectBulkUpload1(formData);            
            }
            toastMessage(MessageType.Warning, response.data.data.projectsHeaderErrorMsg);
          }
          setFileUpload(false);
          jq(tableId).DataTable().ajax.reload();
        } else {
          //toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
        }
      } else {
        toastMessage(MessageType.Warning, 'Please upload file');
      }
    }
  catch(error)
  {
    debugger;
      console.log(error);
      //toastMessage(MessageType.Error, 'Please check the data and upload again');
      //if(error == 400){
      // if (file) {
      //   const formData = new FormData();
      //   formData.append('body', file);
      //   projectBulkUpload1(formData);
      // } else {
      //   toastMessage(MessageType.Warning, 'Please upload file');
      // }
    //}
    }
  };

  const submitClient = async (e: any) => {
    e.preventDefault();
    if (file) {
      let errorMsg = '';
      const formData = new FormData();
      formData.append('body', file);
      const response = await projectClientBulkUpload(formData);
      debugger;
      if (response && response.data.status === 200) {
        if (response.data.data.projectCredApproved != "")
          errorMsg = 'Below Engagement Codes are already updated ' + response.data.data.projectCredApproved;
        //toastMessage(MessageType.Success, 'Below Project Codes are already updated ' + response.data.data.projectCredApproved);

        if (response.data.data.notInCredClientApprovalPending != "")
          errorMsg = errorMsg + 'Below Engagement Codes are not in client approval status ' + response.data.data.notInCredClientApprovalPending;

        if (!response.data.data.isHeaderInvalid) {
          if (response.data.data.projectCode != "")
            toastMessage(MessageType.Success, 'Client responses for provided projects uploaded successfully');
          // toastMessage(MessageType.Warning, 'Below Project Codes are not in client approval status ' + response.data.data.notInCredClientApprovalPending);
          if (response.data.data.projectCredApproved != "" || response.data.data.notInCredClientApprovalPending != "")
            toastMessage(MessageType.Warning, errorMsg);
          setOpenClientFileUpload(false);
          jq(tableId).DataTable().ajax.reload();
        }
        else {
          if (response.data.data.inValidData == "" || response.data.data.inValidData == null)
            toastMessage(MessageType.Warning, 'Excel which you are trying to upload is incorrect. Please check and upload file ');

          else
            toastMessage(MessageType.Warning, response.data.data.inValidData + errorMsg);
        }
      }
      else {
        toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
      }
    } else {
      toastMessage(MessageType.Warning, 'Please upload  file');
    }
  };

  // const submitProjects = async (e: any) => {
  //   e.preventDefault();
  //   debugger;
  //   // let boolCheck = false;
  //   try{
  //     if (file) {
  //       const formData = new FormData();
  //       formData.append('body', file);
  //       const response = await projectsBulkUploadEngagements(formData);

  //       if (response && response.data.status === 200) {
  //         toastMessage(MessageType.Success, 'Projects Uploaded Successfully');
  //         setFileUpload(false);
  //         jq(tableId).DataTable().ajax.reload();
  //       } else {
  //         //toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
  //       }
  //     } else {
  //       toastMessage(MessageType.Warning, 'Please upload file');
  //     }
  //   }
  // catch(error)
  // {
  //   debugger;
  //     console.log(error);
  //     //toastMessage(MessageType.Error, 'Please check the data and upload again');
  //     //if(error == 400){
  //     if (file) {
  //       const formData = new FormData();
  //       formData.append('body', file);
  //       await projectsBulkUploadEngagementsError(formData);
  //     } else {
  //       toastMessage(MessageType.Warning, 'Please upload file');
  //     }
  //   //}
  //   }
  // };

  const submitProjects = async (e: any) => {
    e.preventDefault();
    debugger;
    // let boolCheck = false;
    try{
      if (file) {
        const formData = new FormData();
        formData.append('body', file);
        const response = await projectsBulkUploadEngagements(formData);

        if (response && response.data.status === 200) {
          debugger;
          if(response.data.data.uploadSucess === true)
            toastMessage(MessageType.Success, 'Projects Uploaded Successfully');
          else {
            if(response.data.data.projectsError != true)
            {
            await projectsBulkUploadEngagementsError(formData);            
            }
            toastMessage(MessageType.Warning, response.data.data.projectsHeaderErrorMsg);
          }
          setOpenClientProjectsFileUpload(false);
          jq(tableId).DataTable().ajax.reload();
        } else {
          //toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
        }
      } else {
        toastMessage(MessageType.Warning, 'Please upload file');
      }
    }
  catch(error)
  {
    debugger;
      console.log(error);
      //toastMessage(MessageType.Error, 'Please check the data and upload again');
      //if(error == 400){
      // if (file) {
      //   const formData = new FormData();
      //   formData.append('body', file);
      //   projectBulkUpload1(formData);
      // } else {
      //   toastMessage(MessageType.Warning, 'Please upload file');
      // }
    //}
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
      to: '/db/projects',
      title: 'Open Tasks',
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
    if (searchFilter && searchFilter.isNavigationFromOtherPage) {
      const dt = jq(tableId).DataTable();
      dt.ajax.reload();
    }
    getTaxonomyResult();
    getProjectStatusList();    
  }, []);

  const handleProjectC = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setProjectC(e.target.value);
  };

  const handelKeyPress = (e: any) => {
    debugger;
    const code = e.keyCode || e.which;

    //59; 39 ' 34 " 45 - 40 ( 41 ) 35 #  Sql inject Characted not allowed
    if (
      code == 34 ||
      code == 35 ||
      code == 39 ||
      code == 40 ||
      code == 41 ||
      code == 45 ||
      code == 59 ||
      code == 189
    ) {
      isValidInput = false;
      return false;
    }
    isValidInput = true;
    return true;
  };

  const handleClientN = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setClientN(e.target.value);
  };

  const handleProjectN = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setProjectN(e.target.value);
  };

  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);

  const handleChangeSbu = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipSBUNormalFlow === false) {
      setSbu(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpSBUCheckAll === true) {
        setSbu([]);
      } else {
        const compUUIDs: string[] = [];
        taxynomyData.forEach((item: any) => {
          compUUIDs.push(item.id);
        });
        setSbu(compUUIDs);
      }
    }
    skipSBUNormalFlow = true;
  };

  const [projectStatusData, setProjectStatusData] = React.useState<projectStatus[]>([]);

  const handleChangeSTatus = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipStatusNormalFlow === false) {
      setStatus(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpStatusCheckAll === true) {
        setStatus([]);
      } else {
        const compUUIDs: number[] = [];
        projectStatusData.forEach((item: any) => {
          compUUIDs.push(item.statusId);
        });
        setStatus(compUUIDs);
      }
    }
    skipStatusNormalFlow = true;
  };

  const handleSearch = (event: any) => {
    if (event.key === 'Enter') {
      searchProject();
    }
  };

  const searchProject = () => {
    searchFilter.resetGrid = false;
    setSearchItems();
    setProjectSearchStorage();
    setSearchParams(searchFilter);
  };

  const setProjectSearchStorage = () => {
    setStorage(projectSearchToken, searchFilter);
  };

  const clearSearch = () => {
    setProjectC('');
    setProjectN('');
    setClientN('');
    setSbu([]);
    setStatus(defaultProjList);
    searchFilter.resetGrid = true;
    searchFilter.isNavigationFromOtherPage = false;

    setSearchItems();
    setProjectSearchStorage();
    setSearchParams(searchFilter);
    setSBUDrpCheckAll(false);
    setStatusDrpCheckAll(false);
    setUploadedFile('');
  };

  const setSearchItems = () => {
    updateSearchParams();
    setSearchParams(searchFilter);
  };

  const [sectorDataParam, setSectorDataParam] = React.useState<string[]>([]);
  const handleChangeSector = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    setSectorDataParam(typeof value === 'string' ? value.split(',') : value);
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

  const handleDrpCheckAll = (checkedVal: boolean, drpType: number) => {
    if (drpCheckAllItems.SBU === drpType) {
      skipSBUNormalFlow = true;
      if (checkedVal === true) {
        setSBUDrpCheckAll(false);
      } else {
        setSBUDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.Status === drpType) {
      skipStatusNormalFlow = true;
      if (checkedVal === true) {
        setStatusDrpCheckAll(false);
      } else {
        setStatusDrpCheckAll(true);
      }
    }
  };

  const onMenuOpen = () => {
    setTimeout(() => {
      try {
        const selectedEl = document.getElementsByClassName("MuiMenu-list")[0].parentNode as Element;
        if (selectedEl) {
          selectedEl.scrollTo(0, 0);
        }
      } catch (error) {
        console.log("error");
      }
    }, 15);
  };

  const downloadProjectsCreds = async () => {
    searchFilter.resetGrid = false;
    updateSearchParams();
    setProjectSearchStorage();
    await exportDbProjectsCredsExcel(searchFilter); 
    setSearchParams(searchFilter);
  };

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
        <div style={{ width: '95%', textAlign: 'right' }}>
          {isAdmin && (
            <Button
              color="secondary"
              variant="contained"
              style={{ margin: '5px' }}
              onClick={() => {
                handleClientProjectsFileUploadOpen();
              }}
              className="buttons-bg"
            >
              Upload Credentials
            </Button>)}
          <Button
            color="secondary"
            variant="contained"
            style={{ margin: '5px' }}
            onClick={() => {
              handleClientFileUploadOpen();
            }}
            className="buttons-bg"
          >
            Upload Client Response
          </Button>
          {isAdmin && (
            <Button
              color="secondary"
              variant="contained"
              style={{ margin: '5px' }}
              onClick={() => {
                navigate('/db/project/add');
              }}
              className="buttons-bg"
            >
              Add Project
            </Button>)}
          {isAdmin && (
            <Button
              id="btnUAdd"
              color="secondary"
              variant="contained"
              style={{ margin: '5px' }}
              className="buttons-bg"
              onClick={() => {
                handleFileUploadOpen();
              }}
            >
              Upload Project
            </Button>)}

        </div>
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
                  // onKeyDown={handelKeyPress}
                  // onKeyPress={handelKeyPress}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={projectN}
                    name="projectN"
                    // onKeyPress={handelKeyPress}
                    // onKeyDown={handelKeyPress}
                    onChange={handleProjectN}
                    id="txtProjectN"
                    placeholder="Project Name"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={clientN}
                    name="clientN"
                    // onKeyPress={handelKeyPress}
                    // onKeyDown={handelKeyPress}
                    onChange={handleClientN}
                    id="txtClientN"
                    placeholder="Client Name"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    <InputLabel>SBU</InputLabel>
                    <Select
                      multiple
                      value={sbuDataParam}
                      onOpen={onMenuOpen}
                      onChange={handleChangeSbu}
                      input={<OutlinedInput label="SBU" />}
                      renderValue={(selected) =>
                        taxynomyData
                          .filter((name) => selected.toString().includes(name.id.toString()))
                          .map((record) => record.name)
                          .join(', ')
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem key="drp123" value="drp123">
                        <Checkbox
                          checked={drpSBUCheckAll}
                          onClick={() => {
                            handleDrpCheckAll(drpSBUCheckAll, drpCheckAllItems.SBU);
                          }}
                        />
                        <i>
                          <ListItemText
                            primary={drpSBUCheckAll === true ? 'Un Check All' : 'Check All'}
                            onClick={() => {
                              handleDrpCheckAll(drpSBUCheckAll, drpCheckAllItems.SBU);
                            }}
                          />
                        </i>
                      </MenuItem>
                      {taxynomyData.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          <Checkbox
                            id={item.id.toString()}
                            checked={sbuDataParam.toString().indexOf(item.id.toString()) > -1}
                          />
                          <ListItemText primary={`${item.name}`} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    <InputLabel>Status</InputLabel>
                    <Select
                      multiple
                      value={status}
                      onOpen={onMenuOpen}
                      onChange={handleChangeSTatus}
                      input={<OutlinedInput label="Status" />}
                      renderValue={(selected) =>
                        projectStatusData
                          .filter((name) => selected.indexOf(name.statusId) >= 0)
                          .map((record) => record.name)
                          .join(', ')
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem key="drp123" value="drp123" tabIndex={1}>
                        <Checkbox
                          checked={drpStatusCheckAll}
                          onClick={() => {
                            handleDrpCheckAll(drpStatusCheckAll, drpCheckAllItems.Status);
                          }}
                        />
                        <i>
                          <ListItemText tabIndex={0}
                            primary={drpStatusCheckAll === true ? 'Un Check All' : 'Check All'}
                            onClick={() => {
                              handleDrpCheckAll(drpStatusCheckAll, drpCheckAllItems.Status);
                            }}
                          />
                        </i>
                      </MenuItem>
                      {projectStatusData.map((item) => (
                        <MenuItem key={item.statusId} value={item.statusId} tabIndex={0}>
                          <Checkbox checked={status.indexOf(item.statusId) >= 0} />
                          <ListItemText primary={`${item.name}`} />
                        </MenuItem>
                      ))}
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
                onClick={downloadProjectsCreds}
              >
                Export to Excel
              </Button>
            </div>
            <DbProjectTable searchParam={searchParams}></DbProjectTable>
            <Dialog
              open={openFileUpload}
              onClose={handleFileUploadClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form onSubmit={(e) => submit(e)}>
                <DialogTitle>{'Bulk Projects Upload'}</DialogTitle>
                <DialogContent>
                  <input type="file" onChange={(e) => setFile(e)} onClick={(e) => { e.currentTarget.value = ''; }} />

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
            <Dialog
              open={openClientFileUpload}
              onClose={handleClientFileUploadClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form onSubmit={(e) => submitClient(e)}>
                <DialogTitle>{'Bulk Client Response Projects Upload'}</DialogTitle>
                <DialogContent>
                  <input type="file" onChange={(e) => setFile(e)} onClick={(e) => { e.currentTarget.value = ''; }} />

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
                    onClick={handleClientFileUploadClose}
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
            <Dialog
              open={openClientProjectsFileUpload}
              onClose={handleClientProjectsFileUploadClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form onSubmit={(e) => submitProjects(e)}>
                <DialogTitle>
                  {'Bulk Upload Credentials     '}
                  <a
                    // className="buttons-bg"
                    href={process.env.PUBLIC_URL + '/Upload_Approved_Credentials.xlsx'}
                    download={'Upload Credentials.xlsx'}
                  >
                    Download Template
                  </a>
                </DialogTitle>
                <DialogContent>
                  <input type="file" onChange={(e) => setFile(e)} onClick={(e) => { e.currentTarget.value = ''; }} />
                  
                </DialogContent>
                <DialogActions>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="reset-buttons-bg"
                    onClick={handleClientProjectsFileUploadClose}
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
export default ProjectList;
