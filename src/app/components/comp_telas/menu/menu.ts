import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Slidebar } from '../slidebar/slidebar';


@Component({
  selector: 'app-menu',
  imports: [RouterOutlet, Slidebar],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

   
}
