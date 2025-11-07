import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../medico-service';
import { MedicoCadastrar } from '../medico-cadastrar/medico-cadastrar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';




@Component({
  selector: 'app-medico-listar',
  standalone: true,
  imports: [ 
    CommonModule,
    MedicoCadastrar,
    TableModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
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

  constructor(private readonly medicoService: MedicoService, private readonly detectorMudanca:ChangeDetectorRef, private readonly messageService: MessageService, private readonly confirmationService: ConfirmationService){

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

      deleteMedico(medico: any) {
    if (!medico || !medico.id) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Medico inválido' 
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o medico ${medico.nome}?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.medicoService.deleteMedico(medico.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: `Medico ${medico.nome} removido com sucesso!`,
              life: 3000
            });
            this.carregarMedicos();
          },
          error: (erro) => {
            console.error('Erro ao deletar:', erro);
            console.log('URL da requisição:', `${this.medicoService.urlMedico}/excluir/${medico.id}`);
            console.log('Status do erro:', erro.status);
            console.log('Mensagem do erro:', erro.error);
            
            let mensagem = 'Erro ao remover medico. Tente novamente.';
            
            if (erro.status === 404) {
              mensagem = 'Endpoint não encontrado. Verifique a URL da API.';
            } else if (erro.status === 400) {
              mensagem = erro.error?.message || 'Requisição inválida.';
            } else if (erro.status === 500) {
              mensagem = 'Erro no servidor. Tente novamente mais tarde.';
            }
            
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: `${mensagem} (Status: ${erro.status})`,
              life: 5000
            });
          }
        });
      }
    });
  }

}

