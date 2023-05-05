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
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageContainer from '../../components/container/PageContainer';
import CheckboxesAutocomplete from '../../components/forms/custom-elements/CheckboxesAutocomplete';
import { IInputProps, IProjectWfDTO, ISelectProps, IUseCaseModel } from './projectModels';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import {
  getTaxonomyData,
  saveProjectCred,
  getProCredByProjId,
  updataProjectCred,
} from './taxonomyApi';
import { dropdown, taxonomy, taxonomyCategory, engagement } from './taxonomyModels';
import { yupToFormErrors } from 'formik';
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
import { grid } from '@mui/system';
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

const InputForm: FC = () => {
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

  const [taxonomyData, setTaxonomyData] = React.useState<taxonomy[]>([]);
  const [taxonomyResultData, setTaxonomyResultData] = React.useState<taxonomy[]>([]);
  const [engagements, setEngagements] = React.useState(1);
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
  const [isUpdate, setIsUpdate] = React.useState(false);
  const { projId } = useParams();
  const [tagValue, setTagValue] = React.useState('');
  const [isOpenWfAlert, setIsOpenWfAlert] = React.useState(false);
  const [isDisplayDealvalue, setIsDisplayDealvalue] = useState(true);
  const [isDisplayPublicWebsite, setIsDisplayPublicWebsite] = useState(false);
  const [isDisplayTargetEntityName, setIsDisplayTargetEntityName] = useState(false);

  useEffect(() => {
    //getTaxonomyResult();
    getProjectCred();
    // setInputProps(state);
    getProjectWfNextActionsByProject();
  }, [projId]);

  const getTaxonomyResult = async (engagementsId) => {
    const result = await getTaxonomyData();
    if (result) {
      setTaxonomyData(result);
      let data;
      if (engagementsId == 1) data = result.filter((x) => x.buySide);
      else if (engagementsId == 2) data = result.filter((x) => x.sellSide);
      else if (engagementsId == 3) data = result.filter((x) => x.nonDeal);
      setTaxonomyResultData(data);
    }
  };
  const getProjectWfNextActionsByProject = async () => {
    const wfNextActions = await getProjectWfNextActionsByProjectAPI(projId);
    if (wfNextActions && wfNextActions.data) {
      setClientEmail(wfNextActions.data.clientEmail);
      setInputProps(wfNextActions.data);
    }
  };
  const getProjectCred = async () => {
    setIsDisplayDealvalue(true);
    setIsDisplayPublicWebsite(false);
    setIsDisplayTargetEntityName(false);

    const result = await getProCredByProjId(projId);
    if (result.data && result.data.length > 0) {
      setIsUpdate(true);
      setEngagements(result.data[0].engagementTypeId);

      if (result.data[0].engagementTypeId == 3) {
        //Deal value not to appear if non-Deal

        setIsDisplayDealvalue(false);
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
      }
      setServices(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.Services)
          .map((record) => record.taxonomyId),
      );
      const transactionValue = result.data
        .filter((x) => x.categoryId == taxonomyCategory.TransactionStatus)
        .map((record) => record.taxonomyId)[0];
      setTransaction(transactionValue);
      if (transactionValue == 132 || transactionValue == 133) {
        setIsDisplayPublicWebsite(true);
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
      const entityNameDisclosedValue = result.data
        .filter((x) => x.categoryId == taxonomyCategory.EntityNameDisclosed)
        .map((record) => record.taxonomyId)[0];
      setEntityNameDisclosed(entityNameDisclosedValue);
      if (entityNameDisclosedValue == 163) {
        setIsDisplayTargetEntityName(true);
      }

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
      setAnnouncements(result.data[0].quotedinAnnouncements);
      setBusinessDescription(result.data[0].businessDescription);
      setShortDescription(result.data[0].shortDescription);
      getTaxonomyResult(result.data[0].engagementTypeId);
      if (result.data[0].clientEmail) {
        setClientEmail(result.data[0].clientEmail);
      }
      setDescripton(
        result.data
          .filter((x) => x.categoryId == taxonomyCategory.Services)
          .map((record) => record.taxonomyId),
        result.data[0].targetEntityName,
        false,
      );
    } else {
      getTaxonomyResult(1);
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
    const serviceNames = taxonomyResultData
      .filter((name) => services.includes(name.taxonomyUUID))
      .map((record) => record.name)
      .join(', ');

    let shortDesc = '';
    if (isFromDDLENclosedChnage) {
      shortDesc =
        serviceNames +
        ' services' +
        (targetEntityNameValue ? ' on ' + targetEntityNameValue : '') +
        ' for ' +
        ((inputProps && inputProps.clientName) || '') +
        '';
    } else {
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

    if (event.target.value == 1) data = taxonomyData.filter((x) => x.buySide);
    else if (event.target.value == 2) data = taxonomyData.filter((x) => x.sellSide);
    else if (event.target.value == 3) {
      data = taxonomyData.filter((x) => x.nonDeal);
      setIsDisplayDealvalue(false);
    }
    setTaxonomyResultData(data);
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
  const handleSave = async () => {
    const inputdat = {
      clientEmail: clientEmail,
      engagementTypeId: engagements,
      natureofEngagement: naturEengagements.length > 0 ? naturEengagements : [],
      dealType: dealType.length > 0 ? dealType : dealType,
      dealValue: dealValue && dealValue != '' ? [dealValue] : [],
      subSector: subSector.length > 0 ? subSector : subSector,
      servicesProvided: services.length > 0 ? services : services,
      transactionStatus: transaction && transaction != '' ? [transaction] : [],
      projectCredWebsitesInfoDTO: [
        {
          websiteLink: tagData.join(', '),
          pwCNameQuoted: announcements,
        },
      ],
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
    if (!isUpdate) {
      const res = await saveProjectCred(inputdat);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, 'Data saved successfully');
        // navigate('/db/projects');
      }
    } else {
      const res = await updataProjectCred(projId, inputdat);
      if (res && res.data && res.data.status === 200) {
        toastMessage(MessageType.Success, 'Data updated successfully');
        // navigate('/db/projects');
      }
    }
  };

  const handleWfChange = async (wfStatus: number, wfAction: number) => {
    const projectWFModel: IProjectWfDTO = {
      projectId: projId,
      ProjectWfStatustypeId: wfStatus,
      ProjectWfActionId: wfAction,
    };

    const res = await projectWfSubmit(projectWFModel);
    if (res && res.data && res.data.status === 200) {
      toastMessage(MessageType.Success, pwf_submit);
      navigate('/db/projects');
    } else {
      toastMessage(MessageType.Error, internal_error);
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
  };
  const addTagData = (event) => {
    if (event.target.value !== '') {
      setTagData([...tagData, event.target.value]);
      setTagValue('');
      event.target.value = '';
    }
  };

  const handleChange = (event) => {
    setTagValue(event.target.value);
  };
  const setTagValueClick = (event) => {
    if (event.target.value !== '') {
      setTagValue(event.target.value);
    }
  };
  const addTagDataClick = () => {
    if (tagValue !== '') {
      setTagData([...tagData, tagValue]);
      setTagValue('');
    }
  };
  return (
    <PageContainer title="Project Cred" description="display project cred">
      {/* breadcrumb */}
      <Breadcrumb title={'Project Cred'} items={BCrumb} />
      {/* end breadcrumb */}
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
                  onChange={(event) => setClientEmail(event.target.value)}
                  placeholder="Client Email"
                ></TextField>
              </FormControl>
            </Grid>
          </Grid>
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
                  input={
                    <OutlinedInput
                      label="Engagement Type"
                      className="multi-select-dropdown-outline"
                    />
                  }
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
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
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>Type of Work</InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Type of Work
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={dealType}
                  onChange={handleDealType}
                  input={
                    <OutlinedInput label="Type of Work" className="multi-select-dropdown-outline" />
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
                target entities are same then select the what is applicable to the client
                entity(ies)
              </InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Sub-sector
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={subSector}
                  onChange={handleSubSector}
                  input={
                    <OutlinedInput label="Sub Sector" className="multi-select-dropdown-outline" />
                  }
                  renderValue={(selected) =>
                    taxonomyResultData
                      .filter((name) => selected.includes(name.taxonomyUUID))
                      .map((record) => record.displayName)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  subSectorData
                  {taxonomyResultData
                    .filter((x) => x.parentId != null && x.categoryId == taxonomyCategory.SubSector)
                    .map((taxonomy) => (
                      <MenuItem
                        key={taxonomy.taxonomyUUID}
                        value={taxonomy.taxonomyUUID}
                        className="multi-select-dropdown"
                      >
                        <Checkbox checked={subSector.indexOf(taxonomy.taxonomyUUID) > -1} />
                        <ListItemText primary={taxonomy.displayName} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Business description of entity(ies) on which the work has been performed in up to 20
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
                  onChange={(event) => setBusinessDescription(event.target.value)}
                  inputProps={{ maxLength: 50 }}
                  placeholder="Business description"
                ></TextField>
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
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  className="multi-select-dropdown-outline"
                >
                  Service
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={services}
                  onChange={handleService}
                  input={
                    <OutlinedInput label="Service" className="multi-select-dropdown-outline" />
                  }
                  renderValue={(selected) =>
                    taxonomyResultData
                      .filter((name) => selected.includes(name.taxonomyUUID))
                      .map((record) => record.displayName)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                  className="multi-select-dropdown"
                >
                  {taxonomyResultData
                    .filter((x) => x.categoryId == taxonomyCategory.Services)
                    .map((taxonomy) => (
                      <MenuItem
                        key={taxonomy.taxonomyUUID}
                        value={taxonomy.taxonomyUUID}
                        className="multi-select-dropdown"
                      >
                        <Checkbox checked={services.indexOf(taxonomy.taxonomyUUID) > -1} />
                        <ListItemText primary={taxonomy.displayName} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
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
                    if (Number(event.target.value) === 132 || Number(event.target.value) === 133) {
                      setIsDisplayPublicWebsite(true);
                    }
                  }}
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
              </FormControl>
            </Grid>
          </Grid>
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
              </FormControl>
            </Grid>
          </Grid>
          <div className="section">Section 2: Client and / or Target information</div>
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
                  <br />
                  &nbsp;&nbsp;
                  <span>
                    If client is an overseas entity, please input client&#39;s region country;if
                    client is an Indian subsidiary, then select ultimate parent&#39;sk an Indian
                    subsidiary, then select ultimate parent&#39;s
                  </span>
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
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Client&apos;s Ultimate Parent entity&apos;s domicile country/region
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
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Domicile country/region of the entity on which work has been performed.
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
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Can entity name(s) be disclosed as a credential as per the EL / ToB / Contract /
                RFP? (Please refer EL/Contract/RFP for any restriction with respect to citation /
                credential.)
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
                  onChange={(event) => {
                    setIsDisplayTargetEntityName(false);
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
              </FormControl>
            </Grid>
          </Grid>
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
                    placeholder="Please mention the Target entity name"
                  ></TextField>
                </FormControl>
              </Grid>
            </Grid>
          ) : (
            ''
          )}

          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Target entity type (Govt. or others).
                <br></br>
                <p className="input-form-cl-entity">
                  Government client includes: Indian and Overseas Government Organizations
                  (including assignments with network firm where end client is overseas Government);
                  Government departments and regulatory agencies; Public sector enterprise -
                  Entities incorporated through legislations/ Government orders - Entities in which
                  Government / Government agencies have 51% or more stake - Entities in which
                  Government has taken over the management control of the entity; International
                  Development/ Bilateral/ Multilateral agencies like World Bank, Asian Development
                  Bank etc. Also applies for the end client of a Network Firm led engagement
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
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} xl={5} className="addScSpace add-user">
              <InputLabel>
                Short description (max 150 characters) of the project that will be mentioned as a
                tombstone (Please ensure that the description is in the format which would go into
                the proposal. If Client / target names can be disclosed, please ensure the
                description include the Client / target names.) (Please refer EL/Contract/RFP for
                any restriction with respect to citation / credential.)
              </InputLabel>
            </Grid>
            <Grid item xs={12} md={7} xl={7}>
              <FormControl sx={{ m: 1, width: '90%' }}>
                <TextField
                  size="small"
                  name="projectC"
                  id="txtProjectC"
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  inputProps={{ maxLength: 150 }}
                  placeholder="Short description"
                ></TextField>
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
              <Button
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={handleSave}
              >
                Save
              </Button>
              {inputProps && inputProps.showSubmitforPartnerAproval && (
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
                  onClick={() => {
                    setIsOpenWfAlert(true);
                    // handleWfChange(
                    //   Project_Wf_StatusTypes.ClientApprovalPending,
                    //   Project_Wf_Actions.MarkasApprovedPartner,
                    // );
                  }}
                >
                  Approve By Partner
                </Button>
              )}
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
            <Grid item xs={12} md={12} xl={12}>
              <span style={{ fontSize: '15px', color: 'red', float: 'right', fontWeight: '800' }}>
                Note: Please Click save button to update details before performing your action.
              </span>
            </Grid>
          </Grid>
        </CardContent>

        <Dialog
          open={isOpenWfAlert}
          onClose={() => {
            setIsOpenWfAlert(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{}</DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please check and confirm the below details
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
              <Grid item xs={12} md={12} xl={12}>
                <CustomTextField
                  id="txtshortDiscription"
                  label="One line descripton"
                  variant="standard"
                  fullWidth
                  size="small"
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
    </PageContainer>
  );
};
export default InputForm;
