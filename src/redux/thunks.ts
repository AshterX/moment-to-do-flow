
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/calendarApi';
import { 
  setEvents, 
  setGoals, 
  setTasks, 
  setLoading,
  setError,
  addEvent,
  updateEvent as updateEventAction,
  deleteEvent as deleteEventAction,
  closeEventModal
} from './calendarSlice';
import { Event } from './types';

// Thunk for fetching events
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const events = await api.fetchEvents();
      dispatch(setEvents(events));
      return events;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch events';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for fetching goals
export const fetchGoals = createAsyncThunk(
  'calendar/fetchGoals',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const goals = await api.fetchGoals();
      dispatch(setGoals(goals));
      return goals;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch goals';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  'calendar/fetchTasks',
  async (goalId: string | null, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const tasks = await api.fetchTasks(goalId || undefined);
      dispatch(setTasks(tasks));
      return tasks;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for creating an event
export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData: Omit<Event, 'id'>, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const newEvent = await api.createEvent(eventData);
      dispatch(addEvent(newEvent));
      dispatch(closeEventModal());
      return newEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for updating an event
export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async (eventData: Event, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const updatedEvent = await api.updateEvent(eventData);
      dispatch(updateEventAction(updatedEvent));
      dispatch(closeEventModal());
      return updatedEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for deleting an event
export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await api.deleteEvent(eventId);
      dispatch(deleteEventAction(eventId));
      dispatch(closeEventModal());
      return eventId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);
