/**
 * HomeFinder - Main Application Script
 * Day 2 Topic: JavaScript, DOM Manipulation, JSON & Fetch API
 * Author: Person 1 (Frontend Developer & Repo Owner)
 */

// ============================================================================
// CONFIGURATION & MOCK DATA MODE
// Set USE_MOCK to true to test the frontend before the backend (Person 2) is ready.
// Set USE_MOCK to false to fetch from the real Express REST API at /api/properties.
// ============================================================================
const USE_MOCK = false;

// Day 2: Sample Bengaluru properties for offline testing and lab demonstration
const INITIAL_MOCK_PROPERTIES = [
  {
    _id: "mock-101",
    title: "Sunny 2 BHK with Balcony in Koramangala",
    price: 32000,
    bhk: 2,
    location: "Koramangala 4th Block, Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Lift", "Security", "Power Backup"],
    ownerName: "Rajesh Sharma",
    ownerPhone: "+91 98765 43210",
    createdAt: new Date("2026-10-15").toISOString()
  },
  {
    _id: "mock-102",
    title: "Luxury 3 BHK Penthouse in Indiranagar",
    price: 65000,
    bhk: 3,
    location: "100ft Road, Indiranagar, Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Gym", "Swimming Pool", "Lift", "Security", "Power Backup", "Garden"],
    ownerName: "Priya Nair",
    ownerPhone: "+91 98450 12345",
    createdAt: new Date("2026-10-18").toISOString()
  },
  {
    _id: "mock-103",
    title: "Cozy 1 BHK Studio for Tech Professionals",
    price: 18000,
    bhk: 1,
    location: "HSR Layout Sector 2, Bengaluru",
    lat: 12.9121,
    lng: 77.6446,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Security", "Power Backup"],
    ownerName: "Arun Kumar",
    ownerPhone: "+91 97312 98765",
    createdAt: new Date("2026-10-20").toISOString()
  },
  {
    _id: "mock-104",
    title: "Spacious 4 BHK Gated Villa with Private Lawn",
    price: 85000,
    bhk: 4,
    location: "ITPL Main Road, Whitefield, Bengaluru",
    lat: 12.9698,
    lng: 77.7500,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup", "Garden"],
    ownerName: "Sneha Reddy",
    ownerPhone: "+91 99001 54321",
    createdAt: new Date("2026-10-22").toISOString()
  },
  {
    _id: "mock-105",
    title: "Charming 2 BHK Flat near Metro Station",
    price: 26000,
    bhk: 2,
    location: "JP Nagar 5th Phase, Bengaluru",
    lat: 12.9063,
    lng: 77.5857,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Lift", "Security", "Garden"],
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98860 67890",
    createdAt: new Date("2026-10-25").toISOString()
  }
];

// Helper to get mock data from localStorage if available, or initialize it
function getMockProperties() {
  const stored = localStorage.getItem("homefinder_mock_properties");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to parse mock data from localStorage, resetting.");
    }
  }
  localStorage.setItem("homefinder_mock_properties", JSON.stringify(INITIAL_MOCK_PROPERTIES));
  return INITIAL_MOCK_PROPERTIES;
}

// ============================================================================
// GLOBAL STATE & DOM ELEMENTS
// ============================================================================
let leafletMap = null;
let markersLayerGroup = null;

// Day 2: DOM Element Selections
const filterForm = document.getElementById("filter-form");
const locationInput = document.getElementById("filter-location");
const bhkSelect = document.getElementById("filter-bhk");
const minPriceInput = document.getElementById("filter-min-price");
const maxPriceInput = document.getElementById("filter-max-price");
const btnResetFilters = document.getElementById("btn-reset-filters");
const btnEmptyReset = document.getElementById("btn-empty-reset");
const propertyGrid = document.getElementById("property-grid");
const loadingSpinner = document.getElementById("loading-spinner");
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const mockBadge = document.getElementById("mock-badge");

// ============================================================================
// DAY 2: LEAFLET MAP INITIALIZATION
// ============================================================================
function initMap() {
  try {
    if (typeof L === "undefined") {
      console.warn("Leaflet (L) library is not yet loaded or CDN is unreachable.");
      return;
    }
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    // Center coordinates for Bengaluru city
    const bengaluruCoords = [12.9716, 77.5946];

    // Initialize Leaflet Map
    leafletMap = L.map("map").setView(bengaluruCoords, 11);

    // Day 2: OpenStreetMap Tile Layer via CDN
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    // Layer group to manage markers dynamically
    markersLayerGroup = L.layerGroup().addTo(leafletMap);
  } catch (err) {
    console.warn("Leaflet map initialization warning:", err);
  }
}

// Day 2: Update Leaflet markers dynamically on the map
function updateMapMarkers(properties) {
  if (typeof L === "undefined" || !leafletMap || !markersLayerGroup) return;

  try {
    // Clear existing markers
    markersLayerGroup.clearLayers();

  if (!properties || properties.length === 0) return;

  const validBounds = [];

  properties.forEach((prop) => {
    if (typeof prop.lat === "number" && typeof prop.lng === "number") {
      const formattedPrice = formatCurrency(prop.price);

      // Create Leaflet marker
      const marker = L.marker([prop.lat, prop.lng]);

      // Bind popup with title, price, and link
      const popupHtml = `
        <div class="custom-popup">
          <div class="popup-title">${escapeHtml(prop.title)}</div>
          <div class="popup-price">${formattedPrice} / month &bull; ${prop.bhk} BHK</div>
          <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">📍 ${escapeHtml(prop.location)}</p>
          <a href="details.html?id=${encodeURIComponent(prop._id)}" class="btn btn-primary btn-sm" style="display:inline-block; font-size: 0.75rem; padding: 0.25rem 0.5rem;">View Details</a>
        </div>
      `;
      marker.bindPopup(popupHtml);
      markersLayerGroup.addLayer(marker);

      validBounds.push([prop.lat, prop.lng]);
    }
  });

  // Automatically pan/zoom to fit visible markers
  if (validBounds.length > 0) {
    leafletMap.fitBounds(validBounds, { padding: [40, 40], maxZoom: 14 });
  }
  } catch (err) {
    console.warn("Error updating map markers:", err);
  }
}

// ============================================================================
// DAY 2: FETCH API & MOCK FILTERING
// ============================================================================

// Collect current filter criteria from form
function getFilterParams() {
  const params = {};

  const location = locationInput.value.trim();
  if (location) params.location = location;

  const bhk = bhkSelect.value;
  if (bhk) params.bhk = bhk;

  const minPrice = minPriceInput.value.trim();
  if (minPrice) params.minPrice = minPrice;

  const maxPrice = maxPriceInput.value.trim();
  if (maxPrice) params.maxPrice = maxPrice;

  const checkedAmenities = Array.from(
    document.querySelectorAll('input[name="amenity"]:checked')
  ).map((cb) => cb.value);

  if (checkedAmenities.length > 0) {
    params.amenities = checkedAmenities.join(",");
  }

  return params;
}

// Day 2: Filter mock data in memory for local testing
function filterMockData(params) {
  let list = getMockProperties();

  if (params.location) {
    const locLower = params.location.toLowerCase();
    list = list.filter(
      (p) =>
        (p.location && p.location.toLowerCase().includes(locLower)) ||
        (p.title && p.title.toLowerCase().includes(locLower))
    );
  }

  if (params.bhk) {
    list = list.filter((p) => Number(p.bhk) === Number(params.bhk));
  }

  if (params.minPrice) {
    list = list.filter((p) => p.price >= Number(params.minPrice));
  }

  if (params.maxPrice) {
    list = list.filter((p) => p.price <= Number(params.maxPrice));
  }

  if (params.amenities) {
    const requiredAmenities = params.amenities.split(",");
    list = list.filter((p) => {
      if (!Array.isArray(p.amenities)) return false;
      return requiredAmenities.every((amenity) => p.amenities.includes(amenity));
    });
  }

  return list;
}

// Day 2: Main function to fetch properties from server or mock dataset
async function loadProperties() {
  // Show loading indicator
  setLoading(true);

  const filterParams = getFilterParams();

  try {
    let properties = [];

    if (USE_MOCK) {
      // Simulate network latency for realistic UX feel
      await new Promise((resolve) => setTimeout(resolve, 250));
      properties = filterMockData(filterParams);
    } else {
      // Day 2: Fetch API call to backend REST endpoint with URL query parameters
      const query = new URLSearchParams(filterParams).toString();
      const endpoint = query ? `/api/properties?${query}` : "/api/properties";

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      // Day 2: Parsing JSON response body
      properties = await response.json();
    }

    renderProperties(properties);
    updateMapMarkers(properties);
  } catch (error) {
    console.error("Error loading properties:", error);
    renderErrorState(error.message);
  } finally {
    setLoading(false);
  }
}

// ============================================================================
// DAY 2: DOM MANIPULATION & RENDERING
// ============================================================================

// Helper to format prices into Indian Rupee style (e.g. ₹32,000)
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

// XSS Prevention helper
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Toggle loading state
function setLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.style.display = "block";
    propertyGrid.style.display = "none";
    emptyState.style.display = "none";
    resultsCount.textContent = "Loading properties...";
  } else {
    loadingSpinner.style.display = "none";
  }
}

// Display error state if API fails
function renderErrorState(message) {
  propertyGrid.style.display = "none";
  emptyState.style.display = "block";
  resultsCount.textContent = "Error loading listings";
  emptyState.innerHTML = `
    <div class="empty-state-icon">⚠️</div>
    <h3>Failed to load properties</h3>
    <p style="color: var(--danger);">${escapeHtml(message)}</p>
    <button type="button" class="btn btn-secondary" onclick="loadProperties()">Try Again</button>
  `;
}

// Day 2: Dynamically construct property cards in the DOM
function renderProperties(properties) {
  // Clear previous listings
  propertyGrid.innerHTML = "";

  if (!properties || properties.length === 0) {
    propertyGrid.style.display = "none";
    emptyState.style.display = "block";
    resultsCount.textContent = "Showing 0 properties";
    return;
  }

  emptyState.style.display = "none";
  propertyGrid.style.display = "grid";
  resultsCount.textContent = `Showing ${properties.length} propert${properties.length === 1 ? "y" : "ies"}`;

  // Day 2: Iterate over property array and create DOM elements
  properties.forEach((prop) => {
    const card = document.createElement("article");
    card.className = "property-card";
    card.setAttribute("data-id", prop._id);

    // Fallback image placeholder if provided URL fails
    const fallbackImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
    const imageUrl = prop.imageUrl ? escapeHtml(prop.imageUrl) : fallbackImage;

    // Render amenity pills
    const amenitiesHtml = (prop.amenities || [])
      .slice(0, 3)
      .map((item) => `<span class="amenity-tag">${escapeHtml(item)}</span>`)
      .join("");

    const remainingAmenities = (prop.amenities || []).length > 3
      ? `<span class="amenity-tag">+${(prop.amenities.length - 3)} more</span>`
      : "";

    // Card inner HTML structure
    card.innerHTML = `
      <div class="card-image-wrap">
        <img
          src="${imageUrl}"
          alt="${escapeHtml(prop.title)}"
          class="card-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >
        <span class="badge-bhk">${prop.bhk} BHK</span>
        <span class="badge-price">${formatCurrency(prop.price)} / mo</span>
      </div>

      <div class="card-body">
        <h3 class="card-title" title="${escapeHtml(prop.title)}">${escapeHtml(prop.title)}</h3>
        <p class="card-location">📍 ${escapeHtml(prop.location)}</p>

        <div class="amenity-tags">
          ${amenitiesHtml}
          ${remainingAmenities}
        </div>

        <div class="card-footer">
          <div class="card-owner-info">
            <span>Owner:</span>
            <div class="card-owner-name">${escapeHtml(prop.ownerName || "Verified Owner")}</div>
          </div>
          <a href="details.html?id=${encodeURIComponent(prop._id)}" class="btn btn-primary btn-sm">
            View Details &rarr;
          </a>
        </div>
      </div>
    `;

    propertyGrid.appendChild(card);
  });
}

// Reset all form inputs to default
function resetFilters() {
  filterForm.reset();
  loadProperties();
}

// ============================================================================
// DAY 2: EVENT LISTENERS & INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Update mode badge
  if (mockBadge) {
    mockBadge.textContent = USE_MOCK ? "● Demo Mock Mode" : "● Live Express API";
    mockBadge.style.color = USE_MOCK ? "#d97706" : "#059669";
    mockBadge.style.background = USE_MOCK ? "#fef3c7" : "#d1fae5";
  }

  // Day 2: Initialize map
  initMap();

  // Day 2: Filter submission handler
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loadProperties();
  });

  // Reset button handlers
  btnResetFilters.addEventListener("click", resetFilters);
  if (btnEmptyReset) {
    btnEmptyReset.addEventListener("click", resetFilters);
  }

  // Load initial listings
  loadProperties();
});
