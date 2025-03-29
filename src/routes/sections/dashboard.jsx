import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import { MainLayout } from '@/layouts/main-layout/index.jsx';
// components
import LoadingScreen from '@/components/loading-screen/loading-screen.jsx';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('@/pages/dashboard/index.jsx'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <MainLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [{ element: <IndexPage />, index: true }],
  },
];
