/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { config } from './common/environment';

export const oidcConfig = {
    authority: config.AD_Authority,
    clientId: config.AD_UI_Client_Id,
    responseType: 'code',
    // redirectUri: 'http://localhost:3000/',
    redirectUri: config.CallBack_Url,
    clientSecret: config.Client_Secret,
    autoSignIn: false,
    scope: config.Resource
};