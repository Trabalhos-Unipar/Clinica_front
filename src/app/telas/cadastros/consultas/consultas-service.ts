import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  urlConsulta: string = "http://localhost:8080/consulta"

  constructor(private readonly httpConsulta: HttpClient) {}

  listarConsultas() {
     return this.httpConsulta.get<any[]>(`${this.urlConsulta}/listar`);
  }

  salvarConsulta(consulta: any) {
    return this.httpConsulta.post<any>(`${this.urlConsulta}/salvar-consulta`,consulta
    )
  }

  buscarConsultaPorId(id: string) {
    return this.httpConsulta.get<any>(`${this.urlConsulta}/buscarConsulta/${id}`);
  }

  atualizarConsulta(consulta: any) {
    return this.httpConsulta.put<any>(`${this.urlConsulta}/atualizarConsulta/${consulta.id}`, consulta);
  }

  deleteConsulta(id: string) {
    return this.httpConsulta.delete(`${this.urlConsulta}/deletar-consulta/${id}`);
  }

  concluirConsulta(id: number) {
  return this.httpConsulta.patch<any>(`${this.urlConsulta}/concluir/${id}`, {}); 
}
}