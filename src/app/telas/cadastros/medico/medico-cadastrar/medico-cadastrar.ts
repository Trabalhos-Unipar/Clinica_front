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
import { CommonModule } from '@angular/common';
import { MedicoService } from '../medico-service';

@Component({
  selector: 'app-medico-cadastrar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    SelectModule,
    FormsModule,
    AutoCompleteModule
],
  templateUrl: './medico-cadastrar.html',
  styleUrls: ['./medico-cadastrar.css']
})
export class MedicoCadastrar implements OnInit{

    @Input() dependenteEdicao: any;
    @Output() fecharModal = new EventEmitter<void>();
    id!: string;
    nome!: string;
    especialidade!: string;
    crm!: string;
    email!: string;
    telefone!: string;

  constructor(
    private readonly medicoService: MedicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.dependenteEdicao) {
        this.id = this.dependenteEdicao.id;
        this.nome = this.dependenteEdicao.nome;
        this.especialidade = this.dependenteEdicao.especialidade;
        this.crm = this.dependenteEdicao.crm;
        this.email = this.dependenteEdicao.email;
        this.telefone = this.dependenteEdicao.telefone;
    }
  }

  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      nome: this.nome,
      especialidade: this.especialidade,
      crm: this.crm,
      telefone: this.telefone,
      email: this.email
    };

    if (this.id) {
      this.medicoService.atualizarMedico(dadosEnvio).subscribe({
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
      this.medicoService.salvarMedico(dadosEnvio).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          // Only navigate if this component is not being used inside a modal (no listeners)
          if (!this.fecharModal || !this.fecharModal.observers || this.fecharModal.observers.length === 0) {
            this.router.navigate(['/medicos/listar']);
          }
        },
        error: (error: any) => {
          console.error('Erro ao cadastrar', error);
          alert('Erro ao cadastrar');
        }
      });
    }
  }

}