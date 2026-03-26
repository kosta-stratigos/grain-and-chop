const ui = {
  audioToggle: document.querySelector("#audio-toggle"),
  sampleInput: document.querySelector("#sample-input"),
  sampleStatus: document.querySelector("#sample-status"),
  diagnostics: document.querySelector("#diagnostics"),
  waveform: document.querySelector("#waveform"),
  regionStart: document.querySelector("#region-start"),
  regionEnd: document.querySelector("#region-end"),
  sliceCount: document.querySelector("#slice-count"),
  sliceCountValue: document.querySelector("#slice-count-value"),
  randomizePattern: document.querySelector("#randomize-pattern"),
  trackSelector: document.querySelector("#track-selector"),
  mode: document.querySelector("#mode"),
  grainSize: document.querySelector("#grain-size"),
  grainSizeValue: document.querySelector("#grain-size-value"),
  grainDensity: document.querySelector("#grain-density"),
  grainDensityValue: document.querySelector("#grain-density-value"),
  spray: document.querySelector("#spray"),
  sprayValue: document.querySelector("#spray-value"),
  pitch: document.querySelector("#pitch"),
  pitchValue: document.querySelector("#pitch-value"),
  chopGate: document.querySelector("#chop-gate"),
  chopGateValue: document.querySelector("#chop-gate-value"),
  reverse: document.querySelector("#reverse"),
  triggerNow: document.querySelector("#trigger-now"),
  bpm: document.querySelector("#bpm"),
  bpmValue: document.querySelector("#bpm-value"),
  stepCount: document.querySelector("#step-count"),
  stepCountValue: document.querySelector("#step-count-value"),
  transportToggle: document.querySelector("#transport-toggle"),
  mixerGrid: document.querySelector("#mixer-grid"),
  patternGrid: document.querySelector("#pattern-grid"),
};

const STORAGE_KEY = "granular-chop-lab:session";
const TRACK_COUNT = 4;
const TRACK_COLORS = ["#59d0ff", "#ff8f5a", "#8dff7a", "#ffd34d"];

class SampleLayer {
  constructor() {
    this.buffer = null;
    this.reversedBuffer = null;
    this.regionStart = 0;
    this.regionEnd = 1;
  }

  async loadFile(file, audioContext) {
    const data = await file.arrayBuffer();
    this.buffer = await audioContext.decodeAudioData(data);
    this.reversedBuffer = this.createReversedBuffer(audioContext, this.buffer);
    this.regionStart = 0;
    this.regionEnd = 1;
    return this.buffer;
  }

  createReversedBuffer(audioContext, sourceBuffer) {
    const reversed = audioContext.createBuffer(
      sourceBuffer.numberOfChannels,
      sourceBuffer.length,
      sourceBuffer.sampleRate,
    );
    for (let channel = 0; channel < sourceBuffer.numberOfChannels; channel += 1) {
      const source = sourceBuffer.getChannelData(channel);
      const target = reversed.getChannelData(channel);
      for (let index = 0; index < source.length; index += 1) {
        target[index] = source[source.length - 1 - index];
      }
    }
    return reversed;
  }

  setRegion(start, end) {
    const safeStart = Math.min(start, end - 0.01);
    const safeEnd = Math.max(end, safeStart + 0.01);
    this.regionStart = Math.max(0, Math.min(1, safeStart));
    this.regionEnd = Math.max(this.regionStart + 0.01, Math.min(1, safeEnd));
  }

  getRegionBounds() {
    if (!this.buffer) return { startTime: 0, endTime: 0 };
    return {
      startTime: this.buffer.duration * this.regionStart,
      endTime: this.buffer.duration * this.regionEnd,
    };
  }

  getSlices(sliceCount = 8) {
    if (!this.buffer) return [];
    const safeSliceCount = Math.max(2, Math.min(16, sliceCount));
    const { startTime, endTime } = this.getRegionBounds();
    const length = (endTime - startTime) / safeSliceCount;
    return Array.from({ length: safeSliceCount }, (_, index) => ({
      index,
      start: startTime + index * length,
      duration: length,
    }));
  }
}

class PlaybackLayer {
  constructor(audioContext, sampleLayer) {
    this.audioContext = audioContext;
    this.sampleLayer = sampleLayer;
    this.output = audioContext.createGain();
    this.output.gain.value = 0.9;
    this.output.connect(audioContext.destination);
  }

  createVoice({ when, offset, duration, rate, reverse = false, attack = 0.01, release = 0.02, level = 1 }) {
    const baseBuffer = this.sampleLayer.buffer;
    const buffer = reverse ? this.sampleLayer.reversedBuffer : baseBuffer;
    if (!buffer) return false;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;

    const safeDuration = Math.max(0.02, Math.min(duration, buffer.duration));
    const maxOffset = Math.max(0, buffer.duration - safeDuration);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.0001, when);
    gainNode.gain.linearRampToValueAtTime(0.75 * level, when + attack);
    gainNode.gain.linearRampToValueAtTime(0.0001, when + safeDuration + release);

    source.connect(gainNode);
    gainNode.connect(this.output);
    const intendedOffset = reverse ? buffer.duration - offset - safeDuration : offset;
    const playbackOffset = Math.max(0, Math.min(maxOffset, intendedOffset));
    source.start(when, playbackOffset, safeDuration);
    source.stop(when + safeDuration + release);
    return true;
  }

  triggerGranular(settings, when = this.audioContext.currentTime) {
    const buffer = this.sampleLayer.buffer;
    if (!buffer) return false;

    const { startTime, endTime } = this.sampleLayer.getRegionBounds();
    const rate = 2 ** (settings.pitch / 12);
    const regionDuration = Math.max(0.02, endTime - startTime);
    const grainDuration = Math.min(settings.grainSizeMs / 1000, regionDuration);
    const grainCount = Math.max(1, Math.round(settings.density * 0.35));
    let triggered = false;

    for (let index = 0; index < grainCount; index += 1) {
      const jitter = (Math.random() * 2 - 1) * settings.spray;
      const randomPoint = startTime + Math.random() * Math.max(0.001, regionDuration - grainDuration);
      const position = Math.max(startTime, Math.min(endTime - grainDuration, randomPoint + jitter));
      triggered =
        this.createVoice({
          when: when + index * (1 / Math.max(1, settings.density)),
          offset: Math.max(0, position),
          duration: Math.min(grainDuration, buffer.duration - position),
          rate,
          reverse: settings.reverse,
          attack: grainDuration * 0.2,
          release: grainDuration * 0.35,
          level: settings.level ?? 1,
        }) || triggered;
    }

    return triggered;
  }

  triggerSlice(track, when = this.audioContext.currentTime, sliceIndex = null) {
    const slices = this.sampleLayer.getSlices(track.sliceCount);
    if (!slices.length) return false;
    const index = sliceIndex ?? (track.id - 1) % slices.length;
    const slice = slices[index % slices.length];
    const rate = 2 ** (track.pitch / 12);
    return this.createVoice({
      when,
      offset: slice.start,
      duration: Math.max(0.03, slice.duration * (track.chopGate / 100)),
      rate,
      reverse: track.reverse,
      attack: 0.004,
      release: 0.03,
      level: track.volume,
    });
  }

  triggerTrack(track, when = this.audioContext.currentTime, sliceIndex = null) {
    if (track.mode === "granular") {
      return this.triggerGranular(
        {
          grainSizeMs: track.grainSize,
          density: track.grainDensity,
          spray: track.spray / 100,
          pitch: track.pitch,
          reverse: track.reverse,
          level: track.volume,
        },
        when,
      );
    }
    return this.triggerSlice(track, when, sliceIndex);
  }
}

class TransportLayer {
  constructor(audioContext, playbackLayer, state) {
    this.audioContext = audioContext;
    this.playbackLayer = playbackLayer;
    this.state = state;
    this.lookaheadMs = 25;
    this.scheduleAheadTime = 0.12;
    this.intervalId = null;
    this.nextStepTime = 0;
    this.currentStep = 0;
    this.onStep = null;
  }

  start() {
    if (this.intervalId) return;
    this.currentStep = 0;
    this.nextStepTime = this.audioContext.currentTime + 0.03;
    this.intervalId = window.setInterval(() => this.tick(), this.lookaheadMs);
  }

  stop() {
    window.clearInterval(this.intervalId);
    this.intervalId = null;
    this.currentStep = 0;
    if (this.onStep) this.onStep(-1);
  }

  tick() {
    while (this.nextStepTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.advance();
    }
  }

  scheduleStep(stepIndex, when) {
    if (this.onStep) this.onStep(stepIndex);
    if (!this.state.sample.buffer) return;
    this.state.tracks.forEach((track) => {
      if (!track.pattern[stepIndex]) return;
      if (!isTrackAudible(track)) return;
      const sliceIndex = (stepIndex + track.id - 1) % track.sliceCount;
      indicateTrackPlayback(track, sliceIndex);
      this.playbackLayer.triggerTrack(track, when, sliceIndex);
    });
  }

  advance() {
    this.nextStepTime += 60 / this.state.bpm / 4;
    this.currentStep = (this.currentStep + 1) % this.state.steps;
  }
}

function createAudioContext() {
  return new AudioContext();
}

function createTrack(id) {
  return {
    id,
    name: `Track ${id}`,
    color: TRACK_COLORS[(id - 1) % TRACK_COLORS.length],
    mode: id % 2 === 0 ? "chop" : "granular",
    muted: false,
    solo: false,
    volume: 0.85,
    reverse: false,
    grainSize: 110,
    grainDensity: 12,
    spray: 18,
    pitch: 0,
    chopGate: 70,
    sliceCount: 8,
    pattern: Array.from({ length: 16 }, (_, index) => (index + id - 1) % 4 === 0),
  };
}

const state = {
  audioContext: null,
  sample: new SampleLayer(),
  playback: null,
  transport: null,
  bpm: 112,
  steps: 16,
  selectedTrackIndex: 0,
  tracks: Array.from({ length: TRACK_COUNT }, (_, index) => createTrack(index + 1)),
  trackIndicators: Array.from({ length: TRACK_COUNT }, () => null),
};

function getSelectedTrack() {
  return state.tracks[state.selectedTrackIndex];
}

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function normalizeTrack(index, source = {}) {
  const fallback = createTrack(index + 1);
  return {
    ...fallback,
    color: typeof source.color === "string" ? source.color : fallback.color,
    mode: source.mode === "chop" ? "chop" : source.mode === "granular" ? "granular" : fallback.mode,
    muted: Boolean(source.muted),
    solo: Boolean(source.solo),
    volume: Math.max(0, Math.min(1, Number(source.volume) || fallback.volume)),
    reverse: Boolean(source.reverse),
    grainSize: Math.max(20, Math.min(350, Number(source.grainSize) || fallback.grainSize)),
    grainDensity: Math.max(2, Math.min(40, Number(source.grainDensity) || fallback.grainDensity)),
    spray: Math.max(0, Math.min(100, Number(source.spray) || fallback.spray)),
    pitch: Math.max(-12, Math.min(12, Number(source.pitch) || fallback.pitch)),
    chopGate: Math.max(10, Math.min(100, Number(source.chopGate) || fallback.chopGate)),
    sliceCount: Math.max(2, Math.min(16, Number(source.sliceCount) || fallback.sliceCount)),
    pattern: Array.from({ length: 16 }, (_, step) => Boolean(source.pattern?.[step] ?? fallback.pattern[step])),
  };
}

function writeStoredSession() {
  const payload = {
    bpm: state.bpm,
    steps: state.steps,
    selectedTrackIndex: state.selectedTrackIndex,
    sample: {
      regionStart: state.sample.regionStart,
      regionEnd: state.sample.regionEnd,
    },
    tracks: state.tracks.map((track) => ({
      id: track.id,
      color: track.color,
      mode: track.mode,
      muted: track.muted,
      solo: track.solo,
      volume: track.volume,
      reverse: track.reverse,
      grainSize: track.grainSize,
      grainDensity: track.grainDensity,
      spray: track.spray,
      pitch: track.pitch,
      chopGate: track.chopGate,
      sliceCount: track.sliceCount,
      pattern: track.pattern.slice(0, 16),
    })),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    setDiagnostics("settings could not be saved in this browser.", "warn");
  }
}

function applyStoredSession() {
  const stored = readStoredSession();
  if (!stored) return;

  state.bpm = Number.isFinite(stored.bpm) ? Math.max(60, Math.min(180, stored.bpm)) : state.bpm;
  state.steps = Number.isFinite(stored.steps) ? Math.max(8, Math.min(16, stored.steps)) : state.steps;
  state.selectedTrackIndex = Number.isFinite(stored.selectedTrackIndex)
    ? Math.max(0, Math.min(TRACK_COUNT - 1, stored.selectedTrackIndex))
    : 0;

  if (stored.sample) {
    state.sample.setRegion(
      Number.isFinite(stored.sample.regionStart) ? stored.sample.regionStart : 0,
      Number.isFinite(stored.sample.regionEnd) ? stored.sample.regionEnd : 1,
    );
  }

  if (Array.isArray(stored.tracks)) {
    const legacySliceCount = Number.isFinite(stored.sample?.sliceCount) ? Math.max(2, Math.min(16, stored.sample.sliceCount)) : 8;
    state.tracks = Array.from({ length: TRACK_COUNT }, (_, index) =>
      normalizeTrack(index, { ...stored.tracks[index], sliceCount: stored.tracks[index]?.sliceCount ?? legacySliceCount }),
    );
  } else {
    const legacyTrack = normalizeTrack(0, {
      mode: stored.mode,
      reverse: stored.controls?.reverse,
      grainSize: stored.controls?.grainSize,
      grainDensity: stored.controls?.grainDensity,
      spray: stored.controls?.spray,
      pitch: stored.controls?.pitch,
      chopGate: stored.controls?.chopGate,
      sliceCount: stored.sample?.sliceCount,
      pattern: stored.pattern,
    });
    state.tracks = [legacyTrack, ...Array.from({ length: TRACK_COUNT - 1 }, (_, index) => createTrack(index + 2))];
  }
}

function setDiagnostics(message, level = "warn") {
  ui.diagnostics.textContent = `Status: ${message}`;
  ui.diagnostics.className = `diagnostics ${level}`;
}

function hasSoloTrack() {
  return state.tracks.some((track) => track.solo);
}

function isTrackAudible(track) {
  if (track.muted) return false;
  return hasSoloTrack() ? track.solo : true;
}

function ensureAudio() {
  if (!state.audioContext) {
    state.audioContext = createAudioContext();
    state.playback = new PlaybackLayer(state.audioContext, state.sample);
    state.transport = new TransportLayer(state.audioContext, state.playback, state);
    state.transport.onStep = updateCurrentStep;
  }
  return state.audioContext.resume().then(() => {
    setDiagnostics(`audio context running (${state.audioContext.state}).`, "ok");
  });
}

function formatSeconds(seconds) {
  return `${seconds.toFixed(2)}s`;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const normalized = clean.length === 3 ? clean.split("").map((char) => `${char}${char}`).join("") : clean;
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyTrackColor(element, color) {
  element.style.setProperty("--track-color", color);
  element.style.setProperty("--track-color-soft", hexToRgba(color, 0.14));
  element.style.setProperty("--track-color-strong", hexToRgba(color, 0.38));
}

function setTrackIndicator(trackIndex, start, end, durationMs = 180) {
  const indicator = {
    start,
    end,
    token: `${trackIndex}-${performance.now()}`,
  };
  state.trackIndicators[trackIndex] = indicator;
  drawWaveform();
  window.setTimeout(() => {
    if (state.trackIndicators[trackIndex]?.token !== indicator.token) return;
    state.trackIndicators[trackIndex] = null;
    drawWaveform();
  }, durationMs);
}

function indicateTrackPlayback(track, sliceIndex = null) {
  if (!state.sample.buffer) return;
  const trackIndex = track.id - 1;

  if (track.mode === "chop") {
    const slices = state.sample.getSlices(track.sliceCount);
    if (!slices.length) return;
    const resolvedIndex = sliceIndex ?? ((track.id - 1) % slices.length);
    const slice = slices[resolvedIndex % slices.length];
    setTrackIndicator(trackIndex, slice.start, slice.start + slice.duration, 220);
    return;
  }

  const { startTime, endTime } = state.sample.getRegionBounds();
  const regionDuration = Math.max(0.02, endTime - startTime);
  const grainDuration = Math.min(track.grainSize / 1000, regionDuration);
  const position = startTime + Math.random() * Math.max(0.001, regionDuration - grainDuration);
  setTrackIndicator(trackIndex, position, position + grainDuration, 160);
}

function isTransportRunning() {
  return Boolean(state.transport?.intervalId);
}

function syncTransportButton() {
  if (!ui.transportToggle) return;
  ui.transportToggle.textContent = isTransportRunning() ? "Pause" : "Play";
}

function drawWaveform() {
  const canvas = ui.waveform;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const laneHeight = height / TRACK_COUNT;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0, 0, width, height);

  if (!state.sample.buffer) {
    ctx.fillStyle = "rgba(232,242,255,0.65)";
    ctx.font = "18px IBM Plex Sans";
    ctx.fillText("Waveform will appear here after you load a sample.", 32, height / 2);
    return;
  }

  const data = state.sample.buffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const centerY = height / 2;
  const waveformScale = height * 0.36;
  const startX = state.sample.regionStart * width;
  const endX = state.sample.regionEnd * width;

  ctx.fillStyle = "rgba(255, 184, 77, 0.1)";
  ctx.fillRect(startX, 0, endX - startX, height);

  ctx.strokeStyle = "rgba(210, 227, 255, 0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < width; x += 1) {
    let min = 1;
    let max = -1;
    for (let i = 0; i < step; i += 1) {
      const sample = data[x * step + i];
      if (sample === undefined) continue;
      if (sample < min) min = sample;
      if (sample > max) max = sample;
    }
    ctx.moveTo(x, centerY + min * waveformScale);
    ctx.lineTo(x, centerY + max * waveformScale);
  }
  ctx.stroke();

  state.tracks.forEach((track, trackIndex) => {
    const laneTop = laneHeight * trackIndex;
    const laneBottom = laneTop + laneHeight;
    const laneMiddle = laneTop + laneHeight / 2;
    const laneInset = 3;
    const sliceHeight = Math.max(8, laneHeight - laneInset * 2);

    ctx.fillStyle = trackIndex === state.selectedTrackIndex ? hexToRgba(track.color, 0.12) : hexToRgba(track.color, 0.05);
    ctx.fillRect(0, laneTop, width, laneHeight);

    ctx.strokeStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.8 : 0.42);
    ctx.lineWidth = trackIndex === state.selectedTrackIndex ? 1.5 : 1;
    state.sample.getSlices(track.sliceCount).forEach((slice, sliceIndex) => {
      const x = (slice.start / state.sample.buffer.duration) * width;
      ctx.beginPath();
      ctx.moveTo(x, laneTop + laneInset);
      ctx.lineTo(x, laneBottom - laneInset);
      ctx.stroke();

      if (sliceIndex === track.sliceCount - 1) {
        const endMarkerX = ((slice.start + slice.duration) / state.sample.buffer.duration) * width;
        ctx.beginPath();
        ctx.moveTo(endMarkerX, laneTop + laneInset);
        ctx.lineTo(endMarkerX, laneBottom - laneInset);
        ctx.stroke();
      }
    });

    ctx.strokeStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.38 : 0.22);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, laneMiddle);
    ctx.lineTo(endX, laneMiddle);
    ctx.stroke();

    const indicator = state.trackIndicators[trackIndex];
    if (indicator) {
      const indicatorStartX = (indicator.start / state.sample.buffer.duration) * width;
      const indicatorEndX = (indicator.end / state.sample.buffer.duration) * width;
      const indicatorWidth = Math.max(2, indicatorEndX - indicatorStartX);
      ctx.fillStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.3 : 0.18);
      ctx.fillRect(indicatorStartX, laneTop + laneInset, indicatorWidth, sliceHeight);
      ctx.strokeStyle = track.color;
      ctx.lineWidth = trackIndex === state.selectedTrackIndex ? 2 : 1;
      ctx.strokeRect(indicatorStartX, laneTop + laneInset, indicatorWidth, sliceHeight);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, laneBottom);
    ctx.lineTo(width, laneBottom);
    ctx.stroke();

    ctx.fillStyle = track.color;
    ctx.font = "11px IBM Plex Sans";
    ctx.fillText(`${track.name} · ${track.sliceCount}`, 10, laneTop + 14);
  });
}

function updateCurrentStep(activeStep = -1) {
  ui.patternGrid.querySelectorAll(".step").forEach((button) => {
    const stepIndex = Number(button.dataset.stepIndex);
    button.classList.toggle("current", stepIndex === activeStep);
  });
}

function renderTrackSelector() {
  ui.trackSelector.innerHTML = "";
  state.tracks.forEach((track, index) => {
    const chip = document.createElement("div");
    chip.className = `track-chip${index === state.selectedTrackIndex ? " active" : ""}${track.muted ? " muted" : ""}${track.solo ? " soloed" : ""}`;
    applyTrackColor(chip, track.color);

    const selectButton = document.createElement("button");
    selectButton.className = "track-chip-main";
    selectButton.innerHTML = `<span class="track-chip-name">${track.name}</span><span class="track-chip-mode">${track.mode}${track.muted ? " • muted" : track.solo ? " • solo" : ""}</span>`;
    selectButton.addEventListener("click", () => {
      state.selectedTrackIndex = index;
      syncUi();
      renderTrackSelector();
      renderMixer();
      renderPattern();
      drawWaveform();
      writeStoredSession();
    });
    chip.append(selectButton);

    const actions = document.createElement("div");
    actions.className = "track-chip-actions";

    const muteButton = document.createElement("button");
    muteButton.className = `track-mini${track.muted ? " active" : ""}`;
    muteButton.textContent = "M";
    applyTrackColor(muteButton, track.color);
    muteButton.addEventListener("click", () => {
      track.muted = !track.muted;
      if (track.muted) track.solo = false;
      syncUi();
      renderTrackSelector();
      renderMixer();
      renderPattern();
      writeStoredSession();
    });
    actions.append(muteButton);

    const soloButton = document.createElement("button");
    soloButton.className = `track-mini${track.solo ? " active" : ""}`;
    soloButton.textContent = "S";
    applyTrackColor(soloButton, track.color);
    soloButton.addEventListener("click", () => {
      track.solo = !track.solo;
      if (track.solo) track.muted = false;
      syncUi();
      renderTrackSelector();
      renderMixer();
      renderPattern();
      writeStoredSession();
    });
    actions.append(soloButton);

    chip.append(actions);
    ui.trackSelector.append(chip);
  });
}

function renderMixer() {
  ui.mixerGrid.innerHTML = "";
  state.tracks.forEach((track, index) => {
    const strip = document.createElement("div");
    strip.className = `mixer-strip${index === state.selectedTrackIndex ? " active" : ""}`;
    applyTrackColor(strip, track.color);

    const head = document.createElement("div");
    head.className = "mixer-head";
    head.innerHTML = `<span class="mixer-name">${track.name}</span><span class="mixer-value">${Math.round(track.volume * 100)}%</span>`;
    strip.append(head);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";
    slider.value = String(Math.round(track.volume * 100));
    slider.addEventListener("input", () => {
      track.volume = Number(slider.value) / 100;
      renderMixer();
      writeStoredSession();
    });
    strip.append(slider);

    ui.mixerGrid.append(strip);
  });
}

function renderPattern(activeStep = -1) {
  ui.patternGrid.innerHTML = "";
  state.tracks.forEach((track, trackIndex) => {
    const row = document.createElement("div");
    row.className = "pattern-row";

    const label = document.createElement("button");
    label.className = `pattern-row-label${trackIndex === state.selectedTrackIndex ? " active" : ""}`;
    applyTrackColor(label, track.color);
    label.innerHTML = `<span class="pattern-row-name">${track.name}</span><span class="pattern-row-mode">${track.mode}${track.muted ? " • M" : track.solo ? " • S" : ""}</span>`;
    label.addEventListener("click", () => {
      state.selectedTrackIndex = trackIndex;
      syncUi();
      renderTrackSelector();
      renderMixer();
      renderPattern(activeStep);
      drawWaveform();
      writeStoredSession();
    });
    row.append(label);

    track.pattern.slice(0, state.steps).forEach((enabled, stepIndex) => {
      const stepButton = document.createElement("button");
      stepButton.className = `step${enabled ? " active" : ""}`;
      applyTrackColor(stepButton, track.color);
      stepButton.dataset.stepIndex = String(stepIndex);
      stepButton.dataset.trackIndex = String(trackIndex);
      stepButton.textContent = String(stepIndex + 1);
      stepButton.addEventListener("click", () => {
        track.pattern[stepIndex] = !track.pattern[stepIndex];
        stepButton.classList.toggle("active", track.pattern[stepIndex]);
        writeStoredSession();
      });
      row.append(stepButton);
    });

    ui.patternGrid.append(row);
  });
  updateCurrentStep(activeStep);
}

function syncUi() {
  const track = getSelectedTrack();
  ui.sliceCountValue.textContent = String(track.sliceCount);
  ui.mode.value = track.mode;
  ui.grainSize.value = String(track.grainSize);
  ui.grainSizeValue.textContent = String(track.grainSize);
  ui.grainDensity.value = String(track.grainDensity);
  ui.grainDensityValue.textContent = String(track.grainDensity);
  ui.spray.value = String(track.spray);
  ui.sprayValue.textContent = (track.spray / 100).toFixed(2);
  ui.pitch.value = String(track.pitch);
  ui.pitchValue.textContent = String(track.pitch);
  ui.chopGate.value = String(track.chopGate);
  ui.chopGateValue.textContent = `${track.chopGate}%`;
  ui.reverse.checked = track.reverse;
  ui.bpm.value = String(state.bpm);
  ui.bpmValue.textContent = String(state.bpm);
  ui.stepCount.value = String(state.steps);
  ui.stepCountValue.textContent = String(state.steps);
  syncTransportButton();
  ui.regionStart.value = String(Math.round(state.sample.regionStart * 1000));
  ui.regionEnd.value = String(Math.round(state.sample.regionEnd * 1000));
  ui.sliceCount.value = String(track.sliceCount);

  if (state.sample.buffer) {
    const region = state.sample.getRegionBounds();
    ui.sampleStatus.textContent = `${state.sample.buffer.duration.toFixed(2)}s loaded, region ${formatSeconds(
      region.startTime,
    )} to ${formatSeconds(region.endTime)}.`;
  } else {
    ui.sampleStatus.textContent = "Load an audio file to begin.";
  }
}

function updateSelectedTrack(patch) {
  Object.assign(getSelectedTrack(), patch);
  syncUi();
  renderTrackSelector();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

if (ui.audioToggle) {
  ui.audioToggle.addEventListener("click", async () => {
    try {
      await ensureAudio();
      ui.audioToggle.textContent = "Audio Ready";
    } catch (error) {
      setDiagnostics(`audio start failed: ${error.message}`, "error");
    }
  });
}

ui.sampleInput.addEventListener("change", async (event) => {
  const [file] = event.target.files ?? [];
  if (!file) return;
  try {
    await ensureAudio();
    setDiagnostics(`loading ${file.name}...`, "warn");
    const restoredStart = state.sample.regionStart;
    const restoredEnd = state.sample.regionEnd;
    await state.sample.loadFile(file, state.audioContext);
    state.sample.setRegion(restoredStart, restoredEnd);
    syncUi();
    drawWaveform();
    renderPattern();
    writeStoredSession();

    const previewPlayed = state.playback.triggerTrack(getSelectedTrack());
    indicateTrackPlayback(getSelectedTrack());
    setDiagnostics(
      previewPlayed ? `loaded ${file.name} and previewed ${getSelectedTrack().name}.` : `loaded ${file.name}, but preview playback failed.`,
      previewPlayed ? "ok" : "error",
    );
  } catch (error) {
    setDiagnostics(`load failed for ${file.name}: ${error.message}`, "error");
    ui.sampleStatus.textContent = "This file could not be decoded by the browser.";
  }
});

ui.regionStart.addEventListener("input", () => {
  state.sample.setRegion(Number(ui.regionStart.value) / 1000, Number(ui.regionEnd.value) / 1000);
  syncUi();
  drawWaveform();
  writeStoredSession();
});

ui.regionEnd.addEventListener("input", () => {
  state.sample.setRegion(Number(ui.regionStart.value) / 1000, Number(ui.regionEnd.value) / 1000);
  syncUi();
  drawWaveform();
  writeStoredSession();
});

ui.sliceCount.addEventListener("input", () => {
  updateSelectedTrack({ sliceCount: Number(ui.sliceCount.value) });
});

ui.randomizePattern.addEventListener("click", () => {
  const track = getSelectedTrack();
  track.pattern = Array.from({ length: 16 }, (_, index) => index < state.steps && Math.random() > 0.45);
  renderPattern();
  writeStoredSession();
});

ui.mode.addEventListener("change", () => updateSelectedTrack({ mode: ui.mode.value }));
ui.bpm.addEventListener("input", () => {
  state.bpm = Number(ui.bpm.value);
  syncUi();
  writeStoredSession();
});
ui.stepCount.addEventListener("input", () => {
  state.steps = Number(ui.stepCount.value);
  syncUi();
  renderPattern();
  writeStoredSession();
});
ui.grainSize.addEventListener("input", () => updateSelectedTrack({ grainSize: Number(ui.grainSize.value) }));
ui.grainDensity.addEventListener("input", () => updateSelectedTrack({ grainDensity: Number(ui.grainDensity.value) }));
ui.spray.addEventListener("input", () => updateSelectedTrack({ spray: Number(ui.spray.value) }));
ui.pitch.addEventListener("input", () => updateSelectedTrack({ pitch: Number(ui.pitch.value) }));
ui.chopGate.addEventListener("input", () => updateSelectedTrack({ chopGate: Number(ui.chopGate.value) }));
ui.reverse.addEventListener("change", () => updateSelectedTrack({ reverse: ui.reverse.checked }));

ui.triggerNow.addEventListener("click", async () => {
  try {
    await ensureAudio();
    if (!state.sample.buffer) {
      setDiagnostics("no sample loaded yet.", "warn");
      return;
    }
    const track = getSelectedTrack();
    if (!isTrackAudible(track)) {
      setDiagnostics(`${track.name} is ${track.muted ? "muted" : "not soloed"}.`, "warn");
      return;
    }
    indicateTrackPlayback(track);
    const played = state.playback.triggerTrack(track);
    setDiagnostics(played ? `${track.name} triggered.` : `${track.name} failed to schedule playback.`, played ? "ok" : "error");
  } catch (error) {
    setDiagnostics(`trigger failed: ${error.message}`, "error");
  }
});

ui.transportToggle.addEventListener("click", async () => {
  try {
    await ensureAudio();
    if (isTransportRunning()) {
      state.transport.stop();
      syncTransportButton();
      setDiagnostics("sequence paused.", "warn");
      return;
    }
    if (!state.sample.buffer) {
      setDiagnostics("load a sample before starting the sequence.", "warn");
      return;
    }
    state.transport.start();
    syncTransportButton();
    setDiagnostics(`sequence running at ${state.bpm} BPM across ${TRACK_COUNT} tracks.`, "ok");
  } catch (error) {
    setDiagnostics(`transport failed: ${error.message}`, "error");
  }
});

window.addEventListener("keydown", async (event) => {
  if (event.code !== "Space") return;
  event.preventDefault();
  try {
    await ensureAudio();
    if (!state.sample.buffer) {
      setDiagnostics("space trigger ignored because no sample is loaded.", "warn");
      return;
    }
    const track = getSelectedTrack();
    if (!isTrackAudible(track)) {
      setDiagnostics(`${track.name} is ${track.muted ? "muted" : "not soloed"}.`, "warn");
      return;
    }
    indicateTrackPlayback(track);
    state.playback.triggerTrack(track);
  } catch (error) {
    setDiagnostics(`keyboard trigger failed: ${error.message}`, "error");
  }
});

applyStoredSession();
syncTransportButton();
syncUi();
drawWaveform();
renderTrackSelector();
renderMixer();
renderPattern();
