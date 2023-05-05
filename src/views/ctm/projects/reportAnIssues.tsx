import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cfib_Project_Wf_StatusTypes,
  Ctm_Project_Wf_Actions,
  Ctm_Project_Wf_StatusTypes,
  MessageType,
} from '../../../common/enumContainer';
import {
  projectReportAnIssueDetails,
  projectCtmWfSubmit,
  projectCfibWfSubmit,
  getReportIssueList,
  deleteCtmProj,
  updateReportStatus,
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import { internal_error, pwf_submit } from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories } from '../../projects/taxonomyApi';
import { projectCtmDetail, taxonomyCategory, taxonomyMin } from '../../projects/taxonomyModels';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import * as Yup from 'yup';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  DialogContentText,
  Autocomplete,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import jq from 'jquery';
import { Form, Formik, useFormik } from 'formik';
import { MultiSelect, Option } from 'react-multi-select-component';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../../components/forms/custom-elements/CustomSelect';
import { IProjectWfDTO } from '../../projects/projectModels';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';

const ReportAnIssues: FC = () => {
  const navigate = useNavigate();
  const { projId, isfrom } = useParams();
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);
  const [openEditRecord, setOpenEditRecord] = useState(false);
  const [openWFPop, setOpenWFPop] = useState(false);
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [controllingTypeId, setControllingTypeId] = useState(0);
  const [transactionDate, setTransactionDate] = React.useState<Date | null>(null);
  const [openPop, setOpenPop] = useState(false);

  const [currentAction, setCurrentAction] = useState('');
  const intValues: projectCtmDetail = {};

  const [initialValues, setInitialValues] = useState(intValues);
  const selectedItem: any = [];
  const tableId = '#report_project_upload_List';

  const validateSchema = Yup.object().shape({
    targetListedUnListedId: Yup.number()
      .nullable(true)
      .required('Target Listed / UnListed is required'),
    sourceOdMultipleId: Yup.number().nullable(true).required('Source Of Multiple is required'),
    dealTypeId: Yup.number().nullable(true).required('Deal Type is required'),
    currencyId: Yup.number().nullable(true).required('Currency is required'),
    transactionDate: Yup.date()
      .required('Transaction Date is required')
      .test('test-name1', 'Enter a valid Transaction Date.', (value) => {
        debugger;
        // if (controllingTypeId === 287) {
        //   if (value && parseFloat(value) > 50) {
        //     return false;
        //   }
        // }
        return true;
      }),
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
      to: isfrom === 'cfib' ? '/ctm/project/Upload' : '/ctm/project/reportanissues',
      title: isfrom === 'cfib' ? 'CFIB' : 'CTM',
    },
    {
      title: 'Reported Issues',
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
      setCurrency(result.filter((x) => x.categoryId == taxonomyCategory.Currency));
      setControllingType(
        result.filter((x) => x.categoryId == taxonomyCategory.CTMControllingTypes),
      );
    }
  };

  useEffect(() => {
    getTaxonomyResult();
    getReportAnIssueList('Duplicate and Inconsistent Data');
  }, []);

  useEffect(() => {
    const columns = [
      {
        // className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: '',
      },
      { data: null },
      { width: '50px', data: null },
      //{ data: 'disputeNo' },
      { data: 'disputeType' },
      { width: '500px', data: null },
      // { data: 'notes' },
      // { data: 'errorNotes' },
      { data: 'projectName' },
      { data: 'clientName' },
      { data: 'subSectorName' },
      { data: 'managerName' },
      { data: 'partnerName' },
      { data: 'projectType' },
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
        orderable: false,
        className: 'select-checkbox',
        targets: 1,
        render: function (data, type) {
          if (data.isOwner) {
            return type === 'display' ? '<input class="chk-select" type="checkbox">' : '';
          } else {
            return type === 'display'
              ? '<input class="chk-select" disabled="disabled" type="checkbox">'
              : '';
          }
        },
      },
      {
        targets: 4,
        render: function (row, data, type) {
          if (row) {
            return getNotes(row);
          }
          return '';
        },
      },
      {
        targets: 5,
        render: function (row, data, type) {
          return type.projectType === 'CFIB'
            ? 'N/A'
            : '<span style="white-space:nowrap">' + row + '</span>';
        },
      },
      {
        targets: 6,
        render: function (row, data, type) {
          return type.projectType === 'CFIB'
            ? 'N/A'
            : '<span style="white-space:nowrap">' + row + '</span>';
        },
      },
      {
        targets: 7,
        render: function (row, data, type) {
          return type.projectType === 'CFIB' ? 'N/A' : row;
        },
      },

      {
        targets: 2,
        render: function (row, data, type) {
          const actions: string[] = [];
          if (row) {
            if (row.isOwner) {
              if (reportAnIssue === 'Error In Data') {
                actions.push(
                  `<a href='#'   title='Edit'><i id='btnEdit' class='fa fa-edit faFontSize'></i></a>`,
                );
                actions.push(
                  `<a href='#'   title='Delete'><i id='btnDelete' class='fa fa-trash faFontSize'></i></a>`,
                );
              } else {
                actions.push(
                  `<a href='#'   title='View Dispute Details'><i id='btnEditInfo' class='fa fa-eye faFontSize'></i></a>`,
                );
              }
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
      dom: '<"top"iflp<"clear">>rt<"bottom"iflp<"clear">>',
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
        //setTransactionDate(selectedRow.completeObject.transactionDate != ''? selectedRow.completeObject.transactionDate : new Date(), );
        setOpenDeletePop(true);
      }
    });

    jq(tableId).on('click', '#btnEditInfo', function () {
      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };

      if (selectedRow.completeObject) {
        navigate(
          `/ctm/project/report/${selectedRow.completeObject.projectId}/${selectedRow.completeObject.disputeNo}`,
        );
      }
    });
    jq(tableId).on('change', '.chk-select', function (e) {
      e.preventDefault();

      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };
      if (e.currentTarget.checked == false) {
        const index = selectedItem.indexOf(selectedRow.completeObject.projectCtmId);
        if (index > -1) {
          selectedItem.splice(index, 1); // 2nd parameter means remove one item only
        }
      } else {
        selectedItem.push(selectedRow.completeObject.projectCtmId);
      }
      setSelectedItems(selectedItem);
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
    let allCmds = "<span class='gridRowAct report'>";
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
  const getNotes = (row) => {
    if (row) {
      if (reportAnIssue === 'Duplicate and Inconsistent Data') {
        return (
          '<span style="white-space:nowrap" data-toggle="tooltip" title="' +
          row.notes +
          '">' +
          (row.notes.length > 20 ? row.notes.substring(0, 19) + '...' : row.notes) +
          '</span>'
        );
      } else {
        return (
          '<span style="white-space:nowrap" data-toggle="tooltip" title="' +
          row.errorNotes +
          '">' +
          (row.errorNotes.length > 20 ? row.errorNotes.substring(0, 19) + '...' : row.errorNotes) +
          '</span>'
        );
      }
    }
    return '';
  };

  const options = ['Duplicate and Inconsistent Data', 'Error In Data'];

  const [taxynomyData, setTaxynomyDataData] = React.useState<taxonomyMin[]>([]);
  const [listedUnlisted, setListedUnlisted] = React.useState<taxonomyMin[]>([]);
  const [sourceOfMultiple, setSourceOfMultiple] = React.useState<taxonomyMin[]>([]);
  const [dealType, setDealType] = React.useState<taxonomyMin[]>([]);
  const [currency, setCurrency] = React.useState<taxonomyMin[]>([]);
  const [reportAnIssue, setReportAnIssue] = useState('Duplicate and Inconsistent Data');
  const [reportAnIssueData, setReportAnIssueData] = React.useState<string[]>(options);
  // const [reportAnIssueData, setReportAnIssueData] = React.useState<Option[]>(options);
  const [reportAnIssueDataParam, setReportAnIssueDataParam] = React.useState<string[]>([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [controllingType, setControllingType] = React.useState<taxonomyMin[]>([]);

  const handleOnSubmit = (values: any) => {
    values.targetListedUnListed = listedUnlisted.find(
      (x) => x.id == values.targetListedUnListedId,
    )?.name;
    values.sourceOdMultiple = sourceOfMultiple.find((x) => x.id == values.sourceOdMultipleId)?.name;
    values.dealType = dealType.find((x) => x.id == values.dealTypeId)?.name;
    values.currency = currency.find((x) => x.id == values.currencyId)?.name;
    values.controllingType =
      controllingType.find((x) => x.id == values.controllingTypeId)?.name ?? '';
    //values.transactionDate = transactionDate;

    const newState = uplodedDetail.map((obj) => (obj.uniqueId === values.uniqueId ? values : obj));
    setUploadedDetails(newState);
    //values.transactionDate = moment(transactionDate).format('DD/MM/YYYY');
    const update = newState.filter((obj) => obj.uniqueId === values.uniqueId);
    handleUploadData(update);
  };

  const handleConfirm = () => {
    setOpenPop(false);
    setOpenEditRecord(false);
    handleWfChange();
  };

  const handleUploadData = async (newState) => {
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
  const getReportAnIssueList = async (type) => {
    let issueType = 2;
    if (type == 'Error In Data') issueType = 1;
    const response = await getReportIssueList(issueType);
    if (response && response.data) {
      setUploadedDetails(response.data);
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };

  const handleWfChange = async () => {
    const response = await updateReportStatus({
      projCtmIds: selectedItems,
      ReportType: currentAction,
    });
    if (response && response.data.status === 200) {
      setCurrentAction('');
      setSelectedItems([]);
      setOpenWFPop(false);
      toastMessage(MessageType.Success, 'Details updated successfully');
      getReportAnIssueList(reportAnIssue);
    } else {
      toastMessage(MessageType.Error, 'Error Occurred');
    }
  };

  const deleteRecord = async () => {
    const response = await deleteCtmProj(initialValues.projectCtmId);
    if (response && response.data) {
      setOpenDeletePop(false);
      getReportAnIssueList(reportAnIssue);
      toastMessage(MessageType.Success, 'Deleted successfully');
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };

  const handleUpdateStatus = async (status) => {
    if (selectedItems && selectedItems.length > 0) {
      setCurrentAction(status);
      setOpenWFPop(true);
    } else {
      setCurrentAction('');
      toastMessage(MessageType.Error, 'Please select atleast one record');
    }
  };

  const handleReportAnIssue = (event, target) => {
    debugger;
    setReportAnIssue(target);
    getReportAnIssueList(target);
  };
  const customValueRenderer = (selected, _options) => {
    const compUUIDs: string[] = [];
    return selected.length
      ? selected.forEach((item: any) => {
          compUUIDs.push(item.value);
        })
      : 'Type of Issue';
  };
  const search = async () => {
    let issueType = 2;
    if (reportAnIssue == 'Error In Data') issueType = 1;
    const response = await getReportIssueList(issueType);
    if (response && response.data) {
      setUploadedDetails(response.data);
    } else {
      toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
    }
  };

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
      </div>
      <Card className="project-list">
        <CardContent>
          <div>
            {/* {uplodedDetail.length > 0 && ( */}
            <div>
              <div
                style={{ display: 'inline-block', float: 'left', width: '300px' }}
                className="report_an_issue"
              >
                <Autocomplete
                  id="combo-box-demo"
                  disablePortal
                  disableClearable
                  options={reportAnIssueData}
                  value={reportAnIssue}
                  onChange={handleReportAnIssue}
                  renderInput={(params) => (
                    <TextField {...params} label="Type of Issue" size="small" />
                  )}
                />
                {/* <MultiSelect
                  options={reportAnIssueData}
                  value={reportAnIssue}
                  onChange={handleReportAnIssue}
                  labelledBy="Type of Issue"
                  valueRenderer={customValueRenderer}
                  overrideStrings={{ selectAll: 'Check All' }}
                  disableSearch={true}
                /> */}
              </div>
              {/*<div
                style={{
                  display: 'inline-block',
                  float: 'left',
                  marginTop: '-6px',
                  marginLeft: '5px',
                }}
              >
                <Button
                  // id="btnSearch"
                  color="secondary"
                  variant="contained"
                  className="buttons-bg"
                  style={{ marginBottom: '5px', width: '100%' }}
                  onClick={search}
                >
                  Search
                </Button>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  float: 'left',
                  marginTop: '-6px',
                  marginLeft: '5px',
                }}
              >
                <Button
                  id="btnClear"
                  color="secondary"
                  variant="contained"
                  style={{ marginBottom: '5px', width: '100%' }}
                  className="reset-buttons-bg"
                  onClick={clear}
                >
                  Clear
                </Button>
              </div> */}
              <div style={{ display: 'inline-block', float: 'right' }}>
                <Button
                  color="secondary"
                  variant="contained"
                  type="button"
                  className="buttons-bg"
                  onClick={() => handleUpdateStatus('Not An Issue')}
                  style={{ marginBottom: '10px' }}
                >
                  Not An Issue
                </Button>
              </div>
              <div style={{ display: 'inline-block', float: 'right', paddingRight: '10px' }}>
                <Button
                  color="secondary"
                  variant="contained"
                  type="button"
                  className="buttons-bg"
                  onClick={() => handleUpdateStatus('Resolved')}
                  style={{ marginBottom: '10px' }}
                >
                  Resolved
                </Button>
              </div>
              <table
                id="report_project_upload_List"
                className="display dt-responsive"
                style={{ width: '100%', color: 'black' }}
              >
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Actions</th>
                    {/* <th>Dispute No</th> */}
                    <th>Dispute Type</th>
                    <th>Notes</th>
                    <th>Project Name</th>
                    <th>Client Name</th>
                    <th>Sub Sector</th>
                    <th>Manager Name</th>
                    <th>Partner Name</th>
                    <th>SBU</th>
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
            {/* )} */}
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
                                value={values.transactionDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={(value) => setFieldValue('transactionDate', value, true)}
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
              open={openWFPop}
              onClose={() => {
                setOpenWFPop(false);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{}</DialogTitle>
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
export default ReportAnIssues;
