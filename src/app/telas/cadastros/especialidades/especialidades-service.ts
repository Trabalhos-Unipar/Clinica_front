import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {

  urlEspecialidade: string = "http://localhost:8080/especialidade"

  constructor(private readonly httpEspecialidade: HttpClient) {}

  listarEspecialidades() {
     return this.httpEspecialidade.get<any[]>(`${this.urlEspecialidade}/listar`);
  }

  salvarEspecialidade(especialidade: any) {
    return this.httpEspecialidade.post<any>(
      `${this.urlEspecialidade}/salvar-especialidade`,
      especialidade
    )
  }

  buscarEspecialidadePorId(id: string) {
    return this.httpEspecialidade.get<any>(`${this.urlEspecialidade}/buscarEspecialidade/${id}`);
  }

  atualizarEspecialidade(especialidade: any) {
    return this.httpEspecialidade.put<any>(`${this.urlEspecialidade}/atualizarEspecialidade/${especialidade.id}`, especialidade);
  }

  deleteEspecialidade(id: string) {
    return this.httpEspecialidade.delete(`${this.urlEspecialidade}/deletar-especialidade/${id}`);
  }
}