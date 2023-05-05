import axios from 'axios';
import { config } from '../environment';
import { setStorage, getStorage, clearStorage, clearAll } from '../helpers/storage.helper';
import { toastMessage } from '../../common/toastMessage';
import { MessageType } from '../../common/enumContainer';
import { PRODUCT_WF_STATUSTYPES, User_Roles, ModelProdWfStatusType } from '../../common/enumContainer'
// var jwt = require('jsonwebtoken');
// /connect/token
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import { getMenus } from '../../views/users/userApi';
import {
  pwc_isAdmin,
  unauthorized,
  pwc_isAuthorise,
  pwc_token, pwc_menu, pwc_username
} from '../../common/constants/common.constant';
import { get, post } from '../../common/api-middleware/commonData.api';
const baseUrl = `${config.Resource_Url}`;

const login = async model => {

  // const data = `username=${model.userName}&password=${model.password}`;
  // const url = `${config.Resource_Url}identity/token`;
  const queryUrl = 'identity/token';

  // axios.defaults.baseURL = url;
  axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';
  const response = await post(baseUrl, queryUrl, model).catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
    setStorage(pwc_isAuthorise, false);
    setStorage(pwc_username, "");
    setStorage(pwc_isAdmin, false);

    // eslint-disable-next-line no-debugger

    if (error.response && error.response.data && error.response.data.message && error.response.data.message.toLowerCase() === 'invalid_creds') {
      toastMessage(MessageType.Error, 'Invalid username or password');
      return;
    }
  });



  if (response && response.data && response.data.status !== 200) {
    setStorage(pwc_isAuthorise, false);
    setStorage(pwc_username, "");
    setStorage(pwc_isAdmin, false);

    return { error: { code: response.data.status } };
  }
  else {
    if (response) {
      let dataResponse = response.data.data;
      localStorage.setItem('userName', model.userName);
      localStorage.setItem(pwc_token, dataResponse.token);
      setStorage(pwc_isAuthorise, true);

      setStorage(pwc_username, model.userName);

      const queryUrl = 'identity/me';

      const identit_Result = await get(baseUrl, queryUrl);

      if (identit_Result && identit_Result.data && identit_Result.data.isAutheticated) {

        setStorage(pwc_isAdmin, identit_Result.data.isAdmin);

        const result = await getMenus();
        let navigateLink = "/ctm/projects/downloads";
        if (result && result.data) {
          clearStorage(pwc_menu);
          setStorage(pwc_menu, result.data);

          result.data.forEach((childValue) => {
            childValue?.children?.forEach((item) => {
              if (item?.hRef?.toLowerCase() == '/db/projects/downloads') {
                navigateLink = '/db/projects/downloads';
                window.location.href = navigateLink;
                return;
              }
            })
          })
          window.location.href = navigateLink;

        } else {
          setStorage(pwc_menu, '');
        }
      } else {
        clearAll();
      }
    }
  }

  //setStorage(pwc_isAdmin, result.data.isAdmin);



  // localStorage.setItem('refresh-token', response.data.refresh_token);
  // localStorage.setItem('expires-in', response.data.expires_in);
  // localStorage.setItem('isAuthorise', true);

  // var decoded = jwt.decode(response.data.access_token);

  // localStorage.setItem('userId', decoded.sub);
  // localStorage.setItem('role_id', decoded.role_id);
  // localStorage.setItem('name', decoded.name);



  // get the decoded payload and header
  // var decoded = jwt.decode(token, { complete: true });
  // console.log(decoded.header);
  // console.log(decoded.payload);


};


export default login;
