import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DeptGuardRoute } from '@/shared/layout/DeptGuardRoute';
import { RouteErrorBoundary } from '@/shared/layout/RouteErrorBoundary';
import { AppLayout } from './AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RequestWindowPage } from '@/pages/RequestWindowPage';
import { PrioritiesPage } from '@/pages/PrioritiesPage';
import { PlanningPage } from '@/pages/PlanningPage';
import { SchedulesPage } from '@/pages/SchedulesPage';
import { ConflictsSafetyPage } from '@/pages/ConflictsSafetyPage';
import { CoordinationPage } from '@/pages/CoordinationPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SimulationPage } from '@/pages/SimulationPage';
import { ApprovalPage } from '@/pages/ApprovalPage';
import { EmergencyBlockPage } from '@/pages/EmergencyBlockPage';
import { DataAssetsPage } from '@/pages/DataAssetsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
  {
    element: <DeptGuardRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/requests', element: <RequestWindowPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/priorities', element: <PrioritiesPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/planning', element: <PlanningPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/schedules', element: <SchedulesPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/conflicts-safety', element: <ConflictsSafetyPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/coordination', element: <CoordinationPage />, errorElement: <RouteErrorBoundary /> },
          { path: '/data-assets', element: <DataAssetsPage />, errorElement: <RouteErrorBoundary /> },
          // Simulation is a standalone, full-screen top-level view per spec
          // (decoupled from Dashboard/Request Window chrome) -- handled inside
          // SimulationPage itself, which renders outside the padded content area.
          { path: '/simulation', element: <SimulationPage />, errorElement: <RouteErrorBoundary /> },
          {
            // Only the Section Controller approves/rejects -- Engineering/
            // TRD/S&T never do, even via direct URL.
            element: <DeptGuardRoute allowedRoles={['CONTROLLER']} />,
            errorElement: <RouteErrorBoundary />,
            children: [{ path: '/approvals', element: <ApprovalPage />, errorElement: <RouteErrorBoundary /> }],
          },
          {
            // Only Engineering/TRD/S&T raise emergency requests -- the
            // Controller has nothing to request, so they're excluded here
            // too, not just hidden from the nav.
            element: <DeptGuardRoute excludeRoles={['CONTROLLER']} />,
            errorElement: <RouteErrorBoundary />,
            children: [{ path: '/emergency', element: <EmergencyBlockPage />, errorElement: <RouteErrorBoundary /> }],
          },
        ],
      },
    ],
  },
]);
