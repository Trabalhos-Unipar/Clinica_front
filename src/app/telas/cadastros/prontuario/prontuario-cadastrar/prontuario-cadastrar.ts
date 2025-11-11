import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProntuarioService, Prontuario } from '../prontuario-service';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-prontuario-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './prontuario-cadastrar.html',
  styleUrls: ['./prontuario-cadastrar.css']
})
export class ProntuarioCadastrar implements OnInit {
  @Input() consulta: any | null = null;
  @Output() fecharModal = new EventEmitter<void>();
  @Input() modoInicialVisualizacao: boolean = false;

  prontuario: Prontuario = { consulta: undefined };
  loading = false;
  modoVisualizacao = false;

  constructor(
    private prontuarioService: ProntuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    if (this.consulta?.id) {
      this.carregarProntuario();
    }

    if (this.modoInicialVisualizacao) {
      this.modoVisualizacao = true;
  }
  }

  carregarProntuario(): void {
    this.prontuarioService.buscarPorConsulta(this.consulta!.id).subscribe({
      next: (p) => {
        if (p && p.id) {
          this.prontuario = p;
          this.modoVisualizacao = true;
        } else {
          this.modoVisualizacao = false;
          this.prontuario = { consulta: { id: this.consulta!.id } };
        }
      },
      error: (err) => {
        console.warn('Erro ao buscar prontuário:', err);
        this.modoVisualizacao = false;
        this.prontuario = { consulta: { id: this.consulta!.id } };
      }
    });
  }

  salvar(): void {
    if (!this.consulta?.id) {
      this.messageService.add({ severity: 'error', detail: 'Consulta inválida.' });
      return;
    }

    this.loading = true;
    this.prontuario.consulta = { id: this.consulta.id };

    const request$ = this.prontuario.id
      ? this.prontuarioService.atualizarProntuario(this.prontuario)
      : this.prontuarioService.salvarProntuario(this.prontuario);

    request$.subscribe({
      next: (resp) => {
        this.loading = false;
        this.prontuario = resp;
        this.modoVisualizacao = true;
        this.messageService.add({
          severity: 'success',
          detail: this.prontuario.id
            ? 'Prontuário salvo com sucesso.'
            : 'Prontuário criado com sucesso.'
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar prontuário:', err);
        this.messageService.add({
          severity: 'error',
          detail: 'Erro ao salvar prontuário.'
        });
      }
    });
  }

  editar(): void {
    this.modoVisualizacao = false;
  }

  excluir(): void {
    if (!this.prontuario.id) return;

    this.confirmationService.confirm({
      message: 'Deseja realmente excluir este prontuário?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.prontuarioService.deletarProntuario(this.prontuario.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              detail: 'Prontuário excluído com sucesso.'
            });
            // volta para o formulário limpo
            this.prontuario = { consulta: { id: this.consulta?.id } };
            this.modoVisualizacao = false;
          },
          error: (err) => {
            console.error('Erro ao excluir prontuário:', err);
            this.messageService.add({
              severity: 'error',
              detail: 'Erro ao excluir prontuário.'
            });
          }
        });
      }
    });
  }

  cancelar(): void {
    this.fecharModal.emit();
  }
}
