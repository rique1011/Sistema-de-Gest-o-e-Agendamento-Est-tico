import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useContext(AuthContext);

  function handleEntrar(e: React.FormEvent) {
    e.preventDefault();
    login(email, senha);
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Lado Esquerdo - Decorativo */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <ShieldCheck size={40} />
            <h1 className="text-3xl font-black tracking-tight">BioSchedule</h1>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mt-20">
            Gestão inteligente <br/> para a sua clínica <br/> de estética.
          </h2>
          <p className="text-blue-200 mt-6 text-xl max-w-md">
            Acesse sua agenda, controle seus pacientes e acompanhe seu faturamento em um só lugar.
          </p>
        </div>
        
        {/* Círculos decorativos no fundo */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Bem-vinda de volta</h2>
            <p className="text-slate-500 mt-2 text-lg">Insira suas credenciais para acessar o sistema.</p>
          </div>

          <form onSubmit={handleEntrar} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">E-mail</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" required placeholder="geovana@clinica.com"
                  className="w-full py-5 pr-4 pl-12 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 shadow-sm"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Senha</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full py-5 pr-4 pl-12 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 shadow-sm"
                  value={senha} onChange={e => setSenha(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl mt-4 flex items-center justify-center gap-2 group"
            >
              Acessar Sistema <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}