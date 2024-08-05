// Globe.jsx
'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Globe from 'three-globe';
import "./components.css"

const GlobeComponent = () => {
  const globeEl = useRef();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [pointsData, setPointsData] = useState([
    { lat: 37.7749, lng: -122.4194, size: 0.5, color: 'red', name: 'San Francisco' },
    { lat: 40.7128, lng: -74.0060, size: 0.5, color: 'blue', name: 'New York' },
    { lat: 51.5074, lng: -0.1278, size: 0.5, color: 'green', name: 'London' },
    { lat: 35.6895, lng: 139.6917, size: 0.5, color: 'yellow', name: 'Tokyo' }
  ]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    globeEl.current.appendChild(renderer.domElement);

    // Create the space background
    const spaceBackground = createSpaceBackground();
    scene.add(spaceBackground);

    // Create and configure the globe
    const globe = new Globe();
    globe.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg');
    globe.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');
    globe.pointsData(pointsData.map(point => ({
      ...point,
      object: new THREE.Mesh(new THREE.SphereGeometry(point.size, 16, 16), new THREE.MeshBasicMaterial({ color: point.color }))
    })));
    globe.pointAltitude(point => point.size * 1.5);
    globe.pointColor(point => point.color);
    scene.add(globe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    // Add directional lights
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 3, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 150;
    controls.maxDistance = 500;

    camera.position.z = 300;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = event => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(globe.children, true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const intersectedPoint = pointsData.find(point => point.object === intersectedObject);
        setSelectedPoint(intersectedPoint);
      }
    };

    window.addEventListener('click', onMouseClick);

    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.005; // Adjust rotation speed
      controls.update();
      spaceBackground.material.uniforms.time.value += 0.01; // Update background animation
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      renderer.dispose();
    };
  }, [pointsData]);

  // Function to create the animated space background
  function createSpaceBackground() {
    const textureLoader = new THREE.TextureLoader();
    const spaceTexture = textureLoader.load('/assets/space.jpg');

    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: spaceTexture },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        uniform float time;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          // Simple star and comet effect
          float star = step(0.98, fract(uv.x * 10.0 + time * 0.2)) * step(0.98, fract(uv.y * 10.0 + time * 0.2));
          gl_FragColor = texture2D(texture, uv) + vec4(star, star, star, 1.0);
        }
      `,
      side: THREE.BackSide
    });

    return new THREE.Mesh(geometry, material);
  }

  return (
    <div>
      <div ref={globeEl}></div>
      {selectedPoint && (
        <div className="info-box">
          <h2>{selectedPoint.name}</h2>
          <p>Latitude: {selectedPoint.lat}</p>
          <p>Longitude: {selectedPoint.lng}</p>
          <p>Size: {selectedPoint.size}</p>
          <p>Color: {selectedPoint.color}</p>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
