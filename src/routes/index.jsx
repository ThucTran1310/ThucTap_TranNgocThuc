import { Navigate, useRoutes } from 'react-router-dom';
//
import { dashboardRoutes } from '@/routes/sections/dashboard.jsx';

// ----------------------------------------------------------------------

const PATH_AFTER_LOGIN = '/dashboard';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Dashboard routes
    ...dashboardRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
