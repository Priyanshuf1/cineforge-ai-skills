const fs = require('fs-extra');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f" />
      <stop offset="50%" stop-color="#12121a" />
      <stop offset="100%" stop-color="#0a0a0f" />
    </linearGradient>

    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="50%" stop-color="#ff0055" />
      <stop offset="100%" stop-color="#b000ff" />
    </linearGradient>

    <!-- Energy Line Animation -->
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,240,255,0)" />
      <stop offset="25%" stop-color="rgba(0,240,255,1)" />
      <stop offset="50%" stop-color="rgba(255,0,85,1)" />
      <stop offset="75%" stop-color="rgba(176,0,255,1)" />
      <stop offset="100%" stop-color="rgba(176,0,255,0)" />
    </linearGradient>

    <style>
      .title {
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 72px;
        font-weight: 900;
        fill: url(#textGrad);
        letter-spacing: -2px;
      }
      .tagline {
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 24px;
        font-weight: 400;
        fill: #8892b0;
        letter-spacing: 1px;
      }
      .line {
        stroke: url(#lineGrad);
        stroke-width: 2;
        stroke-dasharray: 1200;
        stroke-dashoffset: 1200;
        animation: energy 4s linear infinite;
      }
      .line-reverse {
        stroke: url(#lineGrad);
        stroke-width: 1.5;
        stroke-dasharray: 1200;
        stroke-dashoffset: -1200;
        animation: energy-reverse 6s linear infinite;
        opacity: 0.6;
      }
      @keyframes energy {
        to { stroke-dashoffset: -1200; }
      }
      @keyframes energy-reverse {
        to { stroke-dashoffset: 1200; }
      }
      @media (prefers-color-scheme: light) {
        /* Optional light mode overrides if needed, but dark bg looks premium everywhere */
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="400" fill="url(#bg)" rx="16" />

  <!-- Grid / Background Accents -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <path d="M 0 100 L 1200 100 M 0 200 L 1200 200 M 0 300 L 1200 300" />
    <path d="M 200 0 L 200 400 M 400 0 L 400 400 M 600 0 L 600 400 M 800 0 L 800 400 M 1000 0 L 1000 400" />
  </g>

  <!-- Animated Lines -->
  <line x1="0" y1="280" x2="1200" y2="280" class="line" />
  <line x1="0" y1="120" x2="1200" y2="120" class="line-reverse" />
  <line x1="0" y1="200" x2="1200" y2="200" class="line" style="animation-duration: 7s; opacity: 0.3;" />

  <!-- Text -->
  <text x="600" y="210" text-anchor="middle" class="title">Rabto AI Skills</text>
  <text x="600" y="255" text-anchor="middle" class="tagline">Cinematic Web Architecture for Autonomous Agents</text>
  
  <!-- Subtle UI Accents -->
  <circle cx="50" cy="50" r="4" fill="#00f0ff" opacity="0.5" />
  <circle cx="1150" cy="350" r="4" fill="#ff0055" opacity="0.5" />
  <circle cx="1150" cy="50" r="4" fill="#b000ff" opacity="0.5" />
</svg>`;

const outputDir = path.join(process.cwd(), 'assets', 'readme');
fs.ensureDirSync(outputDir);
fs.writeFileSync(path.join(outputDir, 'hero.svg'), svgContent);
console.log('SVG generated at assets/readme/hero.svg');
