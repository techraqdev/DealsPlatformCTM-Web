import jq from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive/js/dataTables.responsive';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import { toastMessage } from '../toastMessage';
import { MessageType } from '../enumContainer';
import {
    unauthorized_dw,
    unauthorized,
    internal_error,
    pwc_token,
    projectCred_selectItems,
} from '../constants/common.constant';
import { clearAll, clearStorage } from './storage.helper';

export const renderDataTable = (tableId: string, url: string, columns: DataTables.ColumnSettings[],
    columnDefs: DataTables.ColumnDefsSettings[], order: ((string | number)[]) | (string | number)[][], ajaxData: any = [],
    saveState = false, serverSide = true, pagination = true, pageLength = 10) => {
    const dtTable = jq(tableId).DataTable({
        serverSide: serverSide,
        responsive: true,
        processing: true,
        stateSave: saveState,
        dom: '<"top"iflp<"clear">>rt<"bottom"iflp<"clear">>',
        ajax: {
            url: url,
            type: 'Post',
            dataType: 'json',
            data: ajaxData,
            beforeSend: function (request) {
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
        paging: pagination,
        pageLength: pageLength
    });

    return dtTable
}
export const credRenderDataTable = (tableId: string, url: string, columns: DataTables.ColumnSettings[],
    columnDefs: DataTables.ColumnDefsSettings[], order: ((string | number)[]) | (string | number)[][], ajaxData: any = [],
    saveState = false, serverSide = true, pagination = true, pageLength = 10) => {
    const dtTable = jq(tableId).DataTable({
        serverSide: serverSide,
        responsive: true,
        processing: true,
        stateSave: saveState,
        ajax: {
            url: url,
            type: 'Post',
            dataType: 'json',
            data: ajaxData,
            beforeSend: function (request) {
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
        paging: pagination,
        pageLength: pageLength,
        destroy: true
    });

    return dtTable
}