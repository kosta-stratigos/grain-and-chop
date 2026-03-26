# Granular Chop Lab

Dependency-free browser prototype for a sample-based instrument that combines:

- `SampleLayer`: file decoding, region selection, and slice generation
- `PlaybackLayer`: granular grains and rhythmic slice triggering
- `TransportLayer`: BPM-synced step sequencing and transport timing

## Run

Because this uses ES modules, serve the folder with a simple static server instead of opening
`index.html` directly from `file://`.

Quickest option:

```bash
./start.sh
```

This starts the app at [http://localhost:4173](http://localhost:4173).

Examples:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Prototype features

- audio file import
- waveform display with editable playback region
- granular mode with grain size, density, spray, pitch, and reverse
- chop mode with slice count, gate, pitch, reverse, and pattern sequencing
- BPM transport with 8-16 step pattern grid
- one-shot trigger via button or space bar

## Known limitations

- reverse playback currently uses a full reversed copy of the loaded buffer, which is fine for a
  prototype but not ideal for large samples or polyphony-heavy sessions
- timing is good enough for a prototype but still scheduled from the main thread
- slice detection is manual and evenly divided, not transient-aware yet
