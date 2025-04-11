
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchEvents, fetchGoals, fetchTasks } from '@/redux/thunks';
import CalendarHeader from '@/components/CalendarHeader';
import Sidebar from '@/components/Sidebar';
import WeekView from '@/components/WeekView';
import EventModal from '@/components/EventModal';

const CalendarApp = () => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector(state => state.calendar);
  
  useEffect(() => {
    // Fetch initial data
    dispatch(fetchEvents());
    dispatch(fetchGoals());
  }, [dispatch]);
  
  // Render the appropriate calendar view based on currentView state
  const renderCalendarView = () => {
    switch (currentView) {
      case 'week':
        return <WeekView />;
      // Add more views as needed
      default:
        return <WeekView />;
    }
  };
  
  return (
    <div className="h-screen flex flex-col">
      <CalendarHeader />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {renderCalendarView()}
      </div>
      <EventModal />
    </div>
  );
};

const Index = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <CalendarApp />
      </DndProvider>
    </Provider>
  );
};

export default Index;
