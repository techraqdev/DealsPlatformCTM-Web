import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextareaAutosize,
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageContainer from '../../components/container/PageContainer';
import { IInputProps, IProjectWfDTO } from './projectModels';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import {
  getTaxonomyData,
  saveProjectCred,
  getProCredByProjId,
  updataProjectCred,
} from './taxonomyApi';
import { taxonomy, taxonomyCategory } from './taxonomyModels';
import { Form } from 'formik';
import { toastMessage } from '../../common/toastMessage';
import { useNavigate } from 'react-router-dom';
import {
  MessageType,
  Project_Wf_Actions,
  Project_Wf_StatusTypes,
} from '../../common/enumContainer';
import { getProjectWfNextActionsByProjectAPI, projectWfSubmit } from './projectApi';
import { internal_error, pwf_submit } from '../../common/constants/common.constant';
import Add from '@mui/icons-material/Add';
import { MultiSelect, Option } from 'react-multi-select-component';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '90%',
    },
  },
  variant: 'menu' as "menu",
  getContentAnchorEl: null
};
//to do remove

const InputFormV1: FC = () => {
  const navigate = useNavigate();
  const { state }: any = useLocation();

  //set default data and to do remove
  const inputData: IInputProps = {
    showSubmitforPartnerAproval: false,
    showPartnerMarkasApproved: false,
    showClientMarkasApproved: false,
    showPartnerMarkasRejected: false,
    showClientMarkasRejected: false,
    showMarkasneedMoreInfo: false,
    projectCode: '',
    taskCode: '',
    clientName: '',
    showRemoveApproval: false,
  };

  const [inputProps, setInputProps] = React.useState(inputData);

  const [isPartnerManager, setIsPartnerManager] = React.useState(false);
  const [isCanbePublish, setIsCanbePublish] = React.useState(false);
  const [taxonomyData, setTaxonomyData] = React.useState<taxonomy[]>([]);
  const [taxonomyResultData, setTaxonomyResultData] = React.useState<taxonomy[]>([]);
  const [engagements, setEngagements] = React.useState(0);
  const [savedengagements, setSavedEngagements] = React.useState(0);
  const [naturEengagements, setNatureEngagements] = React.useState<string[]>([]);
  const [dealType, setDealType] = React.useState<string[]>([]);
  const [dealValue, setDealValue] = React.useState('');
  const [sector, setSector] = React.useState('');
  const [subSectorData, setSubSectorData] = React.useState<taxonomy[]>([]);
  const [subSector, setSubSector] = React.useState<string[]>([]);
  const [services, setServices] = React.useState<string[]>([]);
  const [transaction, setTransaction] = React.useState('');
  const [announcements, setAnnouncements] = React.useState('');
  const [clientEntityType, setClientEntityType] = React.useState('');

  const [domicileCountry, setDomicileCountry] = React.useState('');
  const [domicileWorkCountry, setDomicileWorkCountry] = React.useState('');
  const [entityNameDisclosed, setEntityNameDisclosed] = React.useState('');
  const [targetEntityType, setTargetEntityType] = React.useState('');
  const [targetEntityName, setTargetEntityName] = React.useState('');
  const [websiteLink, setWebsiteLink] = React.useState('');
  const [businessDescription, setBusinessDescription] = React.useState('');
  const [shortDescription, setShortDescription] = React.useState('');
  const [clientEmail, setClientEmail] = React.useState('');
  const [clientContactName, setClientContactName] = React.useState('');
  const [clientContactNameValid, setClientContactNameValid] = React.useState(false);
  const [clientEmailValid, setClientEmailValid] = React.useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorMsg1, setErrorMsg1] = useState('');

  const [subSectorData1, setSubSectorData1] = React.useState<Option[]>([]);
  const [subSectorDataLst, setSubSectorDataLst] = useState([]);
  const [servicesData, setServicesData] = React.useState<Option[]>([]);
  const [servicesDataLst, setServicesDataLst] = useState([]);

  const [isUpdate, setIsUpdate] = React.useState(false);

  const { projId } = useParams();
  const [tagValue, setTagValue] = React.useState('');
  const [isOpenWfAlert, setIsOpenWfAlert] = React.useState(false);
  const [isDisplayDealvalue, setIsDisplayDealvalue] = useState(true);
  const [isDisplayPublicWebsite, setIsDisplayPublicWebsite] = useState(false);
  const [isDisplayTargetEntityName, setIsDisplayTargetEntityName] = useState(false);
  const [isDisplayTargetEntityType, setIsDisplayTargetEntityType] = useState(false);
  const [isDisplayDomicileCountry, setIsDisplayDomicileCountry] = useState(false);
  const [isDisplayAnnouncements, setIsDisplayAnnouncements] = useState(false);
  const [isDisplayTransaction, setIsDisplayTransaction] = useState(true);
  const [autorizeManagerPartner, setAutorizeManagerPartner] = useState(false);

  // const [onDemandValidation, setOnDemandValidation] = useState(true);
  let onDemandValidation = true;

  useEffect(() => {
    //getTaxonomyResult();
    getProjectWfNextActionsByProject();
    getProjectCred();
    // setInputProps(state);
  }, [projId]);

  const getTaxonomyResult = async (engagementsId) => {
    const result = await getTaxonomyData();
    if (result) {
      setTaxonomyData(result);
      let data;
      if (engagementsId == 1) {
        setIsDisplayTargetEntityType(true);
        setIsDisplayDomicileCountry(true);
        data = result.filter((x) => x.buySide);
      } else if (engagementsId == 2) data = result.filter((x) => x.sellSide);
      else if (engagementsId == 3) data = result.filter((x) => x.nonDeal);
      else {
        data = result;
      }

      if (data) {
        setTaxonomyResultData(data);
        setSubSectorData1(
          data
            .filter((data) => data.categoryId === taxonomyCategory.SubSector)
            .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.displayName })),
        );
        setServicesData(
          data
            .filter((data) => data.categoryId === taxonomyCategory.Services)
            .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.displayName })),
        );
      }

      return data;
    }
  };
  const getProjectWfNextActionsByProject = async () => {
    const wfNextActions = await getProjectWfNextActionsByProjectAPI(projId);
    if (wfNextActions && wfNextActions.data) {
      if (!wfNextActions.data.notManagerPartner) {
        setClientEmail(wfNextActions.data.clientEmail);
        if (wfNextActions.data.clientEmail) {
          if (
            wfNextActions.data.clientEmail &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(wfNextActions.data.clientEmail)
          ) {
            debugger;
            setErrorMsg('Invalid client email');
          }
          else {
            setErrorMsg('');
            setClientEmailValid(true);
          }
        }
        setClientContactName(wfNextActions.data.clientContactName);
        if (wfNextActions.data.clientContactName) {
          if (wfNextActions.data.clientContactName.length <= 2) {
            setErrorMsg1('Client contact name should have at least 3 characters');
          }
          else {
            setErrorMsg1('');
            setClientContactNameValid(true);
          }
        }
        setInputProps(wfNextActions.data);
        if (wfNextActions.data.projectPartnerEmail === wfNextActions.data.taskManagerEmail)
          setIsPartnerManager(true);
        if (wfNextActions.data.projectStatusId === Project_Wf_StatusTypes.Quotable)
          setIsCanbePublish(true);
      } else {
        setAutorizeManagerPartner(true);
      }
    }
  };
  const getProjectCred = async () => {
    setIsDisplayDealvalue(true);
    setIsDisplayTransaction(true);
    setIsDisplayPublicWebsite(false);
    setIsDisplayTargetEntityName(false);
    setIsDisplayTargetEntityType(false);
    setIsDisplayDomicileCountry(false);
    setIsDisplayAnnouncements(false);

    const result = await getProCredByProjId(projId);

    if (result.data && result.data.length > 0) {
      setIsUpdate(true);
      setEngagements(result.data[0].engagementTypeId);

      if (result.data[0].engagementTypeId == 1) {
        setIsDisplayTargetEntityType(true);
        setIsDisplayDomicileCountry(true);
      }

      if (result.data[0].engagementTypeId == 3) {
        //Deal value not to appear if non-Deal

        setIsDisplayDealvalue(false);
        setIsDisplayTransaction(false);
      }
      setSavedEngagements(result.data[0].engagementTypeId);
      setNatureEngagements(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.NatureofEngagement)
          .map((record) => record.taxonomyId),
      );
      setDealType(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.DealType)
          .map((record) => record.taxonomyId),
      );
      setDealValue(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.DealValue)
          .map((record) => record.taxonomyId)[0],
      );

      const subSector = result.data.filter((x) => x.categoryId == taxonomyCategory.SubSector);
      if (subSector && subSector.length > 0) {
        setSubSector(subSector.map((record) => record.taxonomyId));
        setSubSectorDataLst(
          subSector.map((taxonomy) => ({
            value: taxonomy.taxonomyId,
            label: taxonomy.taxonomy,
          })),
        );
      }
      const services = result.data.filter((x) => x.categoryId == taxonomyCategory.Services);
      if (services && services.length > 0) {
        setServices(services.map((record) => record.taxonomyId));
        setServicesDataLst(
          services.map((taxonomy) => ({
            value: taxonomy.taxonomyId,
            label: taxonomy.taxonomy,
          })),
        );
      }
      const transactionValue = result.data
        .filter((x) => x.categoryId == taxonomyCategory.TransactionStatus)
        .map((record) => record.taxonomyId)[0];
      setTransaction(transactionValue);
      if (transactionValue == 132 || transactionValue == 133) {
        setIsDisplayPublicWebsite(true);
      }
      if (transactionValue == 132) {
        setIsDisplayAnnouncements(true);
      }
      // setTransaction(
      //   result.data
      //     .filter((x) => x.categoryId == taxonomyCategory.TransactionStatus)
      //     .map((record) => record.taxonomyId)[0],
      // );
      // setAnnouncements(
      //   result.data
      //     .filter((x) => x.categoryId == taxonomyCategory.A)
      //     .map((record) => record.taxonomyId)[0],
      // );

      setClientEntityType(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.ClientEntityType)
          .map((record) => record.taxonomyId)[0],
      );
      setDomicileCountry(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.DomicileCountry)
          .map((record) => record.taxonomyId)[0],
      );
      setDomicileWorkCountry(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.WorkCountryRegion)
          .map((record) => record.taxonomyId)[0],
      );

      // setEntityNameDisclosed(
      //   result.data
      //     .filter((x) => x.categoryId == taxonomyCategory.EntityNameDisclosed)
      //     .map((record) => record.taxonomyId)[0],
      //);
      setTargetEntityType(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.TargetEntityType)
          .map((record) => record.taxonomyId)[0],
      );
      setTargetEntityName(result.data[0].targetEntityName);

      setAnnouncements(String(result.data[0].quotedinAnnouncements));

      setBusinessDescription(result.data[0].businessDescription);

      setShortDescription(result.data[0].shortDescription);
      const taxonymyRes = await getTaxonomyResult(result.data[0].engagementTypeId);
      if (result.data[0].clientEmail) {
        setClientEmail(result.data[0].clientEmail);
        if (
          result.data[0].clientEmail &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(result.data[0].clientEmail)
        ) {
          setErrorMsg('Invalid client email');
        }
        else {
          setErrorMsg('');
          setClientEmailValid(true);
        }
      }
      if (result.data[0].clientContactName) {
        setClientContactName(result.data[0].clientContactName);
        if (result.data[0].clientContactName.length <= 2) {
          setErrorMsg1('Client contact name should have at least 3 characters');
        }
        else {
          setErrorMsg1('');
          setClientContactNameValid(true);
        }
      }
      let displayTargetEntityName = false;
      const entityNameDisclosedValue = result.data
        .filter((x) => x.categoryId == taxonomyCategory.EntityNameDisclosed)
        .map((record) => record.taxonomyId)[0];
      setEntityNameDisclosed(entityNameDisclosedValue);
      if (entityNameDisclosedValue == 163) {
        setIsDisplayTargetEntityName(true);
        displayTargetEntityName = true;
      }

      // setDescripton(
      //   result.data
      //     .filter((x) => x.categoryId == taxonomyCategory.Services)
      //     .map((record) => record.taxonomyId),
      //   result.data[0].targetEntityName,
      //   false,
      //   taxonymyRes,
      //   displayTargetEntityName,
      //   result.data[0].clientName,
      // );
      // setShortDescription(result.data[0].shortDescription);

      const webSiteUrls = result.data[0].websiteUrl;
      if (webSiteUrls) {
        setTagData(typeof webSiteUrls === 'string' ? webSiteUrls.split(',') : webSiteUrls);
        // if (transactionValue == 132) setIsDisplayAnnouncements(true);
      }
    } else {
      getTaxonomyResult(0);
    }
  };

  const ITEM_HEIGHT = 40;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
    variant: 'menu' as "menu",
    getContentAnchorEl: null
  };

  const setDescripton = (services, targetEntityNameValue, isFromDDLENclosedChnage) => {
    const serviceNames =
      services.length > 1
        ? 'Multiple'
        : taxonomyResultData
          .filter((name) => services.includes(name.taxonomyUUID))
          .map((record) => record.name);
    // const serviceNames = taxonomyResultData
    //   .filter((name) => services.includes(name.taxonomyUUID))
    //   .map((record) => record.name)
    //   .join(', ');

    let shortDesc = '';
    if (isFromDDLENclosedChnage) {
      shortDesc =
        serviceNames +
        ' services' +
        (targetEntityNameValue ? ' on ' + targetEntityNameValue : '') +
        ' for ' +
        ((inputProps && inputProps.clientName) || '') +
        '';
    } //else if (displayTargetEntityName) {
    //   shortDesc =
    //     serviceNames +
    //     ' services' +
    //     (' on ' + targetEntityNameValue) +
    //     ' for ' +
    //     (clientName || '') +
    //     '';
    //}
    else {
      shortDesc =
        serviceNames +
        ' services' +
        (isDisplayTargetEntityName ? ' on ' + targetEntityNameValue : '') +
        ' for ' +
        ((inputProps && inputProps.clientName) || '') +
        '';
    }
    setShortDescription(shortDesc);
    // setShortDescription(
    //   serviceNames +
    //     ' services on ' +
    //     targetEntityNameValue +
    //     ' for ' +
    //     (inputProps && inputProps.clientName) +
    //     '',
    // );
  };

  const handleEngagement = (event) => {
    let data;
    setIsDisplayDealvalue(true);
    setIsDisplayTargetEntityType(false);
    setIsDisplayDomicileCountry(false);
    setIsDisplayPublicWebsite(false);
    setIsDisplayTargetEntityName(false);
    setIsDisplayDomicileCountry(false);
    setIsDisplayAnnouncements(false);
    setDealValue('');
    setTargetEntityName('');
    setDomicileCountry('');
    setIsDisplayTransaction(true);
    setTransaction('');
    if (event.target.value == 1) {
      setIsDisplayTargetEntityType(true);
      setIsDisplayDomicileCountry(true);
    }

    if (event.target.value == 1) data = taxonomyData.filter((x) => x.buySide);
    else if (event.target.value == 2) data = taxonomyData.filter((x) => x.sellSide);
    else if (event.target.value == 3) {
      data = taxonomyData.filter((x) => x.nonDeal);
      setIsDisplayDealvalue(false);
      setIsDisplayTransaction(false);
    } else {
      data = taxonomyData.filter((x) => x.nonDeal || x.buySide || x.sellSide);
    }
    if (data) {
      setTaxonomyResultData(data);

      setSubSectorData1(
        data
          .filter((data) => data.categoryId === taxonomyCategory.SubSector)
          .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.displayName })),
      );
      setServicesData(
        data
          .filter((data) => data.categoryId === taxonomyCategory.Services)
          .map((taxonomy) => ({ value: taxonomy.taxonomyUUID, label: taxonomy.displayName })),
      );
    }
    setEngagements(event.target.value);
    clearStates();
    if (savedengagements == event.target.value) {
      getProjectCred();
    }
  };
  const handleNaturEengagements = (event: SelectChangeEvent<typeof naturEengagements>) => {
    const {
      target: { value },
    } = event;

    setNatureEngagements(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleDealType = (event: SelectChangeEvent<typeof dealType>) => {
    const {
      target: { value },
    } = event;
    setDealType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleSector = (event) => {
    setSector(event.target.value);
    setSubSector([]);
    const subsector = taxonomyData.filter(
      (x) => x.parentId != null && x.categoryId == 6 && x.parentId == event.target.value,
    );
    setSubSectorData(subsector);
  };
  const handleSubSector = (event: SelectChangeEvent<typeof subSector>) => {
    const {
      target: { value },
    } = event;

    setSubSector(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleSubSector1 = (selectedList) => {
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    setSubSector(compUUIDs);
    setSubSectorDataLst(selectedList);
  };
  const handleService1 = (selectedList) => {
    const compUUIDs: string[] = [];
    selectedList.forEach((item: any) => {
      compUUIDs.push(item.value);
    });
    setServices(compUUIDs);
    setServicesDataLst(selectedList);
    setDescripton(compUUIDs, targetEntityName, false);
  };
  const handleService = (event: SelectChangeEvent<typeof services>) => {
    const {
      target: { value },
    } = event;
    setServices(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    setDescripton(value, targetEntityName, false);
  };

  const BCrumb = [
    {
      to: '/db/projects',
      title: 'Projects',
    },
    {
      title: 'Project Cred',
    },
  ];
  const handleSave = async (isFromWf = false) => {
    const tagTextBoxValue = tagValue ? (tagData.length > 0 ? ',' : '') + tagValue : '';
    const webSiteLinks = tagData.join(', ');
    let isSuccess = true;
    const inputdat = {
      clientEmail: clientEmail,
      clientContactName: clientContactName,
      engagementTypeId: engagements ? engagements : null,
      natureofEngagement: naturEengagements.length > 0 ? naturEengagements : [],
      dealType: dealType.length > 0 ? dealType : dealType,
      dealValue: dealValue && dealValue != '' ? [dealValue] : [],
      subSector: subSector.length > 0 ? subSector : subSector,
      servicesProvided: services.length > 0 ? services : services,
      transactionStatus: transaction && transaction != '' ? [transaction] : [],
      projectCredWebsitesInfoDTO: announcements
        ? [
          {
            // websiteLink: tagData.join(', ') + tagTextBoxValue,
            websiteLink: webSiteLinks + tagTextBoxValue,
            pwCNameQuoted: announcements,
          },
        ]
        : [],
      clientEntityType: clientEntityType && clientEntityType != '' ? [clientEntityType] : [],
      parentEntityRegion: domicileCountry && domicileCountry != '' ? [domicileCountry] : [],
      workRegion: domicileWorkCountry && domicileWorkCountry != '' ? [domicileWorkCountry] : [],
      entityNameDisclose:
        entityNameDisclosed && entityNameDisclosed != '' ? [entityNameDisclosed] : [],
      targetEntityType: targetEntityType && targetEntityType != '' ? [targetEntityType] : [],
      projectId: projId,
      targetEntityName: targetEntityName,
      businessDescription: businessDescription,
      shortDescription: shortDescription,
    };

    if (
      (isDisplayTargetEntityName && !targetEntityName) ||
      (isDisplayDealvalue && !dealValue) ||
      (isDisplayTransaction && !transaction) ||
      (isDisplayTargetEntityType && !targetEntityType) ||
      (isDisplayDomicileCountry && !domicileWorkCountry) ||
      (isDisplayAnnouncements && !announcements)
    ) {
      onDemandValidation = false;
    }
    // if (isDisplayDealvalue && !dealValue) {
    //   onDemandValidation = false;
    // }
    // if (isDisplayTargetEntityType && !targetEntityType) {
    //   onDemandValidation = false;
    // }
    // if (isDisplayDomicileCountry && !domicileWorkCountry) {
    //   onDemandValidation = false;
    // }
    if (
      //(
      (engagements &&
        naturEengagements.length > 0 &&
        dealType.length > 0 &&
        subSector.length > 0 &&
        businessDescription &&
        services.length > 0 &&
        // transaction &&
        // Number(announcements) >= 0 &&
        // announcements &&
        clientEntityType &&
        domicileCountry &&
        // // domicileWorkCountry &&
        entityNameDisclosed &&
        // targetEntityType &&
        clientEmail &&
        onDemandValidation &&
        shortDescription
      ) ||
      !isFromWf
      // ) && clientEmailValid && clientContactNameValid
    ) {
      if (!isUpdate) {
        const res = await saveProjectCred(inputdat);
        if (res && res.data && res.data.status === 200) {
          toastMessage(MessageType.Success, 'Data saved successfully');
          isSuccess = true;
          if (!isFromWf) {
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          }
        } else {
          isSuccess = false;

          toastMessage(MessageType.Error, internal_error);
        }
      } else {
        const res = await updataProjectCred(projId, inputdat);
        if (res && res.data && res.data.status === 200) {
          isSuccess = true;
          toastMessage(MessageType.Success, 'Data updated successfully');
          if (!isFromWf) {
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          }
          // navigate('/db/projects');
        } else {
          toastMessage(MessageType.Error, internal_error);
          isSuccess = false;
        }
      }
    } else {
      console.log('form invalid:Please fill all mandatory fields');
      toastMessage(MessageType.Warning, 'Please fill all mandatory fields');
      return false;
    }
    return isSuccess;
  };

  const handleWfChange = async (wfStatus: number, wfAction: number) => {
    const projectWFModel: IProjectWfDTO = {
      projectId: projId,
      ProjectWfStatustypeId: wfStatus,
      ProjectWfActionId: wfAction,
    };
    let res1 = true;
    if (clientEmailValid && clientContactNameValid) {
      if (
        wfAction == Project_Wf_Actions.MarkasApprovedPartner ||
        wfAction == Project_Wf_Actions.SubmitforPartnerAproval ||
        wfAction == Project_Wf_Actions.MarkasApprovedClient
      ) {
        res1 = await handleSave(true);
      }
      if (res1) {
        const res = await projectWfSubmit(projectWFModel);
        if (res && res.data && res.data.status === 200) {
          toastMessage(MessageType.Success, pwf_submit);
          navigate('/db/projects');
        } else {
          toastMessage(MessageType.Error, internal_error);
        }
      }
      else {
        console.log('error');
      }
    } else {
      console.log('error');
      console.log('form invalid:Please fill all mandatory fields');
      toastMessage(MessageType.Warning, 'Please fill all mandatory fields');
    }
  };
  const clearStates = () => {
    setNatureEngagements([]);
    setDealType([]);
    setDealValue('');
    setSector('');
    setSubSectorData([]);
    setSubSector([]);
    setServices([]);
    setTransaction('');
    setAnnouncements('');
    setClientEntityType('');

    setDomicileCountry('');
    setDomicileWorkCountry('');
    setEntityNameDisclosed('');
    setTargetEntityType('');
    setTargetEntityName('');
    setWebsiteLink('');
    setBusinessDescription('');
    setShortDescription('');
  };

  const [tagData, setTagData] = React.useState<string[]>([]);
  const removeTagData = (indexToRemove) => {
    setTagData([...tagData.filter((_, index) => index !== indexToRemove)]);
    // if (tagData.length == 1) {
    //   setIsDisplayAnnouncements(false);
    // }
  };
  const addTagData = (event) => {
    // setIsDisplayAnnouncements(false);
    // if (event.target.value &&
    if (Number(transaction) == 132) {
      setIsDisplayAnnouncements(true);
    }
    if (event.target.value !== '') {
      setTagData([...tagData, event.target.value]);
      setTagValue('');
      event.target.value = '';
    }
  };

  const handleChange = (event) => {
    // setIsDisplayAnnouncements(false);
    // if (event.target.value) {
    //   setIsDisplayAnnouncements(true);
    // }
    setTagValue(event.target.value);
    // setAnnouncements('0');
  };

  const handleChangeCEmail = (event) => {
    setClientEmail(event.target.value);
    if (
      event.target.value &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(event.target.value)
    ) {
      setErrorMsg('Invalid client email');
      setClientEmailValid(false);
    }
    else {
      setErrorMsg('');
      setClientEmailValid(true);
    }
  };
  const handleClientContactName = (event) => {
    debugger;
    setClientContactName(event.target.value);
    if (event.target.value.length <= 2) {
      setErrorMsg1('Client contact name should have at least 3 characters');
      setClientContactNameValid(false);
    }
    else {
      setErrorMsg1('');
      setClientContactNameValid(true);
    }
  };
  const handleApproveParter = () => {
    debugger;
    if (clientEmailValid && clientContactNameValid) {
      setIsOpenWfAlert(true);
    } else {
      console.log('form invalid:Please fill all mandatory fields');
      toastMessage(MessageType.Warning, 'Please fill all mandatory fields');
    }

  }
  const setTagValueClick = (event) => {
    // setIsDisplayAnnouncements(false);
    if (event.target.value !== '' && Number(transaction) == 132) {
      setTagValue(event.target.value);
      // setIsDisplayAnnouncements(true);
    }
  };
  const addTagDataClick = () => {
    if (tagValue !== '') {
      setTagData([...tagData, tagValue]);
      setTagValue('');
    }
  };
  const customValueSector = (selected, _options) => {
    return selected.length ? selected.map(({ label }) => label + ', ') : 'Sector & Sub sector';
  };
  const customValueService = (selected, _options) => {
    return selected.length ? selected.map(({ label }) => label + ', ') : 'Service';
  };
  return (
    <PageContainer title="Project Cred" description="display project cred">
      {/* breadcrumb */}
      <Breadcrumb title={'Project Cred'} items={BCrumb} />
      {/* end breadcrumb */}
      {!autorizeManagerPartner ? (
      <Card>
      <CardContent>
        <Grid container spacing={1} className="mt-25 mb25">
          <Grid item xs={12} md={2} xl={2} className="addScSpace add-user">
            <InputLabel>
              <b>Project Code:{inputProps && inputProps.projectCode}</b>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={2} xl={2} className="addScSpace add-user">
            <InputLabel>
              <b>Task Code:{inputProps && inputProps.taskCode}</b>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={3} xl={3} className="addScSpace add-user">
            <InputLabel>
              <b>Client Name:{inputProps && inputProps.clientName}</b>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={1} xl={1} className="addScSpace add-user">
            <InputLabel>
              <InputLabel>Client Email</InputLabel>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={4} xl={4}>
            <FormControl sx={{ m: 1, width: '82%' }}>
              <TextField
                size="small"
                name="clientEmail"
                id="txtClientEmail"
                value={clientEmail}
                error={clientEmail ? false : true}
                onChange={handleChangeCEmail}
                placeholder="Client Email"
              ></TextField>
              {/* {!clientEmail && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please enter client email
                </p>
              )} */}
              <span className="Mui-error" style={{ margin: '2px 15px' }}>{errorMsg}</span>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2} xl={2} className="addScSpace add-user">
            <InputLabel>
              <InputLabel>Client Contact Name</InputLabel>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={4} xl={4}>
            <FormControl sx={{ m: 1, width: '82%' }}>
              <TextField
                size="small"
                name="clientContactName"
                id="txtClientContactName"
                value={clientContactName}
                error={clientContactName ? false : true}
                required={true}
                onChange={handleClientContactName}
                placeholder="Client Contact Name"
              ></TextField>
              <span className="Mui-error">{errorMsg1}</span>
            </FormControl>
          </Grid>
        </Grid>
        {/* <Form> */}
        <div className="section">Section 1: Deal &#38; Engagement information</div>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>Engagement Type</InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Engagement Type
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={engagements}
                onChange={handleEngagement}
                error={engagements ? false : true}
                input={
                  <OutlinedInput
                    label="Engagement Type"
                    className="multi-select-dropdown-outline"
                  />
                }
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                <MenuItem value={0} className="multi-select-dropdown">
                  Select Engagement Type
                </MenuItem>
                <MenuItem value={1} className="multi-select-dropdown">
                  Buy Side
                </MenuItem>
                <MenuItem value={2} className="multi-select-dropdown">
                  Sell Side
                </MenuItem>
                <MenuItem value={3} className="multi-select-dropdown">
                  Non Deal
                </MenuItem>
              </Select>
              {/* {!engagements && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select engagement type
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>Nature of Engagement / Deal</InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Nature of Engagement / Deal
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={naturEengagements}
                onChange={handleNaturEengagements}
                error={naturEengagements.length > 0 ? false : true}
                input={
                  <OutlinedInput
                    label="Nature of Engagement / Deal"
                    className="multi-select-dropdown-outline"
                  />
                }
                renderValue={(selected) =>
                  taxonomyResultData
                    .filter((name) => selected.includes(name.taxonomyUUID))
                    .map((record) => record.name)
                    .join(', ')
                }
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                {taxonomyResultData
                  .filter((x) => x.categoryId == taxonomyCategory.NatureofEngagement)
                  .map((taxonomy) => (
                    <MenuItem
                      key={taxonomy.taxonomyUUID}
                      value={taxonomy.taxonomyUUID}
                      className="multi-select-dropdown"
                    >
                      <Checkbox checked={naturEengagements.indexOf(taxonomy.taxonomyUUID) > -1} />
                      <ListItemText primary={taxonomy.name} />
                    </MenuItem>
                  ))}
              </Select>

              {/* {naturEengagements.length <= 0 && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select nature of engagement
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>Nature of Transaction (Deal) / Nature of Work (Non Deal)</InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Nature of Transaction (Deal) / Nature of Work (Non Deal)
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={dealType}
                onChange={handleDealType}
                error={dealType.length > 0 ? false : true}
                input={
                  <OutlinedInput
                    label="Nature of Transaction (Deal) / Nature of Work (Non Deal)"
                    className="multi-select-dropdown-outline"
                  />
                }
                renderValue={(selected) =>
                  taxonomyResultData
                    .filter((name) => selected.includes(name.taxonomyUUID))
                    .map((record) => record.name)
                    .join(', ')
                }
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                {taxonomyResultData
                  .filter((x) => x.categoryId == taxonomyCategory.DealType)
                  .map((taxonomy) => (
                    <MenuItem
                      key={taxonomy.taxonomyUUID}
                      value={taxonomy.taxonomyUUID}
                      className="multi-select-dropdown"
                    >
                      <Checkbox checked={dealType.indexOf(taxonomy.taxonomyUUID) > -1} />
                      <ListItemText primary={taxonomy.name} />
                    </MenuItem>
                  ))}
              </Select>
              {/* {dealType.length <= 0 && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select type of work
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        {isDisplayDealvalue == true ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>Deal Value</InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Deal Value
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={dealValue}
                  onChange={(event) => setDealValue(event.target.value)}
                  input={
                    <OutlinedInput label="Deal Value" className="multi-select-dropdown-outline" />
                  }
                  error={dealValue ? false : true}
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  {taxonomyResultData
                    .filter((x) => x.categoryId == taxonomyCategory.DealValue)
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

                {/* {!dealValue && (
                  <p className="Mui-error" style={{ margin: '2px 15px' }}>
                    Please select deal value
                  </p>
                )} */}
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <Grid container spacing={1} style={{ display: 'none' }}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Please select appropriate sector for the engagement. (If the client and target
              entities are same then select the what is applicable to the client entity(ies)
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Sector
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={sector}
                onChange={handleSector}
                input={<OutlinedInput label="Sector" className="multi-select-dropdown-outline" />}
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                {taxonomyResultData
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
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Please select appropriate sector & sub-sector for the engagement. (If the client and
              target entities are same then select what is applicable to the client entity(ies)
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <MultiSelect
                options={subSectorData1}
                value={subSectorDataLst}
                onChange={handleSubSector1}
                labelledBy="Select"
                valueRenderer={customValueSector}
                overrideStrings={{ selectAll: 'Check All' }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Business description of entity(ies) on which the work has been performed in up to 50
              characters (e.g. paper manufacturing; power distribution; NBFC)
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <TextField
                size="small"
                value={businessDescription}
                name="projectC"
                id="txtProjectC"
                className="textbox-feild"
                error={businessDescription ? false : true}
                onChange={(event) => setBusinessDescription(event.target.value)}
                inputProps={{ maxLength: 50 }}
                placeholder="Business description"
              ></TextField>
              {/* {!businessDescription && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please add business description
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Please select the services provided by PwC on the engagement. (Select multiple
              services if applicable.)
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <MultiSelect
                options={servicesData}
                value={servicesDataLst}
                onChange={handleService1}
                labelledBy="Select"
                valueRenderer={customValueService}
                overrideStrings={{ selectAll: 'Check All' }}
              />
            </FormControl>
          </Grid>
        </Grid>
        {isDisplayTransaction == true ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>Transaction status</InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Transaction status
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={transaction}
                  onChange={(event) => {
                    setTransaction(event.target.value);
                    setIsDisplayPublicWebsite(false);
                    setTagValue('');
                    setTagData([]);
                    setAnnouncements('0');
                    setIsDisplayAnnouncements(false);
                    if (
                      Number(event.target.value) === 132 ||
                      Number(event.target.value) === 133
                    ) {
                      setIsDisplayPublicWebsite(true);
                    }
                    if (Number(event.target.value) === 132) {
                      setIsDisplayAnnouncements(true);
                    }
                  }}
                  error={transaction ? false : true}
                  input={
                    <OutlinedInput
                      label="Transaction status"
                      className="multi-select-dropdown-outline"
                    />
                  }
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  {taxonomyResultData
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
                {/* {!transaction && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select transaction status
                </p>
              )} */}
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        {isDisplayPublicWebsite == true ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Please provide links to public website(s) if the engagement was announced
              </InputLabel>
            </Grid>
            <Grid item xs={11} md={6} xl={6}>
              <FormControl sx={{ m: 1, width: '100%' }}>
                <ul className="tags">
                  {tagData.map((tag, index) => (
                    <li key={index} className="tag">
                      <span className="tag-title">{tag}</span>
                      <span className="tag-close-icon" onClick={() => removeTagData(index)}>
                        x
                      </span>
                    </li>
                  ))}
                </ul>
                <TextField
                  size="small"
                  name="projectC"
                  value={tagValue}
                  onChange={handleChange}
                  id="txtProjectC"
                  onKeyUp={(event) =>
                    event.key === 'Enter' ? addTagData(event) : setTagValueClick(event)
                  }
                  placeholder="Please provide links to public website(s) if the engagement was announced"
                ></TextField>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={1}
              md={1}
              xl={1}
              style={{ marginTop: tagData.length > 0 ? '3%' : '0%' }}
            >
              <Tooltip title="Add Web Site">
                <IconButton
                  onClick={(event) => addTagDataClick()}
                  style={{ marginTop: '12px', marginLeft: '5px' }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        {isDisplayAnnouncements ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>Was PwCs name quoted in any of the announcements?</InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Announcements
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={announcements}
                  onChange={(event) => setAnnouncements(event.target.value)}
                  input={
                    <OutlinedInput
                      label="Announcements"
                      className="multi-select-dropdown-outline"
                    />
                  }
                  error={isDisplayAnnouncements && announcements ? false : true}
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  <MenuItem key="Y" value="1" className="multi-select-dropdown">
                    Yes
                  </MenuItem>
                  <MenuItem key="N" value="0" className="multi-select-dropdown">
                    No
                  </MenuItem>
                </Select>

                {/* {isDisplayAnnouncements && !announcements && (
                  <p className="Mui-error" style={{ margin: '2px 15px' }}>
                    Please select announcement
                  </p>
                )} */}
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
        <div className="section">Section 2: Client and / or Target information</div>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Can entity name(s) be disclosed as a credential as per the EL/ToB/Contract? (Please
              refer EL/Contract for any restriction with respect to citation/credential.)
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Entity Name Disclosed
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={entityNameDisclosed}
                error={entityNameDisclosed ? false : true}
                onChange={(event) => {
                  setIsDisplayTargetEntityName(false);
                  setTargetEntityName('');
                  setEntityNameDisclosed(event.target.value);
                  if (Number(event.target.value) == 163) {
                    setIsDisplayTargetEntityName(true);
                    setDescripton(services, targetEntityName, true);
                  } else setDescripton(services, '', true);
                }}
                input={
                  <OutlinedInput
                    label="Sector and sub-sector"
                    className="multi-select-dropdown-outline"
                  />
                }
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                {taxonomyResultData
                  .filter((x) => x.categoryId == taxonomyCategory.EntityNameDisclosed)
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
              {/* {!entityNameDisclosed && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select entity name disclosed
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Client entity type (Govt. or others).
              <br></br>
              <p className="input-form-cl-entity">
                <span>
                  Government client includes: Indian and Overseas Government Organizations
                  (including assignments with network firm where end client is overseas
                  Government); Government departments and regulatory agencies; Public sector
                  enterprise - Entities incorporated through legislations/ Government orders -
                  Entities in which Government / Government agencies have 51% or more stake -
                  Entities in which Government has taken over the management control of the
                  entity; International Development/ Bilateral/ Multilateral agencies like World
                  Bank, Asian Development Bank etc. Also applies for the end client of a Network
                  Firm led engagement.
                </span>
                {/* <br />
                &nbsp;&nbsp;
                <span>
                  If client is an overseas entity, please input client&#39;s region country;if
                  client is an Indian subsidiary, then select ultimate parent&#39;sk an Indian
                  subsidiary, then select ultimate parent&#39;s
                </span> */}
              </p>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Client Entity Type
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={clientEntityType}
                onChange={(event) => setClientEntityType(event.target.value)}
                error={clientEntityType ? false : true}
                input={
                  <OutlinedInput
                    label="Client Entity Type"
                    className="multi-select-dropdown-outline"
                  />
                }
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                {taxonomyResultData
                  .filter((x) => x.categoryId == taxonomyCategory.ClientEntityType)
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

              {/* {!clientEntityType && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select client entity type
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              {/* Client&apos;s Ultimate Parent entity&apos;s domicile country/region */}
              Client&apos;s or Client&apos;s Ultimate Parent entity&apos;s domicile country/region
              &nbsp;&nbsp;
              <p className="input-form-cl-entity">
                If client is an oversees entity, please input client&#39;s region/country; if
                client is an Indian subsidiary then select ultimate parent&#39;s region/country
              </p>
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                className="multi-select-dropdown-outline"
              >
                Domicile Country
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={domicileCountry}
                onChange={(event) => setDomicileCountry(event.target.value)}
                input={
                  <OutlinedInput
                    label="Domicile Country"
                    className="multi-select-dropdown-outline"
                  />
                }
                error={domicileCountry ? false : true}
                MenuProps={MenuProps}
                className="multi-select-dropdown"
              >
                {taxonomyResultData
                  .filter((x) => x.categoryId == taxonomyCategory.DomicileCountry)
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

              {/* {!domicileCountry && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Please select domicile country
                </p>
              )} */}
            </FormControl>
          </Grid>
        </Grid>
        {isDisplayDomicileCountry ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                {/* Domicile country/region of the entity on which work has been performed. */}
                Domicile country/region of Target
              </InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Domicile Work Country
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={domicileWorkCountry}
                  onChange={(event) => setDomicileWorkCountry(event.target.value)}
                  //onChange={handleDomicileCountry}
                  input={
                    <OutlinedInput
                      label="Domicile Work Country"
                      className="multi-select-dropdown-outline"
                    />
                  }
                  error={isDisplayDomicileCountry && domicileWorkCountry ? false : true}
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  {taxonomyResultData
                    .filter((x) => x.categoryId == taxonomyCategory.WorkCountryRegion)
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
                {/* {isDisplayDomicileCountry && !domicileWorkCountry && (
                  <p className="Mui-error" style={{ margin: '2px 15px' }}>
                    Please select domicile work country
                  </p>
                )} */}
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          ''
        )}

        {isDisplayTargetEntityName == true ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>Please mention the Target entity name.</InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <TextField
                  size="small"
                  value={targetEntityName}
                  name="projectC"
                  id="txtProjectC"
                  onChange={(event) => {
                    setTargetEntityName(event.target.value);
                    setDescripton(services, event.target.value, false);
                  }}
                  error={isDisplayTargetEntityName && targetEntityName ? false : true}
                  placeholder="Please mention the Target entity name"
                ></TextField>
                {/* {isDisplayTargetEntityName && !targetEntityName && (
                  <p className="Mui-error" style={{ margin: '2px 15px' }}>
                    Please enter target entity name
                  </p>
                )} */}
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          ''
        )}

        {isDisplayTargetEntityType ? (
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Target entity type (Govt. or others).
                <br></br>
                <p className="input-form-cl-entity">
                  Government client includes: Indian and Overseas Government Organizations
                  (including assignments with network firm where end client is overseas
                  Government); Government departments and regulatory agencies; Public sector
                  enterprise - Entities incorporated through legislations/ Government orders -
                  Entities in which Government / Government agencies have 51% or more stake -
                  Entities in which Government has taken over the management control of the
                  entity; International Development/ Bilateral/ Multilateral agencies like World
                  Bank, Asian Development Bank etc. Also applies for the end client of a Network
                  Firm led engagement
                </p>
              </InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Target Entity Type
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={targetEntityType}
                  onChange={(event) => setTargetEntityType(event.target.value)}
                  input={
                    <OutlinedInput label="Service" className="multi-select-dropdown-outline" />
                  }
                  error={isDisplayTargetEntityType && targetEntityType ? false : true}
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  {taxonomyResultData
                    .filter((x) => x.categoryId == taxonomyCategory.TargetEntityType)
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
                {/* {isDisplayTargetEntityType && !targetEntityType && (
                  <p className="Mui-error" style={{ margin: '2px 15px' }}>
                    Please select target entity type
                  </p>
                )} */}
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          ''
        )}

        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
            <InputLabel>
              Short description (max 150 characters) of the project that will be mentioned as a
              tombstone - a suggested description is provided in the box - please change if
              required (If you are making changes, please ensure that the description is in the
              format which would go into the proposal. If Client / target names can be disclosed,
              please ensure the description include the Client / target names.) (Please refer
              EL/Contract/RFP for any restriction with respect to citation / credential.)
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={7} xl={7}>
            <FormControl sx={{ m: 1, width: '90%' }}>
              <TextField
                name="projectC"
                id="txtProjectC"
                multiline={true}
                value={shortDescription}
                // style={{ height: '40px' }}
                onChange={(event) => setShortDescription(event.target.value)}
                // className={!shortDescription ? 'Mui-error' : ''}
                minRows={1}
                inputProps={{ maxLength: 150 }}
                // inputProps={{ maxLength: 50 }}
                error={shortDescription ? false : true}
                placeholder="Short description"
              ></TextField>
              {/* {!shortDescription && (
                <p className="Mui-error" style={{ margin: '2px 15px' }}>
                  Required
                </p>

              )} */}
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={12} md={12} xl={12} style={{ textAlign: 'end' }}>
            <Button
              color="secondary"
              variant="outlined"
              style={{ margin: '5px' }}
              className="reset-buttons-bg"
              onClick={() => {
                navigate('/db/projects');
              }}
            >
              Cancel
            </Button>
            {isPartnerManager &&
              (inputProps.showPartnerMarkasApproved ||
                inputProps.showSubmitforPartnerAproval ||
                inputProps.showClientMarkasApproved) && (
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </Button>
              )}
            {!isPartnerManager && inputProps &&
              (inputProps.showSubmitforPartnerAproval ||
                inputProps.showClientMarkasApproved ||
                inputProps.showRemoveApproval ||
                inputProps.showPartnerMarkasRejected) && (
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </Button>
              )}
            {/* {inputProps &&
              (inputProps.showSubmitforPartnerAproval ||
                inputProps.showPartnerMarkasApproved ||
                inputProps.showClientMarkasApproved ||
                inputProps.showRemoveApproval) && (
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </Button>
              )} */}
            {isPartnerManager && (
              inputProps && (inputProps.showPartnerMarkasApproved || inputProps.showSubmitforPartnerAproval) && (
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                  onClick={handleApproveParter}
                >
                  Approve By Partner
                </Button>
              )
            )}
            {!isPartnerManager && (
              inputProps && inputProps.showSubmitforPartnerAproval && (
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                  onClick={() => {
                    handleWfChange(
                      Project_Wf_StatusTypes.PartnerApprovalPending,
                      Project_Wf_Actions.SubmitforPartnerAproval,
                    );
                  }}
                >
                  Submit For Partner Approval
                </Button>
              )
            )}
            {!isPartnerManager && !isCanbePublish && (
              inputProps && inputProps.showPartnerMarkasApproved && (
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  style={{ margin: '5px' }}
                  className="buttons-bg"
                  onClick={handleApproveParter}
                >
                  Approve By Partner
                </Button>
              )
            )}

            {/* {inputProps && inputProps.showSubmitforPartnerAproval && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={() => {
                  handleWfChange(
                    Project_Wf_StatusTypes.PartnerApprovalPending,
                    Project_Wf_Actions.SubmitforPartnerAproval,
                  );
                }}
              >
                Submit For Partner Approval
              </Button>
            )}
            {inputProps && inputProps.showPartnerMarkasApproved && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={handleApproveParter}
              >
                Approve By Partner
              </Button>
            )} */}



            {inputProps && inputProps.showClientMarkasApproved && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={() => {
                  handleWfChange(
                    Project_Wf_StatusTypes.Approved,
                    Project_Wf_Actions.MarkasApprovedClient,
                  );
                }}
              >
                Approve By Client
              </Button>
            )}
            {inputProps && inputProps.showPartnerMarkasRejected && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={() => {
                  handleWfChange(
                    Project_Wf_StatusTypes.RejectedbyPartner,
                    Project_Wf_Actions.MarkasRejectedPartner,
                  );
                }}
              >
                Reject By Partner
              </Button>
            )}
            {inputProps && inputProps.showClientMarkasRejected && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={() => {
                  handleWfChange(
                    Project_Wf_StatusTypes.RejectedbyClient,
                    Project_Wf_Actions.MarkasRejectedClient,
                  );
                }}
              >
                Reject By Client
              </Button>
            )}
            {inputProps && inputProps.showMarkasneedMoreInfo && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={() => {
                  handleWfChange(
                    Project_Wf_StatusTypes.ClientSeekingMoreInfo,
                    Project_Wf_Actions.MarkasneedMoreInfo,
                  );
                }}
              >
                Client Need MoreInfo
              </Button>
            )}
            {inputProps && inputProps.showRemoveApproval && (
              <Button
                type="button"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={() => {
                  handleWfChange(
                    Project_Wf_StatusTypes.PartnerApprovalPending,
                    Project_Wf_Actions.RemoveApproval,
                  );
                }}
              >
                Remove Approval
              </Button>
            )}
          </Grid>
          {/* <Grid item xs={12} md={12} xl={12}>
            <span style={{ fontSize: '15px', color: 'red', float: 'right', fontWeight: '800' }}>
              Note: Please Click save button to update details before performing your action.
            </span>
          </Grid> */}
        </Grid>
        {/* </Form> */}
      </CardContent>

      <Dialog
        open={isOpenWfAlert}
        onClose={() => {
          setIsOpenWfAlert(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{ }</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* Please check and confirm the below details */}
            Once you click proceed, an email will be sent to the client asking to confirm the
            short description which will be appearing as a Deals Credential. Please click cancel
            and edit the one-line description if any change is required.
          </DialogContentText>
          <br />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={6}>
              <CustomTextField
                id="txtClientName"
                label="Client Name"
                variant="standard"
                fullWidth
                size="small"
                value={inputProps && inputProps.clientName}
                inputProps={{ readOnly: true }}
              ></CustomTextField>
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <CustomTextField
                id="txtclienteMail"
                label="Client Email"
                variant="standard"
                fullWidth
                size="small"
                value={clientEmail}
                inputProps={{ readOnly: true }}
              ></CustomTextField>
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <CustomTextField
                id="txtclientContactName"
                label="Client Contact Name"
                variant="standard"
                fullWidth
                size="small"
                value={clientContactName}
                inputProps={{ readOnly: true }}
              ></CustomTextField>
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <CustomTextField
                id="txtshortDiscription"
                label="One line descripton"
                variant="standard"
                fullWidth
                minRows={1}
                multiline={true}
                value={shortDescription}
                inputProps={{ readOnly: true }}
              ></CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setIsOpenWfAlert(false);
            }}
            className="reset-buttons-bg"
          >
            Cancel
          </Button>

          <Button
            type="button"
            color="secondary"
            variant="contained"
            style={{ margin: '5px' }}
            className="buttons-bg"
            onClick={() => {
              handleWfChange(
                Project_Wf_StatusTypes.ClientApprovalPending,
                Project_Wf_Actions.MarkasApprovedPartner,
              );
            }}
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
  );
};
export default InputFormV1;
