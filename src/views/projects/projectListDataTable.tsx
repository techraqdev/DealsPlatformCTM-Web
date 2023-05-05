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
import { deleteProject, getAllProject, projectWfSubmit } from './projectApi';
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

const DbProjectTable: FC<{ searchParam: any }> = ({ children, searchParam }) => {
  const tableId = '#project_List';
  const url = getAllProject;
  const initialModel: IProjectWfDTO = {};
  const navigate = useNavigate();
  const [projectWFModel, setProjectWfModel] = useState(initialModel);
  const [projId, serProjId] = useState('');
  const [openWFPop, setOpenWFPop] = useState(false);
  const [openDelPop, setOpenDelPop] = useState(false);
  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));

  useEffect(() => {
    const order = [[7, 'desc']];
    const columns = [      
      { data: 'projectCode' },
      { data: 'name' },
      { data: 'taskCode' },
      { data: 'clientName' },
      { data: 'projectPartner' },
      { data: 'taskManager' },
      { data: 'hoursBooked' },
      //   { data: 'billingAmount' },
      {        
        data: 'startDate',
        render: function (data) {
          const date = new Date(data);
          const month = date.getMonth() + 1;
          return (
            date.getDate() +
            '/' +
            (month.toString().length > 1 ? month : '0' + month) +
            '/' +
            date.getFullYear()
          );
        },
      },
      // { data: null },
      { data: 'projectStatus' },
      { data: null },
    ];
    const columnDefs = [
      {
        targets: 0,
        "width": "10%",
        render: function (row, data, type) {
          if (row && row.length > 0) {
            return `<a href="#" id="btnNavigate" class="pointer-cursor">` + row + `</a>`;
          }
          return '';
        },
      }, 
      {
        targets: 1,
        "width": "10%",
        orderable: false,
        render: function (row, data, type) {
          if (row) {
            return getNotes(row);
          }
          return '';
        },
      },  
      {
        targets: 2,
        "width": "3%",
        orderable: false,
      },
      {
        targets: 3,
        "width": "18%",
        orderable: false,
        render: function (row, data, type) {
          if (row) {
            return getNotesClient(row);
          }
          return '';
        },
      },
      {
        targets: 4,
        "width": "5%",
        orderable: false,
        render: function (row, data, type) {
          if (row) {
            return getNotes(row);
          }
          return '';
        },
      },
      {
        targets: 5,
        "width": "5%",
        orderable: false,
        render: function (row, data, type) {
          if (row) {
            return getNotes(row);
          }
          return '';
        },
      },
      {
        targets: 6,
        "width": "5%",
        orderable: false,
      },
      {
        targets: 7,
        "width": "8%",
        orderable: false,
      },
      {
        targets: 8,
        "width": "12%",
        orderable: false,
        render: function (row, data, type) {
          debugger;
          if(type.restrictionReason) {
            return row + ' ( ' + type.restrictionReason + ' )';
          } else {
            return row;
          }
        },       
      },
      // {
      //   targets: 1,
      //   render: function (row, data, type) {
      //     if (row && row.length > 0) {
      //       return `<a href="#" id="btnNavigate" class="pointer-cursor">` + row + `</a>`;
      //     }
      //     return '';
      //   },
      // }, 
      {
        targets: 9,        
        orderable: false,
        "width": "8%",
        render: function (row, data, type) {
          const actions: string[] = [];
          if (row.showEmailTriggered) {
            actions.push(commonBtnText('btnShowEmailTriggered', 'Trigger Email'));
          } else {
            if(isAdmin && row.projectStatusId === Project_Wf_StatusTypes.Created){
              actions.push(commonBtnText('btnShowEmailTriggered', 'Trigger Email'));
            }
          }
          // if (row.showMarkasQuotable) {
          //   actions.push(
          //     commonBtnText(
          //       'btnShowMarkasQuotable',
          //       'Yes, the engagement is over and can be used as a Credential',
          //     ),
          //   );
          // }
          // if (row.showMarkasNonQuotable) {
          //   actions.push(
          //     commonBtnText(
          //       'btnShowMarkasNonQuotable',
          //       'No, the engagement cannot be used as a Credential as yet',
          //     ),
          //   );
          // }
          // if (row.showMarkasRestricted) {
          //   actions.push(
          //     commonBtnText(
          //       'btnShowMarkasRestricted',
          //       'Due to EL / ToB restriction, this project cannot be used as a credential',
          //     ),
          //   );
          // }
          // if (row.showOverridesRestriction) {
          //   actions.push(commonBtnText('btnShowOverridesRestriction', 'Overrides Restriction'));
          // }
          // if (
          //   row.showSubmitforPartnerAproval ||
          //   row.showPartnerMarkasApproved ||
          //   row.showClientMarkasApproved ||
          //   row.showPartnerMarkasRejected ||
          //   row.showClientMarkasRejected ||
          //   row.showMarkasneedMoreInfo
          // ) {
          //   //to replace actual button here
          //   actions.push(
          //     `<a href='#' title='Next'><i id='btnAction'  class='fa fa-arrow-right faFontSize'></i></a>`,
          //   );
          // }

          // const edit = `<a href='#'   title='Edit'><i id='btnEdit' class='fa fa-edit faFontSize'></i></a>`;
          // const view = `<a href='#'   title='View'><i id='btnView'  class='fa fa-eye faFontSize'></i></a>`;
          // const trash = `<a href='#'  title='Delete'><i id='btnDelete'  class='fa fa-trash faFontSize'></i></a>`;
          let edit = '';
          if (isAdmin)
            edit = `<a href='#' title='Edit Project Details'><img id='btnEdit' src=${editIcon} alt="Edit Project Details" height="18" class="grdIconDis" /></a>`;
          else
            edit = `<a href='#' title='You can update Client Name, Client Contact Name, 
            Client Email, Project Partner, Task Manager'><img id='btnEdit' src=${editIcon} alt="You can update Client Name, Client Contact Name, 
            Client Email, Project Partner, Task Manager" height="18" class="grdIconDis" /></a>`;

          const view = `<a href='#' title='View Project Details'><img id='btnView' src=${viewIcon} alt="View Project Details" height="21" class="grdIconDis" style="margin-top: -1px;margin-right: -4px;"/></a>`;
          const trash = `<a href='#' title='Delete'><img id='btnDelete' src=${deleteIcon} alt="Delete" height="16" class="grdIconDis" /></a>`;

          actions.push(view);
          if (row.isShowEditAction) actions.push(edit);
          if (isAdmin) actions.push(trash);

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

  const constrctWfModel = (wfStatusTypeId: number, wfActionId) => {
    const values: IProjectWfDTO = {
      projectId: projId,
      ProjectWfStatustypeId: wfStatusTypeId,
      ProjectWfActionId: wfActionId,
    };
    setProjectWfModel(values);
  };

  jq(tableId).on('click', '#btnShowEmailTriggered', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      serProjId(selectedRow.completeObject.projectId);
      constrctWfModel(Project_Wf_StatusTypes.NotResponded, Project_Wf_Actions.EmailTriggered);
      setOpenWFPop(true);
    }
  });
  jq(tableId).on('click', '#btnShowMarkasQuotable', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      serProjId(selectedRow.completeObject.projectId);
      constrctWfModel(Project_Wf_StatusTypes.Quotable, Project_Wf_Actions.MarkasQuotable);
      setOpenWFPop(true);
    }
  });
  jq(tableId).on('click', '#btnShowMarkasNonQuotable', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      serProjId(selectedRow.completeObject.projectId);
      constrctWfModel(Project_Wf_StatusTypes.NotQuotable, Project_Wf_Actions.MarkasNonQuotable);
      setOpenWFPop(true);
    }
  });

  jq(tableId).on('click', '#btnShowMarkasRestricted', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      serProjId(selectedRow.completeObject.projectId);
      constrctWfModel(Project_Wf_StatusTypes.Restricted, Project_Wf_Actions.MarkasRestricted);

      setOpenWFPop(true);
    }
  });
  jq(tableId).on('click', '#btnShowOverridesRestriction', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      serProjId(selectedRow.completeObject.projectId);
      constrctWfModel(Project_Wf_StatusTypes.Quotable, Project_Wf_Actions.OverridesRestriction);

      setOpenWFPop(true);
    }
  });

  jq(tableId).on('click', '#btnAction', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      navigate(`/db/projects/${selectedRow.completeObject.projectId}/form`);
    }
  });

  jq(tableId).on('click', '#btnNavigate', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      if (selectedRow && selectedRow.completeObject.projectStatusId) {
        if (
          selectedRow.completeObject.projectStatusId == Project_Wf_StatusTypes.Quotable ||
          selectedRow.completeObject.projectStatusId ==
          Project_Wf_StatusTypes.PartnerApprovalPending ||
          selectedRow.completeObject.projectStatusId == Project_Wf_StatusTypes.RejectedbyPartner ||
          selectedRow.completeObject.projectStatusId ==
          Project_Wf_StatusTypes.ClientApprovalPending ||
          selectedRow.completeObject.projectStatusId == Project_Wf_StatusTypes.RejectedbyClient ||
          selectedRow.completeObject.projectStatusId ==
          Project_Wf_StatusTypes.ClientSeekingMoreInfo ||
          selectedRow.completeObject.projectStatusId == Project_Wf_StatusTypes.Approved
        ) {
          navigate(`/db/projects/${selectedRow.completeObject.projectId}/form`);
        } else {
          navigate(`/db/project/view/${selectedRow.completeObject.projectId}`);
        }
      }
    }
  });

  jq(tableId).on('click', '#btnEdit', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      navigate(`/db/project/edit/${selectedRow.completeObject.projectId}`);
    }
  });

  jq(tableId).on('click', '#btnView', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      navigate(`/db/project/view/${selectedRow.completeObject.projectId}`);
    }
  });

  jq(tableId).on('click', '#btnDelete', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      serProjId(selectedRow.completeObject.projectId);
      setOpenDelPop(true);
    }
  });

  const deleteProjectUUID = async () => {
    const res = await deleteProject(projId);
    if (res && res.data && res.data.status === 200) {
      setOpenDelPop(false);
      toastMessage(MessageType.Success, 'Project deleted successfully');
      jq(tableId).DataTable().ajax.reload();
    }
  };

  const handleWfChange = async () => {
    projectWFModel.projectId = projId;
    const res = await projectWfSubmit(projectWFModel);
    if (res && res.data && res.data.status === 200) {
      toastMessage(MessageType.Success, pwf_submit);
      window.location.reload();
    } else {
      toastMessage(MessageType.Error, internal_error);
      window.location.reload();
    }
  };

  const commonBtnText = (btnId: string, title: string) => {
    return `<a href='#' title='${title}'><i id='${btnId}' class='fa fa-check-circle faFontSize'></i></a>`;
  };

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

  const getNotes = (row) => {
    if (row) {      
      debugger;
        return (
          '<span style="white-space:nowrap" data-toggle="tooltip" title="' +
          row +
          '">' +
          (row.length > 12 ? row.substring(0, 12) + '...' : row) +
          '</span>'
        );     
    }
    return '';
  };

  const getNotesClient = (row) => {
    if (row) {      
      debugger;
        return (
          '<span style="white-space:nowrap" data-toggle="tooltip" title="' +
          row +
          '">' +
          (row.length > 35 ? row.substring(0, 35) + '...' : row) +
          '</span>'
        );     
    }
    return '';
  };

  return (
    <div id="dvId">
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
        open={openDelPop}
        onClose={() => {
          setOpenDelPop(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Project'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setOpenDelPop(false);
            }}
            className="reset-buttons-bg"
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={deleteProjectUUID}
            autoFocus
            className="buttons-bg"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <table
        id="project_List"
        className="display dt-responsive"
        style={{ width: '100%', color: 'black' }}
      >
        <thead id="project_List_head">
          <tr>          
            <th>Project Code</th>
            <th>Project Name</th>
            <th>Task Code</th>
            <th>Client Name</th>
            <th>Project Partner</th>
            <th>Task Manager</th>
            <th>Hours Booked</th>
            {/* <th>Billing Amount</th> */}
            <th>Project Start Date</th>
            {/* <th>Form/Credentials</th> */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};
export default DbProjectTable;
