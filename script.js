/* ==========================================
   Bio by JLV — Script Principal
   ==========================================
   1. Initialisation globale
   2. Navigation & Header
   3. Particules Hero (Canvas 2D)
   4. Schéma ADN CSS
   5. Module 3D ADN (Three.js)
   6. Module 3D Bactéries (Three.js)
   7. Utilitaires
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // AOS
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  initNavigation();
  initHeroParticles();
  initDNASchema();
  initDNA3D();
  initBacteria3D();
});


/* ==========================================
   2. Navigation & Header
   ========================================== */

function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('a');

  // Scroll → header style
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);
    lastScroll = y;

    // Active link highlight
    const sections = document.querySelectorAll('.section, .hero');
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 200) {
        current = s.id;
      }
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // Mobile menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}


/* ==========================================
   3. Particules Hero (Canvas 2D)
   ========================================== */

function initHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  mouse = { x: w / 2, y: h / 2 };

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (w || 1200);
      this.y = Math.random() * (h || 800);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((w * h) / 8000), 150);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse connection
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 * (1 - dist / 200)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  animate();
}


/* ==========================================
   4. Schéma ADN CSS (section éducative)
   ========================================== */

function initDNASchema() {
  const container = document.getElementById('dnaSchema');
  if (!container) return;

  const pairs = [
    ['A', 'T'], ['C', 'G'], ['T', 'A'], ['G', 'C'],
    ['A', 'T'], ['G', 'C'], ['C', 'G'], ['T', 'A'],
    ['A', 'T'], ['G', 'C'],
  ];

  const colors = { A: '#00e5ff', T: '#ff2d78', C: '#ffb800', G: '#00ff88' };

  pairs.forEach(([left, right], i) => {
    const row = document.createElement('div');
    row.className = 'dna-pair';
    row.style.setProperty('--delay', `${2 + i * 0.3}s`);
    row.style.animationDelay = `${i * 0.15}s`;

    row.innerHTML = `
      <div class="dna-node" style="background:${colors[left]}">${left}</div>
      <div class="dna-bridge"></div>
      <div class="dna-node" style="background:${colors[right]}">${right}</div>
    `;
    container.appendChild(row);
  });
}


/* ==========================================
   5. Module 3D ADN (Three.js)
   ========================================== */

function initDNA3D() {
  const viewport = document.getElementById('dnaViewport');
  if (!viewport || typeof THREE === 'undefined') return;

  // --- Scène ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020408, 0.015);

  const camera = new THREE.PerspectiveCamera(60, viewport.clientWidth / viewport.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x020408, 1);
  viewport.insertBefore(renderer.domElement, viewport.firstChild);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.minDistance = 5;
  controls.maxDistance = 40;

  // Lumières
  const ambientLight = new THREE.AmbientLight(0x334455, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00e5ff, 1.5, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff2d78, 0.8, 50);
  pointLight2.position.set(-10, -5, 5);
  scene.add(pointLight2);

  // --- Paramètres ---
  const params = {
    speed: 1,
    zoom: 1,
    pairs: 20,
    glow: 0.5,
    animMode: 'rotation',
    autoRotate: true,
    colorA: new THREE.Color(0x00e5ff),
    colorT: new THREE.Color(0xff2d78),
    colorC: new THREE.Color(0xffb800),
    colorG: new THREE.Color(0x00ff88),
  };

  const defaultParams = { ...params };

  // --- Groupe ADN ---
  let dnaGroup = new THREE.Group();
  scene.add(dnaGroup);

  function buildDNA() {
    // Nettoyer l'ancien
    while (dnaGroup.children.length) {
      const child = dnaGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      dnaGroup.remove(child);
    }

    const n = params.pairs;
    const helixRadius = 2.5;
    const verticalSpacing = 0.8;
    const totalHeight = n * verticalSpacing;
    const baseSequence = ['A', 'T', 'C', 'G'];
    const complementMap = { A: 'T', T: 'A', C: 'G', G: 'C' };

    for (let i = 0; i < n; i++) {
      const t = i / n;
      const angle = t * Math.PI * 4; // 2 tours complets
      const y = (i - n / 2) * verticalSpacing;

      // Positions des deux brins
      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      const base1 = baseSequence[i % 4];
      const base2 = complementMap[base1];

      const getColor = (base) => {
        switch (base) {
          case 'A': return params.colorA;
          case 'T': return params.colorT;
          case 'C': return params.colorC;
          case 'G': return params.colorG;
        }
      };

      // Sphères des bases
      const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);

      const mat1 = new THREE.MeshPhongMaterial({
        color: getColor(base1),
        emissive: getColor(base1),
        emissiveIntensity: params.glow * 0.4,
        shininess: 80,
      });
      const sphere1 = new THREE.Mesh(sphereGeo, mat1);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);

      const mat2 = new THREE.MeshPhongMaterial({
        color: getColor(base2),
        emissive: getColor(base2),
        emissiveIntensity: params.glow * 0.4,
        shininess: 80,
      });
      const sphere2 = new THREE.Mesh(sphereGeo, mat2);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);

      // Liaison hydrogène entre les bases
      const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, 1, 8);
      const bondMat = new THREE.MeshPhongMaterial({
        color: 0x334466,
        emissive: 0x112233,
        emissiveIntensity: params.glow * 0.2,
        transparent: true,
        opacity: 0.6,
      });

      const midX = (x1 + x2) / 2;
      const midZ = (z1 + z2) / 2;
      const bond = new THREE.Mesh(bondGeo, bondMat);
      const dist = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
      bond.scale.y = dist;
      bond.position.set(midX, y, midZ);
      bond.lookAt(new THREE.Vector3(x2, y, z2));
      bond.rotateX(Math.PI / 2);
      dnaGroup.add(bond);

      // Backbone (connecter chaque base à la suivante sur le même brin)
      if (i > 0) {
        const prevAngle = ((i - 1) / n) * Math.PI * 4;
        const prevY = (i - 1 - n / 2) * verticalSpacing;

        // Brin 1
        const px1 = Math.cos(prevAngle) * helixRadius;
        const pz1 = Math.sin(prevAngle) * helixRadius;
        const backboneGeo1 = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(px1, prevY, pz1),
            new THREE.Vector3(x1, y, z1),
          ]),
          4, 0.06, 8, false
        );
        const backboneMat1 = new THREE.MeshPhongMaterial({
          color: 0x224466,
          emissive: 0x112244,
          emissiveIntensity: 0.15,
        });
        dnaGroup.add(new THREE.Mesh(backboneGeo1, backboneMat1));

        // Brin 2
        const px2 = Math.cos(prevAngle + Math.PI) * helixRadius;
        const pz2 = Math.sin(prevAngle + Math.PI) * helixRadius;
        const backboneGeo2 = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(px2, prevY, pz2),
            new THREE.Vector3(x2, y, z2),
          ]),
          4, 0.06, 8, false
        );
        dnaGroup.add(new THREE.Mesh(backboneGeo2, backboneMat1.clone()));
      }
    }
  }

  buildDNA();

  // --- Contrôles UI ---
  const els = {
    speed: document.getElementById('dnaSpeed'),
    speedVal: document.getElementById('dnaSpeedVal'),
    zoom: document.getElementById('dnaZoom'),
    zoomVal: document.getElementById('dnaZoomVal'),
    pairs: document.getElementById('dnaPairs'),
    pairsVal: document.getElementById('dnaPairsVal'),
    glow: document.getElementById('dnaGlow'),
    glowVal: document.getElementById('dnaGlowVal'),
    animMode: document.getElementById('dnaAnimMode'),
    colorA: document.getElementById('colorA'),
    colorT: document.getElementById('colorT'),
    colorC: document.getElementById('colorC'),
    colorG: document.getElementById('colorG'),
    togglePanel: document.getElementById('dnaTogglePanel'),
    autoRotate: document.getElementById('dnaAutoRotate'),
    reset: document.getElementById('dnaReset'),
    fullscreen: document.getElementById('dnaFullscreen'),
    panel: document.getElementById('dnaControls'),
    module: document.getElementById('dnaModule'),
  };

  els.speed.addEventListener('input', e => {
    params.speed = parseFloat(e.target.value);
    els.speedVal.textContent = params.speed.toFixed(1) + '×';
    controls.autoRotateSpeed = params.speed * 1.5;
  });

  els.zoom.addEventListener('input', e => {
    params.zoom = parseFloat(e.target.value);
    els.zoomVal.textContent = params.zoom.toFixed(1) + '×';
    camera.position.z = 18 / params.zoom;
  });

  els.pairs.addEventListener('input', e => {
    params.pairs = parseInt(e.target.value);
    els.pairsVal.textContent = params.pairs;
    buildDNA();
  });

  els.glow.addEventListener('input', e => {
    params.glow = parseFloat(e.target.value);
    els.glowVal.textContent = params.glow.toFixed(2);
    buildDNA();
  });

  els.animMode.addEventListener('change', e => {
    params.animMode = e.target.value;
  });

  const colorHandler = (id, prop) => {
    document.getElementById(id).addEventListener('input', e => {
      params[prop] = new THREE.Color(e.target.value);
      buildDNA();
    });
  };
  colorHandler('colorA', 'colorA');
  colorHandler('colorT', 'colorT');
  colorHandler('colorC', 'colorC');
  colorHandler('colorG', 'colorG');

  els.togglePanel.addEventListener('click', () => {
    els.panel.classList.toggle('hidden');
    els.togglePanel.classList.toggle('active');
  });

  els.autoRotate.addEventListener('click', () => {
    params.autoRotate = !params.autoRotate;
    controls.autoRotate = params.autoRotate;
    els.autoRotate.classList.toggle('active', params.autoRotate);
  });

  els.reset.addEventListener('click', () => {
    params.speed = 1; params.zoom = 1; params.pairs = 20; params.glow = 0.5;
    params.animMode = 'rotation'; params.autoRotate = true;
    params.colorA = new THREE.Color(0x00e5ff);
    params.colorT = new THREE.Color(0xff2d78);
    params.colorC = new THREE.Color(0xffb800);
    params.colorG = new THREE.Color(0x00ff88);

    els.speed.value = 1; els.speedVal.textContent = '1.0×';
    els.zoom.value = 1; els.zoomVal.textContent = '1.0×';
    els.pairs.value = 20; els.pairsVal.textContent = '20';
    els.glow.value = 0.5; els.glowVal.textContent = '0.50';
    els.animMode.value = 'rotation';
    els.colorA.value = '#00e5ff';
    els.colorT.value = '#ff2d78';
    els.colorC.value = '#ffb800';
    els.colorG.value = '#00ff88';

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    els.autoRotate.classList.add('active');
    camera.position.set(0, 0, 18);
    controls.reset();
    buildDNA();
  });

  els.fullscreen.addEventListener('click', () => {
    els.module.classList.toggle('fullscreen');
    const isFS = els.module.classList.contains('fullscreen');
    els.fullscreen.textContent = isFS ? '✕ Quitter' : '⛶ Plein écran';
    onResize();
  });

  // Resize
  function onResize() {
    const w = viewport.clientWidth;
    const h = viewport.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // --- Animation ---
  const clock = new THREE.Clock();

  function animateDNA() {
    requestAnimationFrame(animateDNA);
    const elapsed = clock.getElapsedTime();

    if (params.animMode === 'rotation') {
      dnaGroup.rotation.y += 0.002 * params.speed;
    } else if (params.animMode === 'pulsation') {
      const scale = 1 + Math.sin(elapsed * params.speed * 2) * 0.08;
      dnaGroup.scale.set(scale, scale, scale);
      dnaGroup.rotation.y += 0.001 * params.speed;
    } else if (params.animMode === 'wave') {
      dnaGroup.children.forEach((child, i) => {
        if (child.isMesh) {
          child.position.x += Math.sin(elapsed * params.speed + i * 0.3) * 0.002;
        }
      });
      dnaGroup.rotation.y += 0.001 * params.speed;
    }

    // Glow CSS
    renderer.domElement.style.filter = params.glow > 0
      ? `drop-shadow(0 0 ${params.glow * 10}px rgba(0, 229, 255, ${params.glow * 0.3}))`
      : 'none';

    controls.update();
    renderer.render(scene, camera);
  }

  animateDNA();
}


/* ==========================================
   6. Module 3D Bactéries (Three.js)
   ========================================== */

function initBacteria3D() {
  const viewport = document.getElementById('bacViewport');
  if (!viewport || typeof THREE === 'undefined') return;

  // --- Scène ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020408, 0.008);

  const camera = new THREE.PerspectiveCamera(60, viewport.clientWidth / viewport.clientHeight, 0.1, 200);
  camera.position.set(0, 5, 25);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x020408, 1);
  viewport.insertBefore(renderer.domElement, viewport.firstChild);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  // Lumières
  scene.add(new THREE.AmbientLight(0x445566, 0.5));
  const mainLight = new THREE.PointLight(0x00e5ff, 1.2, 80);
  mainLight.position.set(15, 15, 15);
  scene.add(mainLight);
  const secLight = new THREE.PointLight(0x00ff88, 0.6, 60);
  secLight.position.set(-10, -5, 10);
  scene.add(secLight);

  // --- Paramètres ---
  const params = {
    type: 'coccus',
    count: 15,
    size: 1,
    speed: 1,
    mode: 'dynamic',
    autoAnim: true,
    color: new THREE.Color(0x00e5ff),
  };

  // --- Bactéries ---
  let bacteriaList = [];
  const bacteriaGroup = new THREE.Group();
  scene.add(bacteriaGroup);

  function createBacteriumMesh(type) {
    const color = params.color;
    const mat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      shininess: 60,
      transparent: true,
      opacity: 0.85,
    });

    let mesh;

    if (type === 'coccus') {
      // Sphère
      const geo = new THREE.SphereGeometry(0.6 * params.size, 20, 20);
      mesh = new THREE.Mesh(geo, mat);

    } else if (type === 'bacillus') {
      // Capsule (cylindre + hémisphères)
      const group = new THREE.Group();
      const length = 1.8 * params.size;
      const radius = 0.4 * params.size;
      const cylGeo = new THREE.CylinderGeometry(radius, radius, length, 16);
      const cyl = new THREE.Mesh(cylGeo, mat);
      group.add(cyl);

      const capGeo = new THREE.SphereGeometry(radius, 16, 16);
      const cap1 = new THREE.Mesh(capGeo, mat);
      cap1.position.y = length / 2;
      group.add(cap1);
      const cap2 = new THREE.Mesh(capGeo, mat);
      cap2.position.y = -length / 2;
      group.add(cap2);

      // Flagelle (petit tube)
      const flagPoints = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        flagPoints.push(new THREE.Vector3(
          Math.sin(t * Math.PI * 3) * 0.15 * params.size,
          -length / 2 - t * 2 * params.size,
          Math.cos(t * Math.PI * 3) * 0.15 * params.size
        ));
      }
      const flagCurve = new THREE.CatmullRomCurve3(flagPoints);
      const flagGeo = new THREE.TubeGeometry(flagCurve, 20, 0.03 * params.size, 8, false);
      const flagMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.5,
      });
      group.add(new THREE.Mesh(flagGeo, flagMat));

      mesh = group;

    } else if (type === 'spirillum') {
      // Spirale
      const group = new THREE.Group();
      const points = [];
      const turns = 3;
      const segments = 80;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        points.push(new THREE.Vector3(
          Math.cos(t * Math.PI * 2 * turns) * 0.5 * params.size,
          (t - 0.5) * 4 * params.size,
          Math.sin(t * Math.PI * 2 * turns) * 0.5 * params.size
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 60, 0.18 * params.size, 10, false);
      group.add(new THREE.Mesh(tubeGeo, mat));
      mesh = group;
    }

    return mesh;
  }

  function buildBacteria() {
    // Nettoyer
    while (bacteriaGroup.children.length) {
      const child = bacteriaGroup.children[0];
      disposeObject(child);
      bacteriaGroup.remove(child);
    }
    bacteriaList = [];

    const types = params.type === 'mixed'
      ? ['coccus', 'bacillus', 'spirillum']
      : [params.type];

    const spread = params.mode === 'colony' ? 6 : 14;

    for (let i = 0; i < params.count; i++) {
      const type = types[i % types.length];
      const mesh = createBacteriumMesh(type);

      if (params.mode === 'colony') {
        // Formation en amas
        const angle = (i / params.count) * Math.PI * 2;
        const ring = Math.floor(i / 6);
        const r = 1.5 + ring * 2;
        mesh.position.set(
          Math.cos(angle) * r + (Math.random() - 0.5),
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * r + (Math.random() - 0.5)
        );
      } else {
        mesh.position.set(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread
        );
      }

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Données de mouvement
      const bacterium = {
        mesh,
        type,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        wobbleOffset: Math.random() * Math.PI * 2,
      };

      bacteriaGroup.add(mesh);
      bacteriaList.push(bacterium);
    }
  }

  buildBacteria();

  // --- Contrôles UI ---
  const els = {
    type: document.getElementById('bacType'),
    count: document.getElementById('bacCount'),
    countVal: document.getElementById('bacCountVal'),
    size: document.getElementById('bacSize'),
    sizeVal: document.getElementById('bacSizeVal'),
    speed: document.getElementById('bacSpeed'),
    speedVal: document.getElementById('bacSpeedVal'),
    mode: document.getElementById('bacMode'),
    color: document.getElementById('bacColor'),
    togglePanel: document.getElementById('bacTogglePanel'),
    autoAnim: document.getElementById('bacAutoAnim'),
    reset: document.getElementById('bacReset'),
    fullscreen: document.getElementById('bacFullscreen'),
    panel: document.getElementById('bacControls'),
    module: document.getElementById('bacteriaModule'),
  };

  els.type.addEventListener('change', e => { params.type = e.target.value; buildBacteria(); });

  els.count.addEventListener('input', e => {
    params.count = parseInt(e.target.value);
    els.countVal.textContent = params.count;
    buildBacteria();
  });

  els.size.addEventListener('input', e => {
    params.size = parseFloat(e.target.value);
    els.sizeVal.textContent = params.size.toFixed(1) + '×';
    buildBacteria();
  });

  els.speed.addEventListener('input', e => {
    params.speed = parseFloat(e.target.value);
    els.speedVal.textContent = params.speed.toFixed(1) + '×';
  });

  els.mode.addEventListener('change', e => { params.mode = e.target.value; buildBacteria(); });

  els.color.addEventListener('input', e => {
    params.color = new THREE.Color(e.target.value);
    buildBacteria();
  });

  els.togglePanel.addEventListener('click', () => {
    els.panel.classList.toggle('hidden');
    els.togglePanel.classList.toggle('active');
  });

  els.autoAnim.addEventListener('click', () => {
    params.autoAnim = !params.autoAnim;
    els.autoAnim.classList.toggle('active', params.autoAnim);
    els.autoAnim.innerHTML = params.autoAnim ? '▶ Animation' : '⏸ Pause';
  });

  els.reset.addEventListener('click', () => {
    params.type = 'coccus'; params.count = 15; params.size = 1;
    params.speed = 1; params.mode = 'dynamic'; params.autoAnim = true;
    params.color = new THREE.Color(0x00e5ff);

    els.type.value = 'coccus';
    els.count.value = 15; els.countVal.textContent = '15';
    els.size.value = 1; els.sizeVal.textContent = '1.0×';
    els.speed.value = 1; els.speedVal.textContent = '1.0×';
    els.mode.value = 'dynamic';
    els.color.value = '#00e5ff';
    els.autoAnim.classList.add('active');
    els.autoAnim.innerHTML = '▶ Animation';

    camera.position.set(0, 5, 25);
    controls.reset();
    buildBacteria();
  });

  els.fullscreen.addEventListener('click', () => {
    els.module.classList.toggle('fullscreen');
    const isFS = els.module.classList.contains('fullscreen');
    els.fullscreen.textContent = isFS ? '✕ Quitter' : '⛶ Plein écran';
    onResize();
  });

  // Resize
  function onResize() {
    const w = viewport.clientWidth;
    const h = viewport.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // --- Animation ---
  const clock = new THREE.Clock();
  const boundary = 14;

  function animateBac() {
    requestAnimationFrame(animateBac);
    const elapsed = clock.getElapsedTime();

    if (params.autoAnim && params.mode !== 'static') {
      bacteriaList.forEach(b => {
        const spd = params.speed;

        // Mouvement
        b.mesh.position.add(b.velocity.clone().multiplyScalar(spd));

        // Wobble
        b.mesh.position.x += Math.sin(elapsed * spd + b.wobbleOffset) * 0.003;
        b.mesh.position.y += Math.cos(elapsed * spd * 0.7 + b.wobbleOffset) * 0.002;

        // Rotation
        b.mesh.rotation.x += b.rotSpeed.x * spd;
        b.mesh.rotation.y += b.rotSpeed.y * spd;
        b.mesh.rotation.z += b.rotSpeed.z * spd;

        // Rebond aux limites
        ['x', 'y', 'z'].forEach(axis => {
          if (Math.abs(b.mesh.position[axis]) > boundary) {
            b.velocity[axis] *= -1;
            b.mesh.position[axis] = Math.sign(b.mesh.position[axis]) * boundary;
          }
        });
      });
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animateBac();
}


/* ==========================================
   7. Utilitaires
   ========================================== */

function disposeObject(obj) {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => m.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.children) {
    obj.children.forEach(child => disposeObject(child));
  }
}
