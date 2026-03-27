import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Scissors, 
  Plus, 
  X, 
  Search, 
  Trash2, 
  DollarSign,
  AlignLeft,
  Clock // Importei o ícone de relógio
} from 'lucide-react';
import Swal from 'sweetalert2';

export function Servicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [duracao, setDuracao] = useState(''); // NOVO CAMPO AQUI

  async function carregarServicos() {
    try {
      const res = await api.get('/servico');
      setServicos(res.data);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    try {
      const valorNumerico = parseFloat(valor.replace(',', '.'));
      const duracaoNumerica = parseInt(duracao, 10); // Converte para número inteiro

      // Agora enviamos a duração junto!
      await api.post('/servico', { 
        nome, 
        valor: valorNumerico,
        duracao_minutos: duracaoNumerica
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Serviço registado!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-[2rem]' }
      });

      setNome(''); setValor(''); setDuracao('');
      setIsModalOpen(false);
      carregarServicos();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao salvar.';
      Swal.fire({ icon: 'error', title: 'Erro do Backend', text: Array.isArray(msg) ? msg.join(', ') : msg });
    }
  }

  async function handleExcluir(id: string, nomeServico: string) {
    const confirmacao = await Swal.fire({
      title: 'Tem a certeza?',
      text: `Deseja remover o procedimento "${nomeServico}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (confirmacao.isConfirmed) {
      try {
        await api.delete(`/servico/${id}`);
        Swal.fire({ title: 'Removido!', icon: 'success', timer: 1500, showConfirmButton: false });
        carregarServicos();
      } catch (err) {
        Swal.fire('Erro!', 'Este serviço pode estar associado a agendamentos antigos.', 'error');
      }
    }
  }

  const servicosFiltrados = servicos.filter(s => 
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Scissors className="text-blue-600" size={36} /> Procedimentos
          </h1>
          <p className="text-slate-500 font-medium ml-12">Gira o catálogo de serviços e preços.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg">
          <Plus size={20} /> Novo Procedimento
        </button>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
          <Search className="text-slate-400" size={22} />
          <input 
            type="text" placeholder="Pesquisar procedimento..." 
            className="flex-1 bg-transparent outline-none text-slate-700 text-lg"
            value={busca} onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4 font-bold">Nome do Procedimento</th>
              <th className="px-8 py-4 font-bold">Valor (R$)</th>
              <th className="px-8 py-4 font-bold">Duração</th>
              <th className="px-8 py-4 font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {servicosFiltrados.map((s: any) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><AlignLeft size={18} /></div>
                    <span className="font-bold text-slate-800 text-lg">{s.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="flex items-center gap-1 text-emerald-600 font-black text-lg">
                    <DollarSign size={18} /> {Number(s.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">
                  {s.duracao_minutos} min
                </td>
                <td className="px-8 py-5 text-center">
                  <button onClick={() => handleExcluir(s.id, s.nome)} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">Novo Procedimento</h2>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Nome do Serviço</label>
                <input type="text" required placeholder="Ex: Limpeza de Pele" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-medium text-slate-700" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Valor (R$)</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><DollarSign size={18} /></div>
                    <input type="number" step="0.01" min="0" required placeholder="150.00" className="w-full py-4 pr-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" value={valor} onChange={e => setValor(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Duração (Min)</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Clock size={18} /></div>
                    <input type="number" min="1" required placeholder="Ex: 60" className="w-full py-4 pr-4 pl-12 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700" value={duracao} onChange={e => setDuracao(e.target.value)} />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl mt-6">
                Guardar Serviço
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}