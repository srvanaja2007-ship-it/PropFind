/**
 * HomeFinder - Property Details Script
 * Day 2 Topic: Fetch Single Item, Leaflet Detail Map, Contact POST & DELETE
 * Author: Person 1 (Frontend Developer & Repo Owner)
 */

// ============================================================================
// CONFIGURATION & MOCK DATA MODE
// ============================================================================
const USE_MOCK = false;

// Helper to access mock properties in localStorage
function getMockProperties() {
  const stored = localStorage.getItem("homefinder_mock_properties");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to parse mock data");
    }
  }
  return [];
}

function saveMockProperties(list) {
  localStorage.setItem("homefinder_mock_properties", JSON.stringify(list));
}

// ============================================================================
// DOM ELEMENTS & URL PARAMETERS
// ============================================================================
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get("id");

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorTitle = document.getElementById("error-title");
const errorDesc = document.getElementById("error-desc");
const detailsContainer = document.getElementById("details-container");

const contactForm = document.getElementById("contact-form");
const messageAlert = document.getElementById("message-alert");
const btnSendMessage = document.getElementById("btn-send-message");
const btnEditProperty = document.getElementById("btn-edit-property");
const btnDeleteProperty = document.getElementById("btn-delete-property");

let detailMap = null;

// ============================================================================
// DAY 2: HELPERS & UTILITIES
// ============================================================================
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showMessageNotification(message, type = "success") {
  messageAlert.textContent = message;
  messageAlert.className = `alert alert-${type}`;
  messageAlert.style.display = "block";
}

// ============================================================================
// DAY 2: FETCH & DISPLAY PROPERTY DETAILS
// ============================================================================
async function loadPropertyDetails() {
  if (!propertyId) {
    showError("Missing Property ID", "Please select a property from the browse page.");
    return;
  }

  try {
    let property = null;

    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const list = getMockProperties();
      property = list.find((p) => String(p._id) === String(propertyId));
    } else {
      // Day 2: Fetch single property resource by ID (GET /api/properties/:id)
      const response = await fetch(`/api/properties/${encodeURIComponent(propertyId)}`);
      if (response.status === 404) {
        throw new Error("This property listing no longer exists.");
      }
      if (!response.ok) {
        throw new Error(`Failed to load property (HTTP ${response.status})`);
      }
      property = await response.json();
    }

    if (!property) {
      showError("Property Not Found", "The requested property was not found.");
      return;
    }

    renderPropertyDetails(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    showError("Unable to Load Property", error.message);
  }
}

function showError(title, desc) {
  loadingState.style.display = "none";
  detailsContainer.style.display = "none";
  errorState.style.display = "block";
  errorTitle.textContent = title;
  errorDesc.textContent = desc;
}

// Day 2: Populate DOM with Property Information
function renderPropertyDetails(prop) {
  loadingState.style.display = "none";
  errorState.style.display = "none";
  detailsContainer.style.display = "grid";

  document.title = `${prop.title} | HomeFinder`;

  // Hero image with fallback
  const detailImage = document.getElementById("detail-image");
  detailImage.src = prop.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
  detailImage.onerror = () => {
    detailImage.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";
  };

  // Header & Meta
  document.getElementById("detail-title").textContent = prop.title;
  document.getElementById("detail-location").textContent = `📍 ${prop.location}`;
  document.getElementById("detail-price").textContent = `${formatCurrency(prop.price)} / mo`;
  document.getElementById("detail-price-meta").textContent = formatCurrency(prop.price);
  document.getElementById("detail-bhk").textContent = `${prop.bhk} BHK`;

  // Format date
  const dateStr = prop.createdAt ? new Date(prop.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : "Recently";
  document.getElementById("detail-date").textContent = dateStr;

  // Amenities
  const amenitiesContainer = document.getElementById("detail-amenities");
  amenitiesContainer.innerHTML = "";
  if (Array.isArray(prop.amenities) && prop.amenities.length > 0) {
    prop.amenities.forEach((amenity) => {
      const tag = document.createElement("span");
      tag.className = "amenity-tag";
      tag.style.fontSize = "0.85rem";
      tag.style.padding = "0.35rem 0.75rem";
      tag.textContent = `✓ ${amenity}`;
      amenitiesContainer.appendChild(tag);
    });
  } else {
    amenitiesContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.9rem;">No specific amenities listed.</span>`;
  }

  // Lat / Lng labels
  document.getElementById("detail-lat").textContent = prop.lat;
  document.getElementById("detail-lng").textContent = prop.lng;

  // Owner information
  document.getElementById("detail-owner-name").textContent = prop.ownerName || "Property Owner";
  const phoneLink = document.getElementById("detail-owner-phone");
  phoneLink.textContent = prop.ownerPhone || "Not provided";
  phoneLink.href = prop.ownerPhone ? `tel:${prop.ownerPhone.replace(/\s+/g, '')}` : "#";

  // Setup Edit button link
  btnEditProperty.href = `add.html?id=${encodeURIComponent(prop._id)}`;

  // Day 2: Initialize Leaflet Map for single location
  initSinglePropertyMap(prop.lat, prop.lng, prop.title, prop.price);
}

// Day 2: Initialize small Leaflet Map focused on this property
function initSinglePropertyMap(lat, lng, title, price) {
  if (typeof L === "undefined") return;
  if (typeof lat !== "number" || typeof lng !== "number") return;

  try {
    const mapElement = document.getElementById("details-map");
    if (!mapElement) return;

    if (detailMap) {
      detailMap.remove();
    }

    detailMap = L.map("details-map").setView([lat, lng], 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(detailMap);

    const marker = L.marker([lat, lng]).addTo(detailMap);
    marker.bindPopup(`<strong>${escapeHtml(title)}</strong><br>${formatCurrency(price)} / mo`).openPopup();
  } catch (err) {
    console.warn("Details map warning:", err);
  }
}

// ============================================================================
// DAY 2: DELETE PROPERTY OPERATION (DELETE /api/properties/:id)
// ============================================================================
btnDeleteProperty.addEventListener("click", async () => {
  const confirmed = window.confirm("Are you sure you want to permanently delete this property listing?");
  if (!confirmed) return;

  btnDeleteProperty.disabled = true;
  btnDeleteProperty.textContent = "Deleting...";

  try {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const list = getMockProperties();
      const filtered = list.filter((p) => String(p._id) !== String(propertyId));
      saveMockProperties(filtered);
      alert("Property deleted successfully.");
      window.location.href = "index.html";
    } else {
      // Day 2: Fetch API DELETE request
      const response = await fetch(`/api/properties/${encodeURIComponent(propertyId)}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete property");
      }

      alert("Property deleted successfully.");
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert(`Could not delete property: ${error.message}`);
    btnDeleteProperty.disabled = false;
    btnDeleteProperty.textContent = "🗑️ Delete Listing";
  }
});

// ============================================================================
// DAY 2: CONTACT OWNER FORM SUBMISSION (POST /api/messages)
// ============================================================================
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageAlert.style.display = "none";

  const senderName = document.getElementById("sender-name").value.trim();
  const senderMessage = document.getElementById("sender-message").value.trim();

  if (!senderName || !senderMessage) {
    showMessageNotification("Please fill in both your name and message.", "danger");
    return;
  }

  btnSendMessage.disabled = true;
  btnSendMessage.textContent = "Sending inquiry...";

  // Day 2: Message payload conforming to SHARED CONTRACT
  const payload = {
    propertyId: propertyId,
    name: senderName,
    message: senderMessage
  };

  try {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      showMessageNotification("Inquiry sent to owner successfully! They will reach out soon.", "success");
      contactForm.reset();
    } else {
      // Day 2: Fetch API POST call to create message
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message to owner");
      }

      showMessageNotification("Your inquiry has been sent to the property owner!", "success");
      contactForm.reset();
    }
  } catch (error) {
    console.error("Contact form error:", error);
    showMessageNotification(error.message || "Could not send message. Please try again.", "danger");
  } finally {
    btnSendMessage.disabled = false;
    btnSendMessage.textContent = "Send Inquiry";
  }
});

// Load details on initial load
document.addEventListener("DOMContentLoaded", () => {
  loadPropertyDetails();
});
