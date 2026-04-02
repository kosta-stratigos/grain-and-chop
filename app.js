const ui = {
  audioToggle: document.querySelector("#audio-toggle"),
  sampleInput: document.querySelector("#sample-input"),
  sampleBrowserToggle: document.querySelector("#sample-browser-toggle"),
  sampleBrowserOverlay: document.querySelector("#sample-browser-overlay"),
  sampleBrowserClose: document.querySelector("#sample-browser-close"),
  sampleBrowserInput: document.querySelector("#sample-browser-input"),
  sampleLibraryList: document.querySelector("#sample-library-list"),
  sampleStatus: document.querySelector("#sample-status"),
  diagnostics: document.querySelector("#diagnostics"),
  waveform: document.querySelector("#waveform"),
  waveformOverview: document.querySelector("#waveform-overview"),
  regionStart: document.querySelector("#region-start"),
  regionEnd: document.querySelector("#region-end"),
  sliceCount: document.querySelector("#slice-count"),
  sliceCountValue: document.querySelector("#slice-count-value"),
  randomizePattern: document.querySelector("#randomize-pattern"),
  fillDensity: document.querySelector("#fill-density"),
  fillDensityValue: document.querySelector("#fill-density-value"),
  trackSelector: document.querySelector("#track-selector"),
  mode: document.querySelector("#mode"),
  grainLocation: document.querySelector("#grain-location"),
  voicePlacementField: document.querySelector("#voice-placement-field"),
  voicePlacement: document.querySelector("#voice-placement"),
  voicePlacementValue: document.querySelector("#voice-placement-value"),
  voicePlaybackMode: document.querySelector("#voice-playback-mode"),
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
  effectsMatrix: document.querySelector("#effects-matrix"),
  filterOverlay: document.querySelector("#filter-overlay"),
  filterOverlayTrack: document.querySelector("#filter-overlay-track"),
  filterOverlayClose: document.querySelector("#filter-overlay-close"),
  filterFrequency: document.querySelector("#filter-frequency"),
  filterFrequencyValue: document.querySelector("#filter-frequency-value"),
  filterQ: document.querySelector("#filter-q"),
  filterQValue: document.querySelector("#filter-q-value"),
  filterTypeRadios: Array.from(document.querySelectorAll('input[name="filter-type"]')),
  bpm: document.querySelector("#bpm"),
  bpmValue: document.querySelector("#bpm-value"),
  swing: document.querySelector("#swing"),
  swingValue: document.querySelector("#swing-value"),
  trackRate: document.querySelector("#track-rate"),
  transportToggle: document.querySelector("#transport-toggle"),
  mixVolume: document.querySelector("#mix-volume"),
  mixVolumeValue: document.querySelector("#mix-volume-value"),
  mixerGrid: document.querySelector("#mixer-grid"),
  patternGrid: document.querySelector("#pattern-grid"),
};

const STORAGE_KEY = "granular-chop-lab:session";
const DEFAULT_SAMPLE_URL = "./samples/95721__elankford__pump-organ-mid-c.wav";
const DEFAULT_SAMPLE_NAME = "95721__elankford__pump-organ-mid-c.wav";
const SAMPLE_LIBRARY = [
  { name: "bird_singing_-_amsel_-_blackbird_1_z9i.wav", url: "./samples/bird_singing_-_amsel_-_blackbird_1_z9i.wav" },
  { name: "orthodox_priest_singing_1_r8j.wav", url: "./samples/orthodox_priest_singing_1_r8j.wav" },
  { name: "95721__elankford__pump-organ-mid-c.wav", url: "./samples/95721__elankford__pump-organ-mid-c.wav" },
];
const BASE_GRID_STEPS = 32;
const MAX_PATTERN_CELLS = 32;
const TRACK_COUNT = 4;
const TRACK_COLORS = ["#59d0ff", "#ff8f5a", "#8dff7a", "#ffd34d"];
const TRACK_RATE_SPANS = { "1/1": 32, "1/2": 16, "1/4": 8, "1/8": 4, "1/16": 2, "1/32": 1 };
const TRACK_RATE_VALUES = Object.keys(TRACK_RATE_SPANS);
const EFFECT_KEYS = ["filter"];
const FILTER_TYPES = ["lowpass", "bandpass", "highpass"];

function clampFilterFrequency(value) {
  return Math.max(20, Math.min(16000, Number(value) || 1200));
}

function clampFilterQ(value) {
  return Math.max(0.1, Math.min(20, Number(value) || 0.8));
}

function createDefaultFilterSettings() {
  return {
    enabled: false,
    type: "lowpass",
    frequency: 1200,
    q: 0.8,
  };
}

function normalizeFilterSettings(source = {}, fallback = createDefaultFilterSettings()) {
  return {
    enabled: Boolean(source.enabled),
    type: FILTER_TYPES.includes(source.type) ? source.type : fallback.type,
    frequency: clampFilterFrequency(source.frequency ?? fallback.frequency),
    q: clampFilterQ(source.q ?? fallback.q),
  };
}

function createTrackEffects(source = {}) {
  return {
    filter: normalizeFilterSettings(source.filter),
  };
}

class SampleLayer {
  constructor() {
    this.buffer = null;
    this.reversedBuffer = null;
    this.regionStart = 0;
    this.regionEnd = 1;
  }

  async loadFile(file, audioContext) {
    return this.loadArrayBuffer(await file.arrayBuffer(), audioContext);
  }

  async loadArrayBuffer(data, audioContext) {
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

  createVoice({
    when,
    offset,
    duration,
    rate,
    reverse = false,
    attack = 0.01,
    release = 0.02,
    level = 1,
    loop = false,
    loopStart = 0,
    loopEnd = 0,
    sustainDuration = null,
    filter = null,
  }) {
    const baseBuffer = this.sampleLayer.buffer;
    const buffer = reverse ? this.sampleLayer.reversedBuffer : baseBuffer;
    if (!buffer) return false;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;

    const safeDuration = Math.max(0.02, Math.min(duration, buffer.duration));
    const maxOffset = Math.max(0, buffer.duration - safeDuration);

    const gainNode = this.audioContext.createGain();
    const holdDuration = loop ? Math.max(safeDuration, sustainDuration ?? safeDuration) : safeDuration;
    gainNode.gain.setValueAtTime(0.0001, when);
    gainNode.gain.linearRampToValueAtTime(0.75 * level, when + attack);
    gainNode.gain.setValueAtTime(0.75 * level, when + holdDuration);
    gainNode.gain.linearRampToValueAtTime(0.0001, when + holdDuration + release);

    if (filter?.enabled) {
      const filterNode = this.audioContext.createBiquadFilter();
      filterNode.type = filter.type;
      filterNode.frequency.setValueAtTime(clampFilterFrequency(filter.frequency), when);
      filterNode.Q.setValueAtTime(clampFilterQ(filter.q), when);
      source.connect(filterNode);
      filterNode.connect(gainNode);
    } else {
      source.connect(gainNode);
    }
    gainNode.connect(this.output);
    const intendedOffset = reverse ? buffer.duration - offset - safeDuration : offset;
    const playbackOffset = Math.max(0, Math.min(maxOffset, intendedOffset));
    if (loop) {
      source.loop = true;
      const loopRegionStart = reverse ? buffer.duration - loopEnd : loopStart;
      const loopRegionEnd = reverse ? buffer.duration - loopStart : loopEnd;
      source.loopStart = Math.max(0, Math.min(buffer.duration - 0.01, loopRegionStart));
      source.loopEnd = Math.max(source.loopStart + 0.01, Math.min(buffer.duration, loopRegionEnd));
      source.start(when, playbackOffset);
      source.stop(when + holdDuration + release);
      return true;
    }
    source.start(when, playbackOffset, safeDuration);
    source.stop(when + safeDuration + release);
    return true;
  }

  triggerGranular(settings, when = this.audioContext.currentTime, sliceIndex = null, noteDuration = 0.1) {
    const buffer = this.sampleLayer.buffer;
    if (!buffer) return false;

    const { startTime, endTime } = this.sampleLayer.getRegionBounds();
    const rate = 2 ** (settings.pitch / 12);
    const regionDuration = Math.max(0.02, endTime - startTime);
    const grainDuration = Math.min(settings.grainSizeMs / 1000, regionDuration);
    const grainCount = Math.max(1, Math.round(settings.density * 0.35));
    const slices = this.sampleLayer.getSlices(settings.sliceCount);
    const resolvedSliceIndex = sliceIndex
      ?? (settings.grainLocation === "random" && slices.length ? Math.floor(Math.random() * slices.length) : 0);
    const anchorSlice = slices.length ? slices[resolvedSliceIndex % slices.length] : null;
    const fixedStart = startTime + Math.max(0, regionDuration - grainDuration) * ((settings.voicePlacement ?? 50) / 100);
    const sliceStart = settings.grainLocation === "fixed" ? fixedStart : (anchorSlice?.start ?? startTime);
    const sliceEnd = settings.grainLocation === "fixed" ? Math.min(endTime, sliceStart + grainDuration) : (anchorSlice ? anchorSlice.start + anchorSlice.duration : endTime);
    const maxPosition = Math.max(sliceStart, Math.min(endTime - grainDuration, sliceEnd - grainDuration));
    const loopPosition = Math.max(startTime, Math.min(maxPosition, sliceStart));

    if (settings.voicePlaybackMode && settings.voicePlaybackMode !== "one-shot") {
      const smoothLoop = settings.voicePlaybackMode === "smooth-loop";
      return this.createVoice({
        when,
        offset: Math.max(0, loopPosition),
        duration: Math.min(grainDuration, buffer.duration - loopPosition),
        rate,
        reverse: settings.reverse,
        filter: settings.filter,
        attack: smoothLoop ? Math.min(0.02, grainDuration * 0.2) : 0.002,
        release: smoothLoop ? Math.min(0.03, grainDuration * 0.28) : 0.004,
        level: settings.level ?? 1,
        loop: true,
        loopStart: loopPosition,
        loopEnd: Math.min(endTime, loopPosition + grainDuration),
        sustainDuration: Math.max(grainDuration, noteDuration),
      });
    }

    let triggered = false;
    for (let index = 0; index < grainCount; index += 1) {
      const jitter = settings.grainLocation === "fixed" ? 0 : (Math.random() * 2 - 1) * settings.spray;
      const position = Math.max(startTime, Math.min(maxPosition, sliceStart + jitter));
      triggered =
        this.createVoice({
          when: when + index * (1 / Math.max(1, settings.density)),
          offset: Math.max(0, position),
          duration: Math.min(grainDuration, buffer.duration - position),
          rate,
          reverse: settings.reverse,
          filter: settings.filter,
          attack: grainDuration * 0.2,
          release: grainDuration * 0.35,
          level: settings.level ?? 1,
        }) || triggered;
    }

    return triggered;
  }

  triggerSlice(track, when = this.audioContext.currentTime, sliceIndex = null, noteDuration = 0.1) {
    const slices = this.sampleLayer.getSlices(track.sliceCount);
    if (!slices.length) return false;
    const index = sliceIndex ?? (track.id - 1) % slices.length;
    const slice = slices[index % slices.length];
    const rate = 2 ** (track.pitch / 12);
    const { startTime, endTime } = this.sampleLayer.getRegionBounds();
    const baseSliceDuration = Math.max(0.03, slice.duration * (track.chopGate / 100));
    const placementOffset = startTime + Math.max(0, endTime - startTime - baseSliceDuration) * ((track.voicePlacement ?? 50) / 100);
    const offset = track.grainLocation === "fixed" ? placementOffset : slice.start;
    if (track.voicePlaybackMode && track.voicePlaybackMode !== "one-shot") {
      const smoothLoop = track.voicePlaybackMode === "smooth-loop";
      return this.createVoice({
        when,
        offset,
        duration: Math.max(0.03, Math.min(baseSliceDuration, endTime - offset)),
        rate,
        reverse: track.reverse,
        filter: track.effects.filter,
        attack: smoothLoop ? 0.01 : 0.002,
        release: smoothLoop ? 0.02 : 0.004,
        level: track.volume,
        loop: true,
        loopStart: offset,
        loopEnd: Math.min(endTime, offset + baseSliceDuration),
        sustainDuration: Math.max(baseSliceDuration, noteDuration),
      });
    }
    return this.createVoice({
      when,
      offset,
      duration: Math.max(0.03, Math.min(baseSliceDuration, endTime - offset)),
      rate,
      reverse: track.reverse,
      filter: track.effects.filter,
      attack: 0.004,
      release: 0.03,
      level: track.volume,
    });
  }

  triggerTrack(track, when = this.audioContext.currentTime, sliceIndex = null, noteDuration = null) {
    if (track.mode === "granular") {
      return this.triggerGranular(
        {
          grainSizeMs: track.grainSize,
          density: track.grainDensity,
          spray: track.spray / 100,
          pitch: track.pitch,
          reverse: track.reverse,
          level: track.volume,
          sliceCount: track.sliceCount,
          grainLocation: track.grainLocation,
          voicePlacement: track.voicePlacement,
          voicePlaybackMode: track.voicePlaybackMode,
          filter: track.effects.filter,
        },
        when,
        sliceIndex,
        noteDuration,
      );
    }
    return this.triggerSlice(track, when, sliceIndex, noteDuration);
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
    resetTrackPlaybackState();
    this.nextStepTime = this.audioContext.currentTime + 0.03;
    this.intervalId = window.setInterval(() => this.tick(), this.lookaheadMs);
  }

  stop() {
    window.clearInterval(this.intervalId);
    this.intervalId = null;
    this.currentStep = 0;
    resetTrackPlaybackState();
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
      const rateSpan = getTrackRateSpan(track);
      if (stepIndex % rateSpan !== 0) return;
      const cellIndex = getTrackCellIndexAtBaseStep(track, stepIndex);
      if (!track.pattern[cellIndex]) return;
      if (!isTrackAudible(track)) return;
      const sliceIndex = resolvePlaybackSliceIndex(track, { advance: true });
      const noteDuration = getTrackTriggerDuration(track);
      indicateTrackPlayback(track, sliceIndex);
      this.playbackLayer.triggerTrack(track, when, sliceIndex, noteDuration);
    });
  }

  advance() {
    const baseStepDuration = 60 / this.state.bpm / 8;
    const swingFactor = (this.state.swing / 100) * 0.5;
    const sixteenthIndex = Math.floor(this.currentStep / 2);
    const isOffbeatSixteenth = sixteenthIndex % 2 === 1;
    const stepDuration = baseStepDuration * (isOffbeatSixteenth ? 1 - swingFactor : 1 + swingFactor);
    this.nextStepTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % BASE_GRID_STEPS;
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
    grainLocation: "fixed",
    voicePlacement: 50,
    voicePlaybackMode: "one-shot",
    effects: createTrackEffects(),
    grainSize: 110,
    grainDensity: 12,
    spray: 18,
    pitch: 0,
    chopGate: 70,
    sliceCount: 8,
    rate: "1/16",
    pattern: Array.from({ length: MAX_PATTERN_CELLS }, (_, index) => (index + id - 1) % 4 === 0),
  };
}

const state = {
  audioContext: null,
  sample: new SampleLayer(),
  playback: null,
  transport: null,
  bpm: 112,
  swing: 0,
  steps: BASE_GRID_STEPS,
  selectedTrackIndex: 0,
  tracks: Array.from({ length: TRACK_COUNT }, (_, index) => createTrack(index + 1)),
  trackPlaybackState: Array.from({ length: TRACK_COUNT }, () => ({ sequentialIndex: 0, sweepIndex: 0, sweepDirection: 1 })),
  trackIndicators: Array.from({ length: TRACK_COUNT }, () => null),
  sampleBrowserOpen: false,
  overviewDrag: {
    active: false,
    pointerId: null,
    offset: 0,
    width: 1,
  },
  filterOverlay: {
    open: false,
    trackIndex: 0,
    effectKey: "filter",
  },
  defaultSampleLoaded: false,
  defaultSampleLoadPromise: null,
  sampleLoading: false,
  sampleLoadingDots: 1,
  sampleLoadingIntervalId: null,
  currentSampleName: "",
  fillDensity: 50,
  mixVolume: 0.9,
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

function resetTrackPlaybackState(trackIndex = null) {
  if (Number.isInteger(trackIndex)) {
    state.trackPlaybackState[trackIndex] = { sequentialIndex: 0, sweepIndex: 0, sweepDirection: 1 };
    drawWaveformOverview();
    return;
  }

  state.trackPlaybackState = Array.from({ length: TRACK_COUNT }, () => ({ sequentialIndex: 0, sweepIndex: 0, sweepDirection: 1 }));
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
    grainLocation: ["fixed", "sequential", "sweep", "random"].includes(source.grainLocation) ? source.grainLocation : fallback.grainLocation,
    voicePlacement: Math.max(0, Math.min(100, Number(source.voicePlacement) || fallback.voicePlacement)),
    voicePlaybackMode: ["one-shot", "loop", "smooth-loop"].includes(source.voicePlaybackMode) ? source.voicePlaybackMode : fallback.voicePlaybackMode,
    effects: {
      filter: normalizeFilterSettings(source.effects?.filter ?? source.filter ?? fallback.effects.filter, fallback.effects.filter),
    },
    rate: TRACK_RATE_VALUES.includes(source.rate) ? source.rate : fallback.rate,
    grainSize: Math.max(20, Math.min(350, Number(source.grainSize) || fallback.grainSize)),
    grainDensity: Math.max(2, Math.min(40, Number(source.grainDensity) || fallback.grainDensity)),
    spray: Math.max(0, Math.min(100, Number(source.spray) || fallback.spray)),
    pitch: Math.max(-24, Math.min(24, Number(source.pitch) || fallback.pitch)),
    chopGate: Math.max(10, Math.min(100, Number(source.chopGate) || fallback.chopGate)),
    sliceCount: Math.max(2, Math.min(16, Number(source.sliceCount) || fallback.sliceCount)),
    pattern: Array.from({ length: MAX_PATTERN_CELLS }, (_, step) => Boolean(source.pattern?.[step] ?? fallback.pattern[step])),
  };
}

function writeStoredSession() {
  const payload = {
    bpm: state.bpm,
    swing: state.swing,
    steps: state.steps,
    selectedTrackIndex: state.selectedTrackIndex,
    fillDensity: state.fillDensity,
    mixVolume: state.mixVolume,
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
      grainLocation: track.grainLocation,
      voicePlacement: track.voicePlacement,
      voicePlaybackMode: track.voicePlaybackMode,
      effects: {
        filter: { ...track.effects.filter },
      },
      rate: track.rate,
      grainSize: track.grainSize,
      grainDensity: track.grainDensity,
      spray: track.spray,
      pitch: track.pitch,
      chopGate: track.chopGate,
      sliceCount: track.sliceCount,
      pattern: track.pattern.slice(0, MAX_PATTERN_CELLS),
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
  state.swing = Number.isFinite(stored.swing) ? Math.max(0, Math.min(100, stored.swing)) : state.swing;
  state.steps = BASE_GRID_STEPS;
  state.selectedTrackIndex = Number.isFinite(stored.selectedTrackIndex)
    ? Math.max(0, Math.min(TRACK_COUNT - 1, stored.selectedTrackIndex))
    : 0;
  state.fillDensity = Number.isFinite(stored.fillDensity) ? Math.max(0, Math.min(100, stored.fillDensity)) : state.fillDensity;
  state.mixVolume = Number.isFinite(stored.mixVolume) ? Math.max(0, Math.min(1, stored.mixVolume)) : state.mixVolume;

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
      grainLocation: stored.controls?.grainLocation,
      voicePlacement: stored.controls?.voicePlacement,
      voicePlaybackMode: stored.controls?.voicePlaybackMode,
      rate: stored.controls?.rate,
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
  if (!ui.diagnostics) return;
  ui.diagnostics.textContent = `Status: ${message}`;
  ui.diagnostics.className = `diagnostics ${level}`;
}

function syncSampleLoadingAnimation() {
  if (state.sampleLoading) {
    if (state.sampleLoadingIntervalId) return;
    state.sampleLoadingIntervalId = window.setInterval(() => {
      state.sampleLoadingDots = (state.sampleLoadingDots % 3) + 1;
      if (!state.sample.buffer) drawWaveform();
    }, 400);
    return;
  }

  if (state.sampleLoadingIntervalId) {
    window.clearInterval(state.sampleLoadingIntervalId);
    state.sampleLoadingIntervalId = null;
  }
  state.sampleLoadingDots = 1;
}

function hasSoloTrack() {
  return state.tracks.some((track) => track.solo);
}

function isTrackAudible(track) {
  if (track.muted) return false;
  return hasSoloTrack() ? track.solo : true;
}

async function loadDefaultSample() {
  if (state.defaultSampleLoaded || state.sample.buffer) return;
  if (state.defaultSampleLoadPromise) return state.defaultSampleLoadPromise;

  state.defaultSampleLoadPromise = (async () => {
    try {
      if (!state.audioContext) {
        state.audioContext = createAudioContext();
        state.playback = new PlaybackLayer(state.audioContext, state.sample);
        state.transport = new TransportLayer(state.audioContext, state.playback, state);
        state.transport.onStep = updateCurrentStep;
        state.playback.output.gain.value = state.mixVolume;
      }

      await loadSampleSource(async () => {
        const response = await fetch(DEFAULT_SAMPLE_URL);
        if (!response.ok) throw new Error(`request failed (${response.status})`);
        const data = await response.arrayBuffer();
        await state.sample.loadArrayBuffer(data, state.audioContext);
      }, DEFAULT_SAMPLE_NAME, { preview: false });
    } catch (error) {
      console.error(`Default sample load failed: ${error.message}`);
    } finally {
      state.defaultSampleLoadPromise = null;
    }
  })();

  return state.defaultSampleLoadPromise;
}

function ensureAudio() {
  if (!state.audioContext) {
    state.audioContext = createAudioContext();
    state.playback = new PlaybackLayer(state.audioContext, state.sample);
    state.transport = new TransportLayer(state.audioContext, state.playback, state);
    state.transport.onStep = updateCurrentStep;
    state.playback.output.gain.value = state.mixVolume;
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

function formatModeLabel(mode) {
  return mode === "granular" ? "grain" : mode;
}

function formatFilterTypeLabel(type) {
  if (type === "highpass") return "HP";
  if (type === "bandpass") return "BP";
  return "LP";
}

function formatFilterFrequency(value) {
  const safeValue = clampFilterFrequency(value);
  return safeValue >= 1000 ? `${(safeValue / 1000).toFixed(2)} kHz` : `${Math.round(safeValue)} Hz`;
}

function formatFilterQ(value) {
  return clampFilterQ(value).toFixed(1);
}

function getTrackRateSpan(track) {
  return TRACK_RATE_SPANS[track.rate] ?? TRACK_RATE_SPANS["1/16"];
}

function getTrackVisibleCellCount(track) {
  return Math.max(1, BASE_GRID_STEPS / getTrackRateSpan(track));
}

function getTrackCellIndexAtBaseStep(track, baseStep) {
  return Math.floor(baseStep / getTrackRateSpan(track));
}

function getTrackTriggerDuration(track) {
  return getTrackRateSpan(track) * (60 / state.bpm / 8);
}

function resolvePlaybackSliceIndex(track, { advance = false } = {}) {
  const maxSliceIndex = Math.max(0, track.sliceCount - 1);
  const playbackState = state.trackPlaybackState[track.id - 1] ?? { sequentialIndex: 0, sweepIndex: 0, sweepDirection: 1 };

  if (track.grainLocation === "fixed") return 0;
  if (track.grainLocation === "random") return Math.floor(Math.random() * (maxSliceIndex + 1));

  if (track.grainLocation === "sequential") {
    const index = Math.max(0, Math.min(maxSliceIndex, playbackState.sequentialIndex));
    if (advance) playbackState.sequentialIndex = maxSliceIndex > 0 ? (index + 1) % (maxSliceIndex + 1) : 0;
    state.trackPlaybackState[track.id - 1] = playbackState;
    return index;
  }

  const index = Math.max(0, Math.min(maxSliceIndex, playbackState.sweepIndex));
  if (advance && maxSliceIndex > 0) {
    if (index >= maxSliceIndex) playbackState.sweepDirection = -1;
    else if (index <= 0) playbackState.sweepDirection = 1;

    playbackState.sweepIndex = index + playbackState.sweepDirection;
    if (playbackState.sweepIndex < 0) {
      playbackState.sweepIndex = 1;
      playbackState.sweepDirection = 1;
    } else if (playbackState.sweepIndex > maxSliceIndex) {
      playbackState.sweepIndex = Math.max(0, maxSliceIndex - 1);
      playbackState.sweepDirection = -1;
    }
  }
  state.trackPlaybackState[track.id - 1] = playbackState;
  return index;
}

function resolveGrainWindow(track, sliceIndex = null) {
  const { startTime, endTime } = state.sample.getRegionBounds();
  const regionDuration = Math.max(0.02, endTime - startTime);
  const grainDuration = Math.min(track.grainSize / 1000, regionDuration);
  const slices = state.sample.getSlices(track.sliceCount);
  const resolvedSliceIndex = sliceIndex
    ?? (track.grainLocation === "random" && slices.length ? Math.floor(Math.random() * slices.length) : 0);
  const anchorSlice = slices.length ? slices[resolvedSliceIndex % slices.length] : null;
  const fixedStart = startTime + Math.max(0, regionDuration - grainDuration) * ((track.voicePlacement ?? 50) / 100);
  const sliceStart = track.grainLocation === "fixed" ? fixedStart : (anchorSlice?.start ?? startTime);
  const sliceEnd = track.grainLocation === "fixed" ? Math.min(endTime, sliceStart + grainDuration) : (anchorSlice ? anchorSlice.start + anchorSlice.duration : endTime);
  const maxPosition = Math.max(sliceStart, Math.min(endTime - grainDuration, sliceEnd - grainDuration));
  const anchoredPosition = Math.max(startTime, Math.min(maxPosition, sliceStart));

  return {
    start: anchoredPosition,
    end: Math.min(endTime, anchoredPosition + grainDuration),
    grainDuration,
    startTime,
    endTime,
    anchorSlice,
    regionDuration,
  };
}

function applyTrackColor(element, color) {
  element.style.setProperty("--track-color", color);
  element.style.setProperty("--track-color-soft", hexToRgba(color, 0.14));
  element.style.setProperty("--track-color-strong", hexToRgba(color, 0.38));
}

function getTrackFilter(trackOrIndex) {
  const track = Number.isInteger(trackOrIndex) ? state.tracks[trackOrIndex] : trackOrIndex;
  return track?.effects?.filter ?? createDefaultFilterSettings();
}

function syncFilterOverlay() {
  if (!ui.filterOverlay) return;
  const isOpen = state.filterOverlay.open;
  ui.filterOverlay.classList.toggle("is-hidden", !isOpen);
  ui.filterOverlay.setAttribute("aria-hidden", String(!isOpen));
  if (!isOpen) return;

  const track = state.tracks[state.filterOverlay.trackIndex] ?? getSelectedTrack();
  const filter = getTrackFilter(track);
  if (ui.filterOverlayTrack) {
    ui.filterOverlayTrack.textContent = `${track.name} • Filter ${filter.enabled ? "enabled" : "disabled"}`;
  }
  ui.filterFrequency.value = String(Math.round(filter.frequency));
  ui.filterFrequencyValue.textContent = formatFilterFrequency(filter.frequency);
  ui.filterQ.value = String(filter.q);
  ui.filterQValue.textContent = formatFilterQ(filter.q);
  ui.filterTypeRadios.forEach((radio) => {
    radio.checked = radio.value === filter.type;
  });
}

function syncSampleBrowserOverlay() {
  if (!ui.sampleBrowserOverlay) return;
  ui.sampleBrowserOverlay.classList.toggle("is-hidden", !state.sampleBrowserOpen);
  ui.sampleBrowserOverlay.setAttribute("aria-hidden", String(!state.sampleBrowserOpen));
}

function openSampleBrowser() {
  state.sampleBrowserOpen = true;
  syncSampleBrowserOverlay();
}

function closeSampleBrowser() {
  state.sampleBrowserOpen = false;
  syncSampleBrowserOverlay();
}

async function loadSampleSource(loader, sampleName, { preview = true } = {}) {
  try {
    state.sampleLoading = true;
    syncSampleLoadingAnimation();
    drawWaveform();
    await ensureAudio();
    setDiagnostics(`loading ${sampleName}...`, "warn");
    const restoredStart = state.sample.regionStart;
    const restoredEnd = state.sample.regionEnd;
    await loader();
    state.defaultSampleLoaded = true;
    state.currentSampleName = sampleName;
    state.sample.setRegion(restoredStart, restoredEnd);
    syncUi();
    drawWaveform();
    renderPattern();
    writeStoredSession();

    if (preview) {
      const previewPlayed = state.playback.triggerTrack(getSelectedTrack(), undefined, null, getTrackTriggerDuration(getSelectedTrack()));
      indicateTrackPlayback(getSelectedTrack());
      setDiagnostics(
        previewPlayed ? `loaded ${sampleName} and previewed ${getSelectedTrack().name}.` : `loaded ${sampleName}, but preview playback failed.`,
        previewPlayed ? "ok" : "error",
      );
    } else {
      setDiagnostics(`loaded ${sampleName}.`, "ok");
    }
    return true;
  } catch (error) {
    setDiagnostics(`load failed for ${sampleName}: ${error.message}`, "error");
    if (ui.sampleStatus) ui.sampleStatus.textContent = "This file could not be decoded by the browser.";
    return false;
  } finally {
    state.sampleLoading = false;
    syncSampleLoadingAnimation();
    drawWaveform();
  }
}

async function loadSampleFromLibrary(sampleEntry) {
  if (!sampleEntry) return;
  const loaded = await loadSampleSource(async () => {
    const response = await fetch(sampleEntry.url);
    if (!response.ok) throw new Error(`request failed (${response.status})`);
    const data = await response.arrayBuffer();
    await state.sample.loadArrayBuffer(data, state.audioContext);
  }, sampleEntry.name);
  if (loaded) closeSampleBrowser();
}

async function loadSampleFromFile(file) {
  if (!file) return;
  const loaded = await loadSampleSource(() => state.sample.loadFile(file, state.audioContext), file.name);
  if (loaded) closeSampleBrowser();
}

function renderSampleLibrary() {
  if (!ui.sampleLibraryList) return;
  ui.sampleLibraryList.innerHTML = "";
  SAMPLE_LIBRARY.forEach((sampleEntry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sample-library-item";
    button.textContent = sampleEntry.name;
    button.addEventListener("click", () => {
      loadSampleFromLibrary(sampleEntry);
    });
    ui.sampleLibraryList.append(button);
  });
}

function getOverviewPointerState(clientX) {
  const canvas = ui.waveformOverview;
  if (!canvas || !state.sample.buffer) return null;
  const rect = canvas.getBoundingClientRect();
  const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
  const normalized = rect.width > 0 ? relativeX / rect.width : 0;
  const regionStart = state.sample.regionStart;
  const regionEnd = state.sample.regionEnd;
  return {
    normalized,
    regionStart,
    regionEnd,
    insideRegion: normalized >= regionStart && normalized <= regionEnd,
  };
}

function updateOverviewCursor(clientX = null) {
  const canvas = ui.waveformOverview;
  if (!canvas) return;
  if (state.overviewDrag.active) {
    canvas.classList.add("is-dragging");
    return;
  }
  canvas.classList.remove("is-dragging");
  if (clientX === null || !state.sample.buffer) {
    canvas.classList.remove("is-region-draggable");
    return;
  }
  const pointerState = getOverviewPointerState(clientX);
  canvas.classList.toggle("is-region-draggable", Boolean(pointerState?.insideRegion));
}

function updateOverviewRegionFromPointer(clientX) {
  if (!state.sample.buffer) return;
  const canvas = ui.waveformOverview;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0) return;
  const normalized = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const width = state.overviewDrag.width;
  const nextStart = Math.max(0, Math.min(1 - width, normalized - state.overviewDrag.offset));
  state.sample.setRegion(nextStart, nextStart + width);
  syncUi();
  drawWaveform();
  writeStoredSession();
}

function openFilterOverlay(trackIndex) {
  state.selectedTrackIndex = trackIndex;
  state.filterOverlay = {
    open: true,
    trackIndex,
    effectKey: "filter",
  };
  syncUi();
  renderTrackSelector();
  renderEffectsMatrix();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

function closeFilterOverlay() {
  state.filterOverlay.open = false;
  syncFilterOverlay();
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
    const { startTime, endTime } = state.sample.getRegionBounds();
    const sliceDuration = Math.max(0.03, slice.duration * (track.chopGate / 100));
    const fixedStart = startTime + Math.max(0, endTime - startTime - sliceDuration) * ((track.voicePlacement ?? 50) / 100);
    const indicatorStart = track.grainLocation === "fixed" ? fixedStart : slice.start;
    setTrackIndicator(trackIndex, indicatorStart, indicatorStart + sliceDuration, 220);
    return;
  }

  const grainWindow = resolveGrainWindow(track, sliceIndex);
  setTrackIndicator(trackIndex, grainWindow.start, grainWindow.end, 160);
}

function isTransportRunning() {
  return Boolean(state.transport?.intervalId);
}

function syncTransportButton() {
  if (!ui.transportToggle) return;
  ui.transportToggle.textContent = isTransportRunning() ? "Pause" : "Play";
}

function getWaveformViewport() {
  if (!state.sample.buffer) return { startTime: 0, endTime: 1 };

  const { startTime, endTime } = state.sample.getRegionBounds();
  return {
    startTime,
    endTime,
  };
}

function timeToViewportX(time, viewportStart, viewportEnd, viewportLeft, viewportWidth) {
  const normalized = (time - viewportStart) / Math.max(0.0001, viewportEnd - viewportStart);
  return viewportLeft + normalized * viewportWidth;
}

function drawWaveformOverview() {
  const canvas = ui.waveformOverview;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0, 0, width, height);

  if (!state.sample.buffer) return;

  const data = state.sample.buffer.getChannelData(0);
  const step = Math.max(1, Math.ceil(data.length / width));
  let peak = 0.0001;
  for (let index = 0; index < data.length; index += 1) peak = Math.max(peak, Math.abs(data[index] ?? 0));

  const centerY = height / 2;
  const waveformScale = height * 0.38 / peak;
  const { startTime, endTime } = state.sample.getRegionBounds();
  const regionStartX = (startTime / state.sample.buffer.duration) * width;
  const regionEndX = (endTime / state.sample.buffer.duration) * width;

  ctx.fillStyle = "rgba(255, 184, 77, 0.14)";
  ctx.fillRect(regionStartX, 0, Math.max(0, regionEndX - regionStartX), height);

  ctx.strokeStyle = "rgba(210, 227, 255, 0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < width; x += 1) {
    const sliceStart = x * step;
    if (sliceStart >= data.length) break;
    let min = 1;
    let max = -1;
    let hasSample = false;
    for (let offset = 0; offset < step; offset += 1) {
      const sample = data[sliceStart + offset];
      if (sample === undefined) continue;
      hasSample = true;
      if (sample < min) min = sample;
      if (sample > max) max = sample;
    }
    if (!hasSample) continue;
    ctx.moveTo(x, centerY + min * waveformScale);
    ctx.lineTo(x, centerY + max * waveformScale);
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 184, 77, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(regionStartX, 1, Math.max(1, regionEndX - regionStartX), height - 2);
}

function drawWaveform() {
  const canvas = ui.waveform;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const laneHeight = height / TRACK_COUNT;
  const outerPadding = 20;
  const labelLeft = outerPadding;
  const labelFont = '400 11px "IBM Plex Sans", "Avenir Next", sans-serif';
  ctx.font = labelFont;
  const widestLabel = state.tracks.reduce((maxWidth, track) => Math.max(maxWidth, ctx.measureText(track.name).width), 0);
  const labelWidth = Math.ceil(widestLabel);
  const viewportGap = outerPadding;
  const viewportPaddingRight = 0;
  const viewportLeft = labelLeft + labelWidth + viewportGap;
  const viewportRight = width - viewportPaddingRight;
  const viewportWidth = Math.max(1, viewportRight - viewportLeft);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0, 0, width, height);

  if (!state.sample.buffer) {
    ctx.fillStyle = "rgba(232,242,255,0.65)";
    ctx.font = '18px "IBM Plex Sans", "Avenir Next", sans-serif';
    const emptyStateMessage = state.sampleLoading
      ? `Loading sample${".".repeat(state.sampleLoadingDots)}`
      : "Waveform will appear here after you load a sample.";
    ctx.fillText(emptyStateMessage, viewportLeft, height / 2);
    drawWaveformOverview();
    return;
  }

  const data = state.sample.buffer.getChannelData(0);
  const { startTime, endTime } = state.sample.getRegionBounds();
  const viewport = getWaveformViewport();
  const viewportStartSample = Math.max(0, Math.floor(viewport.startTime * state.sample.buffer.sampleRate));
  const viewportEndSample = Math.min(data.length, Math.ceil(viewport.endTime * state.sample.buffer.sampleRate));
  const viewportSampleLength = Math.max(1, viewportEndSample - viewportStartSample);
  const samplesPerPixel = Math.max(1, Math.ceil(viewportSampleLength / viewportWidth));
  let peak = 0.0001;

  for (let sampleIndex = viewportStartSample; sampleIndex < viewportEndSample; sampleIndex += 1) {
    peak = Math.max(peak, Math.abs(data[sampleIndex] ?? 0));
  }

  const centerY = height / 2;
  const waveformScale = height * 0.4 / peak;
  const regionStartX = Math.max(viewportLeft, timeToViewportX(startTime, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth));
  const regionEndX = Math.min(viewportRight, timeToViewportX(endTime, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth));

  ctx.save();
  ctx.beginPath();
  ctx.rect(viewportLeft, 0, viewportWidth, height);
  ctx.clip();

  ctx.fillStyle = "rgba(255, 184, 77, 0.1)";
  ctx.fillRect(regionStartX, 0, Math.max(0, regionEndX - regionStartX), height);

  ctx.strokeStyle = "rgba(210, 227, 255, 0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < viewportWidth; x += 1) {
    const canvasX = viewportLeft + x;
    const sliceStart = viewportStartSample + x * samplesPerPixel;
    if (sliceStart >= viewportEndSample) break;
    const sliceEnd = Math.min(viewportEndSample, sliceStart + samplesPerPixel);
    let min = 1;
    let max = -1;
    let hasSample = false;
    for (let sampleIndex = sliceStart; sampleIndex < sliceEnd; sampleIndex += 1) {
      const sample = data[sampleIndex];
      if (sample === undefined) continue;
      hasSample = true;
      if (sample < min) min = sample;
      if (sample > max) max = sample;
    }
    if (!hasSample) continue;
    ctx.moveTo(canvasX, centerY + min * waveformScale);
    ctx.lineTo(canvasX, centerY + max * waveformScale);
  }
  ctx.stroke();

  state.tracks.forEach((track, trackIndex) => {
    const laneTop = laneHeight * trackIndex;
    const laneBottom = laneTop + laneHeight;
    const laneMiddle = laneTop + laneHeight / 2;
    const laneInset = 3;
    const sliceHeight = Math.max(8, laneHeight - laneInset * 2);

    ctx.fillStyle = trackIndex === state.selectedTrackIndex ? hexToRgba(track.color, 0.12) : hexToRgba(track.color, 0.05);
    ctx.fillRect(viewportLeft, laneTop, viewportWidth, laneHeight);

    ctx.strokeStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.8 : 0.42);
    ctx.lineWidth = trackIndex === state.selectedTrackIndex ? 1.5 : 1;
    state.sample.getSlices(track.sliceCount).forEach((slice, sliceIndex) => {
      const sliceX = timeToViewportX(slice.start, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth);
      if (sliceX < viewportLeft || sliceX > viewportRight) return;
      ctx.beginPath();
      ctx.moveTo(sliceX, laneTop + laneInset);
      ctx.lineTo(sliceX, laneBottom - laneInset);
      ctx.stroke();

      if (sliceIndex === track.sliceCount - 1) {
        const endMarkerX = timeToViewportX(slice.start + slice.duration, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth);
        if (endMarkerX >= viewportLeft && endMarkerX <= viewportRight) {
          ctx.beginPath();
          ctx.moveTo(endMarkerX, laneTop + laneInset);
          ctx.lineTo(endMarkerX, laneBottom - laneInset);
          ctx.stroke();
        }
      }
    });

    ctx.strokeStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.38 : 0.22);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(regionStartX, laneMiddle);
    ctx.lineTo(regionEndX, laneMiddle);
    ctx.stroke();

    const indicator = state.trackIndicators[trackIndex];
    if (indicator) {
      const indicatorStartX = Math.max(viewportLeft, timeToViewportX(indicator.start, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth));
      const indicatorEndX = Math.min(viewportRight, timeToViewportX(indicator.end, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth));
      const indicatorWidth = Math.max(2, indicatorEndX - indicatorStartX);
      ctx.fillStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.3 : 0.18);
      ctx.fillRect(indicatorStartX, laneTop + laneInset, indicatorWidth, sliceHeight);
      ctx.strokeStyle = track.color;
      ctx.lineWidth = trackIndex === state.selectedTrackIndex ? 2 : 1;
      ctx.strokeRect(indicatorStartX, laneTop + laneInset, indicatorWidth, sliceHeight);
    }
  });

  ctx.restore();

  state.tracks.forEach((track, trackIndex) => {
    const laneTop = laneHeight * trackIndex;
    const laneBottom = laneTop + laneHeight;
    const laneMiddle = laneTop + laneHeight / 2;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, laneBottom);
    ctx.lineTo(width, laneBottom);
    ctx.stroke();

    ctx.fillStyle = track.color;
    ctx.font = labelFont;
    ctx.textBaseline = "middle";
    ctx.fillText(track.name, labelLeft, laneMiddle);
  });

  drawWaveformOverview();
}

function updateCurrentStep(activeStep = -1) {
  ui.patternGrid.querySelectorAll(".step").forEach((button) => {
    const stepStart = Number(button.dataset.stepStart);
    const stepSpan = Number(button.dataset.stepSpan);
    button.classList.toggle("current", activeStep >= stepStart && activeStep < stepStart + stepSpan);
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
    selectButton.innerHTML = `<span class="track-chip-name">${track.name}</span><span class="track-chip-mode">${formatModeLabel(track.mode)}</span>`;
    selectButton.addEventListener("click", () => {
      state.selectedTrackIndex = index;
      syncUi();
      renderTrackSelector();
      renderEffectsMatrix();
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
      renderEffectsMatrix();
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
      renderEffectsMatrix();
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

function renderEffectsMatrix() {
  if (!ui.effectsMatrix) return;
  ui.effectsMatrix.innerHTML = "";

  const headerRow = document.createElement("div");
  headerRow.className = "effects-matrix-row effects-matrix-header";

  state.tracks.forEach((track, index) => {
    const headerCell = document.createElement("div");
    headerCell.className = `effects-axis-label effects-track-head${index === state.selectedTrackIndex ? " active" : ""}`;
    headerCell.textContent = `T${track.id}`;
    applyTrackColor(headerCell, track.color);
    headerRow.append(headerCell);
  });
  ui.effectsMatrix.append(headerRow);

  EFFECT_KEYS.forEach((effectKey) => {
    const row = document.createElement("div");
    row.className = "effects-matrix-row effects-row";

    const labelCell = document.createElement("div");
    labelCell.className = "effects-axis-label effects-row-label";
    labelCell.textContent = effectKey === "filter" ? "Filter" : effectKey;
    row.append(labelCell);

    state.tracks.forEach((track, trackIndex) => {
      const effect = track.effects[effectKey];
      const button = document.createElement("button");
      button.className = `effects-cell effects-toggle${effect.enabled ? " active" : ""}${trackIndex === state.selectedTrackIndex ? " selected" : ""}`;
      applyTrackColor(button, track.color);
      button.textContent = effect.enabled ? formatFilterTypeLabel(effect.type) : "Off";
      button.title = `${track.name} ${effectKey} ${effect.enabled ? "enabled" : "disabled"}`;

      let holdTimer = null;
      let holdTriggered = false;

      button.addEventListener("click", () => {
        if (holdTriggered) {
          holdTriggered = false;
          return;
        }
        track.effects[effectKey].enabled = !track.effects[effectKey].enabled;
        syncUi();
        renderEffectsMatrix();
        writeStoredSession();
      });

      button.addEventListener("pointerdown", () => {
        holdTriggered = false;
        button.classList.add("is-armed");
        holdTimer = window.setTimeout(() => {
          holdTriggered = true;
          button.classList.remove("is-armed");
          openFilterOverlay(trackIndex);
        }, 1000);
      });

      const cancelHold = () => {
        if (holdTimer) {
          window.clearTimeout(holdTimer);
          holdTimer = null;
        }
        button.classList.remove("is-armed");
      };

      button.addEventListener("pointerup", cancelHold);
      button.addEventListener("pointerleave", cancelHold);
      button.addEventListener("pointercancel", cancelHold);
      row.append(button);
    });

    ui.effectsMatrix.append(row);
  });
}

function renderPattern(activeStep = -1) {
  ui.patternGrid.innerHTML = "";
  state.tracks.forEach((track, trackIndex) => {
    const visibleCellCount = getTrackVisibleCellCount(track);
    const row = document.createElement("div");
    row.className = "pattern-row";
    row.style.gridTemplateColumns = `88px repeat(${visibleCellCount}, minmax(32px, 1fr))`;

    const label = document.createElement("button");
    label.className = `pattern-row-label${trackIndex === state.selectedTrackIndex ? " active" : ""}`;
    applyTrackColor(label, track.color);
    label.innerHTML = `<span class="pattern-row-name">${track.name}</span><span class="pattern-row-mode">${track.rate} • ${formatModeLabel(track.mode)}${track.muted ? " • M" : track.solo ? " • S" : ""}</span>`;
    label.addEventListener("click", () => {
      state.selectedTrackIndex = trackIndex;
      syncUi();
      renderTrackSelector();
      renderEffectsMatrix();
      renderMixer();
      renderPattern(activeStep);
      drawWaveform();
      writeStoredSession();
    });
    row.append(label);

    track.pattern.slice(0, visibleCellCount).forEach((enabled, cellIndex) => {
      const stepButton = document.createElement("button");
      const stepStart = cellIndex * getTrackRateSpan(track);
      stepButton.className = `step${enabled ? " active" : ""}`;
      applyTrackColor(stepButton, track.color);
      stepButton.dataset.stepStart = String(stepStart);
      stepButton.dataset.stepSpan = String(getTrackRateSpan(track));
      stepButton.dataset.trackIndex = String(trackIndex);
      stepButton.textContent = String(cellIndex + 1);
      stepButton.addEventListener("click", () => {
        track.pattern[cellIndex] = !track.pattern[cellIndex];
        stepButton.classList.toggle("active", track.pattern[cellIndex]);
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
  ui.grainLocation.value = track.grainLocation;
  ui.voicePlacement.value = String(track.voicePlacement);
  ui.voicePlacementValue.textContent = `${track.voicePlacement}%`;
  ui.voicePlaybackMode.value = track.voicePlaybackMode;
  ui.voicePlacement.disabled = track.grainLocation !== "fixed";
  ui.voicePlacementField.classList.toggle("is-disabled", track.grainLocation !== "fixed");
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
  ui.swing.value = String(state.swing);
  ui.swingValue.textContent = `${state.swing}%`;
  ui.trackRate.value = track.rate;
  ui.fillDensity.value = String(state.fillDensity);
  ui.mixVolume.value = String(Math.round(state.mixVolume * 100));
  ui.mixVolumeValue.textContent = `${Math.round(state.mixVolume * 100)}%`;
  ui.fillDensityValue.textContent = `${state.fillDensity}%`;
  syncTransportButton();
  syncFilterOverlay();
  ui.regionStart.value = String(Math.round(state.sample.regionStart * 1000));
  ui.regionEnd.value = String(Math.round(state.sample.regionEnd * 1000));
  ui.sliceCount.value = String(track.sliceCount);

  if (!ui.sampleStatus) return;

  ui.sampleStatus.textContent = state.sample.buffer ? state.currentSampleName : "";
}

function updateSelectedTrack(patch) {
  Object.assign(getSelectedTrack(), patch);
  if ("grainLocation" in patch || "sliceCount" in patch || "rate" in patch) resetTrackPlaybackState(state.selectedTrackIndex);
  syncUi();
  renderTrackSelector();
  renderEffectsMatrix();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

function updateTrackFilter(trackIndex, patch) {
  const track = state.tracks[trackIndex];
  if (!track) return;
  track.effects.filter = normalizeFilterSettings({ ...track.effects.filter, ...patch }, track.effects.filter);
  syncUi();
  renderEffectsMatrix();
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
  await loadSampleFromFile(file);
  ui.sampleInput.value = "";
});

ui.sampleBrowserInput.addEventListener("change", async (event) => {
  const [file] = event.target.files ?? [];
  if (!file) return;
  await loadSampleFromFile(file);
  ui.sampleBrowserInput.value = "";
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
  const visibleCellCount = getTrackVisibleCellCount(track);
  const activeSteps = Math.round((visibleCellCount * state.fillDensity) / 100);
  const nextPattern = Array.from({ length: MAX_PATTERN_CELLS }, () => false);
  const candidateSteps = Array.from({ length: visibleCellCount }, (_, index) => index);

  for (let index = candidateSteps.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [candidateSteps[index], candidateSteps[swapIndex]] = [candidateSteps[swapIndex], candidateSteps[index]];
  }

  candidateSteps.slice(0, activeSteps).forEach((stepIndex) => {
    nextPattern[stepIndex] = true;
  });

  track.pattern = nextPattern;
  renderPattern();
  writeStoredSession();
});

ui.mode.addEventListener("change", () => updateSelectedTrack({ mode: ui.mode.value }));
ui.grainLocation.addEventListener("change", () => updateSelectedTrack({ grainLocation: ui.grainLocation.value }));
ui.voicePlacement.addEventListener("input", () => updateSelectedTrack({ voicePlacement: Number(ui.voicePlacement.value) }));
ui.voicePlaybackMode.addEventListener("change", () => updateSelectedTrack({ voicePlaybackMode: ui.voicePlaybackMode.value }));
ui.trackRate.addEventListener("change", () => updateSelectedTrack({ rate: ui.trackRate.value }));
ui.bpm.addEventListener("input", () => {
  state.bpm = Number(ui.bpm.value);
  syncUi();
  writeStoredSession();
});
ui.swing.addEventListener("input", () => {
  state.swing = Math.max(0, Math.min(100, Number(ui.swing.value)));
  syncUi();
  writeStoredSession();
});
ui.fillDensity.addEventListener("input", () => {
  state.fillDensity = Math.max(0, Math.min(100, Number(ui.fillDensity.value)));
  syncUi();
  writeStoredSession();
});
ui.mixVolume.addEventListener("input", () => {
  state.mixVolume = Math.max(0, Math.min(1, Number(ui.mixVolume.value) / 100));
  if (state.playback) state.playback.output.gain.value = state.mixVolume;
  syncUi();
  writeStoredSession();
});
ui.grainSize.addEventListener("input", () => updateSelectedTrack({ grainSize: Number(ui.grainSize.value) }));
ui.grainDensity.addEventListener("input", () => updateSelectedTrack({ grainDensity: Number(ui.grainDensity.value) }));
ui.spray.addEventListener("input", () => updateSelectedTrack({ spray: Number(ui.spray.value) }));
ui.pitch.addEventListener("input", () => updateSelectedTrack({ pitch: Number(ui.pitch.value) }));
ui.chopGate.addEventListener("input", () => updateSelectedTrack({ chopGate: Number(ui.chopGate.value) }));
ui.reverse.addEventListener("change", () => updateSelectedTrack({ reverse: ui.reverse.checked }));
ui.filterFrequency.addEventListener("input", () => {
  updateTrackFilter(state.filterOverlay.trackIndex, { frequency: Number(ui.filterFrequency.value) });
});
ui.filterQ.addEventListener("input", () => {
  updateTrackFilter(state.filterOverlay.trackIndex, { q: Number(ui.filterQ.value) });
});
ui.filterTypeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!radio.checked) return;
    updateTrackFilter(state.filterOverlay.trackIndex, { type: radio.value });
  });
});
ui.filterOverlayClose.addEventListener("click", () => closeFilterOverlay());
ui.filterOverlay.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  if (event.target.dataset.overlayClose === "true") closeFilterOverlay();
});

ui.sampleBrowserToggle.addEventListener("click", () => openSampleBrowser());
ui.sampleBrowserClose.addEventListener("click", () => closeSampleBrowser());
ui.sampleBrowserOverlay.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  if (event.target.dataset.sampleOverlayClose === "true") closeSampleBrowser();
});

ui.waveformOverview.addEventListener("pointerdown", (event) => {
  const pointerState = getOverviewPointerState(event.clientX);
  if (!pointerState?.insideRegion) return;
  state.overviewDrag = {
    active: true,
    pointerId: event.pointerId,
    offset: pointerState.normalized - pointerState.regionStart,
    width: pointerState.regionEnd - pointerState.regionStart,
  };
  ui.waveformOverview.setPointerCapture(event.pointerId);
  updateOverviewCursor();
});

ui.waveformOverview.addEventListener("pointermove", (event) => {
  if (state.overviewDrag.active && state.overviewDrag.pointerId === event.pointerId) {
    updateOverviewRegionFromPointer(event.clientX);
    return;
  }
  updateOverviewCursor(event.clientX);
});

ui.waveformOverview.addEventListener("pointerup", (event) => {
  if (state.overviewDrag.active && state.overviewDrag.pointerId === event.pointerId) {
    state.overviewDrag = { active: false, pointerId: null, offset: 0, width: 1 };
    ui.waveformOverview.releasePointerCapture(event.pointerId);
  }
  updateOverviewCursor(event.clientX);
});

ui.waveformOverview.addEventListener("pointercancel", () => {
  state.overviewDrag = { active: false, pointerId: null, offset: 0, width: 1 };
  updateOverviewCursor();
});

ui.waveformOverview.addEventListener("pointerleave", () => {
  if (!state.overviewDrag.active) updateOverviewCursor();
});

ui.transportToggle.addEventListener("click", async () => {
  try {
    await ensureAudio();
    if (!state.sample.buffer && !state.defaultSampleLoaded) {
      await loadDefaultSample();
    }
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
  if (event.key === "Escape" && state.filterOverlay.open) {
    closeFilterOverlay();
    return;
  }
  if (event.key === "Escape" && state.sampleBrowserOpen) {
    closeSampleBrowser();
    return;
  }
  if (event.code !== "Space") return;
  event.preventDefault();
  try {
    await ensureAudio();
    if (!state.sample.buffer && !state.defaultSampleLoaded) {
      await loadDefaultSample();
    }
    if (!state.sample.buffer) {
      setDiagnostics("space trigger ignored because no sample is loaded.", "warn");
      return;
    }
    const track = getSelectedTrack();
    if (!isTrackAudible(track)) {
      setDiagnostics(`${track.name} is ${track.muted ? "muted" : "not soloed"}.`, "warn");
      return;
    }
    const sliceIndex = resolvePlaybackSliceIndex(track, { advance: true });
    indicateTrackPlayback(track, sliceIndex);
    state.playback.triggerTrack(track, undefined, sliceIndex, getTrackTriggerDuration(track));
  } catch (error) {
    setDiagnostics(`keyboard trigger failed: ${error.message}`, "error");
  }
});

applyStoredSession();
syncTransportButton();
syncUi();
drawWaveform();
renderSampleLibrary();
syncSampleBrowserOverlay();
renderTrackSelector();
renderEffectsMatrix();
renderMixer();
renderPattern();
loadDefaultSample();
