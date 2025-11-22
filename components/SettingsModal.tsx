
import React, { useState, useRef } from 'react';
import { X, Volume2, Clock, Sparkles, Monitor, Move, Upload, Image as ImageIcon, Trash2, ZapOff, PlayCircle, Bell, CheckSquare, EyeOff } from 'lucide-react';
import { AppSettings, AnimationSpeed } from '../types';
import { ALARM_SOUNDS } from '../constants';
import { audioEngine } from '../services/audioEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

type SettingsTab = 'visuals' | 'timer' | 'general';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('visuals');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) });
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateSetting('customBackgroundImage', imageUrl);
    }
  };

  const clearCustomBackground = () => {
    updateSetting('customBackgroundImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewAlarm = (url: string) => {
    audioEngine.playAlarm(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row h-[600px] md:h-[550px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-48 bg-white/5 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-row md:flex-col gap-2">
          <div className="hidden md:block px-4 py-6 mb-4">
            <h2 className="text-2xl font-thin text-white tracking-wide">Settings</h2>
          </div>
          
          <button 
            onClick={() => setActiveTab('visuals')}
            className={`flex-1 md:flex-none flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeTab === 'visuals' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Sparkles size={18} />
            <span className="font-light">Visuals</span>
          </button>
          
           <button 
            onClick={() => setActiveTab('timer')}
            className={`flex-1 md:flex-none flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeTab === 'timer' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Clock size={18} />
            <span className="font-light">Timer</span>
          </button>

          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 md:flex-none flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeTab === 'general' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          >
            <Monitor size={18} />
            <span className="font-light">General</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full relative">
          <div className="absolute top-4 right-4 z-10">
             <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            
            {/* VISUALS TAB */}
            {activeTab === 'visuals' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="space-y-1 border-b border-white/5 pb-4">
                   <h3 className="text-xl font-light text-white">Appearance</h3>
                   <p className="text-sm text-white/40 font-light">Customize your environment atmosphere</p>
                </div>

                <div className="space-y-6">
                  
                   {/* Custom Wallpaper Upload */}
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-white/80 font-light text-sm">
                        <ImageIcon size={16} className="text-white/60" />
                        <span>Custom Wallpaper</span>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        <div className="flex-1 flex items-center gap-3">
                           {settings.customBackgroundImage ? (
                             <div className="flex items-center gap-3 w-full">
                               <div className="w-10 h-10 rounded-lg bg-cover bg-center border border-white/20" style={{ backgroundImage: `url(${settings.customBackgroundImage})` }} />
                               <div className="flex-1 min-w-0">
                                 <p className="text-sm text-white font-light truncate">Custom Image Set</p>
                                 <p className="text-xs text-white/40">Overrides theme background</p>
                               </div>
                             </div>
                           ) : (
                             <p className="text-sm text-white/40 font-light italic">No custom image selected</p>
                           )}
                        </div>

                        <div className="flex items-center gap-2">
                          {settings.customBackgroundImage && (
                             <button 
                              onClick={clearCustomBackground}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                              title="Remove custom image"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all text-sm"
                          >
                            <Upload size={16} />
                            <span>{settings.customBackgroundImage ? 'Change' : 'Upload'}</span>
                          </button>
                        </div>
                      </div>
                   </div>

                  {/* Particles Toggle */}
                   <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Sparkles size={18} className="text-white/60" />
                      <span className="text-white/80 font-light">Ambient Particles</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.particlesEnabled}
                        onChange={(e) => updateSetting('particlesEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/60 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                    </div>
                  </label>
                  
                  {/* Breathing Effect Toggle */}
                   <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Move size={18} className="text-white/60" />
                      <div className="flex flex-col">
                          <span className="text-white/80 font-light">Breathing Background</span>
                          <span className="text-white/30 text-xs">Slowly zoom in and out (off by default)</span>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.breathingEffectEnabled}
                        onChange={(e) => updateSetting('breathingEffectEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/60 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                    </div>
                  </label>

                  {/* Focus Blur Toggle */}
                  <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <EyeOff size={18} className="text-white/60" />
                      <div className="flex flex-col">
                          <span className="text-white/80 font-light">Focus Blur</span>
                          <span className="text-white/30 text-xs">Blur interface on inactivity (off by default)</span>
                      </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.focusBlurEnabled}
                        onChange={(e) => updateSetting('focusBlurEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/60 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                    </div>
                  </label>

                  {/* Sliders */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/60 font-light">
                        <span>Background Blur Intensity</span>
                        <span>{settings.backgroundBlur}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        step="1" 
                        value={settings.backgroundBlur} 
                        onChange={(e) => updateSetting('backgroundBlur', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/80"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/60 font-light">
                        <span>Overlay Dimming</span>
                        <span>{Math.round(settings.overlayOpacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="0.8" 
                        step="0.1" 
                        value={settings.overlayOpacity} 
                        onChange={(e) => updateSetting('overlayOpacity', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/80"
                      />
                    </div>

                     <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/60 font-light">
                        <span>Animation Speed</span>
                        <span className="capitalize">{settings.animationSpeed}</span>
                      </div>
                      <div className="flex bg-white/5 rounded-lg p-1">
                        {(['zen', 'slow', 'normal'] as AnimationSpeed[]).map((speed) => (
                          <button
                            key={speed}
                            onClick={() => updateSetting('animationSpeed', speed)}
                            className={`flex-1 py-1.5 text-xs rounded-md transition-all capitalize ${
                              settings.animationSpeed === speed 
                                ? 'bg-white/20 text-white shadow-sm' 
                                : 'text-white/40 hover:text-white/70'
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TIMER TAB */}
            {activeTab === 'timer' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                 <div className="space-y-1 border-b border-white/5 pb-4">
                   <h3 className="text-xl font-light text-white">Timer</h3>
                   <p className="text-sm text-white/40 font-light">Configure your focus sessions</p>
                </div>

                <div className="space-y-6">
                  {/* Show Seconds */}
                  <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-white/60" />
                      <span className="text-white/80 font-light">Show Seconds</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.showSeconds}
                        onChange={(e) => updateSetting('showSeconds', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/60 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                    </div>
                  </label>

                  {/* Alarm Sound Toggle */}
                  <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-white/60" />
                      <span className="text-white/80 font-light">Timer Alarm</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.timerAlarm}
                        onChange={(e) => updateSetting('timerAlarm', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/60 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                    </div>
                  </label>

                   {/* Alarm Sound Selector */}
                   <div className={`space-y-3 transition-opacity duration-300 ${!settings.timerAlarm ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <div className="text-xs text-white/60 font-light uppercase tracking-wider ml-1">Alarm Tone</div>
                      <div className="grid gap-2">
                        {ALARM_SOUNDS.map((sound) => (
                          <div key={sound.url} className="flex gap-2">
                            <button
                              onClick={() => {
                                updateSetting('alarmSound', sound.url);
                                previewAlarm(sound.url);
                              }}
                              className={`flex-1 flex items-center justify-between p-3 rounded-lg border transition-all ${
                                settings.alarmSound === sound.url || (!settings.alarmSound && sound === ALARM_SOUNDS[0])
                                  ? 'bg-white/10 border-white/30 text-white' 
                                  : 'bg-transparent border-white/5 text-white/60 hover:bg-white/5 hover:text-white/80'
                              }`}
                            >
                              <span className="font-light text-sm">{sound.label}</span>
                              {settings.alarmSound === sound.url && <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>}
                            </button>
                            <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 previewAlarm(sound.url);
                               }}
                               className="p-3 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                               title="Preview Sound"
                            >
                               <PlayCircle size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                   </div>

                </div>
              </div>
            )}

            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                 <div className="space-y-1 border-b border-white/5 pb-4">
                   <h3 className="text-xl font-light text-white">General</h3>
                   <p className="text-sm text-white/40 font-light">System preferences</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-3">
                    <div className="flex items-center justify-between text-white/80 font-light">
                      <div className="flex items-center gap-3">
                         <Volume2 size={18} className="text-white/60" />
                         <span>Master Volume</span>
                      </div>
                      <span className="text-xs text-white/40">{Math.round(settings.volume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={settings.volume} 
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/80"
                    />
                  </div>

                   <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <CheckSquare size={18} className="text-white/60" />
                      <span className="text-white/80 font-light">Hide Completed Tasks</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.hideCompletedTasks}
                        onChange={(e) => updateSetting('hideCompletedTasks', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/60 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/30"></div>
                    </div>
                  </label>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
