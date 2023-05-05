import React, { FC, useEffect, useState } from 'react';
import { clearAll, getStorage } from '../../common/helpers/storage.helper';
import { config } from '../../common/environment';
import jq from 'jquery';
import {
  internal_error,
  pwc_isAdmin,
  pwc_token,
  pwf_submit,
} from '../../common/constants/common.constant';
import { renderDataTable } from '../../common/helpers/datatables.net.helper';
import { deleteProject, getAllAditLogs, projectWfSubmit } from './projectApi';
import { useNavigate } from 'react-router-dom';
import { IProjectWfDTO } from './projectModels';
import {
  MessageType,
  Project_Wf_Actions,
  Project_Wf_StatusTypes,
} from '../../common/enumContainer';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { toastMessage } from '../../common/toastMessage';
import deleteIcon from '../../assets/images/icons/delete.png';
import editIcon from '../../assets/images/icons/edit.png';
import viewIcon from '../../assets/images/icons/view.png';
import { display } from '@mui/system';

// const tableRows = ["LTB", "Name", "SBU", "Debtor", "TaskCode", "CreatedBy", "CreatedOn", "IsDeleted", "ProjectId", "StartDate", "canactive",
//   "ClientName", "ModifiedOn", "ClienteMail", "HoursBooked", "ModifieddBy", "ProjectCode", "TaskManager", "UploadedDate", "BillingAmount", "LegalEntity",
//   "ProjectTypeId", "ProjectPartner", "ProjectStatus", "ClientContactName", "ProjectCTMStatusId", "ProjectValuationStatusId"
// ]
// const tableRows = ["Project Name", "SBU", "Debtor", "TaskCode", "CreatedOn", "StartDate","IsDeleted",
//   "ClientName",  "ClienteMail", "HoursBooked", "ProjectCode", "TaskManager", "BillingAmount", "LegalEntity",
//    "ProjectPartner", "ProjectStatus", "ClientContactName"
// ]
// const tableInputRows = ["Sector", "Services", "Deal Value", "Client Email", "Public Website", "Engagement Type",
//   "Domicile Country", "Short Description", "Client Entity Type", "Target Entity Type", "Transaction Status", "Client Contact Name", 
//   "Business Description", "Domicile Work Country", "Entity Name Disclosed", "Nature of Engagement / Deal","Nature of Transaction (Deal) / Nature of Work (Non Deal)"
// ]
const tableRows = ["ProjectCode", "TaskCode", "Project Name", "TaskManager", "ProjectPartner", "Project Deleted",
  "ClientName", "Debtor", "ClienteMail", "ClientContactName", "HoursBooked", "BillingAmount", "SBU", "LegalEntity",
  "ProjectStatus", "StartDate"
]

const tableInputRows = ["Engagement Type", "Nature of Engagement / Deal", "Nature of Transaction (Deal) / Nature of Work (Non Deal)", "Deal Value",
  "Sector", "Business Description", "Services", "Transaction Status", "Public Website", "Pwc Name Quoted in Public Webite", "Entity Name Disclosed", "Client Entity Type", "Domicile Country", "Domicile Work Country",
  "Target Entity Type", "Target Entity Name", "Short Description", "Client Email", "Client Contact Name", "Confirmation Date"
]

const AuditTrailDataTable: FC<{ searchParam: any }> = ({ searchParam }) => {
  const tableId = '#audit_List';
  const url = getAllAditLogs;
  const navigate = useNavigate();
  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [oldData, setOldData] = React.useState([]);
  const [newData, setNewData] = React.useState([]);
  const [showPopUp, setShowPopUp] = React.useState(false);
  const [tableName, setTableName] = React.useState("");

  useEffect(() => {
    const order = [[3, 'desc']];
    const columns = [
      { data: 'projectCode' },
      { data: 'projectName' },
      { data: 'srcTableName' },
      // { data: 'isModified' },      
      {
        data: 'dmlTimestamp',
        render: function (data) {
          // const date = new Date(data);
          // const month = date.getMonth() + 1;
          // return (
          //   date.getDate() +
          //   '/' +
          //   (month.toString().length > 1 ? month : '0' + month) +
          //   '/' +
          //   date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
          // );
          // const formatedDate = new Date(data);
          return new Date(data).toLocaleString().replace(',', ' ');
          // return convertUtcToLocalTime(data);
        },
      },
      { data: 'createdBy' },
      { data: null },
      { data: null },
    ];
    const columnDefs = [
      {
        targets: 0,
        "width": "5%",
        orderable: false,
      },
      {
        targets: 1,
        "width": "5%",
        orderable: false,
      },
      {
        targets: 2,
        "width": "5%",
        orderable: false,
      },
      {
        targets: 3,
        "width": "7%",
        orderable: false,
      },
      {
        targets: 4,
        "width": "10%",
        orderable: false,
      },
      {
        targets: 5,
        "width": "20%",
        render: function (row, data, type) {
          let colm = '';
          if(row.oldRowData && row.newRowData){          
            let oldDataRow: any[] = [];
            let newDataRow: any[] = [];
            oldDataRow = JSON.parse(row.oldRowData);
            newDataRow = JSON.parse(row.newRowData);
          if(row.srcTableName=="Input Form"){
              tableInputRows.map((column, index) => (
                (oldDataRow[column] != newDataRow[column]) && (
                  colm = (colm != '') ? colm + ', ' + column : colm + column
                )
              ))
            }
          else{
              tableRows.map((column, index) => (
                (oldDataRow[column] != newDataRow[column]) && (
                  colm = (colm != '') ? colm + ', ' + column : colm + column
                )
              ))
            }
            return colm;
          }
        },
      },
      {
        targets: 6,
        orderable: false,
        "width": "3%",
        render: function (row, data, type) {
          const actions: string[] = [];
          const view = `<a href='#' title='View Audit Details'><img id='btnView' src=${viewIcon} alt="View Audit Details" height="21" class="grdIconDis" style="margin-top: -1px;margin-right: -4px;"/></a>`;

          actions.push(view);

          return wrapActions(actions);
          // return actions;
        },
      },
    ];
    const ajaxData = { searchParams: JSON.stringify(searchParam) };

    if (jq.fn.dataTable.isDataTable(tableId)) {
      const dt = jq(tableId).DataTable();
      dt.clear().destroy();
      dt.state.clear();
    }
    const dtTable = renderDataTable(tableId, url, columns, columnDefs, order, ajaxData, true);
  }, [searchParam]);

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


  jq(tableId).off('click').on('click', '#btnView', function () {
    debugger;
    // setOldData([]);
    // setNewData([]);
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      // const obj = Object.entries(selectedRow.completeObject.oldRowData).map(([key, value]) => ({ key, value }))
      // console.log(obj)
      if(selectedRow.completeObject.oldRowData != null)
      {
        setOldData(JSON.parse(selectedRow.completeObject.oldRowData));
      }
      setNewData(JSON.parse(selectedRow.completeObject.newRowData));
      setShowPopUp(true);
      setTableName(selectedRow.completeObject.srcTableName);
    }
  });

  const wrapActions = function (acts: any) {
    let allCmds = "<span class='gridRowAct disFlex'>";
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

  const convertUtcToLocalTime = (value) => {
    debugger;
    if (value) {
      // // const firstDate = value.split('T');
      // // const date = firstDate[0].split('-');
      // // const date1 = date[2] + '/' + date[1] + '/' + date[0];
      // const formatedDate = new Date(value);
      // const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      // if (isSafari) {
      //   return formatedDate;
      // }
      // const offset = formatedDate.getTimezoneOffset();
      // // return new Date(
      // //   formatedDate.setMinutes(formatedDate.getMinutes() - offset)
      // // ).toLocaleString().replace(',', ' ');
      // const newdate = new Date(
      //   formatedDate.setMinutes(formatedDate.getMinutes() - offset)
      // ).toLocaleString().replace(',', ' ');
      // const newdate1 = newdate.split('/');
      // if (isSafari) {
      //   return newdate1[1] + '/' + newdate1[0] + '/' + newdate1[2];
      // }
      // else{
      //   return newdate1[0] + '/' + newdate1[1] + '/' + newdate1[2];
      // }
      const formatedDate = new Date(value);
      return formatedDate.toLocaleString().replace(',', ' ');
    }
    else
      return value;
  }

  return (
    <div id="dvId">
      <Dialog
        open={showPopUp}
        onClose={() => {
          setShowPopUp(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title"><b>{'Audit Details'}</b></DialogTitle>
        <DialogContent>
          <div style={{ overflow: "auto", height: "400px" }}>
            <table
              id="audit_details_List"
              className="display dt-responsive dataTable no-footer dtr-inline download_List_Head"
              style={{ width: '100%', color: 'black' }}
            >
              <thead id="project_List_head">
                <tr>
                  <th>Field Name</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>
                {tableName==="Projects" &&(
                  <>
                    {tableRows.map((column, index) => (
                      <tr key={column} className={index % 2 == 0 ? 'odd' : ''}>
                        {(oldData[column] != newData[column]) && (
                          <td>{column}</td>
                        )}
                        {(oldData[column] != newData[column]) && (

                          <td>{(column == "StartDate") ?
                            (new Date(oldData[column]).getDate() +
                              '/' +
                              ((new Date(oldData[column]).getMonth() + 1).toString().length > 1 ? (new Date(oldData[column]).getMonth() + 1) : '0' + (new Date(oldData[column]).getMonth() + 1)) +
                              '/' +
                              new Date(oldData[column]).getFullYear())
                            : (oldData[column] != newData[column] ? oldData[column] : "")}</td>
                        )}
                        {(oldData[column] != newData[column]) && (
                          <td>{(column == "StartDate") ?
                            (new Date(newData[column]).getDate() +
                              '/' +
                              ((new Date(newData[column]).getMonth() + 1).toString().length > 1 ? (new Date(newData[column]).getMonth() + 1) : '0' + (new Date(newData[column]).getMonth() + 1)) +
                              '/' +
                              new Date(newData[column]).getFullYear())
                            : (oldData[column] != newData[column] ? newData[column] : "")}</td>
                        )}
                        {/* <td>{column}</td>
                        <td>{oldData[column]}</td>
                        <td>{oldData[column]}</td> */}

                        {/* <td>{oldData[column] != newData[column] ? column : ""}</td>
                        <td>{oldData[column] != newData[column] ? oldData[column] : ""}</td>
                        <td>{oldData[column] != newData[column] ? newData[column] : ""}</td> */}
                      </tr>
                    ))}
                  </>
                )}
                {tableName==="Input Form" &&(
                  <>
                    {tableInputRows.map((column, index) => (
                      <tr key={column} className={index % 2 == 0 ? 'odd' : ''}>
                        {(oldData[column] != newData[column]) && (
                          <td>{column}</td>
                        )}
                        {(oldData[column] != newData[column]) && (
                          <td>{oldData[column] != newData[column] ? oldData[column] : ""}</td>
                        )}
                        {(oldData[column] != newData[column]) && (
                          <td>{oldData[column] != newData[column] ? newData[column] : ""}</td>
                        )}
                        {/* <td>{column}</td>
                        <td>{oldData[column]}</td>
                        <td>{oldData[column]}</td> */}

                        {/* <td>{oldData[column] != newData[column] ? column : ""}</td>
                        <td>{oldData[column] != newData[column] ? oldData[column] : ""}</td>
                        <td>{oldData[column] != newData[column] ? newData[column] : ""}</td> */}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setShowPopUp(false); setOldData([]); setNewData([]); setTableName("");
            }}
            className="reset-buttons-bg"
          >
            Cancel
          </Button>
          {/* <Button
            color="secondary"
            variant="contained"
            onClick={handleWfChange}
            autoFocus
            className="buttons-bg"
          >
            Proceed
          </Button> */}
        </DialogActions>
      </Dialog>
      <table
        id="audit_List"
        className="display dt-responsive"
        style={{ width: '100%', color: 'black' }}
      >
        <thead id="project_List_head">
          <tr>
            <th>Project Code</th>
            <th>Project Name</th>
            <th>Table</th>
            {/* <th>IsModified</th> */}
            <th>Updated On</th>
            <th>Updated By</th>
            <th>Updated Fields</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>

  );
};
export default AuditTrailDataTable;
