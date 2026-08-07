import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  Square,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  Music,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  RotateCcw,
  Info,
  Sliders,
  Sparkles,
  Layers,
  Grid,
  List,
  Edit3,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  RefreshCw,
  FolderPlus,
  X,
  HelpCircle
} from 'lucide-react';

// ==========================================
// 1. MUSIC THEORY & DATA CONSTANTS
// ==========================================

const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLATS  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Harmonic interval map to degree names
const INTERVAL_DEGREE_MAP = {
  0: { label: 'Root', symbol: '1', short: '1' },
  1: { label: 'Minor 2nd', symbol: '♭2', short: '♭2' },
  2: { label: 'Major 2nd / 9th', symbol: '2 / 9', short: '9' },
  3: { label: 'Minor 3rd', symbol: '♭3', short: '♭3' },
  4: { label: 'Major 3rd', symbol: '3', short: '3' },
  5: { label: 'Perfect 4th / 11th', symbol: '4 / 11', short: '11' },
  6: { label: 'Diminished 5th / #11', symbol: '♭5 / ♯11', short: '♭5' },
  7: { label: 'Perfect 5th', symbol: '5', short: '5' },
  8: { label: 'Augmented 5th / ♭13', symbol: '♯5 / ♭13', short: '♯5' },
  9: { label: 'Major 6th / 13th', symbol: '6 / 13', short: '13' },
  10: { label: 'Minor 7th', symbol: '♭7', short: '♭7' },
  11: { label: 'Major 7th', symbol: '7', short: '7' }
};

// Comprehensive Chord Library
const CHORD_LIBRARY = [
  // Triads
  { id: 'maj', name: 'Major Triad', symbol: '', intervals: [0, 4, 7], degrees: ['1', '3', '5'], family: 'Triad' },
  { id: 'min', name: 'Minor Triad', symbol: 'm', intervals: [0, 3, 7], degrees: ['1', '♭3', '5'], family: 'Triad' },
  { id: 'dim', name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6], degrees: ['1', '♭3', '♭5'], family: 'Triad' },
  { id: 'aug', name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8], degrees: ['1', '3', '♯5'], family: 'Triad' },
  { id: 'sus2', name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7], degrees: ['1', '2', '5'], family: 'Triad' },
  { id: 'sus4', name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7], degrees: ['1', '4', '5'], family: 'Triad' },

  // 7th Chords
  { id: 'maj7', name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11], degrees: ['1', '3', '5', '7'], family: '7th' },
  { id: 'min7', name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10], degrees: ['1', '♭3', '5', '♭7'], family: '7th' },
  { id: 'dom7', name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10], degrees: ['1', '3', '5', '♭7'], family: '7th' },
  { id: 'm7b5', name: 'Half-Diminished', symbol: 'm7♭5', intervals: [0, 3, 6, 10], degrees: ['1', '♭3', '♭5', '♭7'], family: '7th' },
  { id: 'dim7', name: 'Diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9], degrees: ['1', '♭3', '♭5', '♭7'], family: '7th' },
  { id: 'mMaj7', name: 'Minor Major 7th', symbol: 'm(maj7)', intervals: [0, 3, 7, 11], degrees: ['1', '♭3', '5', '7'], family: '7th' },

  // Extended & Color Chords
  { id: 'maj9', name: 'Major 9th', symbol: 'maj9', intervals: [0, 4, 7, 11, 14], degrees: ['1', '3', '5', '7', '9'], family: 'Extended' },
  { id: 'min9', name: 'Minor 9th', symbol: 'm9', intervals: [0, 3, 7, 10, 14], degrees: ['1', '♭3', '5', '♭7', '9'], family: 'Extended' },
  { id: 'dom9', name: 'Dominant 9th', symbol: '9', intervals: [0, 4, 7, 10, 14], degrees: ['1', '3', '5', '♭7', '9'], family: 'Extended' },
  { id: 'add9', name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14], degrees: ['1', '3', '5', '9'], family: 'Extended' },
  { id: '69', name: 'Major 6/9', symbol: '6/9', intervals: [0, 4, 7, 9, 14], degrees: ['1', '3', '5', '6', '9'], family: 'Extended' },
  { id: 'm6', name: 'Minor 6th', symbol: 'm6', intervals: [0, 3, 7, 9], degrees: ['1', '♭3', '5', '6'], family: 'Extended' },
  { id: 'min11', name: 'Minor 11th', symbol: 'm11', intervals: [0, 3, 7, 10, 14, 17], degrees: ['1', '♭3', '5', '♭7', '9', '11'], family: 'Extended' },
  { id: 'dom13', name: 'Dominant 13th', symbol: '13', intervals: [0, 4, 7, 10, 14, 21], degrees: ['1', '3', '5', '♭7', '9', '13'], family: 'Extended' },

  // Altered / Jazz
  { id: '7b9', name: '7 Flat 9', symbol: '7♭9', intervals: [0, 4, 7, 10, 13], degrees: ['1', '3', '5', '♭7', '♭9'], family: 'Altered' },
  { id: '7sharp9', name: '7 Sharp 9', symbol: '7♯9', intervals: [0, 4, 7, 10, 15], degrees: ['1', '3', '5', '♭7', '♯9'], family: 'Altered' },
  { id: '7alt', name: 'Altered 7th', symbol: '7alt', intervals: [0, 4, 6, 10, 13], degrees: ['1', '3', '♭5', '♭7', '♭9'], family: 'Altered' }
];

const VOICING_STYLES = [
  { id: 'close', name: 'Root Close', desc: 'Standard close position stacked from root.' },
  { id: 'drop2', name: 'Drop 2', desc: 'Jazz standard: second highest note dropped 1 octave.' },
  { id: 'drop3', name: 'Drop 3', desc: 'Open mid-register voicing: 3rd highest note dropped 1 octave.' },
  { id: 'shell', name: 'Shell / Open', desc: 'Root in bass with core guide tones (3rd & 7th) in upper register.' },
  { id: 'inv1', name: '1st Inversion', desc: 'Lowest note is the 3rd degree.' },
  { id: 'inv2', name: '2nd Inversion', desc: 'Lowest note is the 5th degree.' },
  { id: 'spread', name: 'Wide Spread', desc: 'Orchestral spread for open, resonant sustain.' }
];

// Default sample progression presets
const DEFAULT_PRESETS = [
  {
    id: 'preset-jazz-251',
    title: 'Jazz II-V-I in C Major',
    key: 'C Major',
    tags: ['Jazz', 'Essential', 'Smooth'],
    desc: 'Classic jazz cadential movement utilizing rich Drop 2 voicings.',
    chords: [
      { id: 'c1', rootIndex: 2, chordTypeId: 'min7', voicingType: 'drop2', durationBeats: 4 }, // Dm7
      { id: 'c2', rootIndex: 7, chordTypeId: 'dom9', voicingType: 'drop2', durationBeats: 4 }, // G9
      { id: 'c3', rootIndex: 0, chordTypeId: 'maj9', voicingType: 'drop2', durationBeats: 8 }  // Cmaj9
    ]
  },
  {
    id: 'preset-neosoul-flow',
    title: 'Neo-Soul Ambient Extensions',
    key: 'F Major',
    tags: ['Neo-Soul', 'Extended', 'Chill'],
    desc: 'Lush 9th and 11th chords with wide spread voicing for maximum color.',
    chords: [
      { id: 'c1', rootIndex: 5, chordTypeId: 'maj9', voicingType: 'spread', durationBeats: 4 }, // Fmaj9
      { id: 'c2', rootIndex: 9, chordTypeId: 'min11', voicingType: 'shell', durationBeats: 4 }, // Am11
      { id: 'c3', rootIndex: 10, chordTypeId: 'maj7', voicingType: 'drop2', durationBeats: 4 }, // Bbmaj7
      { id: 'c4', rootIndex: 0, chordTypeId: 'add9', voicingType: 'spread', durationBeats: 4 }  // Cadd9
    ]
  },
  {
    id: 'preset-pop-emotional',
    title: 'Modern Emotional Pop Flow',
    key: 'A Minor',
    tags: ['Pop', 'Melodic', 'Acoustic'],
    desc: 'Timeless vi - IV - I - V harmonic journey with smooth voice leading.',
    chords: [
      { id: 'c1', rootIndex: 9, chordTypeId: 'min', voicingType: 'close', durationBeats: 4 },  // Am
      { id: 'c2', rootIndex: 5, chordTypeId: 'maj', voicingType: 'close', durationBeats: 4 },  // F
      { id: 'c3', rootIndex: 0, chordTypeId: 'maj', voicingType: 'close', durationBeats: 4 },  // C
      { id: 'c4', rootIndex: 7, chordTypeId: 'sus4', voicingType: 'close', durationBeats: 4 } // Gsus4
    ]
  }
];

// Helper: Convert MIDI pitch to note name
function midiToNoteName(midi, useFlats = false) {
  const names = useFlats ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
  const octave = Math.floor(midi / 12) - 1;
  const pc = ((midi % 12) + 12) % 12;
  return `${names[pc]}${octave}`;
}

// Generate specific voicing MIDI pitch numbers
function generateVoicingPitches(rootIndex, chordType, voicingType) {
  // Base root octave 3 (MIDI 48 = C3)
  const rootMidi = 48 + rootIndex;
  const basePitches = chordType.intervals.map(i => rootMidi + i);

  switch (voicingType) {
    case 'inv1': {
      const copy = [...basePitches];
      if (copy.length > 0) copy[0] += 12;
      return copy.sort((a, b) => a - b);
    }
    case 'inv2': {
      const copy = [...basePitches];
      if (copy.length >= 2) {
        copy[0] += 12;
        copy[1] += 12;
      }
      return copy.sort((a, b) => a - b);
    }
    case 'drop2': {
      const sorted = [...basePitches].sort((a, b) => a - b);
      if (sorted.length >= 3) {
        const dropIdx = sorted.length - 2;
        sorted[dropIdx] -= 12;
      }
      return sorted.sort((a, b) => a - b);
    }
    case 'drop3': {
      const sorted = [...basePitches].sort((a, b) => a - b);
      if (sorted.length >= 4) {
        const dropIdx = sorted.length - 3;
        sorted[dropIdx] -= 12;
      }
      return sorted.sort((a, b) => a - b);
    }
    case 'shell': {
      const bass = rootMidi - 12; // Octave 2
      const upper = [];
      if (basePitches.length > 1) upper.push(basePitches[1]); // 3rd
      if (basePitches.length > 3) upper.push(basePitches[3]); // 7th
      else if (basePitches.length > 2) upper.push(basePitches[2]); // 5th if no 7th
      if (basePitches.length > 4) upper.push(basePitches[4]); // 9th
      return [bass, ...upper].sort((a, b) => a - b);
    }
    case 'spread': {
      const bass = rootMidi - 12;
      const spread = [bass];
      basePitches.slice(1).forEach((p, idx) => {
        spread.push(idx % 2 === 1 ? p + 12 : p);
      });
      return spread.sort((a, b) => a - b);
    }
    case 'close':
    default:
      return basePitches;
  }
}

// Convert MIDI pitch to Frequency (Hz)
function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function App() {
  // App Settings State
  const [selectedTargetNote, setSelectedTargetNote] = useState(7); // Default G (index 7)
  const [useFlats, setUseFlats] = useState(false);
  const [degreeFilter, setDegreeFilter] = useState('all'); // 'all', '1', '3', '5', '7', 'ext'
  const [familyFilter, setFamilyFilter] = useState('all'); // 'all', 'Triad', '7th', 'Extended', 'Altered'
  const [activeVoicingMap, setActiveVoicingMap] = useState({}); // { [chordKey]: voicingTypeId }
  const [instrumentPreset, setInstrumentPreset] = useState('rhodes'); // 'rhodes', 'piano', 'pad', 'organ'
  const [masterVolume, setMasterVolume] = useState(0.75);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  // Active Progression State
  const [progression, setProgression] = useState([]);
  const [progressionTitle, setProgressionTitle] = useState('Untitled Canvas Progression');
  const [progressionKey, setProgressionKey] = useState('C Major');
  const [bpm, setBpm] = useState(90);
  const [isLooping, setIsLooping] = useState(true);

  // Saved Progressions Library
  const [savedProgressions, setSavedProgressions] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);

  // Playback Sequencer State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // UI Feedback / Modals
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);
  const [saveDescription, setSaveDescription] = useState('');
  const [saveTags, setSaveTags] = useState('Jazz, Composition');

  // Web Audio Context Reference
  const audioCtxRef = useRef(null);
  const sequenceTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  const noteNames = useFlats ? CHROMATIC_FLATS : CHROMATIC_SHARPS;

  // ------------------------------------------
  // INITIALIZATION & PERSISTENCE (LOCAL STORAGE)
  // ------------------------------------------
  useEffect(() => {
    // Load Saved Progressions from localStorage
    try {
      const storedLibrary = localStorage.getItem('harmonic_canvas_library');
      if (storedLibrary) {
        const parsed = JSON.parse(storedLibrary);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProgressions(parsed);
        } else {
          setSavedProgressions(DEFAULT_PRESETS);
        }
      } else {
        setSavedProgressions(DEFAULT_PRESETS);
      }

      const storedCurrent = localStorage.getItem('harmonic_canvas_current_prog');
      if (storedCurrent) {
        const parsedCurrent = JSON.parse(storedCurrent);
        if (parsedCurrent.chords) setProgression(parsedCurrent.chords);
        if (parsedCurrent.title) setProgressionTitle(parsedCurrent.title);
        if (parsedCurrent.bpm) setBpm(parsedCurrent.bpm);
      } else {
        // Load first default preset into active canvas
        setProgression(DEFAULT_PRESETS[0].chords);
        setProgressionTitle(DEFAULT_PRESETS[0].title);
      }
    } catch (err) {
      console.warn('LocalStorage load error:', err);
      setSavedProgressions(DEFAULT_PRESETS);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('harmonic_canvas_library', JSON.stringify(savedProgressions));
    } catch (err) {
      console.warn('LocalStorage write error:', err);
    }
  }, [savedProgressions]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'harmonic_canvas_current_prog',
        JSON.stringify({ chords: progression, title: progressionTitle, bpm })
      );
    } catch (err) {
      console.warn('LocalStorage write error:', err);
    }
  }, [progression, progressionTitle, bpm]);

  // Toast Notification Trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ------------------------------------------
  // WEB AUDIO SYNTHESIZER ENGINE
  // ------------------------------------------
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTonePitches = (pitches, duration = 1.2) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGainNode = ctx.createGain();
    masterGainNode.gain.setValueAtTime(masterVolume, now);
    masterGainNode.connect(ctx.destination);

    pitches.forEach((midi, index) => {
      const freq = midiToFreq(midi);
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      if (instrumentPreset === 'rhodes') {
        osc.type = 'sine';
        // Reduced bell overtone gain to eliminate digital clipping/distortion
        const osc2 = ctx.createOscillator();
        const osc2Gain = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now);
        osc2Gain.gain.setValueAtTime(0.04, now);
        osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);
        osc2.connect(masterGainNode);
        osc2.start(now);
        osc2.stop(now + duration);

        // Scaled note gain with safe headroom per pitch count
        const targetGain = 0.15 / Math.max(Math.sqrt(pitches.length), 1.5);
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(targetGain, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      } else if (instrumentPreset === 'piano') {
        osc.type = 'triangle';
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.4 / pitches.length, now + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

      } else if (instrumentPreset === 'pad') {
        osc.type = 'sawtooth';
        // Lowpass filter for warm analog sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.2 / pitches.length, now + 0.3); // Smooth attack
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.2);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGainNode);
        osc.frequency.setValueAtTime(freq, now);
        osc.start(now + index * 0.015);
        osc.stop(now + duration * 1.2);
        return;

      } else if (instrumentPreset === 'organ') {
        osc.type = 'sine';
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.25 / pitches.length, now + 0.03);
        noteGain.gain.setValueAtTime(0.2 / pitches.length, now + duration - 0.05);
        noteGain.gain.linearRampToValueAtTime(0.001, now + duration);
      }

      osc.frequency.setValueAtTime(freq, now);
      osc.connect(noteGain);
      noteGain.connect(masterGainNode);

      // Stagger slightly for natural strummed/voiced feel
      const startOffset = now + index * 0.012;
      osc.start(startOffset);
      osc.stop(now + duration);
    });
  };

  const playSingleNote = (midiPitch) => {
    playTonePitches([midiPitch], 0.8);
  };

  // ------------------------------------------
  // HARMONIC SEARCH ALGORITHM
  // Find all chords containing selected target note
  // ------------------------------------------
  const matchingChords = useMemo(() => {
    const targetPitchClass = selectedTargetNote; // 0..11
    const results = [];

    // Scan all candidate roots (0..11)
    for (let rootIndex = 0; rootIndex < 12; rootIndex++) {
      const rootName = noteNames[rootIndex];

      CHORD_LIBRARY.forEach(chordType => {
        // Calculate pitch classes for this chord
        const pitchClasses = chordType.intervals.map(inv => (rootIndex + inv) % 12);

        // Check if target pitch class exists in chord
        if (pitchClasses.includes(targetPitchClass)) {
          // Find interval distance from root to target note
          const intervalDist = (targetPitchClass - rootIndex + 12) % 12;
          const degreeInfo = INTERVAL_DEGREE_MAP[intervalDist] || { label: 'Degree', symbol: `${intervalDist}` };

          // Degree filter condition
          if (degreeFilter !== 'all') {
            if (degreeFilter === '1' && intervalDist !== 0) return;
            if (degreeFilter === '3' && intervalDist !== 3 && intervalDist !== 4) return;
            if (degreeFilter === '5' && intervalDist !== 6 && intervalDist !== 7 && intervalDist !== 8) return;
            if (degreeFilter === '7' && intervalDist !== 9 && intervalDist !== 10 && intervalDist !== 11) return;
            if (degreeFilter === 'ext' && [0, 3, 4, 6, 7, 8, 9, 10, 11].includes(intervalDist) === false) return;
          }

          // Family filter condition
          if (familyFilter !== 'all' && chordType.family !== familyFilter) {
            return;
          }

          const chordKey = `${rootIndex}-${chordType.id}`;
          const currentVoicing = activeVoicingMap[chordKey] || 'close';
          const pitches = generateVoicingPitches(rootIndex, chordType, currentVoicing);

          results.push({
            chordKey,
            rootIndex,
            rootName,
            chordType,
            chordSymbol: `${rootName}${chordType.symbol}`,
            fullName: `${rootName} ${chordType.name}`,
            targetIntervalDist: intervalDist,
            targetDegreeInfo: degreeInfo,
            voicingType: currentVoicing,
            pitches
          });
        }
      });
    }

    return results;
  }, [selectedTargetNote, noteNames, degreeFilter, familyFilter, activeVoicingMap]);

  // ------------------------------------------
  // PROGRESSION SEQUENCER PLAYBACK
  // ------------------------------------------
  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
  };

  const startPlayback = () => {
    if (progression.length === 0) {
      showToast('Progression is empty. Add chords first!');
      return;
    }
    getAudioContext();
    setIsPlaying(true);
    playStep(0);
  };

  const playStep = (stepIdx) => {
    if (stepIdx >= progression.length) {
      if (isLooping) {
        stepIdx = 0;
      } else {
        stopPlayback();
        return;
      }
    }

    setCurrentStepIndex(stepIdx);
    const item = progression[stepIdx];

    // Calculate step chord pitches
    const chordType = CHORD_LIBRARY.find(c => c.id === item.chordTypeId) || CHORD_LIBRARY[0];
    const pitches = generateVoicingPitches(item.rootIndex, chordType, item.voicingType || 'close');

    // Calculate timing duration based on BPM and beat count (quarter notes)
    const beatDurationMs = (60 / bpm) * 1000;
    const chordDurationMs = beatDurationMs * (item.durationBeats || 4);

    // Play chord audio
    playTonePitches(pitches, (chordDurationMs / 1000) * 0.95);

    // Schedule next step
    sequenceTimerRef.current = setTimeout(() => {
      playStep(stepIdx + 1);
    }, chordDurationMs);
  };

  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    };
  }, []);

  // ------------------------------------------
  // PROGRESSION BUILDING ACTIONS
  // ------------------------------------------
  const addChordToProgression = (chordItem) => {
    const newItem = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      rootIndex: chordItem.rootIndex,
      chordTypeId: chordItem.chordType.id,
      voicingType: chordItem.voicingType,
      durationBeats: 4
    };
    setProgression([...progression, newItem]);
    showToast(`Added ${chordItem.chordSymbol} (${chordItem.voicingType}) to progression`);
  };

  const updateStepDuration = (id, newBeats) => {
    setProgression(progression.map(item => item.id === id ? { ...item, durationBeats: newBeats } : item));
  };

  const updateStepVoicing = (id, newVoicing) => {
    setProgression(progression.map(item => item.id === id ? { ...item, voicingType: newVoicing } : item));
  };

  const removeStep = (id) => {
    setProgression(progression.filter(item => item.id !== id));
  };

  const moveStep = (index, direction) => {
    const newProg = [...progression];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newProg.length) return;
    const temp = newProg[index];
    newProg[index] = newProg[targetIdx];
    newProg[targetIdx] = temp;
    setProgression(newProg);
  };

  const clearCanvas = () => {
    stopPlayback();
    setProgression([]);
    showToast('Canvas cleared');
  };

  // ------------------------------------------
  // LIBRARY & BACKUP/RESTORE SYSTEM
  // ------------------------------------------
  const handleSaveCurrentProgression = (saveAsNew = false) => {
    if (!progressionTitle.trim()) {
      showToast('Please provide a title for the progression.');
      return;
    }
    const tagsArray = saveTags.split(',').map(t => t.trim()).filter(Boolean);
    const existingIdx = savedProgressions.findIndex(p => p.id === selectedLibraryId);

    if (!saveAsNew && existingIdx >= 0 && selectedLibraryId) {
      // Update existing item
      const updatedItem = {
        ...savedProgressions[existingIdx],
        title: progressionTitle,
        key: progressionKey,
        tags: tagsArray.length > 0 ? tagsArray : ['User Canvas'],
        desc: saveDescription || 'Custom user created harmonic progression.',
        chords: progression,
        bpm,
        updatedAt: new Date().toISOString()
      };
      const updatedList = [...savedProgressions];
      updatedList[existingIdx] = updatedItem;
      setSavedProgressions(updatedList);
      showToast(`Updated "${progressionTitle}" in library.`);
    } else {
      // Save as brand new entry
      const newId = `prog-${Date.now()}`;
      const newSavedItem = {
        id: newId,
        title: progressionTitle,
        key: progressionKey,
        tags: tagsArray.length > 0 ? tagsArray : ['User Canvas'],
        desc: saveDescription || 'Custom user created harmonic progression.',
        chords: progression,
        bpm,
        updatedAt: new Date().toISOString()
      };
      setSavedProgressions([newSavedItem, ...savedProgressions]);
      setSelectedLibraryId(newId);
      showToast(`Saved as new progression "${progressionTitle}"`);
    }
    setIsSaveModalOpen(false);
  };

  const loadProgressionFromLibrary = (item) => {
    stopPlayback();
    setProgression(item.chords || []);
    setProgressionTitle(item.title);
    setProgressionKey(item.key || 'C Major');
    if (item.bpm) setBpm(item.bpm);
    setSelectedLibraryId(item.id);
    showToast(`Loaded "${item.title}" onto canvas`);
  };

  const deleteProgressionFromLibrary = (id, e) => {
    e.stopPropagation();
    const filtered = savedProgressions.filter(p => p.id !== id);
    setSavedProgressions(filtered);
    if (selectedLibraryId === id) setSelectedLibraryId(null);
    showToast('Progression removed from library');
  };

  // Backup: Export JSON file
  const exportBackupJSON = () => {
    const backupData = {
      app: 'HarmonicCanvas',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      currentCanvas: {
        title: progressionTitle,
        key: progressionKey,
        bpm,
        chords: progression
      },
      savedLibrary: savedProgressions
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `harmonic_canvas_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON exported successfully');
  };

  // Restore: Import JSON file
  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') return;
        const imported = JSON.parse(content);
        if (imported.savedLibrary && Array.isArray(imported.savedLibrary)) {
          setSavedProgressions(imported.savedLibrary);
          if (imported.currentCanvas && imported.currentCanvas.chords) {
            setProgression(imported.currentCanvas.chords);
            setProgressionTitle(imported.currentCanvas.title || 'Restored Progression');
            if (imported.currentCanvas.bpm) setBpm(imported.currentCanvas.bpm);
          }
          showToast('Backup restored successfully!');
          setIsBackupRestoreOpen(false);
        } else {
          showToast('Invalid backup file format.');
        }
      } catch (err) {
        showToast('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ==========================================
  // 3. RENDER SUB-COMPONENTS
  // ==========================================

  // Interactive Mini Piano Visualizer Component
  const RenderPianoRoll = ({ pitches, targetNoteIndex }) => {
    // 2 Octaves piano range: MIDI 48 (C3) to 71 (B4)
    const keys = [];
    const activePitchMap = {};
    pitches.forEach(p => { activePitchMap[p] = true; });

    for (let m = 48; m <= 71; m++) {
      const pc = (m % 12 + 12) % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(pc);
      const isActive = !!activePitchMap[m];
      const isTarget = isActive && pc === targetNoteIndex;
      keys.push({ midi: m, pc, isBlack, isActive, isTarget, name: noteNames[pc] });
    }

    const whiteKeys = keys.filter(k => !k.isBlack);

    return (
      <div className="relative h-20 w-full bg-[#1C1917] rounded p-1 border border-[#1C1917]/20 select-none overflow-hidden">
        {/* Render White Keys */}
        <div className="flex h-full w-full gap-[1px]">
          {whiteKeys.map((k) => (
            <button
              key={k.midi}
              onClick={() => playSingleNote(k.midi)}
              title={`${k.name} (MIDI ${k.midi})`}
              className={`flex-1 rounded-b flex flex-col justify-end items-center pb-1 text-[9px] font-mono transition-colors ${
                k.isTarget
                  ? 'bg-[#C2410C] text-white font-bold ring-2 ring-[#C2410C] z-10'
                  : k.isActive
                  ? 'bg-[#1C1917] text-white font-semibold'
                  : 'bg-[#FAF8F5] text-[#1C1917]/60 hover:bg-stone-200'
              }`}
            >
              {k.isActive && <span>{k.name}</span>}
            </button>
          ))}
        </div>

        {/* Overlay Black Keys */}
        <div className="absolute top-1 left-1 right-1 h-12 pointer-events-none flex">
          {keys.map((k) => {
            if (!k.isBlack) return null;
            // Calculate approximate left offset percentage based on key index
            const whiteIndexBefore = keys.filter(x => x.midi < k.midi && !x.isBlack).length;
            const leftPercent = (whiteIndexBefore / whiteKeys.length) * 100 - 2.8;

            return (
              <button
                key={k.midi}
                onClick={() => playSingleNote(k.midi)}
                title={`${k.name} (MIDI ${k.midi})`}
                style={{ left: `${leftPercent}%`, width: '4.2%' }}
                className={`absolute top-0 h-full rounded-b pointer-events-auto transition-colors z-20 ${
                  k.isTarget
                    ? 'bg-[#C2410C] text-white shadow-md ring-2 ring-[#C2410C]'
                    : k.isActive
                    ? 'bg-[#FAF8F5] text-[#1C1917] border border-[#1C1917]'
                    : 'bg-[#1C1917] border border-[#FAF8F5]/20 hover:bg-stone-800'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased selection:bg-[#F3E8DF]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1917] text-[#FAF8F5] px-5 py-3 rounded-md shadow-2xl border border-stone-700 flex items-center gap-3 animate-fade-in text-sm font-mono">
          <Sparkles className="w-4 h-4 text-[#C2410C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==========================================
          HEADER / EDITORIAL MASTHEAD
      ========================================== */}
      <header className="border-b-2 border-double border-[#1C1917]/20 bg-[#FAF8F5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#1C1917] text-white px-2 py-0.5 rounded">
                Editorial Product Canvas
              </span>
              <span className="text-[10px] font-mono text-[#1C1917]/60 uppercase tracking-widest">
                Vol. 01 / Harmonic Theory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight mt-1 text-[#1C1917]">
              The Harmonic Canvas
            </h1>
            <p className="text-xs text-[#1C1917]/70 font-serif italic mt-0.5">
              Precision Note-Centric Chord Voicing & Progression Studio
            </p>
          </div>

          {/* Master Transport & Quick Settings */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Auto Play Toggle */}
            <button
              onClick={() => {
                const nextState = !autoPlayEnabled;
                setAutoPlayEnabled(nextState);
                showToast(`Auto-Play ${nextState ? 'Enabled' : 'Disabled'}`);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-colors ${
                autoPlayEnabled
                  ? 'bg-[#C2410C] text-white border-[#C2410C]'
                  : 'bg-white text-[#1C1917]/70 border-[#1C1917]/20 hover:border-[#1C1917]'
              }`}
              title="Toggle automatic chord play on selection"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Play: {autoPlayEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Instrument Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-[#1C1917]/15 rounded px-2.5 py-1.5 text-xs">
              <Music className="w-3.5 h-3.5 text-[#C2410C]" />
              <select
                value={instrumentPreset}
                onChange={(e) => setInstrumentPreset(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="rhodes">Rhodes E-Piano</option>
                <option value="piano">Acoustic Piano</option>
                <option value="pad">Warm Analog Pad</option>
                <option value="organ">Clean Organ</option>
              </select>
            </div>

            {/* Master Volume */}
            <div className="flex items-center gap-2 bg-white border border-[#1C1917]/15 rounded px-2.5 py-1.5 text-xs">
              <button
                onClick={() => setMasterVolume(masterVolume === 0 ? 0.75 : 0)}
                className="text-[#1C1917]/70 hover:text-[#1C1917]"
              >
                {masterVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-16 accent-[#C2410C] cursor-pointer"
              />
            </div>

            {/* Backup & Restore Action */}
            <button
              onClick={() => setIsBackupRestoreOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1C1917]/20 hover:border-[#1C1917] rounded text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>Backup / Restore</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN THREE-COLUMN WORKSPACE
      ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            COLUMN 1: TARGET NOTE & THEORY FILTERS
        ========================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Section Card: Note Selector */}
          <div className="bg-white border border-[#1C1917]/15 rounded-lg p-5 shadow-[0_2px_8px_rgba(28,25,23,0.03)]">
            <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C2410C]">01</span>
                <h2 className="text-sm font-serif font-bold uppercase tracking-wider">Target Note</h2>
              </div>
              
              {/* Sharps vs Flats Toggle */}
              <button
                onClick={() => setUseFlats(!useFlats)}
                className="text-[10px] font-mono px-2 py-0.5 border border-[#1C1917]/20 rounded hover:bg-stone-100"
              >
                {useFlats ? 'Flats (♭)' : 'Sharps (♯)'}
              </button>
            </div>

            {/* Note Selector Grid */}
            <div className="grid grid-cols-4 gap-2">
              {noteNames.map((note, idx) => {
                const isSelected = selectedTargetNote === idx;
                return (
                  <button
                    key={note}
                    onClick={() => {
                      setSelectedTargetNote(idx);
                      playSingleNote(60 + idx); // Play pitch audition
                    }}
                    className={`py-3 rounded text-sm font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-[#C2410C] text-white shadow-md scale-[1.02]'
                        : 'bg-[#FAF8F5] text-[#1C1917] border border-[#1C1917]/10 hover:border-[#1C1917]/40'
                    }`}
                  >
                    {note}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-[#FAF8F5] rounded border border-[#1C1917]/10 text-xs text-[#1C1917]/80 leading-relaxed font-serif">
              Showing all chords and voicings that contain the note <strong className="font-mono text-[#C2410C] font-bold">{noteNames[selectedTargetNote]}</strong> anywhere in their structure.
            </div>
          </div>

          {/* Section Card: Harmonic Function Filters */}
          <div className="bg-white border border-[#1C1917]/15 rounded-lg p-5 shadow-[0_2px_8px_rgba(28,25,23,0.03)] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1C1917]/10 pb-3">
              <span className="text-xs font-mono font-bold text-[#C2410C]">02</span>
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider">Filter Chords</h2>
            </div>

            {/* Degree Role Filter */}
            <div>
              <label className="text-xs font-mono text-[#1C1917]/60 block mb-2 uppercase">Note Degree Role</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Roles' },
                  { id: '1', label: 'Root (1)' },
                  { id: '3', label: '3rd (3/♭3)' },
                  { id: '5', label: '5th (5/♭5)' },
                  { id: '7', label: '7th (7/♭7)' },
                  { id: 'ext', label: 'Extensions (9/11/13)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDegreeFilter(f.id)}
                    className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                      degreeFilter === f.id
                        ? 'bg-[#1C1917] text-white font-medium'
                        : 'bg-[#FAF8F5] border border-[#1C1917]/15 text-[#1C1917]/80 hover:bg-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Family Type Filter */}
            <div>
              <label className="text-xs font-mono text-[#1C1917]/60 block mb-2 uppercase">Chord Family</label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Triad', '7th', 'Extended', 'Altered'].map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setFamilyFilter(fam)}
                    className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${
                      familyFilter === fam
                        ? 'bg-[#1C1917] text-white font-medium'
                        : 'bg-[#FAF8F5] border border-[#1C1917]/15 text-[#1C1917]/80 hover:bg-stone-200'
                    }`}
                  >
                    {fam === 'all' ? 'All Families' : fam}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-[#FAF8F5] border border-[#1C1917]/20 rounded p-4 flex items-center justify-between text-xs font-mono">
            <span>Matches Found:</span>
            <span className="font-bold text-sm text-[#C2410C] bg-white px-2.5 py-0.5 border border-[#1C1917]/15 rounded">
              {matchingChords.length} Chords
            </span>
          </div>

        </div>

        {/* ==========================================
            COLUMN 2: MATCHING CHORDS & VOICING INSPECTOR
        ========================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1C1917] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C2410C]">03</span>
              <h2 className="text-lg font-serif font-bold tracking-tight">Matching Voicings Inspector</h2>
            </div>
            <span className="text-xs font-mono text-[#1C1917]/60">
              Note: {noteNames[selectedTargetNote]}
            </span>
          </div>

          {/* Chords List */}
          <div className="space-y-4 max-h-[780px] overflow-y-auto pr-1">
            {matchingChords.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed border-[#1C1917]/30 rounded-lg">
                <Info className="w-6 h-6 text-[#1C1917]/40 mx-auto mb-2" />
                <p className="font-serif italic text-sm text-[#1C1917]/70">
                  No chords matched the current filter criteria. Try expanding your filters or selecting another target note.
                </p>
              </div>
            ) : (
              matchingChords.map((item) => {
                const activeVoicing = item.voicingType;

                return (
                  <div
                    key={item.chordKey}
                    className="bg-white border border-[#1C1917]/15 rounded-lg p-5 shadow-[0_2px_8px_rgba(28,25,23,0.03)] hover:border-[#1C1917]/40 transition-all space-y-4"
                  >
                    {/* Chord Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-2xl font-serif font-black text-[#1C1917]">
                            {item.chordSymbol}
                          </h3>
                          <span className="text-xs font-mono text-[#1C1917]/60">
                            {item.fullName}
                          </span>
                        </div>

                        {/* Harmonic Role Badge */}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-block bg-[#FAF8F5] border border-[#1C1917]/20 text-[11px] font-mono px-2 py-0.5 rounded text-[#1C1917]">
                            <strong className="text-[#C2410C] font-bold">{noteNames[selectedTargetNote]}</strong> = {item.targetDegreeInfo.label} ({item.targetDegreeInfo.symbol})
                          </span>
                        </div>
                      </div>

                      {/* Audition Play Button */}
                      <button
                        onClick={() => playTonePitches(item.pitches, 1.5)}
                        className="p-2.5 bg-[#FAF8F5] border border-[#1C1917]/20 hover:bg-[#1C1917] hover:text-white rounded transition-colors"
                        title="Audition Voicing Sound"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Voicing Selection Pills */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#1C1917]/50 block mb-1.5">
                        Voicing Architecture
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {VOICING_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => {
                              setActiveVoicingMap({
                                ...activeVoicingMap,
                                [item.chordKey]: style.id
                              });
                              if (autoPlayEnabled) {
                                const newPitches = generateVoicingPitches(item.rootIndex, item.chordType, style.id);
                                playTonePitches(newPitches, 1.2);
                              }
                            }}
                            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                              activeVoicing === style.id
                                ? 'bg-[#1C1917] text-white font-semibold'
                                : 'bg-[#FAF8F5] border border-[#1C1917]/10 text-[#1C1917]/70 hover:bg-stone-200'
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Piano Keyboard Visualizer */}
                    <RenderPianoRoll pitches={item.pitches} targetNoteIndex={selectedTargetNote} />

                    {/* Voicing Note Pitch Breakdown */}
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className="text-[#1C1917]/60 text-[11px]">
                        Notes: {item.pitches.map(p => midiToNoteName(p, useFlats)).join(' – ')}
                      </span>

                      <button
                        onClick={() => addChordToProgression(item)}
                        className="flex items-center gap-1 px-3 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white font-mono text-xs rounded font-medium shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Progression</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ==========================================
            COLUMN 3: PROGRESSION CANVAS & LIBRARY
        ========================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section: Progression Timeline Canvas */}
          <div className="bg-white border border-[#1C1917]/20 rounded-lg p-5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C2410C]">04</span>
                <input
                  type="text"
                  value={progressionTitle}
                  onChange={(e) => setProgressionTitle(e.target.value)}
                  className="font-serif font-bold text-base bg-transparent border-b border-transparent hover:border-[#1C1917]/30 focus:border-[#C2410C] focus:outline-none"
                  placeholder="Progression Name..."
                />
              </div>

              <button
                onClick={clearCanvas}
                className="text-xs font-mono text-red-700 hover:underline flex items-center gap-1"
                title="Clear all chords from canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* Global Sequencer Controls */}
            <div className="bg-[#FAF8F5] border border-[#1C1917]/15 rounded p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                {/* Play / Stop Toggle */}
                {isPlaying ? (
                  <button
                    onClick={stopPlayback}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#1C1917] text-white rounded font-mono text-xs font-bold shadow-sm"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Playback</span>
                  </button>
                ) : (
                  <button
                    onClick={startPlayback}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded font-mono text-xs font-bold shadow-sm transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Progression</span>
                  </button>
                )}

                {/* Loop Toggle */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-3 py-2 border rounded font-mono text-xs flex items-center gap-1 transition-colors ${
                    isLooping
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white border-[#1C1917]/20 text-[#1C1917]/70'
                  }`}
                  title="Toggle Looping"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin-slow' : ''}`} />
                  <span>Loop</span>
                </button>
              </div>

              {/* BPM Slider */}
              <div className="flex items-center justify-between gap-3 text-xs font-mono">
                <span className="text-[#1C1917]/70">Tempo (BPM):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="40"
                    max="220"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-24 accent-[#C2410C] cursor-pointer"
                  />
                  <span className="w-8 text-right font-bold">{bpm}</span>
                </div>
              </div>
            </div>

            {/* Progression Steps Canvas List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {progression.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#1C1917]/20 rounded bg-[#FAF8F5]">
                  <Music className="w-6 h-6 text-[#1C1917]/30 mx-auto mb-2" />
                  <p className="text-xs font-serif italic text-[#1C1917]/60">
                    Your progression canvas is empty. Select a chord from the inspector and click "+ Add to Progression".
                  </p>
                </div>
              ) : (
                progression.map((item, idx) => {
                  const chordType = CHORD_LIBRARY.find(c => c.id === item.chordTypeId) || CHORD_LIBRARY[0];
                  const rootName = noteNames[item.rootIndex];
                  const chordSymbol = `${rootName}${chordType.symbol}`;
                  const isCurrentActiveStep = currentStepIndex === idx;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        const stepPitches = generateVoicingPitches(item.rootIndex, chordType, item.voicingType || 'close');
                        playTonePitches(stepPitches, 1.2);
                      }}
                      className={`p-3 rounded border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isCurrentActiveStep
                          ? 'bg-[#C2410C] text-white border-[#C2410C] shadow-md scale-[1.01]'
                          : 'bg-[#FAF8F5] border-[#1C1917]/15 hover:border-[#1C1917]/40'
                      }`}
                    >
                      {/* Step Number & Symbol */}
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-bold w-5 text-center ${isCurrentActiveStep ? 'text-white' : 'text-[#C2410C]'}`}>
                          {idx + 1}
                        </span>

                        <div>
                          <div className="font-serif font-black text-lg leading-none">
                            {chordSymbol}
                          </div>
                          <div className={`text-[10px] font-mono mt-0.5 ${isCurrentActiveStep ? 'text-white/80' : 'text-[#1C1917]/60'}`}>
                            {item.voicingType} • {item.durationBeats} Beats
                          </div>
                        </div>
                      </div>

                      {/* Step Actions */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Duration Selector */}
                        <select
                          value={item.durationBeats}
                          onChange={(e) => updateStepDuration(item.id, parseInt(e.target.value))}
                          className={`text-[11px] font-mono rounded px-1.5 py-0.5 border cursor-pointer ${
                            isCurrentActiveStep
                              ? 'bg-white text-[#1C1917] border-transparent'
                              : 'bg-white border-[#1C1917]/20 text-[#1C1917]'
                          }`}
                        >
                          <option value={2}>2 Beats (1/2 Bar)</option>
                          <option value={4}>4 Beats (1 Bar)</option>
                          <option value={8}>8 Beats (2 Bars)</option>
                        </select>

                        {/* Order Adjustments */}
                        <button
                          onClick={() => moveStep(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 hover:bg-stone-200/50 rounded disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveStep(idx, 1)}
                          disabled={idx === progression.length - 1}
                          className="p-1 hover:bg-stone-200/50 rounded disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => removeStep(item.id)}
                          className="p-1 hover:text-red-600 rounded"
                          title="Remove Step"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Save Progression to Library Action */}
            <button
              onClick={() => setIsSaveModalOpen(true)}
              disabled={progression.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white rounded font-mono text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#C2410C]" />
              <span>Save Canvas to Library</span>
            </button>
          </div>

          {/* Section: Progression Library & Presets */}
          <div className="bg-white border border-[#1C1917]/20 rounded-lg p-5 shadow-[0_2px_8px_rgba(28,25,23,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C2410C]">05</span>
                <h2 className="text-sm font-serif font-bold uppercase tracking-wider">Saved Progressions</h2>
              </div>
              <span className="text-xs font-mono text-[#1C1917]/60">
                {savedProgressions.length} Saved
              </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {savedProgressions.map((item) => {
                const isSelected = selectedLibraryId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => loadProgressionFromLibrary(item)}
                    className={`p-3 rounded border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-[#FAF8F5] border-[#C2410C] ring-1 ring-[#C2410C]'
                        : 'bg-white border-[#1C1917]/15 hover:border-[#1C1917]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                          {item.title}
                        </h4>
                        <p className="text-[11px] font-mono text-[#1C1917]/60">
                          Key: {item.key || 'C Major'} • {item.chords?.length || 0} Chords
                        </p>
                      </div>

                      <button
                        onClick={(e) => deleteProgressionFromLibrary(item.id, e)}
                        className="p-1 text-[#1C1917]/40 hover:text-red-600 transition-colors"
                        title="Delete from Library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono bg-stone-100 text-stone-700 border border-stone-200 px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      {/* ==========================================
          MODAL: SAVE PROGRESSION
      ========================================== */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#1C1917]/30 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">Save Progression to Library</h3>
              <button onClick={() => setIsSaveModalOpen(false)} className="text-[#1C1917]/60 hover:text-[#1C1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#1C1917]/70 mb-1">Title</label>
                <input
                  type="text"
                  value={progressionTitle}
                  onChange={(e) => setProgressionTitle(e.target.value)}
                  className="w-full p-2 border border-[#1C1917]/20 rounded focus:border-[#C2410C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#1C1917]/70 mb-1">Tonality / Key</label>
                <input
                  type="text"
                  value={progressionKey}
                  onChange={(e) => setProgressionKey(e.target.value)}
                  className="w-full p-2 border border-[#1C1917]/20 rounded focus:border-[#C2410C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#1C1917]/70 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={saveTags}
                  onChange={(e) => setSaveTags(e.target.value)}
                  className="w-full p-2 border border-[#1C1917]/20 rounded focus:border-[#C2410C] focus:outline-none"
                  placeholder="Jazz, NeoSoul, Chill"
                />
              </div>

              <div>
                <label className="block text-[#1C1917]/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  className="w-full p-2 border border-[#1C1917]/20 rounded focus:border-[#C2410C] focus:outline-none"
                  placeholder="Musical intent or movement notes..."
                />
              </div>
            </div>

            {}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-3 py-2 border border-[#1C1917]/20 rounded text-xs font-mono hover:bg-stone-100"
              >
                Cancel
              </button>

              {/* Show Update button if editing an existing loaded library item */}
              {selectedLibraryId && savedProgressions.some(p => p.id === selectedLibraryId) && (
                <button
                  onClick={() => handleSaveCurrentProgression(false)}
                  className="px-3 py-2 bg-[#1C1917] text-white rounded text-xs font-mono font-bold hover:bg-stone-800"
                >
                  Update Existing
                </button>
              )}

              <button
                onClick={() => handleSaveCurrentProgression(true)}
                className="px-3 py-2 bg-[#C2410C] text-white rounded text-xs font-mono font-bold hover:bg-[#9A3412]"
              >
                Save as New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: BACKUP & RESTORE
      ========================================== */}
      {isBackupRestoreOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#1C1917]/30 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C2410C]" />
                <h3 className="font-serif font-bold text-lg text-[#1C1917]">Backup & Restore Data</h3>
              </div>
              <button onClick={() => setIsBackupRestoreOpen(false)} className="text-[#1C1917]/60 hover:text-[#1C1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Backup Card */}
              <div className="p-4 border border-[#1C1917]/15 rounded bg-[#FAF8F5] space-y-3">
                <Download className="w-6 h-6 text-[#1C1917]" />
                <h4 className="font-serif font-bold text-sm">Export Backup</h4>
                <p className="text-xs font-serif italic text-[#1C1917]/70 leading-snug">
                  Download a complete structured JSON file containing all your saved progressions and active canvas data.
                </p>
                <button
                  onClick={exportBackupJSON}
                  className="w-full py-2 bg-[#1C1917] text-white rounded font-mono text-xs font-bold hover:bg-stone-800"
                >
                  Download JSON
                </button>
              </div>

              {/* Restore Card */}
              <div className="p-4 border border-[#1C1917]/15 rounded bg-[#FAF8F5] space-y-3">
                <Upload className="w-6 h-6 text-[#C2410C]" />
                <h4 className="font-serif font-bold text-sm">Restore Data</h4>
                <p className="text-xs font-serif italic text-[#1C1917]/70 leading-snug">
                  Import a previously exported JSON file to restore your saved library and progressions into local storage.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="w-full py-2 bg-[#C2410C] text-white rounded font-mono text-xs font-bold hover:bg-[#9A3412]"
                >
                  Upload JSON File
                </button>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#1C1917]/50 text-center">
              All progressions are persisted locally in browser localStorage.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1C1917]/15 mt-16 py-6 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 text-center font-mono text-xs text-[#1C1917]/60">
          The Harmonic Canvas • Editorial Product System for Musicians & Composers
        </div>
      </footer>
    </div>
  );
}