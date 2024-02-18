import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css';
import { Routine } from '../../../Interfaces/Routine';

interface ComponentProps {
  completedRoutines: Routine[];
}

const Calendar: React.FC<ComponentProps> = ({ completedRoutines }) => {
  // State for storing calendar events
  const [events, setEvents] = useState<{ title: string; date: string; }[]>([]);

  useEffect(() => {
    const routineGroups: { [key: string]: Routine[] } = completedRoutines.reduce((acc, routine) => {
      const { name, date } = routine;
      if (!acc[date]) acc[date] = [];
      acc[date].push(routine);
      return acc;
    }, {} as { [key: string]: Routine[] });

    const newEvents: { title: string; date: string; }[] = Object.entries(routineGroups).flatMap(([date, routines]) => {
      if (routines.length > 2) {
        // If there are more than 2 routines for a date, show the first two and an ellipsis
        return [
          ...routines.slice(0, 2).map(routine => ({ title: routine.name, date })),
          { title: '...', date }
        ];
      } else {
        // If there are 2 or fewer routines, show them normally
        return routines.map(routine => ({ title: routine.name, date }));
      }
    });

    setEvents(newEvents);
  }, [completedRoutines]);

  const renderEventContent = (eventInfo: any) => {
    // Center text for events with the title '...'
    if (eventInfo.event.title === '...') {
      return (
        <div style={{ textAlign: 'center', width: '100%' }}>
          {eventInfo.event.title}
        </div>
      );
    } else {
      // Default rendering for other events
      return (
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          paddingLeft: '5px',
        }}>
          {eventInfo.event.title}
        </div>
      );
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-box">
        <Box p="5" borderRadius="lg">
          <FullCalendar
            key={events.length}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            eventOrder={"date"}
            height="calc(100vh - 185px)"
            events={events} 
            eventContent={renderEventContent}
          />
        </Box>
      </div>
    </div>
  );
};

export default Calendar;
