import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../medico-service';
import { MedicoCadastrar } from '../medico-cadastrar/medico-cadastrar';



@Component({
  selector: 'app-medico-listar',
  standalone: true,
  imports: [CommonModule, MedicoCadastrar],
  templateUrl: './medico-listar.html',
  styleUrls: ['./medico-listar.css'],
})
export class MedicoListar {

   medicos:any[] = [];
   showCadastrarModal: boolean = false;
   selectedMedico: any = null;

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
    this.carregarMedicos();
  }

  constructor(private readonly medicoService: MedicoService, private readonly detectorMudanca:ChangeDetectorRef){

  }

  ngOnInit():void{
    this.carregarMedicos();
  }

  carregarMedicos(): void {
    this.medicoService.listarMedico().subscribe({
      next: (response: any) => {
        this.medicos = response;
        this.detectorMudanca.detectChanges();
      },
      error: (error: any) => {
        console.error('Erro ao carregar medicos:', error);
      }
    });
}

  openCadastrar(medico?: any) {
    this.selectedMedico = medico ?? null;
    this.showCadastrarModal = true;
  }

  closeCadastrarModal() {
    this.showCadastrarModal = false;
    this.selectedMedico = null;
    this.carregarMedicos();
    };
}

