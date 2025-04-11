
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeEventModal } from '@/redux/calendarSlice';
import { createEvent, updateEvent, deleteEvent } from '@/redux/thunks';
import { CalendarIcon, Clock, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const EventModal = () => {
  const dispatch = useAppDispatch();
  const { isEventModalOpen, editingEvent } = useAppSelector(state => state.calendar);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('work');
  const [date, setDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setCategory(editingEvent.category);
      
      if (editingEvent.date) {
        setDate(parseISO(editingEvent.date));
      }
      
      if (editingEvent.startTime) {
        const start = parseISO(editingEvent.startTime);
        setStartTime(format(start, 'HH:mm'));
      }
      
      if (editingEvent.endTime) {
        const end = parseISO(editingEvent.endTime);
        setEndTime(format(end, 'HH:mm'));
      }
    } else {
      resetForm();
    }
  }, [editingEvent]);
  
  const resetForm = () => {
    setTitle('');
    setCategory('work');
    setDate(new Date());
    setStartTime('09:00');
    setEndTime('10:00');
  };
  
  const handleClose = () => {
    dispatch(closeEventModal());
    resetForm();
  };
  
  const handleSubmit = () => {
    if (!date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const startDateTime = new Date(`${dateStr}T${startTime}`);
    const endDateTime = new Date(`${dateStr}T${endTime}`);
    
    const eventData = {
      title,
      category: category as 'exercise' | 'eating' | 'work' | 'relax' | 'family' | 'social',
      date: dateStr,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };
    
    if (editingEvent?.id) {
      dispatch(updateEvent({ ...eventData, id: editingEvent.id }));
    } else {
      dispatch(createEvent(eventData));
    }
  };
  
  const handleDelete = () => {
    if (editingEvent?.id) {
      dispatch(deleteEvent(editingEvent.id));
    }
  };
  
  return (
    <Dialog open={isEventModalOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingEvent?.id ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Event title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="eating">Eating</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="relax">Relax</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="startTime" 
                  type="time"
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="endTime" 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="justify-between">
          <div>
            {editingEvent?.id && (
              <Button 
                variant="destructive" 
                type="button" 
                onClick={handleDelete}
                className="flex items-center"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {editingEvent?.id ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
