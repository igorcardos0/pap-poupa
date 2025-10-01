import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { UserProvider } from "@/contexts/UserContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Renda from "./pages/Renda";
import Gastos from "./pages/Gastos";
import Cofres from "./pages/Cofres";
import Investimentos from "./pages/Investimentos";
import Planejamento from "./pages/Planejamento";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import AppLayout from "@/components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <FinanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/renda"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Renda />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gastos"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Gastos />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cofres"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Cofres />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investimentos"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Investimentos />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planejamento"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Planejamento />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Perfil />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Configuracoes />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FinanceProvider>
    </UserProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
