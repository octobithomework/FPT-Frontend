// Calendar.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css'; 
import { Routine } from '../../../../Interfaces/Routine';

interface ComponentProps {
  completedRoutines: Routine[];
  setCurrentMonthYear: (month: number, year: number) => void; // New prop to update parent state
}

const Calendar: React.FC<ComponentProps> = ({ completedRoutines, setCurrentMonthYear }) => {
  const [events, setEvents] = useState<{ title: string; date: string; }[]>([]);

  useEffect(() => {
    const routineGroups: { [key: string]: Routine[] } = completedRoutines.reduce((acc, routine) => {
      const { name, date } = routine;
      if (!acc[date]) acc[date] = [];
      acc[date].push(routine);
      return acc;
    }, {} as { [key: string]: Routine[] });

    const newEvents: { title: string; date: string; }[] = Object.entries(routineGroups).flatMap(([date, routines]) => {
      return routines.length > 2
        ? [...routines.slice(0, 2).map(routine => ({ title: routine.name, date })), { title: '...', date }]
        : routines.map(routine => ({ title: routine.name, date }));
    });

    setEvents(newEvents);
  }, [completedRoutines]);

  const handleDatesSet = useCallback((info: any) => {
    const currentMonth = info.end.getMonth();
    const currentYear = info.end.getFullYear();
    setCurrentMonthYear(currentMonth, currentYear);
  }, [setCurrentMonthYear]);

  const renderEventContent = (eventInfo: any) => {
    return eventInfo.event.title === '...'
      ? (<div style={{ textAlign: 'center', width: '100%' }}>{eventInfo.event.title}</div>)
      : (<div style={{ 
          textAlign: 'center', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          maxWidth: '100%', 
          paddingLeft: '5px', 
        }}>{eventInfo.event.title}
      </div>);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-box">
        <Box p="5" borderRadius="lg">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            eventOrder={"date"}
            height="calc(100vh - 185px)"
            events={events}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
          />
        </Box>
      </div>
    </div>
  );
};

export default Calendar;
