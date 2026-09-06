import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYorkStore } from '../stores/yorkStore';

const AVATARS = ['🦒', '🐯', '🐼', '🦊', '🐰', '🐸'];
const COLORS = [
  { name: 'Laranja', value: 'orange', classes: 'bg-orange-100 text-orange-700' },
  { name: 'Roxo', value: 'purple', classes: 'bg-purple-100 text-purple-700' },
  { name: 'Verde', value: 'green', classes: 'bg-green-100 text-green-700' },
  { name: 'Azul', value: 'sky', classes: 'bg-sky-100 text-sky-700' },
];
const PERSONALITIES = [
  { emoji: '😄', label: 'Brincalhão' },
  { emoji: '🤔', label: 'Curioso' },
  { emoji: '🥰', label: 'Carinhoso' },
  { emoji: '💪', label: 'Corajoso' },
];
const AGE_GROUPS = ['4-5 anos', '6-8 anos', '9-11 anos'];
const STEPS = ['Nome', 'Aparência', 'Personalidade', 'Idade', 'Confirmar'];

export default function CreateYorkPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    avatar: AVATARS[0],
    color: COLORS[0].value,
    personality: PERSONALITIES[0].label,
    ageGroup: AGE_GROUPS[0],
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const navigate = useNavigate();
  const createYork = useYorkStore((s) => s.createYork);

  const canAdvance = step !== 0 || form.name.trim().length > 0;

  async function finish() {
    setSaving(true);
    setSaveError(null);
    const result = await createYork(form);
    setSaving(false);
    if (result.ok) {
      navigate('/home');
    } else {
      setSaveError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i <= step ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-1 rounded ${i < step ? 'bg-orange-500' : 'bg-slate-100'}`} />
              )}
            </div>
          ))}
        </div>

        <h2 className="text-center text-lg font-extrabold text-slate-800 mb-1">{STEPS[step]}</h2>
        <p className="text-center text-sm text-slate-500 mb-6">Passo {step + 1} de {STEPS.length}</p>

        {step === 0 && (
          <div>
            <div className="text-center text-6xl mb-4">{form.avatar}</div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Qual vai ser o nome do seu York?</label>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Zeca"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-3">Escolha a carinha do seu York</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setForm({ ...form, avatar: a })}
                  className={`text-4xl rounded-2xl py-4 border-2 transition ${form.avatar === a ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-3">Escolha a cor favorita</p>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={`flex-1 rounded-xl py-3 text-sm font-bold border-2 transition ${c.classes} ${form.color === c.value ? 'border-slate-700' : 'border-transparent'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {PERSONALITIES.map((p) => (
              <button
                key={p.label}
                onClick={() => setForm({ ...form, personality: p.label })}
                className={`rounded-2xl py-5 border-2 transition ${form.personality === p.label ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="text-3xl mb-1">{p.emoji}</div>
                <div className="font-bold text-slate-700">{p.label}</div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-4">Qual é a idade de {form.name || 'seu York'}?</p>
            <div className="flex flex-col gap-3">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  onClick={() => setForm({ ...form, ageGroup: age })}
                  className={`rounded-2xl py-4 border-2 transition font-bold ${form.ageGroup === age ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="text-7xl mb-3">{form.avatar}</div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-1">{form.name || 'Seu York'}</h3>
            <p className="text-slate-500 mb-4">{form.personality} · cor favorita {form.color}</p>
            <p className="text-sm text-slate-400 mb-2">{form.ageGroup}</p>
            <p className="text-sm text-slate-400">Tudo pronto! Vamos começar a diversão?</p>
            {saveError && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-4">{saveError}</p>}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} disabled={saving} className="flex-1 rounded-full border-2 border-slate-200 py-3 font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Voltar
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canAdvance} className="flex-1 rounded-full bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50">
              Continuar
            </button>
          ) : (
            <button onClick={finish} disabled={saving} className="flex-1 rounded-full bg-green-500 py-3 font-bold text-white hover:bg-green-600 disabled:opacity-60">
              {saving ? 'Salvando...' : 'Criar meu York! 🎉'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
