
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useAppDispatch } from '@/redux/hooks';
import { openEventModal } from '@/redux/calendarSlice';
import { Event } from '@/redux/types';
import { format, parseISO, differenceInMinutes } from 'date-fns';

interface CalendarEventProps {
  event: Event;
  columnWidth: number;
  style?: React.CSSProperties; // Add style prop to interface
}

const CalendarEvent = ({ event, columnWidth, style }: CalendarEventProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  
  const start = parseISO(event.startTime);
  const end = parseISO(event.endTime);
  const durationInMinutes = differenceInMinutes(end, start);
  const heightPerMinute = 1.5; // 1.5px per minute
  const height = durationInMinutes * heightPerMinute;
  
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      exercise: '#FF5733',
      eating: '#33FF57',
      work: '#3357FF',
      relax: '#57FF33',
      family: '#FF33F5',
      social: '#33FFF5'
    };
    
    return colorMap[category] || '#CCCCCC';
  };
  
  const [{ isDragging }, drag] = useDrag({
    type: 'EVENT',
    item: { ...event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Calculate opacity based on dragging state
  const opacity = isDragging ? 0.5 : 1;
  
  const handleEventClick = () => {
    dispatch(openEventModal(event));
  };
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div
      ref={drag}
      className="absolute rounded-md p-1 overflow-hidden cursor-move border"
      style={{
        backgroundColor: `${getCategoryColor(event.category)}20`, // Light version of the color
        borderColor: getCategoryColor(event.category),
        borderLeftWidth: '3px',
        height: `${height}px`,
        width: `${columnWidth - 8}px`,
        opacity,
        ...style, // Apply the optional style prop
      }}
      onClick={handleEventClick}
    >
      <div className="flex justify-between items-start">
        <div className="font-medium text-sm truncate">{event.title}</div>
        <button 
          onClick={toggleExpand} 
          className="text-xs bg-transparent border-none p-0 cursor-pointer"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      <div className="text-xs text-gray-600">
        {format(parseISO(event.startTime), 'h:mm a')}
      </div>
      
      {isExpanded && (
        <div className="mt-1 text-xs">
          <div>Category: {event.category}</div>
          <div>End: {format(parseISO(event.endTime), 'h:mm a')}</div>
        </div>
      )}
    </div>
  );
};

export default CalendarEvent;
