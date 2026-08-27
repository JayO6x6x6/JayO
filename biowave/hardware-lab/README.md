# BioWave Hardware Lab Boundary

This directory defines the software boundary for future hardware integration.

## Allowed architecture

`Browser/App -> authenticated lab gateway -> approved instrument -> telemetry`

The public demo has **no direct patient-facing output**, no therapeutic waveform presets, no dosing logic, and no closed-loop stimulation.

A production laboratory implementation should require:

- authenticated operators
- device allow-listing
- physical emergency stop
- hard electrical/current/voltage limits enforced by hardware
- independent watchdog
- calibration records
- immutable experiment IDs
- raw telemetry + timestamps
- explicit operator confirmation before any instrument action
- ethics/safety review appropriate to the experiment

## Simulation mode

Use the browser cymatics/audio modules for non-contact demonstration. Hardware drivers should be implemented as a separate, access-controlled service rather than bundled into the public GitHub Pages client.
