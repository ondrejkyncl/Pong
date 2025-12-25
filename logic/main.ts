export {};
const gameCanvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = gameCanvas.getContext('2d')!
ctx.fillStyle = '#ffffff'
ctx.fillRect(415, 300, 15, 15);
ctx.fillRect(50, 250, 10, 100);
ctx.fillRect(790, 250, 10, 100);