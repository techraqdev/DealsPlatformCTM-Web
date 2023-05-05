import axios, { AxiosResponse } from 'axios';
import { toastMessage } from '../../common/toastMessage';
import { MessageType } from '../../common/enumContainer';

import {
  unauthorized_dw,
  unauthorized,
  internal_error,
  pwc_token,
} from '../../common/constants/common.constant';
import { clearAll, clearStorage, setStorage } from '../helpers/storage.helper';
//import Loader from '../../Loader';
// import {
//   setStorage,
//   clearAll,
//   clearLocalStorage,
// } from '../helpers/storage.helper';
// import history from '../../global/history';
let numberOfAjaxCAllPending = 0;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem(pwc_token)}`,
};

let isTokenRefreshSent = false;
axios.defaults.timeout = 60 * 20 * 1000;
axios.interceptors.request.use(
  function (config) {
    document.body.classList.add('loading-indicator');
    numberOfAjaxCAllPending++;

    const token = localStorage.getItem(pwc_token);
    const expiresIn = localStorage.getItem(
      'adal.expiration.key4c5a31e9-de10-420e-8676-6938733b08b5',
    );
    if (token) {
      //@ts-ignore
      config.headers['Authorization'] = `bearer ${token}`;
      //@ts-ignore

      // config.headers['Access-Control-Expose-Headers'] = '*';
      //@ts-ignore

      config.headers['Accept'] = 'Application/json';
      //@ts-ignore

      config.headers['Content-Type'] = 'Application/json';

      if (expiresIn && isTokenRefreshSent === false) {
        if (parseInt(expiresIn) < 100) {
          //@ts-ignore

          config.headers['RefreshToken'] = localStorage.getItem('refresh_token');
          isTokenRefreshSent = true;
        }
      }
    }
    return config;
  },
  function (error) {
    numberOfAjaxCAllPending--;
    if (numberOfAjaxCAllPending <= 0) {
      numberOfAjaxCAllPending = 0;
      document.body.classList.remove('loading-indicator');
    }

    if (error.response && error.response.status == 500) {
      toastMessage(MessageType.Error, 'Internal server error occurred.Please try again...');
    } else toastMessage(MessageType.Error, error.message);
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    numberOfAjaxCAllPending--;
    if (numberOfAjaxCAllPending <= 0) {
      numberOfAjaxCAllPending = 0;
      document.body.classList.remove('loading-indicator');
    }
    if (isTokenRefreshSent == true) {
      const authorizeValue = response.headers['authorization'];
      if (authorizeValue != null) {
        const splitValue = authorizeValue.split('&');
        if (splitValue != null) {
          splitValue.forEach((value: string) => {
            if (value.indexOf('token=') > -1) {
              localStorage.removeItem('id_token');
              localStorage.setItem('id_token', value.replace('token=', ''));
            }
            if (value.indexOf('RefreshToken=') > -1) {
              localStorage.removeItem('refresh_token');
              localStorage.setItem('refresh_token', value.replace('RefreshToken=', ''));
            }
            if (value.indexOf('ExpiresIn=') > -1) {
              localStorage.removeItem('expires_in');
              localStorage.setItem('expires_in', value.replace('ExpiresIn=', ''));
            }
          });
          isTokenRefreshSent = false;
        }
      }
    }
    return response;
  },
  function (error) {
    numberOfAjaxCAllPending--;
    if (numberOfAjaxCAllPending <= 0) {
      numberOfAjaxCAllPending = 0;
      document.body.classList.remove('loading-indicator');
    }
    if (error.response && error.response.status == 401) {
      //clearLocalStorage();

      clearAll();
      toastMessage(MessageType.Error, unauthorized);
      // history.push('/login');
      window.location.reload();
      // useForceUpdate();
    }
    if (error.response && error.response.status == 403) {
      clearAll();
      toastMessage(MessageType.Error, unauthorized_dw);
      // window.location.reload();
      // useForceUpdate();
    } else if (error.response && error.response.status == 404) {
      toastMessage(MessageType.Error, 'Not found');
    } else if (error.response && error.response.status == 500) {
      toastMessage(MessageType.Error, internal_error);
    } else if (error.response && error.response.status == 400) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message?.toLowerCase() === 'invalid_creds'
      ) {
        // toastMessage(MessageType.Error, 'Invalid username or password');
      } else if (error.response && error.response.data && error.response.data.statusCode === 1000) {
        toastMessage(MessageType.Error, error.response.data.errorDescription);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error?.toLowerCase() === 'user already exists.'
      ) {
        toastMessage(MessageType.Error, 'User email already exists.');
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error?.toLowerCase() === 'invalid_client'
      ) {
        toastMessage(MessageType.Error, 'Invalid Client');
      } else {
        toastMessage(MessageType.Error, 'Internal server error occurred.Please try again...');
      }
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error?.toLowerCase() === 'invalid_grant'
    ) {
      toastMessage(MessageType.Error, 'Invalid username or password');
    } else toastMessage(MessageType.Error, error.message);
    if (isTokenRefreshSent == true) {
      if (error.headers) {
        const authorizeValue = error.headers['authorization'];
        if (authorizeValue != null) {
          const splitValue = authorizeValue.split('&');
          if (splitValue != null) {
            splitValue.forEach((value: string) => {
              if (value.indexOf('token=') > -1) {
                localStorage.removeItem('id_token');
                localStorage.setItem('id_token', value.replace('token=', ''));
              }
              if (value.indexOf('RefreshToken=') > -1) {
                localStorage.removeItem('refresh_token');
                localStorage.setItem('refresh_token', value.replace('RefreshToken=', ''));
              }
              if (value.indexOf('ExpiresIn=') > -1) {
                localStorage.removeItem('expires_in');
                localStorage.setItem('expires_in', value.replace('ExpiresIn=', ''));
              }
            });
            isTokenRefreshSent = false;
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export const get = async (baseUrl: string | undefined, queryUrl: string) => {

  const response: AxiosResponse = await axios.get(`${baseUrl}${queryUrl}`);

  if (response.status === 200) {
    const json = await response.data;
    return { data: json };
  }
  if (response.status === 401) {
    alert('UnAuthorize');
  }
  throw new Error('Error');
};

export const getLogOut = async (baseUrl: string, queryUrl: string, token: string) => {
  axios.defaults.headers.get['Authorization'] = `Bearer ${token}`; //for logout
  axios.defaults.headers.get['Access-Control-Expose-Headers'] = '*';
  axios.defaults.headers.get['Content-Type'] = 'Application/json';

  const response: AxiosResponse = await axios.get(`${baseUrl}${queryUrl}`);

  if (response.status === 200) {
    const json = await response.data.result;
    return { data: json };
  }
  if (response.status === 401) {
    alert('UnAuthorize');
  }
  throw new Error('Error');
};

export const downloadFile = async (baseUrl: string | undefined, queryUrl: string, fileName: string) => {
  // axios.defaults.timeout = 60 * 20 * 1000;

  await axios({
    url: `${baseUrl}${queryUrl}`,
    method: 'GET',
    responseType: 'blob', // important
    timeout: 60 * 20 * 1000,
  }).then((response) => {
    if (response.data.size <= 0) {
      toastMessage(MessageType.Error, 'Internal server error occurred.Please try again...');
    } else {
      downloadFileBasedOnBlob(response.data, fileName, response.data.type);
    }
  });
};

export const downloadFilePost = async (
  baseUrl: string | undefined,
  queryUrl: string,
  data: any,
  fileName: string,
) => {
  axios.defaults.timeout = 60 * 20 * 1000;  
  await axios({
    url: `${baseUrl}${queryUrl}`,
    method: 'POST',
    responseType: 'blob', // important
    data: data,    
  }).then((response) => {
    if (response.data.size <= 140) {
      toastMessage(MessageType.Error, 'Internal server error occurred.Please try again...');
    } else {
      downloadFileBasedOnBlob(response.data, fileName, response.data.type);
    }
  });
};

export const getCommonData = async (baseUrl: string, queryUrl: string) => {
  const response: AxiosResponse = await axios.get(`${baseUrl}${queryUrl}`);

  if (response.status === 200) {
    const json = await response.data;
    return { data: json };
  }
  if (response.status === 401) {
    alert('Authorize');
  }
  throw new Error('Error');
};

export const post = async (baseUrl: string | undefined, queryUrl: string, model: any) => {
  axios.defaults.headers.post['Content-Type'] = 'Application/json';
  const response = await axios.post(`${baseUrl}${queryUrl}`, model);
  if (response.status === 200) {
    const json = response;
    return { data: json };
  }

  throw new Error('Error');
};

export const put = async (baseUrl: string | undefined, queryUrl: string, model: any) => {
  axios.defaults.headers.post['Content-Type'] = 'Application/json';
  const response = await axios.put(`${baseUrl}${queryUrl}`, model);
  if (response.status === 200) {
    const json = response;
    return { data: json };
  }

  throw new Error('Error');
};

export const postUploadModel = async (baseUrl: string | undefined, queryUrl: string, data: any) => {
  axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
  axios.defaults.timeout = 60 * 20 * 1000;
  const response = await axios.post(`${baseUrl}${queryUrl}`, data);
  if (response.status === 200) {
    const json = response;
    return { data: json };
  }
  throw new Error('Error');
};


export const deleteItem = async (baseUrl: string | undefined, queryUrl: string) => {
  axios.defaults.headers.post['Content-Type'] = 'Application/json';
  const response = await axios.delete(`${baseUrl}${queryUrl}`);
  if (response.status === 200) {
    const json = response;
    return { data: json };
  }
  throw new Error('Error');
};

const downloadFileBasedOnBlob = (blob: any, fileName: string, type: any) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  link.click();
}