import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { LeisureCenterContext } from '../shared/leisurecenter/LeisureCenterContext';
import { cool_grey_050, cool_grey_100 } from '../styling/colours';
import { DatePicker } from './datepicker/DatePicker';
import { compareAsc, isSameDay } from 'date-fns';
import { spacing4, spacing6 } from '../styling/spacing';
import { ClassCard } from './classcard/ClassCard';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const leisureCenterContext = useContext(LeisureCenterContext);

  const classes = leisureCenterContext.getClasses();

  return (
    <HomeContainer>
      <ClassHeaderContainer>
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </ClassHeaderContainer>
      <ClassCardsContainer>
        <ClassCardsHeader>Booked</ClassCardsHeader>
        {classes
          .filter(
            (c) =>
              isSameDay(selectedDate, c.brief.startDateTime) &&
              compareAsc(c.brief.endDateTime, new Date()) > 0 &&
              c.attendeeDetails?.booked
          )
          .map((c) => (
            <ClassCard c={c} key={c.brief.id} />
          ))}
      </ClassCardsContainer>
      <ClassCardsContainer>
        <ClassCardsHeader>Queued</ClassCardsHeader>
        {classes
          .filter(
            (c) =>
              isSameDay(selectedDate, c.brief.startDateTime) &&
              compareAsc(c.brief.endDateTime, new Date()) > 0 &&
              c.attendeeDetails?.queued
          )
          .map((c) => (
            <ClassCard c={c} key={c.brief.id} />
          ))}
      </ClassCardsContainer>
      <ClassCardsContainer>
        <ClassCardsHeader>Not Booked</ClassCardsHeader>
        {classes
          .filter(
            (c) =>
              isSameDay(selectedDate, c.brief.startDateTime) &&
              compareAsc(c.brief.endDateTime, new Date()) > 0 &&
              c.attendeeDetails?.queued != true &&
              c.attendeeDetails?.booked != true
          )
          .map((c) => (
            <ClassCard c={c} key={c.brief.id} />
          ))}
      </ClassCardsContainer>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClassCardsContainer = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  border-bottom: ${cool_grey_100} solid 2px; ;
`;

const ClassCardsHeader = styled.h2`
  margin: ${spacing4} 0;
`;

const ClassHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: ${cool_grey_050};
  padding: ${spacing6} 0;
  z-index: 10;
`;
