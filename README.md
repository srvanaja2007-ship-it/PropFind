# 🏠 HomeFinder - Mini Property Marketplace

HomeFinder is a responsive, full-stack rental property marketplace application developed for a 5-day College Skill Lab. It allows users to browse rental homes in Bengaluru, filter listings by price, BHK configuration, amenities, and location, explore properties on an interactive Leaflet map, list new properties, edit existing listings, and send inquiries to owners.

---

## 🌟 Key Features

- **Responsive Multi-Device UI**: Mobile-first design adapting seamlessly from smartphones (1 column) to tablets (2 columns) and desktop screens (3 columns).
- **Interactive Map Integration**: Free, open-source Leaflet map powered by OpenStreetMap CDN with interactive pins and property previews.
- **Dynamic Asynchronous Filtering**: Filter properties by location text, BHK dropdown, price range, and amenity tags without page reloads using vanilla JS DOM updates.
- **Complete Property Lifecycle (CRUD)**:
  - **Create**: Add new properties via `add.html` with client-side form validation.
  - **Read**: Browse property cards and view detailed property pages (`details.html?id=...`).
  - **Update**: Edit existing listings using the pre-filled form.
  - **Delete**: Remove listings with confirmation prompts.
- **Inquiry System**: Contact owners directly via property inquiry forms.
- **Offline / Mock Testing Mode**: Built-in `USE_MOCK = true` flag with 5 Bengaluru sample properties, allowing full frontend evaluation prior to backend integration.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Semantic HTML5, Vanilla CSS3 (Custom properties, Flexbox, Grid), Vanilla JavaScript (ES6+, DOM Manipulation, Fetch API) |
| **Map Engine** | Leaflet.js v1.9.4 + OpenStreetMap via unpkg CDN (Zero API keys required) |
| **Backend** | Node.js, Express.js (REST API, static asset serving) |
| **Database** | MongoDB, Mongoose ODM |
| **Collaboration** | Git, GitHub (Feature Branch Workflow, PR reviews, Merge conflict resolution) |

---

## 👥 Graded Topics & Team Contribution Matrix

| Day | Topic | Scope & Files Owned | Assigned Teammate |
| :--- | :--- | :--- | :--- |
| **Day 1** | **HTML, CSS, Responsive Design** | `public/index.html`<br>`public/add.html`<br>`public/details.html`<br>`public/css/style.css` | **Person 1** (Frontend Dev & Repo Owner) |
| **Day 2** | **JavaScript, DOM, JSON, Fetch API** | `public/js/app.js`<br>`public/js/add.js`<br>`public/js/details.js`<br>Mock mode testing logic | **Person 1** (Frontend Dev & Repo Owner) |
| **Day 3** | **Node.js, Express, REST API** | `server.js`<br>`routes/properties.js`<br>`routes/messages.js`<br>`controllers/propertyController.js`<br>`controllers/messageController.js` | **Person 2** (Backend Developer) |
| **Day 4** | **MongoDB & Database Integration** | `config/db.js`<br>`models/Property.js`<br>`models/Message.js`<br>`seed.js`<br>`.env.example` | **Person 3** (Database Engineer) |
| **Day 5** | **GitHub & Team Collaboration** | `.gitignore`<br>`README.md`<br>`GIT_WORKFLOW.md`<br>Branches, PR reviews, Conflict resolution | **All Team Members** |

---

## 📁 Repository Folder Structure

```text
homefinder/
├── server.js                      # Express server entry point (serves /public & /api)
├── package.json                   # Project metadata and dependencies
├── seed.js                        # Database seeder with sample Bengaluru listings
├── .env.example                   # Template for environment variables
├── .gitignore                     # Git ignore rules for node_modules and .env
├── config/
│   └── db.js                      # MongoDB connection setup using Mongoose
├── models/
│   ├── Property.js                # Mongoose schema for properties
│   └── Message.js                 # Mongoose schema for contact messages
├── routes/
│   ├── properties.js              # REST endpoints for properties CRUD
│   └── messages.js                # REST endpoint for contact inquiries
├── controllers/
│   ├── propertyController.js      # Controller handling property business logic
│   └── messageController.js       # Controller handling message creation
├── public/
│   ├── index.html                 # Homepage with filters, map, and listings grid
│   ├── add.html                   # Form for creating / editing a listing
│   ├── details.html               # Detail view with individual map and contact form
│   ├── css/
│   │   └── style.css              # Mobile-first CSS theme & responsive layout
│   └── js/
│       ├── app.js                 # Homepage logic, Leaflet map, filters, fetch
│       ├── add.js                 # Form validation, POST/PUT fetch handler
│       └── details.js             # Details loader, DELETE, and contact POST handler
├── README.md                      # Comprehensive project documentation
└── GIT_WORKFLOW.md                # Team git branching and merge conflict guide
```

---

## 📡 REST API Documentation

All API endpoints exchange JSON payloads. Responses with errors follow `{ "error": "Error message" }`.

| Method | Endpoint | Description | Query Parameters / Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | Fetch all properties matching filters | **Query:** `minPrice`, `maxPrice`, `bhk`, `amenities`, `location` | `200 OK` (Array of Property objects) |
| `GET` | `/api/properties/:id` | Fetch single property by ID | None | `200 OK` (Property object) or `404` |
| `POST` | `/api/properties` | Create a new property listing | **JSON Body:** `title`, `price`, `bhk`, `location`, `lat`, `lng`, `imageUrl`, `amenities`, `ownerName`, `ownerPhone` | `201 Created` (Created Property object) |
| `PUT` | `/api/properties/:id` | Update an existing property | **JSON Body:** Same as POST | `200 OK` (Updated Property object) |
| `DELETE` | `/api/properties/:id` | Delete a property by ID | None | `200 OK` `{ "message": "Deleted" }` |
| `POST` | `/api/messages` | Send an inquiry message to owner | **JSON Body:** `propertyId`, `name`, `message` | `201 Created` `{ "message": "Sent" }` |

### Property JSON Schema
```json
{
  "_id": "671fb100e4b01a2b3c4d5e6f",
  "title": "Sunny 2 BHK with Balcony in Koramangala",
  "price": 32000,
  "bhk": 2,
  "location": "Koramangala 4th Block, Bengaluru",
  "lat": 12.9352,
  "lng": 77.6245,
  "imageUrl": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "amenities": ["Parking", "Lift", "Security", "Power Backup"],
  "ownerName": "Rajesh Sharma",
  "ownerPhone": "+91 98765 43210",
  "createdAt": "2026-10-15T09:30:00.000Z"
}
```

---

## 🚀 Setup & Installation Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed locally or MongoDB Atlas connection string
- Git installed on your system

### Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/homefinder.git
   cd homefinder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file from the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Verify settings inside `.env`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/homefinder
   ```

4. **Seed sample data into MongoDB**:
   ```bash
   node seed.js
   ```

5. **Start the Express server**:
   ```bash
   npm start
   ```

6. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000) to interact with the application.

---

## 🧪 Testing Frontend Without Backend (Mock Mode)

In `public/js/app.js`, `public/js/add.js`, and `public/js/details.js`, the configuration flag is set to:
```javascript
const USE_MOCK = true;
```
This enables an offline mock dataset of 5 Bengaluru properties stored in browser storage. All filters, map pins, adding listings, editing, deleting, and message submissions function immediately with zero server or database setup.

To connect with the live Express backend, simply change:
```javascript
const USE_MOCK = false;
```

---

## 📸 Application Screenshots

### 1. Homepage & Map Exploration
![HomeFinder Browse & Map](screenshots/homepage_map.png)
*Description: Responsive property grid with 3-column layout on desktop, filter toolbar, and Leaflet OpenStreetMap view.*

### 2. Search & Amenity Filtering
![Filter Results](screenshots/filter_results.png)
*Description: Dynamic filtering by BHK, price threshold, and amenities without page reload.*

### 3. Add / Edit Property Listing
![Add Property Form](screenshots/add_property.png)
*Description: Validated form with custom coordinates and amenities selection.*

### 4. Property Details & Inquiry Form
![Property Details](screenshots/property_details.png)
*Description: Detailed view showing photo, full amenities list, single-property map, and contact inquiry sidebar.*
