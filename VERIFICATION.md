# Verification record

Checked on 2026-09-12, Windows, Node.js 24.19.0.

## Observed passing checks

- Dependency installation completed; npm reported zero known vulnerabilities at install time.
- Production Vite build completed. Main browser bundle is about 1.13 MB (280 KB gzip), plus shader chunks. Vite's large-chunk advisory remains; it is not a build error.
- Development server started; `/health` returned `{"ok":true}` and the Vite-transformed main module returned HTTP 200.
- Production server started and served the browser app.
- Track continuity and nearest-track projection tested across the complete loop.
- Server simulation tested for acceleration, braking/reverse, ground contact and barrier containment.
- Stale inputs and lobby inputs do not accelerate cars.
- Checkpoint tests reject skipped/backward gates and accept 72 ordered crossings.
- An automated driver physically completed three laps using steering/throttle through the actual Cannon simulation, without teleporting between checkpoints.
- Real Socket.IO clients tested create/join errors, room isolation, host-only start/rematch, countdown phase, network movement observed by a second client, finish/results, rematch reset and empty-room cleanup.
- Seven connecting clients tested six-player room capacity, unique colors, ignored spoofed progress, actual host disconnect transfer and finish-window timeout.
- Two headless Chrome pages loaded Babylon's rendered scene, created/joined a room, showed synchronized countdown, accelerated with keyboard controls, turned, reset, and left their room without page JavaScript errors.
- Browser results and rematch presentation checked using a server-side finish fixture. This is a UI test, not a human-driven full-race browser test.
- Screenshots inspected at 1440×1000 and 390×844: home, race, remote view, results and narrow home layout.

## Reproduce

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run test:browser
```

The browser script requires installed Google Chrome. It runs a temporary local production server, then closes it. Screenshots go to the ignored `test-artifacts/` directory.

## Not yet verified / intentional limits

- No Render deployment was performed: no Render deployment credentials or connected account were available. No public URL exists yet.
- HTTPS/WSS configuration is prepared, but public connectivity and play between separate homes require the deployed service.
- Chrome used software WebGL in headless tests. These establish rendering and behavior, not a desktop GPU frame-rate guarantee.
- Narrow-screen layout was checked; physical mobile touch play and audio quality were not manually tested.
- No packet-loss/large-latency testing; controls are server authoritative without local prediction.
- Players disconnected during a race cannot resume it. Rejoin a lobby after the host rematches; host automatically transfers.
- Cars are ghosts relative to one another. Ground and barriers collide. There is no suspension or car-to-car impact simulation.
- No persistence, saved rankings, accounts or paid assets. Render restarts clear rooms.
- Engine and countdown/results tones are synthesized. Dedicated collision/finish-per-driver sounds are not included.
- Free-tier availability and allowance can change; official hosting references are in README.md.

The local implementation is working under the tests above. The complete online goal remains pending one-time account setup and a public race check.
