import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  cool_grey_100,
  cool_grey_300,
  light_blue_vivid_050,
  light_blue_vivid_600,
  light_blue_vivid_800,
  pink_vivid_050,
  pink_vivid_600,
  pink_vivid_800,
  red_vivid_050,
  red_vivid_600,
  red_vivid_800,
  teal_600,
  yellow_vivid_500,
} from '../../styling/colours';
import { spacing1, spacing2, spacing3, spacing4 } from '../../styling/spacing';
import { Class } from '../../models/class';
import { format, intervalToDuration, compareAsc } from 'date-fns';
import { SmallLoadingSpinner } from '../../shared/LoadingSpinner';
import { LeisureCenterContext } from '../../shared/leisurecenter/LeisureCenterContext';
import {
  apiRequest,
  createRequestInit,
  isApiRequestError,
} from '../../utils/api';
import {
  ChevronUpIcon,
  ClockIcon,
  HourglassIcon,
  InformationIcon,
  LocationIcon,
  PeopleIcon,
} from '../../styling/icons/icons';

type ClassCardProps = {
  c: Class;
};

export const ClassCard = ({ c }: ClassCardProps) => {
  const [open, setOpen] = useState<boolean>(
    c.attendeeDetails?.booked || c.attendeeDetails?.queued || false
  );
  const leisureCenterContext = useContext(LeisureCenterContext);

  useEffect(() => {
    if (open && !c.details?.description) {
      leisureCenterContext.updateClass(c.brief.id);
    }
  }, [open]);

  const startTime = format(c.brief.startDateTime, 'HH:mm');
  const duration = `${
    intervalToDuration({
      start: c.brief.startDateTime,
      end: c.brief.endDateTime,
    }).minutes
  } mins`;
  const now = new Date();

  return (
    <ClassCardContainer>
      <ClassCardHeaderSection>
        <StyledClockIcon />
        <HeaderSectionText>{startTime}</HeaderSectionText>
        <StyledHourglassIcon />
        <HeaderSectionText>{duration}</HeaderSectionText>
        <StyledPeopleIcon />
        <HeaderSectionText>
          {c.brief.maxCapacity - c.brief.totalBooked} remaining
        </HeaderSectionText>
        <ClassAvailabilityContainer>
          <ClassAvailabilityBar
            percentage={1 - c.brief.totalBooked / c.brief.maxCapacity}
          />
        </ClassAvailabilityContainer>
      </ClassCardHeaderSection>
      <ClassCardBodySection onClick={() => setOpen(!open)}>
        <ClassTitle>{c.brief.name}</ClassTitle>
        {open ? <CardOpenIcon /> : <CardClosedIcon />}
      </ClassCardBodySection>
      <ClassCardExtraInfoSection open={open}>
        {c.details?.description ? (
          <>
            <ExtraInfoRow>
              <StyledLocationIcon />
              <LocationText>{c.details?.room.description}</LocationText>
            </ExtraInfoRow>
            <ExtraInfoRow>
              <DescriptionIcon />
              <DescriptionText>{c.details?.description}</DescriptionText>
            </ExtraInfoRow>

            <ButtonContainer>
              {compareAsc(c.details.bookingWindowStart, new Date()) < 0 &&
              !c.attendeeDetails?.queued ? (
                c.attendeeDetails?.availableActions.map((action) => {
                  switch (action) {
                    case 'ADD_TO_CLASS':
                      return (
                        <BookButton
                          onClick={() =>
                            leisureCenterContext.addToClass(c.brief.id)
                          }
                        >
                          Book
                        </BookButton>
                      );
                    case 'REMOVE_FROM_CLASS':
                      return (
                        <CancelButton
                          onClick={() =>
                            leisureCenterContext.removeFromClass(c.brief.id)
                          }
                        >
                          Cancel
                        </CancelButton>
                      );
                    case 'ADD_TO_WAITLIST':
                      return (
                        <QueueButton
                          onClick={() =>
                            leisureCenterContext.addToQueue(c.brief.id)
                          }
                        >
                          Queue
                        </QueueButton>
                      );
                  }
                })
              ) : c.attendeeDetails?.queued ? (
                <CancelButton
                  onClick={() =>
                    leisureCenterContext.removeFromQueue(c.brief.id)
                  }
                >
                  Cancel
                </CancelButton>
              ) : (
                <QueueButton
                  onClick={() => leisureCenterContext.addToQueue(c.brief.id)}
                >
                  Queue
                </QueueButton>
              )}
            </ButtonContainer>
          </>
        ) : (
          <SmallLoadingSpinner />
        )}
      </ClassCardExtraInfoSection>
    </ClassCardContainer>
  );
};

const ClassCardHeaderSection = styled.div`
  border-bottom: ${cool_grey_100} solid 2px;
  padding: ${spacing2};
  display: flex;
  align-items: center;
`;

const StyledClockIcon = styled(ClockIcon)`
  width: 18px;
  height: 18px;
  margin-right: ${spacing2};
`;

const StyledHourglassIcon = styled(HourglassIcon)`
  width: 18px;
  height: 18px;
  margin-right: ${spacing2};
`;

const StyledPeopleIcon = styled(PeopleIcon)`
  width: 20px;
  height: 20px;
  margin-right: ${spacing2};
  margin-left: auto;
`;

const HeaderSectionText = styled.div`
  margin: 2px ${spacing4} 0 0;
  vertical-align: middle;
`;

const ClassCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border: ${cool_grey_100}  solid 2px;
  margin-bottom: ${spacing4};
  border-radius: 10px;
  
  ${ClassCardHeaderSection} {
    border-bottom: ${cool_grey_100} solid 2px;
  }
}
`;

const ClassTitle = styled.h4`
  margin: 0;
`;

const ButtonContainer = styled.div`
  margin: 0 ${spacing4} ${spacing1} ${spacing4};
`;

const BookButton = styled.button`
  background-color: ${light_blue_vivid_600};
  padding: ${spacing2} ${spacing3};
  color: ${light_blue_vivid_050};
  font-weight: bold;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border: ${light_blue_vivid_600} solid 2px;
  width: 100%;

  :hover {
    background-color: ${light_blue_vivid_800};
  }
`;

const CancelButton = styled(BookButton)`
  background-color: ${red_vivid_600};
  color: ${red_vivid_050};
  border-color: ${red_vivid_600};

  :hover {
    background-color: ${red_vivid_800};
  }
`;

const QueueButton = styled(BookButton)`
  background-color: ${pink_vivid_600};
  color: ${pink_vivid_050};
  border-color: ${pink_vivid_600};

  :hover {
    background-color: ${pink_vivid_800};
  }
`;

const CardOpenIcon = styled(ChevronUpIcon)`
  width: 30px;
  margin-left: auto;
  color: ${cool_grey_300};
  cursor: pointer;
`;

const CardClosedIcon = styled(CardOpenIcon)`
  transform: rotate(180deg);
`;

const ClassCardBodySection = styled.div`
  padding: ${spacing2};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    ${CardOpenIcon}, ${CardClosedIcon} {
      color: ${light_blue_vivid_600};
    }
  }
`;

const ClassCardExtraInfoSection = styled.div<{ open: boolean }>`
  max-height: ${(props) => (props.open ? '100%' : '0')};
  overflow: hidden;
  padding: ${(props) => (props.open ? spacing2 : 0)};
  display: flex;
  flex-direction: column;
`;

const ExtraInfoRow = styled.div`
  display: flex;
  margin-bottom: ${spacing3};
`;

const StyledLocationIcon = styled(LocationIcon)`
  width: 20px;
  height: 20px;
  color: ${cool_grey_300};
  margin-right: ${spacing2};
`;

const LocationText = styled.h5`
  font-weight: normal;
  color: ${cool_grey_300};
  margin: 0;
`;

const DescriptionIcon = styled(InformationIcon)`
  width: 20px;
  height: 20px;
  color: ${cool_grey_300};
  margin-right: ${spacing2};
`;

const DescriptionText = styled.h5`
  font-weight: normal;
  color: ${cool_grey_300};
  margin: 0;
  flex: 1;
`;

const ClassAvailabilityContainer = styled.div`
  flex: 1;
  height: 10px;
  border-radius: 10px;
  background-color: ${cool_grey_100};
  display: flex;
  justify-content: flex-end;
  max-width: 100px;
  min-width: 50px;
`;

const ClassAvailabilityBar = styled.div<{ percentage: number }>`
  width: ${(props) => `${props.percentage * 100}%`};
  height: 10px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.percentage > 0.66
      ? teal_600
      : props.percentage < 0.33
      ? red_vivid_600
      : yellow_vivid_500};
`;
