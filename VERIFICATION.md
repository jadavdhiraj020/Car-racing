# Verification record

Checked 2026-09-20 through 2026-09-24 on Windows, Node.js 24.19.0 and Chrome using Intel UHD / Direct3D11. No new test files were added. The existing browser smoke check's quality list was updated for Ultra; other additional checks ran inline. Build artifacts, screenshots and local metrics are ignored under test-artifacts/.

## Audit and fixes

| Priority | Reproduced problem or audit finding | Change |
| --- | --- | --- |
| P0 | Render frames threw ReferenceError and assignment-to-constant errors; recovery warnings hid a broken 3D view even though build/server tests passed | Repair target yaw/time bindings and mutable height; count failed frames and surface the first render error |
| P1 | Raw oversized delta reached Cannon despite a locally clamped value; invalid transforms could contaminate contact solving | Bound the complete simulation step, reject invalid deltas, repair nonfinite car state before stepping |
| P1 | Delayed/reordered or malformed snapshots could reach HUD, transforms and audio | Validate complete snapshots and reject stale sequence numbers; track race generation |
| P1 | High-speed drift yaw and instantaneous lateral cancellation produced abrupt handling | Bound lateral acceleration/yaw authority and preserve damped lateral inertia in shared server/prediction handling |
| P1 | Variable-step prediction and independently adjusted interpolation could disagree during contact | Fixed-step local prediction, one frame timeline, conservative contact fallback, bounded extrapolation and residual oriented visual separation |
| P1 | Stale commands survived reset or were reported as active throttle; redundant bindings released held controls | Snapshot effective controls; clear reset commands; aggregate independent keyboard and pointer sources; clear them on blur, hide, disconnect and leave |
| P1 | Audio transients, remote voices and music needed explicit ownership across state changes | Owned node/source/timer cleanup, bounded music voices, envelope ramps, remote range hysteresis, cancellation on mute/phase/hide |
| P2 | Camera aim and lobby transitions snapped; wheels always spun forward | Damped aim/position/FOV, signed wheel rotation, bounded load-based body and suspension motion |
| P2 | Repeated track scans, identical DOM writes and layout reads consumed frame budget | Exact spatial rejection in nearest-track search, cached HTML, batched HUD rectangles, bounded adaptive resolution |
| P2 | Requested music/mixer and Ultra tier were missing | Original quiet procedural ambient score, four independent mixer controls, four graphics tiers |

The existing room, race, checkpoint, results, rematch and same-origin deployment architecture is preserved. This remains a believable arcade handling model: suspension/body load is animated, not a full tire and suspension simulator. The existing flowing 22 m wide circuit is retained. The validated WebGL2 path is retained; WebGPU was not introduced.

## Passing automated and browser checks

- Final production build succeeds: main bundle 1,475.48 kB / 384.41 kB gzip, plus lazy shader modules and local fonts. Vite retains its bundle-size advisory.
- All eight existing Node tests pass, including three physically driven laps through all 72 checkpoints, stale inputs, barriers, reverse, room isolation, host authority/transfer, player cap, invalid requests, results and timeout.
- Inline invalid-state checks repair NaN/Infinity before physics solving. Invalid/nonpositive deltas do not move cars; oversized deltas are bounded.
- 10,000 nearest-track queries exactly match the previous exhaustive search (maximum discrepancy 0).
- 4,800 ticks of rapid steering, braking, throttle and drift remain finite; maximum sampled per-tick yaw change is 0.034 radians.
- Opposing cars at a combined closing speed of 100 m/s make contact without exchanging sides or sampled penetration. Six-car, 900-tick random-control stress records maximum overlap 0. Sub-tick finishing orders a 10 ms gap correctly.
- Two simultaneous independent production Chrome clients physically drive three full laps using browser keyboard events, with no finish/checkpoint/position fixtures. Both reach 72 checkpoints; finish times are 102.749 s and 104.865 s, followed by successful results and rematch. Zero browser console/page errors and zero failed render frames. At 94 approximately one-second sample points, maximum authoritative and rendered footprint overlap is 0.
- Additional browser stress reaches 180 km/h, performs hard steering, drift, barrier/head-on impacts, reset, disconnect/rejoin and repeated races/rematches. Five race/rematch cycles keep scene counts fixed. Some lifecycle scenarios use finish fixtures; the full three-lap browser run above does not.
- Delaying inputs by 100 ms and snapshots by 100 ms, followed by a 350 ms snapshot gap, preserves the race and recovers fresh state. Invalid snapshots are discarded. This is controlled application-message delay, not exhaustive WAN packet loss.
- Combined W/Up and A/Left bindings retain the held control when one key is released. A real browser touch event holds throttle after keyboard release; releasing the final touch or blurring releases controls. Four quality tiers, synchronized countdown, winner/results, responsive HUD and a 390 x 844 layout are exercised. Production screenshots are visually inspected.
- Engine/music activation, four independent mixer sliders and mute/unmute work. Music uses original 64 BPM synthesized material and is ducked during racing. Muting releases music voices, remote voices and effect timers; the reusable continuous engine graph remains allocated intentionally.
- Offline browser music rendering produces finite, non-silent, unclipped samples: peak 0.0293, RMS 0.00530, maximum adjacent-sample difference 0.00182. All rendered voices are released. This verifies signal/lifecycle behavior, not a subjective rating of realism.

## Measured performance and lifetime

Two native-GPU Chrome clients share this machine's GPU. Medium may adapt its internal resolution; these measurements are observations, not universal 60 FPS guarantees.

| Measurement | Observation |
| --- | --- |
| Sustained race viewport | 1280 x 800 per client |
| Late-race frame interval | 20.54 / 20.55 ms mean (about 49 FPS); p95 24.4 / 24.5 ms over each client's latest 360 frames |
| CPU time inside scene.render at final sample | 2.6 / 7.8 ms; excludes asynchronous GPU work |
| Draw calls at final sample | 67 / 100; depends on each camera's visible objects |
| Scene objects throughout race/rematch checks | 573 meshes, 49 materials, 14 textures; no growth observed |
| Post-GC JS heap at 3 / 36 / 68 / 102 seconds, client 1 | 23.27 / 23.98 / 24.29 / 23.69 MB |
| Post-GC JS heap at same points, client 2 | 22.81 / 23.60 / 23.74 / 23.40 MB |
| Audio after mute and envelope completion | 33 nodes, 9 reusable continuous sources, 0 music voices, 0 remote cars, 0 transient timers |
| Final six-car, 900-tick simulation with deterministic random controls | Mean 1.28 ms, p95 2.22 ms per tick |
| Measured racing snapshots over 3 seconds | 29.62 Hz, approximately 25.4 kB/s of JSON payload per receiving client for two cars; excludes transport overhead |

Heap variation and stable object counts show no accumulating leak in these runs. They do not replace a multi-hour soak. Earlier software-rendered Chrome was much slower than native GPU rendering. Hardware acceleration is required for practical play.

## Reproduce

Run `npm.cmd ci`, `npm.cmd test`, `npm.cmd run build`, then `npm.cmd start`. Production serves the built assets and Socket.IO from one origin.

`npm.cmd run test:browser` runs the existing Chrome smoke script. Its default uses software graphics. Native verification evaluates the same assertions in memory with `--use-angle=d3d11` and a separate browser context per driver. Inline extensions check combined controls, mixer cleanup and runtime-error counters. Complete-lap verification imports the shared track geometry into a temporary browser controller that dispatches ordinary key events every 50 ms; it does not alter game positions, speed, checkpoints or finishes. No extra test source is saved.

For manual multiplayer verification, create/join a room in two independent browser windows, turn sound on, start, drive three laps, check finishing order and rematch. Test distant friends using the deployed HTTPS URL.

## 2026-09-24 rendering follow-up

- Corrected the visual chassis ride height: the wing/body now sit lower relative to the grounded wheel pivots. This changes presentation only; server collision dimensions and checkpoint geometry are unchanged. Inspected the production race view at 180 km/h.
- Changed procedural palms from flat oval fronds into tapered, curved fronds. Grouped static palm geometry by circuit region for GPU instancing and removed off-screen trunk shadow draws. Inspected the production lobby view and checked the generated world bounds of all eight regions.
- Short-circuited oriented visual contact projection when a pass makes no correction. It still allows all eight passes where cars or barriers actually need separation.
- In the paired two-client 1280 × 800 Chrome drive on this machine, the committed version averaged 18.67 / 18.63 ms per frame (p95 21.7 / 21.9 ms, 573 meshes). The final version averaged 17.59 / 17.53 ms (p95 20.6 / 20.8 ms, 253 meshes). Both clients reached 180 km/h with zero failed render frames and no console/page errors. Scene CPU render samples fell from 4.1 / 2.9 ms to 1.9 / 1.1 ms at the measurement points. Adaptive resolution varied slightly between runs; the final run used 1.5 scaling on both clients. These are short local observations, not a locked 60 FPS guarantee.
- The final native-GPU two-client smoke run passed create/join, all four quality tiers, synchronized countdown, keyboard driving, winner/results, rematch, leave and narrow layout with no page errors. Eight existing Node tests and the final production build pass. No new test files were created.

## 2026-09-24 driving-smoothness follow-up

- Blended the local car's visual position and heading when nearby traffic or road edges switch it from client prediction to the authoritative timeline. Server collision separation still runs after this visual handoff. Expanded the range of small corrections that reconcile smoothly; hard impacts still snap to authoritative state.
- Reduced repeated HUD text/style writes and updated clock text at 10 Hz between network snapshots.
- In the same two-car, 1280 × 800 native-GPU Chrome handoff scenario, the largest sampled local-car movement was 2.10 m in a frame, versus 6.11 m before the change. The final run recorded a 13.9 ms median and 21.3 ms p95 frame interval over 409 frames, with zero failed render frames and no page errors. These are local observations, not a guarantee under every network condition.
- Production build, eight existing Node tests, and the two-client browser smoke check passed. Both existing stress scripts passed in memory with native-GPU Chrome: five consecutive race/rematch cycles and all seven crash/contact/rejoin checks. No new test files were created.
- The unmodified stress scripts' SwiftShader software-rendering runs timed out on browser click/countdown timing after earlier checks passed. A focused native-GPU pointer test confirmed rematch START works; the native-GPU stress runs completed.

## 2026-09-24 barrier and input responsiveness follow-up

- Reproduced a barrier trap in 16 server simulations: after striking the opposite wall, a car held on throttle could spend 79–155 of 300 ticks below 2 m/s. Low-speed barrier recovery now turns an outward-facing car gently toward the road once per tick. The same scenarios spent 0–9 ticks below 2 m/s and remained within the track edge.
- Input changes and releases now use reliable Socket.IO delivery, while unchanged periodic packets remain volatile to avoid a backlog on congested links.
- In a five-transition local two-client Chrome check, key changes reached the server in 10–77 ms and appeared in the other client's snapshots in 40–140 ms. This includes browser scheduling on the test machine, not internet latency or the remote render buffer.
- Production build, eight existing Node tests, two-client browser smoke check, and the native-GPU crash/contact/rematch/rejoin stress run passed with zero browser errors. No new test file was added.
- Loopback checks cannot quantify delay between friends on different networks. Hosting region, connection quality, and browser hardware can still affect perceived lag.

## NOT TESTED and practical limits

- Public deployment: NOT TESTED. No deployed URL was available. Render configuration, health route and same-origin networking remain intact; a Git push does not prove that a public deployment succeeded.
- Separate-home internet play, physical mobile/touch hardware, headphones/speakers and hours-long sessions: NOT TESTED. Narrow layout and real browser touch-event input can be checked locally without proving performance on a phone.
- Audio is procedural motorsport-inspired synthesis, not sampled real F1 recordings. Perceived engine/music quality has not been independently rated.
- The tested machine does not sustain locked 60 FPS with two simultaneous 3D clients. Adaptive resolution is bounded; select Low or use one client per machine for more headroom.
- No overlap/pass-through was observed in the stated checks. Finite simulation and arbitrary networking conditions cannot establish an absolute guarantee for every possible collision.
- A full transport disconnect removes that driver and may transfer host. Rejoining an active race remains disabled; reconnecting players join the next lobby.
- Rooms remain in memory. Server restarts/deployments clear them.
