import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { login, register, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isRegister
      ? await register(email, password)
      : await login(email, password);
    if (result.ok) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🦒</div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">YORK</h1>
          <p className="text-sm text-slate-500">
            {isRegister ? 'Crie sua conta' : 'Entre para acompanhar seu York'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-full hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : isRegister ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-4 text-sm text-orange-500 hover:text-orange-600"
        >
          {isRegister ? 'Já tem conta? Entrar' : 'Criar nova conta'}
        </button>
      </div>
    </div>
  );
}
