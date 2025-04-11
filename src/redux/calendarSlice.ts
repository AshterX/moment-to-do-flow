
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarState, Event, Goal, Task } from './types';
import { format } from 'date-fns';

const initialState: CalendarState = {
  events: [],
  goals: [],
  tasks: [],
  selectedGoal: null,
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  currentView: 'week',
  loading: false,
  error: null,
  isEventModalOpen: false,
  editingEvent: null,
};

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Events CRUD
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    
    // Goals and Tasks
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      state.goals = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setSelectedGoal: (state, action: PayloadAction<string | null>) => {
      state.selectedGoal = action.payload;
    },
    
    // Calendar Navigation
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'day' | 'week' | 'month' | 'year'>) => {
      state.currentView = action.payload;
    },
    
    // UI States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    openEventModal: (state, action: PayloadAction<Event | null>) => {
      state.isEventModalOpen = true;
      state.editingEvent = action.payload;
    },
    closeEventModal: (state) => {
      state.isEventModalOpen = false;
      state.editingEvent = null;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setGoals,
  setTasks,
  setSelectedGoal,
  setSelectedDate,
  setCurrentView,
  setLoading,
  setError,
  openEventModal,
  closeEventModal,
} = calendarSlice.actions;

export default calendarSlice.reducer;
