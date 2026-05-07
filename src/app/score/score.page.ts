import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorage } from '../services/local-storage.service';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content class="ion-padding ion-text-center" style="--background: #000;">
      
      <div style="margin-top: 10vh;">
        <h1 style="color: #0f0; font-family: monospace; text-shadow: 0 0 10px #0f0; text-transform: uppercase;">
          TOP RUNNERS
        </h1>

        <ion-list style="background: transparent; margin: 30px 0;">
          <ion-item *ngFor="let s of scores" style="--background: #111; --color: #fff; margin-bottom: 5px; border-radius: 8px;">
            <ion-label style="font-family: monospace;">
              <h2 style="color: #fff;">{{ s.name }}</h2>
              <p style="color: #888;">{{ s.date }}</p>
            </ion-label>
            <ion-badge slot="end" style="--background: #0f0; color: #000; font-family: monospace; font-size: 1.1em;">
              {{ s.score }}
            </ion-badge>
          </ion-item>
        </ion-list>

        <ion-button expand="block" color="success" (click)="goHome()" style="margin-top: 20px;">
          MENU PRINCIPAL
        </ion-button>
      </div>

    </ion-content>
  `,
  styles: [`
    /* Eliminamos bordes blancos de los items de la lista */
    ion-item { --border-style: none; }
    ion-list { padding: 0; }
  `]
})
export class ScorePage {
  scores = this.ls.getScores() || [];

  constructor(private ls: LocalStorage, private router: Router) {}

  goHome() {
    // Navegación programática para asegurar que el botón funcione
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}