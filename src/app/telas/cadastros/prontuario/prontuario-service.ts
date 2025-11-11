import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prontuario {
  id?: number;
  motivoConsulta?: string;
  diagnostico?: string;
  receita?: string;
  observacao?: string;
  consulta?: { id: number };
}

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  urlProntuario: string = 'http://localhost:8080/prontuario';

  constructor(private readonly httpProntuario: HttpClient) {}

  // 🔹 Listar todos os prontuários
  listarProntuarios(): Observable<Prontuario[]> {
    return this.httpProntuario.get<Prontuario[]>(`${this.urlProntuario}/listar`);
  }

  // 🔹 Buscar prontuário por ID
  buscarProntuarioPorId(id: number): Observable<Prontuario> {
    return this.httpProntuario.get<Prontuario>(`${this.urlProntuario}/buscar-prontuario/${id}`);
  }

  // 🔹 Buscar prontuário vinculado a uma consulta específica
  buscarPorConsulta(consultaId: number): Observable<Prontuario> {
    return this.httpProntuario.get<Prontuario>(`${this.urlProntuario}/consulta/${consultaId}`);
  }

  // 🔹 Salvar novo prontuário
  salvarProntuario(prontuario: Prontuario): Observable<Prontuario> {
    return this.httpProntuario.post<Prontuario>(`${this.urlProntuario}/salvar-prontuario`, prontuario);
  }

  // 🔹 Atualizar prontuário existente
  atualizarProntuario(prontuario: Prontuario): Observable<Prontuario> {
    return this.httpProntuario.put<Prontuario>(
      `${this.urlProntuario}/atualizar-prontuario/${prontuario.id}`,
      prontuario
    );
  }

  // 🔹 Deletar prontuário
  deletarProntuario(id: number): Observable<void> {
    return this.httpProntuario.delete<void>(`${this.urlProntuario}/deletar-prontuario/${id}`);
  }

}
