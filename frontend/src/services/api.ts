import axios from 'axios';

// La URL donde está corriendo tu servidor de Python (FastAPI)
const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_TOKEN_KEY = 'gavem_access_token';
const AUTH_USER_KEY = 'gavem_user';

export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);

export const getStoredUser = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAuthSession = (token: string, user: any) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession();
    }
    return Promise.reject(error);
  }
);

// --- AUTH ---
export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  const { access_token, user } = response.data;
  setAuthSession(access_token, user);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data));
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAuthSession();
  }
};

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

export const cargarViaje = async (
  viajeData: {
    ordenante: string;
    fecha: string;
    propio_tercero?: string;
    chofer: string;
    carta_porte: string;
    mercaderia: string;
    dominio_camion?: string;
    dominio_acoplado?: string;
    lugar_desde: string;
    lugar_hasta: string;
    prov_origen?: string;
    prov_destino?: string;
    kms: number;
    kilos: number;
    cubicaje?: number;
    condicion: string;
    varios?: number;
    comentario?: string;
    observaciones?: string;
    tarifa_aplicada?: number;
    importe?: number;
    comision_8?: number;
    neto?: number;
    iva_21?: number;
    adelantos_consumidos?: number;
    saldo?: number;
    rentabilidad?: number;
    orden_pago?: string;
    factura_gavem?: string;
    imp_fact_gavem?: number;
    nro_fc_transportista?: string;
    imp_fact_transportista?: number;
  },
  cli_id: number,
  trans_id: number
) => {
  const response = await api.post('/viajes/', viajeData, {
    params: {
      cli_id,
      trans_id
    }
  });
  return response.data;
};

export const actualizarViaje = async (viajeId: number, viajeData: any) => {
  const response = await api.put(`/viajes/${viajeId}`, viajeData);
  return response.data;
};

export const eliminarViaje = async (viajeId: number) => {
  const response = await api.delete(`/viajes/${viajeId}`);
  return response.data;
};

// --- TARIFAS ---
export const getTarifas = async () => {
  const response = await api.get('/tarifas/');
  return response.data;
};

export const crearTarifa = async (tarifaData: {
  cliente_id: number;
  precio_km_ton: number;
  fecha_desde: string;
  fecha_hasta: string;
}) => {
  const response = await api.post('/tarifas/', tarifaData);
  return response.data;
};

// --- ADELANTOS ---
export const getAdelantos = async () => {
  const response = await api.get('/adelantos/');
  return response.data;
};

export const crearAdelanto = async (adelantoData: {
  tipo: string;
  monto_total: number;
  observaciones?: string | null;
  transportista_id: number;
  viaje_id?: number | null;
}) => {
  const response = await api.post('/adelantos/', adelantoData);
  return response.data;
};

export const actualizarAdelanto = async (adelantoId: number, data: { viaje_id?: number | null }) => {
  const response = await api.put(`/adelantos/${adelantoId}`, data);
  return response.data;
};

// --- HISTORIAL ---
export const getHistorial = async (params?: { entidad?: string, entidad_id?: number }) => {
  const response = await api.get('/historial/', { params });
  return response.data;
};

// --- USUARIOS (solo superadministrador) ---
export const getUsuarios = async () => {
  const response = await api.get('/usuarios/');
  return response.data;
};

export const crearUsuario = async (usuarioData: {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'superadministrador' | 'operador';
}) => {
  const response = await api.post('/usuarios/', usuarioData);
  return response.data;
};

export const desactivarUsuario = async (usuarioId: number) => {
  const response = await api.put(`/usuarios/${usuarioId}/desactivar`);
  return response.data;
};

export const reactivarUsuario = async (usuarioId: number) => {
  const response = await api.put(`/usuarios/${usuarioId}/reactivar`);
  return response.data;
};

export const actualizarUsuario = async (usuarioId: number, data: any) => {
  const response = await api.put(`/usuarios/${usuarioId}`, data);
  return response.data;
};

export default api;
