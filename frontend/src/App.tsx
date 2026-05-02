import { useEffect, useState } from 'react';
import { Truck, Users, Map, DollarSign, Menu, Bell, CreditCard, LogOut, TrendingUp, Shield } from 'lucide-react';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import TransportistasPage from './pages/TransportistasPage';
import ViajesPage from './pages/ViajesPage';
import TarifasPage from './pages/TarifasPage';
import AdelantosPage from './pages/AdelantosPage';
import LoginPage from './pages/LoginPage';
import UsuariosPage from './pages/UsuariosPage';
import { getAuthToken, getCurrentUser, getStoredUser, logout } from './services/api';
import ProfileModal from './components/ProfileModal/ProfileModal';

const TAB_LABELS: Record<string, string> = {
  dashboard: 'Panel de Control',
  viajes: 'Viajes',
  clientes: 'Clientes',
  transportistas: 'Transportistas',
  tarifas: 'Tarifas',
  adelantos: 'Adelantos',
  usuarios: 'Usuarios',
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAuthToken());
  const [authUser, setAuthUser] = useState<any>(() => getStoredUser());
  const [showProfile, setShowProfile] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoadingAuth(false);
      return;
    }

    getCurrentUser()
      .then((user) => {
        setAuthUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setAuthUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuthUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleLogin = (user: any) => {
    setAuthUser(user);
    setIsAuthenticated(true);
  };

  if (loadingAuth) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Truck className="sidebar-brand-icon" />
          <span className="sidebar-brand-text">GAVEM SA</span>
        </div>

        <nav className="sidebar-nav">
          {/* Sección General */}
          <p className="sidebar-section-title">General</p>
          <ul className="sidebar-section-list">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`sidebar-link ${activeTab === 'dashboard' ? 'sidebar-link--active' : ''}`}
              >
                <TrendingUp className="sidebar-link-icon" />
                Panel de Control
              </button>
            </li>
          </ul>

          {/* Sección Operaciones */}
          <p className="sidebar-section-title">Operaciones</p>
          <ul className="sidebar-section-list">
            <li>
              <button
                onClick={() => setActiveTab('viajes')}
                className={`sidebar-link ${activeTab === 'viajes' ? 'sidebar-link--active' : ''}`}
              >
                <Map className="sidebar-link-icon" />
                Viajes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('adelantos')}
                className={`sidebar-link ${activeTab === 'adelantos' ? 'sidebar-link--active' : ''}`}
              >
                <CreditCard className="sidebar-link-icon" />
                Adelantos
              </button>
            </li>
          </ul>

          {/* Sección Maestros */}
          <p className="sidebar-section-title">ENTIDADES</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`sidebar-link ${activeTab === 'clientes' ? 'sidebar-link--active' : ''}`}
              >
                <Users className="sidebar-link-icon" />
                Clientes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('transportistas')}
                className={`sidebar-link ${activeTab === 'transportistas' ? 'sidebar-link--active' : ''}`}
              >
                <Truck className="sidebar-link-icon" />
                Transportistas
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('tarifas')}
                className={`sidebar-link ${activeTab === 'tarifas' ? 'sidebar-link--active' : ''}`}
              >
                <DollarSign className="sidebar-link-icon" />
                Tarifas
              </button>
            </li>
            {authUser?.rol === 'superadministrador' && (
              <li>
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className={`sidebar-link ${activeTab === 'usuarios' ? 'sidebar-link--active' : ''}`}
                >
                  <Shield className="sidebar-link-icon" />
                  Usuarios
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-logout"
          >
            <LogOut className="sidebar-logout-icon" />
            Cerrar sesión
          </button>
          <p className="sidebar-version">Logística y Gestión v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-area">
        {/* Top Header */}
        <header className="top-header">
          <div className="top-header-left">
            <button className="top-header-hamburger">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="top-header-title">
              {TAB_LABELS[activeTab] ?? activeTab}
            </h2>
          </div>

          <div className="top-header-right">
            <button className="top-header-bell">
              <Bell className="w-5 h-5" />
            </button>
            <div className="top-header-avatar">
              <div onClick={() => setShowProfile(true)} title="Mi perfil" style={{ cursor: 'pointer' }}>
                {(authUser?.nombre?.[0] || 'G').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="content-area">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'clientes' && <ClientesPage />}
          {activeTab === 'transportistas' && <TransportistasPage />}
          {activeTab === 'viajes' && <ViajesPage />}
          {activeTab === 'tarifas' && <TarifasPage />}
          {activeTab === 'adelantos' && <AdelantosPage />}
          {activeTab === 'usuarios' && authUser?.rol === 'superadministrador' && <UsuariosPage />}
        </div>
      </main>
      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          onUpdated={(user) => {
            setAuthUser(user);
          }}
        />
      )}
    </div>
  );
}

export default App;
