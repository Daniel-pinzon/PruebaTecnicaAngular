import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TablaComponent } from './components/tabla/tabla.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TablaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  nombre = 'pruebaTecnicaAngular';
}
