
import { AudioPreset } from '../types';

class AmbientAudioEngine {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentPreset: AudioPreset | null = null;
  private sourceNodes: AudioScheduledSourceNode[] = [];
  
  // State tracking
  private masterVolume: number = 0.5;
  private isMuted: boolean = false;

  // Alarm specific properties
  private alarmSource: AudioBufferSourceNode | null = null;
  private alarmCache: Map<string, AudioBuffer> = new Map();

  constructor() {
    // Initialize lazily to comply with browser autoplay policies
  }

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      
      // Apply current state immediately upon initialization
      this.updateGain();
    }
  }

  // Centralized gain update logic
  private updateGain() {
    if (!this.gainNode || !this.context) return;
    
    const targetGain = this.isMuted ? 0 : this.masterVolume;
    this.gainNode.gain.setTargetAtTime(targetGain, this.context.currentTime, 0.1);
  }

  // Generate White Noise Buffer
  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.context) return null;
    const bufferSize = 2 * this.context.sampleRate;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private stopCurrentSounds() {
    this.sourceNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) { /* ignore */ }
    });
    this.sourceNodes = [];
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateGain();
  }

  public toggleMute(shouldMute: boolean) {
    this.isMuted = shouldMute;
    this.updateGain();
  }

  public stopAlarm() {
    if (this.alarmSource) {
      try {
        this.alarmSource.stop();
        this.alarmSource.disconnect();
      } catch (e) { /* ignore */ }
      this.alarmSource = null;
    }
  }

  public async playAlarm(url: string) {
    this.init();
    this.stopAlarm(); // Stop any currently playing alarm/preview

    if (!this.context || !this.gainNode) return;
    
    // Resume context if suspended (browser policy)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    try {
      let audioBuffer = this.alarmCache.get(url);

      // Fetch and decode if not in cache
      if (!audioBuffer) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.alarmCache.set(url, audioBuffer);
      }
      
      const source = this.context.createBufferSource();
      source.buffer = audioBuffer;
      
      // Connect directly to the master gain node
      // This ensures it respects both Master Volume and Mute state
      source.connect(this.gainNode);
      
      source.start();
      this.alarmSource = source;
      
      source.onended = () => {
        if (this.alarmSource === source) {
          this.alarmSource = null;
        }
      };

    } catch (error) {
      console.error("Failed to play alarm:", error);
    }
  }

  public async play(preset: AudioPreset) {
    this.init();
    if (!this.context || !this.gainNode) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    if (this.currentPreset === preset && this.isPlaying) return;

    this.stopCurrentSounds();
    this.currentPreset = preset;
    this.isPlaying = true;

    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    const noiseSource = this.context.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Create specific filters based on preset
    const filter = this.context.createBiquadFilter();
    
    switch (preset) {
      case AudioPreset.WIND: // Low pass noise
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        // Add some modulation for wind gusts
        const windLFO = this.context.createOscillator();
        windLFO.type = 'sine';
        windLFO.frequency.value = 0.1;
        const windGain = this.context.createGain();
        windGain.gain.value = 200;
        windLFO.connect(windGain);
        windGain.connect(filter.frequency);
        windLFO.start();
        this.sourceNodes.push(windLFO);
        break;

      case AudioPreset.OCEAN: // Bandpass/Lowpass with slow modulation
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        const tideLFO = this.context.createOscillator();
        tideLFO.type = 'sine';
        tideLFO.frequency.value = 0.05; // Very slow waves
        const tideGain = this.context.createGain();
        tideGain.gain.value = 300; 
        tideLFO.connect(tideGain);
        tideGain.connect(filter.frequency);
        tideLFO.start();
        this.sourceNodes.push(tideLFO);
        break;

      case AudioPreset.FOREST_AMBIENCE: // Pink-ish noise (approximated with lowpass) + high freq
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        break;
        
      case AudioPreset.DEEP_DRONE:
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        // Add a deep sine wave
        const droneOsc = this.context.createOscillator();
        droneOsc.type = 'triangle';
        droneOsc.frequency.value = 55;
        const droneGain = this.context.createGain();
        droneGain.gain.value = 0.1;
        droneOsc.connect(droneGain);
        droneGain.connect(this.gainNode);
        droneOsc.start();
        this.sourceNodes.push(droneOsc);
        break;
    }

    noiseSource.connect(filter);
    filter.connect(this.gainNode);
    noiseSource.start();
    this.sourceNodes.push(noiseSource);
  }

  public stop() {
    this.stopCurrentSounds();
    this.isPlaying = false;
  }
}

export const audioEngine = new AmbientAudioEngine();
