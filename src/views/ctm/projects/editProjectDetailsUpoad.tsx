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
  projectReportAnIssueDetails,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import {
  internal_error,
  pwf_submit,
  uploadExtentions,
} from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories, getCtmProjectDetails } from '../../projects/taxonomyApi';
import { deleteCtmProj } from '../../projects/projectApi';
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
  Grid,
  DialogContentText,
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
import { debug } from 'console';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';

const EditProjectUpload: FC = () => {
  const navigate = useNavigate();
  const { projId, isfrom } = useParams();
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);
  const [openEditRecord, setOpenEditRecord] = useState(false);
  const [file, setUploadedFile] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [controllingTypeId, setControllingTypeId] = useState(0);
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');

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

  const handleOpenEditClose = () => {
    setOpenEditRecord(false);
  };

  const BCrumb = [
    {
      to: isfrom === 'cfib' ? '#' : '#',
      title: isfrom === 'cfib' ? 'CFIB' : isfrom === 'report' ? 'Reported Issues' : 'CTM',
    },
    {
      title: isfrom === 'report' ? 'Project Data' : 'Projects',
    },
  ];

  const getTaxonomyResult = async () => {
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
      setSourceOfMultiple(result.filter((x) => x.categoryId == taxonomyCategory.SourceOfMultiple));
      setDealType(result.filter((x) => x.categoryId == taxonomyCategory.CtmDealType));
      setControllingType(
        result.filter((x) => x.categoryId == taxonomyCategory.CTMControllingTypes),
      );
    }
  };

  useEffect(() => {
    getTaxonomyResult();
    getProjectByProjId();
  }, []);

  useEffect(() => {
    const columns = [
      { data: null, orderable: false, defaultContent: '' },
      { width: '20px', data: null },
      {
        data: 'transactionDate',
        render: function (data) {
          const date = new Date(data);
          const month = date.getMonth() + 1;
          return data != ''
            ? String(date.getDate()).padStart(2, '0') +
                '/' +
                (month.toString().length > 1 ? month : '0' + month) +
                '/' +
                date.getFullYear()
            : '';
        },
      },
      { data: 'targetName' },
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
      { data: 'targetBusinessDescription' },
    ];

    const columnDefs = [
      {
        targets: 0,
        orderable: false,
      },
      {
        targets: 1,
        render: function (row, data, type) {
          const actions: string[] = [];
          if (row) {
            if (row.isRowInvalid) {
              actions.push(
                `<i class='fa fa-exclamation-triangle faFontSize' title='Data error' style='color:red !important'></i>`,
              );
            }
            actions.push(
              `<a href='#'   title='Edit'><i id='btnEdit' class='fa fa-edit faFontSize'></i></a>`,
            );
            actions.push(
              `<a href='#'   title='Delete'><i id='btnDelete' class='fa fa-trash faFontSize'></i></a>`,
            );
            if (row.isDuplicate) {
              actions.push(
                `<i class='fa fa-files-o faFontSize'  title='Duplicate data' style='color:red !important'></i>`,
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
      responsive: true,
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
        setControllingTypeId(selectedRow.completeObject.controllingTypeId);
        setOpenEditRecord(true);
      }
    });

    jq(tableId).on('click', '#btnDelete', async function () {
      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };
      if (selectedRow.completeObject) {
        setInitialValues(selectedRow.completeObject);
        setOpenDeletePop(true);
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

  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);
  const [listedUnlisted, setListedUnlisted] = React.useState<taxonomyMin[]>([]);
  const [sourceOfMultiple, setSourceOfMultiple] = React.useState<taxonomyMin[]>([]);
  const [dealType, setDealType] = React.useState<taxonomyMin[]>([]);
  const [controllingType, setControllingType] = React.useState<taxonomyMin[]>([]);

  const handleOnSubmit = (values: any) => {
    debugger;
    values.targetListedUnListed = listedUnlisted.find(
      (x) => x.id == values.targetListedUnListedId,
    )?.name;
    values.sourceOdMultiple = sourceOfMultiple.find((x) => x.id == values.sourceOdMultipleId)?.name;
    values.dealType = dealType.find((x) => x.id == values.dealTypeId)?.name;
    values.controllingType =
      controllingType.find((x) => x.id == values.controllingTypeId)?.name ?? '';
    //values.transactionDate = transactionDate;

    const newState = uplodedDetail.map((obj) => (obj.uniqueId === values.uniqueId ? values : obj));
    setUploadedDetails(newState);
    setOpenEditRecord(false);
    //values.transactionDate = moment(transactionDate).format('DD/MM/YYYY');
    const newState1 = uplodedDetail
      .filter((obj) => obj.uniqueId === values.uniqueId)
      .map((obj) => (obj.uniqueId === values.uniqueId ? values : obj));
    handleReportAnIssueData(newState1);
    toastMessage(MessageType.Success, 'Details updated successfully');
  };

  const handleReportAnIssueData = async (newState) => {
    const response = await projectReportAnIssueDetails({
      details: newState,
      projectId: newState[0].projectId,
    });
    if (response && response.data.status === 200) {
      toastMessage(MessageType.Success, 'Details updated successfully');
    } else {
      toastMessage(MessageType.Error, 'Error Occurred');
    }
  };

  const handleUploadData = async () => {
    debugger;
    const response = await projectCtmDetails({ details: uplodedDetail, projectId: projId });
    if (response && response.data.status === 200) {
      toastMessage(MessageType.Success, 'Details updated successfully');
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
  };
  const getProjectByProjId = async () => {
    const response = await getCtmProjectDetails(projId);
    if (response && response.data) {
      setUploadedDetails(response.data);
      setClientName(response.data[0].clientName);
      setProjectName(response.data[0].projectName);
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };
  const submit = async (e: any) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('body', file);
      const response = await projectDetailsUpload(formData);
      if (response && response.data.status === 200) {
        if (!response.data.data[0].isHeaderInvalid) {
          setShowSubmit(true);
          const existingRecords = [...uplodedDetail];
          response.data.data.map((record: any) => {
            record.uniqueId = existingRecords.length + 1;
            existingRecords.push(record);
          });
          setUploadedDetails(existingRecords);
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
    if (e.target.files[0]) {
      const extension = e.target.files[0].name.split('.').pop();
      if (!uploadExtentions.includes(extension)) {
        toastMessage(MessageType.Error, 'Please upload valid file ..');
        return;
      }
      setUploadedFile(e.target.files[0]);
    }
  };

  const deleteRecord = async () => {
    const response = await deleteCtmProj(initialValues.projectCtmId);
    if (response && response.data) {
      setOpenDeletePop(false);
      getProjectByProjId();
      toastMessage(MessageType.Success, 'Deleted successfully');
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };
  const handleRedirectToList = () => {
    if (isfrom === 'cfib') {
      navigate('/cfib/projects');
    } else navigate('/ctm/project/reportanissues');
  };

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
        <div
          className="pull-right"
          style={{ paddingTop: '13px', whiteSpace: 'nowrap', display: 'none' }}
        >
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
          {uplodedDetail.length > 0 && (
            <>
              {showSubmit && (
                <div className="pull-right" style={{ paddingBottom: '10px' }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    type="button"
                    className="buttons-bg"
                    autoFocus
                    onClick={handleUploadData}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </>
          )}
          <div>
            <form onSubmit={(e) => submit(e)} style={{ display: 'none' }}>
              <label>
                {isfrom === 'cfib' ? 'Upload the CFIB Information' : 'Upload the CTM Information'} :{' '}
              </label>
              <input type="file" onChange={(e) => setFile(e)} />
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                className="buttons-bg"
                autoFocus
                style={{ marginBottom: '10px' }}
              >
                {uplodedDetail.length > 0 ? 'Override' : 'Upload'}
              </Button>
              &nbsp; &nbsp;
            </form>
            <div style={{ float: 'left' }}>
              <label>
                <b>Project Name:</b> {projectName != null ? projectName : 'N/A'}
              </label>
              &nbsp;{' '}
              <label>
                <b>Client Name:</b>{' '}
                {clientName.trim() != null && clientName.trim() != '' ? clientName : 'N/A'}
              </label>
            </div>
            <div style={{ display: 'inline-block', float: 'right' }}>
              <Button
                color="secondary"
                variant="contained"
                type="button"
                className="buttons-bg"
                onClick={() => {
                  handleRedirectToList();
                }}
                autoFocus
                style={{ marginBottom: '10px' }}
              >
                Back To List
              </Button>
            </div>
            {uplodedDetail.length > 0 && (
              <div>
                <table
                  id="project_upload_List"
                  className="display dt-responsive"
                  style={{ width: '100%', color: 'black' }}
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th>Actions</th>
                      <th>Transaction Date</th>
                      <th>Target Name</th>
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
                      <th>Target Business Description</th>
                    </tr>
                  </thead>
                </table>
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
                // validationSchema={Yup.object().shape({

                // })}
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
                                value={values.transactionDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={(value) => setFieldValue('transactionDate', value, true)}
                                //onError={touched.transactionDate && Boolean(errors.transactionDate)}
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
                              // value={moment(values.transactionDate).format('DD/MM/yyyy')}
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
                            <CustomTextField
                              id="currency"
                              fullWidth
                              size="small"
                              label="Currency"
                              onChange={handleChange}
                              value={values.currency}
                              error={touched.currency && Boolean(errors.currency)}
                            ></CustomTextField>
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
              open={openDeletePop}
              onClose={() => {
                setOpenDeletePop(false);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure to delete?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    setOpenDeletePop(false);
                  }}
                  className="reset-buttons-bg"
                >
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={deleteRecord}
                  autoFocus
                  className="buttons-bg"
                >
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default EditProjectUpload;
