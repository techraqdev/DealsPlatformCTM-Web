import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { pwc_isAuthorise } from './constants/common.constant';

interface IActionPreviliges {
  canView?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const PrivateRoute = ({
  //@ts-ignore

  component: Component,
  //@ts-ignore

  ...rest
}) => {
  return (
    <Route
      {...rest}
      children={(props: any) => {
        const isAuthorise = localStorage.getItem(pwc_isAuthorise);
        if (!isAuthorise) {
          // not logged in so redirect to login page with the return url
          return <Navigate to="/login" state={{ from: props.location }} />;
        }
        // check if route is restricted by role
        // authorised so return component
        //@ts-ignore
        return <Component {...props} />;
      }}
    />
  );
};
