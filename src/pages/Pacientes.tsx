import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, Plus, Search, Phone, Mail, FileText, Calendar, Trash2, Edit2, X, Save, ClipboardList, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

// Tipagem para a lista principal
interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
}

// Tipagem detalhada para o Prontuário (inclui histórico)
interface PacienteDetalhado extends Paciente {
  observacoes?: string;
  agendamentos: {
    id: string;
    data_inicio: string;
    status: string;
    servico: { nome: string };
  }[];
}

export function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Estados para o Modal de Detalhes (Prontuário)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pacienteDetalhado, setPacienteDetalhado] = useState<PacienteDetalhado | null>(null);
  const [observacoesDraft, setObservacoesDraft] = useState(''); // Rascunho das notas
  const [salvandoNotas, setSalvandoNotas] = useState(false);

  useEffect(() => {
    carregarPacientes();
  }, []);

  async function carregarPacientes() {
    try {
      setCarregando(true);
      const response = await api.get('/paciente');
      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes", error);
      Swal.fire('Erro', 'Não foi possível carregar a lista de pacientes.', 'error');
    } finally {
      setCarregando(false);
    }
  }

  // Abre o prontuário e busca o histórico completo do paciente
  async function abrirProntuario(id: string) {
    try {
      Swal.showLoading();
      const response = await api.get(`/paciente/${id}`); 
      setPacienteDetalhado(response.data);
      setObservacoesDraft(response.data.observacoes || ''); // Preenche o rascunho com o que já existe
      setIsDetailsOpen(true);
      Swal.close();
    } catch (error) {
      Swal.fire('Erro', 'Não foi possível abrir o prontuário.', 'error');
    }
  }

  // Salva apenas as observações clínicas no banco
  async function salvarObservacoes() {
    if (!pacienteDetalhado) return;
    try {
      setSalvandoNotas(true);
      await api.patch(`/paciente/${pacienteDetalhado.id}`, { observacoes: observacoesDraft });
      setPacienteDetalhado({ ...pacienteDetalhado, observacoes: observacoesDraft }); // Atualiza estado local
      Swal.fire({ icon: 'success', title: 'Notas salvas!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
    } catch (error) {
      Swal.fire('Erro', 'Não foi possível salvar as observações.', 'error');
    } finally {
      setSalvandoNotas(false);
    }
  }

  // Filtra pacientes na tela baseado na busca (nome ou CPF)
  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  );

  // Dicionário de Status para a linha do tempo
  const statusConfig: any = {
    CONCLUIDO: 'bg-emerald-100 text-emerald-700',
    FALTOU: 'bg-rose-100 text-rose-700',
    CANCELADO: 'bg-slate-100 text-slate-700',
    DEFAULT: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <header className="mb-10 flex justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={36} /> Pacientes
          </h1>
          <p className="text-slate-500 font-medium mt-2">Gerencie cadastros e visualize prontuários.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 shrink-0">
          <Plus size={20} /> Novo Paciente
        </button>
      </header>

      {/* Barra de Busca */}
      <div className="relative mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
        <input 
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome ou CPF..."
          className="w-full p-5 pl-14 bg-white border border-slate-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-200 text-lg shadow-sm"
        />
      </div>

      {/* Tabela de Pacientes */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {carregando ? (
          <div className="p-20 text-center text-slate-500 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            Carregando pacientes...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Nome / Prontuário</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">CPF</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pacientesFiltrados.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 cursor-pointer" onClick={() => abrirProntuario(p.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl border border-blue-100">
                        {p.nome.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg hover:text-blue-600 transition-colors">{p.nome}</p>
                        <p className="text-sm text-blue-600 font-bold flex items-center gap-1.5 mt-0.5">
                          <ClipboardList size={14}/> Ver Prontuário
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-slate-600 font-medium">{p.cpf}</td>
                  <td className="p-6 space-y-1">
                    <p className="text-slate-700 font-medium flex items-center gap-2"><Phone size={16} className="text-slate-400" /> {p.telefone}</p>
                    {p.email && <p className="text-slate-500 text-sm flex items-center gap-2"><Mail size={16} className="text-slate-400" /> {p.email}</p>}
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-center">
                      <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"><Edit2 size={18} /></button>
                      <button className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!carregando && pacientesFiltrados.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            Nenhum paciente encontrado.
          </div>
        )}
      </div>

      {/* --- MODAL DETALHES DO PACIENTE (PRONTUÁRIO) --- */}
      {isDetailsOpen && pacienteDetalhado && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end z-50 transition-all" onClick={() => setIsDetailsOpen(false)}>
          {/* Painel Lateral deslizando da direita */}
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()} style={{ animation: 'slideIn 0.3s ease-out forwards' }}>
            
            {/* Cabeçalho do Prontuário */}
            <header className="p-8 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-600/20">
                    {pacienteDetalhado.nome.substring(0, 1)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{pacienteDetalhado.nome}</h2>
                    <p className="text-slate-500 font-medium mt-1">CPF: {pacienteDetalhado.cpf}</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-rose-500 p-2 bg-white rounded-full border hover:bg-rose-50 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 font-medium flex items-center gap-2.5"><Phone size={18} className="text-blue-500" /> {pacienteDetalhado.telefone}</p>
                  {pacienteDetalhado.email && <p className="text-slate-700 font-medium flex items-center gap-2.5"><Mail size={18} className="text-blue-500" /> {pacienteDetalhado.email}</p>}
              </div>
            </header>

            {/* Conteúdo do Prontuário */}
            <div className="flex-1 p-8 space-y-10">
              
              {/* Seção 1: Anotações Clínicas (Editável) */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                    <FileText className="text-blue-600" /> Anotações Clínicas e Observações
                  </h3>
                  <button 
                    onClick={salvarObservacoes}
                    disabled={salvandoNotas}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 text-sm rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {salvandoNotas ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={16} />}
                    {salvandoNotas ? 'Salvando...' : 'Salvar Notas'}
                  </button>
                </div>
                <textarea 
                  value={observacoesDraft}
                  onChange={e => setObservacoesDraft(e.target.value)}
                  rows={8}
                  placeholder="Escreva aqui histórico médico, alergias, queixas principais, preferências do paciente..."
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 font-medium text-slate-700 resize-none"
                />
              </section>

              {/* Seção 2: Histórico de Procedimentos */}
              <section>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5 mb-6">
                  <Calendar className="text-blue-600" /> Histórico de Procedimentos (Linha do Tempo)
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-100">
                  {pacienteDetalhado.agendamentos.length === 0 && (
                    <p className="text-slate-500 pl-10 pt-2 font-medium">Nenhum procedimento realizado até o momento.</p>
                  )}
                  
                  {[...pacienteDetalhado.agendamentos]
                    .sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()) 
                    .map((ag) => {
                      const data = new Date(ag.data_inicio);
                      const dataFormatar = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
                      const corStatus = statusConfig[ag.status] || statusConfig['DEFAULT'];

                      return (
                        <div key={ag.id} className="relative pl-12">
                          {/* Bolinha da Linha do Tempo */}
                          <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center z-10">
                            <CheckCircle size={16} className="text-blue-600" />
                          </div>
                          
                          {/* Card do Procedimento */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-bold text-slate-800 text-lg">{ag.servico.nome}</p>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">{dataFormatar}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${corStatus}`}>
                                {ag.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      
      {/* Estilo embutido para a animação do modal não precisar mexer no tailwind.config.js agora */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}