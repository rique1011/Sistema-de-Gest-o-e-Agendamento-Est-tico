import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Calendar, Clock, User, Plus, Check, X, Play, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface Agendamento {
  id: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  paciente: { nome: string };
  servico: { nome: string; valor: number };
}

interface Paciente { id: string; nome: string; }
interface Servico { id: string; nome: string; duracao_minutos: number; }

export function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pacienteId: '',
    servicoId: '',
    data_inicio: ''
  });

  // Calcula a data atual formatada para bloquear o passado no input
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  const dataMinima = hoje.toISOString().slice(0, 16);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [resAgenda, resPacientes, resServicos] = await Promise.all([
        api.get('/agendamento'),
        api.get('/paciente'), 
        api.get('/servico')
      ]);
      setAgendamentos(resAgenda.data);
      setPacientes(resPacientes.data);
      setServicos(resServicos.data);
    } catch (err) {
      console.error("Erro ao carregar dados da agenda", err);
    }
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    try {
      // 1. Acha o serviço escolhido na lista para saber a duração dele
      const servicoSelecionado = servicos.find(s => s.id === formData.servicoId);
      const duracao = servicoSelecionado?.duracao_minutos || 60; // Padrão 60 min se der erro

      // 2. Calcula a data/hora final automaticamente
      const dataInicioObj = new Date(formData.data_inicio);
      const dataFimObj = new Date(dataInicioObj.getTime() + duracao * 60000); // Soma os minutos

      // 3. Monta o pacote final para enviar ao backend
      const payload = {
        pacienteId: formData.pacienteId,
        servicoId: formData.servicoId,
        data_inicio: dataInicioObj.toISOString(),
        data_fim: dataFimObj.toISOString() 
      };

      await api.post('/agendamento', payload);
      
      Swal.fire({
        icon: 'success',
        title: 'Horário Agendado!',
        timer: 2000,
        showConfirmButton: false
      });
      
      setIsModalOpen(false);
      setFormData({ pacienteId: '', servicoId: '', data_inicio: '' });
      carregarDados();
    } catch (error: any) {
      const mensagemErro = error.response?.data?.message || 'Erro ao agendar horário.';
      Swal.fire({
        icon: 'error',
        title: 'Não foi possível agendar',
        text: typeof mensagemErro === 'string' ? mensagemErro : mensagemErro[0],
      });
    }
  }

  async function alterarStatus(id: string, novoStatus: string) {
    try {
      await api.patch(`/agendamento/${id}`, { status: novoStatus });
      carregarDados(); 
    } catch (err) {
      Swal.fire('Erro', 'Não foi possível alterar o status.', 'error');
    }
  }

  const statusConfig: any = {
    AGENDADO: { cor: 'bg-amber-100 text-amber-700 border-amber-200', icone: <Clock size={16} /> },
    CONFIRMADO: { cor: 'bg-blue-100 text-blue-700 border-blue-200', icone: <Check size={16} /> },
    CONCLUIDO: { cor: 'bg-emerald-100 text-emerald-700 border-emerald-200', icone: <CheckCircle size={16} /> },
    FALTOU: { cor: 'bg-rose-100 text-rose-700 border-rose-200', icone: <X size={16} /> },
    CANCELADO: { cor: 'bg-slate-100 text-slate-700 border-slate-200', icone: <X size={16} /> }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Calendar className="text-blue-600" size={36} /> Agenda
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gerencie os horários e atendimentos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Novo Agendamento
        </button>
      </header>

      {/* Grid de Cards da Agenda */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agendamentos.map((agendamento) => {
          const config = statusConfig[agendamento.status] || statusConfig['AGENDADO'];
          const data = new Date(agendamento.data_inicio);
          const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

          return (
            <div key={agendamento.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider border ${config.cor}`}>
                  {config.icone} {agendamento.status}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-800">{hora}</span>
                  <p className="text-sm font-medium text-slate-400">{dataFormatada}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <User size={18} className="text-slate-400 shrink-0" />
                  <span className="truncate">{agendamento.paciente?.nome}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <Play size={18} className="text-slate-400 shrink-0" />
                  <span className="truncate">{agendamento.servico?.nome}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                {agendamento.status === 'AGENDADO' && (
                  <button onClick={() => alterarStatus(agendamento.id, 'CONFIRMADO')} className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                    Confirmar
                  </button>
                )}
                {agendamento.status === 'CONFIRMADO' && (
                  <button onClick={() => alterarStatus(agendamento.id, 'CONCLUIDO')} className="flex-1 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors">
                    Concluir
                  </button>
                )}
                {(agendamento.status === 'AGENDADO' || agendamento.status === 'CONFIRMADO') && (
                  <button onClick={() => alterarStatus(agendamento.id, 'FALTOU')} className="flex-1 bg-rose-50 text-rose-600 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">
                    Faltou
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {agendamentos.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum agendamento encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal de Novo Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Agendar Horário</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 bg-slate-50 rounded-full hover:bg-rose-50">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Paciente</label>
                <select 
                  required 
                  value={formData.pacienteId}
                  onChange={e => setFormData({...formData, pacienteId: e.target.value})} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                >
                  <option value="">Selecione um paciente...</option>
                  {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Serviço</label>
                <select 
                  required 
                  value={formData.servicoId}
                  onChange={e => setFormData({...formData, servicoId: e.target.value})} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                >
                  <option value="">Selecione um serviço...</option>
                  {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} ({s.duracao_minutos} min)</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Data e Hora de Início</label>
                <input 
                  type="datetime-local" 
                  required 
                  min={dataMinima} // <-- TRAVA VISUAL ADICIONADA AQUI
                  value={formData.data_inicio}
                  onChange={e => setFormData({...formData, data_inicio: e.target.value})} 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 text-sm" 
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold text-lg p-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mt-6 flex justify-center items-center gap-2">
                <Check size={20} /> Salvar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}