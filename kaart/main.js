import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const canvas = document.querySelector('#canvas'); //fetch the canvas element
const filterMenuDesktop = document.querySelector('#filterMenuDesktop'); //fetch the filter menu element
const routingButtonDesk = document.querySelector('#routingButtonDesk'); //fetch the routing button element
const routingButtonMobile = document.querySelector('#routingButtonMobile'); //fetch the routing button element

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const height = canvas.clientHeight; //get the height of the canvas
const width = canvas.clientWidth; //get the width of the canvas
const raycaster = new THREE.Raycaster(); //create a raycaster to detect mouse events
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); //create a WebGL renderer in canvas element
renderer.setSize(width, height, false); //set the size of the renderer to the size of the canvas
camera.aspect = width / height; //update the aspect ratio of the camera so it doesnt get distorted
camera.updateProjectionMatrix();
camera.position.set(0, 0, 20);


const controls = new OrbitControls(camera, renderer.domElement); //create controls for user to move the camera
controls.enableDamping = true; 

const pins = [];
const graph = [];
const pathSegments = [];
//const pathSegments = []; //array to hold the path segments
const activeFilters = []; //make cookie in future

const mapGroup = new THREE.Group(); //create a group to hold the map and pins
scene.add(mapGroup); //add the group to the scene

//classes

console.log(metersPerUnit);

class locationPin{
    constructor(id, category, position, model, active, scale, info = {}){
        this.id = id;
        this.category = category;
        this.position = position;
        this.model = model;
        this.active = active; 
        this.scale = scale;
        this.info = info; // Initialize info to an empty object
        this.pinObject = null; // Initialize pinObject to null
    }

    async initialize(group, array) {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.load(this.model, resolve, undefined, reject);
        })

        this.pinObject = gltf.scene;
        this.pinObject.scale.set(this.scale, this.scale, this.scale);
        this.pinObject.position.set(...this.position); // unpack the position array

        group.add(this.pinObject);
        array.push(this);

        if(this.active){
            this.pinObject.visible = true;
        }else{
            this.pinObject.visible = false;
        }
    }

    fadeInOut(){
        if(this.active){
            this.pinObject.visible = true;
        } else {
            this.pinObject.visible = false;
        }
    }
}

scene.background = new THREE.Color(0xfef8e8); //set the background color of the scene


//map
const loader = new GLTFLoader();
loader.load('./assets/models/MapZuiderbadV4.glb', function (gtlf){
    //scale model down to fit in the scene
    gtlf.scene.scale.set(1, 1, 1); //scale the model down to fit in the scene
    gtlf.scene.position.set(0, 0, 0); //position the model in the scene
    //gtlf.scene.rotation.x = Math.PI / 4;
    mapGroup.add(gtlf.scene); //add the loaded model to the scene
}, undefined, function (error) {
    console.error(error);
});


//paths
loader.load('./assets/models/walk.glb', function (gltf){
    const path = gltf.scene;
    path.scale.set(1, 1, 1); //scale the model down to fit in the scene
    path.position.set(0, 0.1, 0); //position the model in the scene
    mapGroup.add(path); //add the loaded model to the scene

    // path.traverse((child) => {
    //     if (child.isMesh) {
    //         child.geometry.computeBoundingBox();
    //         const bbox = child.geometry.boundingBox;
    //         const center = new THREE.Vector3();
    //         bbox.getCenter(center);
    //         child.userData.center = center;

    //         pathSegments.push(child);
    //     }
    // });

    path.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundingBox();
            const bbox = child.geometry.boundingBox.clone(); // clone to avoid mutation
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            child.updateWorldMatrix(true, false);
            child.localToWorld(center); // convert to world space
            child.userData.center = center;

            pathSegments.push(child);
        }
    });


    console.log("Total path segments found:", pathSegments.length);
}, undefined, function (error) {
    console.error(error);
});

//userPin
let userPin
loader.load('./assets/models/userLocation.glb', function(gltf){
    userPin = gltf.scene;
    userPin.scale.set(1, 1, 1); 
    userPin.position.set(0.5, 0.45, 3.5);
    scene.add(userPin); 

    focusCameraOnObject(camera, controls, userPin, 2);
}, undefined, function(error){
    console.error(error);
})

//add Pins to map

const firstAidCo = latLonToXz(50.985140246874835, 4.515627794721486);
const firstAidPin = new locationPin(
    0,
    "firstaid",
    //new THREE.Vector3(firstAidCo.x, 0.45, firstAidCo.z),
    new THREE.Vector3(-4, 0.45, 2),
    "./assets/models/firstAidPin.glb",
    true,
    1,
    {
        name: "EHBO",
        openingHours: null,
        description: "Hier kan je terecht voor eerste hulp bij ongevallen. Bij een ongeval, bel 112.",
        url: null
    }
);
await firstAidPin.initialize(mapGroup, pins);

const zuiderBadCo = latLonToXz(50.98548325417922, 4.516110690361381);
const zuiderbadPin = new locationPin(
    1, 
    "food", 
    new THREE.Vector3(zuiderBadCo.x, 0.45, zuiderBadCo.z),
    "./assets/models/zuiderBadPin.glb", 
    false, 
    1,
    {
        name: "Zuiderbad Strandbar",
        openingHours: {
            'monday': 'Gesloten', 
            'tuesday': 'Gesloten', 
            'wednesday': '12:00 – 23:00',
            'thursday': '18:00 – 23:00', 
            'friday': '18:00 – 23:00', 
            'saturday': '11:00 – 18:30', 
            'sunday': '11:00 – 18:30'
        },
        description: "Welkom in de strandbar op de meest magische plek op het domein van Sport Vlaanderen Hofstade! Op het menu: frisse dranken, beachfood & holiday vibes. De strandbar beschikt over een ruim terras en serre (bij regenweer). Welkom zonder reserveren.",
        url: null
    }
);
await zuiderbadPin.initialize(mapGroup, pins);

const zomerlustCo = latLonToXz(50.98275020080574, 4.510684910801831)
const zomerlustPin = new locationPin(
    2,
    'food',
    new THREE.Vector3(zomerlustCo.x, 0.45, zomerlustCo.z),
    "./assets/models/zuiderbadPin.glb",
    false,
    1,
    {
        name: "Zomerlust",
        openingHours: {
            'monday': 'Gesloten', 
            'tuesday': 'Gesloten', 
            'wednesday': '13:00 – 18:00',
            'thursday': 'Gesloten', 
            'friday': 'Gesloten',
            'saturday': '10:00 – 18:00', 
            'sunday': '10:00 – 18:00'
        },
        description: 'In deze kleurrijke selfservice-bar met ruim terras & de leukste (én grootste) buitenspeeltuin kan je terecht voor lekkere snacks, zoetigheden en koele dranken. De toonbank wordt voorzien van gebak, smoothies en taart.',
        url: null
    }
)
await zomerlustPin.initialize(mapGroup, pins);

//Lighting
const dirLight = new THREE.DirectionalLight(0xffffff, 1);  // Subtle intensity
dirLight.position.set(5, 10, 7);  // Angle it so that it doesn't cause harsh shadows
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 4));

//filter event listener
filterMenuDesktop.addEventListener('click', function(e){
    e.preventDefault();
    let button = e.target.closest('.filterButton');
    //console.log(button);

    button.classList.toggle('active');
    button.querySelector('i').classList.toggle('active');

    if(button && button.classList.contains('filterButton')){
        let clickedFilter = (button.dataset.filter).toLowerCase();
        let filterName = document.querySelector('.filterName');
        //if clickedFilter is not in activeFilters, add it to activeFilters
        if(!activeFilters.includes(clickedFilter)){
            //if clickedFilter is not in activeFilters, add it to activeFilters
            activeFilters.push(clickedFilter);
        } else {
            //if clickedFilter is in activeFilters, remove it from activeFilters
            activeFilters.splice(activeFilters.indexOf(clickedFilter), 1);
        }
        
        pins.forEach((pin) => {
            let pinCategory = pin.category.toLowerCase();
            if(pinCategory === clickedFilter){
                if(pin.active){
                    pin.active = false;
                    filterName.innerHTML = "";
                }else{
                    pin.active = true;
                    filterName.innerHTML = button.dataset.name;

                }
                pin.fadeInOut();
            }
        })
    }
})

document.querySelector('#button-center').addEventListener('click', function(e){
    e.preventDefault();
    focusCameraOnObject(camera, controls, userPin, 2);
})

canvas.addEventListener('click', function(e){
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera); //set the raycaster to the mouse position
    const intersects = raycaster.intersectObjects(
        pins.flatMap(pin => {
            const meshes = [];
            pin.pinObject?.traverse((child) => {
                if(child.isMesh){
                    child.userData.pin = pin;
                    meshes.push(child);
                }
            });
            return meshes;
        }),
        true
    );
    
    if(intersects.length > 0){
        let clickedPin = intersects[0].object.userData.pin;
        console.log(clickedPin.info.name);
        displayLocationInfo(clickedPin);
    }

})

function displayLocationInfo(pin){
    let infoContainer = document.querySelector('.infoDesktop');
    infoContainer.classList.remove('hidden');

    document.querySelector('.infoDesktop .locationName').innerHTML = pin.info.name;
    document.querySelector('.infoDesktop .locationDescription').innerHTML = pin.info.description;
    document.querySelector('.infoDesktop .shareButton').dataset.locationId = pin.id;

    let moreInfoButton = document.querySelector('.infoDesktop .moreInfoButton');

    if(pin.info.url){
        moreInfoButton.innerHTML = pin.info.url;
        moreInfoButton.classList.remove('hidden');
    }

    let openingHours = document.querySelector('.infoDesktop .openingHours');

    if(pin.info.openingHours){
        openingHours.innerHTML = pin.info.openingHours.wednesday;
        openingHours.classList.remove('hidden');
    }else{
        openingHours.innerHTML = "";
        openingHours.classList.add('hidden');
    }
}

function focusCameraOnObject(camera, controls, object, duration ){
    let offset = new THREE.Vector3(0,5, 5);
    let newCameraPosition = object.position.clone().add(offset);
    let newTarget = object.position.clone();

    gsap.to(camera.position, {
        x: newCameraPosition.x,
        y: newCameraPosition.y,
        z: newCameraPosition.z,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function(){
            controls.target.copy(object.position);
            controls.update();
        }
    })

    gsap.to(controls.target, {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
            controls.target.copy(object.position);
            controls.update();
        }
    });
}

function animatePinsBobbing(pins) {
    pins.forEach((pin, index) => {
        if (pin.pinObject) {
            // Animate the Y position up and down forever
            gsap.to(pin.pinObject.position, {
                y: pin.pinObject.position.y + 0.05, // adjust for how floaty you want it
                duration: 1.5,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: index * 0.1 // slight stagger so they're not perfectly synced
            });
        }
    });
}

function onWindowResize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(width, height, false);
}

//attempt to make graph with proximity detection

// function getBoundingBoxCorners(bbox){
//     const min = bbox.min;
//     const max = bbox.max;
//     return [
//         new THREE.Vector3(min.x, min.y, min.z),
//         new THREE.Vector3(min.x, min.y, max.z),
//         new THREE.Vector3(min.x, max.y, min.z),
//         new THREE.Vector3(min.x, max.y, max.z),
//         new THREE.Vector3(max.x, min.y, min.z),
//         new THREE.Vector3(max.x, min.y, max.z),
//         new THREE.Vector3(max.x, max.y, min.z),
//         new THREE.Vector3(max.x, max.y, max.z),
//     ];
// }

// function checkIfConnected(pathSegmentsArray, threshold){
//     for (let i = 0; i < pathSegmentsArray.length; i++) {
//         const a = pathSegmentsArray[i];
//         const aCorners = getBoundingBoxCorners(a.geometry.boundingBox);
//         const aWorldCorners = aCorners.map(corner => a.localToWorld(corner.clone()));
//         graph[a.uuid] = [];

//         for(let j = 0; j < pathSegmentsArray.length; j++){
//             if(i === j){continue};
//             const b = pathSegmentsArray[j];
//             const bCorners = getBoundingBoxCorners(b.geometry.boundingBox);
//             const bWorldCorners = bCorners.map(corner => b.localToWorld(corner.clone()));

//             let connected = false;
            
//             for(const ac of aWorldCorners) {
//                for(const bc of bWorldCorners) {
//                    if(ac.distanceTo(bc) < threshold) {
//                        connected = true;
//                        break;
//                    }
//                }
//                if (connected) break;
//             }
            
//             if(connected){
//                 graph[a.uuid].push(b.uuid);
//             }
//         }
//     }
// }

// checkIfConnected(pathSegments, 0.05); //check if the path segments are connected

// console.log("Graph: ", graph);

// const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });

// for (const [uuid, neighbors] of Object.entries(graph)) {
//     if (neighbors.length > 0) {
//         const mesh = pathSegments.find(m => m.uuid === uuid);
//         if (mesh) {
//             mesh.material = highlightMaterial;
//         }
//     }
// }

//make graph from naming convention

// Helper to extract prefix and number from mesh name
function parseName(name) {
    const match = name.match(/^([a-zA-Z_]+)(\d+)$/);
    if (!match) return null;
    return {
        prefix: match[1],
        number: parseInt(match[2], 10),
    };
}

// Group meshes by prefix
const pathGroup = {};

pathSegments.forEach(mesh => {
    const parsed = parseName(mesh.name);
    if (!parsed) return;

    const { prefix, number } = parsed;
    if (!pathGroup[prefix]) pathGroup[prefix] = [];
    pathGroup[prefix].push({ mesh, number });
});

// Sort and connect consecutive segments
for (const prefix in pathGroup) {
    const sorted = pathGroup[prefix].sort((a, b) => a.number - b.number);

    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i].mesh;
        const currentId = current.uuid;
        if (!graph[currentId]) graph[currentId] = [];

        if (i > 0) {
            const prev = sorted[i - 1].mesh;
            graph[currentId].push(prev.uuid);
        }
        if (i < sorted.length - 1) {
            const next = sorted[i + 1].mesh;
            graph[currentId].push(next.uuid);
        }
    }
}

//add manual connection


function addManualConnection(graph, pathSegments, connections) {
    connections.forEach(([nameA, nameB]) => {
        const meshA = pathSegments.find(m => m.name === nameA);
        const meshB = pathSegments.find(m => m.name === nameB);

        if (!meshA || !meshB) {
            console.warn(`Could not find meshes: ${nameA}, ${nameB}`);
            return;
        }

        if (!graph[meshA.uuid]) graph[meshA.uuid] = [];
        if (!graph[meshB.uuid]) graph[meshB.uuid] = [];

        if (!graph[meshA.uuid].includes(meshB.uuid)) {
            graph[meshA.uuid].push(meshB.uuid);
        }
        if (!graph[meshB.uuid].includes(meshA.uuid)) {
            graph[meshB.uuid].push(meshA.uuid);
        }

        console.log(`Manually connected: ${nameA} ↔ ${nameB}`);
    });
}

let manualConnections = [
    ['walk062', 'walk003'],
    ['walk062', 'walk004']
]

addManualConnection(graph, pathSegments, manualConnections);

//test the graph

// for (const [uuid, neighbors] of Object.entries(graph)) {
//     const mesh = pathSegments.find(m => m.uuid === uuid);
//     const name = mesh ? mesh.name : uuid;
//     const neighborNames = neighbors.map(nid => {
//         const neighbor = pathSegments.find(m => m.uuid === nid);
//         return neighbor ? neighbor.name : nid;
//     });
//     console.log(`${name} → [${neighborNames.join(', ')}]`);
// }


function findClosestSegment(position) {
    let closest = null;
    let minDistance = Infinity;
    pathSegments.forEach(segment => {
        const center = segment.userData.center;
        const distance = center.distanceTo(position);
        if (distance < minDistance) {
            minDistance = distance;
            closest = segment;
        }
    });
    return closest;
}

function findShortestPath(startUUID, endUUID) {
    const queue = [[startUUID]];
    const visited = new Set();

    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];

        if (node === endUUID) return path;

        if (!visited.has(node)) {
            visited.add(node);
            const neighbors = graph[node] || [];
            neighbors.forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    queue.push([...path, neighbor]);
                }
            });
        }
    }

  return null; // No path found
}

const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });


function highlightPath(pathUUIDs) {
    pathSegments.forEach(segment => {
        if (pathUUIDs.includes(segment.uuid)) {
            if (!segment.material || segment.material === highlightMaterial) {
                segment.material = highlightMaterial;
            }
        }
    });
}


function findPath(start, end){

    const path = findShortestPath(start.uuid, end.uuid);
    if (path) {
        highlightPath(path);
        console.log("Path found:", path);
    } else {
        console.warn("No path found between segments.");
    }
}

routingButtonDesk.addEventListener('click', function(e){
    e.preventDefault();

    const endLocation = new THREE.Vector3(-4, 0.45, 2);

    const startSegment = findClosestSegment(userPin.position);
    const endSegment = findClosestSegment(endLocation);

    findPath(startSegment, endSegment);

})

function animate() {
    controls.update();

    pins.forEach((pin) => {
        if(pin.pinObject){ // conscheck if the pinObject is loaded
            pin.pinObject.lookAt(camera.position); // make the pin look at the camera
        }
    })

    renderer.render( scene, camera );
}

animatePinsBobbing(pins); // start the bobbing animation
window.addEventListener('resize', onWindowResize, false); //add event listener to resize the canvas when the window is resized
renderer.setAnimationLoop( animate );