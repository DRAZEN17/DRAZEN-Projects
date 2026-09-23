import { Routes, Route } from 'react-router-dom';
import { MaintenanceBanner } from '@/components/shared/MaintenanceBanner';
import { LiveChatWidget } from '@/components/shared/LiveChatWidget';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AgentLayout } from '@/components/layout/AgentLayout';
import { RequireAuth } from '@/components/auth/RequireAuth';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import CoveragePage from '@/pages/CoveragePage';
import TariffsPage from '@/pages/TariffsPage';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import KnowledgeBasePage from '@/pages/KnowledgeBasePage';
import UpdatesPage from '@/pages/UpdatesPage';
import NotFoundPage from '@/pages/NotFoundPage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import PropertiesPage from '@/pages/dashboard/PropertiesPage';
import PropertyRegisterPage from '@/pages/dashboard/PropertyRegisterPage';
import PropertyDetailPage from '@/pages/dashboard/PropertyDetailPage';
import ElectricityPage from '@/pages/dashboard/ElectricityPage';
import AddMeterPage from '@/pages/dashboard/AddMeterPage';
import BillsPage from '@/pages/dashboard/BillsPage';
import PaymentPage from '@/pages/dashboard/PaymentPage';
import ComplaintsPage from '@/pages/dashboard/ComplaintsPage';
import FileComplaintPage from '@/pages/dashboard/FileComplaintPage';
import DocumentsPage from '@/pages/dashboard/DocumentsPage';
import SupportPage from '@/pages/dashboard/SupportPage';
import NotificationsPage from '@/pages/dashboard/NotificationsPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import CallRequestPage from '@/pages/dashboard/CallRequestPage';

import AdminOverview from '@/pages/admin/AdminOverview';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminPropertiesPage from '@/pages/admin/AdminPropertiesPage';
import AdminComplaintsPage from '@/pages/admin/AdminComplaintsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage';
import AdminStaffPage from '@/pages/admin/AdminStaffPage';
import AdminRolesPage from '@/pages/admin/AdminRolesPage';
import AdminAuditLogPage from '@/pages/admin/AdminAuditLogPage';
import AdminStatesPage from '@/pages/admin/AdminStatesPage';
import AdminUtilityCompaniesPage from '@/pages/admin/AdminUtilityCompaniesPage';
import AdminTariffsPage from '@/pages/admin/AdminTariffsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

import AgentDashboard from '@/pages/agent/AgentDashboard';
import AgentTaskDetail from '@/pages/agent/AgentTaskDetail';

export default function App() {
  return (
    <>
      <MaintenanceBanner />
      <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/coverage" element={<CoveragePage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/updates" element={<UpdatesPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route element={<RequireAuth roles={['citizen']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/new" element={<PropertyRegisterPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="electricity" element={<ElectricityPage />} />
          <Route path="electricity/link/:propertyId" element={<AddMeterPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="bills/pay/:billId" element={<PaymentPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="complaints/new" element={<FileComplaintPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="call-request" element={<CallRequestPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="properties" element={<AdminPropertiesPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="audit-log" element={<AdminAuditLogPage />} />
          <Route path="states" element={<AdminStatesPage />} />
          <Route path="utility-companies" element={<AdminUtilityCompaniesPage />} />
          <Route path="tariffs" element={<AdminTariffsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={['field_agent']} />}>
        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<AgentDashboard />} />
          <Route path="tasks/:taskId" element={<AgentTaskDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <LiveChatWidget />
    </>
  );
}
