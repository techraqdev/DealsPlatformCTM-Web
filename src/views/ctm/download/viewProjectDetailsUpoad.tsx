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
} from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import {
  internal_error,
  pwf_submit,
  uploadExtentions,
} from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories, getCtmProjectDetails } from '../../projects/taxonomyApi';
import { projectCtmDetail, taxonomyCategory, taxonomyMin } from '../../projects/taxonomyModels';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import * as Yup from 'yup';
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { debug } from 'console';

const ViewProjectUpload: FC = () => {
  const navigate = useNavigate();
  const { projId, isfrom } = useParams();
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);
  const [openEditRecord, setOpenEditRecord] = useState(false);

  const intValues: projectCtmDetail = {};

  const [initialValues, setInitialValues] = useState(intValues);
  const tableId = '#project_upload_List';

  const handleOpenEditClose = () => {
    setOpenEditRecord(false);
  };

  const BCrumb = [
    {
      to: '/ctm/projects/downloads',
      title: 'CTM',
    },
    {
      title: 'Downloads',
    },
  ];

  useEffect(() => {
    getProjectByProjId();
  }, []);

  useEffect(() => {
    const columns = [
      { data: 'transactionDate',
        render: function (data) {
        const date = new Date(data);
        const month = date.getMonth() + 1;
        return (
          String(date.getDate()).padStart(2, '0') +
          '/' +
          (month.toString().length > 1 ? month : '0' + month) +
          '/' +
          date.getFullYear()
        );
      },
      },
      { data: 'targetName' },
      { data: 'targetBusinessDescription' },
      { data: 'targetListedUnListed' },
      { data: 'nameOfBidder' },
      { data: 'stakeAcquired' },
      { data: 'currency' },
      { data: 'dealValue' },
      { data: 'enterpriseValue' },
      { data: 'revenue' },
      { data: 'ebitda' },
      { data: 'evRevenue' },
      { data: 'evEbitda' },
      { data: 'sourceOdMultiple' },
      { data: 'dealType' },
    ];

    const columnDefs = [];
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
        setOpenEditRecord(true);
      }
    });

    const getCompleteRowObject = (row) => {
      const dtTable = jq(tableId).DataTable();
      const selectedRow = {
        completeObject: dtTable.row(jq(row).parents('tr')).data(),
      };
      return selectedRow.completeObject;
    };
  }, [uplodedDetail]);

  const getProjectByProjId = async () => {
    const response = await getCtmProjectDetails(projId);
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
            {uplodedDetail.length > 0 && (
              <div>
                <table
                  id="project_upload_List"
                  className="display dt-responsive"
                  style={{ width: '100%', color: 'black' }}
                >
                  <thead>
                    <tr>
                      <th>Transaction Date</th>
                      <th>Target Name</th>
                      <th>Target Business Description</th>
                      <th>Target Listed / UnListed</th>
                      <th>Name Of Bidder</th>
                      <th>Stake Acquired</th>
                      <th>Currency</th>
                      <th>Deal Value</th>
                      <th>Enterprise Value</th>
                      <th>Revenue</th>
                      <th>EBITDA</th>
                      <th>EV/Revenue</th>
                      <th>EV/EBITDA</th>
                      <th>Source Of Multiple</th>
                      <th>Deal Type</th>
                    </tr>
                  </thead>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default ViewProjectUpload;
