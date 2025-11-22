
import React, { useEffect, useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface TimerProps {
  initialMinutes: number;
  showSeconds: boolean;
  playAlarm: boolean;
  alarmSound: string;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, showSeconds, playAlarm, alarmSound }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(initialMinutes);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            clearInterval(interval);
            if (playAlarm) {
              audioEngine.playAlarm(alarmSound);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, playAlarm, alarmSound]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(120, Number(e.target.value)));
    setDuration(val);
    setMinutes(val);
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Time Display - Ultra Clean */}
      <div className="flex items-baseline justify-center text-white drop-shadow-2xl select-none transition-all duration-500">
        <span className="text-[10rem] leading-none font-thin tracking-tighter tabular-nums">
          {String(minutes).padStart(2, '0')}
        </span>
        {showSeconds && (
          <>
            <span className="text-[8rem] leading-none font-thin px-2 opacity-60 animate-pulse">:</span>
            <span className="text-[10rem] leading-none font-thin tracking-tighter tabular-nums">
               {String(seconds).padStart(2, '0')}
            </span>
          </>
        )}
        {!showSeconds && isActive && (
           // Minimal pulse dot when seconds are hidden so user knows it is running
           <div className="ml-4 w-4 h-4 rounded-full bg-white/50 animate-ping"></div>
        )}
      </div>
      
      {/* Controls Container - Fades in on hover or when paused */}
      <div className={`flex flex-col items-center space-y-6 transition-all duration-700 ease-out ${isHovered || !isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
        
        <div className="flex items-center space-x-8 mt-8">
          <button 
            onClick={toggleTimer}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/5 transition-all active:scale-95 backdrop-blur-sm shadow-xl"
            aria-label={isActive ? "Pause Timer" : "Start Timer"}
          >
            {isActive ? <Pause size={40} strokeWidth={1.5} /> : <Play size={40} strokeWidth={1.5} className="ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/5 transition-all active:scale-95 backdrop-blur-sm shadow-xl"
            aria-label="Reset Timer"
          >
            <RefreshCw size={32} strokeWidth={1.5} />
          </button>
        </div>

        <div className="w-64 flex flex-col items-center space-y-2 pt-4">
          <label className="text-white/60 text-xs uppercase tracking-[0.2em] font-light">Duration</label>
          <input 
            type="range" 
            min="1" 
            max="90" 
            value={duration} 
            onChange={handleDurationChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/80 hover:accent-white"
          />
          <div className="text-white/60 text-sm font-light">{duration} min</div>
        </div>

      </div>
    </div>
  );
};

export default Timer;
