import React, { FC, useEffect, useState } from 'react';
import {
  clearAll,
  clearStorage,
  getStorage,
  setStorage,
} from '../../common/helpers/storage.helper';
import { config } from '../../common/environment';
import jq from 'jquery';
import {
  internal_error,
  projectCred_selectItems,
  pwc_token,
  unauthorized,
  unauthorized_dw,
} from '../../common/constants/common.constant';
import { credRenderDataTable } from '../../common/helpers/datatables.net.helper';
import { Pagination } from '@mui/material';
import { toastMessage } from '../../common/toastMessage';
import { MessageType } from '../../common/enumContainer';

const DbCredTable: FC<{ searchParam: any; passChildData: any }> = ({
  children,
  searchParam,
  passChildData,
}) => {
  const tableId = '#download_List';
  const url = config.Resource_Url + `ProjectCred/searchprojectscredV1`;
  const childData = getStorage(projectCred_selectItems);
  let selectedItems: any = childData && childData.length > 0 ? childData : [];
  useEffect(() => {
    const columns = [
      { data: null },
      {
        data: 'confirmationDate',
        render: function (data) {
          if (data != null) {
            const date = new Date(data);
            const month = date.getMonth() + 1;
            return (
              date.getDate() +
              '/' +
              (month.toString().length > 1 ? month : '0' + month) +
              '/' +
              date.getFullYear()
            );
          }
          return '';
        },
      },
      { data: 'clientName' },
      { data: 'targetName' },
      { data: 'sectorName' },
      { data: 'subSectorName' },
      { data: 'projectDescription' },
      { data: 'shortDescription' },
      { data: 'dealsSBU' },
      { data: 'managerName' },
      { data: 'partnerName' },
    ];
    const order = [];

    const columnDefs = [
      {
        targets: 0,
        orderable: false,
        className: 'select-checkbox',
        render: function (data, type) {
          let index = -1;
          const items = getStorage(projectCred_selectItems);
          if (items && items.length > 0) {
            index = items.findIndex((o) => o == data.projectId);
          }
          if (index !== -1) {
            return type === 'display'
              ? '<input class="chk-select" checked="checked" type="checkbox">'
              : '';
          } else {
            return type === 'display' ? '<input class="chk-select"  type="checkbox">' : '';
          }
        },
      },
      {
        targets: 1,
        orderable: false,
      },
      {
        targets: 2,
        orderable: false,
      },
      {
        targets: 3,
        orderable: false,
      },
      {
        targets: 4,
        orderable: false,
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
      {
        targets: 9,
        orderable: false,
      },
      {
        targets: 9,
        orderable: false,
      },
    ];

    const ajaxData = { searchParams: JSON.stringify(searchParam) };

    if (searchParam.showGrid == true) {
      if (jq.fn.dataTable.isDataTable(tableId)) {
        const dt = jq(tableId).DataTable();
        dt.clear().destroy();
      }

      // const dtTable: any = credRenderDataTable(tableId, url, columns, columnDefs, order, ajaxData, false, true, true, 500);

      const dtTable = jq(tableId).DataTable({
        serverSide: true,
        responsive: true,
        processing: true,
        stateSave: false,
        ajax: {
          url: url,
          type: 'Post',
          dataType: 'json',
          data: ajaxData,
          beforeSend: function (request) {
            selectedItems = [];
            passChildData([]);
            jq('input[class="chk-select-all"]').prop('checked', false);
            clearStorage(projectCred_selectItems);
            document.body.classList.add('loading-indicator');
            request.setRequestHeader('Authorization', `Bearer ${localStorage.getItem(pwc_token)}`);
          },
          dataFilter: function (data) {
            return data;
          },
          complete: function () {
            document.body.classList.remove('loading-indicator');
          },
          error: function (xhr, error, code) {
            document.body.classList.remove('loading-indicator');
            if (xhr && xhr.status == 403) {
              toastMessage(MessageType.Error, unauthorized_dw);
              clearAll();
            } else if (xhr && xhr.status == 401) {
              clearAll();

              toastMessage(MessageType.Error, unauthorized);
            } else if (xhr && xhr.status == 500) {
              toastMessage(MessageType.Error, internal_error);
            }
          },
        },
        columns,
        columnDefs,
        order,
        paging: true,
        pageLength: 500,
        destroy: true,
        dom: '<"top"iflp<"clear">>rt<"bottom"iflp<"clear">>',
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
        setStorage(projectCred_selectItems, selectedItems);
      });
      jq(tableId).on('click', '.chk-select-all', function (e) {
        // Get all rows with search applied
        const rows = jq(tableId).DataTable().rows({ search: 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        jq('input[class="chk-select"]', rows).prop('checked', this.checked);
        const isChecked = this.checked;
        const data = jq(tableId).DataTable().rows().data();
        data.each(function (value, index) {
          if (isChecked) {
            selectedItems.push(value.projectId);
          } else {
            const index = selectedItems.indexOf(value.projectId);
            selectedItems.splice(index, 1);
          }
          passChildData(selectedItems);
          setStorage(projectCred_selectItems, selectedItems);
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

  return (
    <div id="dvId">
      {searchParam.showGrid && (
        <div>
          <table
            id="download_List"
            className="display dt-responsive"
            style={{
              width: '100%',
              color: 'black',
              display: 'block',
              maxHeight: '700px',
              overflowY: 'scroll',
            }}
          >
            <thead id="download_List_Head">
              <tr>
                <th>
                  <input className="chk-select-all" type="checkbox"></input>
                </th>
                <th>Confirmation Date</th>
                <th>Client Name</th>
                <th>Target Name</th>
                <th>Sector</th>
                <th>Sub Sector</th>
                <th>Keywords</th>
                <th>Short Description</th>
                <th>Deals SBU</th>
                <th>Manager Name</th>
                <th>Partner Name</th>
              </tr>
            </thead>
          </table>
        </div>
      )}
    </div>
  );
};
export default DbCredTable;
