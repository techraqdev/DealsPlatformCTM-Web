import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cfib_Project_Wf_StatusTypes,
  Ctm_Project_Wf_Actions,
  Ctm_Project_Wf_StatusTypes,
  MessageType,
} from '../../../common/enumContainer';
import {
  projectCtmDetails,
  projectCtmWfSubmit,
  projectCfibWfSubmit,
  projectDetailsUpload,
  projectSupportingFileUpload,
  projectCtmValidateDetails,
  getctmsupportingfileApi,
  downloadctmsupportingfileApi,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import {
  internal_error,
  pwf_submit,
  uploadExtentions,
} from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories } from '../../projects/taxonomyApi';
import { projectCtmDetail, taxonomyCategory, taxonomyMin } from '../../projects/taxonomyModels';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import * as Yup from 'yup';
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
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import jq from 'jquery';
import { Form, Formik, useFormik } from 'formik';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../../components/forms/custom-elements/CustomSelect';
import { IProjectWfDTO } from '../../projects/projectModels';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';

const CtmProjectUpload: FC = () => {
  const navigate = useNavigate();
  const { projId, isfrom, isUpdate } = useParams();
  const [file, setUploadedFile] = useState('');
  const [openFileUpload, setFileUpload] = useState(false);
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);
  const [openEditRecord, setOpenEditRecord] = useState(false);
  const [supportingFile, setSupportingFile] = useState('');
  const [supportingFileSize, setSupportingFileSize] = useState('');
  const [openSupportingFileUpload, setOpenSupportingFileUpload] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const initialModel: IProjectWfDTO = {};
  const [openWFPop, setOpenWFPop] = useState(false);
  const [projectWFModel, setProjectWfModel] = useState(initialModel);
  const [supportingFileModel, setSupportingFileModel] = useState({ isFileAvialable: false });
  const [keywords, setKeywords] = useState('');
  const [keywordErr, setKeywordErr] = useState('');
  const [controllingTypeId, setControllingTypeId] = useState(0);
  const [transactionDate, setTransactionDate] = React.useState('');

  const intValues: projectCtmDetail = {};

  const [initialValues, setInitialValues] = useState(intValues);
  const tableId = '#project_upload_List';

  const validateSchema = Yup.object().shape({
    targetListedUnListedId: Yup.number()
      .nullable(true)
      .required('Target Listed / UnListed is required'),
    sourceOdMultipleId: Yup.number().nullable(true).required('Source Of Multiple is required'),
    dealTypeId: Yup.number().nullable(true).required('Deal Type is required'),
    currencyId: Yup.number().nullable(true).required('Currency is required'),
    transactionDate: Yup.string().required('Transaction Date is required'),
    targetName: Yup.string().nullable(true).required('Target Name is required'),
    targetBusinessDescription: Yup.string()
      .nullable(true)
      .required('Target Business Description is required'),
    nameOfBidder: Yup.string().nullable(true).required('Name Of Bidder is required'),
    stakeAcquired: Yup.string()
      .nullable(true)
      .required('Stake Acquired is required')
      .test('test-name', 'Enter a valid Stake Acquired.', (value) => {
        const typeValue = controllingType.find((x) => x.id == controllingTypeId)?.name ?? '';
        if (controllingTypeId === 287) {
          if (value && parseFloat(value) > 50) {
            return false;
          }
        }
        return true;
      }),
    dealValue: Yup.string()
      .nullable(true)
      .required('Deal Value is required')
      .test('test-name', 'Enter a valid value.', (value) => {
        if (value) {
          const val = parseFloat(value);
          if (value === 'NA' || val) {
            return true;
          }
        }
        return false;
      }),
    enterpriseValue: Yup.string()
      .nullable(true)
      .required('Enterprise Value is required')
      .test('test-name', 'Enter a valid value.', (value) => {
        if (value) {
          const val = parseFloat(value);
          if (value === 'NA' || val) {
            return true;
          }
        }
        return false;
      }),
    revenue: Yup.string()
      .nullable(true)
      .required('Revenue is required')
      .test('test-name', 'Enter a valid value.', (value) => {
        if (value) {
          const val = parseFloat(value);
          if (value === 'NA' || val) {
            return true;
          }
        }
        return false;
      }),
    ebitda: Yup.string()
      .nullable(true)
      .required('Ebitda is required')
      .test('test-name', 'Enter a valid value.', (value) => {
        if (value) {
          const val = parseFloat(value);
          if (value === 'NA' || val) {
            return true;
          }
        }
        return false;
      }),
    evRevenue: Yup.string()
      .nullable(true)
      .required('Ev Revenue is required')
      .test('test-name', 'Enter a valid value.', (value) => {
        if (value) {
          const val = parseFloat(value);
          if (value === 'NA' || val) {
            return true;
          }
        }
        return false;
      }),
    evEbitda: Yup.string()
      .nullable(true)
      .required('EV Ebitda is required')
      .test('test-name', 'Enter a valid value.', (value) => {
        if (value) {
          const val = parseFloat(value);
          if (value === 'NA' || val) {
            return true;
          }
        }
        return false;
      }),
    controllingTypeId: Yup.number().nullable(true).required('Control Type is required'),
  });

  const handleFileUploadClose = () => {
    setFileUpload(false);
  };

  const handleOpenEditClose = () => {
    setOpenEditRecord(false);
  };

  const handleFileUploadOpen = () => {
    setFileUpload(true);
  };

  const updateRecord = async (e: any) => {
    e.preventDefault();
  };

  const constrctWfModel = (wfStatusTypeId: number, wfActionId) => {
    const values: IProjectWfDTO = {
      projectId: projId,
      ProjectWfStatustypeId: wfStatusTypeId,
      ProjectWfActionId: wfActionId,
    };
    setProjectWfModel(values);
  };

  const ctmOnGoingEngagement = () => {
    constrctWfModel(
      Ctm_Project_Wf_StatusTypes.EngagementOngoing,
      Ctm_Project_Wf_Actions.MarkAsEngagementOngoing,
    );
    setOpenWFPop(true);
  };

  const handleWfChange = async () => {
    projectWFModel.projectId = projId;
    const res = await projectCtmWfSubmit(projectWFModel);
    if (res && res.data && res.data.status === 200) {
      toastMessage(MessageType.Success, pwf_submit);
      navigate(`/ctm/projects`);
    } else {
      toastMessage(MessageType.Error, internal_error);
      window.location.reload();
    }
  };

  const submit = async (e: any) => {
    debugger;
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('body', file);
      const response = await projectDetailsUpload(formData);
      if (response && response.data.status === 200) {
        if (response.data.data.length > 0 && !response.data.data[0].isHeaderInvalid) {
          setShowSubmit(true);
          debugger;
          setUploadedDetails(response.data.data);
        } else {
          toastMessage(
            MessageType.Warning,
            'Excel which you are trying to upload is incorrect. Please download updated template and upload information again',
          );
        }
      } else {
        toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
      }
    } else {
      toastMessage(MessageType.Warning, 'Please upload  file');
    }
  };

  const setFile = (e: any) => {
    //@ts-ignore
    debugger;
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
      to: isfrom === 'cfib' ? '#' : '#',
      title: isfrom === 'cfib' ? 'CFIB' : 'CTM',
    },
    {
      title: 'Projects',
    },
  ];

  const getTaxonomyResult = async () => {
    debugger;
    const result = await getTaxonomyDataByCategories([
      taxonomyCategory.TargetListedUnListed,
      taxonomyCategory.Currency,
      taxonomyCategory.SourceOfMultiple,
      taxonomyCategory.CtmDealType,
      taxonomyCategory.CTMControllingTypes,
    ]);
    if (result) {
      setTaxynomyDataData(result);
      setListedUnlisted(
        result.filter((x) => x.categoryId == taxonomyCategory.TargetListedUnListed),
      );
      debugger;
      setSourceOfMultiple(result.filter((x) => x.categoryId == taxonomyCategory.SourceOfMultiple));
      setDealType(result.filter((x) => x.categoryId == taxonomyCategory.CtmDealType));
      setCurrency(result.filter((x) => x.categoryId == taxonomyCategory.Currency));
      setControllingType(
        result.filter((x) => x.categoryId == taxonomyCategory.CTMControllingTypes),
      );
    }
  };

  const getctmsupportingfile = async () => {
    const result = await getctmsupportingfileApi(projId);
    if (result) {
      setSupportingFileModel(result.data);
    }
  };

  const downloadSupportingFiles = async () => {
    const result = await downloadctmsupportingfileApi(projId);
  };

  useEffect(() => {
    getTaxonomyResult();
    getctmsupportingfile();
  }, []);

  useEffect(() => {
    const columns = [
      { width: '20px', data: null },
      {
        data: 'transactionDate',
        //   render: function (data) {
        //   const date = new Date(data);
        //   const month = date.getMonth() + 1;
        //   return (
        //     String(date.getDate()).padStart(2, '0') +
        //     '/' +
        //     (month.toString().length > 1 ? month : '0' + month) +
        //     '/' +
        //     date.getFullYear()
        //   );
        // },
      },
      { data: 'targetName' },
      { data: 'targetBusinessDescription' },
      { data: 'targetListedUnListed' },
      { data: 'nameOfBidder' },
      { data: 'stakeAcquired' },
      { data: 'controllingType' },
      { data: 'currency' },
      { data: 'dealValue' },
      { data: 'enterpriseValue' },
      { data: 'revenue' },
      { data: 'ebitda' },
      { data: 'evRevenue' },
      { data: 'evEbitda' },
      { data: 'sourceOdMultiple' },
      { data: 'dealType' },
      { data: 'customMultile' },
      { data: 'nameOfMultiple' },
    ];

    const columnDefs = [
      {
        targets: 0,
        render: function (row, data, type) {
          const actions: string[] = [];
          if (row) {
            actions.push(
              `<a href='#'   title='Edit'><i id='btnEdit' class='fa fa-edit faFontSize'></i></a>`,
            );
            if (row.isRowInvalid) {
              actions.push(
                `<i class='fa fa-exclamation-triangle faFontSize' title='${row.rowInvalidColumnNames}' style='color:red !important'></i>`,
              );
            }
            if (row.isDuplicate) {
              actions.push(
                `<i class='fa fa-files-o faFontSize' title='Duplicate data' style='color:red !important'></i>`,
              );
            }
          }
          return wrapActions(actions);
        },
      },
    ];
    jq(tableId).DataTable({
      data: uplodedDetail,
      columns: columns,
      columnDefs: columnDefs,
      serverSide: false,
      responsive: false,
      processing: true,
      destroy: true,
      ordering: false,
      paging: false,
    });

    jq(tableId).on('click', '#btnEdit', function () {
      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };
      if (selectedRow.completeObject) {
        setInitialValues(selectedRow.completeObject);
        //const [day, month, year] = selectedRow.completeObject.transactionDate.split('/');
        // setTransactionDate(selectedRow.completeObject.transactionDate != '' ? selectedRow.completeObject.transactionDate : new Date());
        //setTransactionDate(new Date(year, month - 1, day));
        setControllingTypeId(selectedRow.completeObject.controllingTypeId);
        setOpenEditRecord(true);
      }
    });

    const getCompleteRowObject = (row) => {
      const dtTable = jq(tableId).DataTable();
      let selectedRow = {
        completeObject: dtTable.row(jq(row).parents('tr')).data(),
      };
      if (!selectedRow.completeObject) {
        const parentRow = jq(row).closest('tr').prev()[0];
        selectedRow = {
          completeObject: dtTable.row(jq(parentRow)).data(),
        };
        return selectedRow.completeObject;
      }
      return selectedRow.completeObject;
    };
  }, [uplodedDetail]);

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

  const uploadSupportingFiles = () => {
    setOpenSupportingFileUpload(true);
  };

  const handleSupportingFileUploadClose = () => {
    setOpenSupportingFileUpload(false);
  };
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  function niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  }

  const uploadSupportingFile = (e: any) => {
    setSupportingFileSize('');
    //@ts-ignore
    if (e.target.files[0]) {
      const totalBytes = e.target.files[0].size;
      setSupportingFileSize(niceBytes(totalBytes));
      const extension = e.target.files[0].name.split('.').pop();
      // if (!uploadExtentions.includes(extension)) {
      //     toastMessage(MessageType.Error, 'Please upload valid file ..');
      //     return;
      // }
      setSupportingFile(e.target.files[0]);
    }
  };

  const submitSupportingFile = async (e: any) => {
    e.preventDefault();
    if (supportingFile) {
      const formData = new FormData();
      formData.append('body', supportingFile);

      const response = await projectSupportingFileUpload(projId, formData, isfrom);

      if (response && response.data.status === 200) {
        getctmsupportingfile();
        toastMessage(MessageType.Success, 'File Uploaded Successfully');
        setOpenSupportingFileUpload(false);
      } else {
        toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
      }
    } else {
      toastMessage(MessageType.Warning, 'Please upload  file');
    }
  };

  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);
  const [listedUnlisted, setListedUnlisted] = React.useState<taxonomyMin[]>([]);
  const [sourceOfMultiple, setSourceOfMultiple] = React.useState<taxonomyMin[]>([]);
  const [dealType, setDealType] = React.useState<taxonomyMin[]>([]);
  const [currency, setCurrency] = React.useState<taxonomyMin[]>([]);
  const [controllingType, setControllingType] = React.useState<taxonomyMin[]>([]);

  const handleOnSubmit = async (values: any) => {
    debugger;
    values.targetListedUnListed =
      listedUnlisted.find((x) => x.id == values.targetListedUnListedId)?.name ?? '';
    values.sourceOdMultiple =
      sourceOfMultiple.find((x) => x.id == values.sourceOdMultipleId)?.name ?? '';
    values.dealType = dealType.find((x) => x.id == values.dealTypeId)?.name ?? '';
    values.currency = currency.find((x) => x.id == values.currencyId)?.name ?? '';
    values.controllingType =
      controllingType.find((x) => x.id == values.controllingTypeId)?.name ?? '';
    values.transactionDate = moment(values.transactionDate, 'DD/MM/YYYY').format('DD/MM/YYYY');

    const validatedObject = await projectCtmValidateDetails(values);

    if (validatedObject && validatedObject.data.status === 200) {
      const newState = uplodedDetail.map((obj) =>
        obj.uniqueId === values.uniqueId ? validatedObject.data.data : obj,
      );
      setUploadedDetails(newState);
      setOpenEditRecord(false);
      toastMessage(MessageType.Success, 'Details updated successfully');
    } else {
      toastMessage(MessageType.Error, 'Error while processing');
    }
  };

  const handleUploadData = async () => {
    if (keywords && keywordErr === '') {
      //for doing support files
      if ((uplodedDetail.filter((x) => x.reqSupportingFile == true).length > 0 ? true : false) && !supportingFile) {
        toastMessage(MessageType.Warning, 'Please provide supporting file for all row(s) with recomputed multiples');
      } else {
        if (supportingFile) {
          const formData = new FormData();
          formData.append('body', supportingFile);

          const response = await projectSupportingFileUpload(projId, formData, isfrom);

          if (response && response.data.status === 200) {
            getctmsupportingfile();
            // toastMessage(MessageType.Success, 'Supporting File Uploaded Successfully');
            setOpenSupportingFileUpload(false);
          } else {
            toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
          }
        }

        const response = await projectCtmDetails({
          details: uplodedDetail,
          projectId: projId,
          keyWords: keywords,
        });
        if (response && response.data.status === 200) {
          toastMessage(MessageType.Success, 'Uploaded data submitted successfully');
          let values: IProjectWfDTO = {};
          if (isfrom === 'cfib') {
            values = {
              projectId: projId,
              ProjectWfStatustypeId: Cfib_Project_Wf_StatusTypes.InofrmationUploaded,
              ProjectWfActionId: Cfib_Project_Wf_StatusTypes.InofrmationUploaded,
            };
            const res = await projectCfibWfSubmit(values);
            if (res && res.data && res.data.status === 200) {
              toastMessage(MessageType.Success, pwf_submit);
              navigate(`/cfib/projects`);
            } else {
              toastMessage(MessageType.Error, internal_error);
            }
          } else {
            values = {
              projectId: projId,
              ProjectWfStatustypeId: Ctm_Project_Wf_StatusTypes.InofrmationUploaded,
              ProjectWfActionId: Ctm_Project_Wf_Actions.UploadInformation,
            };
            const res = await projectCtmWfSubmit(values);
            if (res && res.data && res.data.status === 200) {
              toastMessage(MessageType.Success, pwf_submit);
              navigate(`/ctm/projects`);
            } else {
              toastMessage(MessageType.Error, internal_error);
            }
          }
        } else {
          toastMessage(MessageType.Error, 'Error Occurred');
        }
      }
    } else {
      setKeywordErr('Please provide keyword');
    }
  };
  const viewExistingData = () => {
    window.open(`/ctm/project/edit/${projId}/cfib`, '_blank');
  };

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
        <div className="pull-right" style={{ paddingTop: '13px', whiteSpace: 'nowrap' }}>
          {isfrom !== 'cfib' && (
            <a className="buttons-bg" href="#" onClick={ctmOnGoingEngagement}>
              Change status to Engagement Ongoing
            </a>
          )}
          {isfrom === 'cfib' && isUpdate === 'update' && (
            <a className="buttons-bg" href="#" onClick={viewExistingData}>
              View Existing Data
            </a>
          )}
          <a
            className="buttons-bg"
            href={process.env.PUBLIC_URL + '/Ctm_Template.xlsx'}
            download={'Ctm_Template.xlsx'}
          >
            Download Template
          </a>
        </div>
      </div>
      <Card className="project-list">
        <CardContent>
          <div>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6} xl={6}>
                    <label>
                      Business description of entity(ies) upto 50 characters (e.g. paper
                      manufacturing; power distribution; NBFC){' '}
                    </label>
                  </Grid>
                  <Grid item xs={12} md={6} xl={6}>
                    <textarea
                      name="projectC"
                      value={keywords}
                      onChange={(e) => {
                        setKeywords(e.target.value);
                        setKeywordErr('');
                      }}
                      maxLength={50}
                      id="txtProjectC"
                      style={{ height: '80px', width: '225px' }}
                    ></textarea>
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      {keywordErr ? <div>{keywordErr}</div> : null}
                    </span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                <form onSubmit={(e) => submitSupportingFile(e)}>
                  <label>Upload Supporting file </label>
                  <input type="file" onChange={(e) => uploadSupportingFile(e)} onClick={(e) => { e.currentTarget.value = ''; uploadSupportingFile(e); setSupportingFile(''); }}/>
                  {supportingFileSize != '' && (
                    <label style={{ paddingLeft: '20px' }}>
                      File Size : {' ' + supportingFileSize + ' '}
                    </label>
                  )}
                  {/* <Button
                    color="secondary"
                    variant="contained"
                    type="submit"
                    className="buttons-bg"
                    autoFocus
                  >
                    Upload
                  </Button> */}
                  <p style={{ fontSize: '11px', width: '350px', color: '#777E89' }}>
                    Multiple files cannot be uploaded. You can upload a zip file by keeping all the
                    files in a zip folder
                  </p>
                </form>
              </Grid>
            </Grid>
          </div>
          <div>
            <form onSubmit={(e) => submit(e)}>
              <label>
                {isfrom === 'cfib' ? 'Upload the CFIB Information ' : 'Upload the CTM Information '}
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e)}
                onClick={(event) => {
                  event.currentTarget.value = '';
                }}
              />
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                className="buttons-bg"
                autoFocus
              >
                Upload & View Data
              </Button>
            </form>
            {uplodedDetail.length > 0 && (
              <div>
                {showSubmit && (
                  <Button
                    color="secondary"
                    variant="contained"
                    type="button"
                    disabled={
                      uplodedDetail.filter((x) => x.isRowInvalid == true).length > 0 ? true : false
                    }
                    className="buttons-bg pull-right submit-ctm-details"
                    autoFocus
                    onClick={handleUploadData}
                    style={{ marginBottom: '10px' }}
                  >
                    Submit
                  </Button>
                )}
                <div style={{ width: '100%', overflowX: 'scroll' }}>
                  <table
                    id="project_upload_List"
                    className="display dt-responsive"
                    style={{ width: 'auto', color: 'black' }}
                  >
                    <thead>
                      <tr>
                        <th>Actions</th>
                        <th>Transaction Date</th>
                        <th>Target Name</th>
                        <th>Target Business Description</th>
                        <th>Target Listed / UnListed</th>
                        <th>Name Of Bidder</th>
                        <th>Stake Acquired</th>
                        <th>Control Type</th>
                        <th>Currency</th>
                        <th>Deal Value</th>
                        <th>Enterprise Value</th>
                        <th>Revenue</th>
                        <th>EBITDA</th>
                        <th>EV/Revenue</th>
                        <th>EV/EBITDA</th>
                        <th>Source Of Multiple</th>
                        <th>Deal Type</th>
                        <th>Custom Multiple</th>
                        <th>Name of Multiple</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            )}
            <Dialog
              open={openEditRecord}
              onClose={handleOpenEditClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle>{'Update Details'}</DialogTitle>
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validateSchema}
                onSubmit={handleOnSubmit}
                render={({
                  errors,
                  values,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  touched,
                }) => (
                  <div>
                    <Form className={'formWidth'} noValidate onSubmit={handleSubmit}>
                      <DialogContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4} xl={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                label="Transaction Date"
                                value={
                                  values.transactionDate === ''
                                    ? transactionDate
                                    : moment(values.transactionDate, 'DD/MM/YYYY')
                                }
                                inputFormat="dd/MM/yyyy"
                                onChange={(value) => setFieldValue('transactionDate', value, true)}
                                // onChange={(newValue) => {
                                //   handleChange(newValue);
                                //   setTransactionDate(newValue);
                                // }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    id="transactionDate"
                                    error={
                                      touched.transactionDate && Boolean(errors.transactionDate)
                                    }
                                  />
                                )}
                              />
                            </LocalizationProvider>
                            {/* <CustomTextField
                              id="transactionDate"
                              label="Transaction Date"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.transactionDate}
                              error={touched.transactionDate && Boolean(errors.transactionDate)}
                            ></CustomTextField> */}
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="targetName"
                              label="Target Name"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.targetName}
                              error={touched.targetName && Boolean(errors.targetName)}
                            ></CustomTextField>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="targetBusinessDescription"
                              label="Target Business Description"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.targetBusinessDescription}
                              error={
                                touched.targetBusinessDescription &&
                                Boolean(errors.targetBusinessDescription)
                              }
                            ></CustomTextField>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomSelect
                              labelId="targetListedUnListed"
                              id="targetListedUnListed"
                              name="Target Listed / UnListed"
                              displayEmpty
                              onChange={(event: any) => {
                                setFieldValue('targetListedUnListedId', event.target.value);
                              }}
                              renderValue={(selected) => {
                                if (selected && selected.length === 0) {
                                  return (
                                    <legend style={{ fontSize: '0.75em' }}>
                                      <span>Select Target Listed / UnListed</span>
                                    </legend>
                                  );
                                }
                                const selectedName = listedUnlisted.find(
                                  (x) => x.id == selected,
                                )?.name;
                                return selectedName;
                              }}
                              value={values.targetListedUnListedId}
                              fullWidth
                              size="small"
                              error={
                                touched.targetListedUnListedId &&
                                Boolean(errors.targetListedUnListedId)
                              }
                            >
                              {listedUnlisted &&
                                listedUnlisted.map((cat: any, i: number) => {
                                  return (
                                    <MenuItem key={i} value={cat.id}>
                                      {cat.name}
                                    </MenuItem>
                                  );
                                })}
                            </CustomSelect>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="nameOfBidder"
                              label="Name Of Bidder"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.nameOfBidder}
                              error={touched.nameOfBidder && Boolean(errors.nameOfBidder)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="stakeAcquired"
                              label="Stake Acquired"
                              onChange={handleChange}
                              value={values.stakeAcquired}
                              variant="outlined"
                              fullWidth
                              size="small"
                              error={touched.stakeAcquired && Boolean(errors.stakeAcquired)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            {/* <CustomTextField
                              id="currency"
                              fullWidth
                              size="small"
                              label="Currency"
                              onChange={handleChange}
                              value={values.currency}
                              error={touched.currency && Boolean(errors.currency)}
                              helperText={touched.currency && errors.currency}
                            ></CustomTextField> */}
                            <CustomSelect
                              labelId="currencyId"
                              id="currencyId"
                              name="Currency"
                              displayEmpty
                              onChange={(event: any) => {
                                setFieldValue('currencyId', event.target.value);
                              }}
                              renderValue={(selected) => {
                                if (selected && selected.length === 0) {
                                  return (
                                    <legend style={{ fontSize: '0.75em' }}>
                                      <span>Currency</span>
                                    </legend>
                                  );
                                }
                                const selectedName = currency.find((x) => x.id == selected)?.name;
                                return selectedName;
                              }}
                              value={values.currencyId}
                              fullWidth
                              size="small"
                              error={touched.currencyId && Boolean(errors.currencyId)}
                            >
                              {currency &&
                                currency.map((cat: any, i: number) => {
                                  return (
                                    <MenuItem key={i} value={cat.id}>
                                      {cat.name}
                                    </MenuItem>
                                  );
                                })}
                            </CustomSelect>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="dealValue"
                              fullWidth
                              label="Deal Value"
                              size="small"
                              onChange={handleChange}
                              value={values.dealValue}
                              error={touched.dealValue && Boolean(errors.dealValue)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="enterpriseValue"
                              fullWidth
                              label="Enterprise Value"
                              size="small"
                              onChange={handleChange}
                              value={values.enterpriseValue}
                              error={touched.enterpriseValue && Boolean(errors.enterpriseValue)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="revenue"
                              label="Revenue"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.revenue}
                              error={touched.revenue && Boolean(errors.revenue)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="ebitda"
                              fullWidth
                              label="EBITDA"
                              size="small"
                              onChange={handleChange}
                              value={values.ebitda}
                              error={touched.ebitda && Boolean(errors.ebitda)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="evRevenue"
                              label="EV/Revenue"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.evRevenue}
                              error={touched.evRevenue && Boolean(errors.evRevenue)}
                            ></CustomTextField>
                          </Grid>

                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="evEbitda"
                              label="EV/EBITDA"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.evEbitda}
                              error={touched.evEbitda && Boolean(errors.evEbitda)}
                            ></CustomTextField>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomSelect
                              labelId="sourceOdMultipleId"
                              id="sourceOdMultipleId"
                              name="Source Of Multiple"
                              displayEmpty
                              onChange={(event: any) => {
                                setFieldValue('sourceOdMultipleId', event.target.value);
                              }}
                              renderValue={(selected) => {
                                if (selected && selected.length === 0) {
                                  return (
                                    <legend style={{ fontSize: '0.75em' }}>
                                      <span>Source Of Multiple</span>
                                    </legend>
                                  );
                                }
                                const selectedName = sourceOfMultiple.find(
                                  (x) => x.id == selected,
                                )?.name;
                                return selectedName;
                              }}
                              value={values.sourceOdMultipleId}
                              fullWidth
                              size="small"
                              error={
                                touched.sourceOdMultipleId && Boolean(errors.sourceOdMultipleId)
                              }
                            >
                              {sourceOfMultiple &&
                                sourceOfMultiple.map((cat: any, i: number) => {
                                  return (
                                    <MenuItem key={i} value={cat.id}>
                                      {cat.name}
                                    </MenuItem>
                                  );
                                })}
                            </CustomSelect>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomSelect
                              labelId="dealTypeId"
                              id="dealTypeId"
                              name="Deal Type"
                              displayEmpty
                              onChange={(event: any) => {
                                setFieldValue('dealTypeId', event.target.value);
                              }}
                              renderValue={(selected) => {
                                if (selected && selected.length === 0) {
                                  return (
                                    <legend style={{ fontSize: '0.75em' }}>
                                      <span>Deal Type</span>
                                    </legend>
                                  );
                                }
                                const selectedName = dealType.find((x) => x.id == selected)?.name;
                                return selectedName;
                              }}
                              value={values.dealTypeId}
                              fullWidth
                              size="small"
                              error={touched.dealTypeId && Boolean(errors.dealTypeId)}
                            >
                              {dealType &&
                                dealType.map((cat: any, i: number) => {
                                  return (
                                    <MenuItem key={i} value={cat.id}>
                                      {cat.name}
                                    </MenuItem>
                                  );
                                })}
                            </CustomSelect>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="customMultile"
                              label="Custom Multiple"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.customMultile}
                            ></CustomTextField>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomTextField
                              id="nameOfMultiple"
                              label="Name of Multiple"
                              fullWidth
                              size="small"
                              onChange={handleChange}
                              value={values.nameOfMultiple}
                            ></CustomTextField>
                          </Grid>
                          <Grid item xs={12} md={4} xl={4}>
                            <CustomSelect
                              labelId="controllingTypeId"
                              id="controllingTypeId"
                              name="Control Type"
                              displayEmpty
                              onChange={(event: any) => {
                                setFieldValue('controllingTypeId', event.target.value);
                                setControllingTypeId(event.target.value);
                              }}
                              renderValue={(selected) => {
                                if (selected && selected.length === 0) {
                                  return (
                                    <legend style={{ fontSize: '0.75em' }}>
                                      <span>Control Type</span>
                                    </legend>
                                  );
                                }
                                const selectedName = controllingType.find(
                                  (x) => x.id == selected,
                                )?.name;
                                return selectedName;
                              }}
                              value={values.controllingTypeId}
                              fullWidth
                              size="small"
                              error={touched.controllingTypeId && Boolean(errors.controllingTypeId)}
                            >
                              {controllingType &&
                                controllingType.map((cat: any, i: number) => {
                                  return (
                                    <MenuItem key={i} value={cat.id}>
                                      {cat.name}
                                    </MenuItem>
                                  );
                                })}
                            </CustomSelect>
                          </Grid>
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="secondary"
                          variant="contained"
                          className="reset-buttons-bg"
                          onClick={handleOpenEditClose}
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
                          Update
                        </Button>
                      </DialogActions>
                    </Form>
                  </div>
                )}
              />
            </Dialog>

            <Dialog
              open={openSupportingFileUpload}
              onClose={handleSupportingFileUploadClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form onSubmit={(e) => submitSupportingFile(e)}>
                <DialogTitle>{'Upload Supporting Upload'}</DialogTitle>
                <DialogContent>
                  <p style={{ fontSize: '12px', width: '350px' }}>
                    Multiple files cannot be uploaded. You can upload a zip file by keeping all the
                    files in a zip folder
                  </p>
                  <input type="file" onChange={(e) => uploadSupportingFile(e)} onClick={(e) => { e.currentTarget.value = ''; setSupportingFile(''); }}/>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="reset-buttons-bg"
                    onClick={handleSupportingFileUploadClose}
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
          <Dialog
            open={openWFPop}
            onClose={() => {
              setOpenWFPop(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{ }</DialogTitle>
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
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default CtmProjectUpload;
