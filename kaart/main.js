import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import * as turf from '@turf/turf';

import { locations } from './data.js';
import { latLonToXz } from './gps.js';


// In your main JS file
const setVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVh();
window.addEventListener('resize', setVh);

const canvas = document.querySelector('#canvas'); //fetch the canvas element
const filterMenuDesktop = document.querySelector('#filterMenuDesktop'); //fetch the filter menu element
// const routingButtonDesk = document.querySelector('#routingButtonDesk'); //fetch the routing button element
const routingButtonMobile = document.querySelector('#routingButtonMobile'); //fetch the routing button element

// let userLocation = {
//     lat: 51.024715681650626, 
//     lon: 4.484867621683329
// };
let userLocation = null;
let watchId = null;
let lastLocationUpdate = Date.now();
let userPin;

//Hofstade
const hofstadeArea = turf.polygon([[
    [4.494088231355489, 50.987722096733144], //West
    [4.5151328588855435, 50.99614496511054], //North
    [4.524228288842734, 50.987741393661466], //East
    [4.511252698399218, 50.97770763775083], //South East
    [4.504577153476509, 50.977681368528245], //South West
    [4.494088231355489, 50.987722096733144] //close polygon
]]);

//Kruidtuin
// const hofstadeArea = turf.polygon([[
//   [4.4839066489567285, 51.025066903876834], //NW lon lat => turf expects [lon, lat]
//   [4.4856340447309915, 51.02520835338684], //NE
//   [4.486282632955668, 51.024080845301015], //SE
//   [4.484007685313336, 51.02393939235056], //SW
//   [4.4839066489567285, 51.025066903876834] //close polygon
// ]]);

//Terhagen
// const hofstadeArea = turf.polygon([[ // Hofstade area
//     [4.371810397596004, 51.08870382424354], //NW
//     [4.4007779739165525, 51.085030392184855], //NE
//     [4.4030002509694075, 51.077829619045545], //SE
//     [4.375007357566778, 51.07978912409367], //SW
//     [4.371810397596004, 51.08870382424354] //close polygon
// ]]);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const height = canvas.clientHeight; //get the height of the canvas
const width = canvas.clientWidth; //get the width of the canvas
const raycaster = new THREE.Raycaster(); //create a raycaster to detect mouse events
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); //create a WebGL renderer in canvas element
renderer.setSize(width, height, false); //set the size of the renderer to the size of the canvas
camera.aspect = width / height; //update the aspect ratio of the camera so it doesnt get distorted
camera.updateProjectionMatrix();
camera.position.set(0, 0, 20);

const controls = new OrbitControls(camera, renderer.domElement); //create controls for user to move the camera
controls.enableDamping = true; 

let pins = [];
const graph = [];
const pathSegments = [];
//const pathSegments = []; //array to hold the path segments
const activeFilters = []; //make cookie in future

const mapGroup = new THREE.Group(); //create a group to hold the map and pins
scene.add(mapGroup); //add the group to the scene

//classes
class locationPin{
    constructor(id, category, position, model, active, scale, data){
        this.id = id;
        this.category = category;
        this.position = position;
        this.model = model;
        this.active = active; 
        this.scale = scale;
        this.data = data; // Initialize info to an empty object
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

renderer.setClearColor(0x000000, 0); //set the background color of the renderer


let mapModel;
//map
const loader = new GLTFLoader();
loader.load('./assets/models/mapZuiderbadV6.glb', function (gtlf){
    //scale model down to fit in the scene
    mapModel = gtlf.scene;
    mapModel.scale.set(1, 1, 1); //scale the model down to fit in the scene
    mapModel.position.set(0, 0, 0); //position the model in the scene
    //gtlf.scene.rotation.x = Math.PI / 4;
    mapGroup.add(gtlf.scene); //add the loaded model to the scene
}, undefined, function (error) {
    console.error(error);
});

//add Pins to map
generatePins(locations);

// window.addEventListener('DOMContentLoaded', () => {
//     // Add event listeners for the routing button
//     console.log("window loaded");
//     const params = new URLSearchParams(window.location.search);
//     const pinId = params.get('location');
//     console.log("Pin ID: ", pinId);
//     console.log(pins, locations.length);
//     if(pinId){
//         for(let i = 0; i < locations.length; i++){
//             console.log(pins[i]);
//             if(pins[i].id == pinId){
//                 focusCameraOnObject(camera, controls, pins[i].pinObject, 2);
//                 console.log("Pin found: ", pins[i].info.name);
//                 break;
//             }
//         }
//     }
// })

//get user location
let feedback = "";
if(navigator.geolocation){
    feedback = "test";
    console.log(feedback);

    navigator.geolocation.getCurrentPosition(function(position){
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        feedback = "User location: " + lat + ", " + lon;
        console.log(feedback);

        const userPoint = turf.point([lon, lat]); //create a point from the user location
        const isInside = turf.booleanPointInPolygon(userPoint, hofstadeArea);

        if(isInside){
            console.log("User is inside Domein Hofstade, tracking location...");
            const userCo = latLonToXz(lat, lon);
            loader.load('./assets/models/userLocation.glb', function(gltf){
            userPin = gltf.scene;
            userPin.scale.set(1, 1, 1); 
            userPin.position.set(userCo.x, 0.45, userCo.z); //position the model in the scene
            scene.add(userPin); 

            focusCameraOnObject(camera, controls, userPin, 2);
            }, undefined, function(error){
                console.error(error);
            })

            startTrackingUser();
        }else{
            console.log("User not inside Domein Hofstade");

            //focusCameraOnObject(camera, controls, mapModel, 2);
        }
    })
}else{

}

// window.addEventListener('load',() => {
//   if(navigator.geolocation){
//     navigator.geolocation.getCurrentPosition(position => {
//         const lat = position.coords.latitude;
//         const lon = position.coords.longitude;
//         userLocation = {
//             lat: lat, 
//             lon: lon
//         };
//         console.log("Initial user location:", userLocation);
//         const userPoint = turf.point([lon, lat]); //create a point from the user location
//         const isInside = turf.booleanPointInPolygon(userPoint, hofstadeArea);

//         if(isInside){
//             console.log("User is inside Domein Hofstade, tracking location...");
//             // if(userLocation){
//             //     const userCo = latLonToXz(userLocation.lat, userLocation.lon);

//             //     loader.load('./assets/models/userLocation.glb', function(gltf){
//             //     userPin = gltf.scene;
//             //     userPin.scale.set(1, 1, 1); 
//             //     userPin.position.set(userCo.x, 0.45, userCo.z); //position the model in the scene
//             //     scene.add(userPin); 

//             //     focusCameraOnObject(camera, controls, userPin, 2);
//             //     }, undefined, function(error){
//             //         console.error(error);
//             //     })
//             // }
//             startTrackingUser();
//         }else{
//             console.log("User not inside Domein Hofstade");
//         }
  
//     }, error => {
//       console.error("Permission denied or Error getting location: ", error);
//     },
//     {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 10000
//     });
//   }else{
//     console.log("navigator not supported by browser");
//   }
// })


//paths
// loader.load('./assets/models/walk.glb', function (gltf){
//     const path = gltf.scene;
//     path.scale.set(1, 1, 1); //scale the model down to fit in the scene
//     path.position.set(0, 0.1, 0); //position the model in the scene
//     mapGroup.add(path); //add the loaded model to the scene

//     // path.traverse((child) => {
//     //     if (child.isMesh) {
//     //         child.geometry.computeBoundingBox();
//     //         const bbox = child.geometry.boundingBox;
//     //         const center = new THREE.Vector3();
//     //         bbox.getCenter(center);
//     //         child.userData.center = center;

//     //         pathSegments.push(child);
//     //     }
//     // });

//     path.traverse((child) => {
//         if (child.isMesh) {
//             child.geometry.computeBoundingBox();
//             const bbox = child.geometry.boundingBox.clone(); // clone to avoid mutation
//             const center = new THREE.Vector3();
//             bbox.getCenter(center);
//             child.updateWorldMatrix(true, false);
//             child.localToWorld(center); // convert to world space
//             child.userData.center = center;

//             pathSegments.push(child);
//         }
//     });


//     // console.log("Total path segments found:", pathSegments.length);
// }, undefined, function (error) {
//     console.error(error);
// });

//Manual User Pin
// const userCo = latLonToXz(50.983357965649375, 4.514759220386691);
// loader.load('./assets/models/userLocation.glb', function(gltf){
// userPin = gltf.scene;
// userPin.scale.set(1, 1, 1); 
// userPin.position.set(userCo.x, 0.45, userCo.z); //position the model in the scene
// scene.add(userPin); 

// focusCameraOnObject(camera, controls, userPin, 2);
// }, undefined, function(error){
//     console.error(error);
// })


// const firstAidCo = latLonToXz(50.985140246874835, 4.515627794721486);
// const firstAidPin = new locationPin(
//     0,
//     "firstaid",
//     new THREE.Vector3(firstAidCo.x, 0.45, firstAidCo.z),
//     //new THREE.Vector3(-4, 0.45, 2),
//     "./assets/models/firstAidPin.glb",
//     true,
//     1,
//     {
//         name: "EHBO",
//         openingHours: null,
//         description: "Hier kan je terecht voor eerste hulp bij ongevallen. Bij een ongeval, bel 112.",
//         url: null
//     }
// );
// await firstAidPin.initialize(mapGroup, pins);

// let l = locations[1];

// const locationCo = latLonToXz(parseFloat(l.coordinates.lat), parseFloat(l.coordinates.lon));
// const newPin = new locationPin(
//     0,
//     l.category,
//     new THREE.Vector3(locationCo.x, 0.45, locationCo.z),
//     l.model,
//     true,
//     l.scale,
//     {
//         name: l.data.name,
//         openingHours: l.data.openingHours,
//         description: l.data.description,
//         url: l.data.url
//     }
// );
// await newPin.initialize(mapGroup, pins);

// const zuiderBadCo = latLonToXz(50.98548325417922, 4.516110690361381);
// const zuiderbadPin = new locationPin(
//     1, 
//     "food", 
//     new THREE.Vector3(zuiderBadCo.x, 0.45, zuiderBadCo.z),
//     "./assets/models/zuiderBadPin.glb", 
//     false, 
//     1,
//     {
//         name: "Zuiderbad Strandbar",
//         openingHours: {
//             'monday': 'Gesloten', 
//             'tuesday': 'Gesloten', 
//             'wednesday': '12:00 – 23:00',
//             'thursday': '18:00 – 23:00', 
//             'friday': '18:00 – 23:00', 
//             'saturday': '11:00 – 18:30', 
//             'sunday': '11:00 – 18:30'
//         },
//         description: "Welkom in de strandbar op de meest magische plek op het domein van Sport Vlaanderen Hofstade! Op het menu: frisse dranken, beachfood & holiday vibes. De strandbar beschikt over een ruim terras en serre (bij regenweer). Welkom zonder reserveren.",
//         url: null
//     }
// );

// await zuiderbadPin.initialize(mapGroup, pins);

// const zomerlustCo = latLonToXz(50.98275020080574, 4.510684910801831)
// const zomerlustPin = new locationPin(
//     2,
//     'food',
//     new THREE.Vector3(zomerlustCo.x, 0.45, zomerlustCo.z),
//     "./assets/models/zuiderbadPin.glb",
//     false,
//     1,
//     {
//         name: "Zomerlust",
//         openingHours: {
//             'monday': 'Gesloten', 
//             'tuesday': 'Gesloten', 
//             'wednesday': '13:00 – 18:00',
//             'thursday': 'Gesloten', 
//             'friday': 'Gesloten',
//             'saturday': '10:00 – 18:00', 
//             'sunday': '10:00 – 18:00'
//         },
//         description: 'In deze kleurrijke selfservice-bar met ruim terras & de leukste (én grootste) buitenspeeltuin kan je terecht voor lekkere snacks, zoetigheden en koele dranken. De toonbank wordt voorzien van gebak, smoothies en taart.',
//         url: null
//     }
// )
// await zomerlustPin.initialize(mapGroup, pins);

//Lighting
const dirLight = new THREE.DirectionalLight(0xffffff, 3);  // Subtle intensity
dirLight.position.set(5, 10, 7);  // Angle it so that it doesn't cause harsh shadows
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 1));

//filter event listener
filterMenuDesktop.addEventListener('click', function(e){
    e.preventDefault();
    let button = e.target.closest('.filterButton');

    button.classList.toggle('active');
    button.querySelector('i').classList.toggle('active');

    if(button && button.classList.contains('filterButton')){
        let clickedFilter = (button.dataset.filter).toLowerCase();
        //if clickedFilter is not in activeFilters, add it to activeFilters
        if(!activeFilters.includes(clickedFilter)){
            //if clickedFilter is not in activeFilters, add it to activeFilters
            activeFilters.push(clickedFilter);
        } else {
            //if clickedFilter is in activeFilters, remove it from activeFilters
            activeFilters.splice(activeFilters.indexOf(clickedFilter), 1);
        }

        console.log(clickedFilter);
        
        pins.forEach((pin) => {
            let pinCategory = pin.category.toLowerCase();
            if(pinCategory === clickedFilter){
                if(pin.active){
                    pin.active = false;
                }else{
                    pin.active = true;
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
        if(clickedPin.active){
            focusCameraOnObject(camera, controls, clickedPin.pinObject, 2);
            displayLocationInfo(clickedPin);
        }

    }
})

document.querySelectorAll('.closeInfo').forEach(button => {
    button.addEventListener('click', function(e){
        e.preventDefault();
        //console.log("close button clicked");
        closeLocationInfo();
    })
})


function displayLocationInfo(pin){
    let infoContainer = document.querySelector('.infoContainer');
    infoContainer.classList.remove('hidden');
    document.querySelector('#desktopAsside').classList.add('active');
    document.querySelector('#desktopAsside .divider').classList.remove('hidden');

    //console.log(pin.data.name);

    document.querySelector('.infoContainer .locationTitle').innerHTML = pin.data.name;
    document.querySelector('.infoContainer .locationDescription').innerHTML = pin.data.description;
    document.querySelector('.infoContainer .shareButton').dataset.locationId = pin.id;

    let moreInfoButton = document.querySelector('.infoContainer .moreInfoButton');

    if(pin.data.url){
        moreInfoButton.classList.remove('hidden');
        moreInfoButton.href = pin.data.url;
    }

    let shareButton = document.querySelector('.infoContainer .shareButton');
    shareButton.dataset.locationId = pin.id;
}

function closeLocationInfo(){
    let infoContainer = document.querySelector('.infoContainer');
    infoContainer.classList.add('hidden');
    document.querySelector('#desktopAsside').classList.remove('active');
    document.querySelector('#desktopAsside .divider').classList.add('hidden');
}


function focusCameraOnObject(camera, controls, object, duration) {
    // Define a 45-degree angle offset (diagonal from above and behind)
    const distance = 3; // Adjust this to control zoom level
    const angle = Math.PI / 4; // 45 degrees in radians

    // Calculate offset vector at 45° angle
    const offset = new THREE.Vector3(
        distance * Math.sin(angle),
        distance * Math.sin(angle),
        distance * Math.cos(angle)
    );

    const newTarget = object.position.clone();
    const newCameraPosition = object.position.clone().add(offset);

    // Animate camera position
    gsap.to(camera.position, {
        x: newCameraPosition.x,
        y: newCameraPosition.y,
        z: newCameraPosition.z,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: () => {
            camera.lookAt(newTarget);
            controls.update();
        },
        onComplete: () => {
            controls.target.copy(newTarget);
            controls.update();
        }
    });

    // Animate controls target (optional, for smooth transition)
    gsap.to(controls.target, {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
        duration: duration,
        ease: "power2.inOut"
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

        //console.log(`Manually connected: ${nameA} ↔ ${nameB}`);
    });
}

let manualConnections = [
    ['walk062', 'walk003'],
    ['walk062', 'walk004']
]

//addManualConnection(graph, pathSegments, manualConnections);

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

if(checkIfAppleOS()){
    // console.log("Apple OS detected");
    let shareIcons = document.querySelectorAll('.shareButton i');
    shareIcons.forEach(icon => {
        icon.classList.add('apple');
    })
}else{
    let shareIcons = document.querySelectorAll('.shareButton i');
    shareIcons.forEach(icon => {
        icon.classList.remove('apple');
    })
}


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
        //console.log("Path found:", path);
    } else {
        //console.warn("No path found between segments.");
    }
}

// routingButtonDesk.addEventListener('click', function(e){
//     e.preventDefault();
//     const endLocation = new THREE.Vector3(-4, 0.45, 2);

//     const startSegment = findClosestSegment(userPin.position);
//     const endSegment = findClosestSegment(endLocation);

//     findPath(startSegment, endSegment);
// })


function startTrackingUser() {
    let lastLocationUpdate = Date.now(); // Initialize this at the start

    // Update user location if geolocation has changed
    const watchId = navigator.geolocation.watchPosition(function(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        userPositionUpdate(lat, lon);
        lastLocationUpdate = Date.now(); // Update the timestamp here too

        //console.log("User location updated:", userLocation, "at", new Date().toLocaleTimeString());
    }, function(error) {
        console.error("Error getting location: ", error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
    });

    setInterval(() => {
        const currentTime = Date.now(); // Correct usage
        if (currentTime - lastLocationUpdate > 5000) {
            console.log("Manual update at: " + new Date(currentTime).toISOString());
            navigator.geolocation.getCurrentPosition(function(position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                userPositionUpdate(lat, lon);
                lastLocationUpdate = Date.now();
            }, function(error) {
                console.error("Error getting location: ", error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0
            });
        }
    }, 5000);
}

function userPositionUpdate(lat, lon){
    const userCo = latLonToXz(lat, lon);
    userPin.position.set(userCo.x, 0.45, userCo.z); //position the model in the scene
    //focusCameraOnObject(camera, controls, userPin, 2);
    console.log("updated user location: "+lat, lon);
    // let timestamp = new Date(Date.now()).toLocaleTimeString();
}

async function generatePins(locationsArray){
    for(let i = 0; i < locationsArray.length; i++){
        const l = locationsArray[i];
        const locationCo = latLonToXz(parseFloat(l.coordinates.lat), parseFloat(l.coordinates.lon));
        const newPin = new locationPin(
            i,
            l.category,
            new THREE.Vector3(locationCo.x, 0.45, locationCo.z),
            l.model,
            l.active,
            l.scale,
            {
                name: l.data.name,
                openingHours: l.data.openingHours,
                description: l.data.description,
                url: l.data.url
            }
        );
        await newPin.initialize(mapGroup, pins);
    }
}

function checkIfAppleOS(){
    let userAgent = window.navigator.userAgent;
    let platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    let applePlatforms = ['macos', 'macintosh', 'macintel', 'macppc', 'mac68k', 'iphone', 'ipad', 'ipod'];

    if(applePlatforms.includes(platform.toLowerCase())){
        return true;
    }else{
        return false;
    }
}

function shareLocation(locationId){
    const url = `${window.location.origin}${window.location.pathname}?location=${locationId}`;

    navigator.clipboard.writeText(url).then(() => { 
        console.log("URL copied to clipboard: " + url);
        //toggle hidden class on pop up
    })
}

document.querySelectorAll('.shareButton').forEach(button => {
    button.addEventListener('click', function(e){
        e.preventDefault();
        let locationId = button.dataset.locationId = button.dataset.locationId;
        shareLocation(0);
    })
})

//ANIMATION LOOP

function animate() {
    controls.update();

    pins.forEach((pin) => {
        if(pin.pinObject){ // conscheck if the pinObject is loaded
            pin.pinObject.lookAt(camera.position); // make the pin look at the camera
        }
    })

    renderer.render( scene, camera );
}

//start animating pins if window loaded
window.addEventListener('load', () => {
    //delays start of animation to ensure all pins are loaded
    setTimeout(function(){
        animatePinsBobbing(pins);
    }, 1000);
    
    console.log(pins);
});

window.addEventListener('resize', onWindowResize, false); //add event listener to resize the canvas when the window is resized
renderer.setAnimationLoop( animate );