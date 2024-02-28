// Calendar.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css';
import { RoutineLogItem } from '../../../../Interfaces/RoutineLogItem';

interface CalendarProps {
  completedRoutines: RoutineLogItem[];
  setCurrentMonthYear: (month: number, year: number) => void;
  onDateOrEventClick: (date: string, id: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ completedRoutines, setCurrentMonthYear, onDateOrEventClick }) => {
  const [events, setEvents] = useState<{ title: string; date: string; id: string }[]>([]);

  useEffect(() => {
    const routineGroups: { [key: string]: RoutineLogItem[] } = completedRoutines.reduce((acc, routine) => {
      const { name, date } = routine;
      if (!acc[date]) acc[date] = [];
      acc[date].push(routine);
      return acc;
    }, {} as { [key: string]: RoutineLogItem[] });

    const newEvents: { title: string; date: string; id: string }[] = Object.entries(routineGroups).flatMap(([date, routines]) => {
      return routines.length > 2
        ? [...routines.slice(0, 2).map(routine => ({ title: routine.name, date, id: routine.routineLogId.toString() })), { title: '...', date, id: "" }]
        : routines.map(routine => ({ title: routine.name, date, id: routine.routineLogId }));
    });

    setEvents(newEvents);
  }, [completedRoutines]);

  const handleDatesSet = useCallback((info: any) => {
    // For some reason December is 0, so we need to set it to 12
    const currentMonth = info.end.getMonth() == 0 ? 12 : info.end.getMonth();
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
            events={events.map(event => ({ ...event, id: event.id.toString() }))}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
            dateClick={(clickInfo) => onDateOrEventClick(clickInfo.dateStr, "")}
            eventClick={(clickInfo) => onDateOrEventClick(clickInfo.event.startStr, clickInfo.event.id)}
          />
        </Box>
      </div>
    </div>
  );
};

export default Calendar;
