/**
 * HomeFinder - Add / Edit Property Script
 * Day 2 Topic: JavaScript Form Validation, DOM Handling & Fetch POST/PUT
 * Author: Person 1 (Frontend Developer & Repo Owner)
 */

// ============================================================================
// CONFIGURATION & MOCK DATA MODE
// Set USE_MOCK to true to test the frontend before the backend is ready.
// Set USE_MOCK to false to communicate with the real Express REST API.
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
// DOM ELEMENTS & PAGE STATE
// ============================================================================
const propertyForm = document.getElementById("property-form");
const alertBox = document.getElementById("alert-box");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const btnSubmit = document.getElementById("btn-submit");

// Check if this is an Edit operation (URL has ?id=...)
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");
const isEditMode = Boolean(editId);

// ============================================================================
// DAY 2: PRE-FILL FORM IN EDIT MODE
// ============================================================================
async function initFormMode() {
  if (!isEditMode) return;

  // Day 2: DOM Updates for Edit Mode
  formTitle.textContent = "Edit Property Listing";
  formSubtitle.textContent = "Update property details below and save your changes.";
  btnSubmit.textContent = "Save Changes";
  document.title = "Edit Property | HomeFinder";

  showAlert("Loading existing property details...", "success");

  try {
    let property = null;

    if (USE_MOCK) {
      const list = getMockProperties();
      property = list.find((p) => p._id === editId);
    } else {
      // Day 2: Fetch existing property by ID
      const response = await fetch(`/api/properties/${encodeURIComponent(editId)}`);
      if (!response.ok) {
        throw new Error("Property not found or failed to load");
      }
      property = await response.json();
    }

    if (!property) {
      throw new Error("Property details could not be found.");
    }

    // Day 2: DOM Manipulation - Populate form fields
    document.getElementById("title").value = property.title || "";
    document.getElementById("price").value = property.price || "";
    document.getElementById("bhk").value = property.bhk || "";
    document.getElementById("location").value = property.location || "";
    document.getElementById("lat").value = property.lat || "";
    document.getElementById("lng").value = property.lng || "";
    document.getElementById("imageUrl").value = property.imageUrl || "";
    document.getElementById("ownerName").value = property.ownerName || "";
    document.getElementById("ownerPhone").value = property.ownerPhone || "";

    // Pre-check amenities checkboxes
    if (Array.isArray(property.amenities)) {
      const checkboxes = document.querySelectorAll('input[name="amenities"]');
      checkboxes.forEach((cb) => {
        cb.checked = property.amenities.includes(cb.value);
      });
    }

    hideAlert();
  } catch (error) {
    console.error("Error pre-filling form:", error);
    showAlert(error.message || "Failed to load property details", "danger");
  }
}

// ============================================================================
// DAY 2: VALIDATION & FORM SUBMISSION
// ============================================================================

// Display alert notification to user
function showAlert(message, type = "danger") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = "block";
  alertBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideAlert() {
  alertBox.style.display = "none";
}

// Day 2: Client-side validation function
function validateForm(data) {
  if (!data.title || data.title.trim().length < 5) {
    return "Please enter a descriptive title (at least 5 characters).";
  }

  if (isNaN(data.price) || data.price <= 0) {
    return "Please enter a valid monthly rent greater than 0.";
  }

  if (!data.bhk || isNaN(data.bhk) || data.bhk < 1 || data.bhk > 4) {
    return "Please select a valid BHK configuration (1 to 4 BHK).";
  }

  if (!data.location || data.location.trim().length < 3) {
    return "Please provide a valid location or address.";
  }

  if (isNaN(data.lat) || data.lat < -90 || data.lat > 90) {
    return "Please enter a valid latitude between -90 and 90 (e.g., 12.9716 for Bengaluru).";
  }

  if (isNaN(data.lng) || data.lng < -180 || data.lng > 180) {
    return "Please enter a valid longitude between -180 and 180 (e.g., 77.5946 for Bengaluru).";
  }

  if (!data.imageUrl || !data.imageUrl.startsWith("http")) {
    return "Please provide a valid image URL starting with http:// or https://";
  }

  if (!data.ownerName || data.ownerName.trim().length < 2) {
    return "Please enter the owner or contact person's name.";
  }

  if (!data.ownerPhone || data.ownerPhone.trim().length < 8) {
    return "Please provide a valid phone number (at least 8 digits).";
  }

  return null; // Valid!
}

// Day 2: Handle Form Submit Event
propertyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  // Day 2: Extract selected amenities into an Array
  const checkedAmenities = Array.from(
    document.querySelectorAll('input[name="amenities"]:checked')
  ).map((cb) => cb.value);

  // Day 2: Construct Property Payload conforming to SHARED CONTRACT
  const payload = {
    title: document.getElementById("title").value.trim(),
    price: Number(document.getElementById("price").value),
    bhk: Number(document.getElementById("bhk").value),
    location: document.getElementById("location").value.trim(),
    lat: Number(document.getElementById("lat").value),
    lng: Number(document.getElementById("lng").value),
    imageUrl: document.getElementById("imageUrl").value.trim(),
    amenities: checkedAmenities,
    ownerName: document.getElementById("ownerName").value.trim(),
    ownerPhone: document.getElementById("ownerPhone").value.trim()
  };

  // Run validation
  const validationError = validateForm(payload);
  if (validationError) {
    showAlert(validationError, "danger");
    return;
  }

  // Disable button while processing
  btnSubmit.disabled = true;
  btnSubmit.textContent = isEditMode ? "Saving..." : "Publishing...";

  try {
    if (USE_MOCK) {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 300));

      const list = getMockProperties();

      if (isEditMode) {
        const index = list.findIndex((p) => p._id === editId);
        if (index === -1) throw new Error("Property not found in mock store");
        list[index] = { ...list[index], ...payload };
        saveMockProperties(list);
        showAlert("Property updated successfully! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = `details.html?id=${encodeURIComponent(editId)}`;
        }, 800);
      } else {
        const newProperty = {
          _id: "mock-" + Date.now(),
          ...payload,
          createdAt: new Date().toISOString()
        };
        list.unshift(newProperty);
        saveMockProperties(list);
        showAlert("Property published successfully! Redirecting to home...", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      }
    } else {
      // Day 2: Fetch API POST or PUT call to backend Express server
      const endpoint = isEditMode ? `/api/properties/${encodeURIComponent(editId)}` : "/api/properties";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Shared error shape: { "error": "message" }
        throw new Error(responseData.error || `Request failed with status ${response.status}`);
      }

      showAlert(
        isEditMode ? "Property updated successfully! Redirecting..." : "Property listed successfully! Redirecting...",
        "success"
      );

      setTimeout(() => {
        if (isEditMode) {
          window.location.href = `details.html?id=${encodeURIComponent(editId)}`;
        } else {
          window.location.href = "index.html";
        }
      }, 900);
    }
  } catch (error) {
    console.error("Submission error:", error);
    showAlert(error.message || "Failed to submit property listing.", "danger");
    btnSubmit.disabled = false;
    btnSubmit.textContent = isEditMode ? "Save Changes" : "Publish Property Listing";
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initFormMode();
});
