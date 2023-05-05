export const config = {
  Resource_Url:
    process.env.REACT_APP_Resource_Url,
  CallBack_Url:
    process.env.REACT_APP_CallBack_Url,
  AD_UI_Client_Id: process.env.REACT_APP_Client_Id,
  AD_Authority: process.env.REACT_APP_Authority,
  Resource: process.env.REACT_APP_ResourceScopes,
  Client_Secret: process.env.REACT_APP_CLIENT_SECRET,
  IsPwcEnvironment: process.env.REACT_APP_Is_Pwc_Environment == 'true' ? true : false || false
};
