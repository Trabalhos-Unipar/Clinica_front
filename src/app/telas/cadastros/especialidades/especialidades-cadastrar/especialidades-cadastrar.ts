import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EspecialidadeService } from '../especialidades-service';

@Component({
  selector: 'app-especialidades-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades-cadastrar.html',
  styleUrls: ['./especialidades-cadastrar.css'],
})
export class EspecialidadesCadastrar implements OnInit {

  @Input() especialidade: any;
  @Output() fecharModal = new EventEmitter<void>();

  id!: string;
  nome!: string;

  constructor(
    private readonly especialidadeService: EspecialidadeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.especialidade) {
      this.id = this.especialidade.id;
      this.nome = this.especialidade.nome;
    }
  }

  onSubmit(): void {
    const dadosEnvio = { id: this.id, nome: this.nome };

    if (this.id) {
      this.especialidadeService.atualizarEspecialidade(dadosEnvio).subscribe({
        next: () => {
          alert('Especialidade atualizada com sucesso!');
          this.fecharModal.emit();
        },
        error: (err) => {
          console.error('Erro ao atualizar especialidade', err);
          alert('Erro ao atualizar especialidade');
        }
      });
    } else {
      this.especialidadeService.salvarEspecialidade(dadosEnvio).subscribe({
        next: () => {
          alert('Especialidade cadastrada com sucesso!');
          this.fecharModal.emit();
          if (!this.fecharModal || !this.fecharModal.observers || this.fecharModal.observers.length === 0) {
            this.router.navigate(['/especialidades/listar']);
          }
        },
        error: (err) => {
          console.error('Erro ao cadastrar especialidade', err);
          alert('Erro ao cadastrar especialidade');
        }
      });
    }
  }

}
