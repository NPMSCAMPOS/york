import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useYorkStore } from '../stores/yorkStore';

const ACTIVITIES = [
  { emoji: '📖', title: 'Historinhas', subtitle: 'Ouça uma aventura nova', classes: 'bg-amber-100' },
  { emoji: '🎨', title: 'Desenhar', subtitle: 'Solte a imaginação', classes: 'bg-pink-100' },
  { emoji: '🧠', title: 'Quiz', subtitle: 'Aprenda brincando', classes: 'bg-sky-100' },
  { emoji: '💛', title: 'Meu Diário', subtitle: 'Como você está hoje?', classes: 'bg-green-100' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const york = useYorkStore((s) => s.york);
  const yorkId = useYorkStore((s) => s.yorkId);
  const yorkLoading = useYorkStore((s) => s.loading);
  const fetchYork = useYorkStore((s) => s.fetchYork);

  useEffect(() => {
    if (!yorkId) {
      navigate('/criar-york');
      return;
    }
    fetchYork(yorkId).then((result) => {
      if (!result.ok) {
        navigate('/criar-york');
      }
    });
  }, [yorkId]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (yorkLoading && !york) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-amber-50">
        <p className="text-slate-500 font-semibold">Carregando o seu York...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-amber-50">
      <header className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{york?.avatar || '🦒'}</div>
          <div>
            <div className="font-extrabold text-slate-800">Oi, {york?.name || 'amigo'}!</div>
            <div className="text-xs text-slate-500">Responsável: {user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
          Sair
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">O que vamos fazer hoje?</h1>
        <p className="text-slate-500 mb-8">Escolha uma atividade para começar</p>

        <div className="grid grid-cols-2 gap-5">
          {ACTIVITIES.map((a) => (
            <button
              key={a.title}
              onClick={() => alert(`Atividade "${a.title}" em desenvolvimento 🚧`)}
              className={`text-left rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition ${a.classes}`}
            >
              <div className="text-5xl mb-3">{a.emoji}</div>
              <div className="font-extrabold text-lg text-slate-800">{a.title}</div>
              <div className="text-sm text-slate-500">{a.subtitle}</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
