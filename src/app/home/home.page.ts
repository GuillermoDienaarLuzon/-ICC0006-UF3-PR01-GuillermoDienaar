import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, FormsModule], // Importaciones mínimas necesarias
  template: `
    <ion-content class="ion-padding ion-text-center" style="--background: #000;">
      <div style="margin-top: 25vh;">
        <h1 style="color: #0f0; font-family: monospace; text-shadow: 0 0 10px #0f0;">
          NEON SURVIVOR
        </h1>

        <ion-item style="--background: #111; --color: #fff; margin: 20px 0;">
          <ion-label position="floating" color="success">Player</ion-label>
          <ion-input [(ngModel)]="playerName" placeholder="Nombre..." (keyup.enter)="play()"></ion-input>
        </ion-item>

        <ion-button expand="block" color="success" (click)="play()">INICIAR</ion-button>
        <ion-button expand="block" fill="clear" color="light" (click)="nav('/score')">RANKING</ion-button>
      </div>
    </ion-content>
  `
})
export class HomePage {
  playerName: string = '';

  constructor(private router: Router) {}

  // Inicia la partida guardando el nombre
  play() {
    const name = this.playerName.trim();
    if (name) {
      localStorage.setItem('temp_name', name);
      this.nav('/game');
    } else {
      alert('Identifícate, Runner');
    }
  }

  // Helper de navegación para reducir código repetido
  nav(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}