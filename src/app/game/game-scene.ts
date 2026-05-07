// Añadir Phaser al proyecto de Ionic + Angular
import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  player!: any; drones!: any; energies!: any;
  score = 0; scoreText!: Phaser.GameObjects.Text;

  constructor() { super('GameScene'); }

  preload() {
    // Añadir todos los sprites/imágenes necesarios para el juego
    this.load.image('hero', 'https://labs.phaser.io/assets/sprites/ship.png'); 
    this.load.image('drone', 'https://labs.phaser.io/assets/sprites/mine.png');
    this.load.image('energy', 'https://labs.phaser.io/assets/sprites/orb-blue.png');
  }

  create() {
    this.score = 0;
    // Configuración Jugador y Grupos
    this.player = this.physics.add.sprite(400, 300, 'hero').setCollideWorldBounds(true);
    this.drones = this.physics.add.group();
    this.energies = this.physics.add.group();

    // Marcador de puntos
    this.scoreText = this.add.text(16, 16, 'PUNTOS: 0', { fontSize: '32px', color: '#0f0', fontFamily: 'Courier New' }).setDepth(100);

    // Generación automática de objetos
    this.time.addEvent({ delay: 1200, callback: this.spawnDrone, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 2500, callback: this.spawnEnergy, callbackScope: this, loop: true });

    // Colisiones y Overlaps
    this.physics.add.overlap(this.player, this.energies, (p, e: any) => {
      e.destroy();
      this.scoreText.setText('PUNTOS: ' + ++this.score);
    });
    this.physics.add.collider(this.player, this.drones, () => this.gameOver());
  }

  update() {
    // Control de movimiento
    const cur = this.input.keyboard!.createCursorKeys();
    if (!this.physics.world.isPaused) {
      this.player.setVelocity(0);
      if (cur.left.isDown) this.player.setVelocityX(-300); else if (cur.right.isDown) this.player.setVelocityX(300);
      if (cur.up.isDown) this.player.setVelocityY(-300); else if (cur.down.isDown) this.player.setVelocityY(300);
    }
  }

  spawnDrone() {
    // Generacion de Drones
    const edge = Phaser.Math.Between(0, 3);
    const pos = [[Phaser.Math.Between(0, 800), -50, 0, 200], [850, Phaser.Math.Between(0, 600), -200, 0], 
                 [Phaser.Math.Between(0, 800), 650, 0, -200], [-50, Phaser.Math.Between(0, 600), 200, 0]];
    const [x, y, vx, vy] = pos[edge];
    this.drones.create(x, y, 'drone').setVelocity(vx, vy);
  }

  // Generacion de energias
  spawnEnergy() {
    this.energies.create(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'energy');
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', color: '#f00' }).setOrigin(0.5);
    
    this.saveData();

    // Reinicio con Tecla R o Clic
    this.add.text(400, 380, 'Haz clic o pulsa R para REINICIAR', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const restart = () => this.scene.restart();
    this.input.keyboard!.once('keydown-R', restart);
    this.input.once('pointerdown', restart);

    // Temporizador de 5 segundos para ir al ranking
    this.time.delayedCall(5000, () => {
      this.game.events.emit('game-over', this.score);
    });
  }

  saveData() {
    const name = localStorage.getItem('temp_name') || 'Anónimo';
    let allScores = JSON.parse(localStorage.getItem('highScores') || '[]');
    
    // Buscar jugador para actualizar su High Score personal
    const pIdx = allScores.findIndex((s: any) => s.name === name);
    if (pIdx > -1) {
      if (this.score > allScores[pIdx].score) allScores[pIdx].score = this.score;
    } else {
      allScores.push({ name, score: this.score, date: new Date().toLocaleDateString() });
    }

    // Guardar Top 5 ordenado
    allScores.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(allScores.slice(0, 5)));
  }
}