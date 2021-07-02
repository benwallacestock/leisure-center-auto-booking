import React, { useContext } from 'react';
import { LeisureCenterContext } from '../../shared/leisurecenter/LeisureCenterContext';
import { format } from 'date-fns';
import styled from 'styled-components';
import {
  cool_grey_100,
  cool_grey_200,
  cool_grey_400,
  cool_grey_800,
} from '../../styling/colours';

export const ClassTimeline = () => {
  const leisureCenterContext = useContext(LeisureCenterContext);

  const schedule = leisureCenterContext
    .getSchedule()
    .sort((a, b) => a.brief.startDateTime - b.brief.startDateTime);

  return (
    <TimelineContainer>
      {schedule.map((s, key) => {
        const startDateTime = new Date(s.brief.startDateTime);
        return (
          <>
            <DateTimeText>
              <DateText>{format(startDateTime, 'iii eo')}</DateText>
              <TimeText>{format(startDateTime, 'p')}</TimeText>
            </DateTimeText>

            <LineContainer>
              <Circle />
              <Line />
            </LineContainer>
            <Content>
              <h4>{s.brief.name}</h4>
              <h5>{s.details?.room.description}</h5>
            </Content>
          </>
        );
      })}
    </TimelineContainer>
  );
};

const TimelineContainer = styled.div`
  display: grid;
  grid-template-columns: [date-time]200px [circle]100px auto;
`;

const DateTimeText = styled.div`
  grid-column-start: date-time;
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  width: 100%;
`;

const DateText = styled.div`
  margin-right: 10px;
`;
const TimeText = styled.div`
  margin-right: 10px;
`;

const LineContainer = styled.div`
  grid-column-start: circle;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Circle = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  background-color: ${cool_grey_200};
`;

const Line = styled.div`
  background-color: ${cool_grey_100};
  flex: 1;
  width: 5px;
  margin: 15px 0;
  border-radius: 10px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  background-color: white;
  border: ${cool_grey_100} solid 2px;
  padding: 10px;
  margin-bottom: 30px;
  border-radius: 10px;
`;
