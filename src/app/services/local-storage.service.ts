import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorage {
  // Guarda el puntaje: busca lo que hay, añade el nuevo y ordena de mayor a menor
  saveScore(name: string, score: number) {
    const scores = this.getScores();
    scores.push({ name, score });
    scores.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem('neon_scores', JSON.stringify(scores.slice(0, 10))); // Solo top 10
  }

  getScores() {
    return JSON.parse(localStorage.getItem('neon_scores') || '[]');
  }
}