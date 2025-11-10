import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsultaService } from '../consultas-service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../paciente/paciente-service';
import { MedicoService } from '../../medico/medico-service'; // ✅ novo serviço

@Component({
  selector: 'app-consultas-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './consultas-cadastrar.html',
  styleUrls: ['./consultas-cadastrar.css'],
})
export class ConsultasCadastrar {
  @Input() dependenteEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  id!: number;
  status?: string;
  horarioAtendimento?: string;
  paciente: any;
  medico: any;

  listaPacientes: any[] = [];
  listaMedicos: any[] = [];

  constructor(
    private readonly consultaService: ConsultaService,
    private readonly pacienteService: PacienteService,
    private readonly medicoService: MedicoService, // ✅ injetado aqui
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.dependenteEdicao) {
      this.id = this.dependenteEdicao.id;
      this.status = this.dependenteEdicao.status;
      this.horarioAtendimento = this.dependenteEdicao.horarioAtendimento;
      this.paciente = this.dependenteEdicao.paciente;
      this.medico = this.dependenteEdicao.medico;
    }

    this.carregarPacientes();
    this.carregarMedicos();
  }

  carregarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (pacientes: any[]) => {
        this.listaPacientes = pacientes;
      },
      error: (err) => {
        console.error('Erro ao carregar lista de pacientes:', err);
      },
    });
  }

  carregarMedicos(): void {
    this.medicoService.listarMedico().subscribe({
      next: (medicos: any[]) => {
        this.listaMedicos = medicos;
      },
      error: (err) => {
        console.error('Erro ao carregar lista de médicos:', err);
      },
    });
  }

  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      status: this.status,
      horarioAtendimento: this.horarioAtendimento,
      paciente: this.paciente,
      medico: this.medico,
    };

    if (this.id) {
      this.consultaService.atualizarConsulta(dadosEnvio).subscribe({
        next: () => {
          alert('Consulta atualizada com sucesso!');
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar consulta:', error);
          alert('Erro ao atualizar consulta.');
        },
      });
    } else {
      this.consultaService.salvarConsulta(dadosEnvio).subscribe({
        next: () => {
          alert('Consulta cadastrada com sucesso!');
          this.fecharModal.emit();
          if (!this.fecharModal?.observers?.length) {
            this.router.navigate(['/consultas/listar']);
          }
        },
        error: (error) => {
          console.error('Erro ao cadastrar consulta:', error);
          alert('Erro ao cadastrar consulta.');
        },
      });
    }
  }
}
