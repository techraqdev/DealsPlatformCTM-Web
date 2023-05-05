import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageType } from '../../../common/enumContainer';
import { getProjectCtmDetails } from '../../projects/projectApi';
import { toastMessage } from '../../../common/toastMessage';
import { uploadExtentions } from '../../../common/constants/common.constant';
import { getTaxonomyDataByCategories } from '../../projects/taxonomyApi';
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
  DialogContentText,
  Paper,
  ListItem,
  ListItemText,
  Grid,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { useParams } from 'react-router';
import jq from 'jquery';

const CtmProjectView: FC = () => {
  const navigate = useNavigate();
  const { projId } = useParams();
  const [uplodedDetail, setUploadedDetails] = React.useState<projectCtmDetail[]>([]);

  const intValues: projectCtmDetail = {};

  const [initialValues, setInitialValues] = useState(intValues);
  const tableId = '#project_upload_List';

  const BCrumb = [
    {
      to: '/ctm/project/View',
      title: 'CTM',
    },
    {
      title: 'Projects',
    },
  ];

  const getProjectCtmResult = async () => {
    const result = await getProjectCtmDetails(projId);
    if (result) {
      setUploadedDetails(result.data);
    }
  };

  useEffect(() => {
    getProjectCtmResult();
  }, []);

  useEffect(() => {
    const columns = [
      { data: 'transactionDate',
        render: function (data) {
        const date = new Date(data);
        const month = date.getMonth() + 1;
        return (
           data != '' ?
          String(date.getDate()).padStart(2, '0') +
          '/' +
          (month.toString().length > 1 ? month : '0' + month) +
          '/' +
          date.getFullYear() : ''
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

    jq(tableId).DataTable({
      data: uplodedDetail,
      columns: columns,
      columnDefs: [],
      serverSide: false,
      responsive: true,
      processing: true,
      destroy: true,
      ordering: false,
      paging: false,
    });

    const getCompleteRowObject = (row) => {
      const dtTable = jq(tableId).DataTable();
      const selectedRow = {
        completeObject: dtTable.row(jq(row).parents('tr')).data(),
      };
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

  return (
    <PageContainer title="Projects" description="display project list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Projects" items={BCrumb} />
      </div>
      <Card className="project-list">
        <CardContent>
          <div className="row pull-right">
            <Button
              color="secondary"
              variant="contained"
              style={{ margin: '5px' }}
              onClick={() => {
                navigate('/ctm/projects/downloads');
              }}
              className="reset-buttons-bg"
            >
              Cancel
            </Button>
          </div>
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
export default CtmProjectView;
