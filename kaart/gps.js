// Define the reference (origin) using ZOMERLUST:
const originLat = 50.98182806411356;
const originLon = 4.510199635472556;
const originX = -1.06; // Three.js x-coordinate for ZOMERLUST
const originZ = 4.29;  // Three.js z-coordinate for ZOMERLUST

// Define the second reference (anchor) using BRUG:
const anchorLat = 50.98205076377594;
const anchorLon = 4.513417619675936;
const anchorX = 0.77;  // Three.js x-coordinate for BRUG
const anchorZ = 4.11;  // Three.js z-coordinate for BRUG

function gpsDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function threeDistance(x1, z1, x2, z2) {
  return Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
}

// Compute the scale factor (meters per Three.js unit)
const realDist = gpsDistance(originLat, originLon, anchorLat, anchorLon);
const threeDist = threeDistance(originX, originZ, anchorX, anchorZ);
const metersPerUnit = realDist / threeDist;

export function latLonToXz(lat, lon) {
  const R = 6371000; // Earth's radius in meters
  const toRad = deg => deg * Math.PI / 180;

  // Calculate the offsets in meters from the origin.
  // The latitude offset (northward) is computed in meters.
  // The longitude offset uses the cosine of the origin latitude.
  const offsetX = (lon - originLon) * toRad(1) * R * Math.cos(toRad(originLat));
  const offsetZ = (lat - originLat) * toRad(1) * R;
  
  // Adjust for your scene's orientation:
  // - Keep the x offset as is (eastwards is positive x).
  // - Invert the z offset because an increase in latitude means a decrease in Three.js z.
  const threeX = originX + offsetX / metersPerUnit;
  const threeZ = originZ - offsetZ / metersPerUnit;
  
  return { x: threeX, z: threeZ };
}