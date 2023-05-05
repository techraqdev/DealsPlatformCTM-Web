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
import 'datatables.net';
import 'datatables.net-responsive/js/dataTables.responsive';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import { useNavigate } from 'react-router-dom';
import {
  getAllProject,
  deleteProject,
  projectBulkUpload,
  exportDbCredsExcel,
  exportDbCredsPpt,
  exportDbCtmExcel,
  exportDbCtmZip,
  projecReportIssue,
} from '../../projects/projectApi';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getTaxonomyData } from '../../projects/taxonomyApi';
import {
  advSearchItem,
  ctmSearchList,
  ctmSearchV2,
  ctmSearchV3,
  searchList,
  searchV2,
  taxonomy,
  taxonomyCategory,
  ReportAnIssue,
  ReportAnIssueValues,
  drpCheckAllItems,
} from '../../projects/taxonomyModels';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { pwc_token } from '../../../common/constants/common.constant';
import { config } from '../../../common/environment';
import DbCredTable from '../../projects/projectDataTable';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StyledMenu } from '../../../components/forms/custom-elements/CustomTextField';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DbCtmTable from './DbCtmTable';
import { toastMessage } from '../../../common/toastMessage';
import { MessageType, Report_Types } from '../../../common/enumContainer';
import { MultiSelect, Option } from 'react-multi-select-component';

const CtmDownload: FC = () => {
  const allProjectsUrl = getAllProject;
  const navigate = useNavigate();
  const [clientN, setClientN] = useState('');
  const searchFilter: ctmSearchV2 = {};
  const searchFilter1: ctmSearchV3 = {};
  //const [expandAll, setExpandAll] = useState(true);
  const reportAnIssue: ReportAnIssue = {};
  const [typeOpen, setTypeOpen] = useState(true);
  const [controlTypeOpen, setControlTypeOpen] = useState(true);
  const [subSectorOpen, setSubSectorOpen] = useState(true);
  const [dealTypeOpen, setDealTypeOpen] = useState(true);
  const [sBUTypeOpen, setSBUTypeOpen] = useState(true);
  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);
  const [searchParams, setSearchParams] = React.useState(searchFilter);
  const [childData, setChildData] = useState([]);
  const [childCtmData, setChildCtmData] = useState<ReportAnIssueValues[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportIssueReason, setReportIssueReason] = useState('');
  // let selectedItems: any = [];
  let skipSectorNormalFlow = false;
  let skipSubSectNormalFlow = false;
  let skipControlTypeNormalFlow = false;
  let skipDealTypeNormalFlow = false;
  let skipSBUTypeNormalFlow = false;
  const [drpSectorCheckAll, setSectorDrpCheckAll] = useState(false);
  const [drpSubSectCheckAll, setSubSectDrpCheckAll] = useState(false);
  const [drpControlTypeCheckAll, setControlTypeDrpCheckAll] = useState(false);
  const [drpDealTypeCheckAll, setDealTypeDrpCheckAll] = useState(false);
  const [drpSBUTypeCheckAll, setSBUTypeDrpCheckAll] = useState(false);
  const [downloadBtnClick, setDownloadBtnClick] = useState(false);
  const [disableLoader, setDisableLoader] = React.useState(false);
  const [checkSelectAlls, setCheckSelectAlls] = React.useState<boolean>(false);

  const BCrumb = [
    {
      to: '/ctm/projects/downloads',
      title: 'Transaction Multiple Repository',
    },
    {
      title: 'Search Repository',
    },
  ];

  const handleClientN = (e: { target: { value: React.SetStateAction<string> } }) => {
    setClientN(e.target.value);
  };

  const [advSearchItems, setAdvSearchItems] = React.useState<advSearchItem[]>([]);
  const tableId = '#download_List';

  const url = config.Resource_Url + `ProjectCred/searchprojectscredV1`;

  const getData = (stringObject) => {
    if (stringObject != null && stringObject.length > 0) {
      return stringObject;
    } else return null;
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = () => {
    if (!downloadBtnClick) {
      setSearchItems();
      searchFilter1.projIds = childData;
      searchFilter1.projCtmIds = childCtmData;
      searchFilter1.searchFilter = searchFilter;
      exportDbCtmZip(searchFilter1);
    } else {
      setSearchItems();
      setDisableLoader(true);
      searchFilter1.projIds = childData;
      searchFilter1.projCtmIds = childCtmData;
      searchFilter1.searchFilter = searchFilter;
      exportDbCtmZip(searchFilter1).then((response) => {
        setDisableLoader(false);
      });
      searchFilter.showGrid = true;
      searchFilter.resetGrid = true;
      setCheckSelectAlls(true);
      setChildCtmData([]);
      setChildData([]);
    }
    // exportDbCtmExcel(selectedItems);
    //setSearchParams(searchFilter);
  };

  const updateSelectedItems = (e: any) => {
    console.log('');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setSearchItems = () => {
    updateSearchParams();
    setSearchParams(searchFilter);
  };

  const updateSearchParams = () => {
    searchFilter.projectTypeId = 1;
    searchFilter.subSector = searchFilter.resetGrid == true ? [] : getData(subSecDataParam);
    searchFilter.controllingType = searchFilter.resetGrid == true ? [] : getData(contTypeDataParam);
    searchFilter.dealType = searchFilter.resetGrid == true ? [] : getData(dealTypeDataParam);
    searchFilter.sector = searchFilter.resetGrid == true ? [] : getData(sectorDataParam);
    searchFilter.sBU = searchFilter.resetGrid == true ? [] : getData(sBUTypeDataParam);
    searchFilter.type = searchFilter.resetGrid == true ? [] : getData(typeDataParam);
    searchFilter.keyWords = searchFilter.resetGrid == true ? '' : clientN;
    searchFilter.dateFrom = searchFilter.resetGrid == true ? null : fromDate;
    searchFilter.dateTo = searchFilter.resetGrid == true ? null : toDate;
    searchFilter.dateTo = searchFilter.resetGrid == true ? null : toDate;
    searchFilter.sortText = sortText;
    searchFilter.sortOrder = sortOrder;
  };

  const searchDbCred = () => {
    //setExpandAll(false);
    searchFilter.showGrid = true;
    searchFilter.resetGrid = false;
    setSearchItems();
    setSearchParams(searchFilter);
    setDownloadBtnClick(true);
  };

  useEffect(() => {
    getTaxonomyResult();
    const sortedProducts = [...ctmSearchList];
    setAdvSearchItems(sortedProducts);
  }, []);

  const [taxonomyData, setTaxonomyData] = React.useState<taxonomy[]>([]);
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
      setDealTypeData(result.filter((data) => data.categoryId === taxonomyCategory.CtmDealType));
      setContTypeData(
        result.filter((data) => data.categoryId === taxonomyCategory.CTMControllingTypes),
      );
      setSBUTypeData(result.filter((data) => data.categoryId === taxonomyCategory.SBUType));
    }
  };

  const getTaxonomyBasedOnValues = (categoryId: any, selectedValues: any) => {
    const subSectorValues: Option[] = [];
    if (selectedValues != null && selectedValues.length > 0) {
      selectedValues.forEach((element) => {
        const filteredValues = taxonomyData
          .filter((data) => data.categoryId === categoryId && data.parentId == element)
          .map((taxonomy) => ({
            value: taxonomy.taxonomyUUID,
            label: `${taxonomy.parentName} | ${taxonomy.name}`,
          }));
        subSectorValues.push(...filteredValues);
      });
    } else {
      const filteredValues = taxonomyData
        .filter((data) => data.categoryId === categoryId)
        .map((taxonomy) => ({
          value: taxonomy.taxonomyUUID,
          label: `${taxonomy.parentName} | ${taxonomy.name}`,
        }));
      subSectorValues.push(...filteredValues);
    }
    return subSectorValues;
  };

  const [sectorData, setSectorData] = React.useState<Option[]>([]);
  const [sectorDataParamText, setSectorDataParamText] = React.useState([]);
  const [sectorDataParam, setSectorDataParam] = React.useState<string[]>([]);
  const handleChangeSector = (selectedList) => {
    // const {
    //   target: { value },
    // } = event;
    // if (skipSectorNormalFlow === false) {
    //   setSectorDataParam(typeof value === 'string' ? value.split(',') : value);
    //   bindSectorData(value);
    // } else {
    //   if (drpSectorCheckAll === true) {
    //     setSectorDataParam([]);
    //   } else {
    //     const compUUIDs: string[] = [];
    //     sectorData.forEach((item: any) => {
    //       compUUIDs.push(item.taxonomyUUID);
    //     });
    //     setSectorDataParam(compUUIDs);
    //     bindSectorData(compUUIDs);
    //   }
    // }
    // setSubSectDrpCheckAll(false);
    // skipSectorNormalFlow = true;
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    bindSectorData(compUUIDs);
    setSectorDataParam(compUUIDs);
    setSectorDataParamText(selectedList);
  };

  const bindSectorData = (value: any) => {
    setSubSecData(getTaxonomyBasedOnValues(taxonomyCategory.SubSector, value));
    setSubSecDataParam([]);
  };

  const [subSecData, setSubSecData] = React.useState<Option[]>([]);
  const [subSecDataParamText, setSubSecDataParamText] = React.useState([]);
  const [subSecDataParam, setSubSecDataParam] = React.useState<string[]>([]);
  const handleChangeSubSec = (selectedList) => {
    // const {
    //   target: { value },
    // } = event;
    // if (skipSubSectNormalFlow === false) {
    //   setSubSecDataParam(typeof value === 'string' ? value.split(',') : value);
    // } else {
    //   if (drpSubSectCheckAll === true) {
    //     setSubSecDataParam([]);
    //   } else {
    //     const compUUIDs: string[] = [];
    //     subSecData.forEach((item: any) => {
    //       compUUIDs.push(item.taxonomyUUID);
    //     });
    //     setSubSecDataParam(compUUIDs);
    //   }
    // }
    // skipSubSectNormalFlow = true;
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    setSubSecDataParam(compUUIDs);
    setSubSecDataParamText(selectedList);
  };

  const [typeData, setTypeData] = React.useState<taxonomy[]>([]);
  const [typeDataParam, setTypeDataParam] = React.useState<string[]>([]);
  const handleChangeType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    setTypeDataParam(typeof value === 'string' ? value.split(',') : value);
  };

  const [contTypeData, setContTypeData] = React.useState<taxonomy[]>([]);
  const [contTypeDataParam, setContTypeDataParam] = React.useState<string[]>([]);
  const handleChangeContType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipControlTypeNormalFlow === false) {
      setContTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpControlTypeCheckAll === true) {
        setContTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        contTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setContTypeDataParam(compUUIDs);
      }
    }
    skipControlTypeNormalFlow = true;
  };

  const [sBUTypeData, setSBUTypeData] = React.useState<taxonomy[]>([]);
  const [sBUTypeDataParam, setSBUTypeDataParam] = React.useState<string[]>([]);
  const handleChangeSBUType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipSBUTypeNormalFlow === false) {
      setSBUTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpSBUTypeCheckAll === true) {
        setSBUTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        sBUTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setSBUTypeDataParam(compUUIDs);
      }
    }
    skipSBUTypeNormalFlow = true;
  };

  const [dealTypeData, setDealTypeData] = React.useState<taxonomy[]>([]);
  const [dealTypeDataParam, setDealTypeDataParam] = React.useState<string[]>([]);
  const handleChangeDealType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipDealTypeNormalFlow === false) {
      setDealTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpDealTypeCheckAll === true) {
        setDealTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        dealTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setDealTypeDataParam(compUUIDs);
      }
    }
    skipDealTypeNormalFlow = true;
  };

  const [engagements, setEngagements] = React.useState(null);

  const [sortText, setSortText] = React.useState('projectName');
  const handleSortText = (event) => {
    setSortText(event.target.value);
  };

  const [sortOrder, setsortOrder] = React.useState('desc');
  const handleSortOrder = (event) => {
    setsortOrder(event.target.value);
  };

  const handleChangeAdvSearch = (event: any) => {
    const {
      target: { value },
    } = event;

    const selectedVal: string = value;
    if (selectedVal === '101') {
      typeOpen === true ? setTypeOpen(false) : setTypeOpen(true);
    } else if (selectedVal === '102') {
      controlTypeOpen === true ? setControlTypeOpen(false) : setControlTypeOpen(true);
    } else if (selectedVal === '103') {
      subSectorOpen === true ? setSubSectorOpen(false) : setSubSectorOpen(true);
    } else if (selectedVal === '104') {
      dealTypeOpen === true ? setDealTypeOpen(false) : setDealTypeOpen(true);
    } else if (selectedVal === '105') {
      sBUTypeOpen === true ? setSBUTypeOpen(false) : setSBUTypeOpen(true);
    }
    const subList = advSearchItems.filter((item) => item.id !== selectedVal);
    setAdvSearchItems(subList);
  };

  const [reportIssue, setReportIssue] = React.useState('');
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

  const clearSearch = () => {
    setSectorDataParam([]);
    setSubSecDataParam([]);
    setContTypeDataParam([]);
    setDealTypeDataParam([]);
    setClientN('');
    setFromDate(null);
    setToDate(null);
    setEngagements(null);
    setSortText('CompletedOn');
    setsortOrder('desc');
    searchFilter.showGrid = false;
    searchFilter.resetGrid = true;
    setAdvSearchItems([]);
    setSearchItems();
    getTaxonomyResult();
    setSearchParams(searchFilter);
    setDownloadBtnClick(false);
    setCheckSelectAlls(false);
    window.location.reload();
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleReportIssue = async () => {
    if (reportIssue === 'Error' && reportIssueReason === '') {
      toastMessage(MessageType.Error, 'Please provide reason for the issue.');
    } else {
      if (
        (reportIssueReason !== '' && reportIssueReason.length < 20) ||
        reportIssueReason.length > 500
      ) {
        toastMessage(
          MessageType.Error,
          'Please enter minimum 20 characters and maximum 500 characters',
        );
      } else {
        const response = await projecReportIssue({
          ProjCtmIds: childCtmData,
          ReportIssue: reportIssueReason,
          ReportType: reportIssue,
        });
        if (response && response.data.status === 200) {
          setOpenDialog(false);
          searchDbCred();
          toastMessage(MessageType.Success, 'Details updated successfully');
          setReportIssueReason('');
          setChildCtmData([]);
        } else {
          toastMessage(MessageType.Error, 'Error Occurred');
        }
      }
    }
  };

  const handleClick1 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const changeReportIssue = (selectedValue) => {
    let isErrorOpen = false;
    let isDuplicateOpen = false;
    setReportIssue(selectedValue);
    if (selectedValue != '') {
      if (selectedValue === 'Error' && childCtmData.length <= 0) {
        isErrorOpen = true;
      } else if (selectedValue === 'Duplicate' && childCtmData.length <= 1) {
        isDuplicateOpen = true;
      }
      if (!isErrorOpen && !isDuplicateOpen) {
        debugger;
        let data;
        let validate = true;
        let reported = false;
        if (selectedValue === 'Error') {
          data = childCtmData.filter((x) => !isNaN(x.errorStatus));
        } else if (selectedValue === 'Duplicate') {
          data = childCtmData.filter((x) => !isNaN(x.duplicateStatus));
        }
        data.map((item: any) => {
          if (
            item.errorStatus === Report_Types.CTMErrorData ||
            item.errorStatus === Report_Types.CTMErrorResolved ||
            item.errorStatus === Report_Types.CTMErrorNotanIssue
          ) {
            validate = false;
            reported = item.errorStatus === Report_Types.CTMErrorData ? true : false;
          } else if (
            item.duplicateStatus === Report_Types.CTMDuplicateData ||
            item.duplicateStatus === Report_Types.CTMDuplicateResolved ||
            item.duplicateStatus === Report_Types.CTMDuplicateNotanIssue
          ) {
            validate = false;
            reported = item.duplicateStatus === Report_Types.CTMDuplicateData ? true : false;
          }
        });
        if (validate) {
          setOpenDialog(true);
        } else {
          toastMessage(
            MessageType.Warning,
            reported
              ? 'Data is already reported. Please check once'
              : 'Data is already resolved. Please check once',
          );
        }
      } else if (isErrorOpen) {
        toastMessage(MessageType.Warning, 'Please select minimum 1 records');
      } else if (isDuplicateOpen) {
        toastMessage(MessageType.Warning, 'Please select minimum 2 records');
      }
    }
  };

  const handleErrorChange = () => {
    changeReportIssue('Error');
  };
  const handleDuplicateChange = () => {
    changeReportIssue('Duplicate');
  };

  const handleDrpCheckAll = (checkedVal: boolean, drpType: number) => {
    if (drpCheckAllItems.Sector === drpType) {
      skipSectorNormalFlow = true;
      if (checkedVal === true) {
        setSectorDrpCheckAll(false);
      } else {
        setSectorDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.SubSector === drpType) {
      skipSubSectNormalFlow = true;
      if (checkedVal === true) {
        setSubSectDrpCheckAll(false);
      } else {
        setSubSectDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.ControlType === drpType) {
      skipControlTypeNormalFlow = true;
      if (checkedVal === true) {
        setControlTypeDrpCheckAll(false);
      } else {
        setControlTypeDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.DealType === drpType) {
      skipDealTypeNormalFlow = true;
      if (checkedVal === true) {
        setDealTypeDrpCheckAll(false);
      } else {
        setDealTypeDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.SBU === drpType) {
      skipSBUTypeNormalFlow = true;
      if (checkedVal === true) {
        setSBUTypeDrpCheckAll(false);
      } else {
        setSBUTypeDrpCheckAll(true);
      }
    }
  };
  const customValueSectorRenderer = (selected, _options) => {
    const compUUIDs: string[] = [];
    return selected.length
      ? selected.forEach((item: any) => {
          compUUIDs.push(item.value);
        })
      : 'Sector';
  };
  const customValueSubSectorRenderer = (selected, _options) => {
    const compUUIDs: string[] = [];
    return selected.length
      ? selected.forEach((item: any) => {
          compUUIDs.push(item.value);
        })
      : 'Sub Sector';
  };

  return (
    <PageContainer title="Downloads" description="display downloads list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Downloads" items={BCrumb} />
      </div>
      {!disableLoader ? (
        <div>
          <Card className="download-list">
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    {/* <InputLabel>Sector</InputLabel>
                <span id="lblSector" hidden={true}>
                  {sectorDataParam.join(',')}
                </span> */}
                    {/* <Select
                  multiple
                  value={sectorDataParam}
                  onChange={handleChangeSector}
                  input={<OutlinedInput label="Sector" />}
                  renderValue={(selected) =>
                    sectorData
                      .filter((name) => selected.includes(name.taxonomyUUID))
                      .map((record) => record.name)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem key="drp123" value="drp123">
                    <Checkbox
                      checked={drpSectorCheckAll}
                      onClick={() => {
                        handleDrpCheckAll(drpSectorCheckAll, drpCheckAllItems.Sector);
                      }}
                    />
                    <i>
                      <ListItemText
                        primary={drpSectorCheckAll === true ? 'Un Check All' : 'Check All'}
                        onClick={() => {
                          handleDrpCheckAll(drpSectorCheckAll, drpCheckAllItems.Sector);
                        }}
                      />
                    </i>
                  </MenuItem>
                  {sectorData.map((item) => (
                    <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                      <Checkbox checked={sectorDataParam.indexOf(item.taxonomyUUID) > -1} />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </Select> */}
                    <MultiSelect
                      options={sectorData}
                      value={sectorDataParamText}
                      onChange={handleChangeSector}
                      labelledBy="Sector"
                      valueRenderer={customValueSectorRenderer}
                      overrideStrings={{ selectAll: 'Check All' }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Transaction From Date"
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
                      label="Transaction To Date"
                      inputFormat="yyyy-MM-dd"
                      value={toDate}
                      onChange={(newValue) => {
                        setToDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} id="txtToDate" />}
                      // disablePast={true}
                      minDate={fromDate}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={clientN}
                    name="clientN"
                    onChange={handleClientN}
                    id="txtKeyword"
                    placeholder="Keyword"
                  ></TextField>
                </Grid>

                <Grid item xs={12} md={3} xl={3}></Grid>
              </Grid>
              <div style={{ marginTop: '8px' }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={3} xl={3} hidden={typeOpen}>
                    <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                      <InputLabel>Type</InputLabel>
                      <Select
                        multiple
                        value={typeDataParam}
                        onChange={handleChangeType}
                        input={<OutlinedInput label="Type" />}
                        renderValue={(selected) =>
                          typeData
                            .filter((name) => selected.includes(name.taxonomyUUID))
                            .map((record) => record.name)
                            .join(', ')
                        }
                        MenuProps={MenuProps}
                      >
                        {typeData.map((item) => (
                          <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                            <Checkbox checked={typeDataParam.indexOf(item.taxonomyUUID) > -1} />
                            <ListItemText primary={`${item.name}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3} xl={3} hidden={controlTypeOpen}>
                    <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                      <InputLabel>Control type</InputLabel>
                      <Select
                        multiple
                        value={contTypeDataParam}
                        onChange={handleChangeContType}
                        input={<OutlinedInput label="Control type" />}
                        renderValue={(selected) =>
                          contTypeData
                            .filter((name) => selected.includes(name.taxonomyUUID))
                            .map((record) => record.name)
                            .join(', ')
                        }
                        MenuProps={MenuProps}
                      >
                        <MenuItem key="drp123" value="drp123">
                          <Checkbox
                            checked={drpControlTypeCheckAll}
                            onClick={() => {
                              handleDrpCheckAll(
                                drpControlTypeCheckAll,
                                drpCheckAllItems.ControlType,
                              );
                            }}
                          />
                          <i>
                            <ListItemText
                              primary={
                                drpControlTypeCheckAll === true ? 'Un Check All' : 'Check All'
                              }
                              onClick={() => {
                                handleDrpCheckAll(
                                  drpControlTypeCheckAll,
                                  drpCheckAllItems.ControlType,
                                );
                              }}
                            />
                          </i>
                        </MenuItem>
                        {contTypeData.map((item) => (
                          <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                            <Checkbox checked={contTypeDataParam.indexOf(item.taxonomyUUID) > -1} />
                            <ListItemText primary={`${item.name}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3} xl={3} hidden={subSectorOpen}>
                    <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                      {/* <InputLabel>Sub Sector</InputLabel>
                  <span id="lblSubSector" hidden={true}>
                    {subSecDataParam.join(',')}
                  </span>
                  <Select
                    multiple
                    value={subSecDataParam}
                    onChange={handleChangeSubSec}
                    input={<OutlinedInput label="Sub Sector" />}
                    renderValue={(selected) =>
                      subSecData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpSubSectCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(drpSubSectCheckAll, drpCheckAllItems.SubSector);
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpSubSectCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(drpSubSectCheckAll, drpCheckAllItems.SubSector);
                          }}
                        />
                      </i>
                    </MenuItem>
                    {subSecData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={subSecDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.parentName} | ${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select> */}
                      <MultiSelect
                        options={subSecData}
                        value={subSecDataParamText}
                        onChange={handleChangeSubSec}
                        labelledBy="Sub Sector"
                        valueRenderer={customValueSubSectorRenderer}
                        overrideStrings={{ selectAll: 'Check All' }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3} xl={3} hidden={dealTypeOpen}>
                    <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                      <InputLabel>Deal Type</InputLabel>

                      <Select
                        multiple
                        value={dealTypeDataParam}
                        onChange={handleChangeDealType}
                        input={<OutlinedInput label="Deal Type" />}
                        renderValue={(selected) =>
                          dealTypeData
                            .filter((name) => selected.includes(name.taxonomyUUID))
                            .map((record) => record.name)
                            .join(', ')
                        }
                        MenuProps={MenuProps}
                      >
                        <MenuItem key="drp123" value="drp123">
                          <Checkbox
                            checked={drpDealTypeCheckAll}
                            onClick={() => {
                              handleDrpCheckAll(drpDealTypeCheckAll, drpCheckAllItems.DealType);
                            }}
                          />
                          <i>
                            <ListItemText
                              primary={drpDealTypeCheckAll === true ? 'Un Check All' : 'Check All'}
                              onClick={() => {
                                handleDrpCheckAll(drpDealTypeCheckAll, drpCheckAllItems.DealType);
                              }}
                            />
                          </i>
                        </MenuItem>
                        {dealTypeData.map((item) => (
                          <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                            <Checkbox checked={dealTypeDataParam.indexOf(item.taxonomyUUID) > -1} />
                            <ListItemText primary={`${item.name}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3} xl={3} hidden={sBUTypeOpen}>
                    <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                      <InputLabel>SBU Type</InputLabel>

                      <Select
                        multiple
                        value={sBUTypeDataParam}
                        onChange={handleChangeSBUType}
                        input={<OutlinedInput label="SBU Type" />}
                        renderValue={(selected) =>
                          sBUTypeData
                            .filter((name) => selected.includes(name.taxonomyUUID))
                            .map((record) => record.name)
                            .join(', ')
                        }
                        MenuProps={MenuProps}
                      >
                        <MenuItem key="drp123" value="drp123">
                          <Checkbox
                            checked={drpSBUTypeCheckAll}
                            onClick={() => {
                              handleDrpCheckAll(drpSBUTypeCheckAll, drpCheckAllItems.SBU);
                            }}
                          />
                          <i>
                            <ListItemText
                              primary={drpSBUTypeCheckAll === true ? 'Un Check All' : 'Check All'}
                              onClick={() => {
                                handleDrpCheckAll(drpSBUTypeCheckAll, drpCheckAllItems.SBU);
                              }}
                            />
                          </i>
                        </MenuItem>
                        {sBUTypeData.map((item) => (
                          <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                            <Checkbox checked={sBUTypeDataParam.indexOf(item.taxonomyUUID) > -1} />
                            <ListItemText primary={`${item.name}`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              <Grid container spacing={1} style={{ marginTop: '5px' }}>
                <Grid item xs={12} md={2} xl={2} style={{ paddingTop: '14px' }}>
                  <span style={{ fontSize: '15px' }}>{'Select Advanced Search'}</span>
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    <InputLabel>Advanced Search</InputLabel>
                    <Select label="Select Advanced Search" onChange={handleChangeAdvSearch}>
                      {advSearchItems.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
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
                <Grid item xs={12} md={2} xl={2}>
                  <Button
                    id="btnDownload"
                    color="secondary"
                    variant="contained"
                    style={{ marginBottom: '5px', width: '100%' }}
                    className="buttons-bg"
                    onClick={handleClick}
                  >
                    Download
                  </Button>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <Button
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    disableElevation
                    color="secondary"
                    variant="contained"
                    className="buttons-bg"
                    onClick={handleClick1}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    Report An Issue
                  </Button>
                  <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                      'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={handleErrorChange}
                      disableRipple
                      sx={{ paddingLeft: '20px' }}
                    >
                      Error In Data
                    </MenuItem>
                    <MenuItem
                      onClick={handleDuplicateChange}
                      disableRipple
                      sx={{ paddingLeft: '20px' }}
                    >
                      Duplicate and Inconsistent Data
                    </MenuItem>
                  </StyledMenu>
                </Grid>
                {/* <Grid item xs={12} md={2} xl={2} hidden={expandAll}>
              <Button
                id="btnExpandAll"
                color="secondary"
                variant="contained"
                style={{ marginBottom: '5px', width: '100%' }}
                className="buttons-bg"
                //onClick={handleClick}
              >
                Expand All
              </Button>
            </Grid> */}
                <Grid item xs={12} md={6} xl={6}></Grid>
              </Grid>

              <DbCtmTable
                checkSelectAll={checkSelectAlls}
                searchParam={searchParams}
                passChildData={setChildData}
                passChildCtmData={setChildCtmData}
              ></DbCtmTable>
              <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle>
                  <b>Report the Issue to Engagement Teams</b>
                </DialogTitle>
                <DialogContent>
                  <TextField
                    size="small"
                    name="projectC"
                    id="txtProjectC"
                    className="textbox-feild"
                    onChange={(event) => setReportIssueReason(event.target.value)}
                    placeholder={
                      reportIssue === 'Error'
                        ? 'Please specify details'
                        : 'Please specify details (Optional)'
                    }
                    multiline={true}
                    rows={3}
                    fullWidth
                  ></TextField>
                  {/* <br /> */}
                  <div className="space-div-height">
                    <br />
                  </div>
                  <div>
                    <>Are you sure to submit?</>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="reset-yesbuttons-bg"
                    onClick={handleReportIssue}
                  >
                    Yes
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="reset-buttons-bg"
                    onClick={handleDialogClose}
                  >
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="loading-indicator"></div>
      )}
    </PageContainer>
  );
};
export default CtmDownload;
