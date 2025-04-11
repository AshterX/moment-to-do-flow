
export interface Event {
  id: string;
  title: string;
  category: 'exercise' | 'eating' | 'work' | 'relax' | 'family' | 'social';
  startTime: string;
  endTime: string;
  date: string;
}

export interface Task {
  id: string;
  name: string;
  goalId: string;
}

export interface Goal {
  id: string;
  name: string;
  color: string;
}

export interface CalendarState {
  events: Event[];
  goals: Goal[];
  tasks: Task[];
  selectedGoal: string | null;
  selectedDate: string;
  currentView: 'day' | 'week' | 'month' | 'year';
  loading: boolean;
  error: string | null;
  isEventModalOpen: boolean;
  editingEvent: Event | null;
}
