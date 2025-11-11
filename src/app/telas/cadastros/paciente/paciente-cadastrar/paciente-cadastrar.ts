import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../paciente-service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-paciente-cadastrar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    
  ],
   providers: [
    provideNgxMask(),
    MessageService
  ],
  templateUrl: './paciente-cadastrar.html',
  styleUrls: ['./paciente-cadastrar.css']
})
export class PacienteCadastrar implements OnInit {

  @Input() dependenteEdicao: any;
  @Output() fecharModal = new EventEmitter<void>();

  id!: string;
  nome!: string;
  dataNascimento!: string;
  cpf: string = '';
  email!: string;
  telefone!: string;

  constructor(
    private readonly pacienteService: PacienteService,
    private router: Router,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.dependenteEdicao) {
      this.id = this.dependenteEdicao.id;
      this.nome = this.dependenteEdicao.nome;
      this.dataNascimento = this.dependenteEdicao.dataNascimento;
      this.cpf = this.dependenteEdicao.cpf;
      this.email = this.dependenteEdicao.email;
      this.telefone = this.dependenteEdicao.telefone;
    }
  }

  onSubmit(): void {
    const dataFormatada = this.dataNascimento
  ? this.dataNascimento.replace(/-/g, '/')
  : null;

    const dadosEnvio = {
      id: this.id,
      nome: this.nome,
      dataNascimento: dataFormatada,
      cpf: this.cpf,
      telefone: this.telefone,
      email: this.email
    };

    if (this.id) {
      this.pacienteService.atualizarPaciente(dadosEnvio).subscribe({
        next: () => {
          alert('Paciente atualizado com sucesso!');
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar', error);
          alert('Erro ao atualizar paciente.');
        }
      });
    } else {
      this.pacienteService.salvarPaciente(dadosEnvio).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          if (!this.fecharModal || !this.fecharModal.observers?.length) {
            this.router.navigate(['/pacientes/listar']);
          }
        },
        error: (error) => {
          console.error('Erro ao cadastrar', error);
          alert('Erro ao cadastrar paciente.');
        }
      });
    }
  }
}
