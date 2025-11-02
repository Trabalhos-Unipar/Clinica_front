import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-consultas',
  imports: [ToolbarModule, Dialog, ButtonModule, InputTextModule],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css',
})
export class Consultas {
visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
