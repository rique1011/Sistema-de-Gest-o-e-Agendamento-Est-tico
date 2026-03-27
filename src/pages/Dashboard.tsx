import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [agendamentosHoje, setAgendamentosHoje] = useState<any[]>([]);
  const [faturacaoHoje, setFaturacaoHoje] = useState(0);
  const [faturamentoMes, setFaturamentoMes] = useState(0); 
  
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        // Agora busca apenas a agenda, deixando o dashboard mais rápido!
        const resAgenda = await api.get('/agendamento');

        // --- LÓGICA 1: FILTROS DE HOJE E DO MÊS ---
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        let previsaoHoje = 0;
        let ganhoMesReal = 0;

        const hojeAgendamentos = resAgenda.data.filter((ag: any) => {
          if (!ag.data_inicio) return false;
          
          const dataAg = new Date(ag.data_inicio);

          // 1. Calcula o faturamento REAL do Mês (Apenas os CONCLUÍDOS)
          if (dataAg.getMonth() === mesAtual && dataAg.getFullYear() === anoAtual) {
            if (ag.status === 'CONCLUIDO') {
              ganhoMesReal += ag.servico?.valor ? Number(ag.servico.valor) : 0;
            }
          }

          // 2. Verifica se o agendamento é EXATAMENTE HOJE
          const isHoje = dataAg.getDate() === hoje.getDate() && 
                         dataAg.getMonth() === hoje.getMonth() && 
                         dataAg.getFullYear() === hoje.getFullYear();

          if (isHoje) {
            previsaoHoje += ag.servico?.valor ? Number(ag.servico.valor) : 0;
          }

          return isHoje;
        });

        // Ordenar os agendamentos de hoje por hora
        hojeAgendamentos.sort((a: any, b: any) => 
          new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime()
        );

        setAgendamentosHoje(hojeAgendamentos);
        setFaturacaoHoje(previsaoHoje);
        setFaturamentoMes(ganhoMesReal);

        // --- LÓGICA 2: DADOS REAIS PARA O GRÁFICO (SEMANA ATUAL) ---
        const diasSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const contadoresSemana = { 'Seg': 0, 'Ter': 0, 'Qua': 0, 'Qui': 0, 'Sex': 0, 'Sáb': 0 };

        // Pega o início (Domingo) e o fim (Sábado) da semana atual
        const agora = new Date();
        const inicioSemana = new Date(agora);
        inicioSemana.setDate(agora.getDate() - agora.getDay());
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        // Conta quantos agendamentos caem em cada dia desta semana
        resAgenda.data.forEach((ag: any) => {
          if (ag.data_inicio) {
            const dataAg = new Date(ag.data_inicio);
            if (dataAg >= inicioSemana && dataAg <= fimSemana) {
              const nomeDia = diasSemanaNomes[dataAg.getDay()];
              if (contadoresSemana[nomeDia as keyof typeof contadoresSemana] !== undefined) {
                contadoresSemana[nomeDia as keyof typeof contadoresSemana]++;
              }
            }
          }
        });

        const dadosReaisGrafico = Object.keys(contadoresSemana).map(dia => ({
          nome: dia,
          atendimentos: contadoresSemana[dia as keyof typeof contadoresSemana]
        }));

        setDadosGrafico(dadosReaisGrafico);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }

    carregarDashboard();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Olá, Dra. Geovana 👋
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">
          Aqui está o resumo da sua clínica.
        </p>
      </header>

      {/* CARDS DE RESUMO (Agora com 3 colunas e sem limites de tamanho no texto) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CalendarIcon size={32} />
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Agendamentos Hoje</p>
            <h2 className="text-3xl font-black text-slate-800">{agendamentosHoje.length}</h2>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2rem] shadow-lg flex items-center gap-6 text-white relative overflow-hidden">
          <TrendingUp size={120} className="absolute -right-6 -bottom-6 opacity-10" />
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm relative z-10">
            <DollarSign size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-blue-100 font-bold uppercase tracking-wider text-xs mb-1">Previsão Hoje</p>
            <h2 className="text-3xl font-black">
              R$ {faturacaoHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-[2rem] shadow-lg flex items-center gap-6 text-white relative overflow-hidden">
          <CheckCircle size={120} className="absolute -right-6 -bottom-6 opacity-10" />
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm relative z-10">
            <CheckCircle size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-100 font-bold uppercase tracking-wider text-xs mb-1">Mês (Concluído)</p>
            <h2 className="text-3xl font-black">
              R$ {faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO DA SEMANA */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Atendimentos na Semana Atual
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="atendimentos" fill="#2563eb" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PRÓXIMOS ATENDIMENTOS DE HOJE */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-600" /> Hoje
            </h3>
            <Link to="/agenda" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:text-blue-700">
              Ver Agenda <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {agendamentosHoje.length > 0 ? (
              agendamentosHoje.map((ag) => (
                <div key={ag.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-blue-600 text-lg">
                      {new Date(ag.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                      {ag.servico?.nome || 'Procedimento'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-700 truncate">{ag.paciente?.nome}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <CalendarIcon size={48} className="mb-4" />
                <p className="font-medium text-center">Nenhum agendamento<br/>para hoje.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}