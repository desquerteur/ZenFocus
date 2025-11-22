
import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Volume2, VolumeX, Minimize2, Settings, Upload } from 'lucide-react';
import { THEMES, DEFAULT_TIMER_MINUTES, ALARM_SOUNDS } from './constants';
import { ThemeType, AppSettings } from './types';
import AmbientBackground from './components/AmbientBackground';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import SettingsModal from './components/SettingsModal';
import { audioEngine } from './services/audioEngine';

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(ThemeType.SNOW);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Hidden input for dock upload
  const dockFileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    volume: 0.5,
    showSeconds: true,
    timerAlarm: true,
    alarmSound: ALARM_SOUNDS[0].url,
    particlesEnabled: true,
    breathingEffectEnabled: false, // Default OFF
    focusBlurEnabled: false, // Default OFF - Keeps timer clear during inactivity
    backgroundBlur: 0,
    overlayOpacity: 0.3,
    animationSpeed: 'slow',
    hideCompletedTasks: false,
    customBackgroundImage: null
  });

  // Synchronize Audio Engine State
  useEffect(() => {
    // Always update volume and mute state in engine first
    audioEngine.setVolume(settings.volume);
    audioEngine.toggleMute(isMuted);

    // Handle ambient playback
    if (!isMuted) {
      audioEngine.play(THEMES[currentTheme].audioPreset);
    } else {
      // We stop the ambient loops when muted to save resources, 
      // but the engine state remains 'muted' so alarms will also be silent/muted if triggered
      audioEngine.stop();
    }
  }, [currentTheme, isMuted, settings.volume]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle file upload from dock
  const handleDockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSettings(prev => ({ ...prev, customBackgroundImage: imageUrl }));
      setCurrentTheme(ThemeType.CUSTOM);
    }
  };

  const handleThemeClick = (type: ThemeType) => {
    if (type === ThemeType.CUSTOM) {
       // If already custom, or if empty, trigger upload
       if (currentTheme === ThemeType.CUSTOM || !settings.customBackgroundImage) {
          dockFileInputRef.current?.click();
       }
       setCurrentTheme(ThemeType.CUSTOM);
    } else {
      setCurrentTheme(type);
    }
  };

  // Hide UI after inactivity for immersion
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setIsUiVisible(true);
      clearTimeout(timeout);
      // If settings are open, don't hide UI
      if (!isSettingsOpen) {
        timeout = setTimeout(() => setIsUiVisible(false), 5000); // Hide after 5s
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('keydown', resetTimer);
    
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, [isSettingsOpen]);

  const activeTheme = THEMES[currentTheme];
  
  // Background Logic: 
  // If Custom Theme is selected -> Use uploaded image (or default custom placeholder).
  // Otherwise -> Use the specific theme's image.
  const backgroundImage = currentTheme === ThemeType.CUSTOM && settings.customBackgroundImage 
    ? settings.customBackgroundImage 
    : activeTheme.imageUrl;

  return (
    <div className="relative w-full h-screen overflow-hidden text-slate-100 selection:bg-white/30 selection:text-white font-sans bg-black">
      {/* Hidden file input for dock button */}
      <input 
        type="file" 
        ref={dockFileInputRef}
        onChange={handleDockFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 
         Background Image Layer 
         - Uses style prop for dynamic background image
         - Filter blur controlled by settings
         - Animation: custom breathe effect via scaling
      */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: `blur(${settings.backgroundBlur}px)`,
          // Very slow breathing animation applied manually via transition or here
          transform: 'scale(1.05)', 
          animation: (settings.breathingEffectEnabled && settings.animationSpeed !== 'zen') 
            ? `breathe 60s infinite alternate ease-in-out` 
            : 'none'
        }}
      />
      
      {/* Cinematic Overlay with configurable opacity */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${activeTheme.secondaryColor} to-black mix-blend-overlay transition-colors duration-1000`}
        style={{ opacity: 0.5 }} // Fixed base opacity for color
      />
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000" 
        style={{ opacity: settings.overlayOpacity }}
      /> 
      
      {/* Canvas Particle Layer */}
      <AmbientBackground 
        theme={currentTheme} 
        enabled={settings.particlesEnabled} 
        speed={settings.animationSpeed}
      />

      {/* Main Content Layer - Uses Absolute Positioning for precise centering */}
      <main className="relative z-10 w-full h-full pointer-events-none overflow-hidden">
        
        {/* Timer - Perfectly Centered */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div 
            className={`pointer-events-auto transition-all duration-1000 ease-in-out 
              ${isUiVisible && !isSettingsOpen 
                ? 'scale-100 opacity-100 blur-0' 
                : `scale-110 opacity-80 ${settings.focusBlurEnabled ? 'blur-[1px]' : 'blur-0'} delay-150`
              }`
            }
          >
            <Timer 
              initialMinutes={DEFAULT_TIMER_MINUTES} 
              showSeconds={settings.showSeconds}
              playAlarm={settings.timerAlarm}
              alarmSound={settings.alarmSound}
            />
          </div>
        </div>

        {/* Task List - Left Side */}
        <div className={`absolute top-0 left-0 h-full flex items-center p-8 md:p-12 z-10 transition-all duration-1000 ease-in-out ${isUiVisible && !isSettingsOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
           <div className="w-full max-w-md md:w-[350px] pointer-events-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[70vh] hover:bg-black/30 hover:border-white/20 transition-colors">
              <TaskList themeType={currentTheme} hideCompleted={settings.hideCompletedTasks} />
           </div>
        </div>

      </main>

      {/* Dock / Theme Selector */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-out ${isUiVisible && !isSettingsOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="flex gap-3 p-3 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl ring-1 ring-white/5 hover:scale-105 transition-transform duration-300">
          {Object.values(THEMES).map((theme) => {
            const isCustom = theme.type === ThemeType.CUSTOM;
            const isActive = currentTheme === theme.type;
            const hasCustomImage = isCustom && settings.customBackgroundImage;
            
            // Determine class string based on state to ensure readability over custom images
            let buttonClasses = "relative px-5 py-2 rounded-full text-sm tracking-wide transition-all duration-500 overflow-hidden group flex items-center gap-2 ";
            
            if (isActive) {
              if (hasCustomImage) {
                // Active with custom image: White text with shadow, ring for selection
                buttonClasses += "text-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-1 ring-white/80";
              } else {
                // Active standard: White background, black text
                buttonClasses += "bg-white/90 text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]";
              }
            } else {
              // Inactive
              buttonClasses += "text-white/70 hover:text-white hover:bg-white/10";
            }

            return (
              <button
                key={theme.type}
                onClick={() => handleThemeClick(theme.type)}
                className={buttonClasses}
              >
                {/* Render Custom Image as Button Background if available */}
                {hasCustomImage && (
                  <>
                    <div 
                      className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity"
                      style={{ 
                        backgroundImage: `url(${settings.customBackgroundImage})`,
                        opacity: isActive ? 0.8 : 0.4 // Dim when inactive
                      }}
                    />
                    {/* Overlay to ensure icon/text visibility */}
                    <div className={`absolute inset-0 ${isActive ? 'bg-black/30' : 'bg-black/50'}`} />
                  </>
                )}

                <span className="relative z-10 drop-shadow-md">{theme.label}</span>
                
                {isCustom && (
                  <Upload size={14} className={`relative z-10 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Right Utilities */}
      <div className={`absolute top-8 right-8 flex gap-4 z-50 transition-all duration-700 ease-out ${isUiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <button 
          onClick={toggleMute}
          className="group p-3 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          title={isMuted ? "Unmute" : "Mute Audio"}
        >
          {isMuted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
        </button>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="group p-3 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          title="Settings"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <button 
          onClick={toggleFullscreen}
          className="group p-3 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={20} strokeWidth={1.5} /> : <Maximize2 size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onUpdateSettings={setSettings}
      />
      
      {/* CSS for custom breathing animation that isn't in Tailwind default */}
      <style>{`
        @keyframes breathe {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>

    </div>
  );
};

export default App;
