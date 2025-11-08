import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsultaService } from '../consultas-service';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';

interface City {
    name: string,
    code: string
}

@Component({
  selector: 'app-consultas-cadastrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    SelectModule,
    FormsModule,
    AutoCompleteModule,
    FormsModule,
    MultiSelectModule
  ],
  templateUrl: './consultas-cadastrar.html',
  styleUrl: './consultas-cadastrar.css',
})
export class ConsultasCadastrar {

   cities!: City[];

    selectedCities!: City[];
  
    @Input() dependenteEdicao: any;
    @Output() fecharModal = new EventEmitter<void>();
    id?: number;
    status!: string;
    horarioAtendimento?: string;
    paciente?: string;
    medico?: string;

    

  constructor(
    private readonly consultaService: ConsultaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.dependenteEdicao) {
        this.id = this.dependenteEdicao.id;
        this.status = this.dependenteEdicao.status;
        this.horarioAtendimento = this.dependenteEdicao.horarioAtendimento;
        this.paciente = this.dependenteEdicao.paciente;
        this.medico = this.dependenteEdicao.medico;
    }
   

        this.cities = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
    
  }

  onSubmit(): void {
    const dadosEnvio = {
      id: this.id,
      status: this.status,
      horarioAtendimento: this.horarioAtendimento,
      paciente: this.paciente,
      medico: this.medico
    };

    if (this.id) {
      this.consultaService.atualizarConsulta(dadosEnvio).subscribe({
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
      this.consultaService.salvarConsulta(dadosEnvio).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso!', response);
          alert('Cadastro realizado com sucesso!');
          this.fecharModal.emit();
          if (!this.fecharModal || !this.fecharModal.observers || this.fecharModal.observers.length === 0) {
            this.router.navigate(['/consultas/listar']);
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
