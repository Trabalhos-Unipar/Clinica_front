import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  urlMedico: string = "http://localhost:8080/medico"

  constructor(private readonly httpMedico: HttpClient) {}

  listarMedico() {
     return this.httpMedico.get<any[]>(`${this.urlMedico}/listar`);
  }

  salvarMedico(cliente: any) {
    return this.httpMedico.post<any>(
      `${this.urlMedico}/salvar-medico`,
      cliente
    )
  }

  buscarMedicoPorId(id: string) {
    return this.httpMedico.get<any>(`${this.urlMedico}/buscarMedico/${id}`);
  }

  atualizarMedico(medico: any) {
    return this.httpMedico.put<any>(`${this.urlMedico}/atualizarMedico/${medico.id}`, medico);
  }

  deleteMedico(id: string) {
    return this.httpMedico.delete(`${this.urlMedico}/deletarMedico/${id}`);
  }
}