/* =========================================================================
   DILERNA · Accueils en 3D (Three.js r128)
   Variantes : 11 tunnel · 12 vague · 13 sphère · 14 flacon en orbite
   Appelé par main.js : window.DilernaHero3D(container, variante, photos, couleur)
   ========================================================================= */
(function () {
  "use strict";

  window.DilernaHero3D = function (box, variant, pics, monthHex) {
    var THREE = window.THREE;
    if (!THREE || !box) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var CREAM = 0xF8F4EC;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    box.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

    /* ---------- Cartes photo aux coins arrondis, avec un liseré crème ---------- */
    var round = (function () {
      var c = document.createElement("canvas"); c.width = 192; c.height = 256;
      var g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, 192, 256);
      g.fillStyle = "#fff"; g.beginPath();
      var r = 26, w = 192, h = 256;
      g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.fill();
      return new THREE.CanvasTexture(c);
    })();
    var loader = new THREE.TextureLoader();
    var textures = pics.slice(0, 14).map(function (src) {
      return loader.load(src, function (t) {
        // recadrage « cover » au format 3:4
        var a = t.image.width / t.image.height, card = 0.75;
        if (a > card) { t.repeat.set(card / a, 1); t.offset.set((1 - card / a) / 2, 0); }
        else { t.repeat.set(1, a / card); t.offset.set(0, (1 - a / card) / 2); }
      });
    });
    textures.forEach(function (t) { t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; });
    var cardGeo = new THREE.PlaneGeometry(0.9, 1.2);
    var frameGeo = new THREE.PlaneGeometry(0.98, 1.28);
    var frameMat = new THREE.MeshBasicMaterial({ color: 0xFFFDF8, alphaMap: round, transparent: true, side: THREE.FrontSide });
    function card(i, scale) {
      var g = new THREE.Group();
      var fr = new THREE.Mesh(frameGeo, frameMat); fr.position.z = -0.002; g.add(fr);
      var ph = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ map: textures[i % textures.length], alphaMap: round, transparent: true, side: THREE.DoubleSide }));
      g.add(ph);
      if (scale) g.scale.setScalar(scale);
      return g;
    }

    var update = function () {};
    var t0 = performance.now();

    /* ---------- 11 · Tunnel infini, au ralenti ---------- */
    if (variant === "11") {
      scene.fog = new THREE.Fog(CREAM, 5, 30);
      camera.position.set(0, 0, 6);
      var LEN = 60, cards11 = [];
      for (var i = 0; i < 46; i++) {
        var m = card(i);
        var a = i * 2.399, rr = 1.7 + (i % 3) * 0.4;
        m.position.set(Math.cos(a) * rr, Math.sin(a) * rr * 1.25, -i * (LEN / 46));
        m.rotation.z = (Math.random() - 0.5) * 0.4;
        m.userData.spin = (Math.random() - 0.5) * 0.3;
        scene.add(m); cards11.push(m);
      }
      update = function (t, dt) {
        cards11.forEach(function (m) {
          m.position.z += dt * 1.6;
          if (m.position.z > camera.position.z + 1) m.position.z -= LEN;
          m.rotation.y = Math.sin(t * 0.4 + m.position.x) * 0.25;
          m.rotation.z += m.userData.spin * dt;
        });
        scene.rotation.z = t * 0.04;
      };
    }

    /* ---------- 12 · Vague de photos qui ondule ---------- */
    if (variant === "12") {
      scene.fog = new THREE.Fog(CREAM, 7, 18);
      camera.position.set(0, -3.2, 6.2); camera.lookAt(0, 0.6, 0);
      var grid = new THREE.Group(), cells = [], COLS = 6, ROWS = 9, SX = 1.08, SY = 1.4;
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var m2 = card(x + y * COLS);
        m2.userData.gx = x - (COLS - 1) / 2; m2.userData.gy = y;
        grid.add(m2); cells.push(m2);
      }
      grid.rotation.x = -0.55; scene.add(grid);
      update = function (t) {
        var scroll = (t * 0.35) % SY;
        cells.forEach(function (m) {
          var gx = m.userData.gx, gy = m.userData.gy;
          var py = (gy * SY - scroll) - ROWS * SY / 2 + SY;
          var w = Math.sin(gx * 0.7 + t * 0.9) * 0.45 + Math.cos(py * 0.55 + t * 0.7) * 0.45;
          m.position.set(gx * SX, py, w);
          m.rotation.x = Math.sin(py * 0.55 + t * 0.7) * 0.35;
          m.rotation.y = Math.cos(gx * 0.7 + t * 0.9) * 0.3;
        });
      };
    }

    /* ---------- 13 · Sphère de photos qu'on peut faire tourner ---------- */
    if (variant === "13") {
      scene.fog = new THREE.Fog(CREAM, 6, 11);
      camera.position.set(0, 0, 7.2);
      var sphere = new THREE.Group(), N = 34;
      for (var k = 0; k < N; k++) {
        var yv = 1 - (k / (N - 1)) * 2, rad = Math.sqrt(1 - yv * yv), th = k * 2.399;
        var m3 = card(k, 0.8);
        m3.position.set(Math.cos(th) * rad * 3, yv * 3, Math.sin(th) * rad * 3);
        m3.lookAt(m3.position.clone().multiplyScalar(2));
        sphere.add(m3);
      }
      scene.add(sphere);
      var vx = 0.12, vy = 0, drag = false, lx = 0, ly = 0;
      box.style.pointerEvents = "auto"; box.style.touchAction = "pan-y";
      box.addEventListener("pointerdown", function (e) { drag = true; lx = e.clientX; ly = e.clientY; });
      window.addEventListener("pointerup", function () { drag = false; });
      window.addEventListener("pointermove", function (e) {
        if (!drag) return;
        vx = (e.clientX - lx) * 0.01; vy = (e.clientY - ly) * 0.006; lx = e.clientX; ly = e.clientY;
      });
      update = function (t, dt) {
        sphere.rotation.y += vx * dt * (drag ? 6 : 1);
        sphere.rotation.x = Math.max(-0.6, Math.min(0.6, sphere.rotation.x + vy * dt));
        if (!drag) { vx += (0.12 - vx) * dt * 0.8; vy *= 0.95; }
        sphere.position.y = Math.sin(t * 0.6) * 0.12;
      };
    }

    /* ---------- 14 · Flacon de vernis réaliste, arrivée au ralenti, photos en orbite ---------- */
    if (variant === "14") {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      renderer.physicallyCorrectLights = true;
      camera.position.set(0, 0.5, 9.4); camera.lookAt(0, -0.6, 0);

      // Studio photo : environnement avec grandes boîtes à lumière pour les reflets
      var env = new THREE.Scene();
      env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x2a1d17, side: THREE.BackSide })));
      function panel(w, h, x, y, z, ry, k) {
        var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.96, 0.9).multiplyScalar(k), side: THREE.DoubleSide }));
        m.position.set(x, y, z); m.rotation.y = ry; env.add(m);
      }
      panel(3, 12, -7, 2, 2, Math.PI / 2, 6);     // softbox gauche (bande verticale)
      panel(3, 12, 7, 2, 1, -Math.PI / 2, 4);     // softbox droite
      panel(14, 3, 0, 10, 0, 0, 3);               // lumière haute
      var top = env.children[env.children.length - 1]; top.rotation.x = Math.PI / 2;
      panel(6, 6, 0, 3, 10, Math.PI, 1.6);        // face
      var pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromScene(env, 0.03).texture;

      var key = new THREE.DirectionalLight(0xfff3e6, 1.2); key.position.set(3, 6, 5); scene.add(key);
      var rim = new THREE.DirectionalLight(0xffe2d0, 1.0); rim.position.set(-4, 3, -4); scene.add(rim);

      var bottle = new THREE.Group();
      // Corps : verre épais carré aux bords arrondis
      function rounded(w, r) {
        var s = new THREE.Shape(), h = w;
        s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
        s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
        s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
        return s;
      }
      function block(w, r, depth, bevel, y0) {
        var g = new THREE.ExtrudeGeometry(rounded(w, r), { depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 10, curveSegments: 24 });
        g.rotateX(-Math.PI / 2); g.translate(0, y0 + bevel, 0); g.computeVertexNormals();
        return g;
      }
      var brown = new THREE.Color("#5C321F");
      var liquid = new THREE.Mesh(block(1.36, 0.3, 0.98, 0.08, 0.2), new THREE.MeshPhysicalMaterial({
        color: brown, roughness: 0.2, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 0.55 }));
      liquid.renderOrder = 1; bottle.add(liquid);
      var glass = new THREE.Mesh(block(1.62, 0.38, 1.3, 0.14, 0), new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.02, metalness: 0, transparent: true, opacity: 0.1, clearcoat: 1, clearcoatRoughness: 0,
        reflectivity: 1, envMapIntensity: 2.2, depthWrite: false }));
      glass.renderOrder = 2; bottle.add(glass);
      // Logo imprimé sur la face avant
      var logoTex = loader.load("assets/logo/dilerna-logo-clair.webp"); logoTex.encoding = THREE.sRGBEncoding;
      var logo = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.45), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false, opacity: 0.95 }));
      logo.position.set(0, 0.86, 0.97); logo.renderOrder = 3; bottle.add(logo);
      // Col et bouchon laqué
      var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.16, 64), new THREE.MeshPhysicalMaterial({ color: 0xEDE4DA, roughness: 0.35 }));
      neck.position.y = 1.66; bottle.add(neck);
      var capPts = [[0, 0], [0.36, 0], [0.38, 0.04], [0.38, 1.36], [0.36, 1.44], [0.3, 1.48], [0, 1.48]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      var cap = new THREE.Mesh(new THREE.LatheGeometry(capPts, 96), new THREE.MeshPhysicalMaterial({
        color: 0x0d0604, roughness: 0.16, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.7 }));
      cap.position.y = 1.74; bottle.add(cap);
      bottle.position.y = -0.2; scene.add(bottle);

      // Ombre de contact douce
      var sh = document.createElement("canvas"); sh.width = sh.height = 128;
      var sg = sh.getContext("2d"), grd = sg.createRadialGradient(64, 64, 4, 64, 64, 62);
      grd.addColorStop(0, "rgba(40,20,12,.45)"); grd.addColorStop(1, "rgba(40,20,12,0)"); sg.fillStyle = grd; sg.fillRect(0, 0, 128, 128);
      var shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.25; scene.add(shadow);

      var orbit = new THREE.Group(), O = 10, orb = [];
      for (var o = 0; o < O; o++) { var m4 = card(o, 0.6); m4.children.forEach(function (c) { c.material = c.material.clone(); c.material.opacity = 0; }); orbit.add(m4); orb.push(m4); }
      orbit.rotation.x = 0.26; orbit.rotation.z = -0.1; orbit.position.y = 0.9; scene.add(orbit);

      var GN = 120, gpos = new Float32Array(GN * 3);
      for (var p = 0; p < GN; p++) { gpos[p * 3] = (Math.random() - 0.5) * 7; gpos[p * 3 + 1] = Math.random() * 6 - 2; gpos[p * 3 + 2] = (Math.random() - 0.5) * 4; }
      var gg = new THREE.BufferGeometry(); gg.setAttribute("position", new THREE.BufferAttribute(gpos, 3));
      var glitterMat = new THREE.PointsMaterial({ color: 0xD9B88E, size: 0.045, transparent: true, opacity: 0 });
      scene.add(new THREE.Points(gg, glitterMat));

      var ease = function (x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 4); };
      update = function (t, dt) {
        // Arrivée au ralenti : le flacon monte en tournant, puis se pose
        var a = ease(t / 3.2);
        bottle.position.y = -0.2 - (1 - a) * 5 + Math.sin(t * 0.8) * 0.1 * a;
        bottle.rotation.y = -Math.PI * 3 * (1 - a) + t * 0.32;
        bottle.rotation.z = (1 - a) * 0.5 + Math.sin(t * 0.5) * 0.04;
        bottle.scale.setScalar(0.85 + 0.15 * a);
        shadow.material.opacity = a; shadow.scale.setScalar(0.7 + 0.3 * a);
        // Les photos arrivent de loin et se mettent en orbite
        var b = ease((t - 1.6) / 2.6);
        orb.forEach(function (m, k) {
          var ang = t * 0.25 + (k / O) * Math.PI * 2, R = 2.7 + (1 - b) * 7;
          m.position.set(Math.cos(ang) * R, Math.sin(ang * 2 + k) * 0.22, Math.sin(ang) * R);
          m.lookAt(camera.position); m.rotation.z += Math.sin(t * 0.7 + k) * 0.08;
          m.children.forEach(function (c) { c.material.opacity = b; });
        });
        glitterMat.opacity = 0.85 * ease((t - 2.4) / 1.5);
        var arr = gg.attributes.position.array;
        for (var q = 0; q < GN; q++) { arr[q * 3 + 1] += dt * 0.22; if (arr[q * 3 + 1] > 4) arr[q * 3 + 1] = -2; }
        gg.attributes.position.needsUpdate = true;
      };
    }

    /* ---------- Boucle, taille, pause hors écran ---------- */
    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      // sur écran étroit on recule un peu la caméra pour garder tout le décor
      camera.fov = w / h < 0.7 ? 62 : 50;
      camera.updateProjectionMatrix();
    }
    resize(); window.addEventListener("resize", resize);
    var visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(box);
    var last = performance.now();
    (function loop(now) {
      requestAnimationFrame(loop);
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!visible) return;
      var t = (now - t0) / 1000;
      if (!reduce) update(t, dt); else if (t < 0.1) update(0, 0);
      renderer.render(scene, camera);
    })(last);
  };
})();
