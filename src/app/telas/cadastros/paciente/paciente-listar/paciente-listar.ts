import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { PacienteService } from '../paciente-service';
import { CommonModule } from '@angular/common';
import { PacienteCadastrar } from '../paciente-cadastrar/paciente-cadastrar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-paciente-listar',
  standalone: true,
  imports: [
    CommonModule,
    PacienteCadastrar,
    TableModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './paciente-listar.html',
  styleUrls: ['./paciente-listar.css'],
})
export class PacienteListar {

   pacientes:any[] = [];
   showCadastrarModal: boolean = false;
   selectedPaciente: any = null;

  // UI state for search/pagination
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 10;
  // expose global Math to template (used for Math.min)
  readonly Math = Math;
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

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly detectorMudanca: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit():void{
    this.carregarPacientes();
    // attempt to detect sidebar width and set CSS variable so the pacient list centers correctly
    try {
      const sidebarEl = document.querySelector('app-slidebar') as HTMLElement | null;
      const width = sidebarEl ? Math.round(sidebarEl.getBoundingClientRect().width) : 280;
      document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
    } catch (e) {
      // ignore - if DOM not ready or access blocked, CSS fallback variable will be used
      console.warn('Não foi possível detectar largura da sidebar automaticamente', e);
    }
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



  deletePaciente(paciente: any) {
    if (!paciente || !paciente.id) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Paciente inválido' 
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o paciente ${paciente.nome}?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.pacienteService.deletePaciente(paciente.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: `Paciente ${paciente.nome} removido com sucesso!`,
              life: 3000
            });
            this.carregarPacientes();
          },
          error: (erro) => {
            console.error('Erro ao deletar:', erro);
            console.log('URL da requisição:', `${this.pacienteService.urlPaciente}/excluir/${paciente.id}`);
            console.log('Status do erro:', erro.status);
            console.log('Mensagem do erro:', erro.error);
            
            let mensagem = 'Erro ao remover paciente. Tente novamente.';
            
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

  // close on escape
  @HostListener('window:keydown.escape')
  onEsc() {
    if (this.showCadastrarModal) this.closeCadastrarModal();
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

