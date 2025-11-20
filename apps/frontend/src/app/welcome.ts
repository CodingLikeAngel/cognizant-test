import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Particle {
  id: number;
  x: number;
  hue: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="welcome-2049">
      <div class="grid-infinite"></div>
      <div class="holo-orb orb-1"></div>
      <div class="holo-orb orb-2"></div>
      <div class="holo-orb orb-3"></div>
      <div class="particles-container">
        @for (p of particles; track p.id) {
          <div class="particle"
               [style.left.%]="p.x"
               [style.--hue]="p.hue"
               [style.animation-delay.s]="p.delay"
               [style.animation-duration.s]="p.duration">
            <div class="glow"></div>
          </div>
        }
      </div>
      <div class="welcome-content">
        <h1 class="main-title">
          <span class="line top">¡BIENVENID@!</span>
          <span class="line mid">AL PORTAL</span>
          <span class="line bottom">DE CANDIDATOS</span>
        </h1>
        <p class="subtitle">de Ángel</p>
        <button routerLink="/candidates" class="btn-enter">
          <span class="btn-text">ACCEDER AL PORTAL</span>
          <span class="btn-glow"></span>
        </button>
        <div class="icon-orbit">
          <mat-icon>hub</mat-icon>
          <mat-icon>neurology</mat-icon>
          <mat-icon>bolt</mat-icon>
          <mat-icon>diamond</mat-icon>
          <mat-icon>psychology_alt</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@500;700&family=Rajdhani:wght@600;700&display=swap');
      :host, html, body { height: 100%; margin: 0; padding: 0; overflow: hidden !important; }
      .welcome-2049 { position: fixed; inset: 0; background: radial-gradient(circle at 20% 80%, #1a0055 0%, #000 70%); font-family: 'Exo 2', sans-serif; color: #e0f8ff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
      .grid-infinite { position: absolute; inset: 0; background: linear-gradient(rgba(0,240,255,.06)1px,transparent 1px), linear-gradient(90deg,rgba(0,240,255,.06)1px,transparent 1px); background-size: 70px 70px; transform: rotateX(68deg) translateZ(-600px) scale(1.8); animation: gridFlow 40s linear infinite; pointer-events: none; }
      .holo-orb { position: absolute; border-radius: 50%; filter: blur(110px); opacity: 0.45; pointer-events: none; contain: strict; }
      .orb-1 { width: 900px; height: 900px; background: radial-gradient(circle,#ff00aa44,transparent 70%); top: -30%; left: -25%; }
      .orb-2 { width: 800px; height: 800px; background: radial-gradient(circle,#00f0ff44,transparent 70%); bottom: -25%; right: -20%; }
      .orb-3 { width: 700px; height: 700px; background: radial-gradient(circle,#ccff0044,transparent 70%); top: 10%; left: 60%; }
      .particles-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
      .particle { position: absolute; width: 6px; height: 6px; background: hsl(var(--hue),90%,70%); border-radius: 50%; box-shadow: 0 0 30px hsl(var(--hue),90%,70%); animation: riseUp var(--duration,20s) linear infinite; contain: layout; }
      .particle .glow { position: absolute; inset: -20px; background: inherit; border-radius: 50%; filter: blur(18px); opacity: 0.7; }
      .welcome-content { position: relative; z-index: 10; text-align: center; padding: 2rem; max-width: 95vw; width: 100%; box-sizing: border-box; }
      .main-title { font-family: 'Orbitron', sans-serif; font-size: clamp(3.5rem, 10vw, 8rem); font-weight: 900; line-height: 1.05; margin: 0 0 1.5rem; }
      .line { display: block; }
      .top { color: #00f0ff; text-shadow: 0 0 30px #00f0ff, 0 0 60px #00f0ff; animation: pulse 4s ease-in-out infinite alternate; }
      .mid { color: #ffffff; font-size: 0.85em; letter-spacing: 8px; margin: 0.4rem 0; }
      .bottom { background: linear-gradient(90deg, #00f0ff, #ccff00, #ff00aa); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 1.1em; text-shadow: 0 0 40px rgba(0,240,255,0.6); }
      .subtitle { font-family: 'Rajdhani', sans-serif; font-size: clamp(1.2rem, 2.8vw, 1.8rem); letter-spacing: 8px; color: #ccff00; margin: 0 0 3rem; }
      .btn-enter { position: relative; padding: 1.4rem 4.5rem; font-family: 'Orbitron', sans-serif; font-size: clamp(1.6rem, 4vw, 2.6rem); font-weight: 700; color: #000; background: linear-gradient(45deg, #00f0ff, #ccff00); border: none; border-radius: 60px; cursor: pointer; overflow: hidden; box-shadow: 0 15px 40px rgba(0,240,255,0.4); transition: all 0.4s ease; }
      .btn-enter:hover { transform: translateY(-10px) scale(1.06); box-shadow: 0 30px 80px rgba(0,240,255,0.7); }
      .btn-glow { position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%); transform: translateX(-150%); animation: shine 3s infinite; }
      .icon-orbit { margin-top: 3rem; display: flex; justify-content: center; gap: 2rem; font-size: clamp(3rem, 7vw, 4.5rem); filter: drop-shadow(0 0 20px #00f0ff); }
      .icon-orbit mat-icon { animation: float 8s ease-in-out infinite; }
      .icon-orbit mat-icon:nth-child(1) { animation-delay: 0s; }
      .icon-orbit mat-icon:nth-child(2) { animation-delay: -1s; }
      .icon-orbit mat-icon:nth-child(3) { animation-delay: -2s; }
      .icon-orbit mat-icon:nth-child(4) { animation-delay: -3s; }
      .icon-orbit mat-icon:nth-child(5) { animation-delay: -4s; }
      @keyframes gridFlow { 0% { background-position: 0 0; } 100% { background-position: 70px 70px; } }
      @keyframes riseUp { 0% { transform: translateY(110vh); opacity: 0; } 10%,90% { opacity: 1; } 100% { transform: translateY(-20vh); opacity: 0; } }
      @keyframes pulse { from { text-shadow: 0 0 30px #00f0ff, 0 0 60px #00f0ff; } to { text-shadow: 0 0 40px #00f0ff, 0 0 80px #00f0ff; } }
      @keyframes shine { 0%,100% { transform: translateX(-150%); } 50% { transform: translateX(150%); } }
      @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }
    `
  ]
})
export class NxWelcomeComponent implements AfterViewInit {
  particles: Particle[] = [];

  constructor() {
    for (let i = 0; i < 55; i++) {
      this.particles.push({ id: i, x: Math.random() * 100, hue: Math.floor(Math.random() * 360), delay: Math.random() * 10, duration: 18 + Math.random() * 12 });
    }
  }

  ngAfterViewInit() {}
}