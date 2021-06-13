import * as THREE from 'three';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const effect = new OutlineEffect(renderer, {
    defaultThickness: 0.01,
    defaultColor: [1, 1, 1],
    defaultAlpha: 1,
    defaultKeepAlive: true,
});

const geometry = new THREE.SphereGeometry(1, 40, 40);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const sphere = new THREE.Mesh(geometry, material);
const sphere2 = new THREE.Mesh(geometry, material);
scene.add(sphere, sphere2);

camera.position.z = 5;
camera.position.y = 2;
camera.lookAt(new THREE.Vector3());

renderer.setSize(800, 800);
document.querySelector('.scene3')!.appendChild(renderer.domElement);

let lastTime = null;
function render(time){
    const delta = lastTime ? time - lastTime : 0;
    lastTime = time;

    sphere.position.x = Math.sin(time * 0.001 + Math.PI) * 1.5;
    sphere.position.z = Math.cos(time * 0.001 + Math.PI) * 1.5;
    sphere2.position.x = Math.sin(time * 0.001) * 1.5;
    sphere2.position.z = Math.cos(time * 0.001) * 1.5;
	requestAnimationFrame(render);
    //renderer.render(scene, camera);
	effect.render(scene, camera);
}
render(0);
