var cameraParams = {
   fov: 75, aspectRatio: 1, near: 0.1, far: 50
};
var lightParams = {
   color: 0xffffff, intensity: 2, distance: 100, decay: 2
};
var $;
var renderer, scene, light, camera, box, eye;

var setupWorld = function() {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    // default THREE.PCFShadowMap
    renderer.setSize(100, 100);
    document.body.appendChild( renderer.domElement ); 

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.display = "none";
    renderer.domElement.style.left = ((sw/2)-(50))+"px";
    renderer.domElement.style.top = ((sh/2)+(175))+"px";
    renderer.domElement.style.width = (100)+"px";
    renderer.domElement.style.height = (100)+"px";
    //renderer.domElement.style.border = "2px solid #fff";
    //renderer.domElement.style.borderRadius = "10px";
    renderer.domElement.style.zIndex = "999";

    scene = new THREE.Scene();

    light = new THREE.PointLight(
        lightParams.color,
        lightParams.intensity,
        lightParams.distance,
        lightParams.decay
    );

    light.position.set(0, 2.5, 0);
    light.castShadow = true;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default

    camera = new THREE.PerspectiveCamera( 
        cameraParams.fov, 
        cameraParams.aspectRatio, 
        cameraParams.near, 
        cameraParams.far 
    );

    camera.position.set(0, 3, 3);
    camera.lookAt(0, 0, 0);

    center = new THREE.Object3D();
    center.position.set(0, 0, 0);

    center.add(light);
    center.add(camera);
    scene.add(center);

    createFoldablePlane();
};

var createFoldablePlane = function() {
    var origami = new THREE.Object3D();
    origami.position.set(0, 0, 0);

    addPart([
        -0.5, -0.5, 0
    ]);

    addPart([
        -0.5, -0.5, 0
    ]);

    
};

var addPart = function(points) {
    var geometry = new THREE.BufferGeometry();

    var vertices = []; 
    for(var k = 0; k < points.length; k++){
        var bp = points[k];
        vertices = [ ...vertices, bp.x, bp.y, bp.z ];
    }
    vertices = new Float32Array(vertices);

    var material = 
    new THREE.MeshBasicMaterial({ 
        side: THREE.DoubleSide,
        color: 0xAACAFF,
        opacity: 0.7,
        wireframe: false,
        transparent: true
    });

    geometry.setAttribute("position",
    new THREE.BufferAttribute(vertices, 3));

    var mesh = new THREE.Mesh(geometry, material.clone());
};