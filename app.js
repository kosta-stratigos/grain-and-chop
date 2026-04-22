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
  pitchLanes: document.querySelector("#pitch-lanes"),
  patternVoiceSelect: document.querySelector("#pattern-voice-select"),
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
  delayOverlay: document.querySelector("#delay-overlay"),
  delayOverlayTrack: document.querySelector("#delay-overlay-track"),
  delayOverlayClose: document.querySelector("#delay-overlay-close"),
  delayTime: document.querySelector("#delay-time"),
  delayTimeValue: document.querySelector("#delay-time-value"),
  delayFeedback: document.querySelector("#delay-feedback"),
  delayFeedbackValue: document.querySelector("#delay-feedback-value"),
  delayDecay: document.querySelector("#delay-decay"),
  delayDecayValue: document.querySelector("#delay-decay-value"),
  delayTone: document.querySelector("#delay-tone"),
  delayToneValue: document.querySelector("#delay-tone-value"),
  delayMix: document.querySelector("#delay-mix"),
  delayMixValue: document.querySelector("#delay-mix-value"),
  driftOverlay: document.querySelector("#drift-overlay"),
  driftOverlayTrack: document.querySelector("#drift-overlay-track"),
  driftOverlayClose: document.querySelector("#drift-overlay-close"),
  driftRate: document.querySelector("#drift-rate"),
  driftRange: document.querySelector("#drift-range"),
  driftRangeMin: document.querySelector("#drift-range-min"),
  driftRangeMax: document.querySelector("#drift-range-max"),
  driftRangeMinValue: document.querySelector("#drift-range-min-value"),
  driftRangeMaxValue: document.querySelector("#drift-range-max-value"),
  swellOverlay: document.querySelector("#swell-overlay"),
  swellOverlayTrack: document.querySelector("#swell-overlay-track"),
  swellOverlayClose: document.querySelector("#swell-overlay-close"),
  swellRate: document.querySelector("#swell-rate"),
  swellRange: document.querySelector("#swell-range"),
  swellRangeMin: document.querySelector("#swell-range-min"),
  swellRangeMax: document.querySelector("#swell-range-max"),
  swellRangeMinValue: document.querySelector("#swell-range-min-value"),
  swellRangeMaxValue: document.querySelector("#swell-range-max-value"),
  bpm: document.querySelector("#bpm"),
  bpmValue: document.querySelector("#bpm-value"),
  swing: document.querySelector("#swing"),
  swingValue: document.querySelector("#swing-value"),
  trackSteps: document.querySelector("#track-steps"),
  trackStepsValue: document.querySelector("#track-steps-value"),
  trackPlaybackMode: document.querySelector("#track-playback-mode"),
  trackStepProbability: document.querySelector("#track-step-probability"),
  trackStepProbabilityValue: document.querySelector("#track-step-probability-value"),
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
const PITCH_LANE_NOTE_COUNT = 48;
const PITCH_LANE_START_MIDI = 38;
const PITCH_LANE_REFERENCE_MIDI = 62;
const TRACK_COLORS = ["#59d0ff", "#ff8f5a", "#8dff7a", "#ffd34d"];
const EFFECT_KEYS = ["filter", "delay", "drift", "swell"];
const FILTER_TYPES = ["lowpass", "bandpass", "highpass"];
const TRACK_PLAYBACK_MODES = ["forward", "ping-pong", "random", "reverse"];
const SCALE_OPTIONS = [
  { value: "chromatic", label: "Chromatic", intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { value: "ionian", label: "Ionian (I)", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { value: "dorian", label: "Dorian (ii)", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { value: "phrygian", label: "Phrygian (iii)", intervals: [0, 1, 3, 5, 7, 8, 10] },
  { value: "lydian", label: "Lydian (IV)", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { value: "mixolydian", label: "Mixolydian (V)", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { value: "aeolian", label: "Aeolian (vi)", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { value: "locrian", label: "Locrian (vii°)", intervals: [0, 1, 3, 5, 6, 8, 10] },
  { value: "major-pent", label: "Major Pent.", intervals: [0, 2, 4, 7, 9] },
  { value: "minor-pent", label: "Minor Pent.", intervals: [0, 3, 5, 7, 10] },
];
const D_ROOT_PITCH_CLASS = 2;
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function updateRangeFill(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== "range") return;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value || min);
  const span = Math.max(1, max - min);
  const percent = ((value - min) / span) * 100;
  input.style.setProperty("--range-fill", `${percent}%`);
}

function refreshRangeFills(root = document) {
  root.querySelectorAll('input[type="range"]').forEach((input) => {
    updateRangeFill(input);
  });
}

function clampDelayTime(value) {
  return Math.max(40, Math.min(1200, Number(value) || 280));
}

function clampDelayPercent(value, max = 100, fallback = 0) {
  return Math.max(0, Math.min(max, Number(value) || fallback));
}

function clampFilterFrequency(value) {
  return Math.max(20, Math.min(16000, Number(value) || 1200));
}

function clampFilterQ(value) {
  return Math.max(0.1, Math.min(20, Number(value) || 0.8));
}

function clampPan(value) {
  return Math.max(-1, Math.min(1, Number(value) || 0));
}

function clampIntegerText(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampLfoRateMs(value, fallback = 1500) {
  return Math.max(5, Math.min(10000, clampIntegerText(value, fallback)));
}

function clampUnitPercent(value, fallback = 0) {
  const resolved = Number.isFinite(Number(value)) ? Number(value) : fallback;
  return Math.max(0, Math.min(100, resolved));
}

function clampPanSweep(value, fallback = 0) {
  return Math.max(-100, Math.min(100, clampIntegerText(value, fallback)));
}

function clampVolumeSweep(value, fallback = 100) {
  return Math.max(0, Math.min(100, clampIntegerText(value, fallback)));
}

function normalizeScaleMode(value, fallback = "chromatic") {
  return SCALE_OPTIONS.some((option) => option.value === value) ? value : fallback;
}

function getScaleDefinition(scaleMode = "chromatic") {
  return SCALE_OPTIONS.find((option) => option.value === scaleMode) ?? SCALE_OPTIONS[0];
}

function createDefaultFilterSettings() {
  return {
    enabled: false,
    type: "lowpass",
    frequency: 1200,
    q: 0.8,
  };
}

function createDefaultDelaySettings() {
  return {
    enabled: false,
    time: 280,
    feedback: 35,
    decay: 55,
    tone: 60,
    mix: 30,
  };
}

function createDefaultDriftSettings() {
  return {
    enabled: false,
    rate: 1500,
    rangeMin: -35,
    rangeMax: 35,
  };
}

function createDefaultSwellSettings() {
  return {
    enabled: false,
    rate: 1800,
    rangeMin: 65,
    rangeMax: 100,
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

function normalizeDelaySettings(source = {}, fallback = createDefaultDelaySettings()) {
  return {
    enabled: Boolean(source.enabled),
    time: clampDelayTime(source.time ?? fallback.time),
    feedback: clampDelayPercent(source.feedback ?? fallback.feedback, 95, fallback.feedback),
    decay: clampDelayPercent(source.decay ?? fallback.decay, 100, fallback.decay),
    tone: clampDelayPercent(source.tone ?? fallback.tone, 100, fallback.tone),
    mix: clampDelayPercent(source.mix ?? fallback.mix, 100, fallback.mix),
  };
}

function normalizeDriftSettings(source = {}, fallback = createDefaultDriftSettings()) {
  const rangeMin = clampPanSweep(source.rangeMin ?? fallback.rangeMin, fallback.rangeMin);
  const rangeMax = clampPanSweep(source.rangeMax ?? fallback.rangeMax, fallback.rangeMax);
  return {
    enabled: Boolean(source.enabled),
    rate: clampLfoRateMs(source.rate ?? fallback.rate, fallback.rate),
    rangeMin: Math.min(rangeMin, rangeMax),
    rangeMax: Math.max(rangeMin, rangeMax),
  };
}

function normalizeSwellSettings(source = {}, fallback = createDefaultSwellSettings()) {
  const rangeMin = clampVolumeSweep(source.rangeMin ?? fallback.rangeMin, fallback.rangeMin);
  const rangeMax = clampVolumeSweep(source.rangeMax ?? fallback.rangeMax, fallback.rangeMax);
  return {
    enabled: Boolean(source.enabled),
    rate: clampLfoRateMs(source.rate ?? fallback.rate, fallback.rate),
    rangeMin: Math.min(rangeMin, rangeMax),
    rangeMax: Math.max(rangeMin, rangeMax),
  };
}

function createTrackEffects(source = {}) {
  return {
    filter: normalizeFilterSettings(source.filter),
    delay: normalizeDelaySettings(source.delay),
    drift: normalizeDriftSettings(source.drift),
    swell: normalizeSwellSettings(source.swell),
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
  constructor(audioContext, sampleLayer, state) {
    this.audioContext = audioContext;
    this.sampleLayer = sampleLayer;
    this.state = state;
    this.output = audioContext.createGain();
    this.output.gain.value = 0.9;
    this.output.connect(audioContext.destination);
    this.trackBuses = Array.from({ length: TRACK_COUNT }, (_, index) => this.createTrackBus(index));
    this.trackBuses.forEach((_, index) => this.updateTrackBus(index, this.state.tracks[index]));
  }

  createTrackBus(trackIndex) {
    const input = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    const dryGain = this.audioContext.createGain();
    const delaySend = this.audioContext.createGain();
    const delayNode = this.audioContext.createDelay(2.4);
    const delayTone = this.audioContext.createBiquadFilter();
    const delayWetGain = this.audioContext.createGain();
    const feedbackGain = this.audioContext.createGain();
    const outputGain = this.audioContext.createGain();
    const panNode = this.audioContext.createStereoPanner();
    const panCenter = this.audioContext.createConstantSource();
    const panLfo = this.audioContext.createOscillator();
    const panLfoDepth = this.audioContext.createGain();
    const gainCenter = this.audioContext.createConstantSource();
    const gainLfo = this.audioContext.createOscillator();
    const gainLfoDepth = this.audioContext.createGain();

    outputGain.connect(panNode);
    panNode.connect(this.output);
    delayTone.type = "lowpass";
    panLfo.type = "sine";
    gainLfo.type = "sine";
    panCenter.connect(panNode.pan);
    panLfo.connect(panLfoDepth);
    panLfoDepth.connect(panNode.pan);
    gainCenter.connect(outputGain.gain);
    gainLfo.connect(gainLfoDepth);
    gainLfoDepth.connect(outputGain.gain);
    panCenter.start();
    panLfo.start();
    gainCenter.start();
    gainLfo.start();

    const bus = {
      trackIndex,
      input,
      filterNode,
      dryGain,
      delaySend,
      delayNode,
      delayTone,
      delayWetGain,
      feedbackGain,
      outputGain,
      panNode,
      panCenter,
      panLfo,
      panLfoDepth,
      gainCenter,
      gainLfo,
      gainLfoDepth,
    };
    return bus;
  }

  updateTrackBus(trackIndex, track = this.state.tracks[trackIndex]) {
    const bus = this.trackBuses?.[trackIndex];
    if (!bus || !track) return;
    const { input, filterNode, dryGain, delaySend, delayNode, delayTone, delayWetGain, feedbackGain, outputGain, panNode, panCenter, panLfo, panLfoDepth, gainCenter, gainLfo, gainLfoDepth } = bus;

    input.disconnect();
    filterNode.disconnect();
    dryGain.disconnect();
    delaySend.disconnect();
    delayNode.disconnect();
    delayTone.disconnect();
    delayWetGain.disconnect();
    feedbackGain.disconnect();

    const filter = track.effects.filter;
    const delay = track.effects.delay;
    const drift = track.effects.drift;
    const swell = track.effects.swell;
    const driftCenter = (drift.rangeMin + drift.rangeMax) / 200;
    const swellCenter = (swell.rangeMin + swell.rangeMax) / 200;
    const driftAmplitude = drift.enabled ? Math.abs(drift.rangeMax - drift.rangeMin) / 200 : 0;
    const swellAmplitude = swell.enabled ? Math.abs(swell.rangeMax - swell.rangeMin) / 200 : 0;
    const driftFrequency = 1 / (clampLfoRateMs(drift.rate, 1500) / 1000);
    const swellFrequency = 1 / (clampLfoRateMs(swell.rate, 1800) / 1000);

    outputGain.gain.value = 0;
    panNode.pan.value = 0;
    panCenter.offset.setValueAtTime(driftCenter, this.audioContext.currentTime);
    panLfo.frequency.setValueAtTime(driftFrequency, this.audioContext.currentTime);
    panLfoDepth.gain.setValueAtTime(driftAmplitude, this.audioContext.currentTime);
    gainCenter.offset.setValueAtTime(swellCenter, this.audioContext.currentTime);
    gainLfo.frequency.setValueAtTime(swellFrequency, this.audioContext.currentTime);
    gainLfoDepth.gain.setValueAtTime(swellAmplitude, this.audioContext.currentTime);

    let sourceStage = input;
    if (filter.enabled) {
      filterNode.type = filter.type;
      filterNode.frequency.setValueAtTime(clampFilterFrequency(filter.frequency), this.audioContext.currentTime);
      filterNode.Q.setValueAtTime(clampFilterQ(filter.q), this.audioContext.currentTime);
      input.connect(filterNode);
      sourceStage = filterNode;
    }

    if (!delay.enabled) {
      sourceStage.connect(outputGain);
      return;
    }

    const mixAmount = clampDelayPercent(delay.mix, 100, 30) / 100;
    const feedbackAmount = clampDelayPercent(delay.feedback, 95, 35) / 100;
    const decayAmount = clampDelayPercent(delay.decay, 100, 55) / 100;
    const toneAmount = clampDelayPercent(delay.tone, 100, 60) / 100;
    const delayTimeSeconds = clampDelayTime(delay.time) / 1000;
    const feedbackLoopGain = Math.min(0.94, feedbackAmount * (0.28 + decayAmount * 0.66));
    const wetLevel = Math.min(1, mixAmount * (0.45 + decayAmount * 0.55));
    const toneFrequency = 500 * (2 ** (toneAmount * 4.8));

    dryGain.gain.setValueAtTime(1 - mixAmount, this.audioContext.currentTime);
    delaySend.gain.setValueAtTime(mixAmount, this.audioContext.currentTime);
    delayNode.delayTime.setValueAtTime(delayTimeSeconds, this.audioContext.currentTime);
    delayTone.frequency.setValueAtTime(Math.max(500, Math.min(16000, toneFrequency)), this.audioContext.currentTime);
    delayWetGain.gain.setValueAtTime(wetLevel, this.audioContext.currentTime);
    feedbackGain.gain.setValueAtTime(feedbackLoopGain, this.audioContext.currentTime);

    sourceStage.connect(dryGain);
    dryGain.connect(outputGain);
    sourceStage.connect(delaySend);
    delaySend.connect(delayNode);
    delayNode.connect(delayTone);
    delayTone.connect(delayWetGain);
    delayWetGain.connect(outputGain);
    delayTone.connect(feedbackGain);
    feedbackGain.connect(delayNode);
  }

  createVoice({
    trackIndex,
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
  }) {
    const baseBuffer = this.sampleLayer.buffer;
    const buffer = reverse ? this.sampleLayer.reversedBuffer : baseBuffer;
    if (!buffer) return false;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;

    const safeDuration = Math.max(0.02, Math.min(duration, buffer.duration));
    const maxOffset = Math.max(0, buffer.duration - safeDuration);

    const voiceGain = this.audioContext.createGain();
    const holdDuration = loop ? Math.max(safeDuration, sustainDuration ?? safeDuration) : safeDuration;
    voiceGain.gain.setValueAtTime(0.0001, when);
    voiceGain.gain.linearRampToValueAtTime(0.75 * level, when + attack);
    voiceGain.gain.setValueAtTime(0.75 * level, when + holdDuration);
    voiceGain.gain.linearRampToValueAtTime(0.0001, when + holdDuration + release);

    source.connect(voiceGain);
    const busInput = this.trackBuses?.[trackIndex]?.input ?? this.output;
    voiceGain.connect(busInput);

    const intendedOffset = reverse ? buffer.duration - offset - safeDuration : offset;
    const playbackOffset = Math.max(0, Math.min(maxOffset, intendedOffset));
    const baseStopTime = when + holdDuration + release;
    const disconnectDelayMs = Math.ceil((baseStopTime - this.audioContext.currentTime + 0.1) * 1000);

    if (loop) {
      source.loop = true;
      const loopRegionStart = reverse ? buffer.duration - loopEnd : loopStart;
      const loopRegionEnd = reverse ? buffer.duration - loopStart : loopEnd;
      source.loopStart = Math.max(0, Math.min(buffer.duration - 0.01, loopRegionStart));
      source.loopEnd = Math.max(source.loopStart + 0.01, Math.min(buffer.duration, loopRegionEnd));
      source.start(when, playbackOffset);
      source.stop(baseStopTime);
      window.setTimeout(() => {
        source.disconnect?.();
        voiceGain.disconnect?.();
      }, Math.max(0, disconnectDelayMs));
      return true;
    }
    source.start(when, playbackOffset, safeDuration);
    source.stop(when + safeDuration + release);
    window.setTimeout(() => {
      source.disconnect?.();
      voiceGain.disconnect?.();
    }, Math.max(0, disconnectDelayMs));
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
        trackIndex: settings.trackIndex,
        when,
        offset: Math.max(0, loopPosition),
        duration: Math.min(grainDuration, buffer.duration - loopPosition),
        rate,
        reverse: settings.reverse,
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
          trackIndex: settings.trackIndex,
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
        trackIndex: track.id - 1,
        when,
        offset,
        duration: Math.max(0.03, Math.min(baseSliceDuration, endTime - offset)),
        rate,
        reverse: track.reverse,
        attack: smoothLoop ? 0.01 : 0.002,
        release: smoothLoop ? 0.02 : 0.004,
        level: 1,
        loop: true,
        loopStart: offset,
        loopEnd: Math.min(endTime, offset + baseSliceDuration),
        sustainDuration: Math.max(baseSliceDuration, noteDuration),
      });
    }
    return this.createVoice({
      trackIndex: track.id - 1,
      when,
      offset,
      duration: Math.max(0.03, Math.min(baseSliceDuration, endTime - offset)),
      rate,
      reverse: track.reverse,
      attack: 0.004,
      release: 0.03,
      level: 1,
    });
  }

  triggerTrack(track, when = this.audioContext.currentTime, sliceIndex = null, noteDuration = null) {
    const playbackTrack = getTrackPlaybackSettings(track);
    if (playbackTrack.mode === "granular") {
      return this.triggerGranular(
        {
          trackIndex: playbackTrack.trackIndex,
          grainSizeMs: playbackTrack.grainSize,
          density: playbackTrack.grainDensity,
          spray: playbackTrack.spray / 100,
          pitch: playbackTrack.pitch,
          reverse: playbackTrack.reverse,
          level: 1,
          sliceCount: playbackTrack.sliceCount,
          grainLocation: playbackTrack.grainLocation,
          voicePlacement: playbackTrack.voicePlacement,
          voicePlaybackMode: playbackTrack.voicePlaybackMode,
        },
        when,
        sliceIndex,
        noteDuration,
      );
    }
    return this.triggerSlice(playbackTrack, when, sliceIndex, noteDuration);
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
    if (!this.state.sample.buffer) return;
    this.state.tracks.forEach((track) => {
      if (!shouldAdvanceTrackStep(track, stepIndex)) return;
      const cellIndex = resolveTrackPatternStep(track, { advance: true });
      if (!track.pattern[cellIndex]) return;
      if (Math.random() * 100 > track.stepProbability) return;
      if (!isTrackAudible(track)) return;
      const sliceIndex = resolvePlaybackSliceIndex(track, { advance: true });
      const noteDuration = getTrackTriggerDuration(track);
      indicateTrackPlayback(track, sliceIndex);
      this.playbackLayer.triggerTrack(track, when, sliceIndex, noteDuration);
    });
    if (this.onStep) this.onStep(stepIndex);
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

function createDecodeAudioContext() {
  const OfflineCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (OfflineCtor) return new OfflineCtor(1, 2, 44100);
  return new AudioContext();
}

function getDecodeAudioContext() {
  if (!state.decodeAudioContext) state.decodeAudioContext = createDecodeAudioContext();
  return state.decodeAudioContext;
}

function createTrack(id) {
  return {
    id,
    name: `Track ${id}`,
    color: TRACK_COLORS[(id - 1) % TRACK_COLORS.length],
    voiceIndex: id - 1,
    scaleMode: "chromatic",
    muted: false,
    solo: false,
    volume: 0.85,
    pan: 0,
    effects: createTrackEffects(),
    stepCount: 16,
    playbackMode: "forward",
    stepProbability: 100,
    pattern: Array.from({ length: MAX_PATTERN_CELLS }, (_, index) => (index + id - 1) % 4 === 0),
  };
}

function createVoiceConfig(id) {
  return {
    id,
    name: `Voice ${id}`,
    mode: id % 2 === 0 ? "chop" : "granular",
    reverse: false,
    grainLocation: "fixed",
    voicePlacement: 50,
    voicePlaybackMode: "one-shot",
    grainSize: 110,
    grainDensity: 12,
    spray: 18,
    pitch: 0,
    chopGate: 70,
    sliceCount: 8,
  };
}

const state = {
  audioContext: null,
  decodeAudioContext: null,
  sample: new SampleLayer(),
  playback: null,
  transport: null,
  bpm: 112,
  swing: 0,
  steps: BASE_GRID_STEPS,
  selectedTrackIndex: 0,
  selectedVoiceIndex: 0,
  tracks: Array.from({ length: TRACK_COUNT }, (_, index) => createTrack(index + 1)),
  voices: Array.from({ length: TRACK_COUNT }, (_, index) => createVoiceConfig(index + 1)),
  trackPlaybackState: Array.from({ length: TRACK_COUNT }, (_, index) => createTrackPlaybackState(createTrack(index + 1))),
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
  delayOverlay: {
    open: false,
    trackIndex: 0,
    effectKey: "delay",
  },
  driftOverlay: {
    open: false,
    trackIndex: 0,
    effectKey: "drift",
  },
  swellOverlay: {
    open: false,
    trackIndex: 0,
    effectKey: "swell",
  },
  defaultSampleLoaded: false,
  defaultSampleLoadPromise: null,
  sampleLoading: false,
  sampleLoadingDots: 0,
  sampleLoadingIntervalId: null,
  mixerAnimationFrameId: null,
  currentSampleName: "",
  fillDensity: 50,
  mixVolume: 0.9,
};

function getSelectedTrack() {
  return state.tracks[state.selectedTrackIndex];
}

function getSelectedVoice() {
  return state.voices[state.selectedVoiceIndex];
}

function createTrackPlaybackState(track = createTrack(1)) {
  return {
    sequentialIndex: 0,
    sweepIndex: 0,
    sweepDirection: 1,
    patternIndex: track.playbackMode === "reverse" ? Math.max(0, track.stepCount - 1) : 0,
    patternDirection: track.playbackMode === "reverse" ? -1 : 1,
    lastPatternIndex: -1,
    lastScheduledSlot: -1,
  };
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
    state.trackPlaybackState[trackIndex] = createTrackPlaybackState(state.tracks[trackIndex]);
    drawWaveformOverview();
    return;
  }

  state.trackPlaybackState = state.tracks.map((track) => createTrackPlaybackState(track));
}

function normalizeTrack(index, source = {}) {
  const fallback = createTrack(index + 1);
  const resolvedVoiceIndex = Number.isFinite(Number(source.voiceIndex)) ? Number(source.voiceIndex) : fallback.voiceIndex;
  return {
    ...fallback,
    color: typeof source.color === "string" ? source.color : fallback.color,
    voiceIndex: Math.max(0, Math.min(TRACK_COUNT - 1, resolvedVoiceIndex)),
    scaleMode: normalizeScaleMode(source.scaleMode, fallback.scaleMode),
    muted: Boolean(source.muted),
    solo: Boolean(source.solo),
    volume: Math.max(0, Math.min(1, Number(source.volume) || fallback.volume)),
    pan: clampPan(source.pan ?? fallback.pan),
    effects: {
      filter: normalizeFilterSettings(source.effects?.filter ?? source.filter ?? fallback.effects.filter, fallback.effects.filter),
      delay: normalizeDelaySettings(source.effects?.delay ?? source.delay ?? fallback.effects.delay, fallback.effects.delay),
      drift: normalizeDriftSettings(source.effects?.drift ?? source.drift ?? fallback.effects.drift, fallback.effects.drift),
      swell: normalizeSwellSettings(source.effects?.swell ?? source.swell ?? fallback.effects.swell, fallback.effects.swell),
    },
    stepCount: Math.max(1, Math.min(32, Number(source.stepCount) || fallback.stepCount)),
    playbackMode: TRACK_PLAYBACK_MODES.includes(source.playbackMode) ? source.playbackMode : fallback.playbackMode,
    stepProbability: Math.max(0, Math.min(100, Number(source.stepProbability) || fallback.stepProbability)),
    pattern: Array.from({ length: MAX_PATTERN_CELLS }, (_, step) => Boolean(source.pattern?.[step] ?? fallback.pattern[step])),
  };
}

function normalizeVoice(index, source = {}) {
  const fallback = createVoiceConfig(index + 1);
  return {
    ...fallback,
    name: typeof source.name === "string" ? source.name : fallback.name,
    mode: source.mode === "chop" ? "chop" : source.mode === "granular" ? "granular" : fallback.mode,
    reverse: Boolean(source.reverse),
    grainLocation: ["fixed", "sequential", "sweep", "random"].includes(source.grainLocation) ? source.grainLocation : fallback.grainLocation,
    voicePlacement: Math.max(0, Math.min(100, Number(source.voicePlacement) || fallback.voicePlacement)),
    voicePlaybackMode: ["one-shot", "loop", "smooth-loop"].includes(source.voicePlaybackMode) ? source.voicePlaybackMode : fallback.voicePlaybackMode,
    grainSize: Math.max(20, Math.min(350, Number(source.grainSize) || fallback.grainSize)),
    grainDensity: Math.max(2, Math.min(40, Number(source.grainDensity) || fallback.grainDensity)),
    spray: Math.max(0, Math.min(100, Number(source.spray) || fallback.spray)),
    pitch: Math.max(-24, Math.min(24, Number(source.pitch) || fallback.pitch)),
    chopGate: Math.max(10, Math.min(100, Number(source.chopGate) || fallback.chopGate)),
    sliceCount: Math.max(2, Math.min(16, Number(source.sliceCount) || fallback.sliceCount)),
  };
}

function writeStoredSession() {
  const payload = {
    bpm: state.bpm,
    swing: state.swing,
    steps: state.steps,
    selectedTrackIndex: state.selectedTrackIndex,
    selectedVoiceIndex: state.selectedVoiceIndex,
    fillDensity: state.fillDensity,
    mixVolume: state.mixVolume,
    sample: {
      regionStart: state.sample.regionStart,
      regionEnd: state.sample.regionEnd,
    },
    voices: state.voices.map((voice) => ({
      id: voice.id,
      name: voice.name,
      mode: voice.mode,
      reverse: voice.reverse,
      grainLocation: voice.grainLocation,
      voicePlacement: voice.voicePlacement,
      voicePlaybackMode: voice.voicePlaybackMode,
      grainSize: voice.grainSize,
      grainDensity: voice.grainDensity,
      spray: voice.spray,
      pitch: voice.pitch,
      chopGate: voice.chopGate,
      sliceCount: voice.sliceCount,
    })),
    tracks: state.tracks.map((track) => ({
      id: track.id,
      color: track.color,
      voiceIndex: track.voiceIndex,
      scaleMode: track.scaleMode,
      muted: track.muted,
      solo: track.solo,
      volume: track.volume,
      pan: track.pan,
      effects: {
        filter: { ...track.effects.filter },
        delay: { ...track.effects.delay },
        drift: { ...track.effects.drift },
        swell: { ...track.effects.swell },
      },
      stepCount: track.stepCount,
      playbackMode: track.playbackMode,
      stepProbability: track.stepProbability,
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
  state.selectedVoiceIndex = Number.isFinite(stored.selectedVoiceIndex)
    ? Math.max(0, Math.min(TRACK_COUNT - 1, stored.selectedVoiceIndex))
    : 0;
  state.fillDensity = Number.isFinite(stored.fillDensity) ? Math.max(0, Math.min(100, stored.fillDensity)) : state.fillDensity;
  state.mixVolume = Number.isFinite(stored.mixVolume) ? Math.max(0, Math.min(1, stored.mixVolume)) : state.mixVolume;

  if (stored.sample) {
    state.sample.setRegion(
      Number.isFinite(stored.sample.regionStart) ? stored.sample.regionStart : 0,
      Number.isFinite(stored.sample.regionEnd) ? stored.sample.regionEnd : 1,
    );
  }

  if (Array.isArray(stored.voices)) {
    state.voices = Array.from({ length: TRACK_COUNT }, (_, index) => normalizeVoice(index, stored.voices[index]));
  } else if (Array.isArray(stored.tracks)) {
    state.voices = Array.from({ length: TRACK_COUNT }, (_, index) => normalizeVoice(index, stored.tracks[index]));
  }

  if (Array.isArray(stored.tracks)) {
    state.tracks = Array.from({ length: TRACK_COUNT }, (_, index) =>
      normalizeTrack(index, { ...stored.tracks[index], voiceIndex: stored.tracks[index]?.voiceIndex ?? index }),
    );
  } else {
    const legacyTrack = normalizeTrack(0, {
      voiceIndex: 0,
      stepCount: 16,
      playbackMode: "forward",
      pattern: stored.pattern,
    });
    state.voices = [
      normalizeVoice(0, {
        mode: stored.mode,
        reverse: stored.controls?.reverse,
        grainLocation: stored.controls?.grainLocation,
        voicePlacement: stored.controls?.voicePlacement,
        voicePlaybackMode: stored.controls?.voicePlaybackMode,
        grainSize: stored.controls?.grainSize,
        grainDensity: stored.controls?.grainDensity,
        spray: stored.controls?.spray,
        pitch: stored.controls?.pitch,
        chopGate: stored.controls?.chopGate,
        sliceCount: stored.sample?.sliceCount,
      }),
      ...Array.from({ length: TRACK_COUNT - 1 }, (_, index) => createVoiceConfig(index + 2)),
    ];
    state.tracks = [legacyTrack, ...Array.from({ length: TRACK_COUNT - 1 }, (_, index) => createTrack(index + 2))];
  }

  syncAllTrackBuses();
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
      state.sampleLoadingDots = (state.sampleLoadingDots + 1) % 4;
      if (!state.sample.buffer) drawWaveform();
    }, 400);
    return;
  }

  if (state.sampleLoadingIntervalId) {
    window.clearInterval(state.sampleLoadingIntervalId);
    state.sampleLoadingIntervalId = null;
  }
  state.sampleLoadingDots = 0;
}

function hasSoloTrack() {
  return state.tracks.some((track) => track.solo);
}

function isTrackAudible(track) {
  if (track.muted) return false;
  return hasSoloTrack() ? track.solo : true;
}

function syncAllTrackBuses() {
  if (!state.playback) return;
  state.tracks.forEach((track, index) => {
    state.playback.updateTrackBus(index, track);
  });
}

async function loadDefaultSample() {
  if (state.defaultSampleLoaded || state.sample.buffer) return;
  if (state.defaultSampleLoadPromise) return state.defaultSampleLoadPromise;

  state.defaultSampleLoadPromise = (async () => {
    try {
      await loadSampleSource(async () => {
        const response = await fetch(DEFAULT_SAMPLE_URL);
        if (!response.ok) throw new Error(`request failed (${response.status})`);
        const data = await response.arrayBuffer();
        await state.sample.loadArrayBuffer(data, getDecodeAudioContext());
      }, DEFAULT_SAMPLE_NAME, { preview: false, ensureAudioReady: false });
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
    state.playback = new PlaybackLayer(state.audioContext, state.sample, state);
    state.transport = new TransportLayer(state.audioContext, state.playback, state);
    state.transport.onStep = updateCurrentStep;
    state.playback.output.gain.value = state.mixVolume;
  }
  return state.audioContext.resume().then(() => {
    syncAllTrackBuses();
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

function formatVoiceName(track, index) {
  const sourceName = track?.name ?? `Track ${index + 1}`;
  return sourceName.startsWith("Track ") ? sourceName.replace("Track ", "Voice ") : sourceName;
}

function formatTrackName(track, index) {
  return track?.name ?? `Track ${index + 1}`;
}

function formatPanValue(pan) {
  const amount = Math.round(Math.abs(clampPan(pan)) * 100);
  if (amount === 0) return "C";
  return `${clampPan(pan) < 0 ? "L" : "R"}${amount}`;
}

function formatPanSweepValue(value) {
  if (value === 0) return "C";
  return `${value < 0 ? "L" : "R"}${Math.abs(value)}`;
}

function getPanRotation(pan) {
  return clampPan(pan) * 135;
}

function setTrackVolumeFromMeter(trackIndex, clientY, meterElement) {
  if (!(meterElement instanceof HTMLElement)) return;
  const rect = meterElement.getBoundingClientRect();
  if (rect.height <= 0) return;
  const normalized = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  const track = state.tracks[trackIndex];
  if (!track) return;
  track.volume = normalized;
  state.playback?.updateTrackBus(trackIndex, track);
  paintMixerModulation();
  writeStoredSession();
}

function bindMixerMeter(meterElement, trackIndex) {
  if (!(meterElement instanceof HTMLElement)) return;
  meterElement.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    state.selectedTrackIndex = trackIndex;
    syncUi();
    syncMixerSelection();
    renderTrackSelector();
    renderEffectsMatrix();
    renderPattern();
    renderPitchLanes();
    writeStoredSession();
    setTrackVolumeFromMeter(trackIndex, event.clientY, meterElement);
    meterElement.setPointerCapture(event.pointerId);
  });

  meterElement.addEventListener("pointermove", (event) => {
    if (!meterElement.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    setTrackVolumeFromMeter(trackIndex, event.clientY, meterElement);
  });
}

function bindMixerPanKnob(knobElement, trackIndex) {
  if (!(knobElement instanceof HTMLElement)) return;
  knobElement.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const track = state.tracks[trackIndex];
    if (!track) return;
    state.selectedTrackIndex = trackIndex;
    syncUi();
    syncMixerSelection();
    renderTrackSelector();
    renderEffectsMatrix();
    renderPattern();
    renderPitchLanes();
    writeStoredSession();

    const startY = event.clientY;
    const startPan = clampPan(track.pan);
    knobElement.setPointerCapture(event.pointerId);

    const handleMove = (moveEvent) => {
      if (!knobElement.hasPointerCapture(moveEvent.pointerId)) return;
      moveEvent.preventDefault();
      const delta = (startY - moveEvent.clientY) / 80;
      track.pan = clampPan(startPan + delta);
      state.playback?.updateTrackBus(trackIndex, track);
      paintMixerModulation();
      writeStoredSession();
    };

    const handleEnd = (endEvent) => {
      if (knobElement.hasPointerCapture(endEvent.pointerId)) {
        knobElement.releasePointerCapture(endEvent.pointerId);
      }
      knobElement.removeEventListener("pointermove", handleMove);
      knobElement.removeEventListener("pointerup", handleEnd);
      knobElement.removeEventListener("pointercancel", handleEnd);
    };

    knobElement.addEventListener("pointermove", handleMove);
    knobElement.addEventListener("pointerup", handleEnd);
    knobElement.addEventListener("pointercancel", handleEnd);
  });
}

function getMidiPitchClass(midiNote) {
  return ((midiNote % 12) + 12) % 12;
}

function isBlackKey(midiNote) {
  return [1, 3, 6, 8, 10].includes(getMidiPitchClass(midiNote));
}

function getTrackPitchMidi(track) {
  const voice = getTrackVoice(track);
  return PITCH_LANE_REFERENCE_MIDI + voice.pitch;
}

function isMidiNoteInTrackScale(track, midiNote) {
  const scale = getScaleDefinition(track.scaleMode);
  if (scale.value === "chromatic") return true;
  const relativePitchClass = (getMidiPitchClass(midiNote) - D_ROOT_PITCH_CLASS + 12) % 12;
  return scale.intervals.includes(relativePitchClass);
}

function getTrackModulationValues(track, timeSeconds = 0) {
  const drift = getTrackDrift(track);
  const swell = getTrackSwell(track);
  const driftPhase = drift.enabled ? Math.sin((timeSeconds / Math.max(0.001, clampLfoRateMs(drift.rate, 1500) / 1000)) * Math.PI * 2) : 0;
  const swellPhase = swell.enabled ? Math.sin((timeSeconds / Math.max(0.001, clampLfoRateMs(swell.rate, 1800) / 1000)) * Math.PI * 2) : 0;
  const driftNormalized = (driftPhase + 1) / 2;
  const swellNormalized = (swellPhase + 1) / 2;

  return {
    pan: clampPan((drift.rangeMin + (drift.rangeMax - drift.rangeMin) * driftNormalized) / 100),
    volume: Math.max(0, Math.min(1, (swell.rangeMin + (swell.rangeMax - swell.rangeMin) * swellNormalized) / 100)),
  };
}

function paintMixerModulation() {
  if (!ui.mixerGrid) return;
  const timeSeconds = state.audioContext ? state.audioContext.currentTime : 0;
  const transportRunning = isTransportRunning();
  ui.mixerGrid.querySelectorAll(".mixer-strip").forEach((strip) => {
    const trackIndex = Number(strip.dataset.trackIndex);
    const track = state.tracks[trackIndex];
    if (!track) return;
    const previousVolume = Number(strip.dataset.displayVolume);
    const previousPan = Number(strip.dataset.displayPan);
    const modulation = transportRunning
      ? getTrackModulationValues(track, timeSeconds)
      : {
        pan: Number.isFinite(previousPan) ? previousPan : clampPan(track.pan),
        volume: Number.isFinite(previousVolume) ? previousVolume : Math.max(0, Math.min(1, track.volume)),
    };
    strip.dataset.displayVolume = String(modulation.volume);
    strip.dataset.displayPan = String(modulation.pan);

    const meter = strip.querySelector('[data-mixer-role="volume"]');
    if (meter instanceof HTMLElement) {
      meter.style.setProperty("--meter-fill", `${Math.round(modulation.volume * 100)}%`);
    }
    const volumeValue = strip.querySelector('[data-mixer-value="volume"]');
    if (volumeValue instanceof HTMLElement) {
      volumeValue.textContent = `${Math.round(modulation.volume * 100)}%`;
    }

    const panKnob = strip.querySelector('[data-mixer-role="pan"]');
    if (panKnob instanceof HTMLElement) {
      panKnob.style.setProperty("--pan-rotation", `${getPanRotation(modulation.pan)}deg`);
    }
    const panValue = strip.querySelector('[data-mixer-value="pan"]');
    if (panValue instanceof HTMLElement) {
      panValue.textContent = formatPanValue(modulation.pan);
    }
  });
}

function syncMixerSelection() {
  if (!ui.mixerGrid) return;
  ui.mixerGrid.querySelectorAll(".mixer-strip").forEach((strip) => {
    const trackIndex = Number(strip.dataset.trackIndex);
    strip.classList.toggle("active", trackIndex === state.selectedTrackIndex);
  });
}

function animateMixerModulation() {
  paintMixerModulation();
  if (!isTransportRunning()) {
    state.mixerAnimationFrameId = null;
    return;
  }
  state.mixerAnimationFrameId = window.requestAnimationFrame(animateMixerModulation);
}

function ensureMixerAnimation() {
  if (state.mixerAnimationFrameId || !isTransportRunning()) return;
  state.mixerAnimationFrameId = window.requestAnimationFrame(animateMixerModulation);
}

function getTrackVoice(track) {
  return state.voices[Math.max(0, Math.min(TRACK_COUNT - 1, track.voiceIndex ?? 0))] ?? createVoiceConfig(1);
}

function getTrackPlaybackSettings(track) {
  const voice = getTrackVoice(track);
  return {
    ...track,
    mode: voice.mode,
    reverse: voice.reverse,
    grainLocation: voice.grainLocation,
    voicePlacement: voice.voicePlacement,
    voicePlaybackMode: voice.voicePlaybackMode,
    grainSize: voice.grainSize,
    grainDensity: voice.grainDensity,
    spray: voice.spray,
    pitch: voice.pitch,
    chopGate: voice.chopGate,
    sliceCount: voice.sliceCount,
    voiceName: voice.name,
    voiceId: voice.id,
    trackIndex: track.id - 1,
  };
}

function renderPatternVoiceOptions() {
  if (!ui.patternVoiceSelect) return;
  ui.patternVoiceSelect.innerHTML = "";
  state.voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatVoiceName(voice, index);
    ui.patternVoiceSelect.append(option);
  });
}

function renderPitchLanes() {
  if (!ui.pitchLanes) return;
  ui.pitchLanes.innerHTML = "";

  state.tracks.forEach((track, index) => {
    const lane = document.createElement("div");
    lane.className = "pitch-lane";

    const label = document.createElement("button");
    label.className = `pitch-lane-label${index === state.selectedTrackIndex ? " active" : ""}`;
    applyTrackColor(label, track.color);
    label.textContent = formatTrackName(track, index);
    label.addEventListener("click", () => {
      state.selectedTrackIndex = index;
      syncUi();
      renderTrackSelector();
      renderEffectsMatrix();
      renderMixer();
      renderPattern();
      renderPitchLanes();
      writeStoredSession();
    });
    lane.append(label);

    const keyboard = document.createElement("div");
    keyboard.className = "pitch-keyboard";
    keyboard.style.setProperty("--track-color", track.color);
    keyboard.style.setProperty("--track-color-soft", hexToRgba(track.color, 0.16));
    keyboard.style.setProperty("--track-color-strong", hexToRgba(track.color, 0.34));

    const activeMidi = Math.max(
      PITCH_LANE_START_MIDI,
      Math.min(PITCH_LANE_START_MIDI + PITCH_LANE_NOTE_COUNT - 1, getTrackPitchMidi(track)),
    );
    for (let noteIndex = 0; noteIndex < PITCH_LANE_NOTE_COUNT; noteIndex += 1) {
      const midiNote = PITCH_LANE_START_MIDI + noteIndex;
      const key = document.createElement("div");
      key.className = "pitch-key";
      if (isBlackKey(midiNote)) key.classList.add("is-black");
      if (getMidiPitchClass(midiNote) === D_ROOT_PITCH_CLASS) key.classList.add("is-root");
      if (!isMidiNoteInTrackScale(track, midiNote)) key.classList.add("is-out-of-scale");
      if (midiNote === activeMidi) {
        key.classList.add("is-active");
      }
      key.title = `${NOTE_NAMES[getMidiPitchClass(midiNote)]}${Math.floor(midiNote / 12) - 1}`;
      keyboard.append(key);
    }

    lane.append(keyboard);

    const scaleSelect = document.createElement("select");
    scaleSelect.className = "pitch-scale-select";
    SCALE_OPTIONS.forEach((option) => {
      const element = document.createElement("option");
      element.value = option.value;
      element.textContent = option.label;
      scaleSelect.append(element);
    });
    scaleSelect.value = track.scaleMode;
    scaleSelect.addEventListener("change", () => {
      track.scaleMode = normalizeScaleMode(scaleSelect.value, track.scaleMode);
      renderPitchLanes();
      writeStoredSession();
    });
    lane.append(scaleSelect);

    ui.pitchLanes.append(lane);
  });
}

function formatFilterTypeLabel(type) {
  if (type === "highpass") return "HP";
  if (type === "bandpass") return "BP";
  return "LP";
}

function formatDelayTime(value) {
  const safeValue = clampDelayTime(value);
  return safeValue >= 1000 ? `${(safeValue / 1000).toFixed(2)} s` : `${Math.round(safeValue)} ms`;
}

function formatPercent(value, max = 100) {
  return `${Math.round(Math.max(0, Math.min(max, Number(value) || 0)))}%`;
}

function formatFilterFrequency(value) {
  const safeValue = clampFilterFrequency(value);
  return safeValue >= 1000 ? `${(safeValue / 1000).toFixed(2)} kHz` : `${Math.round(safeValue)} Hz`;
}

function formatFilterQ(value) {
  return clampFilterQ(value).toFixed(1);
}

function getTrackVisibleCellCount(track) {
  return Math.max(1, Math.min(MAX_PATTERN_CELLS, track.stepCount ?? 16));
}

function getTrackTriggerDuration(track) {
  return (60 / state.bpm) * 4 / getTrackVisibleCellCount(track);
}

function getTrackScheduleSlot(track, baseStep) {
  return Math.floor((baseStep * getTrackVisibleCellCount(track)) / BASE_GRID_STEPS);
}

function shouldAdvanceTrackStep(track, baseStep) {
  const playbackState = state.trackPlaybackState[track.id - 1] ?? createTrackPlaybackState(track);
  const slot = getTrackScheduleSlot(track, baseStep);
  if (slot === playbackState.lastScheduledSlot) return false;
  playbackState.lastScheduledSlot = slot;
  state.trackPlaybackState[track.id - 1] = playbackState;
  return true;
}

function resolveTrackPatternStep(track, { advance = false } = {}) {
  const stepCount = getTrackVisibleCellCount(track);
  const playbackState = state.trackPlaybackState[track.id - 1] ?? createTrackPlaybackState(track);
  let index = 0;

  if (track.playbackMode === "random") {
    index = Math.floor(Math.random() * stepCount);
    if (advance) playbackState.lastPatternIndex = index;
    state.trackPlaybackState[track.id - 1] = playbackState;
    return index;
  }

  index = Math.max(0, Math.min(stepCount - 1, playbackState.patternIndex));
  if (advance) {
    playbackState.lastPatternIndex = index;
    if (track.playbackMode === "reverse") {
      playbackState.patternIndex = index > 0 ? index - 1 : stepCount - 1;
    } else if (track.playbackMode === "ping-pong" && stepCount > 1) {
      const nextIndex = index + playbackState.patternDirection;
      if (nextIndex >= stepCount || nextIndex < 0) {
        playbackState.patternDirection *= -1;
        playbackState.patternIndex = index + playbackState.patternDirection;
      } else {
        playbackState.patternIndex = nextIndex;
      }
    } else {
      playbackState.patternIndex = (index + 1) % stepCount;
    }
  }
  state.trackPlaybackState[track.id - 1] = playbackState;
  return index;
}

function resolvePlaybackSliceIndex(track, { advance = false } = {}) {
  const playbackTrack = getTrackPlaybackSettings(track);
  const maxSliceIndex = Math.max(0, playbackTrack.sliceCount - 1);
  const playbackState = state.trackPlaybackState[track.id - 1] ?? { sequentialIndex: 0, sweepIndex: 0, sweepDirection: 1 };

  if (playbackTrack.grainLocation === "fixed") return 0;
  if (playbackTrack.grainLocation === "random") return Math.floor(Math.random() * (maxSliceIndex + 1));

  if (playbackTrack.grainLocation === "sequential") {
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

function getTrackDelay(trackOrIndex) {
  const track = Number.isInteger(trackOrIndex) ? state.tracks[trackOrIndex] : trackOrIndex;
  return track?.effects?.delay ?? createDefaultDelaySettings();
}

function getTrackDrift(trackOrIndex) {
  const track = Number.isInteger(trackOrIndex) ? state.tracks[trackOrIndex] : trackOrIndex;
  return track?.effects?.drift ?? createDefaultDriftSettings();
}

function getTrackSwell(trackOrIndex) {
  const track = Number.isInteger(trackOrIndex) ? state.tracks[trackOrIndex] : trackOrIndex;
  return track?.effects?.swell ?? createDefaultSwellSettings();
}

function formatLfoRate(ms) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 2)} s`;
  return `${Math.round(ms)} ms`;
}

function syncDualRange(container, minValue, maxValue, minAllowed, maxAllowed) {
  if (!(container instanceof HTMLElement)) return;
  const span = Math.max(1, maxAllowed - minAllowed);
  const start = ((minValue - minAllowed) / span) * 100;
  const end = ((maxValue - minAllowed) / span) * 100;
  container.style.setProperty("--range-start", `${start}%`);
  container.style.setProperty("--range-end", `${end}%`);
}

function bindDualRangeBar(container, minInput, maxInput, minAllowed, maxAllowed, onChange) {
  if (!(container instanceof HTMLElement) || !(minInput instanceof HTMLInputElement) || !(maxInput instanceof HTMLInputElement)) return;
  container.addEventListener("pointerdown", (event) => {
    if (event.target === minInput || event.target === maxInput) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const normalized = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const nextValue = Math.round(minAllowed + normalized * (maxAllowed - minAllowed));
    const currentMin = Number(minInput.value);
    const currentMax = Number(maxInput.value);

    if (Math.abs(nextValue - currentMin) <= Math.abs(nextValue - currentMax)) {
      minInput.value = String(Math.min(nextValue, currentMax));
    } else {
      maxInput.value = String(Math.max(nextValue, currentMin));
    }

    onChange();
  });
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

function syncDelayOverlay() {
  if (!ui.delayOverlay) return;
  const isOpen = state.delayOverlay.open;
  ui.delayOverlay.classList.toggle("is-hidden", !isOpen);
  ui.delayOverlay.setAttribute("aria-hidden", String(!isOpen));
  if (!isOpen) return;

  const track = state.tracks[state.delayOverlay.trackIndex] ?? getSelectedTrack();
  const delay = getTrackDelay(track);
  if (ui.delayOverlayTrack) {
    ui.delayOverlayTrack.textContent = `${track.name} • Delay ${delay.enabled ? "enabled" : "disabled"}`;
  }
  ui.delayTime.value = String(delay.time);
  ui.delayTimeValue.textContent = formatDelayTime(delay.time);
  ui.delayFeedback.value = String(delay.feedback);
  ui.delayFeedbackValue.textContent = formatPercent(delay.feedback, 95);
  ui.delayDecay.value = String(delay.decay);
  ui.delayDecayValue.textContent = formatPercent(delay.decay);
  ui.delayTone.value = String(delay.tone);
  ui.delayToneValue.textContent = formatPercent(delay.tone);
  ui.delayMix.value = String(delay.mix);
  ui.delayMixValue.textContent = formatPercent(delay.mix);
}

function syncDriftOverlay() {
  if (!ui.driftOverlay) return;
  const isOpen = state.driftOverlay.open;
  ui.driftOverlay.classList.toggle("is-hidden", !isOpen);
  ui.driftOverlay.setAttribute("aria-hidden", String(!isOpen));
  if (!isOpen) return;

  const track = state.tracks[state.driftOverlay.trackIndex] ?? getSelectedTrack();
  const drift = getTrackDrift(track);
  if (ui.driftOverlayTrack) {
    ui.driftOverlayTrack.textContent = `${track.name} • Drift ${drift.enabled ? "enabled" : "disabled"}`;
  }
  ui.driftRate.value = String(drift.rate);
  ui.driftRangeMin.value = String(drift.rangeMin);
  ui.driftRangeMax.value = String(drift.rangeMax);
  ui.driftRangeMinValue.textContent = formatPanSweepValue(drift.rangeMin);
  ui.driftRangeMaxValue.textContent = formatPanSweepValue(drift.rangeMax);
  syncDualRange(ui.driftRange, drift.rangeMin, drift.rangeMax, -100, 100);
}

function syncSwellOverlay() {
  if (!ui.swellOverlay) return;
  const isOpen = state.swellOverlay.open;
  ui.swellOverlay.classList.toggle("is-hidden", !isOpen);
  ui.swellOverlay.setAttribute("aria-hidden", String(!isOpen));
  if (!isOpen) return;

  const track = state.tracks[state.swellOverlay.trackIndex] ?? getSelectedTrack();
  const swell = getTrackSwell(track);
  if (ui.swellOverlayTrack) {
    ui.swellOverlayTrack.textContent = `${track.name} • Swell ${swell.enabled ? "enabled" : "disabled"}`;
  }
  ui.swellRate.value = String(swell.rate);
  ui.swellRangeMin.value = String(swell.rangeMin);
  ui.swellRangeMax.value = String(swell.rangeMax);
  ui.swellRangeMinValue.textContent = `${swell.rangeMin}%`;
  ui.swellRangeMaxValue.textContent = `${swell.rangeMax}%`;
  syncDualRange(ui.swellRange, swell.rangeMin, swell.rangeMax, 0, 100);
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

async function loadSampleSource(loader, sampleName, { preview = true, ensureAudioReady = true } = {}) {
  try {
    state.sampleLoading = true;
    syncSampleLoadingAnimation();
    drawWaveform();
    if (ensureAudioReady) await ensureAudio();
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
    await state.sample.loadArrayBuffer(data, state.audioContext ?? getDecodeAudioContext());
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
  state.delayOverlay.open = false;
  state.driftOverlay.open = false;
  state.swellOverlay.open = false;
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

function openDelayOverlay(trackIndex) {
  state.selectedTrackIndex = trackIndex;
  state.filterOverlay.open = false;
  state.driftOverlay.open = false;
  state.swellOverlay.open = false;
  state.delayOverlay = {
    open: true,
    trackIndex,
    effectKey: "delay",
  };
  syncUi();
  renderTrackSelector();
  renderEffectsMatrix();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

function closeDelayOverlay() {
  state.delayOverlay.open = false;
  syncDelayOverlay();
}

function openDriftOverlay(trackIndex) {
  state.selectedTrackIndex = trackIndex;
  state.filterOverlay.open = false;
  state.delayOverlay.open = false;
  state.swellOverlay.open = false;
  state.driftOverlay = {
    open: true,
    trackIndex,
    effectKey: "drift",
  };
  syncUi();
  renderTrackSelector();
  renderEffectsMatrix();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

function closeDriftOverlay() {
  state.driftOverlay.open = false;
  syncDriftOverlay();
}

function openSwellOverlay(trackIndex) {
  state.selectedTrackIndex = trackIndex;
  state.filterOverlay.open = false;
  state.delayOverlay.open = false;
  state.driftOverlay.open = false;
  state.swellOverlay = {
    open: true,
    trackIndex,
    effectKey: "swell",
  };
  syncUi();
  renderTrackSelector();
  renderEffectsMatrix();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

function closeSwellOverlay() {
  state.swellOverlay.open = false;
  syncSwellOverlay();
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
  const playbackTrack = getTrackPlaybackSettings(track);

  if (playbackTrack.mode === "chop") {
    const slices = state.sample.getSlices(playbackTrack.sliceCount);
    if (!slices.length) return;
    const resolvedIndex = sliceIndex ?? (trackIndex % slices.length);
    const slice = slices[resolvedIndex % slices.length];
    const { startTime, endTime } = state.sample.getRegionBounds();
    const sliceDuration = Math.max(0.03, slice.duration * (playbackTrack.chopGate / 100));
    const fixedStart = startTime + Math.max(0, endTime - startTime - sliceDuration) * ((playbackTrack.voicePlacement ?? 50) / 100);
    const indicatorStart = playbackTrack.grainLocation === "fixed" ? fixedStart : slice.start;
    setTrackIndicator(trackIndex, indicatorStart, indicatorStart + sliceDuration, 220);
    return;
  }

  const grainWindow = resolveGrainWindow(playbackTrack, sliceIndex);
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
    const playbackTrack = getTrackPlaybackSettings(track);
    const laneTop = laneHeight * trackIndex;
    const laneBottom = laneTop + laneHeight;
    const laneMiddle = laneTop + laneHeight / 2;
    const laneInset = 3;
    const sliceHeight = Math.max(8, laneHeight - laneInset * 2);

    ctx.fillStyle = trackIndex === state.selectedTrackIndex ? hexToRgba(track.color, 0.12) : hexToRgba(track.color, 0.05);
    ctx.fillRect(viewportLeft, laneTop, viewportWidth, laneHeight);

    ctx.strokeStyle = hexToRgba(track.color, trackIndex === state.selectedTrackIndex ? 0.8 : 0.42);
    ctx.lineWidth = trackIndex === state.selectedTrackIndex ? 1.5 : 1;
    state.sample.getSlices(playbackTrack.sliceCount).forEach((slice, sliceIndex) => {
      const sliceX = timeToViewportX(slice.start, viewport.startTime, viewport.endTime, viewportLeft, viewportWidth);
      if (sliceX < viewportLeft || sliceX > viewportRight) return;
      ctx.beginPath();
      ctx.moveTo(sliceX, laneTop + laneInset);
      ctx.lineTo(sliceX, laneBottom - laneInset);
      ctx.stroke();

      if (sliceIndex === playbackTrack.sliceCount - 1) {
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
    ctx.fillText(formatVoiceName(getTrackVoice(track), track.voiceIndex), labelLeft, laneMiddle);
  });

  drawWaveformOverview();
}

function updateCurrentStep(activeStep = -1) {
  ui.patternGrid.querySelectorAll(".step").forEach((button) => {
    if (activeStep < 0) {
      button.classList.remove("current");
      return;
    }
    const trackIndex = Number(button.dataset.trackIndex);
    const cellIndex = Number(button.dataset.cellIndex);
    const currentIndex = state.trackPlaybackState[trackIndex]?.lastPatternIndex ?? -1;
    button.classList.toggle("current", cellIndex === currentIndex);
  });
}

function renderTrackSelector() {
  ui.trackSelector.innerHTML = "";
  state.voices.forEach((voice, index) => {
    const chip = document.createElement("div");
    chip.className = `track-chip${index === state.selectedVoiceIndex ? " active" : ""}`;
    applyTrackColor(chip, TRACK_COLORS[index % TRACK_COLORS.length]);

    const selectButton = document.createElement("button");
    selectButton.className = "track-chip-main";
    selectButton.innerHTML = `<span class="track-chip-name">${formatVoiceName(voice, index)}</span><span class="track-chip-mode">${formatModeLabel(voice.mode)}</span>`;
    selectButton.addEventListener("click", () => {
      state.selectedVoiceIndex = index;
      syncUi();
      renderTrackSelector();
      renderEffectsMatrix();
      renderMixer();
      renderPattern();
      drawWaveform();
      writeStoredSession();
    });
    chip.append(selectButton);
    ui.trackSelector.append(chip);
  });
}

function renderMixer() {
  ui.mixerGrid.innerHTML = "";
  state.tracks.forEach((track, index) => {
    const strip = document.createElement("div");
    strip.className = `mixer-strip${index === state.selectedTrackIndex ? " active" : ""}`;
    strip.dataset.trackIndex = String(index);
    applyTrackColor(strip, track.color);

    const head = document.createElement("div");
    head.className = "mixer-head";
    head.innerHTML = `<span class="mixer-name">${formatTrackName(track, index)}</span>`;
    strip.append(head);

    const controls = document.createElement("div");
    controls.className = "mixer-controls";

    const volumeValue = document.createElement("span");
    volumeValue.className = "mixer-meter-value";
    volumeValue.dataset.mixerValue = "volume";
    volumeValue.textContent = `${Math.round(track.volume * 100)}%`;
    controls.append(volumeValue);

    const meter = document.createElement("div");
    meter.className = "mixer-meter";
    meter.dataset.mixerRole = "volume";
    meter.style.setProperty("--meter-fill", `${Math.round(track.volume * 100)}%`);
    meter.innerHTML = '<div class="mixer-meter-fill"></div><div class="mixer-meter-thumb"></div>';
    bindMixerMeter(meter, index);
    controls.append(meter);

    const panKnob = document.createElement("button");
    panKnob.type = "button";
    panKnob.className = "mixer-pan-knob";
    panKnob.dataset.mixerRole = "pan";
    panKnob.style.setProperty("--pan-rotation", `${getPanRotation(track.pan)}deg`);
    panKnob.setAttribute("aria-label", `Pan ${formatTrackName(track, index)}`);
    bindMixerPanKnob(panKnob, index);
    controls.append(panKnob);

    const panValue = document.createElement("span");
    panValue.className = "mixer-pan-value";
    panValue.dataset.mixerValue = "pan";
    panValue.textContent = formatPanValue(track.pan);
    controls.append(panValue);

    const actionRow = document.createElement("div");
    actionRow.className = "mixer-action-row";

    const muteButton = document.createElement("button");
    muteButton.className = `mixer-mini${track.muted ? " active" : ""}`;
    muteButton.textContent = "Mute";
    applyTrackColor(muteButton, track.color);
    muteButton.addEventListener("click", () => {
      track.muted = !track.muted;
      if (track.muted) track.solo = false;
      syncUi();
      renderTrackSelector();
      renderEffectsMatrix();
      renderMixer();
      renderPattern();
      renderPitchLanes();
      writeStoredSession();
    });
    actionRow.append(muteButton);

    const soloButton = document.createElement("button");
    soloButton.className = `mixer-mini${track.solo ? " active" : ""}`;
    soloButton.textContent = "Solo";
    applyTrackColor(soloButton, track.color);
    soloButton.addEventListener("click", () => {
      track.solo = !track.solo;
      if (track.solo) track.muted = false;
      syncUi();
      renderTrackSelector();
      renderEffectsMatrix();
      renderMixer();
      renderPattern();
      renderPitchLanes();
      writeStoredSession();
    });
    actionRow.append(soloButton);

    controls.append(actionRow);
    strip.append(controls);
    ui.mixerGrid.append(strip);
  });
  paintMixerModulation();
  syncMixerSelection();
  ensureMixerAnimation();
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
    labelCell.textContent =
      effectKey === "filter"
        ? "Filter"
        : effectKey === "delay"
          ? "Delay"
          : effectKey === "drift"
            ? "Drift"
            : effectKey === "swell"
              ? "Swell"
              : effectKey;
    row.append(labelCell);

    state.tracks.forEach((track, trackIndex) => {
      const effect = track.effects[effectKey];
      const button = document.createElement("button");
      button.className = `effects-cell effects-toggle${effect.enabled ? " active" : ""}${trackIndex === state.selectedTrackIndex ? " selected" : ""}`;
      applyTrackColor(button, track.color);
      button.textContent = effect.enabled
        ? (
          effectKey === "filter"
            ? formatFilterTypeLabel(effect.type)
            : effectKey === "delay"
              ? formatDelayTime(effect.time)
              : effectKey === "drift" || effectKey === "swell"
                ? formatLfoRate(effect.rate)
                : "On"
        )
        : "Off";
      button.title = `${track.name} ${effectKey} ${effect.enabled ? "enabled" : "disabled"}`;

      let holdTimer = null;
      let holdTriggered = false;

      button.addEventListener("click", () => {
        if (holdTriggered) {
          holdTriggered = false;
          return;
        }
        track.effects[effectKey].enabled = !track.effects[effectKey].enabled;
        state.playback?.updateTrackBus(trackIndex, track);
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
          if (effectKey === "filter") openFilterOverlay(trackIndex);
          if (effectKey === "delay") openDelayOverlay(trackIndex);
          if (effectKey === "drift") openDriftOverlay(trackIndex);
          if (effectKey === "swell") openSwellOverlay(trackIndex);
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
    label.innerHTML = `<span class="pattern-row-name">${formatTrackName(track, trackIndex)}</span>`;
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
      stepButton.className = `step${enabled ? " active" : ""}`;
      applyTrackColor(stepButton, track.color);
      stepButton.dataset.trackIndex = String(trackIndex);
      stepButton.dataset.cellIndex = String(cellIndex);
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
  const voice = getSelectedVoice();
  renderPatternVoiceOptions();
  ui.sliceCountValue.textContent = String(voice.sliceCount);
  ui.mode.value = voice.mode;
  ui.grainLocation.value = voice.grainLocation;
  ui.voicePlacement.value = String(voice.voicePlacement);
  ui.voicePlacementValue.textContent = `${voice.voicePlacement}%`;
  ui.voicePlaybackMode.value = voice.voicePlaybackMode;
  ui.voicePlacement.disabled = voice.grainLocation !== "fixed";
  ui.voicePlacementField.classList.toggle("is-disabled", voice.grainLocation !== "fixed");
  ui.grainSize.value = String(voice.grainSize);
  ui.grainSizeValue.textContent = String(voice.grainSize);
  ui.grainDensity.value = String(voice.grainDensity);
  ui.grainDensityValue.textContent = String(voice.grainDensity);
  ui.spray.value = String(voice.spray);
  ui.sprayValue.textContent = (voice.spray / 100).toFixed(2);
  ui.pitch.value = String(voice.pitch);
  ui.pitchValue.textContent = String(voice.pitch);
  ui.chopGate.value = String(voice.chopGate);
  ui.chopGateValue.textContent = `${voice.chopGate}%`;
  ui.reverse.checked = voice.reverse;
  ui.bpm.value = String(state.bpm);
  ui.bpmValue.textContent = String(state.bpm);
  ui.swing.value = String(state.swing);
  ui.swingValue.textContent = `${state.swing}%`;
  ui.trackSteps.value = String(track.stepCount);
  ui.trackStepsValue.textContent = String(track.stepCount);
  ui.trackPlaybackMode.value = track.playbackMode;
  ui.trackStepProbability.value = String(track.stepProbability);
  ui.trackStepProbabilityValue.textContent = `${track.stepProbability}%`;
  ui.patternVoiceSelect.value = String(track.voiceIndex);
  ui.fillDensity.value = String(state.fillDensity);
  ui.mixVolume.value = String(Math.round(state.mixVolume * 100));
  ui.mixVolumeValue.textContent = `${Math.round(state.mixVolume * 100)}%`;
  ui.fillDensityValue.textContent = `${state.fillDensity}%`;
  [
    ui.patternVoiceSelect?.closest(".pattern-rate-control"),
    ui.trackSteps?.closest(".pattern-rate-control"),
    ui.trackPlaybackMode?.closest(".pattern-rate-control"),
    ui.trackStepProbability?.closest(".pattern-rate-control"),
  ].forEach((control) => {
    if (!(control instanceof HTMLElement)) return;
    control.classList.add("is-track-active");
    applyTrackColor(control, track.color);
  });
  renderPitchLanes();
  syncTransportButton();
  syncFilterOverlay();
  syncDelayOverlay();
  syncDriftOverlay();
  syncSwellOverlay();
  ui.regionStart.value = String(Math.round(state.sample.regionStart * 1000));
  ui.regionEnd.value = String(Math.round(state.sample.regionEnd * 1000));
  ui.sliceCount.value = String(voice.sliceCount);

  if (!ui.sampleStatus) return;

  ui.sampleStatus.textContent = state.sample.buffer ? state.currentSampleName : "";
  refreshRangeFills();
}

function updateSelectedTrack(patch) {
  Object.assign(getSelectedTrack(), patch);
  if ("stepCount" in patch || "playbackMode" in patch || "voiceIndex" in patch) resetTrackPlaybackState(state.selectedTrackIndex);
  state.playback?.updateTrackBus(state.selectedTrackIndex, getSelectedTrack());
  syncUi();
  renderTrackSelector();
  renderEffectsMatrix();
  renderMixer();
  renderPattern();
  drawWaveform();
  writeStoredSession();
}

function updateSelectedVoice(patch) {
  Object.assign(getSelectedVoice(), patch);
  state.tracks.forEach((track, index) => {
    if (track.voiceIndex !== state.selectedVoiceIndex) return;
    state.playback?.updateTrackBus(index, track);
    if ("grainLocation" in patch || "sliceCount" in patch) resetTrackPlaybackState(index);
  });
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
  state.playback?.updateTrackBus(trackIndex, track);
  syncUi();
  renderEffectsMatrix();
  writeStoredSession();
}

function updateTrackDelay(trackIndex, patch) {
  const track = state.tracks[trackIndex];
  if (!track) return;
  track.effects.delay = normalizeDelaySettings({ ...track.effects.delay, ...patch }, track.effects.delay);
  state.playback?.updateTrackBus(trackIndex, track);
  syncUi();
  renderEffectsMatrix();
  writeStoredSession();
}

function updateTrackDrift(trackIndex, patch) {
  const track = state.tracks[trackIndex];
  if (!track) return;
  track.effects.drift = normalizeDriftSettings({ ...track.effects.drift, ...patch }, track.effects.drift);
  state.playback?.updateTrackBus(trackIndex, track);
  syncUi();
  renderEffectsMatrix();
  writeStoredSession();
}

function updateTrackSwell(trackIndex, patch) {
  const track = state.tracks[trackIndex];
  if (!track) return;
  track.effects.swell = normalizeSwellSettings({ ...track.effects.swell, ...patch }, track.effects.swell);
  state.playback?.updateTrackBus(trackIndex, track);
  syncUi();
  renderEffectsMatrix();
  writeStoredSession();
}

function sanitizeIntegerField(input, fallback) {
  if (!(input instanceof HTMLInputElement)) return fallback;
  const value = clampIntegerText(input.value, fallback);
  input.value = String(value);
  return value;
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

document.addEventListener("input", (event) => {
  if (!(event.target instanceof HTMLInputElement) || event.target.type !== "range") return;
  updateRangeFill(event.target);
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
  updateSelectedVoice({ sliceCount: Number(ui.sliceCount.value) });
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

ui.mode.addEventListener("change", () => updateSelectedVoice({ mode: ui.mode.value }));
ui.grainLocation.addEventListener("change", () => updateSelectedVoice({ grainLocation: ui.grainLocation.value }));
ui.voicePlacement.addEventListener("input", () => updateSelectedVoice({ voicePlacement: Number(ui.voicePlacement.value) }));
ui.voicePlaybackMode.addEventListener("change", () => updateSelectedVoice({ voicePlaybackMode: ui.voicePlaybackMode.value }));
ui.trackSteps.addEventListener("input", () => updateSelectedTrack({ stepCount: Number(ui.trackSteps.value) }));
ui.trackPlaybackMode.addEventListener("change", () => updateSelectedTrack({ playbackMode: ui.trackPlaybackMode.value }));
ui.trackStepProbability.addEventListener("input", () => updateSelectedTrack({ stepProbability: Number(ui.trackStepProbability.value) }));
ui.patternVoiceSelect.addEventListener("change", () => {
  updateSelectedTrack({ voiceIndex: Number(ui.patternVoiceSelect.value) });
});
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
ui.grainSize.addEventListener("input", () => updateSelectedVoice({ grainSize: Number(ui.grainSize.value) }));
ui.grainDensity.addEventListener("input", () => updateSelectedVoice({ grainDensity: Number(ui.grainDensity.value) }));
ui.spray.addEventListener("input", () => updateSelectedVoice({ spray: Number(ui.spray.value) }));
ui.pitch.addEventListener("input", () => updateSelectedVoice({ pitch: Number(ui.pitch.value) }));
ui.chopGate.addEventListener("input", () => updateSelectedVoice({ chopGate: Number(ui.chopGate.value) }));
ui.reverse.addEventListener("change", () => updateSelectedVoice({ reverse: ui.reverse.checked }));
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
ui.delayTime.addEventListener("input", () => {
  updateTrackDelay(state.delayOverlay.trackIndex, { time: Number(ui.delayTime.value) });
});
ui.delayFeedback.addEventListener("input", () => {
  updateTrackDelay(state.delayOverlay.trackIndex, { feedback: Number(ui.delayFeedback.value) });
});
ui.delayDecay.addEventListener("input", () => {
  updateTrackDelay(state.delayOverlay.trackIndex, { decay: Number(ui.delayDecay.value) });
});
ui.delayTone.addEventListener("input", () => {
  updateTrackDelay(state.delayOverlay.trackIndex, { tone: Number(ui.delayTone.value) });
});
ui.delayMix.addEventListener("input", () => {
  updateTrackDelay(state.delayOverlay.trackIndex, { mix: Number(ui.delayMix.value) });
});
ui.delayOverlayClose.addEventListener("click", () => closeDelayOverlay());
ui.delayOverlay.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  if (event.target.dataset.delayOverlayClose === "true") closeDelayOverlay();
});
ui.driftRate.addEventListener("change", () => {
  const drift = getTrackDrift(state.driftOverlay.trackIndex);
  updateTrackDrift(state.driftOverlay.trackIndex, { rate: sanitizeIntegerField(ui.driftRate, drift.rate) });
});
ui.driftRangeMin.addEventListener("input", () => {
  const maxValue = Math.max(Number(ui.driftRangeMin.value), Number(ui.driftRangeMax.value));
  ui.driftRangeMax.value = String(maxValue);
  updateTrackDrift(state.driftOverlay.trackIndex, { rangeMin: Number(ui.driftRangeMin.value), rangeMax: maxValue });
});
ui.driftRangeMax.addEventListener("input", () => {
  const minValue = Math.min(Number(ui.driftRangeMin.value), Number(ui.driftRangeMax.value));
  ui.driftRangeMin.value = String(minValue);
  updateTrackDrift(state.driftOverlay.trackIndex, { rangeMin: minValue, rangeMax: Number(ui.driftRangeMax.value) });
});
ui.driftOverlayClose.addEventListener("click", () => closeDriftOverlay());
ui.driftOverlay.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  if (event.target.dataset.driftOverlayClose === "true") closeDriftOverlay();
});
ui.swellRate.addEventListener("change", () => {
  const swell = getTrackSwell(state.swellOverlay.trackIndex);
  updateTrackSwell(state.swellOverlay.trackIndex, { rate: sanitizeIntegerField(ui.swellRate, swell.rate) });
});
ui.swellRangeMin.addEventListener("input", () => {
  const maxValue = Math.max(Number(ui.swellRangeMin.value), Number(ui.swellRangeMax.value));
  ui.swellRangeMax.value = String(maxValue);
  updateTrackSwell(state.swellOverlay.trackIndex, { rangeMin: Number(ui.swellRangeMin.value), rangeMax: maxValue });
});
ui.swellRangeMax.addEventListener("input", () => {
  const minValue = Math.min(Number(ui.swellRangeMin.value), Number(ui.swellRangeMax.value));
  ui.swellRangeMin.value = String(minValue);
  updateTrackSwell(state.swellOverlay.trackIndex, { rangeMin: minValue, rangeMax: Number(ui.swellRangeMax.value) });
});
bindDualRangeBar(ui.driftRange, ui.driftRangeMin, ui.driftRangeMax, -100, 100, () => {
  const minValue = Number(ui.driftRangeMin.value);
  const maxValue = Number(ui.driftRangeMax.value);
  updateTrackDrift(state.driftOverlay.trackIndex, { rangeMin: Math.min(minValue, maxValue), rangeMax: Math.max(minValue, maxValue) });
});
bindDualRangeBar(ui.swellRange, ui.swellRangeMin, ui.swellRangeMax, 0, 100, () => {
  const minValue = Number(ui.swellRangeMin.value);
  const maxValue = Number(ui.swellRangeMax.value);
  updateTrackSwell(state.swellOverlay.trackIndex, { rangeMin: Math.min(minValue, maxValue), rangeMax: Math.max(minValue, maxValue) });
});
ui.swellOverlayClose.addEventListener("click", () => closeSwellOverlay());
ui.swellOverlay.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLElement)) return;
  if (event.target.dataset.swellOverlayClose === "true") closeSwellOverlay();
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
      paintMixerModulation();
      syncTransportButton();
      setDiagnostics("sequence paused.", "warn");
      return;
    }
    if (!state.sample.buffer) {
      setDiagnostics("load a sample before starting the sequence.", "warn");
      return;
    }
    state.transport.start();
    paintMixerModulation();
    ensureMixerAnimation();
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
  if (event.key === "Escape" && state.delayOverlay.open) {
    closeDelayOverlay();
    return;
  }
  if (event.key === "Escape" && state.driftOverlay.open) {
    closeDriftOverlay();
    return;
  }
  if (event.key === "Escape" && state.swellOverlay.open) {
    closeSwellOverlay();
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
refreshRangeFills();
loadDefaultSample();
