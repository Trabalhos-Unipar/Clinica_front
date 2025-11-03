import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './components/comp_telas/menu/menu';


@Component({
  selector: 'app-root',
  imports: [Menu, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestao_clinica');
}
