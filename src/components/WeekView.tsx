
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { openEventModal } from '@/redux/calendarSlice';
import { 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  isSameDay,
  getHours,
  getMinutes,
  addDays
} from 'date-fns';
import { Event } from '@/redux/types';
import CalendarEvent from './CalendarEvent';
import { useDrop } from 'react-dnd';

const WeekView = () => {
  const dispatch = useAppDispatch();
  const { selectedDate, events } = useAppSelector(state => state.calendar);
  
  const currentDate = new Date(selectedDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 = Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Generate hours from 7AM to 7PM
  const hours = Array.from({ length: 13 }, (_, i) => i + 7);
  
  const getPositionForTime = (time: string) => {
    const date = parseISO(time);
    const hour = getHours(date);
    const minute = getMinutes(date);
    
    // Calculate position: each hour is 60px, and position starts from 7AM (hour 7)
    return (hour - 7) * 60 + minute;
  };
  
  const renderEvent = (event: Event, dayIndex: number, columnWidth: number) => {
    const eventDate = parseISO(event.date);
    
    if (!isSameDay(eventDate, daysOfWeek[dayIndex])) {
      return null;
    }
    
    const top = getPositionForTime(event.startTime);
    
    return (
      <CalendarEvent 
        key={event.id}
        event={event}
        columnWidth={columnWidth}
        style={{ top: `${top}px`, left: `${dayIndex * columnWidth}px` }}
      />
    );
  };
  
  const handleCellClick = (day: Date, hour: number) => {
    // Create a new date at the clicked time
    const clickedDate = new Date(day);
    clickedDate.setHours(hour);
    clickedDate.setMinutes(0);
    
    // Create end time (1 hour later)
    const endTime = new Date(clickedDate);
    endTime.setHours(hour + 1);
    
    // Open the event modal with pre-filled start time
    dispatch(openEventModal({
      id: '',
      title: '',
      category: 'work',
      date: format(clickedDate, 'yyyy-MM-dd'),
      startTime: clickedDate.toISOString(),
      endTime: endTime.toISOString(),
    }));
  };
  
  const handleDropOnCell = (day: Date, hour: number, item: any) => {
    // Create a new date at the dropped time
    const droppedDate = new Date(day);
    droppedDate.setHours(hour);
    droppedDate.setMinutes(0);
    
    // Create end time (1 hour later)
    const endTime = new Date(droppedDate);
    endTime.setHours(hour + 1);
    
    if (item.name) {
      // This is a task being dropped
      dispatch(openEventModal({
        id: '',
        title: item.name,
        category: 'work', // Default category
        date: format(droppedDate, 'yyyy-MM-dd'),
        startTime: droppedDate.toISOString(),
        endTime: endTime.toISOString(),
      }));
    } else {
      // This is an event being moved
      dispatch(openEventModal({
        ...item,
        date: format(droppedDate, 'yyyy-MM-dd'),
        startTime: droppedDate.toISOString(),
        endTime: endTime.toISOString(),
      }));
    }
  };
  
  const columnWidth = 100; // Width of each day column in pixels
  
  return (
    <div className="flex-1 overflow-auto">
      {/* Header with days of the week */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        <div className="w-16 shrink-0"></div> {/* Time labels column */}
        {daysOfWeek.map((day, index) => (
          <div 
            key={index}
            className={`flex-1 text-center p-2 border-l ${
              isSameDay(day, new Date()) ? 'bg-blue-50' : ''
            }`}
            style={{ minWidth: `${columnWidth}px` }}
          >
            <div className="font-medium">{format(day, 'EEE')}</div>
            <div className="text-2xl">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="relative">
        {/* Time labels */}
        <div className="absolute top-0 left-0 w-16">
          {hours.map(hour => (
            <div 
              key={hour}
              className="text-right pr-2 text-xs text-gray-500"
              style={{ height: '60px', lineHeight: '60px' }}
            >
              {hour % 12 === 0 ? '12' : hour % 12} {hour < 12 ? 'AM' : 'PM'}
            </div>
          ))}
        </div>
        
        {/* Grid and events */}
        <div className="ml-16">
          <div className="relative">
            {/* Horizontal hour lines */}
            {hours.map(hour => (
              <div 
                key={hour}
                className="border-t border-gray-200 relative"
                style={{ height: '60px' }}
              />
            ))}
            
            {/* Vertical day columns */}
            <div 
              className="absolute top-0 left-0 right-0 bottom-0 grid"
              style={{ 
                gridTemplateColumns: `repeat(${daysOfWeek.length}, ${columnWidth}px)`,
                height: `${hours.length * 60}px`
              }}
            >
              {daysOfWeek.map((day, dayIndex) => (
                <div key={dayIndex} className="relative border-l h-full">
                  {/* Drop targets for each hour cell */}
                  {hours.map(hour => {
                    const [{ isOver }, drop] = useDrop({
                      accept: ['EVENT', 'TASK'],
                      drop: (item) => handleDropOnCell(day, hour, item),
                      collect: (monitor) => ({
                        isOver: !!monitor.isOver(),
                      }),
                    });
                    
                    return (
                      <div 
                        key={hour}
                        ref={drop}
                        className={`h-[60px] w-full ${isOver ? 'bg-blue-100' : ''}`}
                        onClick={() => handleCellClick(day, hour)}
                      />
                    );
                  })}
                  
                  {/* Render events for this day */}
                  {events
                    .filter(event => {
                      const eventDate = parseISO(event.date);
                      return isSameDay(eventDate, day);
                    })
                    .map(event => renderEvent(event, dayIndex, columnWidth))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
