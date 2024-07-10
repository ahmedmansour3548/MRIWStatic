AFRAME.registerComponent('smoke-effect', {
    schema: {
      size: { type: 'number', default: 5 },
      particleCount: { type: 'number', default: 40 }
    },
  
    init: function () {
      const el = this.el;
      this.clock = new THREE.Clock();
  
      const tex = new THREE.TextureLoader()
        .load('src/assets/smoke.png');
      const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        depthWrite: false,
        map: tex,
        transparent: true
      });
  
      const geometry = new THREE.PlaneGeometry(1, 1); // Use a small plane for particles
  
      this.particles = [];
  
      for (let i = 0; i < this.data.particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(
          (Math.random() - 0.5) * this.data.size,
          (Math.random() - 0.5) * this.data.size,
          (Math.random() - 0.5) * this.data.size);
        particle.rotation.z = Math.random() * Math.PI * 2;
        el.setObject3D('mesh0', particle); // Set the particle as a child of the entity
        this.particles.push(particle);
      }
  
      el.sceneEl.renderer.setAnimationLoop(this.update.bind(this));
    },
  
    update: function () {
      const dt = this.clock.getDelta();
      console.log("updating!");
      if (this.particles) {
        const camera = this.el.sceneEl.querySelector("a-camera").object3D;
        const cameraWorldPosition = new THREE.Vector3();
        camera.getWorldPosition(cameraWorldPosition);
  
        this.particles.forEach(particle => {
          // Ensure particles always face towards the screen
          particle.lookAt(cameraWorldPosition);
  
          // Update rotation for animation effect
          const z = particle.rotation.z;
          particle.rotation.z = z + dt * 0.1;
        });
      }
    }
  });
