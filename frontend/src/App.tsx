import { useState } from 'react';
import { Truck, Users, Map, DollarSign, Menu, Bell } from 'lucide-react';
import ClientesPage from './pages/ClientesPage';
import TransportistasPage from './pages/TransportistasPage';

function App() {
  const [activeTab, setActiveTab] = useState('viajes');

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Truck className="w-6 h-6 text-blue-500 mr-2" />
          <span className="text-lg font-bold text-white tracking-wider">GAVEM SA</span>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('viajes')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'viajes' ? 'bg-blue-600 text-white' : ''}`}
              >
                <Map className="w-5 h-5 mr-3" />
                Viajes Activos
              </button>
            </li>
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
                onClick={() => setActiveTab('finanzas')}
                className={`w-full flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${activeTab === 'finanzas' ? 'bg-blue-600 text-white' : ''}`}
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Adelantos & Tarifas
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Logística y Gestión v1.0
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
            <h2 className="text-xl font-semibold text-gray-800 ml-4 lg:ml-0 capitalize">
              Módulo de {activeTab}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          {activeTab === 'clientes' && <ClientesPage />}
          {activeTab === 'transportistas' && <TransportistasPage />}
          
          {(activeTab !== 'clientes' && activeTab !== 'transportistas') && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                 {activeTab === 'viajes' && <Map className="w-10 h-10" />}
                 {activeTab === 'finanzas' && <DollarSign className="w-10 h-10" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Panel de {activeTab}</h3>
              <p className="text-gray-500 max-w-md">
                Esta sección está en construcción. Próximamente la conectaremos a la base de datos de PostgreSQL.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
