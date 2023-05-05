import React from 'react';
import PropTypes from 'prop-types';
import { IPageContainer } from '../../models/LayoutModels';
// import { Helmet } from 'react-helmet';



const PageContainer = (props:  IPageContainer) => (
  <div>
    <div>
      <title>{props && props.title}</title>
      <meta name="description" content={props && props.description} />
    </div>
    {props && props.children}
  </div>
);

// PageContainer.propTypes = {
//   title: PropTypes.string,
//   description: PropTypes.string,
//   children: PropTypes.node,
// };

export default PageContainer;
