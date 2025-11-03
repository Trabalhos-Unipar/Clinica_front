import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  urlPaciente: string = "http://localhost:8080/paciente"

  constructor(private readonly httpPaciente: HttpClient) {}

  listarPacientes() {
     return this.httpPaciente.get<any[]>(`${this.urlPaciente}/listar`);
  }

  salvarPaciente(cliente: any) {
    return this.httpPaciente.post<any>(
      `${this.urlPaciente}/salvar-paciente`,
      cliente
    )
  }

  buscarPacientePorId(id: string) {
    return this.httpPaciente.get<any>(`${this.urlPaciente}/buscarPaciente/${id}`);
  }

  atualizarPaciente(cliente: any) {
    return this.httpPaciente.put<any>(`${this.urlPaciente}/atualizarPaciente/${cliente.id}`, cliente);
  }

  deletePaciente(id: string) {
    return this.httpPaciente.delete(`${this.urlPaciente}/deletarPaciente/${id}`);
  }
}