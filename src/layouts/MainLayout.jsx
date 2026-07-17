import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useHashScroll } from '../hooks/useHashScroll';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;

export default function MainLayout() {
  useHashScroll();

  return (
    <Layout>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Layout>
  );
}
