import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsultaService } from '../consultas-service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../paciente/paciente-service';
import { MedicoService } from '../../medico/medico-service';
import { Fluid } from 'primeng/fluid';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-consultas-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormsModule, DatePicker, Fluid],
  templateUrl: './consultas-cadastrar.html',
  styleUrls: ['./consultas-cadastrar.css'],
})
export class ConsultasCadastrar {
  @Input() dependenteEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  id!: number;
  status?: string = 'Agendada';
  horaConsulta?: string;
  paciente: any;
  medico: any;

  listaPacientes: any[] = [];
  listaMedicos: any[] = [];

  // ✅ horários do médico selecionado vem do backend
  horariosDisponiveis: any[] = [];

  // 🆕 Novas propriedades
  diaSelecionado: string = '';
  diasDisponiveis: string[] = [];
  horariosGerados: string[] = [];

  constructor(
    private readonly consultaService: ConsultaService,
    private readonly pacienteService: PacienteService,
    private readonly medicoService: MedicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.dependenteEdicao) {
      this.id = this.dependenteEdicao.id;
      this.status = this.dependenteEdicao.status;
      this.horaConsulta = this.dependenteEdicao.horaConsulta;
      this.paciente = this.dependenteEdicao.paciente;
      this.medico = this.dependenteEdicao.medico;

      // ✅ Se estiver editando, já inicializa a lista de horários
      if (this.medico && this.medico.horarios) {
        this.horariosDisponiveis = this.medico.horarios;
        this.diasDisponiveis = this.medico.horarios.map((h: any) => h.diaSemana);
      }
    }

    this.carregarPacientes();
    this.carregarMedicos();
  }

  carregarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (pacientes: any[]) => {
        this.listaPacientes = pacientes;
      },
      error: (err) => console.error('Erro ao carregar lista de pacientes:', err),
    });
  }

  carregarMedicos(): void {
    this.medicoService.listarMedico().subscribe({
      next: (medicos: any[]) => {
        this.listaMedicos = medicos;
      },
      error: (err) => console.error('Erro ao carregar lista de médicos:', err),
    });
  }

  // ✅ MÉTODO CHAMADO QUANDO O SELECT DO MÉDICO MUDA
  onMedicoSelecionado() {
    if (this.medico && this.medico.horarios) {
      this.horariosDisponiveis = this.medico.horarios;
      this.diasDisponiveis = this.medico.horarios.map((h: any) => h.diaSemana);
      this.diaSelecionado = '';
      this.horariosGerados = [];
      this.horaConsulta = undefined;
    } else {
      this.horariosDisponiveis = [];
      this.diasDisponiveis = [];
      this.horariosGerados = [];
      this.horaConsulta = undefined;
    }
  }

  // 🆕 Gera horários de 1 em 1 hora para o dia escolhido
  gerarHorarios(): void {
    this.horariosGerados = [];

    const horarioDia = this.horariosDisponiveis.find(
      (h: any) => h.diaSemana === this.diaSelecionado
    );

    if (!horarioDia) return;

    const inicio = this.converterHoraParaMinutos(horarioDia.horaInicio);
    const fim = this.converterHoraParaMinutos(horarioDia.horaFim);

    // gera horários a cada 60 minutos
    for (let i = inicio; i < fim; i += 60) {
      this.horariosGerados.push(this.converterMinutosParaHora(i));
    }
  }

  // ✅ Utilitários de conversão
  converterHoraParaMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  converterMinutosParaHora(minutos: number): string {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0');
    const m = (minutos % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }


  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      status: this.status,
      horaConsulta: this.horaConsulta,
      paciente: this.paciente,
      medico: this.medico,
      diaConsulta: this.diaSelecionado
    };

    this.consultaService.salvarConsulta(dadosEnvio).subscribe({
    next: () => {
      alert('Consulta cadastrada com sucesso!');
      this.fecharModal.emit();
      this.gerarHorarios(); // ✅ Atualiza lista removendo horário usado
    },
    error: (error) => {
      if (error.status === 400) {
        alert(error.error.message || 'Horário já ocupado.');
      } else {
        alert('Erro ao cadastrar consulta.');
      }
    },
  });
}


  // Mantém suas propriedades auxiliares
  datetime12h: Date[] | undefined;
  datetime24h: Date[] | undefined;
  time: Date[] | undefined;
}
