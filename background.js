window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bg");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true, // permite ver fondo detrás del canvas
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Geometría visible: un icosaedro wireframe
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff66ff,
    wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Partículas
  const particleCount = 1000;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xaa00ff,
    size: 0.05
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Animación
  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  // Resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
