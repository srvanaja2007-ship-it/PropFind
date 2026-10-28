# HomeFinder Database Guide

## A. Tasks in order

1. Accept Person 1's GitHub collaborator email invite.
2. Install Node.js LTS. In the cloned project, run `npm install` after Person 2's `package.json` is available.
3. Install MongoDB Community Server. Keep the default local service running, or start MongoDB using the instructions for your operating system.
4. Optionally install MongoDB Compass for a graphical database view.
5. Atlas alternative: create a free MongoDB Atlas cluster, create a database user, allow your IP address, and copy the driver connection string. Put it in `.env`, replacing the placeholder values, for example:

   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/homefinder?retryWrites=true&w=majority
   ```

6. Copy `.env.example` to `.env`. For local MongoDB, use `MONGO_URI=mongodb://127.0.0.1:27017/homefinder`.
7. Install local testing dependencies if the shared `package.json` is not ready: `npm install mongoose dotenv`. Do not commit those local package changes.
8. Add the database files shown below, then run `node seed.js`.
9. Verify the data with Compass or the `mongosh` commands in this guide.
10. Run the temporary CRUD test with `node test-db.js`, then remove it locally or leave it untracked.

## B. GitHub workflow

Run these commands after accepting the invite. Replace the URL with the repository URL supplied by Person 1:

```powershell
git clone https://github.com/<person-1>/<homefinder-repo>.git
cd <homefinder-repo>
git checkout -b feature/mongodb-models
```

Create or update only the database files, then check the changes:

```powershell
git status
git add config/db.js models/Property.js models/Message.js seed.js .env.example DATABASE_GUIDE.md
git commit -m "Add MongoDB connection helper"
git push -u origin feature/mongodb-models
```

Five suitable commit messages are:

1. `Add MongoDB connection helper`
2. `Create Property and Message schemas`
3. `Add Bengaluru property seed data`
4. `Document database setup and verification`
5. `Add database CRUD smoke test`

Open GitHub, select the pushed `feature/mongodb-models` branch, click **Compare & pull request**, choose Person 1's default branch as the base, add a short description, and create the pull request. Never commit `.env`; commit only `.env.example`.

## C. Dependencies and handoff

This work depends on Person 2's `package.json` containing `mongoose` and `dotenv`. For standalone testing, run `npm install mongoose dotenv` locally without committing package.json or lockfile changes made only for this test.

The other team members depend on the `Property` and `Message` models, `connectDB`, and the ten seed records. Person 2's routes and controllers should use these model exports and the exact Property field names in the shared contract.

## D. Simple database vocabulary

SQL databases store data in tables with fixed rows and columns and commonly connect tables with relationships. MongoDB stores flexible JSON-like records in collections. MongoDB is useful here because each property can be represented naturally as one document.

- Schema: the rules describing allowed fields, types, and validation.
- Model: the Mongoose JavaScript object used to create and query documents for a collection.
- Collection: a MongoDB group of related documents, similar to a table.
- Document: one MongoDB record, similar to a row; for example, one property.

## Compass steps

1. Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017` (or paste the Atlas URI).
2. Open the `homefinder` database and the `properties` collection.
3. Use the **Documents** tab to inspect the ten seeded properties.
4. Use **Filter** with `{ "bhk": 2, "price": { "$lt": 30000 }, "amenities": "Gym" }` to find matching homes.
5. Use the **Indexes** and **Schema** tabs only for inspection; the application owns the data shape.
