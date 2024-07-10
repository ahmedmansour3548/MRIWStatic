AFRAME.registerComponent('virtual-hole', {
    init: function () {
        console.log("building hole");
        this.virtualRoom = this.el.sceneEl.querySelector('#room');
        this.centerMarker = this.el.sceneEl.querySelector('#centerMarker');

        // Load gradient texture
        let loader = new THREE.TextureLoader();
        let texture = loader.load('./assets/effects/tiles.jpg');

        // the inside of the hole
        let geometry1 = new THREE.BoxGeometry(2, 2, 5);
        let material1 = new THREE.MeshLambertMaterial({
            transparent: true,
            map: texture,
            side: THREE.BackSide
        });

        this.mesh1 = new THREE.Mesh(geometry1, material1);
        this.mesh1.position.y = -1;

        // the invisibility cloak (box with a hole)
        let geometry0 = new THREE.BoxGeometry(0, 0, 2);

        // Create a material array to simulate a hole by using different materials for different faces
        let materials = [];
        for (let i = 0; i < 6; i++) {
            if (i === 4 || i === 5) {
                // Skip top two faces to create a hole effect
                materials.push(new THREE.MeshBasicMaterial({ visible: false }));
            } else {
                materials.push(new THREE.MeshBasicMaterial({ colorWrite: false }));
            }
        }

        let mesh0 = new THREE.Mesh(geometry0, materials);
        mesh0.scale.set(1, 1, 1).multiplyScalar(1.01);

        // Add both meshes to the virtualRoom
        this.virtualRoom.setObject3D('mesh0', mesh0);
        this.virtualRoom.setObject3D('mesh1', this.mesh1);

        // Add a spotlight to create a gradient lighting effect
        const spotlight = new THREE.SpotLight(0xffffff, 1);
        spotlight.position.set(0, 4, 0); // Position the spotlight above the hole
        spotlight.angle = Math.PI / 4; // Set the spotlight angle
        spotlight.penumbra = 0.5; // Set the spotlight penumbra for soft edges
        spotlight.castShadow = true; // Enable shadows
        this.el.sceneEl.object3D.add(spotlight);

        // Add a point light inside the hallway for ambient lighting
        const pointLight = new THREE.PointLight(0xffffff, 5, 5);
        pointLight.position.set(0, 1, -2); // Position the point light inside the hallway
        pointLight.castShadow = true; // Enable shadows
        //this.el.sceneEl.object3D.add(pointLight);

        // Enable fog in the scene
        //this.el.sceneEl.object3D.fog = new THREE.Fog(0x000000, 4, 6.5); // Fog color and density
    }
});
