import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { GameComponent } from './game/game.component';
import { ScorePage } from './score/score.page';

export const routes: Routes = [
  // Home
  { path: '', component: HomePage }, 
  
  // El juego se carga cuando pulsas el botón "EMPEZAR"
  { path: 'game', component: GameComponent },
  
  // La pantalla de puntuaciones
  { path: 'score', component: ScorePage },
  
  // Si escriben cualquier otra cosa, al Home
  { path: '**', redirectTo: '' }
];


