import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';

export default function CreateYorkPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: '',
    ageGroup: '6-8 anos',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name || !formData.description) {
      setError('Nome e descrição são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      await api.createCharacter(
        formData.name,
        formData.description,
        null // imageUrl
      );
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        theme: '',
        ageGroup: '6-8 anos',
      });
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🦁 York</h1>
          <button
            onClick={() => navigate('/home')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Voltar
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Criar um Novo York
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do York
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Digite um nome para seu York..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Descreva seu York... Como ele é? Quais são suas características?"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema da História (Opcional)
              </label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Ex: Aventura, Amizade, Natureza..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa Etária
              </label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="4-5 anos">4-5 anos</option>
                <option value="6-8 anos">6-8 anos</option>
                <option value="9-11 anos">9-11 anos</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                York criado com sucesso! Redirecionando...
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar York'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/home')}
                disabled={loading}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            💡 Dicas para criar um York interessante
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Dê um nome único e fácil de lembrar</li>
            <li>✓ Descreva as características principais do personagem</li>
            <li>✓ Pense em uma personalidade única para seu York</li>
            <li>✓ Escolha a faixa etária apropriada para as histórias</li>
            <li>✓ Você pode criar múltiplos Yorks diferentes!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
