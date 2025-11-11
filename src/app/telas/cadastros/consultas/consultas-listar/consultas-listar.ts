import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ConsultaService } from '../consultas-service';
import { ConsultasCadastrar } from '../consultas-cadastrar/consultas-cadastrar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProntuarioCadastrar } from '../../prontuario/prontuario-cadastrar/prontuario-cadastrar';
import { ProntuarioService } from '../../prontuario/prontuario-service';

@Component({
  selector: 'app-consultas-listar',
  standalone: true,
  imports: [
    CommonModule,
    ConsultasCadastrar,
    TableModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    ProntuarioCadastrar
  ],
  providers: [MessageService, ConfirmationService, ProntuarioService],
  templateUrl: './consultas-listar.html',
  styleUrls: ['./consultas-listar.css']
})
export class ConsultasListar {

  consultas: any[] = [];
  showCadastrarModal = false;
  selectedConsulta: any = null;

  dependenteSelecionado: any = null;
  modalEditarAberto = false;

  showProntuarioModal = false;
  selectedConsultaForProntuario: any = null;
  prontuarioSelecionado: any = null;
  modoVisualizacaoProntuario = false;

  constructor(
    private readonly consultaService: ConsultaService,
    private readonly prontuarioService: ProntuarioService,
    private readonly detectorMudanca: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.carregarConsultas();

    // tentativa de detectar largura da sidebar (opcional)
    try {
      const sidebarEl = document.querySelector('app-slidebar') as HTMLElement | null;
      const width = sidebarEl ? Math.round(sidebarEl.getBoundingClientRect().width) : 280;
      document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
    } catch (e) {
      console.warn('Não foi possível detectar largura da sidebar automaticamente', e);
    }
  }

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

  abrirModalEdicao(dependente: any): void {
    this.dependenteSelecionado = { ...dependente };
    this.modalEditarAberto = true;
  }

  fecharModalEdicao(): void {
    this.modalEditarAberto = false;
    this.dependenteSelecionado = null;
    this.carregarConsultas();
  }

  // ✅ NOVA FUNÇÃO UNIFICADA: abrir prontuário (visualizar ou cadastrar)
  openProntuario(consulta: any) {
    if (!consulta?.id) return;

    this.prontuarioService.buscarPorConsulta(consulta.id).subscribe({
      next: (prontuario) => {
        if (prontuario && prontuario.id) {
          // existe prontuário -> exibe em modo de visualização
          this.prontuarioSelecionado = prontuario;
          this.selectedConsultaForProntuario = consulta;
          this.modoVisualizacaoProntuario = true;
          this.showProntuarioModal = true;
        } else {
          // não existe prontuário -> abre tela de cadastro
          this.selectedConsultaForProntuario = consulta;
          this.prontuarioSelecionado = null;
          this.modoVisualizacaoProntuario = false;
          this.showProntuarioModal = true;
        }
      },
      error: () => {
        // erro = trata como sem prontuário
        this.selectedConsultaForProntuario = consulta;
        this.prontuarioSelecionado = null;
        this.modoVisualizacaoProntuario = false;
        this.showProntuarioModal = true;
      }
    });
  }

  // fechar modal do prontuário
  closeProntuarioModal() {
    this.showProntuarioModal = false;
    this.selectedConsultaForProntuario = null;
    this.prontuarioSelecionado = null;
    this.modoVisualizacaoProntuario = false;
    this.carregarConsultas();
  }

  deleteConsulta(consulta: any) {
    if (!consulta || !consulta.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Consulta inválida'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover a consulta do paciente ${consulta.paciente?.nome}?`,
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
              detail: `Consulta do paciente ${consulta.paciente?.nome} removida com sucesso!`,
              life: 3000
            });
            this.carregarConsultas();
          },
          error: (erro) => {
            console.error('Erro ao deletar:', erro);
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

  @HostListener('window:keydown.escape')
  onEsc() {
    if (this.showCadastrarModal) this.closeCadastrarModal();
  }

  openCadastrar(consultas?: any) {
    this.selectedConsulta = consultas ?? null;
    this.showCadastrarModal = true;
  }

  closeCadastrarModal() {
    this.showCadastrarModal = false;
    this.selectedConsulta = null;
    this.carregarConsultas();
  }

    concluirConsulta(consulta: any): void {
  if (!consulta?.id) return;

  this.confirmationService.confirm({
    message: 'Deseja marcar esta consulta como concluída?',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    acceptButtonStyleClass: 'p-button-success',
    accept: () => {
      this.consultaService.concluirConsulta(consulta.id).subscribe({
        next: (resp) => {
          consulta.status = resp.status;
          this.messageService.add({
            severity: 'success',
            summary: 'Consulta concluída',
            detail: 'O status foi atualizado para Concluído.'
          });
        },
        error: (err) => {
          console.error('Erro ao concluir consulta:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível concluir a consulta.'
          });
        }
      });
    }
  });
}
}
