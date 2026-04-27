const canvas = document.getElementById('experimentCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const instructionPanel = document.getElementById('instructions');
const resultsModal = document.getElementById('results-modal');

// Metrics DOM
const timeVal = document.getElementById('time-val');
const fittsVal = document.getElementById('fitts-val');
const resMT = document.getElementById('res-mt');
const resID = document.getElementById('res-id');

// Configuration
const CONFIG = {
    ghostCount: 5,
    targetSize: 40,
    ghostSize: 60,
    shakingIntensity: 4,
    ghostSpeed: 2
};

// Assets
const assets = {
    background: new Image(),
    player: new Image(),
    ghost: new Image()
};

assets.background.src = 'assets/background.png';
assets.player.src = 'assets/player.png';
assets.ghost.src = 'assets/ghost.png';

class Experiment {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.target = { x: 0, y: 0 };
        this.player = { x: 50, y: 0 };
        this.ghosts = [];
        this.shakeOffset = { x: 0, y: 0 };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        startBtn.addEventListener('click', () => this.start());
        retryBtn.addEventListener('click', () => this.reset());
    }

    resize() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        this.player.y = canvas.height - 100;
        this.resetTargets();
    }

    resetTargets() {
        // Target in upper right area
        this.target.x = canvas.width * 0.7 + Math.random() * (canvas.width * 0.2);
        this.target.y = canvas.height * 0.2 + Math.random() * (canvas.height * 0.3);

        // Reset Ghosts
        this.ghosts = [];
        for (let i = 0; i < CONFIG.ghostCount; i++) {
            this.ghosts.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.ghostSpeed,
                vy: (Math.random() - 0.5) * CONFIG.ghostSpeed,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    start() {
        this.isRunning = true;
        this.startTime = performance.now();
        instructionPanel.classList.add('hidden');
        this.loop();
    }

    reset() {
        resultsModal.classList.add('hidden');
        instructionPanel.classList.remove('hidden');
        this.isRunning = false;
        this.resetTargets();
        this.drawInitialState();
    }

    handleCanvasClick(e) {
        if (!this.isRunning) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if Clicked Target
        const dist = Math.sqrt((x - this.target.x)**2 + (y - this.target.y)**2);
        if (dist < CONFIG.targetSize) {
            this.complete();
        }
    }

    complete() {
        this.isRunning = false;
        const mt = performance.now() - this.startTime;
        
        // Calculate Fitts's Law Index of Difficulty (Shannon)
        const dx = this.target.x - this.player.x;
        const dy = this.target.y - this.player.y;
        const D = Math.sqrt(dx*dx + dy*dy);
        const W = CONFIG.targetSize;
        const ID = Math.log2(D / W + 1);

        resMT.textContent = `${Math.round(mt)}ms`;
        resID.textContent = ID.toFixed(2);
        resultsModal.classList.remove('hidden');
    }

    update() {
        if (!this.isRunning) return;

        // Shaking effect (Perception)
        this.shakeOffset.x = (Math.random() - 0.5) * CONFIG.shakingIntensity;
        this.shakeOffset.y = (Math.random() - 0.5) * CONFIG.shakingIntensity;

        // Move Ghosts (Distractors)
        this.ghosts.forEach(g => {
            g.x += g.vx;
            g.y += g.vy + Math.sin(Date.now() * 0.002 + g.phase) * 0.5;

            if (g.x < 0 || g.x > canvas.width) g.vx *= -1;
            if (g.y < 0 || g.y > canvas.height) g.vy *= -1;
        });

        // Update Timer HUD
        const elapsed = (performance.now() - this.startTime) / 1000;
        timeVal.textContent = `${elapsed.toFixed(2)}s`;
        
        const dx = this.target.x - this.player.x;
        const dy = this.target.y - this.player.y;
        const D = Math.sqrt(dx*dx + dy*dy);
        fittsVal.textContent = Math.log2(D / CONFIG.targetSize + 1).toFixed(2);
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Background
        if (assets.background.complete) {
            ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
        }

        // 2. Draw Decision Path (Decision)
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.player.x + 25, this.player.y + 25);
        ctx.lineTo(this.target.x, this.target.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Draw Player
        if (assets.player.complete) {
            ctx.drawImage(assets.player, this.player.x, this.player.y, 60, 60);
        }

        // 4. Draw Distractors (Ghosts)
        if (assets.ghost.complete) {
            this.ghosts.forEach(g => {
                ctx.drawImage(assets.ghost, g.x - 30, g.y - 30, CONFIG.ghostSize, CONFIG.ghostSize);
            });
        }

        // 5. Draw Target (Perception - Shaking Green)
        ctx.fillStyle = '#4ade80';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#4ade80';
        ctx.fillRect(
            this.target.x - CONFIG.targetSize / 2 + this.shakeOffset.x,
            this.target.y - CONFIG.targetSize / 2 + this.shakeOffset.y,
            CONFIG.targetSize,
            CONFIG.targetSize
        );
        ctx.shadowBlur = 0;
    }

    loop() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    drawInitialState() {
        // Just draw once before game starts
        this.draw();
    }
}

// Wait for assets then init
window.onload = () => {
    const experiment = new Experiment();
    experiment.drawInitialState();
};
