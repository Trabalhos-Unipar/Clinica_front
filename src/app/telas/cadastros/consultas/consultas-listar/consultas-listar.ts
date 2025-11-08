import { ChangeDetectorRef, Component } from '@angular/core';
import { ConsultaService } from '../consultas-service';
import { ConsultasCadastrar } from '../consultas-cadastrar/consultas-cadastrar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-consultas-listar',
  imports: [
    CommonModule,
    ConsultasCadastrar,
    TableModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './consultas-listar.html',
  styleUrl: './consultas-listar.css',
})
export class ConsultasListar {
 
  consultas:any[] = [];
   showCadastrarModal: boolean = false;
   selectedConsulta: any = null;

   constructor(
    private readonly consultaService: ConsultaService,
    private readonly detectorMudanca: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService    
  ) {}

   carregarConsultas(): void {
    this.consultaService.listarConsultas().subscribe({
      next: (response) => {
        this.consultas = response;
        this.detectorMudanca.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar consultas:', error);
      }
    });
}

deleteConsulta(consulta: any) {
    if (!consulta || !consulta.id) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Consulta inválido' 
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o consulta ${consulta.nome}?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.consultaService.deleteConsulta(consulta.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: `Consulta ${consulta.nome} removido com sucesso!`,
              life: 3000
            });
            this.carregarConsultas();
          },
          error: (erro) => {
            console.error('Erro ao deletar:', erro);
            console.log('URL da requisição:', `${this.consultaService.urlConsulta}/excluir/${consulta.id}`);
            console.log('Status do erro:', erro.status);
            console.log('Mensagem do erro:', erro.error);
            
            let mensagem = 'Erro ao remover consulta. Tente novamente.';
            
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

openCadastrar(consultas?: any) {
    this.selectedConsulta = consultas ?? null;
    this.showCadastrarModal = true;
  }

   closeCadastrarModal() {
    this.showCadastrarModal = false;
    this.selectedConsulta = null;
    this.carregarConsultas();
    };

}
