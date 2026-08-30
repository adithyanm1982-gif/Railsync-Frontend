import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

/**
 * Route-level error boundary (wired via `errorElement` on every route
 * in router.tsx). Without this, ANY uncaught render error on ANY
 * page -- even a small one, like a component reading `.length` on a
 * field the backend happened to omit -- crashes the entire app to
 * React Router's raw "Unexpected Application Error!" screen with a
 * minified stack trace, on every route, with no way back except a
 * manual URL edit. This catches that instead and shows a normal page
 * with the actual error message plus a way to recover (reload, or go
 * back to Dashboard) without losing the rest of the app.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let message = 'An unexpected error occurred.';
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-canvas p-6">
      <div className="panel-surface max-w-md rounded-xl p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-dept-snt/10 p-3">
            <AlertTriangle size={28} className="text-dept-snt" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Something went wrong on this page</h1>
          <p className="text-sm text-slate-400 mt-2">{message}</p>
          <p className="text-xs text-slate-500 mt-2">
            This is usually caused by an unexpected shape in data returned from the backend. The rest of the app
            is unaffected -- try reloading this page, or head back to the Dashboard.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="ghost" onClick={() => window.location.reload()} className="flex items-center gap-1.5">
            <RefreshCw size={14} />
            Reload
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5">
            <Home size={14} />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
