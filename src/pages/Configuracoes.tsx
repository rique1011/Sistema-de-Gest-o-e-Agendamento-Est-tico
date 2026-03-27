import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Settings, Save, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

// Molde padrão para caso seja a primeira vez abrindo o sistema
const diasPadrao = [
  { dia_semana: 0, nome: 'Domingo', ativo: false, abertura: '08:00', fechamento: '18:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
  { dia_semana: 1, nome: 'Segunda-feira', ativo: true, abertura: '08:00', fechamento: '18:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
  { dia_semana: 2, nome: 'Terça-feira', ativo: true, abertura: '08:00', fechamento: '18:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
  { dia_semana: 3, nome: 'Quarta-feira', ativo: true, abertura: '08:00', fechamento: '18:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
  { dia_semana: 4, nome: 'Quinta-feira', ativo: true, abertura: '08:00', fechamento: '18:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
  { dia_semana: 5, nome: 'Sexta-feira', ativo: true, abertura: '08:00', fechamento: '18:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
  { dia_semana: 6, nome: 'Sábado', ativo: false, abertura: '08:00', fechamento: '12:00', almoco_inicio: '12:00', almoco_fim: '13:00' },
];

export function Configuracoes() {
  const [horarios, setHorarios] = useState(diasPadrao);

  useEffect(() => {
    async function carregarHorarios() {
      try {
        const res = await api.get('/configuracao-agenda');
        if (res.data && res.data.length > 0) {
          setHorarios(res.data);
        }
      } catch (err) {
        console.log("Usando horários padrão, backend ainda não retornou dados.");
      }
    }
    carregarHorarios();
  }, []);

  function handleChange(dia_semana: number, campo: string, valor: any) {
    setHorarios(horarios.map(h => 
      h.dia_semana === dia_semana ? { ...h, [campo]: valor } : h
    ));
  }

  async function handleSalvar() {
    try {
      // Envia o array completo de horários para o backend salvar/atualizar
      await api.post('/configuracao-agenda', { horarios });
      
      Swal.fire({
        icon: 'success',
        title: 'Horários atualizados!',
        text: 'A sua agenda agora respeita essas regras.',
        customClass: { popup: 'rounded-[2rem]' }
      });
    } catch (err: any) {
      Swal.fire('Erro', 'Não foi possível salvar as configurações.', 'error');
    }
  }

  return (
    <div className="max-w-4xl">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Settings className="text-blue-600" size={36} /> Expediente
          </h1>
          <p className="text-slate-500 font-medium mt-2">Defina seus dias de trabalho e horários de pausa.</p>
        </div>
        <button onClick={handleSalvar} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg">
          <Save size={20} /> Salvar Alterações
        </button>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
        <div className="grid grid-cols-12 gap-4 mb-6 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div className="col-span-3">Dia da Semana</div>
          <div className="col-span-4 text-center">Horário de Atendimento</div>
          <div className="col-span-4 text-center">Pausa / Almoço</div>
          <div className="col-span-1 text-center">Ativo</div>
        </div>

        <div className="space-y-4">
          {horarios.map((dia) => (
            <div key={dia.dia_semana} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border transition-colors ${dia.ativo ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-transparent opacity-60'}`}>
              
              {/* Nome do Dia */}
              <div className="col-span-3 font-bold text-slate-700 text-lg flex items-center gap-2">
                <Clock size={18} className={dia.ativo ? 'text-blue-500' : 'text-slate-300'} />
                {dia.nome}
              </div>

              {/* Expediente (Início e Fim) */}
              <div className="col-span-4 flex items-center justify-center gap-2">
                <input type="time" disabled={!dia.ativo} value={dia.abertura} onChange={(e) => handleChange(dia.dia_semana, 'abertura', e.target.value)} className="p-3 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 w-full text-center font-medium disabled:bg-transparent" />
                <span className="text-slate-400 font-medium">até</span>
                <input type="time" disabled={!dia.ativo} value={dia.fechamento} onChange={(e) => handleChange(dia.dia_semana, 'fechamento', e.target.value)} className="p-3 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 w-full text-center font-medium disabled:bg-transparent" />
              </div>

              {/* Almoço (Início e Fim) */}
              <div className="col-span-4 flex items-center justify-center gap-2">
                <input type="time" disabled={!dia.ativo} value={dia.almoco_inicio} onChange={(e) => handleChange(dia.dia_semana, 'almoco_inicio', e.target.value)} className="p-3 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 w-full text-center font-medium disabled:bg-transparent text-amber-700" />
                <span className="text-slate-400 font-medium">até</span>
                <input type="time" disabled={!dia.ativo} value={dia.almoco_fim} onChange={(e) => handleChange(dia.dia_semana, 'almoco_fim', e.target.value)} className="p-3 bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 w-full text-center font-medium disabled:bg-transparent text-amber-700" />
              </div>

              {/* Toggle Ativo/Inativo */}
              <div className="col-span-1 flex justify-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={dia.ativo} onChange={(e) => handleChange(dia.dia_semana, 'ativo', e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}