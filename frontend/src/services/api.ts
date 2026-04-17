import axios from 'axios';

// La URL donde está corriendo tu servidor de Python (FastAPI)
const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- CLIENTES ---
export const getClientes = async () => {
  const response = await api.get('/clientes/');
  return response.data;
};

export const crearCliente = async (clienteData: { nombre: string; cuit: string }) => {
  const response = await api.post('/clientes/', clienteData);
  return response.data;
};

// --- TRANSPORTISTAS ---
export const getTransportistas = async () => {
  const response = await api.get('/transportistas/');
  return response.data;
};

export const crearTransportista = async (transData: { 
  codTrans: number; 
  nomTrans: string; 
  cuitTrans: string;
  telTrans?: string;
  localidad?: string;
  provincia?: string;
  cp?: string;
  calleTrans?: string;
  nroCalleTrans?: string;
}) => {
  const response = await api.post('/transportistas/', transData);
  return response.data;
};

// --- VIAJES ---
export const getViajes = async () => {
  const response = await api.get('/viajes/');
  return response.data;
};

export default api;
