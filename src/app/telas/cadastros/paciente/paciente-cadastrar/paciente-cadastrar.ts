import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from "primeng/card";
import { FloatLabel } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from "primeng/button";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { PacienteService } from '../paciente-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-cadastrar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    SelectModule,
    FormsModule,
    AutoCompleteModule
],
  templateUrl: './paciente-cadastrar.html',
  styleUrls: ['./paciente-cadastrar.css']
})
export class PacienteCadastrar implements OnInit{

    @Input() dependenteEdicao: any;
    @Output() fecharModal = new EventEmitter<void>();
    id!: string;
    nome!: string;
    dataNascimento!: string;
    cpf!: string;
    email!: string;
    telefone!: string;

  constructor(
    private readonly pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.dependenteEdicao) {
        this.id = this.dependenteEdicao.id;
        this.nome = this.dependenteEdicao.nome;
        this.dataNascimento = this.dependenteEdicao.data_nascimento;
        this.cpf = this.dependenteEdicao.cpf;
        this.email = this.dependenteEdicao.email;
        this.telefone = this.dependenteEdicao.telefone;
    }
  }

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
      this.pacienteService.atualizarPaciente(dadosEnvio).subscribe({
        next: (response) => {
          alert('Dependente atualizado com sucesso!');
          this.fecharModal.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar', error);
          alert('Erro ao atualizar dependente.');
        }
      });
    } else {
      this.pacienteService.salvarPaciente(dadosEnvio).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          // Only navigate if this component is not being used inside a modal (no listeners)
          if (!this.fecharModal || !this.fecharModal.observers || this.fecharModal.observers.length === 0) {
            this.router.navigate(['/pacientes/listar']);
          }
        },
        error: (error) => {
          console.error('Erro ao cadastrar', error);
          alert('Erro ao cadastrar');
        }
      });
    }
  }

}