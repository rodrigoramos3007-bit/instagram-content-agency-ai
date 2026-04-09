import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useBrandStore } from '@/store/brandStore';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { BrandDiagnosticPage } from '@/pages/BrandDiagnostic/BrandDiagnosticPage';
import { IdeaGeneratorPage } from '@/pages/IdeaGenerator/IdeaGeneratorPage';
import { PostCreatorPage } from '@/pages/PostCreator/PostCreatorPage';
import { CarouselCreatorPage } from '@/pages/CarouselCreator/CarouselCreatorPage';
import { ReelCreatorPage } from '@/pages/ReelCreator/ReelCreatorPage';
import { CaptionGeneratorPage } from '@/pages/CaptionGenerator/CaptionGeneratorPage';
import { HashtagGeneratorPage } from '@/pages/HashtagGenerator/HashtagGeneratorPage';
import { ImageGeneratorPage } from '@/pages/ImageGenerator/ImageGeneratorPage';
import { TemplatesPage } from '@/pages/Templates/TemplatesPage';
import { CalendarPage } from '@/pages/Calendar/CalendarPage';
import { ExportPage } from '@/pages/Export/ExportPage';
import { BrandSettingsPage } from '@/pages/BrandSettings/BrandSettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { isOnboarded } = useBrandStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C1C26',
            border: '1px solid #1E1E2E',
            color: '#F8FAFC',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* App Routes */}
        <Route
          path="/"
          element={
            <OnboardingRoute>
              <AppLayout />
            </OnboardingRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="diagnostic" element={<BrandDiagnosticPage />} />
          <Route path="ideas" element={<IdeaGeneratorPage />} />
          <Route path="posts" element={<PostCreatorPage />} />
          <Route path="carousel" element={<CarouselCreatorPage />} />
          <Route path="reels" element={<ReelCreatorPage />} />
          <Route path="captions" element={<CaptionGeneratorPage />} />
          <Route path="hashtags" element={<HashtagGeneratorPage />} />
          <Route path="images" element={<ImageGeneratorPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="settings" element={<BrandSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
