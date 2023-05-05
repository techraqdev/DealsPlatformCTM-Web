import React, { FC, useEffect } from 'react';
import { get } from '../../common/api-middleware/commonData.api';

const ProfileData: FC = () => {
  const [data, setData] = React.useState();

  useEffect(() => {
    getprofile();
  }, []);

  const getprofile = async () => {
    const result = await getprofileApi();
    const d = result.data;
    setData(d);
    // console.log(d);
  };

  const getprofileApi = async () => {
    const queryUrl = 'https://localhost:44351/api/Profile';
    return await get(queryUrl, '');
  };
  //   console.log(props.graphData);

  return (
    <div id="profile-div">
      {data}
      {/* <p>
        <strong>First Name: </strong> {props.graphData.givenName}
      </p>
      <p>
        <strong>Last Name: </strong> {props.graphData.surname}
      </p>
      <p>
        <strong>Email: </strong> {props.graphData.userPrincipalName}
      </p>
      <p>
        <strong>Id: </strong> {props.graphData.id}
      </p> */}
    </div>
  );
};
export default ProfileData;
