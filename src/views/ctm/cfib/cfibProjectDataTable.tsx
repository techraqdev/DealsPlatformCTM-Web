import React, { FC, useEffect, useState } from 'react';
import jq from 'jquery';
import { internal_error, pwc_isAdmin, pwf_submit } from '../../../common/constants/common.constant';
import { renderDataTable } from '../../../common/helpers/datatables.net.helper';
import {
  deleteCfibProject,
  getCfibAllProject,
  projectSupportingFileUpload,
  projectWfSubmit,
} from '../../projects/projectApi';
import { useNavigate } from 'react-router-dom';
import { IProjectWfDTO } from '../../projects/projectModels';
import {
  MessageType,
  Project_Wf_Actions,
  Project_Wf_StatusTypes,
} from '../../../common/enumContainer';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { toastMessage } from '../../../common/toastMessage';
import { getStorage } from '../../../common/helpers/storage.helper';
import deleteIcon from '../../../assets/images/icons/delete.png';
import viewIcon from '../../../assets/images/icons/view.png';
import uploadIcn from '../../../assets/images/icons/upload.png';

const CfibProjectTable: FC<{ searchParam: any }> = ({ children, searchParam }) => {
  const tableId = '#cfib_project_List';
  const url = getCfibAllProject;
  const navigate = useNavigate();
  const [isAdmin] = React.useState(getStorage(pwc_isAdmin));
  const [openDelPop, setOpenDelPop] = useState(false);
  const [projId, serProjId] = useState('');
  
  useEffect(() => {
    const order = [[0, 'desc']];
    const columns = [
      { data: 'month' },
      { data: 'year' },
      { data: 'sector' },
      { data: 'subSector' },
      { data: 'keyword' },
      { data: 'userName' },
      { data: 'projectStatus' },
      { data: null },
    ];
    // if (isAdmin) {
    //   columns.splice(2, 0,{ data: 'userName' } );

    // }

    const columnDefs = [
      {
        targets: 0,
        render: function (row, data, type) {
          if (row) {
            return getMonthName(row);
          }
          return '';
        },
      },
      {
        //targets: isAdmin ? 7 : 6,
        targets: 7,
        orderable: false,
        render: function (row, data, type) {
          const actions: string[] = [];
          //if (row.isShowAction) {
          // const edit = `<a href='#'   title='Edit'><i id='btnEdit' class='fa fa-edit faFontSize'></i></a>`;
          // const view = `<a href='#'   title='View'><i id='btnView'  class='fa fa-eye faFontSize'></i></a>`;
          // const trash = `<a href='#'  title='Delete'><i id='btnDelete'  class='fa fa-trash faFontSize'></i></a>`;

          const view = `<a href='#' title='View'><img id='btnView' src=${viewIcon} alt="View" height="21" class="grdIconDis viewIconDis" /></a>`;
          if (isAdmin) {
          const trash = `<a href='#' title='Delete'><img id='btnDelete' src=${deleteIcon} alt="Delete" height="16" class="grdIconDis" /></a>`;
          actions.push(trash);  
        }
          const uploadIcon = `<a href='#' title='CFIB Information'><img id='btnEditInfo' src=${uploadIcn} alt="Upload" height="17" class="grdIconDis" style="margin-top: 2px;"  /></a>`;
          actions.push(view);
          
          // if (row.isShowAction) actions.push(uploadIcon);
          //}
          return wrapActions(actions);
        },
      },
    ];

    const ajaxData = { searchParams: JSON.stringify(searchParam) };
    if (jq.fn.dataTable.isDataTable(tableId)) {
      const dt = jq(tableId).DataTable();
      dt.clear().destroy();
      dt.state.clear();
    }
    const dtTable = renderDataTable(tableId, url, columns, columnDefs, order, ajaxData);
    // renderDataTable(tableId, url, columns, columnDefs, order, null, true);
  }, [searchParam]);

  const getMonthName = (row) => {
    switch (row) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
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
  const getCompleteRowObject = (row) => {
    const dtTable = jq(tableId).DataTable();
    const selectedRow = {
      completeObject: dtTable.row(jq(row).parents('tr')).data(),
    };
    return selectedRow.completeObject;
  };

  jq(tableId).on('click', '#btnEdit', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      navigate(`/cfib/project/edit/${selectedRow.completeObject.projectId}`);
    }
  });

  jq(tableId).on('click', '#btnView', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      navigate(`/cfib/project/view/${selectedRow.completeObject.projectId}`);
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
    const res = await deleteCfibProject(projId);
    if (res && res.data && res.data.status === 200) {
      setOpenDelPop(false);
      toastMessage(MessageType.Success, 'Project deleted successfully');
      jq(tableId).DataTable().ajax.reload();
    }
  };
  jq(tableId).on('click', '#btnEditInfo', function () {
    const selectedRow = {
      completeObject: getCompleteRowObject(this),
    };
    if (selectedRow.completeObject) {
      navigate(`/ctm/project/edit/${selectedRow.completeObject.projectId}/cfib`);
    }
  });

  return (
    <div id="dvId">
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
        id="cfib_project_List"
        className="display dt-responsive"
        style={{ width: '100%', color: 'black' }}
      >
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            {/* {isAdmin && <th>User Name</th>} */}
            <th>Sector</th>
            <th>Sub Sector</th>
            <th>Unique Identifier</th>
            <th>User Name</th>
            <th>Project Status</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};
export default CfibProjectTable;
