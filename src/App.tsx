import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { OfficeProvider } from './contexts/OfficeContext';
import { Layout } from './components/common/Layout';
import { HomePage } from './pages/HomePage';
import { ComputersPage } from './pages/ComputersPage';
import { PeripheralsPage } from './pages/PeripheralsPage';
import { PrinterItemsPage } from './pages/PrinterItemsPage';
import { RestockRequestsPage } from './pages/RestockRequestsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <ThemeProvider>
      <OfficeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/computers" element={<ComputersPage />} />
              <Route path="/peripherals" element={<PeripheralsPage />} />
              <Route path="/printer-items" element={<PrinterItemsPage />} />
              <Route path="/restock-requests" element={<RestockRequestsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        </Router>
      </OfficeProvider>
    </ThemeProvider>
  );
}

export default App;