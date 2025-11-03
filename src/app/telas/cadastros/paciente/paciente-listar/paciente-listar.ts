import { ChangeDetectorRef, Component } from '@angular/core';
import { PacienteService } from '../paciente-service';
import { CommonModule } from '@angular/common';
import { PacienteCadastrar } from '../paciente-cadastrar/paciente-cadastrar';

@Component({
  selector: 'app-paciente-listar',
  standalone: true,
  imports: [CommonModule, PacienteCadastrar],
  templateUrl: './paciente-listar.html',
  styleUrls: ['./paciente-listar.css'],
})
export class PacienteListar {

   pacientes:any[] = [];
   showCadastrarModal: boolean = false;
   selectedPaciente: any = null;

    visible: boolean = false;
  modalAberto = false;

  dependenteSelecionado: any = null;
  modalEditarAberto = false;
  
  abrirModalEdicao(dependente: any): void{
    this.dependenteSelecionado = {...dependente};
    this.modalEditarAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEditarAberto = false;
    this.dependenteSelecionado = null; 
    this.carregarPacientes();
  }

  constructor(private readonly pacienteService: PacienteService, private readonly detectorMudanca:ChangeDetectorRef){

  }

  ngOnInit():void{
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (response) => {
        this.pacientes = response;
        this.detectorMudanca.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar pacientes:', error);
      }
    });
}

  openCadastrar(paciente?: any) {
    this.selectedPaciente = paciente ?? null;
    this.showCadastrarModal = true;
  }

  closeCadastrarModal() {
    this.showCadastrarModal = false;
    this.selectedPaciente = null;
    this.carregarPacientes();
    };
}

