
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentView, setSelectedDate } from '@/redux/calendarSlice';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';

const CalendarHeader = () => {
  const dispatch = useAppDispatch();
  const { selectedDate, currentView } = useAppSelector(state => state.calendar);
  
  const date = new Date(selectedDate);
  
  const navigateToToday = () => {
    dispatch(setSelectedDate(format(new Date(), 'yyyy-MM-dd')));
  };
  
  const navigatePrevious = () => {
    // Navigation depends on current view
    if (currentView === 'day') {
      dispatch(setSelectedDate(format(subDays(date, 1), 'yyyy-MM-dd')));
    } else if (currentView === 'week') {
      dispatch(setSelectedDate(format(subDays(date, 7), 'yyyy-MM-dd')));
    }
    // Add logic for month and year navigation
  };
  
  const navigateNext = () => {
    // Navigation depends on current view
    if (currentView === 'day') {
      dispatch(setSelectedDate(format(addDays(date, 1), 'yyyy-MM-dd')));
    } else if (currentView === 'week') {
      dispatch(setSelectedDate(format(addDays(date, 7), 'yyyy-MM-dd')));
    }
    // Add logic for month and year navigation
  };
  
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  
  const getHeaderTitle = () => {
    switch (currentView) {
      case 'day':
        return format(date, 'MMMM d, yyyy');
      case 'week':
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return '';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={navigateToToday}>
          Today
        </Button>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant={currentView === 'day' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => dispatch(setCurrentView('day'))}
        >
          Day
        </Button>
        <Button 
          variant={currentView === 'week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => dispatch(setCurrentView('week'))}
        >
          Week
        </Button>
        <Button 
          variant={currentView === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => dispatch(setCurrentView('month'))}
        >
          Month
        </Button>
        <Button 
          variant={currentView === 'year' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => dispatch(setCurrentView('year'))}
        >
          Year
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
