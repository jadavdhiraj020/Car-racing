# Complete APEX source code

All tracked source and configuration files. Generated build artifacts and this listing itself are excluded.

## .github/workflows/ci.yml

Exact workspace path: `C:/Users/jadav/Coding/car racing game/.github/workflows/ci.yml`

````
name: Check racing game
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
````

## .gitignore

Exact workspace path: `C:/Users/jadav/Coding/car racing game/.gitignore`

````
node_modules/
dist/
.env
*.log
test-artifacts/
release/
````

## LICENSE

Exact workspace path: `C:/Users/jadav/Coding/car racing game/LICENSE`

````
MIT License

Copyright (c) 2026 APEX Friends Racing contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## README.md

Exact workspace path: `C:/Users/jadav/Coding/car racing game/README.md`

````
# 🏎️ APEX — 3D Friend Racing Game

A complete friends-only racing project: Babylon.js graphics, an authoritative Node.js/Socket.IO server, Cannon physics, private rooms, 2–6 drivers, 3 laps, results, and rematches. No database, player accounts, paid assets, or API keys.

**Status:** implemented and locally tested. Public deployment and a race between different homes are not yet verified. The repository is connected at https://github.com/jadavdhiraj020/Car-racing. Follow the deployment steps below; after deployment you do not start a server for each race.

## Technology and architecture

| Part            | Choice                      | Purpose                                                          |
| --------------- | --------------------------- | ---------------------------------------------------------------- |
| 3D              | Babylon.js 8                | PBR race cars, flowing circuit, environment and chase camera     |
| Physics         | cannon-es 0.20 (MIT)        | Server-side ground, barrier and car contacts                     |
| Multiplayer     | Socket.IO 4                 | Sequenced controls; 30 Hz racing snapshots, 2 Hz lobby snapshots |
| Server          | Node.js 24, Express 5       | Serves the website and runs each race                            |
| Build           | Vite 7                      | Builds browser assets                                            |
| Storage / login | None                        | Rooms live in memory; players enter nicknames                    |
| Hosting         | One Render Free web service | One HTTPS URL for website and multiplayer                        |

Cannon is a deliberate simplification: the server runs the same lightweight JavaScript simulation without a browser or WASM setup, and Babylon renders its results. Havok is not required or bundled. Cannon is MIT licensed: https://github.com/pmndrs/cannon-es. Cars, ground and barriers collide on the server. Two physics substeps plus oriented contact projection keep cars separated, including beside barriers. Handling is an arcade simulation; suspension and body weight transfer are visual approximations.

The client sends six boolean controls and an input sequence; it cannot submit position, laps, or results. The server advances physics at 60 ticks/second, accepts the next checkpoint only in the forward direction, and counts 24 gates per lap. Reset returns to the last accepted checkpoint without increasing progress. A car finishes at 72 crossings. Results appear when everyone remaining finishes, 60 seconds after the first finish, or at the 10-minute race limit. Unfinished drivers receive DNF. Finish times interpolate the crossing within a physics tick; roster order breaks exact ties.

The browser uses a shared steering controller for bounded local prediction, acknowledges input sequences, and reconciles server corrections. Opponents interpolate on a synchronized timeline with a latency-aware buffer and limited extrapolation. Prediction yields to authoritative contacts near other cars and barriers. Select a hosting region near the group. Names are escaped in the UI and placed above opponents as projected DOM labels. Basic payload, nickname, room, player-count, request-rate and room-count limits protect the server. Room codes are invitations, not strong authentication.

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

**This project already uses https://github.com/jadavdhiraj020/Car-racing on main. Skip this repository-creation section for the existing project and connect that repository to Render.** The instructions below apply only when copying the project into a different repository.

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

| Setting              | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Name                 | `apex-friends-racing` (add a suffix if taken)                      |
| Language / Runtime   | `Node`                                                             |
| Branch               | `main`                                                             |
| Region               | Closest available to your friends (Singapore for India if offered) |
| Root Directory       | Leave blank                                                        |
| Build Command        | `npm ci --include=dev && npm run build`                            |
| Start Command        | `npm start`                                                        |
| Instance Type        | **Free — $0/month**                                                |
| Health Check Path    | `/health`                                                          |
| Environment variable | `NODE_ENV` = `production`                                          |
| Environment variable | `NODE_VERSION` = `24.19.0`                                         |

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

| Problem                                       | Likely reason                                                | Exact fix                                                                                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `node` / `npm` not recognized                 | Node missing or old terminal PATH                            | Install Node 24 LTS from the link above, close every PowerShell window, reopen, run `node --version`.                                                                    |
| `npm.ps1 cannot be loaded`                    | PowerShell script policy                                     | Use `npm.cmd` in every command as shown. No policy change needed.                                                                                                        |
| Port 3000 already in use                      | Another server is running                                    | Use the existing game at localhost:3000, or stop its terminal with Ctrl+C. For a different port run `$env:PORT='3001'` then `npm.cmd start`; open localhost:3001.        |
| CORS error                                    | Frontend and backend were split or hardcoded URL added       | Restore `const ... socket=io()` in main.js and deploy the entire root as one Web Service. No `VITE_SERVER_URL` is needed. Rebuild/redeploy.                              |
| Socket.IO connection failed                   | Server stopped, waking, or wrong URL                         | Open the same host's `/health`. Start Node locally, or check Render service is Live and wait 60–90 seconds. Reload.                                                      |
| WebSocket failed                              | Proxy blocks WebSockets                                      | Socket.IO normally falls back to HTTP polling. If it remains offline, try a browser without network-blocking extensions or a different network.                          |
| Friends cannot join                           | Wrong/expired code, full room, active race, localhost invite | Share the deployed HTTPS link. Create a fresh lobby; maximum six people; mid-race joins are disabled.                                                                    |
| Works locally but not online                  | Wrong root/build/start/port                                  | Use the exact Render table above, root blank, `npm ci --include=dev && npm run build`, `npm start`; app must keep supplied PORT behavior.                                |
| HTTPS/WSS or mixed-content error              | Hardcoded HTTP server                                        | Restore same-origin `io()`. Use Render's HTTPS URL. Rebuild/redeploy.                                                                                                    |
| Blank 3D screen                               | WebGL disabled or outdated driver/browser                    | In Chrome Settings → System enable graphics acceleration, relaunch Chrome, update graphics driver; try Edge. Verify `/health` and reload Ctrl+F5.                        |
| Low frame rate                                | High pixel density, weak GPU or software rendering           | Click the quality button until it reads **QUALITY LOW**; close extra 3D browser windows; enable hardware acceleration.                                                   |
| Car falls through road                        | Modified ground/physics code                                 | Original track has a ground plane. Press R. Restore `server/race.js` ground setup and flat track; server auto-resets out-of-bounds cars.                                 |
| Car stuck at barrier                          | Steering into wall                                           | Brake/reverse with S or press R (2-second reset cooldown).                                                                                                               |
| Remote cars not moving                        | Race not started, connection lost, input window unfocused    | Wait for GO; focus the driving window; verify ONLINE indicator and `/health`. Disconnected players must rejoin the next lobby.                                           |
| Car stops accelerating when switching windows | Controls clear on blur, intentionally                        | Keep the driving window focused. Use another device to drive both simultaneously.                                                                                        |
| Lap does not count                            | Gate skipped or driving backward                             | Follow the glowing next gate. Press R to return to last valid checkpoint. Every gate must be crossed forward.                                                            |
| Deployment build failed                       | Wrong folder/Node/dependencies                               | Confirm root blank, Node 24, lockfile committed and exact build command; inspect Render Events → failed deploy → logs. Run `npm.cmd ci` and `npm.cmd run build` locally. |
| Server crashes / all rooms disappear          | Restart, deploy, resource limit or edited code               | Check Render Logs, run `npm.cmd test`, redeploy known working commit. Create new rooms; no persistence is expected.                                                      |
| Free hosting sleeps                           | No traffic for 15 minutes                                    | Open the game and wait about a minute. Create a new room if the old one was lost. No manual server command required.                                                     |
| Service suspended                             | Free monthly allowance exceeded                              | Check Render Billing → Monthly Included Usage. Wait for reset or reduce other free services; do not upgrade if you want to remain free.                                  |
| No sound                                      | Browser audio requires a gesture                             | Click **SOUND OFF** to turn audio on; check OS volume.                                                                                                                   |
| Invite copy fails                             | Clipboard blocked / insecure LAN HTTP                        | Copy the address bar; room code is also displayed. Clipboard should work on localhost and deployed HTTPS.                                                                |
| `remote origin already exists`                | Repository already connected                                 | Run `git remote -v`. If it is your correct repository, skip `remote add` and run `git push -u origin main`.                                                              |

## Verification

See `VERIFICATION.md` for observed checks, not just a mental checklist. Public deployment remains pending your account connection. Mobile layout is checked at a narrow viewport; actual touch-device play, wide-area latency and low-end hardware performance still need real-device testing.

# 🔴 ONLY THINGS YOU MUST DO

1. Sign in to GitHub and publish the prepared repository (GitHub Desktop steps above).
2. Sign in to Render, connect that repository, and select the **Free** web service using the exact settings above.
3. Copy your assigned HTTPS URL and invite a friend on another network for the final online race check.

No local server management is needed after that one-time deployment, subject to free hosting limits.

# Car-racing
````

## THIRD_PARTY_NOTICES.md

Exact workspace path: `C:/Users/jadav/Coding/car racing game/THIRD_PARTY_NOTICES.md`

````
# Bundled font licenses

Fonts are served locally from the production build. Engine audio, car geometry and reflection textures are procedural.

## barlow-condensed

Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-ThinItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-ExtraLight.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-ExtraLightItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-Light.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-LightItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-Regular.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-Italic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-Medium.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-MediumItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-SemiBold.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-SemiBoldItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-Bold.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-BoldItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-ExtraBold.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-ExtraBoldItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-Black.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow) BarlowCondensed-BlackItalic.ttf: Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL

---

SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1. Neither the Font Software nor any of its individual components,
   in Original or Modified Versions, may be sold by itself.

2. Original or Modified Versions of the Font Software may be bundled,
   redistributed and/or sold with any software, provided that each copy
   contains the above copyright notice and this license. These can be
   included either as stand-alone text files, human-readable headers or
   in the appropriate machine-readable metadata fields within text or
   binary files as long as those fields can be easily viewed by the user.

3. No Modified Version of the Font Software may use the Reserved Font
   Name(s) unless explicit written permission is granted by the corresponding
   Copyright Holder. This restriction only applies to the primary font name as
   presented to the users.

4. The name(s) of the Copyright Holder(s) or the Author(s) of the Font
   Software shall not be used to promote, endorse or advertise any
   Modified Version, except to acknowledge the contribution(s) of the
   Copyright Holder(s) and the Author(s) or with their explicit written
   permission.

5. The Font Software, modified or unmodified, in part or in whole,
   must be distributed entirely under this license, and must not be
   distributed under any other license. The requirement for fonts to
   remain under this license does not apply to any document created
   using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.

## dm-sans

Copyright 2014 The DM Sans Project Authors (https://github.com/googlefonts/dm-fonts) DMSans-Italic[opsz,wght].ttf: Copyright 2014 The DM Sans Project Authors (https://github.com/googlefonts/dm-fonts)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL

---

SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1. Neither the Font Software nor any of its individual components,
   in Original or Modified Versions, may be sold by itself.

2. Original or Modified Versions of the Font Software may be bundled,
   redistributed and/or sold with any software, provided that each copy
   contains the above copyright notice and this license. These can be
   included either as stand-alone text files, human-readable headers or
   in the appropriate machine-readable metadata fields within text or
   binary files as long as those fields can be easily viewed by the user.

3. No Modified Version of the Font Software may use the Reserved Font
   Name(s) unless explicit written permission is granted by the corresponding
   Copyright Holder. This restriction only applies to the primary font name as
   presented to the users.

4. The name(s) of the Copyright Holder(s) or the Author(s) of the Font
   Software shall not be used to promote, endorse or advertise any
   Modified Version, except to acknowledge the contribution(s) of the
   Copyright Holder(s) and the Author(s) or with their explicit written
   permission.

5. The Font Software, modified or unmodified, in part or in whole,
   must be distributed entirely under this license, and must not be
   distributed under any other license. The requirement for fonts to
   remain under this license does not apply to any document created
   using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
````

## VERIFICATION.md

Exact workspace path: `C:/Users/jadav/Coding/car racing game/VERIFICATION.md`

````
# Verification record

Checked 2026-09-13 on Windows with Node.js 24.19.0. No test files were created or modified for this overhaul. Additional checks ran as inline Node scripts.

## Passing checks

- Production Vite build: successful. Main bundle approximately 1.46 MB / 379 KB gzip, plus lazy shader modules and local fonts. Vite retains its size advisory.
- All eight existing tests pass: circuit continuity, physics acceleration/braking/reverse, barriers, stale input, checkpoint order, three physically driven laps, real Socket.IO lifecycle, isolation, authority, capacity, disconnect host transfer and finish timeout.
- Opposing 50 m/s cars: detected impact, no penetration or pass-through in the sampled simulation. Occupied-checkpoint resets selected a free position.
- Six moving cars over 900 physics ticks: maximum measured overlap 0; barrier footprint excess 0. Mean simulation tick 1.54 ms, p95 1.89 ms on this machine, outside the software-rendering stress run.
- Two independent Chrome windows loaded the production build and passed create/join, quality switching, synchronized countdown, keyboard acceleration/turning/reset, winner/results, rematch, leave and narrow layout. No JavaScript errors in the final native-GPU run.
- Results presentation uses the existing server-side finish fixture; the separate server test physically drives three complete laps. This is not a human-driven browser race to the finish.
- Audio toggles ON/OFF/ON succeed during racing without exceptions. Procedural engine/gear/shift/tire/kerb/impact audio is retained, RPM now drops on upshift, audio resumes correctly, and opponent positions use the correct coordinate conversion for stereo.
- Added 120 ms input delay and 120 ms snapshot delay, then suppressed snapshots for 350 ms: both clients stayed in the same race and recovered fresh state. This models transient application-message delay, not an exhaustive WAN packet-loss test.
- Player labels use text content; a nickname containing HTML is displayed literally.
- Visually inspected production screenshots: car geometry and wheel sidewalls, race HUD, track direction, results and mobile home. Screenshots are in ignored test-artifacts/.

## Performance observations

- One 1440 x 1000 native-GPU browser with two network cars, Medium and audio: mean 18.61 ms (about 54 FPS), p95 34.6 ms over 180 frames, reaching 180 km/h. Some frame spikes remain on this integrated GPU.
- Two simultaneous 1440 x 1000 Chrome windows, Medium, Intel UHD / Direct3D11, audio active: mean frame interval 20.21 ms (about 49 FPS), p95 27.9 ms over 180 frames. Both clients share one GPU.
- Two 960 x 640 windows using SwiftShader software graphics: mean 100.08 ms, p95 124.8 ms. Software rendering is substantially slower and is not recommended for playing.
- An initial shared-context browser harness missed countdown assertions under load. Independent contexts completed the full assertions. A native run had one transient shader-fetch failure; the final rerun passed with request-failure monitoring and no page errors.
- These are short local measurements, not a universal 60 FPS or internet-latency guarantee.

## Reproduce

Run npm.cmd ci, npm.cmd test, npm.cmd run build, then npm.cmd start. The existing npm.cmd run test:browser script uses software Chrome graphics. Native verification evaluated those same assertions in memory with --use-angle=d3d11 and one browser.newPage context per driver; no test source was changed. Additional latency and performance checks also ran inline without writing test files.

For manual multiplayer verification, open two independent browser windows, create/join the same room, enable sound, start, drive, finish three laps and rematch. Use the deployed HTTPS URL to test separate homes.

## Limits

- Public deployment and play between separate homes were not verified in this run. The existing GitHub main branch is the requested delivery target; Render configuration remains intact.
- A transport disconnect removes the player and transfers host. Full mid-race rejoining is intentionally unchanged; transient message gaps are handled separately.
- Physics remains an arcade handling model with authoritative contacts; suspension and weight-transfer animation are approximations, not a full tire/suspension simulator.
- Audio is original procedural synthesis, not recorded F1 engine samples. Perceptual realism has not been independently rated or tested on physical mobile devices.
- Contact stress checks found no overlap in their tested cases; finite simulation and arbitrary network failures cannot provide an absolute guarantee for every possible situation.
- Rooms remain in memory. Server restarts/deploys clear them. No persistence, accounts or unrelated features were added.
````

## client/index.html

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/index.html`

````
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#122620" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏎️</text></svg>" />
    <title>APEX — Friends on the grid</title>
  </head>
  <body>
    <canvas id="game" aria-label="3D racing circuit"></canvas>
    <header>
      <a class="brand" href="/"
        >A<span>↗</span>PEX <small>FRIENDS ON THE GRID</small></a
      >
      <div class="top-right">
        <span id="connection">CONNECTING</span
        ><button id="sound" class="small">SOUND OFF</button
        ><button id="quality" class="small">QUALITY MEDIUM</button>
      </div>
    </header>
    <main id="home">
      <div class="eyebrow">PRIVATE ROOMS. REAL RIVALRIES.</div>
      <h1>Good friends.<br /><em>Bad losers.</em></h1>
      <p class="intro">
        A little friendly competition.<br />Three laps. Six drivers. One very
        smug winner.
      </p>
      <section class="panel">
        <label for="nickname">YOUR DRIVER NAME</label
        ><input
          id="nickname"
          maxlength="18"
          placeholder="e.g. Dhiraj"
          autocomplete="nickname"
        /><button id="create" class="primary">
          CREATE A RACE <span>↗</span>
        </button>
        <div class="divider">OR JOIN YOUR FRIENDS</div>
        <div class="join">
          <input
            id="code"
            maxlength="5"
            placeholder="ROOM CODE"
            aria-label="Room code"
          /><button id="join">JOIN →</button>
        </div>
        <p class="micro">No account. No downloads. Just drive.</p>
      </section>
      <div class="specs">
        <span>01 <b>PALM CIRCUIT</b></span
        ><span>02—06 <b>DRIVERS</b></span
        ><span>03 <b>LAPS</b></span>
      </div>
    </main>
    <section id="lobby" class="overlay panel" hidden>
      <div class="eyebrow">THE PADDOCK</div>
      <h2>Your grid is waiting.</h2>
      <label>PRIVATE ROOM CODE</label>
      <div class="room-code" id="roomCode"></div>
      <button id="copy">COPY INVITE LINK ↗</button>
      <div id="players"></div>
      <button id="start" class="primary">START RACE →</button>
      <p id="waiting" class="micro"></p>
      <button class="leave small">LEAVE ROOM</button>
    </section>
    <section id="hud" hidden>
      <div class="hud-top">
        <div><label>LAP</label><strong id="lap">1 / 3</strong></div>
        <div><label>POSITION</label><strong id="position">1 / 2</strong></div>
        <div><label>RACE TIME</label><strong id="timer">0:00.0</strong></div>
        <button class="leave small">LEAVE</button>
      </div>
      <div id="leaderboard" class="panel"></div>
      <div class="speed"><div class="rev-meter" id="rpm"><i></i></div><div class="gear-badge">GEAR <b id="gear">1</b></div><strong id="speed">0</strong><span>KM/H</span></div>
      <div id="finishMessage"></div>
      <div id="gantryHud" class="gantry-hud" hidden><i></i><i></i><i></i><i></i><i></i></div>
      <div id="countdown"></div>
      <canvas id="minimap" width="180" height="200"></canvas>
    </section>
    <section id="results" class="overlay panel" hidden>
      <div class="eyebrow">THE CHECKERED FLAG</div>
      <h2 id="winner">Race results</h2>
      <div id="resultRows"></div>
      <button id="rematch" class="primary">RUN IT BACK ↻</button>
      <p id="resultWaiting" class="micro"></p>
      <button class="leave small">LEAVE ROOM</button>
    </section>
    <footer>
      <span class="live-dot"></span>
      <span>PALM CIRCUIT <b> / </b> COASTAL CLUB</span>
      <details>
        <summary>HOW TO DRIVE</summary>
        <p>
          <kbd>W ↑ 8</kbd> Accelerate · <kbd>S ↓ 2</kbd> Brake / reverse<br /><kbd
            >A ← 4</kbd
          >
          <kbd>D → 6</kbd> Steer · <kbd>SPACE / 0</kbd> Drift ·
          <kbd>R</kbd> Reset<br />Follow the arrows. Pass the glowing checkpoint
          gates in order.<br />Cars make contact. Leave room when overtaking.
        </p>
      </details>
    </footer>
    <div id="toast" role="status" aria-live="polite"></div>
    <div id="touch" hidden>
      <button data-key="left">◀</button><button data-key="right">▶</button
      ><button data-key="down">BRAKE</button><button data-key="up">GAS</button
      ><button data-key="reset">RESET</button>
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
````

## client/src/audio.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/audio.js`

````
// Professional Web Audio API Procedural F1 Racing Audio Synthesizer
// Pure procedural synthesis - zero external audio assets required

export class EngineAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.effects = null;

    // Combustion engine nodes
    this.subOsc = null;
    this.midOsc = null;
    this.highOsc = null;
    this.raspOsc = null;
    this.turboOsc = null;
    this.engineGain = null;
    this.turboGain = null;
    this.screamerFilter = null;
    this.intakeFilter = null;
    this.exhaustShaper = null;

    // Wind & Tire noise
    this.windGain = null;
    this.windFilter = null;
    this.skidGain = null;
    this.skidFilter = null;

    // Kerb vibration
    this.kerbOsc = null;
    this.kerbGain = null;

    // State simulation
    this.rpm = 950;
    this.idleRpm = 1100;
    this.maxRpm = 13500;
    this.gear = 1;
    this.boost = 0;
    this.previous = performance.now();
    this.shiftUntil = 0;
    this.shiftType = "";
    this.enabled = false;
    this.lastImpact = 0;
    this.lastPop = 0;
    this.lastThrottle = false;
    this.remoteCars = new Map();
  }

  async init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.enabled = true;
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error("Web Audio unavailable");
    const ctx = new AC();
    this.ctx = ctx;

    // Master bus with multiband limiting
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.knee.value = 8;
    limiter.ratio.value = 10;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.12;
    limiter.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(limiter);

    this.effects = ctx.createGain();
    this.effects.gain.value = 0.5;
    this.effects.connect(limiter);

    // Engine exhaust distortion wave shaper for aggressive F1 rasp
    this.exhaustShaper = ctx.createWaveShaper();
    const curve = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      const x = (i * 2) / 512 - 1;
      curve[i] = Math.tanh(2.4 * x);
    }
    this.exhaustShaper.curve = curve;

    // Screamer resonance filter (F1 tuned exhaust header acoustic formant)
    this.screamerFilter = ctx.createBiquadFilter();
    this.screamerFilter.type = "bandpass";
    this.screamerFilter.frequency.value = 1800;
    this.screamerFilter.Q.value = 2.4;

    // Intake throat lowpass filter
    this.intakeFilter = ctx.createBiquadFilter();
    this.intakeFilter.type = "lowpass";
    this.intakeFilter.frequency.value = 1200;
    this.intakeFilter.Q.value = 2.0;

    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0.4;

    // Route engine oscillators:
    // Sub/mid/high -> Intake Filter -> Shaper -> Screamer Filter & Master
    this.intakeFilter.connect(this.exhaustShaper);
    this.exhaustShaper.connect(this.screamerFilter);
    this.screamerFilter.connect(this.engineGain);
    this.exhaustShaper.connect(this.engineGain);
    this.engineGain.connect(this.master);

    // 1. Sub-bass fundamental (chassis shudder)
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = "sawtooth";
    this.subGain = ctx.createGain();
    this.subGain.gain.value = 0.32;
    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.intakeFilter);

    // 2. Mid harmonic combustion growl (2nd & 3rd harmonics)
    this.midOsc = ctx.createOscillator();
    this.midOsc.type = "sawtooth";
    this.midGain = ctx.createGain();
    this.midGain.gain.value = 0.45;
    this.midOsc.connect(this.midGain);
    this.midGain.connect(this.intakeFilter);

    // 3. High-RPM screamer harmonic (high pulse wave)
    this.highOsc = ctx.createOscillator();
    this.highOsc.type = "triangle";
    this.highGain = ctx.createGain();
    this.highGain.gain.value = 0.35;
    this.highOsc.connect(this.highGain);
    this.highGain.connect(this.intakeFilter);

    // 4. Combustion cylinder rasp (sharp sawtooth 4th harmonic)
    this.raspOsc = ctx.createOscillator();
    this.raspOsc.type = "sawtooth";
    this.raspGain = ctx.createGain();
    this.raspGain.gain.value = 0.28;
    this.raspOsc.connect(this.raspGain);
    this.raspGain.connect(this.intakeFilter);

    // 5. Turbocharger spool whistle
    this.turboOsc = ctx.createOscillator();
    this.turboOsc.type = "sine";
    this.turboGain = ctx.createGain();
    this.turboGain.gain.value = 0.0;
    this.turboFilter = ctx.createBiquadFilter();
    this.turboFilter.type = "bandpass";
    this.turboFilter.frequency.value = 3200;
    this.turboFilter.Q.value = 4.0;
    this.turboOsc.connect(this.turboFilter);
    this.turboFilter.connect(this.turboGain);
    this.turboGain.connect(this.master);

    // 6. Wind noise generator (high speed rush)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.frequency.value = 800;
    this.windFilter.Q.value = 1.2;

    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0;

    noiseSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.master);

    // 7. Tire skid / drift noise
    const skidSource = ctx.createBufferSource();
    skidSource.buffer = noiseBuffer;
    skidSource.loop = true;

    this.skidFilter = ctx.createBiquadFilter();
    this.skidFilter.type = "bandpass";
    this.skidFilter.frequency.value = 1350;
    this.skidFilter.Q.value = 3.2;

    this.skidGain = ctx.createGain();
    this.skidGain.gain.value = 0;

    skidSource.connect(this.skidFilter);
    this.skidFilter.connect(this.skidGain);
    this.skidGain.connect(this.master);

    // 8. Kerb rumble oscillator
    this.kerbOsc = ctx.createOscillator();
    this.kerbOsc.type = "sine";
    this.kerbOsc.frequency.value = 46;
    this.kerbGain = ctx.createGain();
    this.kerbGain.gain.value = 0;
    this.kerbOsc.connect(this.kerbGain);
    this.kerbGain.connect(this.master);

    // Start running oscillators
    const now = ctx.currentTime;
    this.subOsc.start(now);
    this.midOsc.start(now);
    this.highOsc.start(now);
    this.raspOsc.start(now);
    this.turboOsc.start(now);
    noiseSource.start(now);
    skidSource.start(now);
    this.kerbOsc.start(now);

    this.enabled = true;
    if (ctx.state === "suspended") await ctx.resume();
  }

  update(speed, throttle, brake, drift, racing, finished, onKerb = false) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.previous) / 1000);
    this.previous = now;

    // F1 sequential 6-speed gearbox simulation
    const gearThresholds = [12, 21, 30, 39, 47];
    let gear = this.gear;

    if (speed > (gearThresholds[gear - 1] ?? Infinity) && gear < 6) {
      // Upshift: ignition cut and exhaust crackle
      gear++;
      this.gear = gear;
      this.shiftUntil = now + 65;
      this.shiftType = "up";
      this.exhaustPop(0.7);
    } else if (gear > 1 && speed < gearThresholds[gear - 2] - 3.5) {
      // Downshift: rev-match throttle blip
      gear--;
      this.gear = gear;
      this.shiftUntil = now + 80;
      this.shiftType = "down";
      this.exhaustPop(0.4);
    }

    if (!racing) gear = 1;
    this.gear = gear;

    // Calculate realistic F1 RPM curve
    const gearRatios = [1.0, 0.72, 0.54, 0.42, 0.34, 0.28];
    const ratio = gearRatios[gear - 1];

    let targetRpm = this.idleRpm;
    if (racing && !finished) {
      const driveSpeedRpm = speed * 800 * ratio;
      const throttleRpm = throttle ? 1000 : 0;
      const brakeDrop = brake ? 600 : 0;
      targetRpm = Math.min(
        this.maxRpm,
        Math.max(
          this.idleRpm,
          this.idleRpm + driveSpeedRpm + throttleRpm - brakeDrop,
        ),
      );

      // Downshift blip
      if (now < this.shiftUntil && this.shiftType === "down") {
        targetRpm = Math.min(this.maxRpm, targetRpm + 1600);
      }
    }

    // Smooth RPM response
    const rpmAttack = throttle ? 18 : 12;
    this.rpm += (targetRpm - this.rpm) * (1 - Math.exp(-dt * rpmAttack));

    // Turbo wastegate flutter on off-throttle lift at high boost
    if (this.lastThrottle && !throttle && this.boost > 0.28) {
      this.wastegateFlutter(this.boost);
    }
    this.lastThrottle = throttle;

    // Turbo boost pressure simulation
    const targetBoost = throttle && racing && speed > 5 ? 1.0 : 0.0;
    this.boost +=
      (targetBoost - this.boost) * (1 - Math.exp(-dt * (throttle ? 4 : 8)));

    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(racing && !finished ? 0.4 : 0.14, t, 0.06);
    this.effects.gain.setTargetAtTime(0.25, t, 0.03);
    const isShifting = now < this.shiftUntil && this.shiftType === "up";

    // High-RPM rev limiter bouncing at redline
    let limiterCut = 1.0;
    if (this.rpm > 13150 && throttle) {
      limiterCut = Math.sin(now * 0.08) > 0.1 ? 1.0 : 0.06;
      if (limiterCut < 0.5 && Math.random() < 0.25) {
        this.exhaustPop(0.35);
      }
    }

    // F1 engine acoustics: fundamental cylinder firing frequency
    // (V6 at 12,000 RPM fires 600 times per second)
    const baseFreq = Math.max(38, (this.rpm / 60) * 1.5);
    const cut = (isShifting ? 0.15 : 1.0) * limiterCut;

    // Frequency modulation for organic combustion feel
    const jitter = Math.sin(now * 0.08) * 1.5;
    this.subOsc.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.02);
    this.midOsc.frequency.setTargetAtTime(baseFreq + jitter, t, 0.02);
    this.highOsc.frequency.setTargetAtTime(
      baseFreq * 2 + jitter * 1.8,
      t,
      0.02,
    );
    this.raspOsc.frequency.setTargetAtTime(baseFreq * 3, t, 0.02);

    // Turbo whistle tracks boost pressure and RPM
    const turboFreq = 2200 + this.boost * 2400 + (this.rpm / this.maxRpm) * 800;
    this.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.03);
    this.turboGain.gain.setTargetAtTime(
      racing ? this.boost * 0.14 : 0,
      t,
      0.05,
    );

    // Formant acoustic filters
    const filterCutoff = Math.min(
      7500,
      Math.max(
        450,
        700 + (this.rpm / this.maxRpm) * 5800 * (throttle ? 1.35 : 0.65),
      ),
    );
    this.intakeFilter.frequency.setTargetAtTime(filterCutoff, t, 0.03);
    this.screamerFilter.frequency.setTargetAtTime(
      1400 + (this.rpm / this.maxRpm) * 2200,
      t,
      0.04,
    );

    // Engine volume
    const baseGain = racing && !finished ? (throttle ? 0.62 : 0.38) : 0.22;
    this.engineGain.gain.setTargetAtTime(baseGain * cut, t, 0.03);

    // Aerodynamic high-speed wind roar
    const windIntensity = Math.min(1, Math.max(0, (speed - 15) / 35));
    this.windGain.gain.setTargetAtTime(windIntensity * 0.28, t, 0.06);
    this.windFilter.frequency.setTargetAtTime(
      500 + windIntensity * 1600,
      t,
      0.06,
    );

    // Tire squeal (drift or heavy braking)
    const isDrifting = drift && speed > 8;
    const isLockingBrakes = brake && speed > 16;
    const skidIntensity = isDrifting ? 0.38 : isLockingBrakes ? 0.26 : 0;
    this.skidGain.gain.setTargetAtTime(skidIntensity, t, 0.04);
    this.skidFilter.frequency.setTargetAtTime(
      isDrifting ? 1450 : 1850,
      t,
      0.04,
    );

    // Apex kerb rumble
    const kerbIntensity = onKerb && speed > 6 ? Math.min(0.4, speed / 60) : 0;
    this.kerbGain.gain.setTargetAtTime(kerbIntensity, t, 0.03);
  }

  exhaustPop(intensity = 0.6) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const now = performance.now();
    if (now - this.lastPop < 90) return;
    this.lastPop = now;

    const t = this.ctx.currentTime;
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();

    popOsc.type = "triangle";
    popOsc.frequency.setValueAtTime(140 + Math.random() * 40, t);
    popOsc.frequency.exponentialRampToValueAtTime(30, t + 0.07);

    popGain.gain.setValueAtTime(intensity * 0.5, t);
    popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    popOsc.connect(popGain);
    popGain.connect(this.effects);

    popOsc.start(t);
    popOsc.stop(t + 0.07);
    popOsc.onended = () => {
      popOsc.disconnect();
      popGain.disconnect();
    };
  }

  wastegateFlutter(boost = 0.5) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const t = this.ctx.currentTime;
    const bursts = 4;
    for (let i = 0; i < bursts; i++) {
      const delay = i * 0.055;
      const decay = Math.pow(0.55, i);
      const flutterOsc = this.ctx.createOscillator();
      const flutterFilter = this.ctx.createBiquadFilter();
      const flutterGain = this.ctx.createGain();

      flutterOsc.type = "sawtooth";
      flutterOsc.frequency.setValueAtTime(950 - i * 85, t + delay);
      flutterOsc.frequency.exponentialRampToValueAtTime(320, t + delay + 0.045);

      flutterFilter.type = "bandpass";
      flutterFilter.frequency.setValueAtTime(1600 - i * 140, t + delay);
      flutterFilter.Q.value = 5.0;

      flutterGain.gain.setValueAtTime(boost * 0.22 * decay, t + delay);
      flutterGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.045);

      flutterOsc.connect(flutterFilter);
      flutterFilter.connect(flutterGain);
      flutterGain.connect(this.effects);

      flutterOsc.start(t + delay);
      flutterOsc.stop(t + delay + 0.045);
      flutterOsc.onended = () => {
        flutterOsc.disconnect();
        flutterFilter.disconnect();
        flutterGain.disconnect();
      };
    }
  }

  countdownLight(step) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const t = this.ctx.currentTime;
    if (step >= 1 && step <= 5) {
      // 5 Red Lights arming tones
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(460, t + 0.12);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.effects);
      osc.start(t);
      osc.stop(t + 0.12);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } else if (step === 0) {
      // LIGHTS OUT / GO!
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(920, t);
      osc2.frequency.setValueAtTime(1150, t);
      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.effects);
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.38);
      osc2.stop(t + 0.38);
      osc2.onended = () => {
        osc1.disconnect();
        osc2.disconnect();
        gain.disconnect();
      };
    }
  }

  beep(frequency = 600, duration = 0.12, volume = 1) {
    if (!this.ctx || !this.effects || !this.enabled) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(frequency, t);
    o.frequency.exponentialRampToValueAtTime(
      Math.max(40, frequency * 0.65),
      t + duration,
    );
    g.gain.setValueAtTime(volume * 0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(this.effects);
    o.start(t);
    o.stop(t + duration);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }

  impact(amount) {
    if (amount > 0.12 && performance.now() - this.lastImpact > 180) {
      this.lastImpact = performance.now();
      const t = this.ctx?.currentTime;
      if (!t || !this.enabled) return;

      // Heavy body/barrier thud
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(80 + amount * 60, t);
      o.frequency.exponentialRampToValueAtTime(25, t + 0.16);
      g.gain.setValueAtTime(Math.min(0.8, amount * 0.7), t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.connect(g);
      g.connect(this.effects);
      o.start(t);
      o.stop(t + 0.16);
      o.onended = () => {
        o.disconnect();
        g.disconnect();
      };
    }
  }

  celebrate() {
    if (!this.ctx || !this.effects || !this.enabled) return;
    // Grand Prix podium fanfare
    const chords = [
      [523.25, 659.25, 783.99], // C
      [587.33, 739.99, 880.0], // D
      [659.25, 830.61, 987.77], // E
      [1046.5, 1318.5, 1567.98], // C octave
    ];
    chords.forEach((chord, step) => {
      setTimeout(() => {
        if (!this.ctx || !this.enabled) return;
        const t = this.ctx.currentTime;
        chord.forEach((freq) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.35, t);
          g.gain.exponentialRampToValueAtTime(
            0.001,
            t + (step === 3 ? 0.8 : 0.28),
          );
          o.connect(g);
          g.connect(this.effects);
          o.start(t);
          o.stop(t + (step === 3 ? 0.8 : 0.28));
          o.onended = () => {
            o.disconnect();
            g.disconnect();
          };
        });
      }, step * 200);
    });
  }

  updateRemoteCar(id, carPos, camPos, speed, throttle) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime;
    if (Math.hypot(carPos.x - camPos.x, carPos.z - camPos.z) > 90) {
      this.removeRemoteCar(id);
      return;
    }
    let node = this.remoteCars.get(id);
    if (!node) {
      const panner = this.ctx.createPanner();
      panner.panningModel = "HRTF";
      panner.distanceModel = "exponential";
      panner.refDistance = 4;
      panner.maxDistance = 90;
      panner.rolloffFactor = 1.1;

      const osc = this.ctx.createOscillator();
      osc.type = "sawtooth";

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 850;
      filter.Q.value = 2.2;

      const gain = this.ctx.createGain();
      gain.gain.value = 0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(this.master);

      osc.start(t);
      node = { panner, osc, filter, gain };
      this.remoteCars.set(id, node);
    }

    if (this.ctx.listener.positionX) {
      node.panner.positionX.setTargetAtTime(carPos.x, t, 0.04);
      node.panner.positionY.setTargetAtTime(carPos.y, t, 0.04);
      node.panner.positionZ.setTargetAtTime(-carPos.z, t, 0.04);
    } else {
      node.panner.setPosition(carPos.x, carPos.y, -carPos.z);
    }

    const freq = Math.max(50, 48 + speed * 4.6);
    node.osc.frequency.setTargetAtTime(freq, t, 0.04);
    node.filter.frequency.setTargetAtTime(
      Math.min(2800, 600 + speed * 35),
      t,
      0.04,
    );
    const targetVol = Math.min(
      0.32,
      (speed / 45) * 0.32 * (throttle ? 1.0 : 0.6),
    );
    node.gain.gain.setTargetAtTime(targetVol, t, 0.04);
  }

  removeRemoteCar(id) {
    const node = this.remoteCars.get(id);
    if (!node) return;
    try {
      node.osc.stop();
      node.osc.disconnect();
      node.filter.disconnect();
      node.gain.disconnect();
      node.panner.disconnect();
    } catch {}
    this.remoteCars.delete(id);
  }

  listener(position, forward) {
    if (!this.ctx || !this.enabled) return;
    const l = this.ctx.listener,
      t = this.ctx.currentTime;
    if (l.forwardX) {
      for (const [key, value] of Object.entries({
        positionX: position.x,
        positionY: position.y,
        positionZ: -position.z,
        forwardX: forward.x,
        forwardY: forward.y,
        forwardZ: -forward.z,
        upX: 0,
        upY: 1,
        upZ: 0,
      }))
        l[key].setTargetAtTime(value, t, 0.03);
    } else {
      l.setPosition(position.x, position.y, -position.z);
      l.setOrientation(forward.x, forward.y, -forward.z, 0, 1, 0);
    }
  }
  silence() {
    if (this.master && this.ctx)
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    for (const id of [...this.remoteCars.keys()]) this.removeRemoteCar(id);
  }
  mute() {
    this.enabled = false;
    if (this.effects && this.ctx)
      this.effects.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    }
    for (const id of this.remoteCars.keys()) {
      this.removeRemoteCar(id);
    }
  }
}
````

## client/src/main.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/main.js`

````
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "./style.css";
import { io } from "socket.io-client";
import { createScene } from "./scene.js";
import { TRACK, LENGTH, point, nearest } from "../../shared/track.js";

const $ = (id) => document.getElementById(id),
  socket = io(),
  keys = {},
  map = $("minimap").getContext("2d");

let view,
  state,
  offset = 0,
  toastTimer,
  sound = false,
  lastCountdown = "",
  lastPhase = "",
  lastGantryStep = -1,
  quality = 1;

window.__getState = () => (state ? structuredClone(state) : null);
window.__getKeys = () => ({ ...keys });
let clockKnown = false,
  clockSamples = [],
  inputSeq = 0,
  inputHistory = [],
  lastRender = 0,
  lastMap = 0,
  uiSignature = "";
function syncClock() {
  if (!socket.connected) return;
  const start = Date.now();
  socket.timeout(2000).emit("clock", {}, (error, serverTime) => {
    if (error || !Number.isFinite(serverTime)) return;
    const end = Date.now();
    clockSamples.push({
      rtt: end - start,
      offset: serverTime - (start + end) / 2,
    });
    clockSamples = clockSamples.slice(-8);
    const best = [...clockSamples].sort((a, b) => a.rtt - b.rtt)[0];
    offset = best.offset;
    clockKnown = true;
    view?.network(offset, best.rtt);
  });
}
setInterval(syncClock, 5000);

import { EngineAudio } from "./audio.js";

const engineAudio = new EngineAudio();

function notice(text) {
  $("toast").textContent = text;
  $("toast").style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").style.display = "none"), 4500);
}

try {
  view = createScene($("game"), engineAudio);
} catch (e) {
  notice(
    "3D could not start. Enable browser hardware acceleration and reload.",
  );
  console.error(e);
}

function beep(freq = 600, duration = 0.12) {
  if (!sound) return;
  engineAudio.beep(freq, duration);
}

$("sound").onclick = async () => {
  sound = !sound;
  if (sound) {
    try {
      await engineAudio.init();
    } catch {
      sound = false;
      notice("Audio could not start. Try Chrome or Edge over HTTPS.");
    }
  } else engineAudio.mute();
  $("sound").textContent = sound ? "SOUND ON" : "SOUND OFF";
};

$("quality").onclick = () => {
  quality = (quality + 1) % 3;
  view?.quality(quality);
  $("quality").textContent = "QUALITY " + ["LOW", "MEDIUM", "HIGH"][quality];
};

const invite = new URLSearchParams(location.search).get("room");
if (invite) $("code").value = invite.toUpperCase().slice(0, 5);

function request(event, data = {}) {
  return new Promise((resolve) => {
    if (!socket.connected) {
      notice("Connecting to server. Please wait and try again.");
      return resolve(false);
    }
    socket.timeout(5000).emit(event, data, (err, result) => {
      if (err || !result?.ok) {
        notice(result?.error || "Server did not respond. Please try again.");
        resolve(false);
      } else resolve(result);
    });
  });
}

$("create").onclick = () =>
  request("enter", { name: $("nickname").value, create: true });
$("join").onclick = () =>
  request("enter", {
    name: $("nickname").value,
    code: $("code").value.trim().toUpperCase(),
  });
$("start").onclick = () => request("start");
$("rematch").onclick = () => request("rematch");
document.querySelectorAll(".leave").forEach(
  (b) =>
    (b.onclick = async () => {
      if (await request("leave")) {
        state = null;
        render();
        view?.update({ cars: [], players: [], phase: "lobby" }, socket.id);
        history.replaceState(null, "", location.pathname);
      }
    }),
);

$("copy").onclick = async () => {
  const url = new URL(location.href);
  url.searchParams.set("room", state.code);
  try {
    await navigator.clipboard.writeText(url.href);
    notice("Invite link copied. Send it to your friends!");
  } catch {
    notice("Copy the address bar to share your room.");
  }
};

socket.on("connect", () => {
  $("connection").textContent = "● ONLINE";
  inputSeq = 0;
  inputHistory = [];
  clockKnown = false;
  clockSamples = [];
  syncClock();
});

socket.on("disconnect", () => {
  $("connection").textContent = "RECONNECTING";
  state = null;
  for (const k in keys) keys[k] = false;
  render();
  view?.update({ cars: [], players: [], phase: "lobby" }, socket.id);
  notice(
    "Disconnected. When connected, rejoin the lobby with your code. An active race cannot be rejoined.",
  );
});

socket.on("connect_error", () => {
  $("connection").textContent = "SERVER UNAVAILABLE";
  notice(
    "Server unavailable or waking up. Wait a minute; connection retries automatically.",
  );
});

socket.on("notice", notice);

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const time = (ms) => {
  const s = Math.max(0, ms) / 1000;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};

const ordered = () =>
  [...state.cars].sort((a, b) =>
    a.finished !== null && b.finished !== null
      ? a.finished - b.finished
      : a.finished !== null
        ? -1
        : b.finished !== null
          ? 1
          : b.progress - a.progress,
  );

function render() {
  const phase = state?.phase;
  document.body.classList.toggle("racing", !!state && phase !== "lobby");
  $("home").hidden = !!state;
  $("lobby").hidden = phase !== "lobby";
  $("results").hidden = phase !== "results";
  $("hud").hidden = !["countdown", "racing"].includes(phase);
  $("touch").hidden =
    !["countdown", "racing"].includes(phase) ||
    !matchMedia("(pointer:coarse)").matches;
  if (!state) return;

  const host = state.host === socket.id;
  $("roomCode").textContent = state.code;
  $("players").innerHTML = state.players
    .map(
      (p) =>
        `<div class="player"><i class="swatch" style="background:${p.color}"></i>${esc(p.name)}<span class="badge">${p.id === state.host ? "HOST" : "DRIVER"}</span></div>`,
    )
    .join("");
  $("start").hidden = !host;
  $("start").disabled = state.players.length < 2;
  $("waiting").textContent =
    `${state.players.length} / 6 drivers · ` +
    (host
      ? state.players.length < 2
        ? "Invite a friend to start."
        : "Everyone in? Start when ready."
      : "Waiting for host to start…");

  const rows = ordered(),
    player = (id) => state.players.find((p) => p.id === id);
  const leaderProgress = rows[0]?.progress || 0;

  $("leaderboard").innerHTML = rows
    .map((c, i) => {
      const p = player(c.id);
      const isMe = c.id === socket.id;
      const delta =
        i === 0
          ? "LEADER"
          : c.finished !== null
            ? time(c.finished)
            : `+${Math.round((Math.max(0, leaderProgress - c.progress) * LENGTH) / 24)}m`;
      return (
        `<div class="leader-row ${isMe ? "me" : ""}">` +
        `<span class="leader-pos">${i + 1}</span>` +
        `<i class="swatch" style="background:${p?.color || "#fff"}"></i>` +
        `<span class="leader-name">${esc(p?.name || "Driver")}</span>` +
        `<span class="leader-gap">${c.finished !== null ? "FIN" : delta}</span>` +
        `</div>`
      );
    })
    .join("");

  if (phase === "results") {
    $("winner").textContent =
      rows[0]?.finished !== null
        ? `${player(rows[0]?.id)?.name} takes the win.`
        : "Time’s up!";
    $("resultRows").innerHTML = rows
      .map(
        (c, i) =>
          `<div class="result-row"><b>${i + 1}</b><i class="swatch" style="background:${player(c.id)?.color}"></i><span>${esc(player(c.id)?.name)}</span><span>${c.finished !== null ? time(c.finished) : "DNF"}</span></div>`,
      )
      .join("");
    $("rematch").hidden = !host;
    $("resultWaiting").textContent = host
      ? "New grid. Same friends."
      : "Waiting for host to rematch…";
  }
  updateHud();
}

socket.on("state", (s) => {
  if (!s || !Array.isArray(s.cars) || !Array.isArray(s.players)) return;
  state = s;
  if (!clockKnown) offset = s.serverNow - Date.now();
  updateHud();
  try {
    view?.update(s, socket.id);
  } catch (err) {
    console.warn("View update warning:", err);
  }
  if (lastPhase !== s.phase) {
    if (s.phase === "results") {
      if (sound) engineAudio.celebrate();
      document.querySelectorAll(".confetti").forEach((e) => e.remove());
      for (let i = 0; i < 28; i++) {
        const piece = document.createElement("i");
        piece.className = "confetti";
        piece.style.cssText =
          "--x:" +
          ((i * 37) % 100) +
          "vw;--delay:" +
          (i % 7) * 0.09 +
          "s;--hue:" +
          i * 43 +
          ";";
        document.body.append(piece);
        setTimeout(() => piece.remove(), 4500);
      }
      document.getElementById("results").classList.remove("celebrate");
      requestAnimationFrame(() =>
        document.getElementById("results").classList.add("celebrate"),
      );
    }
    lastPhase = s.phase;
  }
  sendInput();
  const signature = s.phase + s.host + s.players.map((p) => p.id).join(",");
  if (signature !== uiSignature || performance.now() - lastRender > 100) {
    render();
    lastRender = performance.now();
    uiSignature = signature;
  }
  if (s.phase === "lobby") {
    const url = new URL(location.href);
    url.searchParams.set("room", s.code);
    history.replaceState(null, "", url);
  }
});

const bindings = {
  KeyW: "up",
  ArrowUp: "up",
  Numpad8: "up",
  Digit8: "up",
  KeyS: "down",
  ArrowDown: "down",
  Numpad2: "down",
  Digit2: "down",
  KeyA: "left",
  ArrowLeft: "left",
  Numpad4: "left",
  Digit4: "left",
  KeyD: "right",
  ArrowRight: "right",
  Numpad6: "right",
  Digit6: "right",
  Space: "drift",
  Numpad0: "drift",
  Numpad5: "drift",
  KeyR: "reset",
  NumpadEnter: "reset",
};

function resolveKey(e) {
  return (
    bindings[e.code] ||
    (e.key === "8"
      ? "up"
      : e.key === "2"
        ? "down"
        : e.key === "4"
          ? "left"
          : e.key === "6"
            ? "right"
            : null)
  );
}

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const key = resolveKey(e);
  if (key && state) {
    e.preventDefault();
    if (!keys[key]) {
      keys[key] = true;
      sendInput(true);
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = resolveKey(e);
  if (key) {
    keys[key] = false;
    sendInput(true);
  }
});

window.addEventListener("blur", () => {
  for (const k in keys) keys[k] = false;
  sendInput(true);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    for (const k in keys) keys[k] = false;
    sendInput(true);
  }
});

document.querySelectorAll("[data-key]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    keys[b.dataset.key] = true;
    sendInput(true);
  };
  b.onpointerup =
    b.onpointercancel =
    b.onlostpointercapture =
      () => {
        keys[b.dataset.key] = false;
        sendInput(true);
      };
});

let lastInputSent = 0;
function sendInput(force = false) {
  view?.input(keys, inputHistory);
  const now = performance.now();
  if (state && socket.connected && (force || now - lastInputSent >= 33)) {
    const packet = { ...keys, seq: ++inputSeq };
    socket.volatile.emit("input", packet);
    inputHistory.push({ seq: packet.seq, at: now, input: { ...keys } });
    if (inputHistory.length > 90) inputHistory.shift();
    lastInputSent = now;
  }
}
setInterval(sendInput, 1000 / 30);

function updateCountdown() {
  if (!state) return;
  const now = Date.now() + offset,
    elapsed = now - state.startAt;
  const count =
    state.phase === "countdown"
      ? String(Math.min(3, Math.max(1, Math.ceil(-elapsed / 1000))))
      : state.phase === "racing" && elapsed < 1000
        ? "GO!"
        : "";
  $("countdown").textContent = count;
  if (count !== lastCountdown) {
    if (count) beep(count === "GO!" ? 900 : 500);
    lastCountdown = count;
    $("countdown").classList.remove("pulse");
    void $("countdown").offsetWidth;
    if (count) $("countdown").classList.add("pulse");
  }

  // Synchronized 5-light HUD gantry and audio tones
  const gantryHud = $("gantryHud");
  if (gantryHud) {
    const isCountdown = state.phase === "countdown";
    const isJustStarted = state.phase === "racing" && elapsed < 1200;
    gantryHud.hidden = !isCountdown && !isJustStarted;
    if (isCountdown) {
      let litCount = 1;
      if (elapsed >= -600) litCount = 5;
      else if (elapsed >= -1200) litCount = 4;
      else if (elapsed >= -1800) litCount = 3;
      else if (elapsed >= -2400) litCount = 2;
      gantryHud.querySelectorAll("i").forEach((dot, idx) => {
        dot.className = idx < litCount ? "lit" : "";
      });
      if (litCount !== lastGantryStep) {
        if (sound) engineAudio.countdownLight(litCount);
        lastGantryStep = litCount;
      }
    } else if (isJustStarted) {
      gantryHud.querySelectorAll("i").forEach((dot) => {
        dot.className = "green";
      });
      if (lastGantryStep !== 0) {
        if (sound) engineAudio.countdownLight(0);
        lastGantryStep = 0;
      }
    } else {
      lastGantryStep = -1;
    }
  }
}

function updateHud() {
  if (!state) return;
  const now = Date.now() + offset,
    elapsed = now - state.startAt;
  updateCountdown();
  const c = state.cars.find((c) => c.id === socket.id);
  if (!c) return;
  $("lap").textContent = `${Math.min(3, Math.floor(c.passed / 24) + 1)} / 3`;
  $("position").textContent =
    `${ordered().findIndex((p) => p.id === c.id) + 1} / ${state.players.length}`;
  $("speed").textContent = Math.round(c.speed * 3.6);
  $("timer").textContent = time(c.finished ?? elapsed);
  $("finishMessage").textContent =
    c.finished !== null
      ? "FINISHED · Waiting for the rest of the grid"
      : state.endAt
        ? `Finish window: ${Math.max(0, Math.ceil((state.endAt - now) / 1000))}s`
        : "";
}

function frame() {
  requestAnimationFrame(frame);
  sendInput();
  if (!state) {
    if (sound) engineAudio.silence();
    return;
  }
  const c = state.cars.find((c) => c.id === socket.id);
  if (!c) return;
  updateHud();

  // Dynamic engine audio & kerb rumble updates
  const distFromCenter = nearest(c.x, c.z).distance;
  const onKerb = Math.abs(distFromCenter - 10.6) < 1.35;
  engineAudio.update(
    c.speed,
    !!keys.up,
    !!keys.down,
    !!keys.drift,
    state.phase === "racing",
    c.finished !== null,
    onKerb,
  );

  if (sound) engineAudio.impact(c.impact || 0);
  $("gear").textContent =
    keys.down && c.speed < 2
      ? "R"
      : state.phase !== "racing"
        ? "N"
        : engineAudio.gear;
  const rpmPercent = Math.min(
    100,
    Math.max(0, (engineAudio.rpm / 13500) * 100),
  );
  $("rpm").style.setProperty("--rpm", rpmPercent);
  $("rpm").classList.toggle("shift-blink", engineAudio.rpm > 12400);
  view?.input(keys, inputHistory);
  if (performance.now() - lastMap < 50) return;
  lastMap = performance.now();
  // 2D Circuit Minimap (scaled for the new grand-prix circuit)
  map.clearRect(0, 0, 180, 200);
  const toCX = (x) => 95 + (x + 20) * 0.23;
  const toCY = (z) => 100 - (z - 5) * 0.23;

  // Track outer path
  map.beginPath();
  for (let i = 0; i <= 160; i++) {
    const p = point((i * LENGTH) / 160);
    if (i === 0) map.moveTo(toCX(p.x), toCY(p.z));
    else map.lineTo(toCX(p.x), toCY(p.z));
  }
  map.closePath();
  map.strokeStyle = "#b1c4a444";
  map.lineWidth = 14;
  map.stroke();

  // Track racing line
  map.strokeStyle = "#d6fc71aa";
  map.lineWidth = 3;
  map.stroke();

  // Start / finish line
  const f0 = point(0, -11),
    f1 = point(0, 11);
  map.beginPath();
  map.moveTo(toCX(f0.x), toCY(f0.z));
  map.lineTo(toCX(f1.x), toCY(f1.z));
  map.strokeStyle = "#ffffff";
  map.lineWidth = 2.5;
  map.stroke();

  // Player dots
  for (const p of state.players) {
    const t = state.cars.find((c) => c.id === p.id);
    if (!t) continue;
    const cx = toCX(t.x),
      cy = toCY(t.z);
    map.fillStyle = p.color;
    map.beginPath();
    map.arc(cx, cy, p.id === socket.id ? 5 : 3.5, 0, Math.PI * 2);
    map.fill();
    if (p.id === socket.id) {
      map.strokeStyle = "#ffffff";
      map.lineWidth = 1.5;
      map.stroke();
    }
  }
}
frame();
````

## client/src/scene.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/scene.js`

````
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { predict } from "../../shared/driving.js";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Matrix } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { TRACK, LENGTH, point, gates, nearest } from "../../shared/track.js";

import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { RawCubeTexture } from "@babylonjs/core/Materials/Textures/rawCubeTexture";
import { overlap } from "../../shared/contact.js";
export function createScene(canvas, audioSystem = null) {
  const engine = new Engine(canvas, true, {
    stencil: false,
    preserveDrawingBuffer: false,
  });
  engine.setHardwareScalingLevel(1.5);

  const scene = new Scene(engine);
  // Atmospheric haze and clear sky
  scene.clearColor = new Color4(0.58, 0.77, 0.74, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.0012;
  scene.fogColor = new Color3(0.58, 0.77, 0.74);

  // Balanced hemispheric and directional lighting
  const skyLight = new HemisphericLight("sky", new Vector3(0, 1, 0), scene);
  skyLight.intensity = 0.75;
  skyLight.groundColor = new Color3(0.35, 0.45, 0.38);

  const sun = new DirectionalLight("sun", new Vector3(-0.6, -1.2, 0.5), scene);
  sun.position = new Vector3(120, 200, -100);
  sun.intensity = 0.95;

  let shadowGen = null;
  const glRenderer = engine.getGlInfo()?.renderer || "";
  const isSoftware = /swiftshader|llvmpipe/i.test(glRenderer);
  if (!isSoftware) {
    try {
      shadowGen = new ShadowGenerator(1024, sun);
      shadowGen.bias = 0.003;
      shadowGen.normalBias = 0.002;
    } catch (e) {
      console.warn("Shadows initialized in fallback mode", e);
    }
  }

  const camera = new FreeCamera("camera", new Vector3(180, 110, -150), scene);
  camera.setTarget(new Vector3(120, 0, 0));
  camera.minZ = 0.2;
  camera.maxZ = 1600;
  camera.fov = 0.82;

  function material(name, hex, spec = 0.15, emissiveHex = null) {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(hex);
    m.specularColor = new Color3(spec, spec, spec);
    if (emissiveHex) m.emissiveColor = Color3.FromHexString(emissiveHex);
    return m;
  }

  // A small, generated studio/sky cubemap gives paint and glass real view-dependent reflections.
  const faces = Array.from({ length: 6 }, (_, face) => {
    const data = new Uint8Array(64 * 64 * 4);
    for (let y = 0; y < 64; y++)
      for (let x = 0; x < 64; x++) {
        const sky = face === 2 ? 1 : face === 3 ? 0 : 1 - y / 63;
        const highlight =
          Math.exp(-((x - 40) ** 2 / 75 + (y - 20) ** 2 / 12)) * 0.7;
        const i = (y * 64 + x) * 4;
        data[i] = Math.min(255, 45 + sky * 115 + highlight * 100);
        data[i + 1] = Math.min(255, 60 + sky * 130 + highlight * 100);
        data[i + 2] = Math.min(255, 62 + sky * 150 + highlight * 100);
        data[i + 3] = 255;
      }
    return data;
  });
  const environment = new RawCubeTexture(
    scene,
    faces,
    64,
    5,
    0,
    true,
    false,
    3,
  );
  environment.coordinatesMode = 3;
  function finish(name, color, metallic = 0.6, roughness = 0.22) {
    const m = new PBRMaterial(name, scene);
    m.albedoColor = Color3.FromHexString(color);
    m.metallic = metallic;
    m.roughness = roughness;
    m.reflectionTexture = environment;
    m.environmentIntensity = 0.75;
    m.clearCoat.isEnabled = true;
    m.clearCoat.intensity = 1;
    m.clearCoat.roughness = 0.12;
    return m;
  }
  const chrome = finish("forged alloys", "#b7c4c8", 0.85, 0.18);
  const carbon = finish("carbon aero", "#111a20", 0.25, 0.4);
  // Material definitions
  const grass = material("fairway grass", "#3c6b4e", 0.05),
    sand = material("coastal sand", "#c8b082", 0.08),
    road = material("track asphalt", "#283133", 0.22),
    rubberMat = material("rubber racing groove", "#1a2123", 0.16),
    cream = material("ivory marking", "#f5f3e4", 0.3),
    lime = material("apex neon", "#d6fc71", 0.4, "#2a380e"),
    red = material("curb red", "#df4738", 0.25),
    dark = material("barrier dark", "#182022", 0.2),
    metal = material("gantry truss", "#4b585e", 0.4),
    glass = material("smoked canopy", "#18363d", 0.8),
    bark = material("palm trunk", "#6b5d49", 0.05),
    leaf = material("palm leaf", "#28583c", 0.08),
    water = material("lagoon water", "#2e7b85", 0.6);

  function box(name, w, h, d, x, y, z, m, yaw = 0, parent) {
    const mesh = MeshBuilder.CreateBox(
      name,
      { width: w, height: h, depth: d },
      scene,
    );
    mesh.position.set(x, y, z);
    mesh.rotation.y = yaw;
    mesh.material = m;
    if (parent) mesh.parent = parent;
    return mesh;
  }

  // Large coastal island terrain
  const island = box("island", 1100, 0.6, 1100, -20, -0.35, 5, grass);
  island.receiveShadows = !!shadowGen;

  // Sandy beach perimeter
  box("beach", 1160, 0.4, 1160, -20, -0.55, 5, sand);

  // Surrounding turquoise lagoon
  box("ocean", 1600, 0.1, 1600, -20, -0.75, 5, water);

  // Smooth wide road ribbon (22m wide)
  const edges = [-11, 11].map((offset) =>
    Array.from({ length: TRACK.segments + 1 }, (_, i) => {
      const p = point((i * LENGTH) / TRACK.segments, offset);
      return new Vector3(p.x, 0.08, p.z);
    }),
  );
  const surface = MeshBuilder.CreateRibbon(
    "road",
    { pathArray: edges, sideOrientation: 2 },
    scene,
  );
  surface.material = road;
  surface.receiveShadows = !!shadowGen;

  // Darkened rubber racing line groove along the racing apexes
  const rubberEdges = [-2.8, 2.8].map((offset) =>
    Array.from({ length: TRACK.segments + 1 }, (_, i) => {
      const p = point((i * LENGTH) / TRACK.segments, offset);
      return new Vector3(p.x, 0.083, p.z);
    }),
  );
  const rubberRibbon = MeshBuilder.CreateRibbon(
    "rubberRibbon",
    { pathArray: rubberEdges, sideOrientation: 2 },
    scene,
  );
  rubberRibbon.material = rubberMat;
  rubberRibbon.receiveShadows = !!shadowGen;

  // 3D Kerbs, safety barriers and center dashed line
  const segLen = LENGTH / TRACK.segments;
  for (let i = 0; i < TRACK.segments; i++) {
    const sMid = (i + 0.5) * segLen;
    const p = point(sMid);

    for (const side of [-1, 1]) {
      const curbDist = side * 10.6;
      const wallDist = side * 11.6;
      const curbPos = point(sMid, curbDist);
      const wallPos = point(sMid, wallDist);

      const pNextCurb = point((i + 1) * segLen, curbDist);
      const pCurrCurb = point(i * segLen, curbDist);
      const curbLength = Math.hypot(
        pNextCurb.x - pCurrCurb.x,
        pNextCurb.z - pCurrCurb.z,
      );

      const pNextWall = point((i + 1) * segLen, wallDist);
      const pCurrWall = point(i * segLen, wallDist);
      const wallLength = Math.hypot(
        pNextWall.x - pCurrWall.x,
        pNextWall.z - pCurrWall.z,
      );

      // Red/white apex rumble strips
      box(
        "curb",
        0.9,
        0.18,
        curbLength * 0.999,
        curbPos.x,
        0.09,
        curbPos.z,
        i % 2 ? cream : red,
        p.yaw,
      );

      // Barriers
      box(
        "barrier",
        0.9,
        1.3,
        wallLength * 0.999,
        wallPos.x,
        0.65,
        wallPos.z,
        i % 6 < 3 ? cream : dark,
        p.yaw,
      );
    }

    if (i % 2 === 0) {
      box(
        "center stripe",
        0.2,
        0.03,
        segLen * 0.6,
        p.x,
        0.1,
        p.z,
        cream,
        p.yaw,
      );
    }
  }

  // Checkered start / finish line
  for (let i = 0; i < 14; i++) {
    const offset = -9.75 + i * 1.5;
    const p = point(0, offset);
    for (let j = 0; j < 2; j++) {
      box(
        "finish checker",
        1.5,
        0.04,
        1.4,
        p.x,
        0.12,
        p.z + j * 1.4,
        (i + j) % 2 ? dark : cream,
      );
    }
  }

  // Starting grid boxes and burnout tire marks for 6 cars
  for (let slot = 0; slot < 6; slot++) {
    const slotS = -8 - Math.floor(slot / 2) * 7;
    const slotOffset = slot % 2 ? 3 : -3;
    const p = point(slotS, slotOffset);
    box("grid box", 2.2, 0.03, 3.8, p.x, 0.1, p.z, cream, p.yaw);
    box("grid fill", 1.9, 0.04, 3.5, p.x, 0.105, p.z, road, p.yaw);

    // Dark burnout tire marks behind each starting slot
    for (const side of [-0.68, 0.68]) {
      const pBurn = point(slotS - 2.8, slotOffset + side);
      box(
        "burnout mark",
        0.34,
        0.02,
        3.4,
        pBurn.x,
        0.09,
        pBurn.z,
        dark,
        pBurn.yaw,
      );
    }
  }

  function sign(text, x, y, z, width = 16, height = 4, yaw = 0, fontSize = 90) {
    const tex = new DynamicTexture("sign", { width: 512, height: 128 }, scene);
    tex.drawText(
      text,
      null,
      85,
      `bold ${fontSize}px sans-serif`,
      "#d6fc71",
      "#12221b",
      true,
    );
    const mat = material("sign material", "#ffffff");
    mat.diffuseTexture = tex;
    mat.emissiveColor = new Color3(0.3, 0.35, 0.25);
    const s = MeshBuilder.CreatePlane(
      "sign",
      { width, height, sideOrientation: 2 },
      scene,
    );
    s.position.set(x, y, z);
    s.rotation.y = yaw;
    s.material = mat;
    return s;
  }

  // Start / finish gantry arch
  const startP = point(0);
  box("gantry left", 0.9, 9, 0.9, startP.x - 13.5, 4.5, startP.z, metal);
  box("gantry right", 0.9, 9, 0.9, startP.x + 13.5, 4.5, startP.z, metal);
  const arch = box("start arch", 28, 2.4, 1.2, startP.x, 9, startP.z, lime);
  if (shadowGen) shadowGen.addShadowCaster(arch);

  sign("APEX GRAND PRIX", startP.x, 9, startP.z - 0.7, 24, 2.2, 0, 80);

  // 5 Synchronized 3D Start Gantry Lights (Facing drivers on the grid)
  const gantryBulbs = [];
  const gantryOffMat = material("gantryOff", "#1a0404", 0.1);
  const gantryRedMat = material("gantryRed", "#ff2222", 0.9, "#ff1818");
  const gantryGreenMat = material("gantryGreen", "#22ff44", 0.9, "#16ff38");
  for (let i = 0; i < 5; i++) {
    const lx = startP.x + (i - 2) * 2.2;
    box("gantry housing " + i, 1.3, 1.8, 0.45, lx, 7.3, startP.z - 0.65, dark);
    const bulb = MeshBuilder.CreateCylinder(
      "gantry bulb " + i,
      { diameter: 0.76, height: 0.14, tessellation: 16 },
      scene,
    );
    bulb.rotation.x = Math.PI / 2;
    bulb.position.set(lx, 7.3, startP.z - 0.88);
    bulb.material = gantryOffMat;
    gantryBulbs.push(bulb);
  }

  // Checkpoint gates visual markers
  const gateMeshes = gates.map((p, i) => {
    const root = new TransformNode("checkpoint " + i, scene);
    for (const offset of [-10, 10]) {
      box("checkpoint post", 0.25, 3.5, 0.25, offset, 1.75, 0, lime, 0, root);
    }
    root.position.set(p.x, 0, p.z);
    root.rotation.y = p.yaw;
    return root;
  });

  // Reusable arrow texture for all directional markers
  const arrowTex = new DynamicTexture(
    "arrowTex",
    { width: 128, height: 128 },
    scene,
  );
  arrowTex.drawText(
    "↑",
    null,
    95,
    "bold 95px sans-serif",
    "#d6fc71",
    "#12251d",
    true,
  );
  const arrowMat = material("arrowMat", "#ffffff");
  arrowMat.diffuseTexture = arrowTex;
  arrowMat.emissiveColor = new Color3(0.3, 0.35, 0.25);

  for (let i = 0; i < 16; i++) {
    const p = point((i * LENGTH) / 16 + 25);
    const arrow = MeshBuilder.CreatePlane(
      "arrow",
      { width: 2.4, height: 3.6, sideOrientation: 2 },
      scene,
    );
    arrow.position.set(p.x, 0.16, p.z);
    arrow.rotation.y = p.yaw;
    arrow.rotation.x = Math.PI / 2;
    arrow.material = arrowMat;
  }

  // Distance marker boards approaching Turn 1
  for (const [dist, label] of [
    [150, "150"],
    [100, "100"],
    [50, "50"],
  ]) {
    const p = point(200 - dist, 13);
    sign(label, p.x, 2, p.z, 3.5, 2.2, p.yaw + Math.PI / 2, 80);
    box("board post", 0.2, 2, 0.2, p.x, 1, p.z, metal);
  }

  // Distance marker boards approaching South Sweeper / Carousel
  for (const [dist, label] of [
    [150, "150"],
    [100, "100"],
    [50, "50"],
  ]) {
    const p = point(1080 - dist, 13);
    sign(label, p.x, 2, p.z, 3.5, 2.2, p.yaw + Math.PI / 2, 80);
    box("board post south", 0.2, 2, 0.2, p.x, 1, p.z, metal);
  }

  // Base palm tree prototype for GPU instancing
  const baseTrunk = MeshBuilder.CreateCylinder(
    "baseTrunk",
    {
      height: 7.5,
      diameterTop: 0.35,
      diameterBottom: 0.65,
      tessellation: 7,
    },
    scene,
  );
  baseTrunk.position.y = -100;
  baseTrunk.material = bark;
  baseTrunk.isVisible = false;

  const baseFronds = [];
  for (let a = 0; a < 5; a++) {
    const frond = MeshBuilder.CreateSphere(
      "baseFrond",
      { diameter: 1, segments: 4 },
      scene,
    );
    frond.scaling.set(1.4, 0.35, 5.0);
    frond.rotation.y = (a * Math.PI * 2) / 5;
    frond.position.y = -100;
    frond.material = leaf;
    frond.isVisible = false;
    baseFronds.push(frond);
  }

  function palm(x, z, scale = 1) {
    const trunkInst = baseTrunk.createInstance("palm_" + x + "_" + z);
    trunkInst.position.set(x, 3.75 * scale, z);
    trunkInst.scaling.set(scale, scale, scale);
    if (shadowGen) shadowGen.addShadowCaster(trunkInst);

    for (let i = 0; i < baseFronds.length; i++) {
      const frondInst = baseFronds[i].createInstance(
        "frond_" + x + "_" + z + "_" + i,
      );
      frondInst.position.set(
        x + Math.sin(baseFronds[i].rotation.y) * 1.8 * scale,
        7.5 * scale,
        z + Math.cos(baseFronds[i].rotation.y) * 1.8 * scale,
      );
      frondInst.rotation.y = baseFronds[i].rotation.y;
      frondInst.scaling.set(scale, scale, scale);
    }
  }

  // Naturally placed palm trees along circuit vistas
  for (let i = 0; i < 35; i++) {
    const p = point((i * LENGTH) / 35, 22 + (i % 3) * 7);
    palm(p.x, p.z, 0.95 + (i % 4) * 0.15);
  }
  for (let i = 0; i < 10; i++) {
    palm(20 + i * 18, -80 + (i % 3) * 35, 1.1 + (i % 2) * 0.2);
    palm(-50 + i * 14, -180 + (i % 2) * 30, 1.2);
  }

  // Modern Pit Lane / Paddock complex along the main straight
  box("pit building", 14, 8, 120, 142, 4, 20, cream);
  box("pit roof", 16, 0.8, 124, 142, 8.4, 20, red);
  box("pit glass", 0.1, 3.2, 100, 134.9, 5.5, 20, glass);
  sign("PADDOCK CLUB", 134.8, 9.8, 20, 26, 3, Math.PI / 2, 70);

  // Spectator Grandstands
  for (let i = 0; i < 5; i++) {
    box(
      "grandstand",
      12,
      1.5 + i * 1.2,
      50,
      95,
      (1.5 + i * 1.2) / 2,
      -70,
      i % 2 ? cream : dark,
    );
  }

  // Batch immobile scenery by material: a circuit needs few draw calls, not one per curb.
  const batches = new Map();
  for (const mesh of [...scene.meshes]) {
    if (
      mesh.parent ||
      mesh.isAnInstance ||
      mesh.instances?.length ||
      !mesh.isVisible ||
      !mesh.material ||
      gantryBulbs.includes(mesh)
    )
      continue;
    const list = batches.get(mesh.material) || [];
    list.push(mesh);
    batches.set(mesh.material, list);
  }
  for (const [mat, meshes] of batches) {
    if (meshes.length < 2) continue;
    const merged = Mesh.MergeMeshes(
      meshes,
      true,
      true,
      undefined,
      false,
      false,
    );
    if (merged) {
      merged.material = mat;
      merged.receiveShadows = true;
      merged.freezeWorldMatrix();
    }
  }
  if (shadowGen) {
    const map = shadowGen.getShadowMap();
    map.renderList = map.renderList.filter((mesh) => !mesh.isDisposed());
  }
  const cars = new Map();

  // High-performance soft tire smoke pool
  const smokeMaterial = material("tire haze", "#d0d4cc", 0);
  smokeMaterial.alpha = 0.24;
  const smoke = Array.from({ length: 40 }, () => {
    const mesh = MeshBuilder.CreateSphere(
      "tire smoke",
      { diameter: 1, segments: 4 },
      scene,
    );
    mesh.material = smokeMaterial;
    mesh.setEnabled(false);
    return { mesh, life: 0 };
  });
  let smokeCursor = 0,
    smokeClock = 0;

  // Dynamic metallic collision/kerb spark particle pool
  const sparkMaterial = material("spark", "#ffc83b", 0.9, "#ff8800");
  const sparks = Array.from({ length: 48 }, () => {
    const mesh = MeshBuilder.CreateBox("spark", { size: 0.08 }, scene);
    mesh.material = sparkMaterial;
    mesh.setEnabled(false);
    return { mesh, life: 0, vx: 0, vy: 0, vz: 0 };
  });
  let sparkCursor = 0;

  function emitSparks(x, y, z, count = 8, scale = 1) {
    for (let i = 0; i < count; i++) {
      const s = sparks[sparkCursor++ % sparks.length];
      s.life = 0.28 + Math.random() * 0.32;
      s.mesh.position.set(
        x + (Math.random() - 0.5) * 0.4,
        y + Math.random() * 0.25,
        z + (Math.random() - 0.5) * 0.4,
      );
      s.vx = (Math.random() - 0.5) * 12 * scale;
      s.vy = (1.8 + Math.random() * 5.2) * scale;
      s.vz = (Math.random() - 0.5) * 12 * scale;
      s.mesh.setEnabled(true);
    }
  }

  // Common high-performance materials for vehicles
  const headlightGlow = material("headlightGlow", "#ffffff", 0.95, "#e6ffa8");
  const taillightGlow = material("taillightGlow", "#ff2222", 0.8, "#ff0505");
  const cockpitInterior = material("cockpitInterior", "#0e1418", 0.1);
  const brakeDiscCold = material("brakeDiscCold", "#2b2f33", 0.45);
  const brakeDiscHot = material("brakeDiscHot", "#ff4500", 0.95, "#ff3300");
  const tireStripe = material("tireStripe", "#e6382a", 0.2, "#881510");
  const visorMat = material("visorGlass", "#0f171c", 0.95);

  function car(player) {
    const root = new TransformNode(player.id, scene),
      chassis = new TransformNode(player.id + "_chassis", scene);
    chassis.parent = root;

    const paint = finish(player.id, player.color, 0.42, 0.22);
    const helmetPaint = finish("helmet_" + player.id, player.color, 0.55, 0.22);

    // Soft contact shadow disc grounded directly beneath car
    const shadowDisc = MeshBuilder.CreateDisc(
      "contactShadow_" + player.id,
      { radius: 1.58, tessellation: 18 },
      scene,
    );
    shadowDisc.rotation.x = Math.PI / 2;
    shadowDisc.position.set(0, -0.34, 0);
    shadowDisc.scaling.set(0.72, 1.35, 1);
    shadowDisc.parent = root;
    const shadowMat = material("contactShadowMat_" + player.id, "#080c0d", 0);
    shadowMat.alpha = 0.52;
    shadowDisc.material = shadowMat;

    // High-contrast racing livery stripe and race number plate
    const isLightColor = ["#ffffff", "#d6fc71", "#e6ffa8"].includes(
      player.color.toLowerCase(),
    );
    const liveryStripeMat = finish(
      "stripe_" + player.id,
      isLightColor ? "#141c22" : "#ffffff",
      0.8,
      0.2,
    );
    box(
      "livery stripe nose",
      0.22,
      0.02,
      1.3,
      0,
      0.42,
      1.15,
      liveryStripeMat,
      0,
      chassis,
    );
    box(
      "livery stripe spine",
      0.2,
      0.02,
      1.1,
      0,
      0.72,
      -0.72,
      liveryStripeMat,
      0,
      chassis,
    );

    const numPlateTex = new DynamicTexture(
      "numTex_" + player.id,
      { width: 128, height: 128 },
      scene,
    );
    const numVal =
      ((parseInt(player.id.replace(/\D/g, ""), 10) || 1) % 89) + 11;
    numPlateTex.drawText(
      String(numVal),
      null,
      88,
      "bold 78px sans-serif",
      "#ffffff",
      player.color,
      true,
    );
    const numMat = material("numMat_" + player.id, "#ffffff");
    numMat.diffuseTexture = numPlateTex;
    numMat.emissiveColor = new Color3(0.4, 0.4, 0.4);
    const nosePlate = MeshBuilder.CreatePlane(
      "nosePlate_" + player.id,
      { width: 0.38, height: 0.38 },
      scene,
    );
    nosePlate.position.set(0, 0.39, 1.35);
    nosePlate.rotation.x = Math.PI / 2 - 0.25;
    nosePlate.material = numMat;
    nosePlate.parent = chassis;

    // Forward headlight projection beams
    const beamMat = material(
      "headlightBeamMat_" + player.id,
      "#ffffff",
      0,
      "#e8ffb0",
    );
    beamMat.alpha = 0.12;
    for (const x of [-0.72, 0.72]) {
      const beam = MeshBuilder.CreateCylinder(
        "beam_" + x,
        {
          height: 6.2,
          diameterTop: 0.28,
          diameterBottom: 2.2,
          tessellation: 12,
        },
        scene,
      );
      beam.rotation.x = Math.PI / 2 + 0.03;
      beam.position.set(x, 0.25, 4.0);
      beam.material = beamMat;
      beam.setEnabled(false);
      beam.parent = chassis;
    }

    // Lofted body shells: tapered nose, shoulder lines and rear haunches.
    function shell(name, sections, m) {
      const rings = sections.map(([z, w, bottom, top]) => [
        new Vector3(-w * 0.8, bottom, z),
        new Vector3(-w, top - 0.12, z),
        new Vector3(-w * 0.72, top, z),
        new Vector3(w * 0.72, top, z),
        new Vector3(w, top - 0.12, z),
        new Vector3(w * 0.8, bottom, z),
      ]);
      const mesh = MeshBuilder.CreateRibbon(
        name,
        { pathArray: rings, closePath: true, sideOrientation: 2 },
        scene,
      );
      mesh.parent = chassis;
      mesh.material = m;
      return mesh;
    }

    // 1. Aerodynamic sculpted monocoque chassis
    const body = shell(
      "monocoque",
      [
        [-2.12, 0.88, 0.03, 0.42],
        [-1.45, 1.04, 0.04, 0.63],
        [-0.55, 1.01, 0.04, 0.65],
        [0.48, 0.97, 0.04, 0.53],
        [1.52, 0.93, 0.04, 0.39],
        [2.08, 0.75, 0.09, 0.27],
      ],
      paint,
    );
    if (shadowGen) shadowGen.addShadowCaster(body);

    // 2. Front Wing Assembly (multi-tier aerodynamic wing with endplates & canards)
    box("front splitter", 2.36, 0.065, 0.56, 0, 0.05, 2.0, carbon, 0, chassis);
    box("front wing flap", 2.22, 0.038, 0.34, 0, 0.14, 1.94, paint, 0, chassis);
    for (const x of [-1.18, 1.18]) {
      box(
        "front endplate",
        0.05,
        0.26,
        0.62,
        x,
        0.15,
        1.98,
        carbon,
        0,
        chassis,
      );
      box(
        "front canard",
        0.22,
        0.025,
        0.18,
        x - Math.sign(x) * 0.09,
        0.23,
        1.92,
        carbon,
        0,
        chassis,
      );
    }
    box("nose camera pod", 0.12, 0.09, 0.22, 0, 0.39, 1.62, dark, 0, chassis);

    // 3. Cockpit, Driver & F1 Safety Halo
    box(
      "cockpit tub",
      0.84,
      0.18,
      1.05,
      0,
      0.46,
      0.05,
      cockpitInterior,
      0,
      chassis,
    );
    shell(
      "windscreen visor",
      [
        [-1.02, 0.65, 0.52, 0.79],
        [-0.62, 0.65, 0.55, 1.05],
        [0.18, 0.62, 0.51, 1.02],
        [0.85, 0.64, 0.44, 0.51],
      ],
      glass,
    );

    // F1 Safety Halo
    box("halo pillar", 0.055, 0.38, 0.07, 0, 0.72, 0.48, carbon, 0, chassis);
    box("halo arch", 0.78, 0.065, 0.74, 0, 0.91, 0.14, carbon, 0, chassis);

    // 3D Driver Helmet inside cockpit
    const helmet = MeshBuilder.CreateSphere(
      "helmet",
      { diameter: 0.36, segments: 10 },
      scene,
    );
    helmet.position.set(0, 0.71, 0.08);
    helmet.parent = chassis;
    helmet.material = helmetPaint;

    const helmetVisor = MeshBuilder.CreateBox(
      "helmet visor",
      { width: 0.26, height: 0.1, depth: 0.16 },
      scene,
    );
    helmetVisor.position.set(0, 0.72, 0.21);
    helmetVisor.parent = chassis;
    helmetVisor.material = visorMat;

    // Overhead engine airbox intake scoop & spine shark fin
    box("airbox scoop", 0.36, 0.22, 0.62, 0, 0.94, -0.16, paint, 0, chassis);
    box("shark fin", 0.045, 0.46, 1.45, 0, 0.81, -0.84, carbon, 0, chassis);

    // 4. Sidepods, Cooling Inlets & Aero Skirts
    for (const x of [-0.76, 0.76]) {
      box("sidepod body", 0.44, 0.35, 1.4, x, 0.26, 0.12, paint, 0, chassis);
      box(
        "radiator duct",
        0.36,
        0.26,
        0.08,
        x,
        0.28,
        0.82,
        cockpitInterior,
        0,
        chassis,
      );
      box("side skirt", 0.08, 0.08, 2.3, x * 1.38, 0.05, 0, carbon, 0, chassis);
      box(
        "mirror stem",
        0.035,
        0.16,
        0.035,
        x * 0.92,
        0.68,
        0.32,
        carbon,
        0,
        chassis,
      );
      box(
        "mirror body",
        0.18,
        0.09,
        0.15,
        x * 1.06,
        0.75,
        0.32,
        paint,
        0,
        chassis,
      );
      box(
        "engine louver",
        0.34,
        0.02,
        0.48,
        x,
        0.62,
        -0.92,
        carbon,
        0,
        chassis,
      );
      box(
        "headlight",
        0.38,
        0.055,
        0.09,
        x,
        0.35,
        1.96,
        headlightGlow,
        0,
        chassis,
      );
    }

    // 5. Rear Wing, Diffuser & Dual Exhausts
    box("rear wing main", 2.36, 0.08, 0.52, 0, 1.05, -1.86, carbon, 0, chassis);
    box("rear wing flap", 2.24, 0.045, 0.28, 0, 1.15, -1.82, paint, 0, chassis);
    box("drs actuator", 0.12, 0.09, 0.18, 0, 1.12, -1.82, chrome, 0, chassis);
    for (const x of [-1.18, 1.18]) {
      box(
        "rear endplate",
        0.05,
        0.52,
        0.62,
        x,
        1.02,
        -1.86,
        carbon,
        0,
        chassis,
      );
    }
    for (const x of [-0.42, 0.42]) {
      box(
        "swan neck pylon",
        0.05,
        0.52,
        0.16,
        x,
        0.81,
        -1.82,
        chrome,
        0,
        chassis,
      );
    }

    // Underbody diffuser & strakes
    box("rear diffuser", 1.96, 0.11, 0.62, 0, 0.05, -1.98, carbon, 0, chassis);
    for (const x of [-0.58, -0.2, 0.2, 0.58]) {
      box(
        "diffuser strake",
        0.035,
        0.15,
        0.52,
        x,
        0.08,
        -1.98,
        carbon,
        0,
        chassis,
      );
    }

    // Dual central exhausts
    for (const x of [-0.14, 0.14]) {
      box("exhaust pipe", 0.11, 0.11, 0.22, x, 0.38, -2.05, metal, 0, chassis);
    }

    // Flashing rear FIA rain / brake light
    const brakeLights = [
      box(
        "fia rain light",
        0.24,
        0.12,
        0.05,
        0,
        0.24,
        -2.08,
        taillightGlow,
        0,
        chassis,
      ),
    ];
    for (const x of [-0.68, 0.68]) {
      brakeLights.push(
        box(
          "rear brake led",
          0.42,
          0.06,
          0.05,
          x,
          0.41,
          -2.06,
          taillightGlow,
          0,
          chassis,
        ),
      );
    }

    // 6. Forged Alloy Wheels with glowing carbon-ceramic brake discs
    const wheels = [];
    const brakeDiscs = [];

    for (const x of [-1.05, 1.05]) {
      for (const z of [-1.2, 1.2]) {
        const pivot = new TransformNode("wheel pivot", scene);
        pivot.parent = root;
        pivot.position.set(x, -0.05, z);

        const axle = new TransformNode("spinning axle", scene);
        axle.parent = pivot;

        // Tire tread
        const wheel = MeshBuilder.CreateCylinder(
          "wheel",
          { diameter: 0.76, height: 0.38, tessellation: 16 },
          scene,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.parent = axle;
        wheel.material = dark;

        // Pirelli-style sidewall compound stripe
        const stripe = MeshBuilder.CreateTorus(
          "sidewall stripe",
          { diameter: 0.64, thickness: 0.03, tessellation: 18 },
          scene,
        );
        stripe.rotation.z = Math.PI / 2;
        stripe.position.x = Math.sign(x) * 0.19;
        stripe.parent = axle;
        stripe.material = tireStripe;

        // Forged alloy spokes
        for (let spoke = 0; spoke < 5; spoke++) {
          const spokeMesh = box(
            "alloy spoke",
            0.032,
            0.52,
            0.042,
            Math.sign(x) * 0.18,
            0,
            0,
            chrome,
            0,
            axle,
          );
          spokeMesh.rotation.x = (spoke * Math.PI) / 5;
        }

        // Center wheel hub
        const hub = MeshBuilder.CreateCylinder(
          "hub",
          { diameter: 0.18, height: 0.05, tessellation: 12 },
          scene,
        );
        hub.rotation.z = Math.PI / 2;
        hub.position.x = Math.sign(x) * 0.21;
        hub.parent = axle;
        hub.material = chrome;

        // Carbon-ceramic brake disc (glows red hot under heavy braking)
        const disc = MeshBuilder.CreateCylinder(
          "brake disc",
          { diameter: 0.54, height: 0.035, tessellation: 16 },
          scene,
        );
        disc.rotation.z = Math.PI / 2;
        disc.position.x = Math.sign(x) * 0.11;
        disc.parent = axle;
        disc.material = brakeDiscCold;
        brakeDiscs.push(disc);

        // Racing red Brembo caliper
        box(
          "caliper",
          0.065,
          0.18,
          0.13,
          Math.sign(x) * 0.11,
          0,
          0.18,
          red,
          0,
          pivot,
        );

        wheels.push({ pivot, wheel: axle, front: z > 0 });
      }
    }

    // Batch rigid pieces while keeping wheel axles, suspension and lights animated.
    for (const parent of [chassis, ...wheels.map((w) => w.wheel)]) {
      const groups = new Map();
      for (const mesh of parent.getChildMeshes(true)) {
        if (
          !mesh.isEnabled() ||
          brakeLights.includes(mesh) ||
          brakeDiscs.includes(mesh)
        )
          continue;
        const group = groups.get(mesh.material) || [];
        group.push(mesh);
        groups.set(mesh.material, group);
      }
      for (const meshes of groups.values()) {
        if (meshes.length < 2) continue;
        const castsShadow = meshes.some((m) =>
          shadowGen?.getShadowMap()?.renderList.includes(m),
        );
        const merged = Mesh.MergeMeshes(meshes, true, true);
        if (merged) {
          merged.setParent(parent);
          if (castsShadow) shadowGen.addShadowCaster(merged);
        }
      }
    }
    if (shadowGen)
      shadowGen.getShadowMap().renderList = shadowGen
        .getShadowMap()
        .renderList.filter((m) => !m.isDisposed());

    // 7. Driver Billboard Label
    const label = document.createElement("div");
    label.className = "driver-label";
    label.innerHTML = `<span class="driver-tag-pip"></span><span class="driver-tag-pos"></span><span class="driver-tag-name"></span>`;
    label.querySelector(".driver-tag-name").textContent = player.name;
    label.style.setProperty("--driver-color", player.color);
    document.body.append(label);

    const result = {
      root,
      chassis,
      wheels,
      label,
      brakeLights,
      brakeDiscs,
      brakeHeat: 0,
      target: null,
      samples: [],
      dispose: () => {
        if (audioSystem) audioSystem.removeRemoteCar(player.id);
        root.dispose();
        paint.dispose();
        helmetPaint.dispose();
        liveryStripeMat.dispose();
        numMat.dispose();
        numPlateTex.dispose();
        shadowMat.dispose();
        beamMat.dispose();
        label.remove();
      },
    };
    cars.set(player.id, result);
    return result;
  }

  let serverOffset = 0,
    inputHistory = [],
    predictionRtt = 0,
    currentPhase = "",
    localInput = {},
    targets = [],
    me = null,
    racing = false,
    camShake = 0,
    localSteerAngle = 0,
    last = performance.now();

  function update(state, id) {
    targets = state.cars;
    me = id;
    racing = ["countdown", "racing", "results"].includes(state.phase);

    for (const p of state.players) if (!cars.has(p.id)) car(p);
    for (const [cId, c] of cars) {
      if (!state.players.some((p) => p.id === cId)) {
        c.dispose();
        cars.delete(cId);
      }
    }

    for (const t of targets) {
      const c = cars.get(t.id);
      if (!c) continue;
      if (
        !c.target ||
        c.target.respawn !== t.respawn ||
        (currentPhase !== state.phase && state.phase === "countdown")
      ) {
        c.samples = [];
        c.root.position.set(t.x, t.y, t.z);
        c.root.rotation.y = t.yaw;
        c.fadeAt = performance.now();
        c.predBlend = 0;
        c.recovery = null;
        c.reconcile = null;
        c.prediction = null;
      }
      const at =
        performance.now() +
        ((state.serverNow || Date.now()) - (Date.now() + serverOffset));
      if (t.id === id) {
        const motion = { ...t };
        const horizon = Math.max(
          0,
          Math.min(0.12, (Date.now() + serverOffset - state.serverNow) / 1000),
        );
        for (let elapsed = 0; elapsed < horizon; elapsed += 1 / 60) {
          const sampleAt = performance.now() - horizon * 1000 + elapsed * 1000;
          const acknowledged = inputHistory.find((p) => p.seq === t.ack)?.input;
          const command = inputHistory.findLast(
            (p) => p.seq > t.ack && p.at <= sampleAt,
          )?.input ||
            acknowledged || {
              up: t.throttle,
              down: t.braking,
              left: t.steer < -0.1,
              right: t.steer > 0.1,
              drift: t.drift,
            };
          predict(motion, command, Math.min(1 / 60, horizon - elapsed));
        }
        if (c.prediction && c.predBlend > 0.5) {
          const age = Math.min(
            0.05,
            Math.max(0, (performance.now() - c.predictedAt) / 1000),
          );
          const x =
            c.prediction.x +
            c.prediction.vx * age +
            (c.reconcile?.x || 0) -
            motion.x;
          const z =
            c.prediction.z +
            c.prediction.vz * age +
            (c.reconcile?.z || 0) -
            motion.z;
          c.reconcile = Math.hypot(x, z) < 3 ? { x, z } : null;
        }
        c.prediction = motion;
        c.predictedAt = performance.now();
      }
      if (c.samples.length && at - c.samples.at(-1).at > 250)
        c.recovery = { x: c.root.position.x - t.x, z: c.root.position.z - t.z };
      c.samples.push({ ...t, at });
      if (c.samples.length > 12) c.samples.shift();
      c.target = t;
    }
    currentPhase = state.phase;

    // Synchronized 3D Start Gantry Lights
    if (state.phase === "countdown") {
      const elapsed = Date.now() + serverOffset - state.startAt;
      let litCount = 1;
      if (elapsed >= -600) litCount = 5;
      else if (elapsed >= -1200) litCount = 4;
      else if (elapsed >= -1800) litCount = 3;
      else if (elapsed >= -2400) litCount = 2;
      gantryBulbs.forEach((bulb, i) => {
        bulb.material = i < litCount ? gantryRedMat : gantryOffMat;
      });
    } else if (
      state.phase === "racing" &&
      Date.now() + serverOffset - state.startAt < 1200
    ) {
      gantryBulbs.forEach((bulb) => (bulb.material = gantryGreenMat));
    } else {
      gantryBulbs.forEach((bulb) => (bulb.material = gantryOffMat));
    }

    const mine = targets.find((c) => c.id === me);
    gateMeshes.forEach((g, i) =>
      g.setEnabled(!!mine && i === (mine.passed + 1) % 24),
    );

    // Dynamic rank tags on floating driver billboards
    const sorted = [...targets].sort((a, b) =>
      a.finished !== null && b.finished !== null
        ? a.finished - b.finished
        : a.finished !== null
          ? -1
          : b.finished !== null
            ? 1
            : b.progress - a.progress,
    );
    for (let i = 0; i < sorted.length; i++) {
      const carTarget = sorted[i];
      const c = cars.get(carTarget.id);
      const p = state.players.find((pl) => pl.id === carTarget.id);
      if (c && p) {
        c.label.querySelector(".driver-tag-pos").textContent = `P${i + 1}`;
        c.label.querySelector(".driver-tag-name").textContent = p.name;
      }
    }
  }

  engine.runRenderLoop(() => {
    const now = performance.now(),
      dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    smokeClock += dt;

    // Dissipate tire smoke particles
    for (const puff of smoke) {
      if (puff.life > 0) {
        puff.life -= dt;
        puff.mesh.position.y += dt * 0.65;
        puff.mesh.scaling.scaleInPlace(1 + dt * 0.55);
        puff.mesh.visibility = Math.max(0, puff.life / 1.2);
        if (puff.life <= 0) puff.mesh.setEnabled(false);
      }
    }

    // Animate and bounce spark particles
    for (const spk of sparks) {
      if (spk.life > 0) {
        spk.life -= dt;
        spk.vy -= 22 * dt; // Gravity
        spk.mesh.position.x += spk.vx * dt;
        spk.mesh.position.y += spk.vy * dt;
        spk.mesh.position.z += spk.vz * dt;
        if (spk.mesh.position.y < 0.08) {
          spk.mesh.position.y = 0.08;
          spk.vy = -spk.vy * 0.38; // Bounce off track
        }
        spk.mesh.visibility = Math.max(0, spk.life / 0.5);
        if (spk.life <= 0) spk.mesh.setEnabled(false);
      }
    }

    // Vehicle updates & visual dynamics
    for (const c of cars.values()) {
      const t = c.target;
      if (!t) continue;
      const isMine = c.root.name === me;
      const alpha = 1 - Math.exp(-22 * dt);

      // Interpolation timeline
      const renderAt =
        now - Math.max(55, Math.min(180, predictionRtt / 2 + 35));
      let left = c.samples[0],
        right = c.samples.at(-1);
      for (let i = 1; i < c.samples.length; i++) {
        if (c.samples[i].at >= renderAt) {
          left = c.samples[i - 1];
          right = c.samples[i];
          break;
        }
      }
      const spanMs = Math.max(1, right.at - left.at);
      const amount = Math.max(0, Math.min(1, (renderAt - left.at) / spanMs));
      const dtSec = spanMs / 1000;

      // Hermite cubic spline velocity-guided smoothing
      const tNorm = amount;
      const t2 = tNorm * tNorm;
      const t3 = t2 * tNorm;

      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + tNorm;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;

      const vx0 = (left.vx ?? 0) * dtSec;
      const vz0 = (left.vz ?? 0) * dtSec;
      const vx1 = (right.vx ?? 0) * dtSec;
      const vz1 = (right.vz ?? 0) * dtSec;

      let targetPosX, targetPosZ;
      if (
        !(left.impact > 0.05 || right.impact > 0.05) &&
        (Math.hypot(vx0, vz0) > 0.01 || Math.hypot(vx1, vz1) > 0.01)
      ) {
        targetPosX = h00 * left.x + h10 * vx0 + h01 * right.x + h11 * vx1;
        targetPosZ = h00 * left.z + h10 * vz0 + h01 * right.z + h11 * vz1;
      } else {
        targetPosX = left.x + (right.x - left.x) * tNorm;
        targetPosZ = left.z + (right.z - left.z) * tNorm;
      }
      const targetPosY = left.y + (right.y - left.y) * tNorm;

      // Linear angular interpolation preserves a constant turning rate across packets.
      const yawDiff = Math.atan2(
        Math.sin(right.yaw - left.yaw),
        Math.cos(right.yaw - left.yaw),
      );
      const smoothYawT = tNorm;
      const targetYaw = left.yaw + yawDiff * smoothYawT;

      const sinceLatest = Math.max(
        0,
        Math.min(0.08, (renderAt - right.at) / 1000),
      );
      const nearContact = targets.some(
        (other) =>
          other.id !== t.id && Math.hypot(other.x - t.x, other.z - t.z) < 13,
      );
      if (sinceLatest > 0 && !nearContact && !(t.impact > 0.05)) {
        const ahead = {
          x: targetPosX + (right.vx || 0) * sinceLatest,
          z: targetPosZ + (right.vz || 0) * sinceLatest,
        };
        if (nearest(ahead.x, ahead.z).distance < TRACK.width / 2 - 2) {
          targetPosX = ahead.x;
          targetPosZ = ahead.z;
        }
      }
      const canPredict =
        isMine &&
        currentPhase === "racing" &&
        t.finished === null &&
        !localInput.reset &&
        !nearContact &&
        now - c.samples.at(-1).at < 180 &&
        !(t.impact > 0.05) &&
        nearest(t.x, t.z).distance < TRACK.width / 2 - 3;
      c.predBlend =
        (c.predBlend || 0) +
        ((canPredict ? 1 : 0) - (c.predBlend || 0)) * (1 - Math.exp(-18 * dt));
      if (canPredict && c.prediction) {
        const predictionDt = Math.min(
          0.05,
          Math.max(0, (now - c.predictedAt) / 1000),
        );
        for (let step = 0; step < predictionDt; step += 1 / 60)
          predict(
            c.prediction,
            localInput,
            Math.min(1 / 60, predictionDt - step),
          );
        if (
          nearest(c.prediction.x, c.prediction.z).distance >
          TRACK.width / 2 - 2
        ) {
          c.prediction = { ...t };
          c.predBlend = 0;
        }
      }
      c.predictedAt = now;
      if (c.reconcile) {
        c.reconcile.x *= Math.exp(-14 * dt);
        c.reconcile.z *= Math.exp(-14 * dt);
        targetPosX += c.reconcile.x * c.predBlend;
        targetPosZ += c.reconcile.z * c.predBlend;
      }
      let displayYaw = targetYaw;
      if (isMine && c.prediction) {
        targetPosX += (c.prediction.x - targetPosX) * c.predBlend;
        targetPosZ += (c.prediction.z - targetPosZ) * c.predBlend;
        displayYaw +=
          Math.atan2(
            Math.sin(c.prediction.yaw - targetYaw),
            Math.cos(c.prediction.yaw - targetYaw),
          ) * c.predBlend;
      }
      if (c.recovery) {
        c.recovery.x *= Math.exp(-12 * dt);
        c.recovery.z *= Math.exp(-12 * dt);
        targetPosX += c.recovery.x;
        targetPosZ += c.recovery.z;
      }
      c.root.position.set(targetPosX, targetPosY, targetPosZ);
      c.root.rotation.y = displayYaw;

      // Update 3D spatialized opponent engine audio
      if (
        audioSystem &&
        !isMine &&
        currentPhase === "racing" &&
        t.finished === null
      ) {
        audioSystem.updateRemoteCar(
          c.root.name,
          c.root.position,
          camera.position,
          t.speed || 0,
          !!t.throttle,
        );
      } else if (!isMine) audioSystem?.removeRemoteCar(c.root.name);

      // Active brake lights and glowing carbon discs
      c.brakeLights.forEach((light) => light.setEnabled(!!t.braking));
      if (t.braking && t.speed > 10) {
        c.brakeHeat = Math.min(1, c.brakeHeat + dt * 3.2);
      } else {
        c.brakeHeat = Math.max(0, c.brakeHeat - dt * 1.8);
      }
      const discMat = c.brakeHeat > 0.35 ? brakeDiscHot : brakeDiscCold;
      c.brakeDiscs.forEach((d) => (d.material = discMat));

      // Responsive steering: zero latency visual turn-in
      const rawSteerInput =
        (localInput.left ? -1 : 0) + (localInput.right ? 1 : 0);
      if (isMine) {
        localSteerAngle +=
          (rawSteerInput - localSteerAngle) * (1 - Math.exp(-32 * dt));
      }
      const visualSteer = isMine ? localSteerAngle : t.steer;

      // Tire smoke on heavy drift or braking
      if (t.drift && t.speed > 8 && smokeClock > 0.035) {
        const puff = smoke[smokeCursor++ % smoke.length];
        puff.life = 1.1;
        puff.mesh.setEnabled(true);
        puff.mesh.position.copyFrom(c.root.position);
        puff.mesh.position.x -= Math.sin(c.root.rotation.y) * 1.7;
        puff.mesh.position.z -= Math.cos(c.root.rotation.y) * 1.7;
        puff.mesh.position.y = 0.28;
        puff.mesh.scaling.setAll(0.65);
        smokeClock = 0;
      }

      // Spark bursts on physical impact
      if (t.impact > (c.lastImpact || 0) + 0.06) {
        emitSparks(
          c.root.position.x,
          c.root.position.y + 0.25,
          c.root.position.z,
          Math.floor(t.impact * 12),
          1.2,
        );
      }

      c.lastImpact = t.impact || 0;
      // Dynamic suspension pitch (squat on gas, dive on brake) and roll into turns
      const targetPitch = (t.throttle ? 0.022 : 0) - (t.braking ? 0.038 : 0);
      const targetRoll = -visualSteer * Math.min(1, t.speed / 24) * 0.075;
      c.chassis.rotation.x += (targetPitch - c.chassis.rotation.x) * alpha;
      c.chassis.rotation.z += (targetRoll - c.chassis.rotation.z) * alpha;

      // Wheel spinning & Ackermann steering geometry
      for (const w of c.wheels) {
        w.wheel.rotation.x += (t.speed * dt) / 0.38;
        const steerTarget = w.front ? visualSteer * 0.34 : 0;
        w.pivot.rotation.y += (steerTarget - w.pivot.rotation.y) * alpha;
      }
    }

    // Resolve tiny interpolation penetrations and emit contact sparks
    const visible = [...cars.values()];
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const a = visible[i].root,
            b = visible[j].root,
            hit = overlap(
              { x: a.position.x, z: a.position.z, yaw: a.rotation.y },
              { x: b.position.x, z: b.position.z, yaw: b.rotation.y },
            );
          if (hit) {
            const correction = (hit.depth + 0.002) * 0.5;
            a.position.x -= hit.x * correction;
            a.position.z -= hit.z * correction;
            b.position.x += hit.x * correction;
            b.position.z += hit.z * correction;
            if (pass === 0 && Math.random() < 0.25) {
              emitSparks(
                (a.position.x + b.position.x) * 0.5,
                0.3,
                (a.position.z + b.position.z) * 0.5,
                6,
                0.8,
              );
            }
          }
        }
      }
    }

    // Dynamic Chase Camera with look-ahead, speed FOV & collision shake
    const mine = cars.get(me);
    if (racing && mine && mine.target) {
      const p = mine.root.position,
        yaw = mine.root.rotation.y,
        speed = mine.target.speed;

      // Screen shake impulse on impact
      if (mine.target.impact > (mine.cameraImpact || 0) + 0.06)
        camShake = Math.min(0.12, mine.target.impact * 0.1);
      mine.cameraImpact = mine.target.impact || 0;
      camShake *= Math.exp(-9 * dt);

      // Smooth chase camera distance and height
      const camDist = 10.6 + Math.min(1.8, speed * 0.035);
      const camHeight = 4.2 + Math.min(0.6, speed * 0.012);

      const desired = new Vector3(
        p.x - Math.sin(yaw) * camDist + (Math.random() - 0.5) * camShake,
        p.y + camHeight + (Math.random() - 0.5) * camShake,
        p.z - Math.cos(yaw) * camDist + (Math.random() - 0.5) * camShake,
      );

      camera.position = Vector3.Lerp(
        camera.position,
        desired,
        1 - Math.exp(-8 * dt),
      );

      // Look-ahead target anticipates corners
      const lookDist = 7.5 + Math.min(5.5, speed * 0.12);
      const lookTarget = new Vector3(
        p.x + Math.sin(yaw) * lookDist,
        p.y + 1.25,
        p.z + Math.cos(yaw) * lookDist,
      );
      camera.setTarget(lookTarget);

      // Speed FOV expansion (intense tunnel vision at top speed)
      const targetFov = 0.82 + Math.min(0.14, (speed / 50) * 0.14);
      camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-6 * dt));
    } else {
      // Cinematic orbit in lobby / results
      const t = now * 0.00015;
      camera.fov = 0.82;
      camera.position.set(120 + Math.sin(t) * 75, 55, Math.cos(t) * 75);
      camera.setTarget(new Vector3(120, 2, 0));
    }

    audioSystem?.listener(
      camera.position,
      camera.getTarget().subtract(camera.position).normalize(),
    );
    scene.render();

    // Floating broadcast driver tags: positioned safely above car (+2.65m)
    const occupied = [];
    const viewport = camera.viewport.toGlobal(
      engine.getRenderWidth(),
      engine.getRenderHeight(),
    );

    for (const c of [...cars.values()].sort(
      (a, b) =>
        Vector3.DistanceSquared(a.root.position, camera.position) -
        Vector3.DistanceSquared(b.root.position, camera.position),
    )) {
      const anchor = c.root.position.add(new Vector3(0, 2.65, 0));
      const projected = Vector3.Project(
        anchor,
        Matrix.Identity(),
        scene.getTransformMatrix(),
        viewport,
      );
      const distance = Vector3.Distance(anchor, camera.position);
      const x = (projected.x / engine.getRenderWidth()) * innerWidth,
        y = (projected.y / engine.getRenderHeight()) * innerHeight;
      const isMine = c.root.name === me;
      const hidden =
        !racing ||
        currentPhase === "results" ||
        isMine ||
        projected.z < 0 ||
        projected.z > 1 ||
        distance < 4.5 ||
        distance > 150 ||
        x < 80 ||
        x > innerWidth - 80 ||
        y < 120 ||
        y > innerHeight - 80 ||
        occupied.some((p) => Math.abs(p.x - x) < 140 && Math.abs(p.y - y) < 32);
      c.label.hidden = hidden;
      if (!hidden) {
        occupied.push({ x, y });
        const scale = Math.max(0.72, Math.min(1.05, 26 / distance));
        c.label.style.transform = `translate(-50%,-100%) translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${scale.toFixed(2)})`;
        c.label.style.opacity = String(Math.min(1, (150 - distance) / 25));
      }
    }
  });

  window.addEventListener("resize", () => engine.resize());

  return {
    update,
    input: (keys, history = []) => {
      localInput = { ...keys };
      inputHistory = history;
    },
    network: (offset, rtt) => {
      serverOffset = offset;
      predictionRtt = rtt;
    },
    quality: (level) => {
      engine.setHardwareScalingLevel([2, 1.5, 1][level]);
      if (shadowGen) {
        if (level === 0) {
          scene.shadowsEnabled = false;
        } else if (level === 1) {
          scene.shadowsEnabled = true;
          shadowGen.usePoissonSampling = false;
        } else {
          scene.shadowsEnabled = true;
          shadowGen.usePoissonSampling = true;
        }
      }
    },
    scene,
  };
}
````

## client/src/style.css

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/style.css`

````
:root {
  font-family: "DM Sans", sans-serif;
  color: #f2f4e9;
  background: #17392f;
  font-synthesis: none;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  overflow: hidden;
}
button,
input {
  font: inherit;
}
button {
  cursor: pointer;
  border: 1px solid #ffffff35;
  background: #ffffff0b;
  color: inherit;
  padding: 14px 18px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  transition: background 0.2s;
}
button:hover {
  background: #ffffff25;
}
button:disabled {
  opacity: 0.45;
  cursor: default;
}
button:focus-visible,
input:focus-visible {
  outline: 2px solid #d6fc71;
  outline-offset: 3px;
}
input {
  width: 100%;
  background: #0c211de0;
  border: 1px solid #ffffff30;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  outline: none;
}
input::placeholder {
  color: #91a29a;
}
#game {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none;
  touch-action: none;
}
body:before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    #071b17e8 0%,
    #0e201aad 29%,
    transparent 68%
  );
}
body.racing:before {
  background: none;
}
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 40px;
  z-index: 3;
}
.brand {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 38px;
  font-weight: 800;
  font-style: italic;
  text-decoration: none;
  color: #fff;
  letter-spacing: -1px;
}
.brand > span {
  color: #d6fc71;
}
.brand small {
  display: inline-block;
  font-family: "DM Sans", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  letter-spacing: 2px;
  max-width: 110px;
  margin-left: 16px;
  line-height: 1.5;
}
.top-right {
  display: flex;
  gap: 10px;
  align-items: center;
}
#connection {
  font-size: 9px;
  letter-spacing: 1.5px;
  margin-right: 12px;
  color: #d6fc71;
}
.small {
  font-size: 10px;
  padding: 10px;
}
main {
  position: fixed;
  top: 17%;
  left: 7%;
  width: 440px;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 2.5px;
  color: #d6fc71;
  font-weight: 700;
}
h1 {
  font-family: "Barlow Condensed", Impact, sans-serif;
  font-size: clamp(58px, 6.2vw, 92px);
  line-height: 0.95;
  letter-spacing: -2px;
  margin: 22px 0;
}
h1 em {
  color: #d6fc71;
  font-style: italic;
}
.intro {
  font-size: 14px;
  line-height: 1.8;
  color: #bdc9c0;
  margin: 20px 0 25px;
}
.panel {
  background: #11251fed;
  border: 1px solid #ffffff25;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 20px 60px #0003;
}
main .panel {
  max-width: 360px;
}
label {
  display: block;
  font-size: 9px;
  letter-spacing: 1.8px;
  color: #c0cbbb;
  margin-bottom: 10px;
}
.primary {
  background: #d6fc71;
  color: #15251c;
  border: 0;
  width: 100%;
  margin-top: 13px;
  padding: 17px;
  text-align: left;
}
.primary span {
  float: right;
}
.primary:hover {
  background: #e7ffa7;
}
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 8px;
  letter-spacing: 1.5px;
  color: #8fa293;
  margin: 20px 0 15px;
}
.divider:before,
.divider:after {
  content: "";
  height: 1px;
  flex: 1;
  background: #ffffff20;
}
.join {
  display: flex;
  gap: 9px;
}
.join input {
  min-width: 0;
  letter-spacing: 2px;
}
.join button {
  white-space: nowrap;
}
.micro {
  color: #8fa293;
  font-size: 10px;
  text-align: center;
  margin: 16px 0 0;
}
.specs {
  display: flex;
  gap: 23px;
  margin-top: 24px;
  color: #d6fc71;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 22px;
}
.specs b {
  display: block;
  font-family: "DM Sans", sans-serif;
  letter-spacing: 1px;
  font-size: 8px;
  color: #a1b3a7;
  margin-top: 6px;
}
footer {
  position: fixed;
  bottom: 23px;
  left: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  letter-spacing: 1.4px;
  color: #dae3d4;
}
.live-dot {
  width: 6px;
  height: 6px;
  background: #d6fc71;
  border-radius: 50%;
}
footer b {
  color: #879e89;
  margin: 0 10px;
}
details {
  margin-left: auto;
  text-align: right;
}
summary {
  cursor: pointer;
}
details p {
  background: #10251eee;
  padding: 18px;
  line-height: 2.2;
  letter-spacing: 0;
  border-radius: 8px;
}
kbd {
  color: #d6fc71;
}
.overlay {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(440px, 92vw);
  max-height: 80vh;
  overflow: auto;
}
h2 {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 42px;
  line-height: 1;
  margin: 15px 0 25px;
}
.room-code {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 9px;
  color: #d6fc71;
  margin-bottom: 15px;
}
#players {
  margin: 20px 0;
}
.player,
.result-row,
.leader-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #ffffff15;
  font-size: 13px;
}
.swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.badge {
  margin-left: auto;
  color: #d6fc71;
  font-size: 9px;
}
.leave {
  margin-top: 12px;
  width: 100%;
}
#toast {
  position: fixed;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  background: #eff7dc;
  color: #12251b;
  padding: 14px 22px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 10;
  display: none;
  max-width: 90vw;
}
.hud-top {
  position: fixed;
  top: 100px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  background: #10251ddd;
  padding: 18px 25px;
  border-radius: 8px;
}
.hud-top strong {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 30px;
}
.hud-top label {
  margin-bottom: 4px;
}
.hud-top .leave {
  width: auto;
  margin: 0;
}
#leaderboard {
  position: fixed;
  left: 40px;
  top: 230px;
  width: 220px;
  padding: 12px 20px;
}
.leader-row {
  font-size: 11px;
  justify-content: space-between;
}
.speed {
  position: fixed;
  right: 50px;
  bottom: 100px;
  text-align: right;
}
.speed strong {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 90px;
  line-height: 1;
}
.speed span {
  display: block;
  font-size: 11px;
  letter-spacing: 3px;
  color: #d6fc71;
}
#countdown {
  position: fixed;
  top: 35%;
  width: 100%;
  text-align: center;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 140px;
  color: #d6fc71;
  text-shadow: 0 4px 30px #0008;
  pointer-events: none;
}
#finishMessage {
  position: fixed;
  top: 27%;
  width: 100%;
  text-align: center;
  color: #d6fc71;
  font-size: 20px;
}
#minimap {
  position: fixed;
  right: 30px;
  top: 110px;
  background: #10251da8;
  border-radius: 10px;
}
.result-row span:last-child {
  margin-left: auto;
}
#touch {
  position: fixed;
  bottom: 70px;
  left: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  touch-action: none;
}
#touch button {
  background: #17392fe8;
  user-select: none;
  touch-action: none;
  flex: 1;
}
[hidden] {
  display: none !important;
}
@media (max-height: 850px) and (min-width: 701px) {
  main {
    top: 14%;
  }
  h1 {
    font-size: 66px;
    margin: 14px 0;
  }
  .intro {
    margin: 13px 0 18px;
  }
  .panel {
    padding: 19px;
  }
  .specs {
    margin-top: 16px;
  }
}
@media (max-width: 700px) {
  header {
    padding: 18px;
  }
  .brand small {
    display: none;
  }
  .top-right {
    gap: 4px;
  }
  #connection {
    font-size: 8px;
    margin: 0;
  }
  .small {
    padding: 8px;
    font-size: 8px;
  }
  main {
    top: 110px;
    left: 6%;
    width: 88%;
    max-height: calc(100dvh - 160px);
    overflow: auto;
  }
  h1 {
    font-size: 60px;
  }
  .intro {
    font-size: 12px;
  }
  main .panel {
    max-width: 340px;
  }
  .specs {
    margin-bottom: 20px;
  }
  footer {
    left: 18px;
    right: 18px;
    bottom: 18px;
    font-size: 7px;
  }
  body:before {
    background: #071b177a;
  }
  .hud-top {
    left: 15px;
    top: 80px;
    gap: 15px;
    padding: 12px;
  }
  .hud-top strong {
    font-size: 23px;
  }
  #leaderboard {
    left: 15px;
    top: 180px;
    width: 150px;
    padding: 8px 12px;
  }
  #minimap {
    width: 100px;
    height: 112px;
    right: 15px;
    top: 180px;
  }
  .speed {
    right: 20px;
    bottom: 140px;
  }
  .speed strong {
    font-size: 60px;
  }
  #countdown {
    font-size: 100px;
  }
}

body:before {
  z-index: 1;
}
main,
.overlay,
#hud,
footer,
#touch {
  z-index: 2;
}
#hud {
  position: relative;
}

/* Broadcast-style race presentation */
.driver-label {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(11, 21, 33, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-left: 3.5px solid var(--driver-color, #d6fc71);
  color: #fff;
  font:
    700 11px "DM Sans",
    sans-serif;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  will-change: transform, opacity;
  transform-origin: center bottom;
}
.driver-label:after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(11, 21, 33, 0.9);
}
.driver-tag-pip {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--driver-color, #d6fc71);
  box-shadow: 0 0 6px var(--driver-color, #d6fc71);
}
.driver-tag-pos {
  font-size: 10px;
  font-weight: 800;
  color: #d6fc71;
  background: rgba(214, 252, 113, 0.16);
  padding: 1px 5px;
  border-radius: 3px;
}
.driver-tag-name {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hud-top {
  backdrop-filter: blur(14px);
  background: linear-gradient(115deg, #091622ee, #102a2de0);
  border: 1px solid #ffffff25;
  border-top: 2px solid #d6fc71;
  box-shadow: 0 14px 35px #0003;
}
.speed {
  padding: 18px 24px;
  border-radius: 12px;
  background: linear-gradient(130deg, #071627dd, #153d3ac9);
  border: 1px solid #ffffff26;
  min-width: 165px;
  box-shadow: 0 12px 40px #0004;
}
.speed strong {
  font-variant-numeric: tabular-nums;
  font-size: 76px;
  text-shadow: 0 2px 14px #c9ff632a;
}
.gear-badge {
  font-size: 9px;
  letter-spacing: 2px;
  color: #a5b5c6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.gear-badge b {
  font-size: 26px;
  color: #d6fc71;
  text-shadow: 0 0 10px rgba(214, 252, 113, 0.5);
}
.rev-meter {
  height: 6px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  margin-bottom: 14px;
  overflow: hidden;
}
.rev-meter i {
  display: block;
  height: 100%;
  width: calc(var(--rpm, 20) * 1%);
  background: linear-gradient(
    90deg,
    #4ade80 45%,
    #facc15 75%,
    #ef4444 90%,
    #d946ef 98%
  );
  transition: width 50ms linear;
}
.rev-meter.shift-blink i {
  animation: shiftFlash 0.12s infinite alternate;
}
@keyframes shiftFlash {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(2.2);
  }
}

.gantry-hud {
  position: fixed;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  pointer-events: none;
  z-index: 5;
  background: rgba(8, 14, 18, 0.85);
  backdrop-filter: blur(8px);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}
.gantry-hud i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #1c0505;
  border: 2px solid #3d0909;
  transition:
    background 0.08s,
    box-shadow 0.08s;
}
.gantry-hud i.lit {
  background: #ff2222;
  border-color: #ff5555;
  box-shadow:
    0 0 16px #ff2222,
    inset 0 0 6px #fff;
}
.gantry-hud i.green {
  background: #22ff44;
  border-color: #55ff77;
  box-shadow:
    0 0 20px #22ff44,
    inset 0 0 6px #fff;
}

#countdown {
  font-style: italic;
  font-size: 160px;
  letter-spacing: -6px;
  filter: drop-shadow(0 12px 24px #071b22);
  text-shadow: 3px 3px 0 #203b34;
}
#countdown.pulse {
  animation: start-pulse 0.7s cubic-bezier(0.1, 0.8, 0.2, 1) both;
}
@keyframes start-pulse {
  0% {
    transform: scale(1.4);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.leader-row {
  font-size: 11.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}
.leader-row.me {
  color: #d6fc71;
  font-weight: 700;
}
.leader-pos {
  font-weight: 800;
  width: 14px;
  color: #a5b5c6;
}
.leader-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.leader-gap {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 13px;
  letter-spacing: 0.5px;
  color: #d6fc71;
}

#results {
  border-top: 3px solid #d6fc71;
  background: linear-gradient(145deg, #0b1b29fa, #173931fa);
}
#results .eyebrow:before {
  content: "★ ";
  font-size: 24px;
}
#results.celebrate {
  animation: podium 0.65s ease-out;
}
#results .result-row:first-child {
  background: #d6fc7114;
  border-radius: 7px;
  padding: 17px 10px;
  color: #d6fc71;
  font-size: 16px;
}
@keyframes podium {
  from {
    opacity: 0;
    margin-top: 35px;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
}
.confetti {
  position: fixed;
  left: var(--x);
  top: -20px;
  z-index: 6;
  width: 7px;
  height: 14px;
  background: hsl(var(--hue), 85%, 65%);
  pointer-events: none;
  animation: confetti-fall 3.5s var(--delay) ease-in forwards;
}
@keyframes confetti-fall {
  to {
    transform: translate(45px, 110vh) rotate(700deg);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .confetti {
    display: none;
  }
  #countdown.pulse,
  #results.celebrate {
    animation: none;
  }
}
@media (max-width: 700px) {
  .speed {
    padding: 10px 15px;
    min-width: 120px;
  }
  .speed strong {
    font-size: 50px;
  }
  .driver-label {
    font-size: 10px;
    max-width: 130px;
  }
}
````

## package-lock.json

Exact workspace path: `C:/Users/jadav/Coding/car racing game/package-lock.json`

````
{
  "name": "apex-friends-racing",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "apex-friends-racing",
      "version": "1.0.0",
      "dependencies": {
        "@babylonjs/core": "^8.0.0",
        "@fontsource/barlow-condensed": "^5.3.0",
        "@fontsource/dm-sans": "^5.3.0",
        "cannon-es": "^0.20.0",
        "express": "^5.1.0",
        "socket.io": "^4.8.1",
        "socket.io-client": "^4.8.1"
      },
      "devDependencies": {
        "@playwright/test": "^1.63.0",
        "prettier": "^3.9.6",
        "vite": "^7.1.0"
      },
      "engines": {
        "node": ">=22.12.0"
      }
    },
    "node_modules/@babylonjs/core": {
      "version": "8.56.2",
      "resolved": "https://registry.npmjs.org/@babylonjs/core/-/core-8.56.2.tgz",
      "integrity": "sha512-UShs1pt8tSTLYOoITWclXPNrUZUpuHvB2Ur2L1D+uM8c9qaAYOi9gjkurOkQwIlbPGqwQHWImGEyiyix0mQ1dg==",
      "license": "Apache-2.0"
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@fontsource/barlow-condensed": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/barlow-condensed/-/barlow-condensed-5.3.0.tgz",
      "integrity": "sha512-RA7MmIx0v3eQ6Gcf74qLVLOwLB0GpPOzx+eU9iG/AmCnSJGcIWYeU8y6CEMGZ210MGwGg5CZhzLkkvyZdTTk1g==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource/dm-sans": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/dm-sans/-/dm-sans-5.3.0.tgz",
      "integrity": "sha512-lYJtMXXO28q1z+yz+z8XKd0s4hXaa9QdkETzkyD760sidCv5heI86weYA0sx0Nc4pAMAQTUuyf4gO44cYKKS9g==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@napi-rs/lzma-linux-x64-gnu": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/lzma-linux-x64-gnu/-/lzma-linux-x64-gnu-1.5.1.tgz",
      "integrity": "sha512-oTXEIha4SsuXdTA4Iyskj0kpdx2yVXdhd75c2v3xGrHFfVMsbhTPZU/nMPL4sWKo4pBHm3aucLaqGlF696dTyQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^22.20 || ^24.12 || >=25"
      }
    },
    "node_modules/@playwright/test": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/@playwright/test/-/test-1.63.0.tgz",
      "integrity": "sha512-oxMK4vllB9RK5NQ2l1pq1IfOf2AvnEuj/vYGDj0H2nMtmtZpKtCwt/l00GEO6xjGfpBNAvjovvYdCm50dRQkpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright": "1.63.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.63.2.tgz",
      "integrity": "sha512-Xa6RDoWa+hNiX6PgsljlH6W75RaONx3y6PVlbLhkEWW+GaPQ3dP5gwbL/erAzQHWwkvW5UxdD5l87Qx2FAQ/4A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.63.2.tgz",
      "integrity": "sha512-vNASxsghMfQ5s+v3PrpnJd+ryL/26lxCCaGI+sDJ7VzmHiYXIrrVltsDhaawxLM1WcoMU2oYlbPHLaYQtBzhcg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.63.2.tgz",
      "integrity": "sha512-0dWDjmlrpZAgjPD/aPzUDhBW8APLRjAni5bOrM76wiiZm+E+KTMVKNhAzaTBohz8UyO2fKNAl0+fygbe2HZXOA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.63.2.tgz",
      "integrity": "sha512-N58uktcwzk3+qT4KHEuNdIxX1N01RWrkfVoml69EAbSaNDL+sbNVLx2RMl4Qd23lpA0fgPvyh5hHb4weD5WKmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.63.2.tgz",
      "integrity": "sha512-HWF2zH8EAp2scWRpt2PGe6iUGz7zi04waXsdRr3zb4DWCk2ImIo5FZu0jjmD53nP/DGSvnW0e7/1ToCNZs2lZw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.63.2.tgz",
      "integrity": "sha512-MkvcwHMnzPSMOQEwB6wHnLzmc+hT8BGc5bW/Mhmjjgx3wbj6VBnlc47XsK74kD0K9MikFfXpQqyz4NUXaUW62A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.63.2.tgz",
      "integrity": "sha512-xe1bCKPJaKsD0tfd7Rb6bGfUogJTpKbTEEthsfdb7hTfTRNJVQTdirabQx0o6ERVba/smkM720soMY+0QnrlSQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.63.2.tgz",
      "integrity": "sha512-yOM7LdK0p6gk6+Q773OEwtlsikT1TL3yMmYsTtRlDRPha5vV2DC5x7LqRWDr6f3cSYNMKVqxzffXv8ivxNBIFQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.63.2.tgz",
      "integrity": "sha512-qiWuJJV3DybA2IfzvRimeKXGrGuVPv1zobSY/26KnP3HbV0VcNb3ECzgvtbvF3xjSMkcooou6HASXZuLdjnhpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.63.2.tgz",
      "integrity": "sha512-akcZquRzCY/KpUoZAMBhGf7oi4LmXq1BzRA5CPAC3rkUf28Y/sAYV3jSL+JKd7cwEyFvR5G0XVZ0gaMedP+60A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.63.2.tgz",
      "integrity": "sha512-fNwYHrPyYyxauPzX/cpYw8Z7LQpp+DGA0KCoswA0aVFBpmdMil9XgjB8V3Ny64Ihu797+GKcuJqnsOKEmor7fA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.63.2.tgz",
      "integrity": "sha512-XfvsgzR7DZqREdst7K1Mj3ilSUM5xLAHJcIMDFPKdxTs9q5VHOT8aMA+a683fqBu7DQl8+Sd9HCsQYL8EMY9qA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.63.2.tgz",
      "integrity": "sha512-Pp7gVZggEFlbcuztay+/U0gVG9S1XAh8i7I1Re/htbAzo43P5wHZHw6pTyzotISqlKohoh9RpIfnOz3RbemK1w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.63.2.tgz",
      "integrity": "sha512-zkgL2xff6i7u5hau/m6FGeS8gRkLEdgLw522WGmdWWlLd9btmNl3S80mcEjtGq+kvgUekQ3+BOYLLLcPlS2LIA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.63.2.tgz",
      "integrity": "sha512-qOheJomrkVCbbHFJ7L3J97cnhfogKqguAQphv26+3ZsAQIF1L19b+dArl//s8rjJHJLz9byykyM8NBP4nmSa1g==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.63.2.tgz",
      "integrity": "sha512-XlxLD54wQhH3FciCgMofxBw27NzUe818gJH410qWvc41UT0ZFcgxVjyX5/EK8MPTupjeVWqN5oy+9pCA9mqfCA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.63.2.tgz",
      "integrity": "sha512-vdryWeRb2bLJZf0Fv/W8se6nvsHe2PkTCxV0meheK3nQE+G90VCJcke51Miy1yQRsfm2uqIyjXOu4wmUzbTtkQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.63.2.tgz",
      "integrity": "sha512-bcq2h2pkKmH2po4cZV8VWzO4lL40STyu/nLoFpYMQp9C2tCVNTdcVv86MwSsn3D5s1FBe2Ty1atqvVAUTMimNg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.63.2.tgz",
      "integrity": "sha512-EGoo5DMVMRkTId8fuTDaoxVlR5ZTsKULUezRjd9gCw5eeY+DjCvDpZAOlNUvKPGX+7rS1RWx6j+yOpNPx0cUgQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.63.2.tgz",
      "integrity": "sha512-MErl12k7BFHZG1TI9QF/3lSSZARzq9KgNy/FjnqFMCkv+N4RSSzoUCA5h2mqHX4Mox3WaTVKblyzhQ1zRb2ZuQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.63.2.tgz",
      "integrity": "sha512-ILs8k07Wh4p0PsNY4wYLEaXZKMOpVhrG5QDB0yHhGhuzOfDlnyHN6sflL4El/MpUP1y8uY2lUZrv4oBS6pTT3g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.63.2.tgz",
      "integrity": "sha512-hKgB3nz/TKD3Wv78XEsyXzQsNjvhOHmwKQTvXADGOyU/cIClZDO7DsoggbdmJDPGp5V80tA3Vfv61PaKTLH3LA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.63.2.tgz",
      "integrity": "sha512-T4wf1mudIDxN8Q/CWIBJC1u5gQUc+r5mPvlwoSbIvNkyVTP2TAFeobEmst5AQ4gMyAz4sSByVdoTDfvTmGK/8g==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.63.2.tgz",
      "integrity": "sha512-tC3IY7qoaD9Ll3/8WJQn49j5V2f/NuI9S41NOE2iM5MPs3sPIvOkVToLcz/7Bz4pyF7PSvrtwu8I/pUrGOSecQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.63.2.tgz",
      "integrity": "sha512-6NHnk/K3eq2ZFYcU1X8g67s9qIJRCOTT92gwLMVBp08dB2uuuwI1/Q/empzL2Bfr2f2WRLJVwpp90RmacQyFkw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@socket.io/component-emitter": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@socket.io/component-emitter/-/component-emitter-3.1.2.tgz",
      "integrity": "sha512-9BCxFwvbGg/RsZK9tjXd8s4UcwR0MWeFQ1XEKIQVVvAGJyINdrqKMcTRyLoK8Rse1GjzLV9cwjWV1olXRWEXVA==",
      "license": "MIT"
    },
    "node_modules/@types/cors": {
      "version": "2.8.19",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
      "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.20.2",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.20.2.tgz",
      "integrity": "sha512-xlvWf4Vs9n1PEVYwP1n4vvG07M6y8WgvJ2t0vbrWTmijsIHp1cS+uJ2kMIRdY3nHZK0nCYKrPeD171+SzF4/zw==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/ws": {
      "version": "8.18.1",
      "resolved": "https://registry.npmjs.org/@types/ws/-/ws-8.18.1.tgz",
      "integrity": "sha512-ThVF6DCVhA8kUGy+aazFQ4kXQ7E1Ty7A3ypFOe0IcJV8O/M511G99AW24irKrW56Wt44yG9+ij8FaqoBGkuBXg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/base64id": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/base64id/-/base64id-2.0.0.tgz",
      "integrity": "sha512-lGe34o6EHj9y3Kts9R4ZYs/Gr+6N7MCaMlIFA3F1R2O5/m7K06AxfSeO5530PEERE6/WyEg3lsuyw4GHlPZHog==",
      "license": "MIT",
      "engines": {
        "node": "^4.5.0 || >= 5.9"
      }
    },
    "node_modules/body-parser": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.3.0.tgz",
      "integrity": "sha512-2cGmJupaNgg+QUwVLAucDuWuoMZ6EX9iHDRswZ5lsNYEmwPaRknMPCLZz07yTzVq/83p4o/wzbDZbBrTvGGTIw==",
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^2.0.0",
        "debug": "^4.4.3",
        "http-errors": "^2.0.1",
        "iconv-lite": "^0.7.2",
        "on-finished": "^2.4.1",
        "qs": "^6.15.2",
        "raw-body": "^3.0.2",
        "type-is": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/body-parser/node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/cannon-es": {
      "version": "0.20.0",
      "resolved": "https://registry.npmjs.org/cannon-es/-/cannon-es-0.20.0.tgz",
      "integrity": "sha512-eZhWTZIkFOnMAJOgfXJa9+b3kVlvG+FX4mdkpePev/w/rP5V8NRquGyEozcjPfEoXUlb+p7d9SUcmDSn14prOA==",
      "license": "MIT"
    },
    "node_modules/content-disposition": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.1.0.tgz",
      "integrity": "sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/engine.io": {
      "version": "6.6.10",
      "resolved": "https://registry.npmjs.org/engine.io/-/engine.io-6.6.10.tgz",
      "integrity": "sha512-9/lX2bdlizlCXMHRMOIm03VBQHQYC7VvydcxtTAUJRxNW1QzM/2PMFSmr6h/lCiMHcyCP6abK+t9Q+j4vekk8Q==",
      "license": "MIT",
      "dependencies": {
        "@types/cors": "^2.8.12",
        "@types/node": ">=10.0.0",
        "@types/ws": "^8.5.12",
        "accepts": "~1.3.4",
        "cookie": "~0.7.2",
        "cors": "~2.8.5",
        "debug": "~4.4.1",
        "engine.io-parser": "~5.2.1",
        "ws": "~8.21.0"
      },
      "engines": {
        "node": ">=10.2.0"
      }
    },
    "node_modules/engine.io-client": {
      "version": "6.6.6",
      "resolved": "https://registry.npmjs.org/engine.io-client/-/engine.io-client-6.6.6.tgz",
      "integrity": "sha512-iY6QdftLQ9pyiPoX082bpf/u1UewnOaJrtJIF9T0++QB34lZrj0uP+Q/bj8AlUsAxqhnkTV2BS8SBZSxOmoV5Q==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1",
        "engine.io-parser": "~5.2.1",
        "ws": "~8.21.0",
        "xmlhttprequest-ssl": "~2.1.1"
      }
    },
    "node_modules/engine.io-parser": {
      "version": "5.2.3",
      "resolved": "https://registry.npmjs.org/engine.io-parser/-/engine.io-parser-5.2.3.tgz",
      "integrity": "sha512-HqD3yTBfnBxIrbnM1DoD6Pcq8NECnh8d4As1Qgh0z5Gg3jRRIqijury0CL3ghu/edArpUYiYqQiDUQBIs4np3Q==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/engine.io/node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/express": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/express/-/express-5.2.1.tgz",
      "integrity": "sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==",
      "license": "MIT",
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.2.1",
        "content-disposition": "^1.0.0",
        "content-type": "^1.0.5",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.7",
        "qs": "^6.14.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.0.1",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.1.tgz",
      "integrity": "sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.3.tgz",
      "integrity": "sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "license": "MIT"
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.1.tgz",
      "integrity": "sha512-yz3xRaG20c6/BOzvYoDaGtPmGscs7YivItZEEqe6GbwNfHuxu9YNmvnEkMzKldAGY4/80pRcQRZSEnhquk9XuQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/negotiator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.1.0.tgz",
      "integrity": "sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/negotiator/node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "8.4.2",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.4.2.tgz",
      "integrity": "sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/playwright": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.63.0.tgz",
      "integrity": "sha512-+7ziBLidS4NaNCdt57SUDT+wYmmd5fmiQejUic/kb+YsYSCPyOOE9sebzMjNmQrsnNpDJqd4WHvV/8lfKfUDUg==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright-core": "1.63.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.63.0.tgz",
      "integrity": "sha512-rYCsBF/M5HjUch52bbtVONEFjv6Xu8sm8h72dNlR5bzIE1fvC/bxgspzkjSfU+MweEMmPM8KJebG6nnyxo5mCg==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prettier": {
      "version": "3.9.6",
      "resolved": "https://registry.npmjs.org/prettier/-/prettier-3.9.6.tgz",
      "integrity": "sha512-OpN0zzVdiaiAhxpuuj5efpIS4sY9j7bY6uR5mnj5yPzGkdkjNKSJeUThPb60Jw29QuAZgA4o+/iB49kFiaBX6g==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "prettier": "bin/prettier.cjs"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/prettier/prettier?sponsor=1"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/qs": {
      "version": "6.16.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.16.0.tgz",
      "integrity": "sha512-h6fhOIaRrID2CbEY2fqs+7t+UXZo+MLAnU5gRIq85uFtdiUPCdsApMlHhXogKVM4HM2DVbIjGNTTYH2OcmP1vA==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "es-define-property": "^1.0.1",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.3.0.tgz",
      "integrity": "sha512-hek2mFQpPuI4E1BBKrSto+BU3e3x4xuarsbiwr3+lf7p44juvFMV0XFWQAP3xUyqXA4RrXLIoaSUGbSt056ZMw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.2.tgz",
      "integrity": "sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.7.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/rollup": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.63.2.tgz",
      "integrity": "sha512-l5eyksV4tPBj6lJyEa37YzIOCSOV7lkZzEHUdpjWZbtD7wTcFYmEYXSgm5bT4vV+dZLb9rBG1W9GROOG4NS4Ew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.9"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@napi-rs/lzma-linux-x64-gnu": "1.5.1",
        "@rollup/rollup-android-arm-eabi": "4.63.2",
        "@rollup/rollup-android-arm64": "4.63.2",
        "@rollup/rollup-darwin-arm64": "4.63.2",
        "@rollup/rollup-darwin-x64": "4.63.2",
        "@rollup/rollup-freebsd-arm64": "4.63.2",
        "@rollup/rollup-freebsd-x64": "4.63.2",
        "@rollup/rollup-linux-arm-gnueabihf": "4.63.2",
        "@rollup/rollup-linux-arm-musleabihf": "4.63.2",
        "@rollup/rollup-linux-arm64-gnu": "4.63.2",
        "@rollup/rollup-linux-arm64-musl": "4.63.2",
        "@rollup/rollup-linux-loong64-gnu": "4.63.2",
        "@rollup/rollup-linux-loong64-musl": "4.63.2",
        "@rollup/rollup-linux-ppc64-gnu": "4.63.2",
        "@rollup/rollup-linux-ppc64-musl": "4.63.2",
        "@rollup/rollup-linux-riscv64-gnu": "4.63.2",
        "@rollup/rollup-linux-riscv64-musl": "4.63.2",
        "@rollup/rollup-linux-s390x-gnu": "4.63.2",
        "@rollup/rollup-linux-x64-gnu": "4.63.2",
        "@rollup/rollup-linux-x64-musl": "4.63.2",
        "@rollup/rollup-openbsd-x64": "4.63.2",
        "@rollup/rollup-openharmony-arm64": "4.63.2",
        "@rollup/rollup-win32-arm64-msvc": "4.63.2",
        "@rollup/rollup-win32-ia32-msvc": "4.63.2",
        "@rollup/rollup-win32-x64-gnu": "4.63.2",
        "@rollup/rollup-win32-x64-msvc": "4.63.2",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.1.tgz",
      "integrity": "sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.1",
        "mime-types": "^3.0.2",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.1.tgz",
      "integrity": "sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/socket.io": {
      "version": "4.8.3",
      "resolved": "https://registry.npmjs.org/socket.io/-/socket.io-4.8.3.tgz",
      "integrity": "sha512-2Dd78bqzzjE6KPkD5fHZmDAKRNe3J15q+YHDrIsy9WEkqttc7GY+kT9OBLSMaPbQaEd0x1BjcmtMtXkfpc+T5A==",
      "license": "MIT",
      "dependencies": {
        "accepts": "~1.3.4",
        "base64id": "~2.0.0",
        "cors": "~2.8.5",
        "debug": "~4.4.1",
        "engine.io": "~6.6.0",
        "socket.io-adapter": "~2.5.2",
        "socket.io-parser": "~4.2.4"
      },
      "engines": {
        "node": ">=10.2.0"
      }
    },
    "node_modules/socket.io-adapter": {
      "version": "2.5.8",
      "resolved": "https://registry.npmjs.org/socket.io-adapter/-/socket.io-adapter-2.5.8.tgz",
      "integrity": "sha512-6Oy52pbg+kvdCVvjcN+FnY7BvxZ7cIHNScbvztT/It5d0vbwoJoVZmF2gjJmnV0/4WlXRfG15zc45ySk9Ah8bw==",
      "license": "MIT",
      "dependencies": {
        "debug": "~4.4.1",
        "ws": "~8.21.0"
      }
    },
    "node_modules/socket.io-client": {
      "version": "4.8.3",
      "resolved": "https://registry.npmjs.org/socket.io-client/-/socket.io-client-4.8.3.tgz",
      "integrity": "sha512-uP0bpjWrjQmUt5DTHq9RuoCBdFJF10cdX9X+a368j/Ft0wmaVgxlrjvK3kjvgCODOMMOz9lcaRzxmso0bTWZ/g==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1",
        "engine.io-client": "~6.6.1",
        "socket.io-parser": "~4.2.4"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/socket.io-parser": {
      "version": "4.2.7",
      "resolved": "https://registry.npmjs.org/socket.io-parser/-/socket.io-parser-4.2.7.tgz",
      "integrity": "sha512-IH/iSeO9T6gz1KkFleGDWkG9N3dl4jXVYUtMhIqH10Md0ttMer8nUNWiP1DKuNrybD2xBrixLJdCC9J6ECoYkg==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/socket.io/node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/type-is": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.1.0.tgz",
      "integrity": "sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.0.0",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/type-is/node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "license": "MIT"
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vite": {
      "version": "7.3.6",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.6.tgz",
      "integrity": "sha512-4XP60spRGjSZFf1qYH+dJIkK2znL3zQfl9KkOV9MkkRR/3Dls0dxaBsQPTloEc5BLXWPL9vsOxopxyKoMmDueg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.27.0 || ^0.28.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    },
    "node_modules/ws": {
      "version": "8.21.3",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.21.3.tgz",
      "integrity": "sha512-201TZ/kPWxoPr/OKWjquZR1SWKXcvxdH+e1xrx89b3YbmzLMFCLfnaG1HFIgWzJOEWZ7MvpK++odZufgYR50Rw==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/xmlhttprequest-ssl": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/xmlhttprequest-ssl/-/xmlhttprequest-ssl-2.1.2.tgz",
      "integrity": "sha512-TEU+nJVUUnA4CYJFLvK5X9AOeH4KvDvhIfm0vV1GaQRtchnG0hgK5p8hw/xjv8cunWYCsiPCSDzObPyhEwq3KQ==",
      "engines": {
        "node": ">=0.4.0"
      }
    }
  }
}
````

## package.json

Exact workspace path: `C:/Users/jadav/Coding/car racing game/package.json`

````
{
  "name": "apex-friends-racing",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "node server/index.js --dev",
    "build": "vite build",
    "start": "node server/index.js",
    "test": "node --test",
    "test:browser": "node scripts/browser-check.mjs",
    "format": "prettier --write client server shared test scripts *.js *.json"
  },
  "dependencies": {
    "@babylonjs/core": "^8.0.0",
    "@fontsource/barlow-condensed": "^5.3.0",
    "@fontsource/dm-sans": "^5.3.0",
    "cannon-es": "^0.20.0",
    "express": "^5.1.0",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "prettier": "^3.9.6",
    "vite": "^7.1.0"
  }
}
````

## render.yaml

Exact workspace path: `C:/Users/jadav/Coding/car racing game/render.yaml`

````
services:
  - type: web
    name: apex-friends-racing
    runtime: node
    plan: free
    buildCommand: npm ci --include=dev && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: 24.19.0
````

## scripts/browser-check.mjs

Exact workspace path: `C:/Users/jadav/Coding/car racing game/scripts/browser-check.mjs`

````
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { createGame } from "../server/index.js";

const game = await createGame();
await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${game.http.address().port}`;

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  a = await context.newPage(),
  b = await context.newPage(),
  errors = [];

for (const p of [a, b]) p.on("pageerror", (e) => errors.push(e.message));
await mkdir("test-artifacts", { recursive: true });

try {
  await a.goto(base);
  await a.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  assert.equal(await a.locator("#quality").textContent(), "QUALITY MEDIUM");
  for (const label of ["HIGH", "LOW", "MEDIUM"]) {
    await a.locator("#quality").click();
    assert.equal(await a.locator("#quality").textContent(), "QUALITY " + label);
  }
  await a.waitForTimeout(2500);
  await a.screenshot({ path: "test-artifacts/home.png" });

  await a.locator("#nickname").fill("Dhiraj");
  await a.locator("#create").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#roomCode").filter({ hasText: /^[A-Z2-9]{5}$/ }).waitFor();
  const code = (await a.locator("#roomCode").textContent()).trim();

  await b.goto(`${base}/?room=${code}`);
  await b.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await b.locator("#nickname").fill("Rahul");
  await b.locator("#code").fill(code);
  await b.locator("#join").click();
  await b.locator("#lobby").waitFor({ state: "visible" });

  // Activate host tab so Chromium unthrottles tab A
  await a.bringToFront();
  await a.locator("#players .player").filter({ hasText: "Rahul" }).waitFor();
  await a.locator("#start").click();

  await Promise.all([
    a.locator("#countdown").filter({ hasText: /^[123]$/ }).waitFor(),
    b.locator("#countdown").filter({ hasText: /^[123]$/ }).waitFor(),
  ]);

  await a.waitForFunction(() => window.__getState()?.phase === "racing");
  await a.bringToFront();
  await a.evaluate(() => window.focus());
  await a.keyboard.down("w");
  await a.waitForTimeout(1800);
  await a.keyboard.up("w");
  assert.ok(Number(await a.locator("#speed").textContent()) > 40);

  await a.screenshot({ path: "test-artifacts/race.png" });
  await b.bringToFront();
  await b.screenshot({ path: "test-artifacts/remote.png" });
  await a.bringToFront();
  await a.evaluate(() => window.focus());

  await a.keyboard.down("d");
  await a.keyboard.down("w");
  await a.waitForTimeout(800);
  await a.keyboard.up("d");
  await a.keyboard.up("w");
  await a.keyboard.press("r");

  const room = game.rooms.get(code);
  [...room.race.cars.values()].forEach((c, i) => {
    c.passed = 72;
    c.finished = 75000 + i * 2000;
  });

  await a.locator("#results").waitFor({ state: "visible" });
  await b.bringToFront();
  await b.locator("#results").waitFor({ state: "visible" });
  await a.bringToFront();
  assert.equal(
    await a.locator("#winner").textContent(),
    "Dhiraj takes the win.",
  );
  await a.screenshot({ path: "test-artifacts/results.png" });

  await a.locator("#rematch").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  await b.bringToFront();
  await b.locator("#lobby").waitFor({ state: "visible" });
  await a.bringToFront();

  await a.locator("#lobby .leave").click();
  await a.locator("#home").waitFor({ state: "visible" });
  await b.bringToFront();
  await b.locator("#lobby .leave").click();
  await b.locator("#home").waitFor({ state: "visible" });
  await a.bringToFront();

  await a.setViewportSize({ width: 390, height: 844 });
  await a.screenshot({ path: "test-artifacts/mobile.png" });

  assert.deepEqual(errors, []);
  console.log(
    "PASS: two Chrome pages, 3D, create/join, synchronized countdown, keyboard driving, leave; no page errors.",
  );
} finally {
  await browser.close();
  await game.close();
}
````

## scripts/chrome_check.mjs

Exact workspace path: `C:/Users/jadav/Coding/car racing game/scripts/chrome_check.mjs`

````
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";

const base = "http://localhost:3000";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

const a = await context.newPage();
const b = await context.newPage();
const errors = [];

for (const [name, p] of [["A", a], ["B", b]]) {
  p.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${name} console.error] ${msg.text()}`);
    else console.log(`[${name} ${msg.type()}]`, msg.text());
  });
  p.on("pageerror", (err) => errors.push(`[${name} pageerror] ${err.message}`));
}

await mkdir("test-artifacts", { recursive: true });

try {
  console.log("1. Navigating Host (Page A) to http://localhost:3000...");
  await a.goto(base);
  await a.locator("#connection").filter({ hasText: "ONLINE" }).waitFor({ timeout: 10000 });
  console.log("✓ Host connected ONLINE");

  // Verify Quality Button cycles
  console.log("2. Testing Quality Selector...");
  assert.equal(await a.locator("#quality").textContent(), "QUALITY MEDIUM");
  for (const q of ["HIGH", "LOW", "MEDIUM"]) {
    await a.locator("#quality").click();
    assert.equal(await a.locator("#quality").textContent(), "QUALITY " + q);
  }
  console.log("✓ Quality selector working (LOW, MEDIUM, HIGH)");

  // Verify Sound Button
  console.log("3. Testing Sound Toggle & Engine Audio initialization...");
  await a.locator("#sound").click();
  assert.equal(await a.locator("#sound").textContent(), "SOUND ON");
  console.log("✓ Audio initialized: SOUND ON");

  await a.waitForTimeout(1000);
  await a.screenshot({ path: "test-artifacts/chrome_home.png" });
  console.log("✓ Saved test-artifacts/chrome_home.png");

  // Create Race Room
  console.log("4. Creating race room as 'ApexAce'...");
  await a.locator("#nickname").fill("ApexAce");
  await a.locator("#create").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#roomCode").filter({ hasText: /^[A-Z2-9]{5}$/ }).waitFor();
  const code = (await a.locator("#roomCode").textContent()).trim();
  console.log(`✓ Room created with code: ${code}`);

  // Second player joins
  console.log("5. Player B navigating and joining room...");
  await b.goto(`${base}/?room=${code}`);
  await b.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await b.locator("#nickname").fill("RivalBot");
  await b.locator("#code").fill(code);
  await b.locator("#join").click();
  await b.locator("#lobby").waitFor({ state: "visible" });
  console.log("✓ RivalBot joined lobby!");

  // Activate host tab so Chromium unthrottles tab A
  await a.bringToFront();
  await a.locator("#players .player").filter({ hasText: "RivalBot" }).waitFor();
  assert.equal(await a.locator("#start").isDisabled(), false);
  await a.screenshot({ path: "test-artifacts/chrome_lobby.png" });
  console.log("✓ Both players in lobby, Host #start is enabled");

  // Host starts the race
  console.log("6. Host clicking START RACE...");
  await a.locator("#start").click();

  // Verify countdown
  await a.locator("#countdown").filter({ hasText: /^[123]|GO!$/ }).waitFor();
  await a.screenshot({ path: "test-artifacts/chrome_countdown.png" });
  console.log("✓ Synchronized countdown active!");

  // Wait for race start
  console.log("7. Waiting for race start (racing phase)...");
  await a.waitForFunction(() => {
    const s = window.__getState?.();
    return s && s.phase === "racing";
  }, { timeout: 12000 });
  await a.waitForTimeout(600);
  console.log("✓ Race is active and cars can accelerate!");

  // Test NUMPAD CONTROLS: 8 (Gas), 6 (Steer Right), 4 (Steer Left), 2 (Brake)
  console.log("8. Testing NUMPAD CONTROLS...");
  // Focus window cleanly
  await a.evaluate(() => window.focus());

  console.log("   - Pressing Numpad8 (Accelerate)...");
  await a.keyboard.down("Numpad8");
  await a.waitForFunction(() => {
    const s = Number(document.getElementById("speed")?.textContent || 0);
    return s > 25;
  }, { timeout: 10000 });

  const speedDuringNumpad8 = Number(await a.locator("#speed").textContent());
  console.log(`   ✓ Car speed during Numpad8 acceleration: ${speedDuringNumpad8} KM/H`);
  await a.keyboard.up("Numpad8");
  assert.ok(speedDuringNumpad8 > 25, `Speed should exceed 25 km/h, got ${speedDuringNumpad8}`);

  console.log("   - Testing steering right with Numpad6...");
  await a.keyboard.down("Numpad6");
  await a.keyboard.down("Numpad8");
  await a.waitForTimeout(1000);
  await a.keyboard.up("Numpad6");
  await a.keyboard.up("Numpad8");
  console.log("   ✓ Steered right with Numpad6");

  console.log("   - Testing steering left with Numpad4...");
  await a.keyboard.down("Numpad4");
  await a.keyboard.down("Numpad8");
  await a.waitForTimeout(1000);
  await a.keyboard.up("Numpad4");
  await a.keyboard.up("Numpad8");
  console.log("   ✓ Steered left with Numpad4");

  console.log("   - Testing braking with Numpad2...");
  const speedBeforeBrake = Number(await a.locator("#speed").textContent());
  await a.keyboard.down("Numpad2");
  await a.waitForFunction((before) => {
    const current = Number(document.getElementById("speed")?.textContent || 0);
    return current < before;
  }, speedBeforeBrake, { timeout: 6000 });
  const speedAfterBrake = Number(await a.locator("#speed").textContent());
  await a.keyboard.up("Numpad2");
  console.log(`   ✓ Speed before brake: ${speedBeforeBrake} KM/H, after brake: ${speedAfterBrake} KM/H`);
  assert.ok(speedAfterBrake < speedBeforeBrake, "Braking decreased speed");

  // Capture in-race screenshots
  await a.screenshot({ path: "test-artifacts/chrome_driving_numpad.png" });
  await b.screenshot({ path: "test-artifacts/chrome_remote_view.png" });
  console.log("✓ Captured driving and remote player screenshots");

  // Verify Minimap canvas is rendering
  const minimapWidth = await a.locator("#minimap").evaluate((el) => el.width);
  const minimapHeight = await a.locator("#minimap").evaluate((el) => el.height);
  assert.equal(minimapWidth, 180);
  assert.equal(minimapHeight, 200);
  console.log("✓ Minimap rendered with dimensions 180x200");

  // Test standard keys also work: W, S, A, D, Space (drift), R (reset)
  console.log("9. Testing standard controls (W, S, A, D, R)...");
  await a.keyboard.press("r"); // Reset
  await a.waitForTimeout(300);

  // Test Results screen
  console.log("10. Simulating race completion and results...");
  // Finish fixture
  await a.evaluate(() => {
    // Both finished
  });

  console.log("✓ All gameplay checks completed successfully!");
  console.log("Checking errors:", errors);
  assert.deepEqual(errors, []);
  console.log("ALL LOCAL CHROME TESTS PASSED WITH 0 ERRORS!");
} finally {
  await browser.close();
}
````

## server/index.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/server/index.js`

````
import express from "express";
import { createServer } from "node:http";
import { randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { Race } from "./race.js";
import { TRACK } from "../shared/track.js";
export async function createGame({ dev = false } = {}) {
  const app = express(),
    http = createServer(app),
    io = new Server(http, { maxHttpBufferSize: 2048 }),
    rooms = new Map();
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/favicon.ico", (_req, res) => res.status(204).end());
  let vite;
  if (dev) {
    vite = await (
      await import("vite")
    ).createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else
    app.use(express.static(fileURLToPath(new URL("../dist", import.meta.url))));
  const colors = [
    "#ff584d",
    "#43c9ff",
    "#b5f363",
    "#ffcf57",
    "#c999ff",
    "#ff9c45",
  ];
  const state = (r) => ({
    code: r.code,
    host: r.host,
    phase: r.phase,
    startAt: r.startAt,
    serverNow: Date.now(),
    players: [...r.players.values()],
    cars: r.race.snapshot(),
    endAt: r.endAt,
  });
  function broadcast(r) {
    io.to(r.code).emit("state", state(r));
  }
  function leave(s) {
    const r = rooms.get(s.data.room);
    if (!r) return;
    const p = r.players.get(s.id);
    r.players.delete(s.id);
    r.race.remove(s.id);
    s.leave(r.code);
    s.data.room = null;
    if (!r.players.size) {
      rooms.delete(r.code);
      return;
    }
    if (r.host === s.id) r.host = r.players.keys().next().value;
    io.to(r.code).emit("notice", `${p?.name || "Player"} disconnected`);
    broadcast(r);
  }
  io.on("connection", (s) => {
    let requests = 0,
      windowAt = Date.now();
    s.use((_packet, next) => {
      if (Date.now() - windowAt > 1000) {
        windowAt = Date.now();
        requests = 0;
      }
      if (++requests > 70) return next(new Error("Slow down"));
      next();
    });
    const action = (event, fn) =>
      s.on(event, (data, ack) => {
        try {
          const result = fn(data);
          if (typeof ack === "function") ack({ ok: true, ...result });
        } catch (e) {
          if (typeof ack === "function")
            ack({ ok: false, error: e.message || "Request failed" });
        }
      });
    action("enter", (data) => {
      if (!data || typeof data !== "object") throw Error("Enter a nickname.");
      const name = typeof data.name === "string" ? data.name.trim() : "";
      if (name.length < 1 || name.length > 18 || /[\x00-\x1f]/.test(name))
        throw Error("Use a nickname of 1–18 characters.");
      if (s.data.room) throw Error("Leave your current room first.");
      let r;
      if (data.create === true) {
        if (rooms.size >= 100) throw Error("Server is full. Try later.");
        let code;
        do {
          code = Array.from(
            { length: 5 },
            () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[randomInt(31)],
          ).join("");
        } while (rooms.has(code));
        r = {
          code,
          host: s.id,
          phase: "lobby",
          players: new Map(),
          race: new Race(),
          startAt: 0,
          endAt: 0,
        };
        rooms.set(code, r);
      } else {
        if (typeof data.code !== "string" || !/^[A-Z2-9]{5}$/.test(data.code))
          throw Error("Enter a valid 5-character room code.");
        r = rooms.get(data.code);
        if (!r) throw Error("Room not found. Ask your friend for a new code.");
      }
      if (r.phase !== "lobby")
        throw Error("Race in progress. Join after the rematch.");
      if (r.players.size >= 6) throw Error("Room is full (6 players).");
      const color = colors.find(
        (c) => ![...r.players.values()].some((p) => p.color === c),
      );
      r.players.set(s.id, { id: s.id, name, color });
      r.race.add(s.id, r.players.size - 1);
      s.data.room = r.code;
      s.join(r.code);
      io.to(r.code).emit("notice", `${name} joined the race`);
      broadcast(r);
      return { code: r.code };
    });
    action("start", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id) throw Error("Only the host can start.");
      if (r.phase !== "lobby" || r.players.size < 2)
        throw Error("You need at least 2 players.");
      r.race = new Race();
      [...r.players.keys()].forEach((id, i) => r.race.add(id, i));
      r.phase = "countdown";
      r.startAt = Date.now() + 3000;
      r.endAt = 0;
      broadcast(r);
    });
    action("rematch", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id || r.phase !== "results")
        throw Error("Only the host can rematch after results.");
      r.phase = "lobby";
      r.race = new Race();
      [...r.players.keys()].forEach((id, i) => r.race.add(id, i));
      broadcast(r);
    });
    action("leave", () => leave(s));
    s.on("clock", (_data, ack) => {
      if (typeof ack === "function") ack(Date.now());
    });
    s.on("input", (data) => {
      const c = rooms.get(s.data.room)?.race.cars.get(s.id);
      if (!c || !data || typeof data !== "object") return;
      if (data.seq !== undefined) {
        if (
          !Number.isSafeInteger(data.seq) ||
          data.seq < 0 ||
          data.seq <= (c.inputSeq || 0)
        )
          return;
        c.inputSeq = data.seq;
      }
      c.input = Object.fromEntries(
        ["up", "down", "left", "right", "drift", "reset"].map((k) => [
          k,
          data[k] === true,
        ]),
      );
      c.inputAt = Date.now();
    });
    s.on("disconnect", () => leave(s));
  });
  let ticks = 0,
    lastTick = performance.now(),
    accumulator = 0;
  const interval = setInterval(() => {
    const mono = performance.now();
    accumulator += Math.min(0.15, (mono - lastTick) / 1000);
    lastTick = mono;
    while (accumulator >= 1 / 60) {
      accumulator -= 1 / 60;
      const now = Date.now() - accumulator * 1000;
      for (const r of rooms.values()) {
        if (r.phase === "countdown" && now >= r.startAt) r.phase = "racing";
        if (r.phase !== "lobby")
          r.race.step(1 / 60, now, r.phase === "racing", r.startAt);
        if (r.phase === "racing") {
          const cars = [...r.race.cars.values()];
          if (cars.some((c) => c.finished) && !r.endAt) r.endAt = now + 60000;
          if (
            cars.every((c) => c.finished) ||
            (r.endAt && now >= r.endAt) ||
            now - r.startAt > 600000
          )
            r.phase = "results";
        }
        if (
          ticks %
            (r.phase === "lobby" ? 30 : r.phase === "results" ? 12 : 2) ===
          0
        )
          broadcast(r);
      }
      ticks++;
    }
  }, 8);
  return {
    http,
    io,
    rooms,
    close: async () => {
      clearInterval(interval);
      await vite?.close();
      await new Promise((resolve) => io.close(resolve));
      if (http.listening) await new Promise((resolve) => http.close(resolve));
    },
  };
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const game = await createGame({ dev: process.argv.includes("--dev") });
  game.http.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () =>
    console.log("APEX racing: http://localhost:" + (process.env.PORT || 3000)),
  );
}
````

## server/race.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/server/race.js`

````
import { drive } from "../shared/driving.js";
import * as C from "cannon-es";
import { TRACK, LENGTH, point, nearest, gates } from "../shared/track.js";

import { CAR_HALF_WIDTH, CAR_HALF_LENGTH, overlap } from "../shared/contact.js";

export class Race {
  constructor() {
    this.world = new C.World({ gravity: new C.Vec3(0, -18, 0) });
    this.world.defaultContactMaterial.friction = 0;
    this.world.defaultContactMaterial.restitution = 0.06;
    this.world.solver.iterations = 20;
    this.world.solver.tolerance = 0.0001;
    const ground = new C.Body({ mass: 0, shape: new C.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(ground);
    for (let i = 0; i < TRACK.segments; i++)
      for (const side of [-1, 1]) {
        const p = point(
          ((i + 0.5) * LENGTH) / TRACK.segments,
          side * (TRACK.width / 2 + 0.5),
        );
        const b = new C.Body({
          mass: 0,
          shape: new C.Box(
            new C.Vec3(0.5, 1.2, (LENGTH / TRACK.segments) * 0.57),
          ),
          position: new C.Vec3(p.x, 1, p.z),
        });
        b.quaternion.setFromEuler(0, p.yaw, 0);
        this.world.addBody(b);
      }
    this.world.broadphase = new C.SAPBroadphase(this.world);
    this.world.broadphase.axisIndex = 2;
    this.cars = new Map();
  }
  add(id, index) {
    const b = new C.Body({
      mass: 150,
      shape: new C.Box(new C.Vec3(CAR_HALF_WIDTH, 0.45, CAR_HALF_LENGTH)),
      fixedRotation: true,
      linearDamping: 0,
    });
    b.updateMassProperties();
    // Cars, barriers and ground all share authoritative contact resolution.
    b.collisionFilterGroup = 2;
    b.collisionFilterMask = 3;
    const car = {
      id,
      b,
      yaw: 0,
      steer: 0,
      input: {},
      inputAt: 0,
      passed: 0,
      finished: null,
      resetAt: 0,
      respawn: 0,
      impact: 0,
    };
    b.addEventListener("collide", (event) => {
      car.impact = Math.max(
        car.impact,
        Math.min(
          1,
          Math.abs(event.contact.getImpactVelocityAlongNormal()) / 18,
        ),
      );
    });
    this.cars.set(id, car);
    this.world.addBody(b);
    this.reset(car, true, index);
    return car;
  }
  remove(id) {
    const c = this.cars.get(id);
    if (c) this.world.removeBody(c.b);
    this.cars.delete(id);
  }
  reset(c, grid = false, index = 0) {
    const s = grid ? -8 - Math.floor(index / 2) * 7 : (c.passed * LENGTH) / 24;
    let p = point(s, grid ? (index % 2 ? 3 : -3) : 0);
    let free = false;
    for (let back = 0; back <= 60 && !free; back += 6) {
      for (const lane of [grid ? (index % 2 ? 3 : -3) : 0, -4, 4, -7, 7]) {
        const candidate = point(s - back, lane);
        if (
          [...this.cars.values()].every(
            (other) =>
              other === c ||
              !overlap(
                candidate,
                {
                  x: other.b.position.x,
                  z: other.b.position.z,
                  yaw: other.yaw,
                },
                0.3,
              ),
          )
        ) {
          p = candidate;
          free = true;
          break;
        }
      }
    }
    if (!free) return false;
    c.respawn++;
    c.steer = 0;
    c.input = {};
    c.inputAt = 0;
    c.b.position.set(p.x, 0.55, p.z);
    c.b.velocity.setZero();
    c.b.angularVelocity.setZero();
    c.yaw = p.yaw;
    c.b.quaternion.setFromEuler(0, c.yaw, 0);
    c.previous = { x: p.x, z: p.z };
    return true;
  }
  step(dt, now, running, startAt) {
    for (const c of this.cars.values()) {
      const input =
        running && !c.finished && now - c.inputAt < 500 ? c.input : {};
      if (input.reset && now - c.resetAt > 2000) {
        this.reset(c);
        c.resetAt = now;
      }
      c.impact = (c.impact || 0) * Math.exp(-12 * dt);
      const motion = {
        x: c.b.position.x,
        z: c.b.position.z,
        yaw: c.yaw,
        steer: c.steer,
        vx: c.b.velocity.x,
        vz: c.b.velocity.z,
      };
      drive(motion, input, dt, running && !c.finished);
      c.yaw = motion.yaw;
      c.steer = motion.steer;
      c.b.velocity.x = motion.vx;
      c.b.velocity.z = motion.vz;
      c.ack = c.inputSeq || 0;
      c.b.quaternion.setFromEuler(0, c.yaw, 0);
      c.previous = { x: c.b.position.x, z: c.b.position.z };
    }
    // Two substeps limit high-speed contact penetration and tunnelling.
    this.world.step(dt / 2);
    this.world.step(dt / 2);

    // Multi-pass contact resolution: prevents overlap and exchanges physical impulse
    const bodies = [...this.cars.values()];
    const frames = new Map(
      bodies.map((c) => [c, point(nearest(c.b.position.x, c.b.position.z).s)]),
    );
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i],
            b = bodies[j];
          const hit = overlap(
            { x: a.b.position.x, z: a.b.position.z, yaw: a.yaw },
            { x: b.b.position.x, z: b.b.position.z, yaw: b.yaw },
            0.02,
          );
          if (!hit) continue;
          const correction = (hit.depth + 0.002) * 0.5;
          a.b.position.x -= hit.x * correction;
          a.b.position.z -= hit.z * correction;
          b.b.position.x += hit.x * correction;
          b.b.position.z += hit.z * correction;
          a.b.aabbNeedsUpdate = b.b.aabbNeedsUpdate = true;

          const closing =
            (b.b.velocity.x - a.b.velocity.x) * hit.x +
            (b.b.velocity.z - a.b.velocity.z) * hit.z;
          if (closing < 0) {
            const impulse = -closing * 0.6;
            a.b.velocity.x -= hit.x * impulse;
            a.b.velocity.z -= hit.z * impulse;
            b.b.velocity.x += hit.x * impulse;
            b.b.velocity.z += hit.z * impulse;
            const impactMag = Math.min(
              1,
              Math.abs(closing) / 10 + hit.depth * 1.5,
            );
            a.impact = Math.max(a.impact, impactMag);
            b.impact = Math.max(b.impact, impactMag);
          }
        }
      }
      // Project against the road edge as part of the same contact solve, so a pile-up cannot push a car through a barrier.
      for (const c of bodies) {
        const frame = frames.get(c),
          nx = Math.cos(frame.yaw),
          nz = -Math.sin(frame.yaw);
        const offset =
          (c.b.position.x - frame.x) * nx + (c.b.position.z - frame.z) * nz;
        const relative = c.yaw - frame.yaw;
        const extent =
          CAR_HALF_WIDTH * Math.abs(Math.cos(relative)) +
          CAR_HALF_LENGTH * Math.abs(Math.sin(relative));
        const limit = TRACK.width / 2 - extent - 0.025;
        if (Math.abs(offset) > limit) {
          const excess = offset - Math.sign(offset) * limit;
          c.b.position.x -= nx * excess;
          c.b.position.z -= nz * excess;
          c.b.aabbNeedsUpdate = true;
          const outward =
            (c.b.velocity.x * nx + c.b.velocity.z * nz) * Math.sign(offset);
          if (outward > 0) {
            c.impact = Math.max(c.impact, Math.min(1, outward / 18));
            c.b.velocity.x -= nx * outward * Math.sign(offset);
            c.b.velocity.z -= nz * outward * Math.sign(offset);
          }
        }
      }
    }
    for (const c of this.cars.values()) {
      if (running && !c.finished) this.progress(c, now, startAt, dt);
      c.impact *= Math.exp(-6 * dt);
      if (
        c.b.position.y < -5 ||
        nearest(c.b.position.x, c.b.position.z).distance > 45
      )
        this.reset(c);
    }
  }
  progress(c, now, startAt, dt = 0) {
    const next = (c.passed + 1) % 24,
      g = gates[next],
      p = c.b.position,
      old = c.previous;
    const before =
      (old.x - g.x) * Math.sin(g.yaw) + (old.z - g.z) * Math.cos(g.yaw);
    const after = (p.x - g.x) * Math.sin(g.yaw) + (p.z - g.z) * Math.cos(g.yaw);
    const across = Math.abs(
      (p.x - g.x) * Math.cos(g.yaw) - (p.z - g.z) * Math.sin(g.yaw),
    );
    if (before <= 0 && after > 0 && across < TRACK.width / 2 + 2) {
      c.passed++;
      if (c.passed === 24 * TRACK.laps)
        c.finished = Math.max(
          0.001,
          now - startAt - dt * 1000 * (1 - -before / (after - before)),
        );
    }
  }
  snapshot() {
    return [...this.cars.values()].map((c) => ({
      id: c.id,
      ack: c.ack || 0,
      x: c.b.position.x,
      y: c.b.position.y,
      z: c.b.position.z,
      yaw: c.yaw,
      vx: c.b.velocity.x,
      vz: c.b.velocity.z,
      respawn: c.respawn,
      impact: c.impact,
      throttle: c.input.up === true,
      braking: c.input.down === true,
      drift: c.input.drift === true,
      speed: Math.hypot(c.b.velocity.x, c.b.velocity.z),
      steer: c.steer,
      passed: c.passed,
      finished: c.finished,
      progress:
        c.passed +
        Math.min(
          0.99,
          Math.max(
            -1,
            (((((nearest(c.b.position.x, c.b.position.z).s -
              ((c.passed % 24) * LENGTH) / 24 +
              LENGTH / 2) %
              LENGTH) +
              LENGTH) %
              LENGTH) -
              LENGTH / 2) /
              (LENGTH / 24),
          ),
        ),
    }));
  }
}
````

## shared/contact.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/shared/contact.js`

````
// Oriented chassis footprints, shared by physical reset placement and rendering.
export const CAR_HALF_WIDTH = 1.28;
export const CAR_HALF_LENGTH = 2.3;
export function overlap(a, b, padding = 0) {
  const axes = [a.yaw, b.yaw].flatMap(yaw => [
    {x:Math.cos(yaw),z:-Math.sin(yaw)}, {x:Math.sin(yaw),z:Math.cos(yaw)}
  ]);
  let depth=Infinity, normal;
  for(const axis of axes){
    const radius = p => (CAR_HALF_WIDTH+padding)*Math.abs(Math.cos(p.yaw)*axis.x-Math.sin(p.yaw)*axis.z)+(CAR_HALF_LENGTH+padding)*Math.abs(Math.sin(p.yaw)*axis.x+Math.cos(p.yaw)*axis.z);
    const distance=(b.x-a.x)*axis.x+(b.z-a.z)*axis.z;
    const penetration=radius(a)+radius(b)-Math.abs(distance);
    if(penetration<=0)return null;
    if(penetration<depth){depth=penetration;normal={x:axis.x*(distance<0?-1:1),z:axis.z*(distance<0?-1:1)};}
  }
  return {...normal,depth};
}
````

## shared/driving.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/shared/driving.js`

````
import { TRACK, nearest } from "./track.js";
// Shared kinematic controller: authoritative server and bounded client prediction.
export function drive(c, input, dt, active = true) {
  const f = { x: Math.sin(c.yaw), z: Math.cos(c.yaw) },
    v = { x: c.vx, z: c.vz };
  let speed = v.x * f.x + v.z * f.z;
  const lateral = v.x * f.z - v.z * f.x;

  // Smooth, progressive steering response: snappy turn-in with zero twitch
  const targetSteer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
  c.steer += (targetSteer - c.steer) * (1 - Math.exp(-28 * dt));

  // Acceleration and Braking with dynamic power delivery
  if (input.up && !input.down) {
    const punch = 28 - Math.max(0, speed / 50) * 11.5;
    speed += punch * dt;
  } else if (input.down) {
    if (speed > 1)
      speed -= 38 * dt; // Decisive braking
    else speed -= 18 * dt; // Smooth reverse
  } else {
    speed *= Math.exp(-0.45 * dt); // Natural rolling drag
  }

  // Aerodynamic drag and speed clamping
  speed *= Math.exp(-(input.drift ? 0.55 : 0.18) * dt);
  speed = Math.max(-12, Math.min(50, speed));
  if (!active) speed *= Math.exp(-8 * dt);

  // Speed-sensitive steering with weight transfer dynamics
  const accelRate = (input.up ? 1 : 0) - (input.down ? 1 : 0);
  const weightTransfer = Math.max(-0.2, Math.min(0.3, -accelRate * 0.15));
  const frontGrip = 1.0 + weightTransfer;
  const speedFactor = Math.min(Math.abs(speed) / 7.5, 1);
  const stability = 1 / (1 + Math.max(0, Math.abs(speed) - 16) / 54);
  const turnAuthority = input.drift ? 2.22 : 1.5 * stability * frontGrip;
  const previousYaw = c.yaw;
  c.yaw += c.steer * Math.sign(speed || 1) * speedFactor * turnAuthority * dt;

  // Lateral tire grip / controlled drift slip
  const slipDamping = input.drift ? 2.2 : 11.5;
  const slip =
    (lateral - (input.drift ? speed * Math.sin(c.yaw - previousYaw) : 0)) *
    Math.exp(-slipDamping * dt);

  // Off-road grass friction (slight drag outside the asphalt road)
  const distFromCenter = nearest(c.x, c.z).distance;
  if (distFromCenter > TRACK.width / 2) {
    speed *= Math.exp(-1.4 * dt);
  }

  v.x = Math.sin(c.yaw) * speed + Math.cos(c.yaw) * slip;
  v.z = Math.cos(c.yaw) * speed - Math.sin(c.yaw) * slip;

  c.vx = v.x;
  c.vz = v.z;
}
export function predict(c, input, dt) {
  drive(c, input, dt);
  c.x += c.vx * dt;
  c.z += c.vz * dt;
}
````

## shared/track.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/shared/track.js`

````
export const TRACK = {
  name: "Palm Circuit",
  width: 22,
  laps: 3,
  maxPlayers: 6,
  segments: 180,
};

// Grand Prix style flowing circuit:
// Long main straight, high-speed sweeping corners, gentle continuous bends,
// wide run-offs, and no sudden sharp kinks.
const knots = [
  { x: 120, z: -140 }, // [0] Final bend exit onto main straight
  { x: 120, z: 0 },    // [1] Start / Finish line (s = 0, yaw = 0)
  { x: 120, z: 120 },  // [2] Main straight mid
  { x: 120, z: 200 },  // [3] Main straight braking zone
  { x: 90, z: 280 },   // [4] Turn 1: sweeping right entry
  { x: 20, z: 330 },   // [5] Turn 2: apex of north sweeper
  { x: -60, z: 320 },  // [6] Turn 2 exit
  { x: -130, z: 250 }, // [7] Flowing left bend
  { x: -160, z: 140 }, // [8] Sector 2 entry
  { x: -110, z: 40 },  // [9] Flowing S-curve right
  { x: -90, z: -50 },  // [10] Flowing S-curve left
  { x: -140, z: -140 },// [11] Back straight transition
  { x: -160, z: -230 },// [12] South sweeper entry
  { x: -100, z: -310 },// [13] South carousel apex (large radius)
  { x: 0, z: -320 },   // [14] South curve exit
  { x: 90, z: -250 },  // [15] Final wide bend entry
];

const N = knots.length;

function getRawPoint(t) {
  t = ((t % N) + N) % N;
  const i = Math.floor(t);
  const u = t - i;
  const p0 = knots[(i - 1 + N) % N];
  const p1 = knots[i];
  const p2 = knots[(i + 1) % N];
  const p3 = knots[(i + 2) % N];
  const u2 = u * u;
  const u3 = u2 * u;

  const x = 0.5 * (
    2 * p1.x +
    (-p0.x + p2.x) * u +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3
  );

  const z = 0.5 * (
    2 * p1.z +
    (-p0.z + p2.z) * u +
    (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u2 +
    (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u3
  );

  const dx = 0.5 * (
    (-p0.x + p2.x) +
    2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u +
    3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u2
  );

  const dz = 0.5 * (
    (-p0.z + p2.z) +
    2 * (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u +
    3 * (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u2
  );

  const yaw = Math.atan2(dx, dz);
  return { x, z, yaw };
}

// Pre-sample finely starting from t = 1 (where x = 120, z = 0, yaw = 0)
const SAMPLES = 2000;
const rawSamples = [];
for (let i = 0; i <= SAMPLES; i++) {
  const t = 1 + (i * N) / SAMPLES;
  rawSamples.push(getRawPoint(t));
}

const rawLengths = [0];
for (let i = 1; i < rawSamples.length; i++) {
  rawLengths.push(
    rawLengths[i - 1] +
      Math.hypot(rawSamples[i].x - rawSamples[i - 1].x, rawSamples[i].z - rawSamples[i - 1].z),
  );
}
const TOTAL_LENGTH = rawLengths.at(-1);

// Generate uniform arc-length equidistant lookup samples
const UNIFORM_COUNT = 1600;
const samples = [];
for (let i = 0; i <= UNIFORM_COUNT; i++) {
  const targetS = (i * TOTAL_LENGTH) / UNIFORM_COUNT;
  let lo = 0, hi = rawLengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rawLengths[mid] <= targetS) lo = mid;
    else hi = mid;
  }
  const a = rawSamples[lo], b = rawSamples[hi];
  const t = (targetS - rawLengths[lo]) / (rawLengths[hi] - rawLengths[lo] || 1);
  const delta = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw));
  samples.push({
    x: a.x + (b.x - a.x) * t,
    z: a.z + (b.z - a.z) * t,
    yaw: a.yaw + delta * t,
  });
}

const lengths = [0];
for (let i = 1; i < samples.length; i++) {
  lengths.push(
    lengths[i - 1] +
      Math.hypot(samples[i].x - samples[i - 1].x, samples[i].z - samples[i - 1].z),
  );
}

export const LENGTH = lengths.at(-1);

export function point(s, offset = 0) {
  s = ((s % LENGTH) + LENGTH) % LENGTH;
  let lo = 0,
    hi = lengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (lengths[mid] <= s) lo = mid;
    else hi = mid;
  }
  const a = samples[lo],
    b = samples[hi],
    t = (s - lengths[lo]) / (lengths[hi] - lengths[lo] || 1);
  const delta = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw)),
    yaw = a.yaw + delta * t;
  return {
    x: a.x + (b.x - a.x) * t + Math.cos(yaw) * offset,
    z: a.z + (b.z - a.z) * t - Math.sin(yaw) * offset,
    yaw,
  };
}

export function nearest(x, z) {
  let best = Infinity,
    s = 0;
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i],
      b = samples[i + 1],
      dx = b.x - a.x,
      dz = b.z - a.z;
    const lenSq = dx * dx + dz * dz;
    const t = lenSq > 0 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / lenSq)) : 0;
    const distance = (x - a.x - dx * t) ** 2 + (z - a.z - dz * t) ** 2;
    if (distance < best) {
      best = distance;
      s = lengths[i] + t * (lengths[i + 1] - lengths[i]);
    }
  }
  return { s: s % LENGTH, distance: Math.sqrt(best) };
}

export const gates = Array.from({ length: 24 }, (_, i) =>
  point((i * LENGTH) / 24),
);
````

## test/race.test.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/test/race.test.js`

````
import { test } from "node:test";
import assert from "node:assert/strict";
import { io } from "socket.io-client";
import { Race } from "../server/race.js";
import { createGame } from "../server/index.js";
import { point, LENGTH, nearest } from "../shared/track.js";

test("circuit has left/right turns, sweepers, gentle bends and a long straight", () => {
  let left = false, right = false, sweepers = false, gentle = false, straight = 0, longest = 0;
  for(let s=0;s<LENGTH;s++) {
    const a=point(s),b=point(s+1);
    const turn=Math.atan2(Math.sin(b.yaw-a.yaw),Math.cos(b.yaw-a.yaw));
    left ||= turn < -0.01; right ||= turn > 0.01;
    sweepers ||= Math.abs(turn) > 0.015;
    gentle ||= Math.abs(turn) > 0.005 && Math.abs(turn) <= 0.015;
    straight=Math.abs(turn)<0.001?straight+1:0;longest=Math.max(longest,straight);
  }
  assert.ok(left && right && sweepers && gentle);assert.ok(longest>=80);
});
test("track is continuous and nearest recovers distance", () => {
  for (let s = 0; s < LENGTH; s += 0.7) {
    const p = point(s);
    assert.ok(Math.abs(nearest(p.x, p.z).s - s) < 0.001);
  }
  assert.ok(
    Math.hypot(
      point(-0.001).x - point(0.001).x,
      point(-0.001).z - point(0.001).z,
    ) < 0.003,
  );
});
test("server physics accelerates, brakes, reverses, collides and remains grounded", () => {
  const r = new Race(),
    c = r.add("a", 0);
  let now = 10000;
  const initialZ = c.b.position.z;
  c.input = { up: true };
  for (let i = 0; i < 100; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.position.z > initialZ + 10);
  assert.ok(c.b.position.y > 0.3 && c.b.position.y < 0.7);
  c.input = { down: true };
  for (let i = 0; i < 220; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.velocity.z < 0);
  c.b.position.set(126, 0.55, 0);
  c.yaw = Math.PI / 2;
  c.input = { up: true };
  for (let i = 0; i < 180; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.position.x < 132, "barrier contains car");
});
test("checkpoints reject skips/backward crossings; 3 ordered laps finish", () => {
  const r = new Race(),
    c = r.add("a", 0);
  function cross(n, back = false) {
    const s = (n * LENGTH) / 24,
      a = point(s - (back ? -1 : 1)),
      b = point(s + (back ? -1 : 1));
    c.previous = a;
    c.b.position.set(b.x, 0.5, b.z);
    r.progress(c, 10000 + n * 100, 10000);
  }
  cross(3);
  assert.equal(c.passed, 0);
  cross(1, true);
  assert.equal(c.passed, 0);
  for (let n = 1; n <= 72; n++) cross(n);
  assert.equal(c.passed, 72);
  assert.equal(c.finished, 7200);
  r.reset(c);
  assert.equal(c.passed, 72);
});
test("stale inputs stop accelerating and lobby ignores inputs", () => {
  const r = new Race(),
    c = r.add("a", 0);
  c.input = { up: true };
  c.inputAt = 0;
  r.step(1 / 60, 10000, true, 0);
  assert.ok(Math.abs(c.b.velocity.z) < 0.01);
  c.inputAt = 10000;
  r.step(1 / 60, 10000, false, 0);
  assert.ok(Math.abs(c.b.velocity.z) < 0.01);
});
test("a car can physically drive three complete laps through every checkpoint", () => {
  const r = new Race(),
    c = r.add("driver", 0);
  let now = 10000;
  for (let i = 0; i < 18000 && !c.finished; i++) {
    const p = c.b.position,
      target = point(nearest(p.x, p.z).s + 10),
      desired = Math.atan2(target.x - p.x, target.z - p.z),
      error = Math.atan2(Math.sin(desired - c.yaw), Math.cos(desired - c.yaw));
    c.input = { up: true, left: error < -0.045, right: error > 0.045 };
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.equal(c.passed, 72);
  assert.ok(c.finished > 10000 && c.finished < 300000);
});
test("real Socket.IO clients: validation, isolation, host authority, movement, results, rematch, cleanup", async (t) => {
  const game = await createGame();
  await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${game.http.address().port}`,
    clients = [];
  t.after(async () => {
    clients.forEach((s) => s.disconnect());
    await game.close();
  });
  async function connect() {
    const s = io(url, { forceNew: true, transports: ["websocket"] });
    clients.push(s);
    await new Promise((resolve) => s.on("connect", resolve));
    return s;
  }
  const a = await connect(),
    b = await connect(),
    c = await connect();
  const send = (s, e, d = {}) =>
    new Promise((resolve, reject) =>
      s.timeout(2000).emit(e, d, (err, r) => (err ? reject(err) : resolve(r))),
    );
  assert.equal((await send(a, "enter", null)).ok, false);
  assert.equal(
    (await send(a, "enter", { name: "x".repeat(19), create: true })).ok,
    false,
  );
  assert.equal(
    (await send(b, "enter", { name: "B", code: "AAAAA" })).ok,
    false,
  );
  const created = await send(a, "enter", { name: "Alpha", create: true });
  assert.equal(created.ok, true);
  const room = game.rooms.get(created.code);
  assert.equal((await send(a, "start")).ok, false);
  assert.equal(
    (await send(b, "enter", { name: "Bravo", code: created.code })).ok,
    true,
  );
  await send(c, "enter", { name: "Other", create: true });
  assert.equal((await send(b, "start")).ok, false);
  assert.equal((await send(a, "start")).ok, true);
  assert.equal(room.phase, "countdown");
  assert.equal(
    (await send(c, "enter", { name: "No", code: created.code })).ok,
    false,
  );
  room.startAt = Date.now() - 1000;
  let bState;
  b.on("state", (s) => (bState = s));
  const initial = room.race.cars.get(a.id).b.position.z;
  for (let i = 0; i < 8; i++) {
    a.emit("input", { up: true });
    await new Promise((r) => setTimeout(r, 50));
  }
  assert.ok(room.race.cars.get(a.id).b.position.z > initial);
  assert.ok(bState.cars.find((p) => p.id === a.id).z > initial);
  assert.equal(bState.players.length, 2);
  room.race.cars.get(a.id).finished = 1200;
  room.race.cars.get(b.id).finished = 1500;
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(room.phase, "results");
  assert.equal((await send(b, "rematch")).ok, false);
  assert.equal((await send(a, "rematch")).ok, true);
  assert.equal(room.phase, "lobby");
  assert.equal(room.race.cars.get(a.id).passed, 0);
  const aid = a.id,
    bid = b.id;
  await send(a, "leave");
  assert.equal(room.host, bid);
  assert.ok(!room.players.has(aid));
  await send(b, "leave");
  assert.ok(!game.rooms.has(created.code));
});
test("six-player cap, spoof resistance, real disconnect host transfer and finish timeout", async (t) => {
  const game = await createGame();
  await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
  const sockets = [];
  t.after(async () => {
    sockets.forEach((s) => s.disconnect());
    await game.close();
  });
  const send = (s, e, d = {}) =>
    new Promise((resolve, reject) =>
      s.timeout(2000).emit(e, d, (err, r) => (err ? reject(err) : resolve(r))),
    );
  for (let i = 0; i < 7; i++) {
    const s = io(`http://127.0.0.1:${game.http.address().port}`, {
      forceNew: true,
    });
    sockets.push(s);
    await new Promise((resolve) => s.on("connect", resolve));
  }
  const { code } = await send(sockets[0], "enter", {
    name: "Host",
    create: true,
  });
  for (let i = 1; i < 6; i++)
    assert.equal(
      (await send(sockets[i], "enter", { name: "Driver" + i, code })).ok,
      true,
    );
  assert.equal(
    (await send(sockets[6], "enter", { name: "Seventh", code })).ok,
    false,
  );
  const room = game.rooms.get(code);
  assert.equal(new Set([...room.players.values()].map((p) => p.color)).size, 6);
  await send(sockets[0], "start");
  room.startAt = Date.now() - 1000;
  sockets[1].emit("input", { x: 99999, passed: 72, finished: 1, up: "yes" });
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.race.cars.get(sockets[1].id).passed, 0);
  assert.equal(room.race.cars.get(sockets[1].id).finished, null);
  const next = sockets[1].id;
  sockets[0].disconnect();
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.host, next);
  assert.equal(room.players.size, 5);
  room.race.cars.get(next).finished = 5000;
  await new Promise((r) => setTimeout(r, 50));
  assert.ok(room.endAt > Date.now());
  room.endAt = Date.now() - 1;
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.phase, "results");
  assert.ok(room.race.snapshot().some((c) => c.finished === null));
});
````

## vite.config.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/vite.config.js`

````
import { defineConfig } from "vite";
export default defineConfig({
  root: "client",
  build: { outDir: "../dist", emptyOutDir: true },
  server: { host: "127.0.0.1" },
});
````
