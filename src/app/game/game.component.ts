import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import * as Phaser from 'phaser';
import { GameScene } from './game-scene';
import { LocalStorage } from '../services/local-storage.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button (click)="togglePause()">{{ paused ? 'REANUDAR' : 'PAUSAR' }}</ion-button>
        </ion-buttons>
        <ion-title>Neon Survivor</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div id="phaser-container"></div>
    </ion-content>
  `,
  styles: [`
    #phaser-container { 
      width: 100%; height: 600px; background: #000;
      display: flex; justify-content: center; align-items: center;
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  game!: Phaser.Game;
  paused = false;

  constructor(private router: Router, private lsService: LocalStorage) {}

  ngOnInit() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO, // AUTO detecta WebGL o Canvas automáticamente
      parent: 'phaser-container',
      width: 800,
      height: 600,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
      scene: [GameScene]
    };

    this.game = new Phaser.Game(config);

    // Evento de Game Over: Guarda puntuación y navega al ranking
    this.game.events.once('game-over', (score: number) => {
      const name = localStorage.getItem('temp_name') || 'Anon';
      this.lsService.saveScore(name, score);
      this.router.navigateByUrl('/score', { replaceUrl: true });
    });
  }

  // Lógica unificada para Pausar y Reanudar
  togglePause() {
    this.paused = !this.paused;
    const scene = this.game.scene.getScene('GameScene');
    this.paused ? scene.scene.pause() : scene.scene.resume();
  }

  // Limpieza de memoria al salir del componente
  ngOnDestroy() {
    if (this.game) this.game.destroy(true);
  }
}