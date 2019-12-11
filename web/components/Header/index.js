/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import * as S from './styled';

import ProfileLink from '../ProfileLink';
import { AppDispatchContext } from '../../contexts';
import { handleCategoryClick } from '../../contexts/reducer';
import MailArea from '../MailArea';
import logo from '../../public/logo.png';
import Search from './Search';

const Header = ({ brand }) => {
  const { dispatch } = useContext(AppDispatchContext);
  const handleLogoClick = () => dispatch(handleCategoryClick(0, <MailArea />));
  return (
    <S.Header>
      <S.Brand>
        <S.Logo src={logo} onClick={handleLogoClick} alt={'로고이미지'} />
      </S.Brand>
      <S.Search>
        <Search />
      </S.Search>
      <ProfileLink />
    </S.Header>
  );
};

export default Header;
