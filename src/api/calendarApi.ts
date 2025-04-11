
import { Event, Goal, Task } from '../redux/types';

// This is a mock API service - in a real application, you would replace these
// functions with actual API calls to your MongoDB backend

// Base URL for your API
const BASE_URL = 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Event APIs
export const fetchEvents = async (): Promise<Event[]> => {
  // Mock implementation - replace with actual API call
  console.log('Fetching events');
  
  // For demo purposes, return mock data
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Monday Wake-Up',
      category: 'exercise',
      startTime: '2025-04-08T08:00:00',
      endTime: '2025-04-08T08:30:00',
      date: '2025-04-08',
    },
    {
      id: '2',
      title: 'All-Team Kickoff',
      category: 'work',
      startTime: '2025-04-08T09:00:00',
      endTime: '2025-04-08T09:45:00',
      date: '2025-04-08',
    },
    {
      id: '3',
      title: 'Financial Update',
      category: 'work',
      startTime: '2025-04-08T10:00:00',
      endTime: '2025-04-08T10:30:00',
      date: '2025-04-08',
    },
    {
      id: '4',
      title: 'Design System Kickoff Lunch',
      category: 'work',
      startTime: '2025-04-10T12:00:00',
      endTime: '2025-04-10T13:00:00',
      date: '2025-04-10',
    },
    {
      id: '5',
      title: 'Design Review',
      category: 'work',
      startTime: '2025-04-08T13:00:00',
      endTime: '2025-04-08T14:00:00',
      date: '2025-04-08',
    },
  ];
  
  return mockEvents;
  
  // Actual implementation would be:
  // return fetch(`${BASE_URL}/events`)
  //   .then(handleResponse);
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  console.log('Creating event:', event);
  
  // Mock implementation
  return {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
  };
  
  // Actual implementation would be:
  // return fetch(`${BASE_URL}/events`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(event),
  // }).then(handleResponse);
};

export const updateEvent = async (event: Event): Promise<Event> => {
  console.log('Updating event:', event);
  
  // Mock implementation
  return event;
  
  // Actual implementation would be:
  // return fetch(`${BASE_URL}/events/${event.id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(event),
  // }).then(handleResponse);
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  console.log('Deleting event:', eventId);
  
  // Mock implementation
  return Promise.resolve();
  
  // Actual implementation would be:
  // return fetch(`${BASE_URL}/events/${eventId}`, {
  //   method: 'DELETE',
  // }).then(handleResponse);
};

// Goals and Tasks APIs
export const fetchGoals = async (): Promise<Goal[]> => {
  console.log('Fetching goals');
  
  // Mock implementation
  const mockGoals: Goal[] = [
    { id: '1', name: 'Be fit', color: '#FF9F33' },
    { id: '2', name: 'Academics', color: '#9F33FF' },
    { id: '3', name: 'LEARN', color: '#33A3FF' },
    { id: '4', name: 'Sports', color: '#33FFB5' },
  ];
  
  return mockGoals;
  
  // Actual implementation would be:
  // return fetch(`${BASE_URL}/goals`)
  //   .then(handleResponse);
};

export const fetchTasks = async (goalId?: string): Promise<Task[]> => {
  console.log('Fetching tasks for goal:', goalId);
  
  // Mock implementation
  const mockTasks: Task[] = [
    { id: '1', name: 'AI based agents', goalId: '3' },
    { id: '2', name: 'MLE', goalId: '3' },
    { id: '3', name: 'DE related', goalId: '3' },
    { id: '4', name: 'Basics', goalId: '3' },
  ];
  
  return goalId 
    ? mockTasks.filter(task => task.goalId === goalId)
    : mockTasks;
  
  // Actual implementation would be:
  // const url = goalId ? `${BASE_URL}/tasks?goalId=${goalId}` : `${BASE_URL}/tasks`;
  // return fetch(url).then(handleResponse);
};
