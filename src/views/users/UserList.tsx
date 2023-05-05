import React, { FC, useEffect, useState } from 'react';
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
  ListItem,
  ListItemText,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from '@mui/material';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import jq from 'jquery';
import { User_API, deleteUserItem, activateUserItem, fileUpload, exportAuditLogsExcel } from './userApi';
import { useNavigate } from 'react-router-dom';
import { MessageType } from '../../common/enumContainer';
import { toastMessage } from '../../common/toastMessage';
import { renderDataTable } from '../../common/helpers/datatables.net.helper';
import { uploadExtentions, userSearchToken } from '../../common/constants/common.constant';
import { getStorage, setStorage } from '../../common/helpers/storage.helper';
import deleteIcon from '../../assets/images/icons/delete.png';
import editIcon from '../../assets/images/icons/edit.png';
import { userSearch, UserRoleId, AdminRoleId } from './userModels';


const UserList: FC = () => {
  let isValidInput = true;

  const searchFilter: userSearch = {
    name: '',
    email: '',
    role: '',
    designation: '',
    active: '1',
    userId: '',
    resetGrid: false,
  };


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const searchterm = getStorage(userSearchToken);
  // const [name, setName] = useState(searchterm != null ? searchterm.SearchTerm : '');
  const [file, setUploadedFile] = useState('');
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [openFileUpload, setFileUpload] = React.useState(false);
  const [failedEmails, setFailedEmails] = React.useState([]);
  const tableId = '#user_List';

  const [name, setName] = useState(searchFilter.name ?? '');
  const [email, setEmail] = useState(searchFilter.email ?? '');
  const [role, setRole] = useState(searchFilter.role ?? '');
  const [designation, setDesignation] = useState(searchFilter.designation ?? '');
  const [active, setActive] = useState(searchFilter.active ?? '');
  const [searchParams, setSearchParams] = React.useState(searchFilter);
  const [status, setStatus] = useState(false);

  const [dialogText, setDialogText] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const handleName = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setName(e.target.value);
  };

  const handleEmail = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setEmail(e.target.value);
  };

  const handleRole = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setRole(e.target.value);
  };

  const handleDesignation = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) setDesignation(e.target.value);
  };

  const handleStatus = (e: { target: { value: React.SetStateAction<string> } }) => {
    if (isValidInput) {
      setActive(e.target.value);
      if (e.target.value === '2')
        setStatus(true);
    }
  };

  const updateSearchParams = () => {
    searchFilter.name = searchFilter.resetGrid == true ? '' : name;
    searchFilter.email = searchFilter.resetGrid == true ? '' : email;
    searchFilter.role = searchFilter.resetGrid == true ? '' : role;
    searchFilter.designation = searchFilter.resetGrid == true ? '' : designation;
    searchFilter.active = searchFilter.resetGrid == true ? '1' : active;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileUploadClose = () => {
    setFailedEmails([]);
    setFileUpload(false);
    setUploadedFile('');
  };

  const handleFileUploadOpen = () => {
    setFileUpload(true);
    setUploadedFile('');
  };

  const handleDeleteClose = () => {
    deleteUser();
  };

  const deleteUser = async () => {
    // userDetails.CallBackUIUrl = config.CallBack_Url + 'confirmEmail/';
    if (dialogText === 'delete') {
      const result = await deleteUserItem(user ? user : '');
      if (result.data.status === 200) {
        setOpen(false);
        jq('#btnSearch').click();
        toastMessage(MessageType.Success, 'User Deleted Successfully');
      } else toastMessage(MessageType.Error, 'Internal Server Error Occured.Please try Again ..');
    }
    else {
      searchFilter.userId = user;
      const result = await activateUserItem(searchFilter);
      if (result.data.status === 200) {
        setOpen(false);
        jq('#btnSearch').click();
        toastMessage(MessageType.Success, 'User Activated Successfully');
      } else toastMessage(MessageType.Error, 'Internal Server Error Occured.Please try Again ..');
    }

  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const navigate = useNavigate();

  useEffect(() => {
    //render datatable

    const columns = [
      { data: 'firstName' },
      { data: 'email' },
      { data: 'designation' },
      { data: 'costCenterName' },
      { data: 'costCenterLevel1' },
      { data: 'costCenterLevel2' },
      { data: 'role' },
      { data: 'createdOn' },
      { data: null },
    ];

    const columnDefs = [
      {
        targets: 8,
        orderable: false,
        render: function (data, type, row) {
          const actions: string[] = [];        

            const edit = `<a href='#' title='Edit'}"><img id='btnEdit' src=${editIcon} alt="Edit" height="19" class="grdIconDis" style="margin-top: -1px;" /></a>`;
            
            const active = `<a href='#' title='Active'}"><img id='btnActive' src=${editIcon} alt="Active" height="19" class="grdIconDis" style="margin-top: -1px;" /></a>`;
                     
            const trash = `<a href='#' title='Delete'}"><img id='btnDelete' src=${deleteIcon} alt="Delete" height="15" class="grdIconDis" /></a>`;
           
          if (row.isDeleted === true && row.isActive === false)
            actions.push(edit);
          else{
            actions.push(edit);          
            actions.push(trash);
          }
          
          return wrapActions(actions);
        },
      },
      {
        targets: 6,
        orderable: false,
      },
      {
        targets: 7,
        visible: false,
      },
    ];
    const order = [[7, 'desc']];

    const ajaxData = { searchParamss: JSON.stringify(searchParams) };

    if (jq.fn.dataTable.isDataTable(tableId)) {
      const dt = jq(tableId).DataTable();
      dt.clear().destroy();
      dt.state.clear();
    }

    const dtTable: any = renderDataTable(
      tableId,
      `${User_API}/list`,
      columns,
      columnDefs,
      order,
      ajaxData,
      true,
    );

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

    //table actions     

    // Reset the search parameters
    jq('#btnClear').off('click').on('click', function () {
      dtTable.columns(0).search('');
      dtTable.columns(1).search('');
      dtTable.columns(2).search('');
      dtTable.columns(3).search('');
      dtTable.columns(4).search('');
      dtTable.columns(5).search('');
      dtTable.columns(6).search('');
      dtTable.columns(7).search('');
      //   setUserPat('');
      dtTable.order([0, 'desc']);
      dtTable.draw();
      // setStorage(userSearchToken, { SearchTerm: '' });
      setName('');
      setEmail('');
      setRole('');
      setDesignation('');
      setActive('1');
      setStatus(false);
      searchFilter.resetGrid = true;
      updateSearchParams();
      setSearchParams(searchFilter);
    });

    jq(tableId).on('click', '#btnDelete', function () {
      
      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };
      if (selectedRow.completeObject) {
      handleDeleteAction(selectedRow.completeObject.userId);
      }
    });
  
    jq(tableId).on('click', '#btnEdit', function () {
      
      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };
      if (selectedRow.completeObject) {
      navigate(`/admin/editUser/${selectedRow.completeObject.userId}`);
      }
    });
  
    jq(tableId).on('click', '#btnActive', function () {
      const selectedRow = {
        completeObject: getCompleteRowObject(this),
      };
      if (selectedRow.completeObject) {
      handleActiveAction(selectedRow.completeObject.userId);
      }
    });

  }, [searchParams]);
    
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

  const handleDeleteAction = (userId: string) => {
    setUser(userId);
    setDialogText('delete');
    setDialogTitle('Delete?');
    handleClickOpen();
  };

  const handleActiveAction = (userId: string) => {
    setUser(userId);
    setDialogText('activate');
    setDialogTitle('Activate?');
    handleClickOpen();
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('body', file);
      const response = await fileUpload(formData);

      if (response && response.data.status) {
        if (response.data.data.status) {
          toastMessage(MessageType.Success, 'Users Uploaded Successfully');
          setFileUpload(false);
          jq('#btnSearch').click();
        } else {
          setFailedEmails(response.data.data.detailResponse);
          toastMessage(
            MessageType.Warning,
            'Some of the users not imported due to duplicate emails found',
          );
        }
      } else {
        toastMessage(MessageType.Error, 'Internal Server Error Occurred.Please try Again ..');
      }
    } else {
      toastMessage(MessageType.Warning, 'Please upload  file');
    }
  };

  const setFile = (e: any) => {
    //@ts-ignore
    if (e.target.files[0]) {
      const extension = e.target.files[0].name.split('.').pop();
      if (!uploadExtentions.includes(extension)) {
        toastMessage(MessageType.Error, 'Please upload valid file ..');
        return;
      }

      setUploadedFile(e.target.files[0]);
    }
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 'auto !important',
      },
    },
    variant: 'menu' as "menu",
    getContentAnchorEl: null
  };
  const handelKeyPress = (e: any) => {
    const code = e.keyCode || e.which;

    //59; 39 ' 34 " 45 - 40 ( 41 ) 35 #  Sql inject Characted not allowed
    if (
      code == 34 ||
      code == 35 ||
      code == 39 ||
      code == 40 ||
      code == 41 ||
      code == 45 ||
      code == 59
    ) {
      isValidInput = false;
      return false;
    }
    isValidInput = true;
    return true;
  };

  const BCrumb = [
    {
      to: '/admin/users',
      title: 'Users',
    },
    {
      title: 'Users',
    },
  ];

  const searchProject = () => {
    searchFilter.resetGrid = false;
    updateSearchParams();
    setSearchParams(searchFilter);
  };

  const downloadUserDetails = async () => {
    searchFilter.resetGrid = false;
    updateSearchParams();
    await exportAuditLogsExcel(searchFilter);
    setSearchParams(searchFilter);
  };

  return (
    <PageContainer title="Users" description="display users list">
      <div className="breadcrumb-div">
        <Breadcrumb title="Users" items={BCrumb} />
        <div style={{ width: '55%', textAlign: 'right' }}>
          <Button
            color="secondary"
            variant="contained"
            style={{ margin: '5px' }}
            onClick={() => {
              navigate('/admin/addUser');
            }}
            className="buttons-bg"
          >
            Add User
          </Button>
          <Button
            id="btnUAdd"
            color="secondary"
            variant="contained"
            style={{ margin: '5px' }}
            className="buttons-bg"
            onClick={() => {
              handleFileUploadOpen();
            }}
          >
            Upload
          </Button>
        </div>
      </div>
      <Card className="project-list">
        <CardContent>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure to {dialogText} this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                className="reset-buttons-bg"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                className="buttons-bg"
                onClick={handleDeleteClose}
                autoFocus
              >
                {dialogText === 'delete' ? 'Delete' : 'Activate'} 
              </Button>
            </DialogActions>
          </Dialog>
          <div>
            <div className="row search-div" style={{ marginBottom: '6px' }}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={name}
                    name="name"
                    onChange={handleName}
                    id="txtName"
                    placeholder="Name"
                  // onKeyDown={handelKeyPress}
                  // onKeyPress={handelKeyPress}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={email}
                    name="email"
                    // onKeyPress={handelKeyPress}
                    // onKeyDown={handelKeyPress}
                    onChange={handleEmail}
                    id="txtEmail"
                    placeholder="Email"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <TextField
                    size="small"
                    value={designation}
                    name="designation"
                    // onKeyPress={handelKeyPress}
                    // onKeyDown={handelKeyPress}
                    onChange={handleDesignation}
                    id="txtDesignation"
                    placeholder="Designation"
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={role}
                      onChange={handleRole}
                      input={<OutlinedInput label="Role" />}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={AdminRoleId}>Admin</MenuItem>
                      <MenuItem value={UserRoleId}>User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <FormControl sx={{ m: 1, width: 300 }} className="dbdropdown">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={active}
                      onChange={handleStatus}
                      input={<OutlinedInput label="Status" />}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={'1'}>Active</MenuItem>
                      <MenuItem value={'2'}>InActive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>

                </Grid>

              </Grid>
            </div>
            <div>
              {/* <TextField
                size="small"
                value={name}
                name="name"
                onChange={handleName}
                onKeyPress={handelKeyPress}
                onKeyDown={handelKeyPress}
                id="txtName"
                placeholder="Name"
                style={{ margin: '5px', width: '40%' }}
              ></TextField> */}
              <Button
                id="btnSearch"
                color="secondary"
                variant="contained"
                className="buttons-bg"
                style={{ margin: '5px' }}
                onClick={searchProject}
              >
                Search
              </Button>
              <Button
                id="btnClear"
                color="secondary"
                variant="contained"
                className="reset-buttons-bg"
                style={{ margin: '5px' }}
              >
                Clear
              </Button>
              <Button
                // id="btnClear"
                color="secondary"
                variant="contained"
                style={{ margin: '5px' }}
                className="buttons-bg"
                onClick={downloadUserDetails}
              >
                Export to Excel
              </Button>
            </div>

            <table
              id="user_List"
              className="display dt-responsive"
              style={{ width: '100%', color: 'black' }}
            >
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Cost Center Name</th>
                  <th>Cost Center Level 1</th>
                  <th>Cost Center Level 2</th>
                  <th>Role</th>
                  <th>Created On</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
          </div>

          <Dialog
            open={openFileUpload}
            onClose={handleFileUploadClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <form onSubmit={(e) => submit(e)}>
              <DialogTitle id="upload-dialog-title">{'Bulk User Upload      '}
                  <a
                    href={process.env.PUBLIC_URL + '/Users_Upload_Template.xlsx'}
                    download={'Users_Upload_Template.xlsx'}
                  >
                    Download Template
                  </a>
                  </DialogTitle>
              <DialogContent>
                <input type="file" onChange={(e) => setFile(e)} onClick={(e) => { e.currentTarget.value = ''; }} />
                <br />
                <Paper style={{ maxHeight: 200, overflow: 'auto', marginTop: 20 }}>
                  {failedEmails.map((email: any) => {
                    return (
                      <ListItem key={email.reason}>
                        <ListItemText primary={email.email + ' - ' + email.reason}></ListItemText>
                      </ListItem>
                    );
                  })}
                </Paper>
              </DialogContent>
              <DialogActions>
                <Button
                  color="secondary"
                  variant="contained"
                  className="reset-buttons-bg"
                  onClick={handleFileUploadClose}
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
                  Upload
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
export default UserList;
