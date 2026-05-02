import React, { useState } from 'react';
import { Truck, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../services/api';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(username, password);
      onLogin(data.user);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Credenciales inválidas. Intentá de nuevo.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg">
      {/* Background decorative elements */}
      <div className="login-decorative">
        <div className="login-decorative-blob login-decorative-blob--top" />
        <div className="login-decorative-blob login-decorative-blob--bottom" />
      </div>

      <div className="login-wrapper">
        {/* Card */}
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon-wrapper">
              <div className="login-icon-box">
                <Truck className="login-icon" />
              </div>
            </div>
            <h1 className="login-title">GAVEM SA</h1>
            <p className="login-subtitle">Sistema de Gestión Logística</p>
          </div>

          {/* Form */}
          <div className="login-form-area">
            <div className="login-form-header">
              <Lock className="login-form-header-icon" />
              <h2 className="login-form-header-text">Acceso al sistema</h2>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div>
                <label className="login-label">
                  Usuario
                </label>
                <div className="login-input-wrapper">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresá tu usuario"
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <label className="login-label">
                  Contraseña
                </label>
                <div className="login-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresá tu contraseña"
                    className="login-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-toggle-pw"
                  >
                    {showPassword ? <EyeOff className="login-toggle-pw-icon" /> : <Eye className="login-toggle-pw-icon" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password || !username}
                className="login-submit"
              >
                {isLoading ? (
                  <>
                    <div className="login-spinner" />
                    Verificando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">Sistema de uso interno — GAVEM SA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
