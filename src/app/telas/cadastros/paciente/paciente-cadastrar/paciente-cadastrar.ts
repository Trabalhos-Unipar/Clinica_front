import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core'; // 1. Mudei 'OnInit' para 'OnChanges'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 2. Removi o ReactiveFormsModule que não era usado
import { Router } from '@angular/router';

// Service
import { PacienteService } from '../paciente-service';

// --- 3. IMPORTS CORRETOS DO PRIMENG ---
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; // 4. Importei o MessageService

@Component({
  selector: 'app-paciente-cadastrar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Manteve o FormsModule para [(ngModel)]

    // --- 5. LISTA DE IMPORTS CORRETA ---
    FloatLabelModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService], // 6. Adicionei o MessageService aqui
  templateUrl: './paciente-cadastrar.html',
  styleUrls: ['./paciente-cadastrar.css']
})
export class PacienteCadastrar implements OnChanges { // 7. Mudei para OnChanges

    @Input() dependenteEdicao: any;
    @Output() fecharModal = new EventEmitter<void>();
    
    // Suas variáveis (estão corretas)
    id!: string;
    nome!: string;
    dataNascimento: string | Date = ''; // Deixei como string | Date para o p-calendar
    cpf!: string;
    email!: string;
    telefone!: string;

  constructor(
    private readonly pacienteService: PacienteService,
    private router: Router,
    private readonly messageService: MessageService // 8. Injetei o MessageService
  ) {}

  // 9. SUBSTITUI SEU ngOnInit POR ngOnChanges (para corrigir o bug da data)
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dependenteEdicao) {
      // Modo Edição: Carrega os dados
      this.id = this.dependenteEdicao.id;
      this.nome = this.dependenteEdicao.nome;
      this.cpf = this.dependenteEdicao.cpf;
      this.email = this.dependenteEdicao.email;
      this.telefone = this.dependenteEdicao.telefone;
      
      // A CORREÇÃO DA DATA que é necessária para funcionar
      this.dataNascimento = this.formatarDataParaInput(this.dependenteEdicao.dataNascimento);

    }
  }

  // 10. SUBSTITUI SEUS 'alert()' por 'messageService'
  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      nome: this.nome,
      dataNascimento: this.dataNascimento,
      cpf: this.cpf,
      telefone: this.telefone,
      email: this.email
    };

    if (this.id) {
      // Modo Atualizar
      this.pacienteService.atualizarPaciente(dadosEnvio).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente atualizado!' });
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar paciente.' });
        }
      });
    } else {
      // Modo Salvar Novo
      this.pacienteService.salvarPaciente(dadosEnvio).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro realizado!' });
          this.fecharModal.emit();
          
          if (!this.fecharModal || !this.fecharModal.observers || this.fecharModal.observers.length === 0) {
            this.router.navigate(['/pacientes/listar']);
          }
        },
        error: (error) => {
          console.error('Erro ao cadastrar', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar.' });
        }
      });
    }
  }
  
  // 11. ADICIONEI A FUNÇÃO 'onCancelar()' (necessária para o botão)
  onCancelar() {
    this.fecharModal.emit();
  }

  // 12. ADICIONEI A FUNÇÃO HELPER (necessária para a data)
  private formatarDataParaInput(data: any): string {
    if (!data) {
      return '';
    }
    try {
      // Garante que a data esteja no formato "yyyy-MM-dd"
      return new Date(data).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }

  // 13. Removi as variáveis 'date' e 'dates' que não estavam sendo usadas
}