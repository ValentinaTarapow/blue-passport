import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingState from '../components/LoadingState';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const BluePassport = lazy(() => import('../pages/BluePassport'));
const BecomeMember = lazy(() => import('../pages/BecomeMember'));
const MemberProfile = lazy(() => import('../pages/MemberProfile'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('../pages/PaymentCancel'));
const Contact = lazy(() => import('../pages/Contact'));
const Faq = lazy(() => import('../pages/Faq'));
const Professionals = lazy(() => import('../pages/Professionals'));
const ProfessionalDetail = lazy(() => import('../pages/ProfessionalDetail'));
const NotFound = lazy(() => import('../pages/NotFound'));

function PageLoader() {
  return <LoadingState fullPage message="Loading page" />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'quienes-somos',
        element: <Navigate to="/about" replace />,
      },
      {
        path: 'blue-passport',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BluePassport />
          </Suspense>
        ),
      },
      {
        path: 'blue-passport/become-a-member',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BecomeMember />
          </Suspense>
        ),
      },
      {
        path: 'blue-passport/apply',
        element: <Navigate to="/blue-passport/become-a-member" replace />,
      },
      {
        path: 'blue-passport/profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MemberProfile />
          </Suspense>
        ),
      },
      {
        path: 'crear-anuncio',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MemberProfile />
          </Suspense>
        ),
      },
      {
        path: 'payment/success',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PaymentSuccess />
          </Suspense>
        ),
      },
      {
        path: 'payment/cancel',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PaymentCancel />
          </Suspense>
        ),
      },
      {
        path: 'blue-passport/success',
        element: <Navigate to="/payment/success" replace />,
      },
      {
        path: 'blue-passport/quote/:applicationId',
        element: <Navigate to="/blue-passport/become-a-member" replace />,
      },
      {
        path: 'blue-passport/onboarding/:applicationId',
        element: <Navigate to="/payment/success" replace />,
      },
      {
        path: 'advertise',
        element: <Navigate to="/blue-passport" replace />,
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'contacto',
        element: <Navigate to="/contact" replace />,
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Faq />
          </Suspense>
        ),
      },
      {
        path: 'preguntas-frecuentes',
        element: <Navigate to="/faq" replace />,
      },
      {
        path: 'professionals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Professionals />
          </Suspense>
        ),
      },
      {
        path: 'professionals/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfessionalDetail />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
