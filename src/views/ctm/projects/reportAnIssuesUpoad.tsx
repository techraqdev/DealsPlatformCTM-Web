import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ctm_Project_Wf_Actions,
  Ctm_Project_Wf_StatusTypes,
  MessageType,
  Report_Types,
} from '../../../common/enumContainer';
import {
  projectCtmDetails,
  projectCtmWfSubmit,
  projectReportAnIssueDetails,
  deleteDispute,
  updateReportStatus,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import { internal_error, pwf_submit } from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories, getReportDuplicate } from '../../projects/taxonomyApi';
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
  MenuItem,
} from '@mui/material';
import { useParams } from 'react-router';
import jq from 'jquery';
import { Form, Formik } from 'formik';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../../components/forms/custom-elements/CustomSelect';
import { IProjectWfDTO } from '../../projects/projectModels';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';

const ReportAnIssuesUpoad: FC = () => {
  const navigate = useNavigate();
  const { projId, disputeNo } = useParams();
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);
  const [openEditRecord, setOpenEditRecord] = useState(false);
  const [controllingTypeId, setControllingTypeId] = useState(0);
  const [transactionDate, setTransactionDate] = React.useState<Date | null>(null);
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [currentAction, setCurrentAction] = useState('');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [otherEntry, setOtherEntry] = useState(false);

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
      to: '#',
      title: 'Reported Issues',
    },
    {
      title: 'Dispute Details',
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
        data: 'projectName',
        render: function (data) {
          if (data) return data;
          else return 'N/A';
        },
      },
      {
        data: 'clientName',
        render: function (data) {
          if (data.trim()) return data;
          else return 'N/A';
        },
      },
      {
        data: 'projectType',
      },
      {
        data: 'subSectorName',
      },
      {
        data: 'managerName',
      },
      {
        data: 'partnerName',
      },
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
          debugger;
          const actions: string[] = [];
          if (row && row.isOwner) {
            actions.push(
              `<a href='#'   title='Edit'><i id='btnEdit' class='fa fa-edit faFontSize'></i></a>`,
            );
            actions.push(
              `<a href='#'   title='Delete'><i id='btnDelete' class='fa fa-trash faFontSize'></i></a>`,
            );
          }
          if (
            row.duplicateStatusId === Report_Types.CTMDuplicateResolved ||
            row.duplicateStatusId === Report_Types.CTMDuplicateNotanIssue
          ) {
            actions.push(
              `<i title='${row.duplicateStatus}' class='fa fa-files-o faFontSize' style='color:#76BC3B !important'></i>`,
            );
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
        //setTransactionDate(selectedRow.completeObject.transactionDate);
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
  const selectedItem: any = [];
  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);
  const [listedUnlisted, setListedUnlisted] = React.useState<taxonomyMin[]>([]);
  const [sourceOfMultiple, setSourceOfMultiple] = React.useState<taxonomyMin[]>([]);
  const [dealType, setDealType] = React.useState<taxonomyMin[]>([]);
  const [controllingType, setControllingType] = React.useState<taxonomyMin[]>([]);

  const handleOnSubmit = (values: any) => {
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
    //values.transactionDate = moment(transactionDate).format('DD/MM/YYYY');
    const newState1 = uplodedDetail
      .filter((obj) => obj.uniqueId === values.uniqueId)
      .map((obj) => (obj.uniqueId === values.uniqueId ? values : obj));
    handleReportAnIssueData(newState1);
    //toastMessage(MessageType.Success, 'Details updated successfully');
  };

  const handleReportAnIssueData = async (newState) => {
    const response = await projectReportAnIssueDetails({
      details: newState,
      projectId: newState[0].projectId,
    });
    if (response && response.data.status === 200) {
      selectedItem.push(newState[0].projectCtmId);
      setSelectedItems(selectedItem);
      setCurrentAction('Resolved');
      setOpenPop(true);
    } else {
      toastMessage(MessageType.Error, 'Error Occurred');
    }
  };

  const handleWfChange = async () => {
    const response = await updateReportStatus({
      projCtmIds: selectedItems,
      ReportType: currentAction,
    });
    if (response && response.data.status === 200) {
      setCurrentAction('');
      toastMessage(MessageType.Success, 'Details updated successfully');
      navigate(`/ctm/project/reportanissues`);
    } else {
      toastMessage(MessageType.Error, 'Error Occurred');
    }
  };
  const handleConfirm = () => {
    setOpenPop(false);
    setOpenEditRecord(false);
    handleWfChange();
  };

  const getProjectByProjId = async () => {
    const response = await getReportDuplicate(projId, disputeNo);
    if (response && response.data) {
      setUploadedDetails(response.data);
      setClientName(response.data[0].clientName);
      setProjectName(response.data[0].projectName);
      debugger;
      const other = response.data.filter((x) => x.isDeleted);
      if (other.length > 0) {
        setOtherEntry(true);
      }
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };

  const deleteRecord = async () => {
    const response = await deleteDispute(initialValues.projectCtmId, disputeNo);
    if (response && response.data) {
      setOpenDeletePop(false);
      getProjectByProjId();
      toastMessage(MessageType.Success, 'Deleted successfully');
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };
  const handleRedirectToList = () => {
    navigate('/ctm/project/reportanissues');
  };

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
      </div>
      <Card className="project-list">
        <CardContent>
          <div>
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
            {otherEntry && (
              <p style={{ fontSize: '13px', color: '#ff0000', marginLeft: '20px' }}>
                Other entry or entries reported as duplicate along with this entry have been deleted
                by respective Manager/Partner
              </p>
            )}
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
                      <th>Project Name</th>
                      <th>Client Name</th>
                      <th>SBU</th>
                      <th>Sub Sector</th>
                      <th>Manager Name</th>
                      <th>Partner Name</th>
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
      <Dialog
        open={openPop}
        onClose={() => {
          setOpenPop(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Details updated successfully. Do you want to resolve the issue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setOpenPop(false);
            }}
            className="reset-buttons-bg"
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            autoFocus
            className="buttons-bg"
            onClick={handleConfirm}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
export default ReportAnIssuesUpoad;
