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
import PageContainer from '../../components/container/PageContainer';
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
  exportDbCredsExcel,
  exportDbCredsPpt,
} from './projectApi';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { getTaxonomyData } from './taxonomyApi';
import {
  advSearchItem,
  drpCheckAllItems,
  searchList,
  searchV2,
  taxonomy,
  taxonomyCategory,
} from './taxonomyModels';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { MultiSelect, Option } from 'react-multi-select-component';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { projectCred_selectItems, pwc_token } from '../../common/constants/common.constant';
import { config } from '../../common/environment';
import DbCredTable from './projectDataTable';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StyledMenu } from '../../components/forms/custom-elements/CustomTextField';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { clearStorage, setStorage } from '../../common/helpers/storage.helper';

const DbDownload: FC = () => {
  const allProjectsUrl = getAllProject;
  const navigate = useNavigate();
  const [projectC, setProjectC] = useState('');
  const [clientN, setClientN] = useState('');
  const [projId, serProjId] = useState('');
  const [openDelPop, setOpenDelPop] = useState(false);
  const [openWFPop, setOpenWFPop] = useState(false);
  const [openFileUpload, setFileUpload] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);
  const [file, setUploadedFile] = useState('');
  const searchFilter: searchV2 = {};
  const [productOpen, setProductOpen] = useState(true);
  const [dealValueOpen, setDealValueOpen] = useState(true);
  const [clientEntityOpen, setClientEntityOpen] = useState(true);
  const [pwcLegalEntityOpen, setPwcLegalEntityOpen] = useState(true);
  const [controllingTypesOpen, setControllingTypesOpen] = useState(true);
  const [targetEntityTypeOpen, setTargetEntityTypeOpen] = useState(true);
  const [workCountryRegionOpen, setWorkCountryRegionOpen] = useState(true);
  const [dealTypeOpen, setDealTypeOpen] = useState(true);
  const [domicileCountryOpen, setDomicileCountryOpen] = useState(true);
  const [successfulTransactionOpen, setSuccessfulTransactionOpen] = useState(true);
  const [publicAnnouncementEngagementsOpen, setPublicAnnouncementEngagementsOpen] = useState(true);
  const [publicAnnouncementwithPwCOpen, setPublicAnnouncementwithPwCOpen] = useState(true);
  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);
  const [searchParams, setSearchParams] = React.useState(searchFilter);
  const [engagementTypeOpen, setEngagementTypeOpen] = useState(true);
  const [natureOfEngagementOpen, setnatureOfEngagementOpen] = useState(true);
  const [readOnlyNonDeal, setReadOnlyNonDeal] = useState(false);
  const [readOnlyTargetEntityType, setReadOnlyTargetEntityType] = useState(false);
  const [readOnlyCROfTraget, setReadOnlyCROfTraget] = useState(false);
  const [childData, setChildData] = useState([]);

  let skipSrvOffNormalFlow = false;
  let skipPrdNormalFlow = false;
  let skipSectorNormalFlow = false;
  let skipSubSectfNormalFlow = false;
  let skipNatOfTranNormalFlow = false;
  let skipNatOfEngNormalFlow = false;
  let skipContrlNormalFlow = false;
  let skipDealValNormalFlow = false;
  let skipClientEntNormalFlow = false;
  let skipClientNormalFlow = false;
  let skipTargetEntNormalFlow = false;
  let skipRegionOfTarNormalFlow = false;
  let skipPwcLegalNormalFlow = false;

  const [drpSrvOffCheckAll, setSrvOffDrpCheckAll] = useState(false);
  const [drpPrdCheckAll, setSPrdDrpCheckAll] = useState(false);
  const [drpSectorCheckAll, setSectorDrpCheckAll] = useState(false);
  const [drpSubSectCheckAll, setSubSectDrpCheckAll] = useState(false);
  const [drpNatOfTraCheckAll, setNatOfTraDrpCheckAll] = useState(false);
  const [drpNatOfEngCheckAll, setNatOfEngDrpCheckAll] = useState(false);
  const [drpContrlCheckAll, setContrlDrpCheckAll] = useState(false);
  const [drpDealValCheckAll, setDealValDrpCheckAll] = useState(false);
  const [drpClientEntCheckAll, setClientEntDrpCheckAll] = useState(false);
  const [drpClientCheckAll, setClientDrpCheckAll] = useState(false);
  const [drpTargetEntCheckAll, setTargetEntDrpCheckAll] = useState(false);
  const [drpRegionOfTarCheckAll, setRegionOfTarDrpCheckAll] = useState(false);
  const [drpPwcLegalCheckAll, setPwcLegalDrpCheckAll] = useState(false);

  const BCrumb = [
    {
      to: '/db/projects/downloads',
      title: 'Credentials Repository',
    },
    {
      title: 'Search Repository',
    },
  ];

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
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
    searchFilter.sector = searchFilter.resetGrid == true ? [] : getData(sectorDataParam);
    searchFilter.subSector = searchFilter.resetGrid == true ? [] : getData(subSecDataParam);
    searchFilter.dealValue = searchFilter.resetGrid == true ? [] : getData(dealValDataParam);
    searchFilter.clientEntityType =
      searchFilter.resetGrid == true ? [] : getData(cliEntTypeDataParam);
    searchFilter.pwCLegalEntity = searchFilter.resetGrid == true ? [] : getData(pwcLegalDataParam);
    searchFilter.controllingType = searchFilter.resetGrid == true ? [] : getData(contTypeDataParam);
    searchFilter.targetEntityType =
      searchFilter.resetGrid == true ? [] : getData(targTypeDataParam);
    searchFilter.workRegion = searchFilter.resetGrid == true ? [] : getData(workCounDataParam);
    searchFilter.dealType = searchFilter.resetGrid == true ? [] : getData(dealTypeDataParam);
    searchFilter.transactionStatus =
      searchFilter.resetGrid == true
        ? []
        : successFullTranDataParam
        ? [successFullTranDataParam]
        : [];
    searchFilter.publicAnnouncement =
      searchFilter.resetGrid == true ? [] : pubAnmtPwcDataParam ? [pubAnmtPwcDataParam] : [];
    searchFilter.parentRegion = searchFilter.resetGrid == true ? [] : getData(domcCounDataParam);
    searchFilter.service = searchFilter.resetGrid == true ? [] : getData(prodDataParam);
    searchFilter.keyWords = searchFilter.resetGrid == true ? '' : clientN;
    searchFilter.dateFrom = searchFilter.resetGrid == true ? null : fromDate;
    searchFilter.dateTo = searchFilter.resetGrid == true ? null : toDate;
    searchFilter.dateTo = searchFilter.resetGrid == true ? null : toDate;
    searchFilter.engagementType =
      searchFilter.resetGrid == true ? [] : engagements ? [engagements] : [];
    searchFilter.serviceOffering =
      searchFilter.resetGrid == true ? [] : getData(serviceOfferingDataParam);
    searchFilter.natureOfEngagement =
      searchFilter.resetGrid == true ? [] : getData(natureofEngagementDataParam);
    searchFilter.sortText = sortText;
    searchFilter.sortOrder = sortOrder;
    searchFilter.pptHeader = searchFilter.resetGrid == true ? 'Target' : pptDownloadOrder;
  };

  const searchDbCred = () => {
    jq('input[class="chk-select-all"]').prop('checked', false);
    setChildData([]);
    clearStorage(projectCred_selectItems);
    searchFilter.showGrid = true;
    searchFilter.resetGrid = false;
    setSearchItems();
    setSearchParams(searchFilter);
  };

  useEffect(() => {
    getTaxonomyResult();
    const sortedProducts = [...searchList];
    // sortedProducts.sort((a, b) => {
    //   if (a.name < b.name) {
    //     return -1;
    //   }
    //   if (a.name > b.name) {
    //     return 1;
    //   }
    //   return 0;
    // });
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
          .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.name })),
      );
      setNatureofEngagementData(
        result.filter((data) => data.categoryId === taxonomyCategory.NatureofEngagement),
      );
      //setServData(result.filter((data) => data.categoryId === taxonomyCategory.Services));
      setProdData(
        result
          .filter((data) => data.categoryId === taxonomyCategory.Services)
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
      debugger;
      setDealValData(result.filter((data) => data.categoryId === taxonomyCategory.DealValue));
      setCliEntTypeData(
        result.filter((data) => data.categoryId === taxonomyCategory.ClientEntityType),
      );
      setPwcLegalData(result.filter((data) => data.categoryId === taxonomyCategory.PwcLegalEntity));
      setContTypeData(
        result.filter((data) => data.categoryId === taxonomyCategory.CTMControllingTypes),
      );
      setTargTypeData(
        result.filter((data) => data.categoryId === taxonomyCategory.TargetEntityType),
      );
      setWorkCounData(
        result.filter((data) => data.categoryId === taxonomyCategory.WorkCountryRegion),
      );
      setDealTypeData(result.filter((data) => data.categoryId === taxonomyCategory.ParentDealType));
      setDomcCounData(
        result.filter((data) => data.categoryId === taxonomyCategory.DomicileCountry),
      );
      setSuccessFullTranData(
        result.filter((data) => data.categoryId === taxonomyCategory.SuccessfulTransaction),
      );
      setPubAnmtEngData(
        result.filter((data) => data.categoryId === taxonomyCategory.BooleanLookup),
      );
      setPubAnmtPwcData(
        result.filter((data) => data.categoryId === taxonomyCategory.PublicAnnouncement),
      );
      setServiceOfferingData(
        result
          .filter((data) => data.categoryId === taxonomyCategory.SBU)
          .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.name })),
      );
    }
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
    //   bindSubSector(value);
    // } else {
    //   if (drpSectorCheckAll === true) {
    //     setSectorDataParam([]);
    //   } else {
    //     const compUUIDs: string[] = [];
    //     sectorData.forEach((item: any) => {
    //       compUUIDs.push(item.taxonomyUUID);
    //     });
    //     setSectorDataParam(compUUIDs);
    //     bindSubSector(compUUIDs);
    //   }
    // }
    // setSubSectDrpCheckAll(false);
    // skipSectorNormalFlow = true;
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    bindSubSector(compUUIDs);
    setSectorDataParam(compUUIDs);
    setSectorDataParamText(selectedList);
  };

  const bindSubSector = (value: any) => {
    const subSectorValues = getTaxonomyBasedOnValues(taxonomyCategory.SubSector, value);
    setSubSecData(subSectorValues);
    const resSubSectorDataParam: any[] = [];
    for (let i = 0; i < subSectorValues.length; i++) {
      const selValue = subSectorValues[i].value;
      const filteredValues = subSecDataParam.filter((data) => data == selValue);
      if (filteredValues.length > 0) resSubSectorDataParam.push(selValue);
    }
    setSubSecDataParam(resSubSectorDataParam);
    if (value.length <= 0) {
      setSubSecDataParam([]);
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

  const [servData, setServData] = React.useState<taxonomy[]>([]);
  const [servDataParam, setServDataParam] = React.useState<string[]>([]);
  const handleChangeServices = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    setServDataParam(typeof value === 'string' ? value.split(',') : value);
  };

  const [prodData, setProdData] = React.useState<Option[]>([]);
  const [prodDataParamText, setProdDataParamText] = React.useState([]);
  const [prodDataParam, setProdDataParam] = React.useState<string[]>([]);
  const handleChangeProducts = (selectedList) => {
    // const {
    //   target: { value },
    // } = event;
    // if (skipPrdNormalFlow === false) {
    //   setProdDataParam(typeof value === 'string' ? value.split(',') : value);
    // } else {
    //   if (drpPrdCheckAll === true) {
    //     setProdDataParam([]);
    //   } else {
    //     const compUUIDs: string[] = [];
    //     prodData.forEach((item: any) => {
    //       compUUIDs.push(item.taxonomyUUID);
    //     });
    //     setProdDataParam(compUUIDs);
    //   }
    // }
    // skipPrdNormalFlow = false;

    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    setProdDataParam(compUUIDs);
    setProdDataParamText(selectedList);
  };

  const [subSecData, setSubSecData] = React.useState<Option[]>([]);
  const [subSecDataParamText, setSubSecDataParamText] = React.useState([]);
  const [subSecDataParam, setSubSecDataParam] = React.useState<string[]>([]);
  const handleChangeSubSec = (selectedList) => {
    // const {
    //   target: { value },
    // } = event;
    // if (skipSubSectfNormalFlow === false) {
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
    // skipSubSectfNormalFlow = true;
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    setSubSecDataParam(compUUIDs);
    setSubSecDataParamText(selectedList);
  };

  const [cliEntTypeData, setCliEntTypeData] = React.useState<taxonomy[]>([]);
  const [cliEntTypeDataParam, setCliEntTypeDataParam] = React.useState<string[]>([]);
  const handleChangeCliEntType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipClientEntNormalFlow === false) {
      setCliEntTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpClientEntCheckAll === true) {
        setCliEntTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        cliEntTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setCliEntTypeDataParam(compUUIDs);
      }
    }
    skipClientEntNormalFlow = true;
  };

  const [dealValData, setDealValData] = React.useState<taxonomy[]>([]);
  const [dealValDataParam, setDealValDataParam] = React.useState<string[]>([]);
  const handleChangeDealVal = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipDealValNormalFlow === false) {
      setDealValDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpDealValCheckAll === true) {
        setDealValDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        dealValData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setDealValDataParam(compUUIDs);
      }
    }
    skipDealValNormalFlow = true;
  };

  const [pwcLegalData, setPwcLegalData] = React.useState<taxonomy[]>([]);
  const [pwcLegalDataParam, setPwcLegalDataParam] = React.useState<string[]>([]);
  const handleChangePwcLegal = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipPwcLegalNormalFlow === false) {
      setPwcLegalDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpPwcLegalCheckAll === true) {
        setPwcLegalDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        pwcLegalData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setPwcLegalDataParam(compUUIDs);
      }
    }
    skipPwcLegalNormalFlow = true;
  };

  const [contTypeData, setContTypeData] = React.useState<taxonomy[]>([]);
  const [contTypeDataParam, setContTypeDataParam] = React.useState<string[]>([]);
  const handleChangeContType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipContrlNormalFlow === false) {
      setContTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpContrlCheckAll === true) {
        setContTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        contTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setContTypeDataParam(compUUIDs);
      }
    }
    skipContrlNormalFlow = true;
  };

  const [targTypeData, setTargTypeData] = React.useState<taxonomy[]>([]);
  const [targTypeDataParam, setTargTypeDataParam] = React.useState<string[]>([]);
  const handleChangeTargType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipTargetEntNormalFlow === false) {
      setTargTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpTargetEntCheckAll === true) {
        setTargTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        targTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setTargTypeDataParam(compUUIDs);
      }
    }
    skipTargetEntNormalFlow = true;
  };

  const [workCounData, setWorkCounData] = React.useState<taxonomy[]>([]);
  const [workCounDataParam, setWorkCounDataParam] = React.useState<string[]>([]);
  const handleChangeWorkCoun = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipRegionOfTarNormalFlow === false) {
      setWorkCounDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpRegionOfTarCheckAll === true) {
        setWorkCounDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        workCounData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setWorkCounDataParam(compUUIDs);
      }
    }
    skipRegionOfTarNormalFlow = true;
  };

  const [dealTypeData, setDealTypeData] = React.useState<taxonomy[]>([]);
  const [dealTypeDataParam, setDealTypeDataParam] = React.useState<string[]>([]);
  const handleChangeDealType = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipNatOfTranNormalFlow === false) {
      setDealTypeDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpNatOfTraCheckAll === true) {
        setDealTypeDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        dealTypeData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setDealTypeDataParam(compUUIDs);
      }
    }
    skipNatOfTranNormalFlow = true;
  };

  const [domcCounData, setDomcCounData] = React.useState<taxonomy[]>([]);
  const [domcCounDataParam, setDomcCounDataParam] = React.useState<string[]>([]);
  const handleChangeDomcCoun = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipClientNormalFlow === false) {
      setDomcCounDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpClientCheckAll === true) {
        setDomcCounDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        domcCounData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setDomcCounDataParam(compUUIDs);
      }
    }
    skipClientNormalFlow = true;
  };

  const [successFullTranData, setSuccessFullTranData] = React.useState<taxonomy[]>([]);
  const [successFullTranDataParam, setSuccessFullTranParam] = React.useState(null);
  const handleChangeSuccessFullTran = (event) => {
    setSuccessFullTranParam(event.target.value);
  };

  // (event: { target: { value: any } }) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setSuccessFullTranParam(typeof value === 'string' ? value.split(',') : value);
  // };

  const [pubAnmtEngData, setPubAnmtEngData] = React.useState<taxonomy[]>([]);
  const [pubAnmtEngDataParam, setPubAnmtEngDataParam] = React.useState(null);
  const handleChangePubAnmtEng = (event) => {
    setPubAnmtEngDataParam(event.target.value);
  };
  /*(event: { target: { value: any } }) => {
      const {
        target: { value },
      } = event;
      setPubAnmtEngDataParam(typeof value === 'string' ? value.split(',') : value);
    };*/

  const [pubAnmtPwcData, setPubAnmtPwcData] = React.useState<taxonomy[]>([]);
  const [pubAnmtPwcDataParam, setPubAnmtPwcDataParam] = React.useState(null);
  const handleChangePubAnmtPwc = (event) => {
    setPubAnmtPwcDataParam(event.target.value);
  };

  /*(event: { target: { value: any } }) => {
      const {
        target: { value },
      } = event;
      setPubAnmtPwcDataParam(typeof value === 'string' ? value.split(',') : value);
    };*/

  const [engagements, setEngagements] = React.useState(null);
  const handleEngagement = (event) => {
    setReadOnlyCROfTraget(false);
    setReadOnlyTargetEntityType(false);
    setReadOnlyNonDeal(false);

    if (event.target.value == 2) {
      setReadOnlyCROfTraget(true);
      setReadOnlyTargetEntityType(true);
    } else if (event.target.value == 3) {
      setReadOnlyCROfTraget(true);

      setReadOnlyTargetEntityType(true);
      setReadOnlyNonDeal(true);
    }

    setEngagements(event.target.value);
    setDealTypeData(
      getValuesBasedOnEngagementType(taxonomyCategory.ParentDealType, event.target.value),
    );
    setDealValData(getValuesBasedOnEngagementType(taxonomyCategory.DealValue, event.target.value));
    setNatureofEngagementData(
      getValuesBasedOnEngagementType(taxonomyCategory.NatureofEngagement, event.target.value),
    );
    setContTypeData(
      getValuesBasedOnEngagementType(taxonomyCategory.ControllingTypes, event.target.value),
    );
    setTargTypeData(
      getValuesBasedOnEngagementType(taxonomyCategory.TargetEntityType, event.target.value),
    );
    setWorkCounData(
      getValuesBasedOnEngagementType(taxonomyCategory.WorkCountryRegion, event.target.value),
    );
    setSuccessFullTranData(
      getValuesBasedOnEngagementType(taxonomyCategory.SuccessfulTransaction, event.target.value),
    );
    setPubAnmtPwcData(
      getValuesBasedOnEngagementType(taxonomyCategory.PublicAnnouncement, event.target.value),
    );
    setDealTypeDataParam([]);
    setDealValDataParam([]);
    setNatureofEngagementDataParam([]);
    setContTypeDataParam([]);
    setTargTypeDataParam([]);
    setWorkCounDataParam([]);
    setSuccessFullTranParam(null);
    setPubAnmtPwcDataParam(null);
  };

  const getValuesBasedOnEngagementType = (categoryId: any, engagementTypeId: any) => {
    if (engagementTypeId == 1) {
      return taxonomyData.filter((data) => data.categoryId === categoryId && data.buySide == true);
    } else if (engagementTypeId == 2) {
      return taxonomyData.filter((data) => data.categoryId === categoryId && data.sellSide == true);
    } else if (engagementTypeId == 3) {
      return taxonomyData.filter((data) => data.categoryId === categoryId && data.nonDeal == true);
    } else {
      return taxonomyData.filter((data) => data.categoryId === categoryId);
    }
  };

  const [pptDownloadOrder, setPptDownloadOrder] = React.useState('Client');
  const handleDownloadOrder = (event) => {
    setPptDownloadOrder(event.target.value);
    const sortText = event.target.value === 'Client' ? 'ClientName' : 'TargetName';
    setSortText(sortText);
  };

  const [sortText, setSortText] = React.useState('ClientName');
  const handleSortText = (event) => {
    setSortText(event.target.value);
  };

  const [sortOrder, setsortOrder] = React.useState('asc');
  const handleSortOrder = (event) => {
    setsortOrder(event.target.value);
  };

  const [serviceOfferingData, setServiceOfferingData] = React.useState<Option[]>([]);
  const [serviceOfferingDataParamText, setServiceOfferingDataParamText] = useState([]);
  const [serviceOfferingDataParam, setServiceOfferingDataParam] = React.useState<string[]>([]);

  const handleChangeServiceOffering = (selectedList) => {
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    bindServiceOffering(compUUIDs);
    setServiceOfferingDataParam(compUUIDs);
    setServiceOfferingDataParamText(selectedList);
  };

  const bindServiceOffering = (selectedValue) => {
    const prds = getTaxonomyBasedOnValues(taxonomyCategory.Services, selectedValue);
    setProdData(prds);
    const resProdDataParam: any[] = [];
    for (let i = 0; i < prds.length; i++) {
      const selValue = prds[i].value;
      const filteredValues = prodDataParam.filter((data) => data == selValue);
      if (filteredValues.length > 0) resProdDataParam.push(selValue);
    }
    setProdDataParam(resProdDataParam);
    if (selectedValue.length <= 0) {
      setProdDataParam([]);
    }
  };

  const [natureofEngagementData, setNatureofEngagementData] = React.useState<taxonomy[]>([]);
  const [natureofEngagementDataParam, setNatureofEngagementDataParam] = React.useState<string[]>(
    [],
  );
  const handleChangeNatureofEngagement = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    if (skipNatOfEngNormalFlow === false) {
      setNatureofEngagementDataParam(typeof value === 'string' ? value.split(',') : value);
    } else {
      if (drpNatOfEngCheckAll === true) {
        setNatureofEngagementDataParam([]);
      } else {
        const compUUIDs: string[] = [];
        natureofEngagementData.forEach((item: any) => {
          compUUIDs.push(item.taxonomyUUID);
        });
        setNatureofEngagementDataParam(compUUIDs);
      }
    }
    skipNatOfEngNormalFlow = true;
  };

  const handleChangeAdvSearch = (event: any) => {
    const {
      target: { value },
    } = event;

    const selectedVal: string = value;
    if (selectedVal === '2') {
      productOpen === true ? setProductOpen(false) : setProductOpen(true);
    } else if (selectedVal === '4') {
      dealValueOpen === true ? setDealValueOpen(false) : setDealValueOpen(true);
    } else if (selectedVal === '9') {
      clientEntityOpen === true ? setClientEntityOpen(false) : setClientEntityOpen(true);
    } else if (selectedVal === '15') {
      pwcLegalEntityOpen === true ? setPwcLegalEntityOpen(false) : setPwcLegalEntityOpen(true);
    } else if (selectedVal === '14') {
      controllingTypesOpen === true
        ? setControllingTypesOpen(false)
        : setControllingTypesOpen(true);
    } else if (selectedVal === '13') {
      targetEntityTypeOpen === true
        ? setTargetEntityTypeOpen(false)
        : setTargetEntityTypeOpen(true);
    } else if (selectedVal === '12') {
      workCountryRegionOpen === true
        ? setWorkCountryRegionOpen(false)
        : setWorkCountryRegionOpen(true);
    } else if (selectedVal === '3') {
      dealTypeOpen === true ? setDealTypeOpen(false) : setDealTypeOpen(true);
    } else if (selectedVal === '10') {
      domicileCountryOpen === true ? setDomicileCountryOpen(false) : setDomicileCountryOpen(true);
    } else if (selectedVal === '91') {
      successfulTransactionOpen === true
        ? setSuccessfulTransactionOpen(false)
        : setSuccessfulTransactionOpen(true);
    } else if (selectedVal === '92') {
      publicAnnouncementEngagementsOpen === true
        ? setPublicAnnouncementEngagementsOpen(false)
        : setPublicAnnouncementEngagementsOpen(true);
    } else if (selectedVal === '93') {
      publicAnnouncementwithPwCOpen === true
        ? setPublicAnnouncementwithPwCOpen(false)
        : setPublicAnnouncementwithPwCOpen(true);
    } else if (selectedVal === '94') {
      engagementTypeOpen === true ? setEngagementTypeOpen(false) : setEngagementTypeOpen(true);
    } else if (selectedVal === '95') {
      natureOfEngagementOpen === true
        ? setnatureOfEngagementOpen(false)
        : setnatureOfEngagementOpen(true);
    }

    const subList = advSearchItems.filter((item) => item.id !== selectedVal);
    setAdvSearchItems(subList);
  };

  const handleProjectC = (e: { target: { value: React.SetStateAction<string> } }) => {
    setProjectC(e.target.value);
  };

  const handleClientN = (e: { target: { value: React.SetStateAction<string> } }) => {
    setClientN(e.target.value);
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

  const downloadCreds = () => {
    // alert(childData);
    handleClose();
    updateSearchParams();
    searchFilter.projectIds = childData;
    // setChildData([]);
    exportDbCredsExcel(searchFilter);
    //window.location.reload();
    // jq('input[class="chk-select"]').prop('checked', false).change();
    // jq('input[class="chk-select-all"]').prop('checked', false).change();
    //clearStorage(projectCred_selectItems);
  };

  const downloadCredsPpt = () => {
    //clearStorage(projectCred_selectItems);
    searchFilter.projectIds = childData;
    //setChildData([]);
    handleClose();
    updateSearchParams();
    exportDbCredsPpt(searchFilter);
    // const rows = jq(tableId).DataTable().rows({ search: 'applied' }).nodes();
    //jq('input[class="chk-select"]').prop('checked', false).change();
    // jq('input[class="chk-select-all"]').prop('checked', false).change();
    // clearStorage(projectCred_selectItems);
  };

  const clearSearch = () => {
    clearStorage(projectCred_selectItems);
    setChildData([]);
    setSectorDataParam([]);
    setServDataParam([]);
    setProdDataParam([]);
    setSubSecDataParam([]);
    setCliEntTypeDataParam([]);
    setDealValDataParam([]);
    setPwcLegalDataParam([]);
    setContTypeDataParam([]);
    setTargTypeDataParam([]);
    setWorkCounDataParam([]);
    setDealTypeDataParam([]);
    setDomcCounDataParam([]);
    setSuccessFullTranParam(null);
    setPubAnmtEngDataParam(null);
    setPubAnmtPwcDataParam(null);
    setServiceOfferingDataParam([]);
    setNatureofEngagementDataParam([]);
    setClientN('');
    setFromDate(null);
    setToDate(null);
    setEngagements(null);
    setSortText('ClientName');
    setsortOrder('asc');
    setPptDownloadOrder('Client');
    // if (searchParams.showGrid)
    searchFilter.showGrid = false;
    searchFilter.resetGrid = true;
    setAdvSearchItems([]);
    setSearchItems();
    getTaxonomyResult();
    setSearchParams(searchFilter);

    window.location.reload();
  };

  const handleDrpCheckAll = (checkedVal: boolean, drpType: number) => {
    if (drpCheckAllItems.ServiceOffering === drpType) {
      skipSrvOffNormalFlow = true;
      if (checkedVal === true) {
        setSrvOffDrpCheckAll(false);
      } else {
        setSrvOffDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.Products === drpType) {
      skipPrdNormalFlow = true;
      if (checkedVal === true) {
        setSPrdDrpCheckAll(false);
      } else {
        setSPrdDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.Sector === drpType) {
      skipSectorNormalFlow = true;
      if (checkedVal === true) {
        setSectorDrpCheckAll(false);
      } else {
        setSectorDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.SubSector === drpType) {
      skipSubSectfNormalFlow = true;
      if (checkedVal === true) {
        setSubSectDrpCheckAll(false);
      } else {
        setSubSectDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.NatureOfTransaction === drpType) {
      skipNatOfTranNormalFlow = true;
      if (checkedVal === true) {
        setNatOfTraDrpCheckAll(false);
      } else {
        setNatOfTraDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.NatureOfEngagement === drpType) {
      skipNatOfEngNormalFlow = true;
      if (checkedVal === true) {
        setNatOfEngDrpCheckAll(false);
      } else {
        setNatOfEngDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.Controlling === drpType) {
      skipContrlNormalFlow = true;
      if (checkedVal === true) {
        setContrlDrpCheckAll(false);
      } else {
        setContrlDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.DealValue === drpType) {
      skipDealValNormalFlow = true;
      if (checkedVal === true) {
        setDealValDrpCheckAll(false);
      } else {
        setDealValDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.ClientEntity === drpType) {
      skipClientEntNormalFlow = true;
      if (checkedVal === true) {
        setClientEntDrpCheckAll(false);
      } else {
        setClientEntDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.Clients === drpType) {
      skipClientNormalFlow = true;
      if (checkedVal === true) {
        setClientDrpCheckAll(false);
      } else {
        setClientDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.TargetEntityType === drpType) {
      skipTargetEntNormalFlow = true;
      if (checkedVal === true) {
        setTargetEntDrpCheckAll(false);
      } else {
        setTargetEntDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.RegionOfTarget === drpType) {
      skipRegionOfTarNormalFlow = true;
      if (checkedVal === true) {
        setRegionOfTarDrpCheckAll(false);
      } else {
        setRegionOfTarDrpCheckAll(true);
      }
    } else if (drpCheckAllItems.PwCLegalEntity === drpType) {
      skipPwcLegalNormalFlow = true;
      if (checkedVal === true) {
        setPwcLegalDrpCheckAll(false);
      } else {
        setPwcLegalDrpCheckAll(true);
      }
    }
  };
  const customValueServiceRenderer = (selected, _options) => {
    const compUUIDs: string[] = [];
    return selected.length
      ? selected.forEach((item: any) => {
          compUUIDs.push(item.value);
        })
      : 'Service Offering';
  };
  const customValuePrductsRenderer = (selected, _options) => {
    const compUUIDs: string[] = [];
    return selected.length
      ? selected.forEach((item: any) => {
          compUUIDs.push(item.value);
        })
      : 'Products';
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
      <Card className="download-list">
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                {/* <InputLabel>Service Offering</InputLabel> */}

                <MultiSelect
                  options={serviceOfferingData}
                  value={serviceOfferingDataParamText}
                  onChange={handleChangeServiceOffering}
                  labelledBy="Service Offering"
                  valueRenderer={customValueServiceRenderer}
                  overrideStrings={{ selectAll: 'Check All' }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                {/* <InputLabel>Products</InputLabel> */}
                {/* <Select
                  multiple
                  value={prodDataParam}
                  onChange={handleChangeProducts}
                  input={<OutlinedInput label="Products" />}
                  renderValue={(selected) =>
                    prodData
                      .filter((name) => selected.includes(name.taxonomyUUID))
                      .map((record) => record.name)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem key="drp123" value="drp123">
                    <Checkbox
                      checked={drpPrdCheckAll}
                      onClick={() => {
                        handleDrpCheckAll(drpPrdCheckAll, drpCheckAllItems.Products);
                      }}
                    />
                    <i>
                      <ListItemText
                        primary={drpPrdCheckAll === true ? 'Un Check All' : 'Check All'}
                        onClick={() => {
                          handleDrpCheckAll(drpPrdCheckAll, drpCheckAllItems.Products);
                        }}
                      />
                    </i>
                  </MenuItem>
                  {prodData.map((item) => (
                    <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                      <Checkbox checked={prodDataParam.indexOf(item.taxonomyUUID) > -1} />
                      <ListItemText primary={`${item.displayName}`} />
                    </MenuItem>
                  ))}
                </Select> */}
                <MultiSelect
                  options={prodData}
                  value={prodDataParamText}
                  onChange={handleChangeProducts}
                  labelledBy="Products"
                  valueRenderer={customValuePrductsRenderer}
                  overrideStrings={{ selectAll: 'Check All' }}
                />
              </FormControl>
            </Grid>
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
            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                {/* <InputLabel>Sub Sector</InputLabel>
                <span id="lblSubSector" hidden={true}>
                  {subSecDataParam.join(',')}
                </span> */}
                {/* <Select
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
              <Grid item xs={12} md={3} xl={3} hidden={engagementTypeOpen}>
                <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                  <InputLabel>Engagement Type</InputLabel>
                  <Select
                    value={engagements}
                    onChange={handleEngagement}
                    input={<OutlinedInput label="Engagement Type" />}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value={1}>Buy side</MenuItem>
                    <MenuItem value={2}>Sell side</MenuItem>
                    <MenuItem value={3}>Non Deal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} xl={3} hidden={dealTypeOpen}>
                <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                  <InputLabel>Nature of Transaction (Deal)/ Nature of Work (Non Deal)</InputLabel>
                  <Select
                    multiple
                    value={dealTypeDataParam}
                    onChange={handleChangeDealType}
                    input={
                      <OutlinedInput label="Nature of Transaction (Deal)/ Nature of Work (Non Deal)" />
                    }
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
                        checked={drpNatOfTraCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(
                            drpNatOfTraCheckAll,
                            drpCheckAllItems.NatureOfTransaction,
                          );
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpNatOfTraCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(
                              drpNatOfTraCheckAll,
                              drpCheckAllItems.NatureOfTransaction,
                            );
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
              <Grid item xs={12} md={3} xl={3} hidden={natureOfEngagementOpen}>
                <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                  <InputLabel>Nature of Engagement / Deal</InputLabel>
                  <Select
                    multiple
                    value={natureofEngagementDataParam}
                    onChange={handleChangeNatureofEngagement}
                    input={<OutlinedInput label="Nature of Engagement / Deal" />}
                    renderValue={(selected) =>
                      natureofEngagementData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpNatOfEngCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(
                            drpNatOfEngCheckAll,
                            drpCheckAllItems.NatureOfEngagement,
                          );
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpNatOfEngCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(
                              drpNatOfEngCheckAll,
                              drpCheckAllItems.NatureOfEngagement,
                            );
                          }}
                        />
                      </i>
                    </MenuItem>
                    {natureofEngagementData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox
                          checked={natureofEngagementDataParam.indexOf(item.taxonomyUUID) > -1}
                        />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} xl={3} hidden={controllingTypesOpen}>
                <FormControl
                  sx={{ m: 1, width: 300 }}
                  disabled={readOnlyNonDeal ? true : false}
                  className={readOnlyNonDeal ? 'dbdropdown-border' : 'dbdropdown'}
                >
                  <InputLabel>Controlling/Non-Controlling</InputLabel>
                  <Select
                    multiple
                    value={contTypeDataParam}
                    onChange={handleChangeContType}
                    input={<OutlinedInput label="Controlling/Non-Controlling" />}
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
                        checked={drpContrlCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(drpContrlCheckAll, drpCheckAllItems.Controlling);
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpContrlCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(drpContrlCheckAll, drpCheckAllItems.Controlling);
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
              <Grid item xs={12} md={3} xl={3} hidden={dealValueOpen}>
                <FormControl
                  sx={{ m: 1, width: 300 }}
                  disabled={readOnlyNonDeal ? true : false}
                  className={readOnlyNonDeal ? 'dbdropdown-border' : 'dbdropdown'}
                >
                  <InputLabel>Deal value</InputLabel>
                  <Select
                    multiple
                    value={dealValDataParam}
                    onChange={handleChangeDealVal}
                    input={<OutlinedInput label="Deal value" />}
                    renderValue={(selected) =>
                      dealValData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpDealValCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(drpDealValCheckAll, drpCheckAllItems.DealValue);
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpDealValCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(drpDealValCheckAll, drpCheckAllItems.DealValue);
                          }}
                        />
                      </i>
                    </MenuItem>
                    {dealValData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={dealValDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} xl={3} hidden={clientEntityOpen}>
                <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                  <InputLabel>Client Entity type</InputLabel>
                  <Select
                    multiple
                    value={cliEntTypeDataParam}
                    onChange={handleChangeCliEntType}
                    input={<OutlinedInput label="Client Entity type" />}
                    renderValue={(selected) =>
                      cliEntTypeData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpClientEntCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(drpClientEntCheckAll, drpCheckAllItems.ClientEntity);
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpClientEntCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(drpClientEntCheckAll, drpCheckAllItems.ClientEntity);
                          }}
                        />
                      </i>
                    </MenuItem>
                    {cliEntTypeData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={cliEntTypeDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} xl={3} hidden={domicileCountryOpen}>
                <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                  <InputLabel>
                    Client&apos;s or Client&apos;s Ultimate Parent entity&apos;s domicile
                    country/region
                  </InputLabel>

                  <Select
                    multiple
                    value={domcCounDataParam}
                    onChange={handleChangeDomcCoun}
                    input={<OutlinedInput label="Country / region of client's ultimate parent" />}
                    renderValue={(selected) =>
                      domcCounData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpClientCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(drpClientCheckAll, drpCheckAllItems.Clients);
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpClientCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(drpClientCheckAll, drpCheckAllItems.Clients);
                          }}
                        />
                      </i>
                    </MenuItem>
                    {domcCounData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={domcCounDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3} xl={3} hidden={successfulTransactionOpen}>
                <FormControl
                  sx={{ m: 1, width: 300 }}
                  disabled={readOnlyNonDeal ? true : false}
                  className={readOnlyNonDeal ? 'dbdropdown-border' : 'dbdropdown'}
                >
                  <InputLabel>Successful Transaction only</InputLabel>
                  <Select
                    value={successFullTranDataParam}
                    onChange={handleChangeSuccessFullTran}
                    input={<OutlinedInput label="Successful Transaction only" />}
                    MenuProps={MenuProps}
                  >
                    {successFullTranData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3} xl={3} hidden={targetEntityTypeOpen}>
                <FormControl
                  sx={{ m: 1, width: 300 }}
                  disabled={readOnlyTargetEntityType ? true : false}
                  className={readOnlyTargetEntityType ? 'dbdropdown-border' : 'dbdropdown'}
                >
                  <InputLabel>Target Entity Type</InputLabel>
                  <Select
                    multiple
                    value={targTypeDataParam}
                    onChange={handleChangeTargType}
                    input={<OutlinedInput label="Target Entity Type" />}
                    renderValue={(selected) =>
                      targTypeData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpTargetEntCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(
                            drpTargetEntCheckAll,
                            drpCheckAllItems.TargetEntityType,
                          );
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpTargetEntCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(
                              drpTargetEntCheckAll,
                              drpCheckAllItems.TargetEntityType,
                            );
                          }}
                        />
                      </i>
                    </MenuItem>
                    {targTypeData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={targTypeDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3} xl={3} hidden={workCountryRegionOpen}>
                <FormControl
                  sx={{ m: 1, width: 300 }}
                  disabled={readOnlyCROfTraget ? true : false}
                  className={readOnlyCROfTraget ? 'dbdropdown-border' : 'dbdropdown'}
                >
                  <InputLabel>Country/Region of Target</InputLabel>
                  <Select
                    multiple
                    value={workCounDataParam}
                    onChange={handleChangeWorkCoun}
                    input={<OutlinedInput label="Country/Region of Target" />}
                    renderValue={(selected) =>
                      workCounData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpRegionOfTarCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(
                            drpRegionOfTarCheckAll,
                            drpCheckAllItems.RegionOfTarget,
                          );
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpRegionOfTarCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(
                              drpRegionOfTarCheckAll,
                              drpCheckAllItems.RegionOfTarget,
                            );
                          }}
                        />
                      </i>
                    </MenuItem>
                    {workCounData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={workCounDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} xl={3} hidden={pwcLegalEntityOpen}>
                <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                  <InputLabel>PwC Legal Entity</InputLabel>
                  <Select
                    multiple
                    value={pwcLegalDataParam}
                    onChange={handleChangePwcLegal}
                    input={<OutlinedInput label="PwC Legal Entity" />}
                    renderValue={(selected) =>
                      pwcLegalData
                        .filter((name) => selected.includes(name.taxonomyUUID))
                        .map((record) => record.name)
                        .join(', ')
                    }
                    MenuProps={MenuProps}
                  >
                    <MenuItem key="drp123" value="drp123">
                      <Checkbox
                        checked={drpPwcLegalCheckAll}
                        onClick={() => {
                          handleDrpCheckAll(drpPwcLegalCheckAll, drpCheckAllItems.PwCLegalEntity);
                        }}
                      />
                      <i>
                        <ListItemText
                          primary={drpPwcLegalCheckAll === true ? 'Un Check All' : 'Check All'}
                          onClick={() => {
                            handleDrpCheckAll(drpPwcLegalCheckAll, drpCheckAllItems.PwCLegalEntity);
                          }}
                        />
                      </i>
                    </MenuItem>
                    {pwcLegalData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        <Checkbox checked={pwcLegalDataParam.indexOf(item.taxonomyUUID) > -1} />
                        <ListItemText primary={`${item.name}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} xl={3} hidden={publicAnnouncementwithPwCOpen}>
                <FormControl
                  sx={{ m: 1, width: 300 }}
                  disabled={readOnlyNonDeal ? true : false}
                  className={readOnlyNonDeal ? 'dbdropdown-border' : 'dbdropdown'}
                >
                  <InputLabel>Include only publicly announced</InputLabel>
                  <Select
                    value={pubAnmtPwcDataParam}
                    onChange={handleChangePubAnmtPwc}
                    input={<OutlinedInput label="Include only publicly announced" />}
                    MenuProps={MenuProps}
                  >
                    {pubAnmtPwcData.map((item) => (
                      <MenuItem key={item.taxonomyUUID} value={item.taxonomyUUID}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <MultiSelect
                  options={pubAnmtPwcData}
                  value={pubAnmtPwcDataParamText}
                  onChange={handleChangePubAnmtPwc}
                  labelledBy="Include only publicly announced"
                /> */}
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
            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                <InputLabel>Sort</InputLabel>
                <Select
                  value={sortText}
                  onChange={handleSortText}
                  input={<OutlinedInput label="Sort" />}
                  MenuProps={MenuProps}
                >
                  <MenuItem value={'CompletedOn'}>Date of Completion</MenuItem>
                  <MenuItem value={'ClientName'}>Client Name</MenuItem>
                  <MenuItem value={'TargetName'}>Target Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} xl={3}>
              <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                <InputLabel>Sort Order</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={handleSortOrder}
                  input={<OutlinedInput label="Sort Order" />}
                  MenuProps={MenuProps}
                >
                  <MenuItem value={'asc'}>Asc</MenuItem>
                  <MenuItem value={'desc'}>Desc</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{ marginTop: '5px' }}>
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
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                disableElevation
                color="secondary"
                variant="contained"
                className="buttons-bg"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Download
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
                <MenuItem onClick={downloadCreds} disableRipple sx={{ paddingLeft: '20px' }}>
                  <FileDownloadIcon />
                  Excel
                </MenuItem>
                <MenuItem onClick={downloadCredsPpt} disableRipple sx={{ paddingLeft: '20px' }}>
                  <FileDownloadIcon />
                  PPT
                </MenuItem>
              </StyledMenu>
            </Grid>
            <Grid item xs={12} md={2} xl={2} style={{ marginTop: '7px', marginLeft: '-60px' }}>
              <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                <InputLabel>PPT Tombstone Header</InputLabel>
                <Select
                  value={pptDownloadOrder}
                  onChange={handleDownloadOrder}
                  input={<OutlinedInput label="PPT Tombstone Header" />}
                  MenuProps={MenuProps}
                >
                  <MenuItem value={'Target'}>Target Name</MenuItem>
                  <MenuItem value={'Client'}>Client Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <DbCredTable passChildData={setChildData} searchParam={searchParams}></DbCredTable>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default DbDownload;
