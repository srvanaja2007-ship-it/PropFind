# 🌿 Git Collaboration Workflow & Merge Conflict Guide

This guide establishes the Git branching, code review, and merge conflict procedures for the **HomeFinder** team project.

---

## 👥 Team Roles & Branch Ownership

| Team Member | Role | Assigned Feature Branch | Topic Covered |
| :--- | :--- | :--- | :--- |
| **Person 1** | Frontend Lead & Repo Owner | `feature/frontend-ui`<br>`feature/js-dom-fetch` | Days 1 & 2 (HTML/CSS & JS/DOM/Fetch) |
| **Person 2** | Backend Developer | `feature/express-api` | Day 3 (Node.js & Express REST API) |
| **Person 3** | Database Engineer | `feature/mongodb-models` | Day 4 (MongoDB & Mongoose Integration) |

> ⚠️ **Golden Rule:** No team member commits directly to `main`. All changes must be developed in assigned feature branches and merged into `main` via reviewed Pull Requests on GitHub.

---

## 🚀 Standard Workflow for Every Feature

### Step 1: Clone the Repository (Initial Setup)
Every teammate runs this once on their local computer:
```bash
# Clone the repository via HTTPS
git clone https://github.com/<repo-owner-username>/homefinder.git

# Move into the project directory
cd homefinder
```

### Step 2: Keep `main` Updated & Create Your Feature Branch
Before starting work, ensure your local `main` branch is in sync with GitHub:
```bash
# Switch to main branch
git checkout main

# Pull latest commits from GitHub
git pull origin main

# Create and switch to your feature branch
git checkout -b feature/<your-branch-name>
```

*Example for Person 1:*
```bash
git checkout -b feature/frontend-ui
```

### Step 3: Check Status, Stage, and Commit Changes
Make small, frequent, and descriptive commits as you develop:
```bash
# Check modified files
git status

# Stage specific files (or all with .)
git add public/index.html public/css/style.css

# Commit with a clear, imperative message
git commit -m "feat: implement responsive property card grid with 3-column desktop layout"
```

### Step 4: Push Feature Branch to GitHub
```bash
# Push branch to remote origin and set upstream tracking
git push -u origin feature/<your-branch-name>
```

*Example for Person 1:*
```bash
git push -u origin feature/frontend-ui
```

### Step 5: Open a Pull Request (PR) on GitHub
1. Open the repository on GitHub in your browser.
2. A yellow banner will appear: **"feature/<your-branch-name> had recent pushes"** &rarr; Click **"Compare & pull request"**.
3. Set the base branch to `main` and compare branch to `feature/<your-branch-name>`.
4. Provide a clear PR title and summary checklist:
   - Summary of features added.
   - Files changed.
   - Verification steps.
5. Assign **Person 1 (Repo Owner)** as reviewer.
6. Click **"Create pull request"**.

### Step 6: Review and Merge on GitHub
1. Person 1 opens the PR under the **"Pull requests"** tab.
2. Clicks **"Files changed"** to inspect code diffs and ensure adherence to the shared contract.
3. If everything looks good, clicks **"Merge pull request"** &rarr; **"Confirm merge"**.
4. Teammates delete their remote branch on GitHub after merging.

### Step 7: Sync Local Repository
After a PR is merged into `main`:
```bash
git checkout main
git pull origin main
```

---

## ⚔️ Deliberate Merge Conflict Exercise (Day 5 Demonstration)

For the Day 5 lab evaluation, the team must demonstrate how to trigger, understand, and resolve a merge conflict in Git.

### Scenario
Both **Person 1** and **Person 2** will edit the **same line** of `README.md` at the same time on different branches and attempt to merge.

---

### Phase A: Setup the Conflict

#### 1. Person 1 edits `README.md` on `main`:
Person 1 opens `README.md` and modifies line 3 from:
```markdown
HomeFinder is a responsive, full-stack rental property marketplace application developed for a 5-day College Skill Lab.
```
to:
```markdown
HomeFinder is an ultra-modern, high-performance rental marketplace for Bengaluru created by Person 1.
```
Person 1 commits and pushes directly:
```bash
git checkout main
git add README.md
git commit -m "docs: update project description tagline by Person 1"
git push origin main
```
*`main` on GitHub now contains Person 1's version.*

---

#### 2. Person 2 makes a conflicting change on branch `feature/express-api`:
Without pulling Person 1's commit, Person 2 edits the exact same line 3 of `README.md` to:
```markdown
HomeFinder is a lightning-fast Node.js Express rental platform built by Person 2.
```
Person 2 commits and pushes their branch:
```bash
git checkout feature/express-api
git add README.md
git commit -m "docs: update project description tagline by Person 2"
git push origin feature/express-api
```

---

### Phase B: Triggering the Conflict

Person 2 now attempts to incorporate the latest changes from `main` into their feature branch before opening a PR:
```bash
git pull origin main
```
**Git outputs the conflict warning:**
```text
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

If Person 2 runs `git status`, it displays:
```text
Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   README.md
```

---

### Phase C: Inspecting the Conflict Markers

Open `README.md` in your text editor (VS Code / Antigravity). You will see Git's three conflict markers:

```markdown
<<<<<<< HEAD (Current Change - Person 2's branch)
HomeFinder is a lightning-fast Node.js Express rental platform built by Person 2.
=======
HomeFinder is an ultra-modern, high-performance rental marketplace for Bengaluru created by Person 1.
>>>>>>> origin/main (Incoming Change - Person 1 on main)
```

- `<<<<<<< HEAD`: Marks the start of your local changes on the current branch.
- `=======`: The divider separating the conflicting changes.
- `>>>>>>> origin/main`: Marks the end of incoming changes from the remote branch.

---

### Phase D: Resolving the Conflict

1. Discuss with your teammate to agree on a combined, unified sentence.
2. Delete the markers `<<<<<<<`, `=======`, and `>>>>>>>`.
3. Replace the block with the agreed combined text:
```markdown
HomeFinder is an ultra-modern, lightning-fast rental property marketplace for Bengaluru, built collaboratively with Node.js, Express, and Vanilla JavaScript.
```

---

### Phase E: Staging and Finalizing the Merge

Once the markers are removed and the file is saved:

```bash
# 1. Stage the resolved file
git add README.md

# 2. Verify status (shows "All conflicts fixed but you are still merging")
git status

# 3. Complete the merge commit
git commit -m "merge: resolve description conflict in README.md between main and feature/express-api"

# 4. Push the cleanly merged branch to GitHub
git push origin feature/express-api
```

Now, Person 2 can open the Pull Request on GitHub with zero conflicts!

---

## 📋 Best Practices Summary
1. Always `git checkout main` and `git pull origin main` before branching out.
2. Keep commit messages clear using conventional prefixes (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`).
3. Test your code locally before pushing.
4. Review every pull request carefully before merging.
