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
