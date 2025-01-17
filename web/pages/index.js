import React, { useEffect, useState, useContext } from 'react';
import Router from 'next/router';
import axios from 'axios';
import * as GS from '../components/GlobalStyle';
import Aside from '../components/Aside';
import MailArea from '../components/MailArea';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { AppContext } from '../contexts';
import { handleClickCategory } from '../contexts/reducer';

const Home = () => {
  const { state, dispatch } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    if (!window.sessionStorage.getItem('user')) {
      Router.push('/login');
    } else {
      const userData = window.sessionStorage.getItem('user');
      setUser(JSON.parse(userData));
      axios.get('/mail').then(({ data }) => {
        setView(<MailArea mailList={data.mails} />);
      });
    }
  }, []);

  const indexPage = (
    <GS.FlexWrap>
      <Header brand={'Daitnu'} />
      <GS.Content>
        <Aside setView={setView} />
        {view}
      </GS.Content>
      <Footer />
    </GS.FlexWrap>
  );
  return user ? indexPage : <Loading />;
};

export default Home;
