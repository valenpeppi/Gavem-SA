import React, { useState } from 'react';
import { Truck, Lock, Eye, EyeOff } from 'lucide-react';

// Contraseña de acceso al sistema (hardcoded para uso interno)
const SYSTEM_PASSWORD = 'gavem2026';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (password === SYSTEM_PASSWORD) {
        sessionStorage.setItem('gavem_auth', 'true');
        onLogin();
      } else {
        setError('Contraseña incorrecta. Intentá de nuevo.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
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
                  Contraseña
                </label>
                <div className="login-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresá la contraseña del sistema"
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
                disabled={isLoading || !password}
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
