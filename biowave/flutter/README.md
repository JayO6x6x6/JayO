# BioWave Flutter Client

Mobile client architecture for the BioWave research platform.

## Planned screens

- Research Dashboard
- Cancer Data Explorer
- Signal / FFT / STFT viewer
- Cymatics experiment runner
- Image feature-analysis workspace
- Experiment Notebook
- Provenance & Audit
- Export
- Lab Gateway status

## Boundary

The mobile app is a research client. It should communicate with a server-side lab gateway for any instrument telemetry. It must not directly drive stimulation hardware, expose therapeutic presets, or present diagnostic/treatment recommendations.

## Suggested stack

Flutter + Dart, `fl_chart` for plots, `dio` for API transport, `json_serializable` for typed records, and platform-secure storage for authenticated lab credentials. Pin dependency versions during implementation and run `flutter analyze`/tests in CI.
