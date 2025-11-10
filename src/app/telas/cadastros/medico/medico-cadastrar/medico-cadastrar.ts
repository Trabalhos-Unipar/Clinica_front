import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../medico-service';

@Component({
  selector: 'app-medico-cadastrar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './medico-cadastrar.html',
  styleUrls: ['./medico-cadastrar.css']
})
export class MedicoCadastrar implements OnInit{

  @Input() dependenteEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  // ESTE OBJETO SERÁ A ÚNICA FONTE DA VERDADE
  medico: any = {
    id: null, // Importante ter o ID aqui
    nome: '',
    crm: '',
    especialidade: null, // Iniciar como null para o placeholder do select
    email: '',
    telefone: '',
    horarios: [] // lista dinâmica de horários
  };

  // Variáveis de controle (não são dados do médico)
  listaEspecialidades: any[] = [];
  diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  constructor(
    private readonly medicoService: MedicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.dependenteEdicao) {
      // PREENCHE O OBJETO 'medico' SE FOR UMA EDIÇÃO
      // Usamos '...this.medico' para garantir que todas as chaves existam
      this.medico = { ...this.medico, ...this.dependenteEdicao };

      // Garante que 'horarios' seja uma lista se vier como null
      if (!this.medico.horarios) {
        this.medico.horarios = [];
      }
    }
    
    this.carregarEspecialidades();
  }

  carregarEspecialidades(): void {
    this.medicoService.listarEspecialidades().subscribe({
        next: (especialidades) => {
            this.listaEspecialidades = especialidades;
            console.log('Especialidades carregadas:', this.listaEspecialidades);
        },
        error: (err) => {
            console.error('Erro ao carregar especialidades:', err);
            alert('Não foi possível carregar a lista de especialidades.');
        }
    });
  }

  adicionarHorario(): void {
    this.medico.horarios.push({
      diaSemana: '',
      horaInicio: '',
      horaFim: '',
      marcado: false
    });
  }

  removerHorario(index: number): void {
    this.medico.horarios.splice(index, 1);
  }

  
  onSubmit(): void {
    // AGORA O 'dadosEnvio' É O PRÓPRIO 'this.medico'
    const dadosEnvio = this.medico;

    // --- INÍCIO DA NOVA VALIDAÇÃO ---
    // Vamos verificar cada horário antes de enviar
    for (const horario of dadosEnvio.horarios) {
      if (!horario.horaInicio || !horario.horaFim) {
        // Se algum campo de hora estiver vazio
        alert(`Por favor, preencha a hora de início e fim para o horário de ${horario.diaSemana || 'um dos dias'}.`);
        return; // Para (Stop) a submissão
      }
      
      if (horario.horaFim <= horario.horaInicio) {
        // Se a hora de Fim for menor ou igual à de Início
        // (Ex: Inicio 07:00, Fim 06:00)
        alert(`Erro no horário de ${horario.diaSemana}: A hora de fim (${horario.horaFim}) deve ser *depois* da hora de início (${horario.horaInicio}).`);
        return; // Para (Stop) a submissão
      }
    }
    // --- FIM DA NOVA VALIDAÇÃO ---


    // O service 'atualizarMedico' espera o ID no objeto, o que já está correto
    if (dadosEnvio.id) {
      this.medicoService.atualizarMedico(dadosEnvio).subscribe({
        next: (response) => {
          alert('Médico atualizado com sucesso!');
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar', error);
          alert('Erro ao atualizar médico.');
        }
      });
    } else {
      this.medicoService.salvarMedico(dadosEnvio).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          if (!this.fecharModal.observers || this.fecharModal.observers.length === 0) {
            this.router.navigate(['/medicos/listar']);
          }
        },
        error: (error: any) => {
          console.error('Erro ao cadastrar', error);
          alert('Erro ao cadastrar');
        }
      });
    }
  }
}