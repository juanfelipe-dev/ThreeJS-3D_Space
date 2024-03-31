import * as THREE from 'three';
import './style.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#6c1e54',
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 100, 100);
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Timeline magic
const timeline = gsap.timeline({ defaults: { duration: 1 } });
timeline.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
timeline.fromTo('nav', { y: '-100%' }, { y: '0%' });
timeline.fromTo('.title', { opacity: 0 }, { opacity: 1 });

// Mouse and touch animation color
let inputActive = false;
let rgb = [];

const handleInputStart = () => {
  inputActive = true;
};

const handleInputEnd = () => {
  inputActive = false;
};

const handleInputMove = (event) => {
  if (inputActive) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    rgb = [
      Math.round((clientX / sizes.width) * 255),
      Math.round((clientY / sizes.height) * 255),
      150,
    ];
    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
};

window.addEventListener('mousedown', handleInputStart);
window.addEventListener('touchstart', handleInputStart);

window.addEventListener('mouseup', handleInputEnd);
window.addEventListener('touchend', handleInputEnd);

window.addEventListener('mousemove', handleInputMove);
window.addEventListener('touchmove', handleInputMove);
