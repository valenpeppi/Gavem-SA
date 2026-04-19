import { useState } from 'react';
import { Truck, Users, Map, DollarSign, Menu, Bell, CreditCard, LogOut } from 'lucide-react';
import ClientesPage from './pages/ClientesPage';
import TransportistasPage from './pages/TransportistasPage';
import ViajesPage from './pages/ViajesPage';
import TarifasPage from './pages/TarifasPage';
import AdelantosPage from './pages/AdelantosPage';
import LoginPage from './pages/LoginPage';

const TAB_LABELS: Record<string, string> = {
  viajes: 'Viajes',
  clientes: 'Clientes',
  transportistas: 'Transportistas',
  tarifas: 'Tarifas',
  adelantos: 'Adelantos',
};

function App() {
  const [activeTab, setActiveTab] = useState('viajes');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('gavem_auth') === 'true'
  );

  const handleLogout = () => {
    sessionStorage.removeItem('gavem_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Truck className="w-6 h-6 text-blue-500 mr-2" />
          <span className="text-lg font-bold text-white tracking-wider">GAVEM SA</span>
        </div>

        <nav className="flex-1 py-4">
          {/* Sección Operaciones */}
          <p className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Operaciones</p>
          <ul className="space-y-1 mb-4">
            <li>
              <button
                onClick={() => setActiveTab('viajes')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'viajes' ? 'bg-blue-600 text-white' : ''}`}
              >
                <Map className="w-5 h-5 mr-3" />
                Viajes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('adelantos')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'adelantos' ? 'bg-blue-600 text-white' : ''}`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Adelantos
              </button>
            </li>
          </ul>

          {/* Sección Maestros */}
          <p className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">ENTIDADES</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'clientes' ? 'bg-blue-600 text-white' : ''}`}
              >
                <Users className="w-5 h-5 mr-3" />
                Clientes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('transportistas')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'transportistas' ? 'bg-blue-600 text-white' : ''}`}
              >
                <Truck className="w-5 h-5 mr-3" />
                Transportistas
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('tarifas')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'tarifas' ? 'bg-blue-600 text-white' : ''}`}
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Tarifas
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </button>
          <p className="text-xs text-slate-600 text-center mt-2">Logística y Gestión v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-gray-700 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 ml-4 lg:ml-0">
              {TAB_LABELS[activeTab] ?? activeTab}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
              G
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          {activeTab === 'clientes' && <ClientesPage />}
          {activeTab === 'transportistas' && <TransportistasPage />}
          {activeTab === 'viajes' && <ViajesPage />}
          {activeTab === 'tarifas' && <TarifasPage />}
          {activeTab === 'adelantos' && <AdelantosPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
