import { Component } from '@angular/core';
import { DrawerHeadlessDemo } from '../headless/headless';
import { ToolbarModule } from 'primeng/toolbar';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-menu',
  imports: [DrawerHeadlessDemo, ToolbarModule, Dialog, ButtonModule, InputTextModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

   visible: boolean = false;

    showDialog() {
        this.visible = true;
    }

}
