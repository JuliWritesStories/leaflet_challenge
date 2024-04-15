async function createMap(){
    // URL for earthquake data
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
    try {
        // Fetch earthquake data
        const response = await fetch(url);
        const data = await response.json();
        // Create Leaflet map centered at [30, 120] with zoom level 4
        const map = L.map('map').setView([30, 120],4);

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Iterate through earthquake data and add circle markers to the map
        data.features.forEach(earthquake => {
            const latitude = earthquake.geometry.coordinates[1];
            const longitude = earthquake.geometry.coordinates[0];
            const magnitude = earthquake.properties.mag;
            const depth = earthquake.geometry.coordinates[2];
            const radius = Math.max(magnitude * 2, 5); // Ensure minimum radius is 5
            const markerSize = radius * 2;

            // Calculate popup size based on magnitude
            const popupSize = calculatePopupSize(magnitude);

            // Create circle marker for each earthquake, with color determined by depth and size by magnitude
            const marker = L.circleMarker([latitude, longitude], {
                radius: markerSize,
                fillColor: depthColor(depth),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // Create popup content with earthquake information
            const popupContent = `<div class="popup-content" style="font-size: ${popupSize}px;"><b>Location:</b> ${earthquake.properties.place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth}</div>`;

            // Bind popup to the marker
            marker.bindPopup(popupContent, { className: 'custom-popup' });
        });

        // Add legend to the map
        addLegend(map);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add legend to the map
function addLegend(map) {
    const legendContainer = L.DomUtil.create('div', 'legend-container');
    
    // Define legend dictionary mapping depth ranges to colors
    const legendDict = {
        "Depth < 10": "blue",
        "Depth < 30": "green",
        "Depth < 50": "yellow",
        "Depth < 70": "orange",
        "Depth < 90": "red",
        "Depth >= 90": "purple",
    };

    // Populate legend with depth ranges and colors
    for (const key in legendDict) {
        const color = legendDict[key];
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = '<i class="legend-icon" style="background:' + color + '"></i>' + key;
        legendContainer.appendChild(legendItem);
    }

    // Add legend container to map
    document.body.appendChild(legendContainer); // Append to document body
}

// Function to determine color based on earthquake depth
function depthColor(depth) {
    if (depth < 10) {
        return 'blue';
    } else if (depth < 30) {
        return 'green';
    } else if (depth < 50) {
        return 'yellow';
    } else if (depth < 70) {
        return 'orange';
    } else if (depth < 90) {
        return 'red';
    } else {
        return 'purple';
    }
}

// Function to calculate popup size based on earthquake magnitude
function calculatePopupSize(magnitude) {
    // Scale popup size based on magnitude range
    if (magnitude <= 5) {
        return 12;
    } else if (magnitude <= 6) {
        return 16;
    } else if (magnitude <= 7) {
        return 20;
    } else if (magnitude <= 8) {
        return 24;
    } else {
        return 28;
    }
}

// Call the createMap function to initialize the map
createMap();
