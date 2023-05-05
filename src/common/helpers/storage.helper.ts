import * as amplifyStore from 'amplify-store';
import { pwc_token, pwc_menu, pwc_isAuthorise, pwc_username, pwc_isAdmin, projectSearchToken, userSearchToken, projectCred_selectItems, cfib_projectSearchToken, ctm_projectSearchToken } from '../constants/common.constant';

export const setStorage = (key, value) => {
  amplifyStore(key, value);
};

export const getStorage = (key) => amplifyStore(key);

export const clearStorage = (key) => {
  amplifyStore(key, null);
};
export const clearAll = () => {
  const storageArray = [pwc_token, pwc_menu, pwc_isAuthorise, pwc_username, pwc_isAdmin, 
    projectSearchToken, userSearchToken,projectCred_selectItems,cfib_projectSearchToken,ctm_projectSearchToken];
  for (const storageItem of storageArray) {
    amplifyStore(storageItem, null);
  }
};

export const clearLocalStorage = () => {
  const storageArray = [pwc_token,'id_token','userName','']; //,'iskandycat'

  for (const storageItem of storageArray) {
    localStorage.removeItem(storageItem);
  }
};

// export const setLocalStorageItems = () => {};
