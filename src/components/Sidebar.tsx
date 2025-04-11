
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedGoal } from '@/redux/calendarSlice';
import { fetchTasks } from '@/redux/thunks';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { goals, tasks, selectedGoal } = useAppSelector(state => state.calendar);
  
  const handleGoalClick = (goalId: string) => {
    dispatch(setSelectedGoal(selectedGoal === goalId ? null : goalId));
    if (selectedGoal !== goalId) {
      dispatch(fetchTasks(goalId));
    }
  };
  
  const handleTaskDragStart = (e: React.DragEvent, task: { id: string; name: string; goalId: string }) => {
    const goalColor = goals.find(goal => goal.id === task.goalId)?.color || '#000000';
    e.dataTransfer.setData('task', JSON.stringify({...task, color: goalColor}));
  };
  
  return (
    <div className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">GOALS</h2>
        <ul className="mt-2 space-y-1">
          {goals.map(goal => (
            <li 
              key={goal.id} 
              className={`p-2 rounded cursor-pointer flex items-center ${selectedGoal === goal.id ? 'bg-gray-100' : ''}`}
              onClick={() => handleGoalClick(goal.id)}
            >
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: goal.color }}
              />
              <span>{goal.name}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {selectedGoal && (
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="font-semibold text-lg">TASKS</h2>
          <ul className="mt-2 space-y-1">
            {tasks
              .filter(task => task.goalId === selectedGoal)
              .map(task => (
                <li 
                  key={task.id} 
                  className="p-2 bg-gray-50 rounded cursor-move border border-dashed"
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, task)}
                >
                  <span>{task.name}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
