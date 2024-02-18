import React from 'react';
import { Box } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css';

const Calendar: React.FC = () => {
  return (
    <div className="calendar-container">
      <div className="calendar-box">
        <Box p="5" borderRadius="lg">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            height="70vh"
            events={[
              { title: 'Event 1', date: '2024-02-18' },
              { title: 'Event 2', date: '2024-02-18' },
            ]}
          />
        </Box>
      </div>
    </div>
  );
};

export default Calendar;
