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
  InputLabel,
  OutlinedInput,
  MenuItem,
  Checkbox,
} from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import jq from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive/js/dataTables.responsive';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import { useNavigate } from 'react-router-dom';
import {
  getAllProject,
  deleteProject,
  projectBulkUpload,
  projectWfSubmit,
  projectDetailsUpload,
  projectSupportingFileUpload,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import {
  Ctm_Project_Wf_StatusTypes,
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
  ctm_projectSearchToken,
} from '../../../common/constants/common.constant';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getStorage, setStorage } from '../../../common/helpers/storage.helper';
import { renderDataTable } from '../../../common/helpers/datatables.net.helper';
import { getTaxonomyDataByCategories, getProjectStatus } from '../../projects/taxonomyApi';
import {
  taxonomyCategory,
  taxonomyMin,
  projectSearch,
  projectStatus,
  drpCheckAllItems,
} from '../../projects/taxonomyModels';
import CtmProjectTable from './ctmProjectDataTable';

const CtmProjectList: FC = () => {
  let isValidInput = true;
  const navigate = useNavigate();
  const getProjectSearchStorage = () => {
   
    const storage = getStorage(ctm_projectSearchToken);
    const searchFilterLocal: projectSearch = {
      sbu: [],
      projectStatusList: [],
      projectName: '',
      clientName: '',
      projectCode: '',
    };
    const filteredStorage = storage == undefined || storage == null ? searchFilterLocal : storage;
    if (
      (filteredStorage != null && filteredStorage.projectStatusList == null) ||
      filteredStorage.projectStatusList.length == 0
    )
      filteredStorage.projectStatusList = defaultProjList;
    return filteredStorage;
  };

  const defaultProjList = [
    Ctm_Project_Wf_StatusTypes.CanbeUsedforCTM,
    Ctm_Project_Wf_StatusTypes.CannotbeUsedforCTM,
    // Ctm_Project_Wf_StatusTypes.Created,
    Ctm_Project_Wf_StatusTypes.EngagementCompleted,
    Ctm_Project_Wf_StatusTypes.EngagementOngoing,
    Ctm_Project_Wf_StatusTypes.NotResponded,
    //Ctm_Project_Wf_StatusTypes.CannotbeusedConfirmed,
    //Ctm_Project_Wf_StatusTypes.InofrmationUploaded,
  ];

  const searchFilter: projectSearch = getProjectSearchStorage();

  const [projectC, setProjectC] = useState(searchFilter.projectCode ?? '');
  const [clientN, setClientN] = useState(searchFilter.clientName ?? '');
  const [projectN, setProjectN] = useState(searchFilter.projectName ?? '');
  const [openFileUpload, setFileUpload] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);
  const [file, setUploadedFile] = useState('');

  const [status, setStatus] = React.useState<number[]>(searchFilter.projectStatusList ?? []);
  const [sbuDataParam, setSbu] = React.useState<string[]>(searchFilter.sbu ?? []);

  const [searchParams, setSearchParams] = React.useState(searchFilter);
  const tableId = '#project_List';
  const handleFileUploadClose = () => {
    setFailedEmails([]);
    setFileUpload(false);
  };

  const handleFileUploadOpen = () => {
    setFileUpload(true);
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
      to: '/ctm/projects',
      title: 'CTM',
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
    const result = await getProjectStatus(2);
    if (result) {
      setProjectStatusData(result);
    }
  };

  useEffect(() => {
    getTaxonomyResult();
    getProjectStatusList();
  }, []);

  const handleProjectC = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setProjectC(e.target.value);
  };

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
    setSbu(typeof value === 'string' ? value.split(',') : value);
  };

  const [projectStatusData, setProjectStatusData] = React.useState<projectStatus[]>([]);
  let skipStatusNormalFlow = false;
  const [drpStatusCheckAll, setStatusDrpCheckAll] = useState(false);
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
    setStorage(ctm_projectSearchToken, searchFilter);
  };

  const clearSearch = () => {
    setProjectC('');
    setProjectN('');
    setClientN('');
    setSbu([]);
    setStatus(defaultProjList);
    searchFilter.resetGrid = true;
    setSearchItems();
    setProjectSearchStorage();
    setSearchParams(searchFilter);
    setStatusDrpCheckAll(false);
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
    if (drpCheckAllItems.Status === drpType) {
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

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
        <div style={{ width: '55%', textAlign: 'right' }}>
          {/* <Button
            color="secondary"
            variant="contained"
            style={{ margin: '5px' }}
            onClick={() => {
              navigate('/db/project/add');
            }}
            className="buttons-bg"
          >
            Add Project
          </Button>
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
          </Button> */}
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
            }}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={projectC}
                    name="projectC"
                    onChange={handleProjectC}
                    id="txtProjectC"
                    placeholder="Project Code"
                    onKeyDown={handelKeyPress}
                    onKeyPress={handelKeyPress}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={projectN}
                    name="projectN"
                    onKeyPress={handelKeyPress}
                    onKeyDown={handelKeyPress}
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
                    onKeyPress={handelKeyPress}
                    onKeyDown={handelKeyPress}
                    onChange={handleClientN}
                    id="txtClientN"
                    placeholder="Client Name"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={3} xl={3} style={{ display: 'none' }}>
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
                          .filter((name) => selected.toString().includes(name.statusId.toString()))
                          .map((record) => record.name)
                          .join(', ')
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem key="drp123" value="drp123">
                        <Checkbox
                          checked={drpStatusCheckAll}
                          onClick={() => {
                            handleDrpCheckAll(drpStatusCheckAll, drpCheckAllItems.Status);
                          }}
                        />
                        <i>
                          <ListItemText
                            primary={drpStatusCheckAll === true ? 'Un Check All' : 'Check All'}
                            onClick={() => {
                              handleDrpCheckAll(drpStatusCheckAll, drpCheckAllItems.Status);
                            }}
                          />
                        </i>
                      </MenuItem>
                      {projectStatusData.map((item) => (
                        <MenuItem key={item.statusId} value={item.statusId}>
                          <Checkbox checked={status.indexOf(item.statusId) >= 0} />
                          <ListItemText primary={`${item.name}`} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} xl={3} style={{ paddingTop: '0px' }}>
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
                </Grid>
              </Grid>
            </div>
            <CtmProjectTable searchParam={searchParams}></CtmProjectTable>
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
export default CtmProjectList;
