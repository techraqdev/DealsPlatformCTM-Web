import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Logo  from '../../../assets/images/logos/pwc.png';
import { ReactComponent as LogoLight } from '../../../assets/images/logos/logo-white.svg';

const LogoIcon = (props) => {
  const customizer = useSelector((state) => state.CustomizerReducer);
  return (
    <Link underline="none" to="/">
      {/* {customizer.activeMode === 'dark' ? <LogoLight /> : <LogoDark />} */}
      <img src={Logo}  width={props.logoWidth} style={{paddingTop:"25px"}}/>
    </Link>
  );
};

export const LogoIcon1 = () => {
  const customizer = useSelector((state) => state.CustomizerReducer);
  return (
    <Link underline="none" to="/">
      <LogoLight />
    </Link>
  );
};

export default LogoIcon;
