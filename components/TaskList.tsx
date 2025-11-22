
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task, ThemeType } from '../types';

interface TaskListProps {
  themeType: ThemeType;
  hideCompleted: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ themeType, hideCompleted }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const visibleTasks = hideCompleted ? tasks.filter(t => !t.completed) : tasks;

  return (
    <div className="w-full h-full flex flex-col transition-all duration-500">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-extralight text-white drop-shadow-md mb-2">Tasks</h2>
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm font-light">
            {tasks.length === 0 ? 'Ready to focus' : `${tasks.filter(t => !t.completed).length} remaining`}
          </p>
        </div>
      </div>

      {/* Task Items */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar mask-image-gradient">
        {visibleTasks.map(task => (
          <div 
            key={task.id} 
            className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ease-out ${
              task.completed 
                ? 'bg-black/20 border-transparent opacity-50' 
                : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20 shadow-sm hover:shadow-md'
            }`}
          >
            <button 
              onClick={() => toggleTask(task.id)} 
              className={`transition-colors ${task.completed ? 'text-white/40' : 'text-white/80 hover:text-white'}`}
            >
              {task.completed ? <CheckCircle size={18} strokeWidth={1.5} /> : <Circle size={18} strokeWidth={1.5} />}
            </button>
            
            <span className={`flex-1 font-light text-sm tracking-wide ${task.completed ? 'line-through text-white/40' : 'text-white/90'}`}>
              {task.text}
            </span>
            
            <button 
              onClick={() => removeTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-300 transition-all p-1"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}
        
        {tasks.length > 0 && visibleTasks.length === 0 && (
           <div className="text-center py-10 text-white/30 text-sm font-light italic">
              All tasks completed
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 relative group">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..." 
          className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-all font-light"
        />
        <button 
          onClick={addTask}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Plus size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default TaskList;
