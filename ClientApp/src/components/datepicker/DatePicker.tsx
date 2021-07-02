import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format, addDays, isSameDay } from 'date-fns';
import { spacing2, spacing3, spacing4 } from '../../styling/spacing';
import { cool_grey_100, light_blue_vivid_600 } from '../../styling/colours';
import { ChevronRightIcon } from '../../styling/icons/icons';

export type DatePickerProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const DatePicker = ({
  selectedDate,
  setSelectedDate,
}: DatePickerProps) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  const today = new Date();
  const startWeekDate = addDays(today, selectedWeek * 7);
  const endWeekDate = addDays(today, selectedWeek * 7 + 6);

  return (
    <DatePickerContainer>
      <WeekContainer>
        <ChevronLeft
          onClick={() => selectedWeek != 0 && setSelectedWeek(selectedWeek - 1)}
          enabled={selectedWeek != 0}
        />
        <CurrentWeekText>
          <h3>
            {format(startWeekDate, 'iii do')} - {format(endWeekDate, 'iii do')}
          </h3>
        </CurrentWeekText>
        <ChevronRight
          onClick={() => selectedWeek != 2 && setSelectedWeek(selectedWeek + 1)}
          enabled={selectedWeek != 2}
        />
      </WeekContainer>
      <DaysContainer>
        {[...Array(7).keys()].map((day) => {
          const date = addDays(today, day + selectedWeek * 7);
          return (
            <div key={date.getUTCDay()}>
              <DayContainer
                selected={isSameDay(date, selectedDate)}
                onClick={() => setSelectedDate(date)}
              >
                <h5>{format(date, 'iii')}</h5>
                <h4>{format(date, 'do')}</h4>
              </DayContainer>
            </div>
          );
        })}
      </DaysContainer>
    </DatePickerContainer>
  );
};

const DatePickerContainer = styled.div`
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: auto 300px auto;
`;

const ChevronRight = styled(ChevronRightIcon)<{ enabled: boolean }>`
  width: 30px;
  cursor: ${(props) => (props.enabled ? 'pointer' : 'not-allowed')};

  &:hover {
    color: ${(props) => (props.enabled ? light_blue_vivid_600 : '')};
  }
`;

const ChevronLeft = styled(ChevronRight)`
  transform: rotate(-90deg);
  margin-left: auto;
`;

const CurrentWeekText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  h3 {
    margin: 0;
  }
`;

const DaysContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: ${spacing4};
  overflow: scroll;
  width: min-content;
  max-width: 100%;

  h5 {
    margin-bottom: ${spacing2};
  }

  h4,
  h5 {
    margin: 0;
  }
`;

const DayContainer = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 ${spacing2} ${spacing2} ${spacing2};

  background-color: white;
  border-radius: 5px;
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  border: ${(props) => (props.selected ? light_blue_vivid_600 : cool_grey_100)}
    solid ${(props) => (props.selected ? '5px' : '2px')};
  padding: 10px;

  :hover {
    border: ${light_blue_vivid_600} solid
      ${(props) => (props.selected ? '5px' : '2px')};
  }
`;
