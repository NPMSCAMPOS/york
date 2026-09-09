import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [characters, setCharacters] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('characters');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [charsData, storiesData] = await Promise.all([
        api.getCharacters(),
        api.getStories(),
      ]);
      setCharacters(charsData);
      setStories(storiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateYork = () => {
    navigate('/criar-york');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🦁 York</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCreateYork}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              + Criar York
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Carregando...</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('characters')}
                className={`pb-2 px-4 font-medium transition ${
                  activeTab === 'characters'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Personagens ({characters.length})
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`pb-2 px-4 font-medium transition ${
                  activeTab === 'stories'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Histórias ({stories.length})
              </button>
            </div>

            {/* Characters Tab */}
            {activeTab === 'characters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  >
                    {char.imageUrl && (
                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {char.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {char.description}
                      </p>
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div className="space-y-4">
                {stories.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    Nenhuma história criada ainda. Crie uma para começar!
                  </p>
                ) : (
                  stories.map((story) => (
                    <div
                      key={story.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {story.content}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Por: {story.user?.email}</span>
                        <button className="text-blue-500 hover:text-blue-700 font-medium">
                          Ler Mais
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
