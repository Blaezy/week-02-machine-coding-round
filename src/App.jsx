import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import AppShell from './components/layout/AppShell.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { TasksProvider } from './context/TasksContext.jsx';
import { useSettings } from './hooks/useSettings.js';
import BoardPage from './pages/BoardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function Toasts() {
  const { theme } = useSettings();
  return (
    <ToastContainer
      theme={theme}
      position="bottom-right"
      toastClassName="lane-toast"
      closeButton={false}
      hideProgressBar
      limit={3}
      pauseOnFocusLoss={false}
    />
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <TasksProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<BoardPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toasts />
      </TasksProvider>
    </SettingsProvider>
  );
}
