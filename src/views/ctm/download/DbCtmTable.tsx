import React, { FC, useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { clearAll } from '../../../common/helpers/storage.helper';
import { config } from '../../../common/environment';
import jq from 'jquery';
import { renderDataTable } from '../../../common/helpers/datatables.net.helper';
import { useNavigate } from 'react-router-dom';
import { exportDbCtmExcel, exportDbCtmZip } from '../../projects/projectApi';
import { getCtmProjectDetails } from '../../projects/taxonomyApi';
import { constant } from 'lodash';
import { toastMessage } from '../../../common/toastMessage';
import { MessageType, Report_Types } from '../../../common/enumContainer';
import moment from 'moment';

const DbCtmTable: FC<{ checkSelectAll: any; searchParam: any; passChildData: any; passChildCtmData: any }> = ({
  checkSelectAll,
  searchParam,
  passChildData,
  passChildCtmData,
}) => {
  const tableId = '#download_List';
  const subtableId = '#download_List_sub';
  const navigate = useNavigate();
  const url = config.Resource_Url + `ctm/ProjectCred/ctmdownload`;
  const selectedItems: any = [];
  const selectedSubItems: any = [];
  let projCtm: any = '';
  useEffect(() => {
    const columns = [
      {
        className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: '',
      },
      { data: null },
      { data: 'projectName' },
      { data: 'clientName' },
      { data: 'subSectorName' },      
      { data: 'managerName' },
      { data: 'partnerName' },
      {
        data: 'confirmationDate',
        render: function (data) {
          if (data != null) {
            const date = new Date(data);
            const month = date.getMonth() + 1;
            return (
              String(date.getDate()).padStart(2, '0') +
              '/' +
              (month.toString().length > 1 ? month : '0' + month) +
              '/' +
              date.getFullYear()
            );
          }
          return '';
        },
      },
      { data: 'projectType' },
      // { width: '120px', data: null },
    ];
    const order = [];

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
          return type === 'display' ? '<input class="chk-select" type="checkbox">' : '';
        },
      },
      {
        targets: 2,
        render: function (row, data, type) {
          return type.projectType === 'CFIB' ? 'N/A' : row;
        },
      },
      {
        targets: 3,
        render: function (row, data, type) {
          return type.projectType === 'CFIB' ? 'N/A' : row;
        },
      },
      {
        targets: 4,
        render: function (row, data, type) {
          return type.sectorName + ' | ' + type.subSectorName;
        },
      },
      {
        targets: 5,
        orderable: false,        
      },
      {
        targets: 6,
        orderable: false,
      },
      {
        targets: 7,
        orderable: false,
      },
      {
        targets: 8,
        orderable: false,
      },
      // {
      //   targets: 9,     
      //   render: function (row, data, type) {
      //     const actions: string[] = [];
      //     if (row) {
      //       // actions.push(
      //       //   `<a href='#'   title='View'><i id='btnView' class='fa fa-file faFontSize'></i></a>`,
      //       // );
      //       actions.push(
      //         `<a href='#'   title='Download'><i id='btnDownload' class='fa fa-download faFontSize'></i></a>`,
      //       );
      //     }
      //     return wrapActions(actions);
      //   },
      // },
    ];

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

    const ajaxData = { searchParams: JSON.stringify(searchParam) };
    if (searchParam.showGrid == true) {
      if (jq.fn.dataTable.isDataTable(tableId)) {
        const dt = jq(tableId).DataTable();
        dt.clear().destroy();
      }
      if (checkSelectAll){
        jq('input[class="chk-select-all"]').prop('checked', false);
      }

      const dtTable: any = renderDataTable(
        tableId,
        url,
        columns,
        columnDefs,
        order,
        ajaxData,
        false,
        false,
        false,
      );

      jq(tableId).on('click', '#btnView', function () {
        const selectedRow = {
          completeObject: getCompleteRowObject(this),
        };
        if (selectedRow.completeObject) {
          navigate(`/ctm/projects/downloads/view/${selectedRow.completeObject.projectId}`);
        }
      });
      
      jq(tableId).on('click', '#btnDownload', function () {        
        const selectedRow = {
          completeObject: getCompleteRowObject(this),
        };
        if (selectedRow.completeObject) {
          exportDbCtmZip([selectedRow.completeObject.projectId]);          
        }
      });

      jq(tableId).on('change', '.chk-select', function (e) {
        e.preventDefault();
        const selectedRow = {
          completeObject: getCompleteRowObject(this),
        };
        if (e.currentTarget.checked == false) {
          jq('input[class="chk-select-all"]').prop('checked', false);
          const index = selectedItems.indexOf(selectedRow.completeObject.projectId);
          if (index > -1) {
            selectedItems.splice(index, 1); // 2nd parameter means remove one item only
          }
        } else {
          selectedItems.push(selectedRow.completeObject.projectId);
        }
        passChildData(selectedItems);
      });

      jq(tableId).on('click', '.chk-select-all', function (e) {
        // Get all rows with search applied
        const rows = jq(tableId).DataTable().rows({ search: 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        jq('input[class="chk-select"]', rows).prop('checked', this.checked).change();        
      });

      jq(tableId).on('click', 'td.dt-control', async function () {
        debugger;
        const tr = jq(this).closest('tr');
        const row = dtTable.row(tr);

        if (row.child.isShown()) {
          // This row is already open - close it
          row.child.hide();
          tr.removeClass('shown');
        } else {
          // Open this row
          const dtTable1 = jq(tableId).DataTable();
          const selectedRow = {
            completeObject: dtTable1.row(jq(this).parents('tr')).data(),
          };
          const tabledata = await getProjectByProjId(
            selectedRow.completeObject.projectId,
            selectedRow.completeObject.childData,
          );
          row.child(tabledata).show();
          tr.addClass('shown');
          // jq(subtableId + '_' + selectedRow.completeObject.projectId).on(
          //   'click',
          //   '#chkCTM',
          //   function (e) {
          //     debugger;
          //     const projectCtmId = jq(this).attr('data-projectCtmId');
          //     const projId = jq(this).attr('data-projId');
          //     const errorStatus = jq(this).attr('data-error');
          //     const duplicateStatus = jq(this).attr('data-duplicate');

          //     if (!e.currentTarget.checked) {
          //       const index = selectedSubItems.findIndex((object) => {
          //         return object.projectCtmId === projectCtmId;
          //       });
          //       if (index > -1) {
          //         selectedSubItems.splice(index, 1); // 2nd parameter means remove one item only
          //       }
          //     } else {
          //       const selectedItem = {
          //         projId: projId,
          //         projectCtmId: projectCtmId,
          //         errorStatus: Number(errorStatus),
          //         duplicateStatus: Number(duplicateStatus),
          //       };

          //       selectedSubItems.push(selectedItem);
          //     }
          //     passChildCtmData(selectedSubItems);
          //   },
          // );
        }
      });

      jq(tableId).on(
        'click',
        '#chkCTM',
        function (e) {
          debugger;
          const projectCtmId = jq(this).attr('data-projectCtmId');
          const projId = jq(this).attr('data-projId');
          const errorStatus = jq(this).attr('data-error');
          const duplicateStatus = jq(this).attr('data-duplicate');

          if (!e.currentTarget.checked) {
            const index = selectedSubItems.findIndex((object) => {
              return object.projectCtmId === projectCtmId;
            });
            if (index > -1) {
              selectedSubItems.splice(index, 1); // 2nd parameter means remove one item only
            }
          } else {
            const selectedItem = {
              projId: projId,
              projectCtmId: projectCtmId,
              errorStatus: Number(errorStatus),
              duplicateStatus: Number(duplicateStatus),
            };

            selectedSubItems.push(selectedItem);
          }
          passChildCtmData(selectedSubItems);
        },
      );

      // Handle click on "Expand All" button
      jq('#btn-show-all-children').on('click', function () {
        // Enumerate all rows
        jq(tableId)
          .DataTable()
          .rows()
          .every(function () {
            const tr = jq(this);
            const row = dtTable.row(tr);
            // If row has details collapsed
            if (!this.child.isShown()) {
              // Open this row
              const data = this.data();
              const tabledata = getProjectByProjId(data.projectId, data.childData);
              row.child(tabledata).show();
              tr.addClass('shown');
            }
          });
      });

      // Handle click on "Collapse All" button
      jq('#btn-hide-all-children').on('click', function () {
        // Enumerate all rows
        jq(tableId)
          .DataTable()
          .rows()
          .every(function () {
            const tr = jq(this);
            const row = dtTable.row(tr);
            // If row has details expanded
            if (this.child.isShown()) {
              // Collapse row details
              row.child.hide();
              tr.removeClass('shown');
            }
          });
      });
    }
  }, [searchParam]);

  const getCompleteRowObject = (row) => {
    const dtTable = jq(tableId).DataTable();
    const selectedRow = {
      completeObject: dtTable.row(jq(row).parents('tr')).data(),
    };
    return selectedRow.completeObject;
  };
  const getProjectByProjId = (projId, response) => {
    const parentTableMaxWidth = jq('#download_List').width();
    const childTableMaxWidth = (parentTableMaxWidth ?? 0) - 25;
    const tabledata =
      `<div style='width:` +
      childTableMaxWidth +
      `px;overflow-x: auto;'><table class="display childdataTable" id="download_List_sub_` +
      projId +
      `">` +
      '<thead>' +
      '<tr>' +
      '<th></th>' +
      '<th>Transaction Date</th>' +
      '<th>Target Name</th>' +
      '<th>Target Business Description</th>' +
      '<th>Target Listed / UnListed</th>' +
      '<th>Name Of Bidder</th>' +
      '<th>Stake Acquired</th>' +
      '<th>Control Type</th>' +
      '<th>Currency</th>' +
      '<th>Deal Value</th>' +
      '<th>Enterprise Value</th>' +
      '<th>Revenue</th>' +
      '<th>EBITDA</th>' +
      '<th>EV/Revenue</th>' +
      '<th>EV/EBITDA</th>' +
      '<th>Source Of Multiple</th>' +
      '<th>Deal Type</th>' +
      '<th>Custom Multiple</th>' +
      '<th>Name of Multiple</th>' +
      '<th>Keyword</th>' +
      '<th>Action</th>' +
      '</tr>' +
      '</thead>';
    if (response) {
      let tableRow = '';
      response.map((item: any, index: any) => {
        const classname = index % 2 == 0 ? 'even' : 'odd';
        let stateCheck = '';
        projCtm = item.projectCtmId;
        if (selectedSubItems.length) {
          selectedSubItems.forEach(function (d) {
            if (d.projectCtmId == projCtm) {
              stateCheck = ' checked ';
            }
          });
        }
        projCtm = '';       

        tableRow =
          tableRow +
          '<tr class=' +
          classname +
          '>' +
          `<td> <input type="checkbox" id="chkCTM" name="sub-check-box" ` +
          stateCheck +
          `data-projectCtmId="${item.projectCtmId}" data-projId="${projId}" data-error="${item.errorStatusId}" data-duplicate="${item.duplicateStatusId}">` +
          '</td>' +
          '<td>' +
          (item.transactionDate != '' ? moment(item.transactionDate).format('DD/MM/yyyy') : '') +
          '</td>' +
          '<td>' +
          item.targetName +
          '</td>' +
          '<td>' +
          item.targetBusinessDescription +
          '</td>' +
          '<td>' +
          item.targetListedUnListed +
          '</td>' +
          '<td>' +
          item.nameOfBidder +
          '</td>' +
          '<td>' +
          item.stakeAcquired +
          '</td>' +
          '<td>' +
          item.controllingType +
          '</td>' +
          '<td>' +
          item.currency +
          '</td>' +
          '<td>' +
          item.dealValue +
          '</td>' +
          '<td>' +
          item.enterpriseValue +
          '</td>' +
          '<td>' +
          item.revenue +
          '</td>' +
          '<td>' +
          item.ebitda +
          '</td>' +
          '<td>' +
          item.evRevenue +
          '</td>' +
          '<td>' +
          item.evEbitda +
          '</td>' +
          '<td>' +
          item.sourceOdMultiple +
          '</td>' +
          '<td>' +
          item.dealType +
          '</td>' +
          '<td>' +
          (item.customMultile != null ? item.customMultile : '') +
          '</td>' +
          '<td>' +
          (item.nameOfMultiple != null ? item.nameOfMultiple : '') +
          '</td>' +
          '<td>' +
          (item.businessDescription != null ? item.businessDescription : '') +
          '</td>' +
          '<td>' +
          `<a href='#' style="display:${
            item.duplicateStatusId === Report_Types.CTMDuplicateData ? 'block' : 'none'
          }" title='Flagged as duplicate/inconsistent data'><i id='btnDuplicate' class='fa fa-clone faFontSize' style='color:#F69F19 !important'></i></a>` +
          `<a href='#' style="display:${
            item.errorStatusId === Report_Types.CTMErrorData ? 'block' : 'none'
          }"   title='Flagged as errors in data'><i id='btnErrors' class='fa fa-exclamation-circle faFontSize' style='color:#F69F19 !important'></i></a>` +
          `<a href='#' style="display:${
            item.errorStatusId === Report_Types.CTMErrorResolved ||
            item.errorStatusId === Report_Types.CTMErrorNotanIssue
              ? 'block'
              : 'none'
          }"   title='${
            item.errorStatus
          }'><i id='btnErrors' class='fa fa-exclamation-circle faFontSize' style='color:#76BC3B !important'></i></a>` +
          `<a href='#' style="display:${
            item.duplicateStatusId === Report_Types.CTMDuplicateResolved ||
            item.duplicateStatusId === Report_Types.CTMDuplicateNotanIssue
              ? 'block'
              : 'none'
          }" title='${
            item.duplicateStatus
          }'><i id='btnDuplicate' class='fa fa-clone faFontSize' style='color:#76BC3B !important'></i></a>` +
          '</td>' +
          '</tr>';
      });
      return tabledata + tableRow + '</table></div>';
    } else {
      return '<p>Internal Server Error Occurred.Please try Again ..</p>';
    }
  };
  //const getAction = (item) => {};

  return (
    <>
      {searchParam.showGrid && (
        <Grid container spacing={1}>
          <Grid item xs={12} md={2} xl={2}>
            <Button
              id="btn-show-all-children"
              color="secondary"
              variant="contained"
              style={{ marginBottom: '5px', width: '100%' }}
              className="buttons-bg"
            >
              Expand All
            </Button>
          </Grid>
          <Grid item xs={12} md={2} xl={2}>
            <Button
              id="btn-hide-all-children"
              color="secondary"
              variant="contained"
              style={{ marginBottom: '5px', width: '100%' }}
              className="buttons-bg"
            >
              Collapse All
            </Button>
          </Grid>
        </Grid>
      )}
      <div id="dvId" style={{ maxHeight: '700px', overflowY: 'auto', overflowX: 'hidden' }}>
        {searchParam.showGrid && (
          <div>
            {/* <button id="btn-show-all-children" type="button">
              Expand All
            </button>
            <button id="btn-hide-all-children" type="button">
              Collapse All
            </button> */}
            <table
              id="download_List"
              className="display dt-responsive"
              style={{ width: '100%', color: 'black' }}
            >
              <thead id="download_List_Head">
                <tr>
                  <th></th>
                  <th>                    
                    <input className="chk-select-all" type="checkbox"></input>
                  </th>
                  <th>Project Name</th>
                  <th>Client Name</th>
                  <th>Sub Sector</th>
                  <th>Manager Name</th>
                  <th>Partner Name</th>
                  <th>CTM file Upload Date</th>
                  <th>SBU</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
            </table>
          </div>
        )}
      </div>      
    </>
  );
};
export default DbCtmTable;
