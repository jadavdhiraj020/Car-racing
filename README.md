# 🏎️ APEX — 3D Friend Racing Game

A complete friends-only racing project: Babylon.js graphics, an authoritative Node.js/Socket.IO server, Cannon physics, private rooms, 2–6 drivers, 3 laps, results, and rematches. No database, player accounts, paid assets, or API keys.

**Status:** implemented and locally tested. Public deployment and a race between different homes are not yet verified. No public game URL has been created. Follow the one-time account steps below; after deployment you do not start a server for each race.

## Technology and architecture

| Part | Choice | Purpose |
|---|---|---|
| 3D | Babylon.js 8 | Procedural cars, chicane circuit, palm trees, follow camera |
| Physics | cannon-es 0.20 (MIT) | Server-side gravity, ground and barrier collisions |
| Multiplayer | Socket.IO 4 | 30 input packets/second, 20 room snapshots/second |
| Server | Node.js 24, Express 5 | Serves the website and runs each race |
| Build | Vite 7 | Builds browser assets |
| Storage / login | None | Rooms live in memory; players enter nicknames |
| Hosting | One Render Free web service | One HTTPS URL for website and multiplayer |

Cannon is a deliberate simplification: the server runs the same lightweight JavaScript simulation without a browser or WASM setup, and Babylon renders its results. Havok is not required or bundled. Cannon is MIT licensed: https://github.com/pmndrs/cannon-es. Opponent cars are ghosts to prevent blocking; ground and barriers are physical. This is an arcade game, not realistic suspension physics.

The client sends six boolean controls; it cannot submit position, laps, or results. The server advances physics at 60 ticks/second, accepts the next checkpoint only in the forward direction, and counts 24 gates per lap. Reset returns to the last accepted checkpoint without increasing progress. A car finishes at 72 crossings. Results appear when everyone remaining finishes, 60 seconds after the first finish, or at the 10-minute race limit. Unfinished drivers receive DNF. Finishes in the same server tick share a time; roster order breaks exact ties.

The browser smooths position and heading between snapshots. This adds some input latency; select a hosting region near the group. No client prediction or lag compensation is implemented. Names are escaped in HTML and drawn as canvas text in 3D. Basic payload, nickname, room, player-count, request-rate and room-count limits protect the server. Room codes are invitations, not strong authentication.

Disconnects immediately remove the driver and transfer host to the next remaining player. Empty rooms are deleted. Socket.IO reconnects transport automatically, but a disconnected driver must join the lobby again; mid-race joining/resuming is intentionally disabled. A host can rematch after results to reopen the lobby. Restarts and deploys erase all rooms.

## Project structure / important files

```text
car racing game/
├── client/
│   ├── index.html              Page, lobby, HUD, results and touch controls
│   └── src/
│       ├── main.js             Socket client, input, UI, audio and minimap
│       ├── scene.js            Babylon track, cars, environment and camera
│       └── style.css           Responsive racing interface
├── server/
│   ├── index.js                HTTP, rooms, validation and race lifecycle
│   └── race.js                 Physics, checkpoint rules and snapshots
├── shared/
│   └── track.js                Loop geometry, checkpoints and configuration
├── test/
│   └── race.test.js            Physics and actual Socket.IO integration tests
├── scripts/
│   └── browser-check.mjs       Two-window Chrome smoke test and screenshots
├── .github/workflows/ci.yml    Run tests and build on GitHub
├── .gitignore                 Excludes generated files and secrets
├── LICENSE                    MIT license for project source
├── package.json               Dependencies and commands
├── package-lock.json          Exact dependency versions; commit this file
├── vite.config.js             Browser build configuration
├── render.yaml                Free Render service definition
├── README.md                  This guide
├── VERIFICATION.md            Actual checks and remaining limitations
└── COMPLETE_SOURCE.md         Generated source listing with exact file paths
```

`node_modules/`, `dist/`, and `test-artifacts/` are generated and ignored by Git. `dist/` is the deployable website, served by the Node process. The source listing excludes only itself and includes the complete lockfile as well as every source and configuration file.

## Local setup — Windows PowerShell

On this computer Node.js and Git were already installed, and dependencies/build have been prepared. If the server is still running, simply open **http://localhost:3000**.

On a different computer:

1. Open https://nodejs.org/en/download. Select **Node.js 24 LTS**, **Windows**, **x64**, **Windows Installer (.msi)**. Run it with default options, including PATH. This project was tested with Node 24.19.0; use the latest 24 LTS patch for a new installation.
2. Close and reopen PowerShell. Check:

```powershell
node --version
npm.cmd --version
```

3. Copy this project folder, or clone the GitHub repository you create below. Open PowerShell and run:

```powershell
Set-Location 'C:\Users\jadav\Coding\car racing game'
npm.cmd ci
npm.cmd run build
npm.cmd start
```

4. You should see `APEX racing: http://localhost:3000`. Open that URL in Chrome, Edge or Firefox. Keep that terminal open while testing locally. Ctrl+C stops it.

For editing with automatic frontend updates, stop the production server with Ctrl+C and use:

```powershell
npm.cmd run dev
```

Both frontend and backend start with this one command at **http://localhost:3000**. Vite is middleware in Node; there is no second port and no second terminal required. Restart this command after changing server files.

To run automated checks:

```powershell
npm.cmd test
npm.cmd run build
```

Optional browser check: install Google Chrome from https://www.google.com/chrome/ if missing, then open a PowerShell window (the test starts its own isolated server):

```powershell
Set-Location 'C:\Users\jadav\Coding\car racing game'
node scripts/browser-check.mjs
```

Screenshots are written to `test-artifacts/`. Chrome automation uses a temporary isolated browser profile, not your personal browser session.

## Test with two players

1. Open **http://localhost:3000** in a browser window. Enter `Dhiraj`; click **CREATE A RACE**.
2. Click **COPY INVITE LINK**. Open the copied link in a second window or an incognito window on the same computer.
3. Enter `Rahul`; click **JOIN →**. Both windows should show both names and different car colors.
4. In Dhiraj's window click **START RACE →**. Both windows count down together.
5. Click the game area if needed. Hold W to accelerate; use A/D to steer. In the other window watch the first car move. Use R if stuck. If a window loses focus, controls release automatically.
6. Follow the loop and glowing gate posts for three laps. Each finish registers on the server. After both finish (or the timeout), the host clicks **RUN IT BACK ↻**, then starts again.

Controls: W/Up accelerate; S/Down brake then reverse; A/Left and D/Right steer; Space drift; R reset. Touch buttons appear on devices with coarse pointers. Sound is opt-in using **SOUND OFF**; it enables synthesized engine and countdown/results tones. Graphics defaults to Medium; the quality button cycles through High, Low, and Medium, changing render resolution. No downloaded music or models.

Testing over your home Wi-Fi requires the PC's LAN address, not localhost. Run `ipconfig`, find the active Wi-Fi adapter's IPv4 address, and open `http://THAT-ADDRESS:3000` on the other device. If Windows asks, allow Node on your trusted private network. The easiest test between different homes is the deployed HTTPS URL below; do not forward router ports.

## Deploy online — one-time setup

### Current free-tier limitations

Verified against official Render documentation on 2026-09-12: https://render.com/docs/free and https://render.com/docs/websocket.

Render currently offers a Free Node web service with managed HTTPS and public WebSockets. It sleeps after 15 minutes without incoming HTTP/WebSocket traffic. Opening the website wakes it; allow about one minute. There are 750 free instance hours per workspace per month shared across free services, plus bandwidth and build limits. Free instances can restart; all rooms are then lost. This is not a permanent-free guarantee or an uptime guarantee. Check the linked pricing/usage pages before selecting the plan. Monitor Billing → Monthly Included Usage. With no payment method, exceeding relevant free limits suspends service/builds instead of buying extra usage. If adding a card, review spending controls first.

### A. Put the project on GitHub

🔴 **YOU MUST DO THIS — sign in/create your account and publish this repository.** No GitHub repository-creation or Render deployment credentials are available in this environment.

Simplest: GitHub Desktop.

1. Open https://github.com/signup and create a free account if needed.
2. Open https://desktop.github.com/download/ and install GitHub Desktop. Choose **Sign in to GitHub.com**, and finish the browser sign-in.
3. In GitHub Desktop choose **File → Add Local Repository**. Local path: `C:\Users\jadav\Coding\car racing game`. Click **Add Repository**. A local Git repository has already been prepared.
4. Click **Publish repository**. Name: `apex-friends-racing`. Keep **Keep this code private** checked. Click **Publish Repository**.
5. Click **View on GitHub**. You should see `client`, `server`, `package.json`, and `render.yaml`. Do not upload `node_modules` or `dist`.

Windows note for this prepared workspace: the Git folder was created by the sandbox account. If GitHub Desktop offers a repository trust prompt, review this exact project path and accept it. If command-line Git reports **dubious ownership**, add the following command-only option after `git` in each command; it trusts only this project for that invocation and changes no file ownership:

```powershell
git -c safe.directory='C:/Users/jadav/Coding/car racing game' status
git -c safe.directory='C:/Users/jadav/Coding/car racing game' branch -M main
git -c safe.directory='C:/Users/jadav/Coding/car racing game' remote add origin https://github.com/YOUR-USERNAME/apex-friends-racing.git
git -c safe.directory='C:/Users/jadav/Coding/car racing game' push -u origin main
```

Use your actual GitHub username. This option was used successfully to create the local commit. No Windows ownership or persistent Git trust settings were changed.

Alternative command-line workflow (do not do both):

1. Open https://github.com/new while signed in.
2. Repository name: `apex-friends-racing`; choose **Private**. Leave README, .gitignore and license initialization unchecked. Click **Create repository**.
3. Copy the repository HTTPS URL from that page. In PowerShell:

```powershell
Set-Location 'C:\Users\jadav\Coding\car racing game'
git status
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/apex-friends-racing.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username. Complete the Git Credential Manager browser sign-in if requested; do not paste passwords or access tokens into chat.

For a fresh source copy that has no `.git` folder, run these first (the prepared workspace does not need another initial commit):

```powershell
git init
git add .
git commit -m "Build APEX multiplayer racing game"
git branch -M main
```

`init` creates history, `add` stages files, `commit` saves a version, `branch` names it main, `remote` connects GitHub, and `push` uploads. If Git asks for identity, set `git config user.name "Your name"` and `git config user.email "Your GitHub email"`, then retry the commit. Git is available here; on another PC install it from https://git-scm.com/downloads/win.

### B. Create the free Render service

🔴 **YOU MUST DO THIS — connect the repository to your Render account.**

1. Open https://dashboard.render.com/ and sign up/sign in. Choose GitHub sign-in if convenient.
2. Click **New + → Web Service**. Choose **Git Provider**, connect GitHub, and authorize access to `apex-friends-racing`. Select that repository.
3. Enter these exact settings:

| Setting | Value |
|---|---|
| Name | `apex-friends-racing` (add a suffix if taken) |
| Language / Runtime | `Node` |
| Branch | `main` |
| Region | Closest available to your friends (Singapore for India if offered) |
| Root Directory | Leave blank |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Instance Type | **Free — $0/month** |
| Health Check Path | `/health` |
| Environment variable | `NODE_ENV` = `production` |
| Environment variable | `NODE_VERSION` = `24.19.0` |

4. Click **Deploy Web Service**. Do not select a paid instance, database, disk, or custom domain. Wait for the build log to finish and the status to become **Live**.
5. Click the `https://...onrender.com` address at the top. This is **both the frontend URL and backend URL**. Open `https://...onrender.com/health`; it should show `{"ok":true}`.
6. Repeat the two-player test using this address. Ask one friend on a different internet connection to join. This final internet-access test has not been performed by the agent.

Alternative: **New + → Blueprint**, select the repository and apply `render.yaml`. Inspect the service plan is Free before applying. It contains the same values as the manual form.

### HTTPS, WSS and CORS

The website and Socket.IO share one origin. `io()` automatically connects to the current site's host. Render terminates TLS, and Socket.IO uses HTTPS polling then WSS where available. No separate frontend URL, backend URL variable, wildcard CORS setting, certificate, or custom port is needed. Render supplies `PORT`; the app binds to `0.0.0.0`. Do not change the client to localhost or hardcode an `http://` backend on the deployed website.

Official deployment instructions: https://render.com/docs/deploy-node-express-app. Render automatically redeploys pushes to the linked branch. To update later:

```powershell
git add .
git commit -m "Update game"
git push
```

Deploy between races: every restart clears in-memory rooms. Once online you can close your computer and local terminals; Render runs the game for the group.

## Final game URL

No public URL exists yet. Render will assign one like `https://apex-friends-racing-xxxx.onrender.com` after your service is Live. That example is a pattern, not a deployed address. Copy the actual address from your service dashboard.

## Send this to friends

1. Open the invite link I send you in Chrome, Edge or Firefox.
2. Enter your nickname and click **JOIN →** (the room code is already filled in).
3. Wait for me to start the race, then the 3–2–1 countdown.
4. W/A/S/D or arrow keys to drive; Space to drift; R if stuck. Complete three laps.
5. Stay for the results and rematch!

## Troubleshooting

| Problem | Likely reason | Exact fix |
|---|---|---|
| `node` / `npm` not recognized | Node missing or old terminal PATH | Install Node 24 LTS from the link above, close every PowerShell window, reopen, run `node --version`. |
| `npm.ps1 cannot be loaded` | PowerShell script policy | Use `npm.cmd` in every command as shown. No policy change needed. |
| Port 3000 already in use | Another server is running | Use the existing game at localhost:3000, or stop its terminal with Ctrl+C. For a different port run `$env:PORT='3001'` then `npm.cmd start`; open localhost:3001. |
| CORS error | Frontend and backend were split or hardcoded URL added | Restore `const ... socket=io()` in main.js and deploy the entire root as one Web Service. No `VITE_SERVER_URL` is needed. Rebuild/redeploy. |
| Socket.IO connection failed | Server stopped, waking, or wrong URL | Open the same host's `/health`. Start Node locally, or check Render service is Live and wait 60–90 seconds. Reload. |
| WebSocket failed | Proxy blocks WebSockets | Socket.IO normally falls back to HTTP polling. If it remains offline, try a browser without network-blocking extensions or a different network. |
| Friends cannot join | Wrong/expired code, full room, active race, localhost invite | Share the deployed HTTPS link. Create a fresh lobby; maximum six people; mid-race joins are disabled. |
| Works locally but not online | Wrong root/build/start/port | Use the exact Render table above, root blank, `npm ci --include=dev && npm run build`, `npm start`; app must keep supplied PORT behavior. |
| HTTPS/WSS or mixed-content error | Hardcoded HTTP server | Restore same-origin `io()`. Use Render's HTTPS URL. Rebuild/redeploy. |
| Blank 3D screen | WebGL disabled or outdated driver/browser | In Chrome Settings → System enable graphics acceleration, relaunch Chrome, update graphics driver; try Edge. Verify `/health` and reload Ctrl+F5. |
| Low frame rate | High pixel density, weak GPU or software rendering | Click the quality button until it reads **QUALITY LOW**; close extra 3D browser windows; enable hardware acceleration. |
| Car falls through road | Modified ground/physics code | Original track has a ground plane. Press R. Restore `server/race.js` ground setup and flat track; server auto-resets out-of-bounds cars. |
| Car stuck at barrier | Steering into wall | Brake/reverse with S or press R (2-second reset cooldown). |
| Remote cars not moving | Race not started, connection lost, input window unfocused | Wait for GO; focus the driving window; verify ONLINE indicator and `/health`. Disconnected players must rejoin the next lobby. |
| Car stops accelerating when switching windows | Controls clear on blur, intentionally | Keep the driving window focused. Use another device to drive both simultaneously. |
| Lap does not count | Gate skipped or driving backward | Follow the glowing next gate. Press R to return to last valid checkpoint. Every gate must be crossed forward. |
| Deployment build failed | Wrong folder/Node/dependencies | Confirm root blank, Node 24, lockfile committed and exact build command; inspect Render Events → failed deploy → logs. Run `npm.cmd ci` and `npm.cmd run build` locally. |
| Server crashes / all rooms disappear | Restart, deploy, resource limit or edited code | Check Render Logs, run `npm.cmd test`, redeploy known working commit. Create new rooms; no persistence is expected. |
| Free hosting sleeps | No traffic for 15 minutes | Open the game and wait about a minute. Create a new room if the old one was lost. No manual server command required. |
| Service suspended | Free monthly allowance exceeded | Check Render Billing → Monthly Included Usage. Wait for reset or reduce other free services; do not upgrade if you want to remain free. |
| No sound | Browser audio requires a gesture | Click **SOUND OFF** to turn audio on; check OS volume. |
| Invite copy fails | Clipboard blocked / insecure LAN HTTP | Copy the address bar; room code is also displayed. Clipboard should work on localhost and deployed HTTPS. |
| `remote origin already exists` | Repository already connected | Run `git remote -v`. If it is your correct repository, skip `remote add` and run `git push -u origin main`. |

## Verification

See `VERIFICATION.md` for observed checks, not just a mental checklist. Public deployment remains pending your account connection. Mobile layout is checked at a narrow viewport; actual touch-device play, wide-area latency and low-end hardware performance still need real-device testing.

# 🔴 ONLY THINGS YOU MUST DO

1. Sign in to GitHub and publish the prepared repository (GitHub Desktop steps above).
2. Sign in to Render, connect that repository, and select the **Free** web service using the exact settings above.
3. Copy your assigned HTTPS URL and invite a friend on another network for the final online race check.

No local server management is needed after that one-time deployment, subject to free hosting limits.
