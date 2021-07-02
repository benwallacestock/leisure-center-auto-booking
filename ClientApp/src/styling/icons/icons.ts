import ChevronUpOutline from './chevron-up-outline.svg';
import HourglassOutlineSvg from './hourglass-outline.svg';
import InformationCircleOutlineSvg from './information-circle-outline.svg';
import LocationOutlineSvg from './location-outline.svg';
import PeopleOutlineSvg from './people-outline.svg';
import TimeOutlineSvg from './time-outline.svg';
import styled from 'styled-components';

// https://ionic.io/ionicons

export const ChevronUpIcon = styled(ChevronUpOutline)``;

export const ChevronDownIcon = styled(ChevronUpOutline)`
  transform: rotate(180deg);
`;
export const ChevronLeftIcon = styled(ChevronUpOutline)`
  transform: rotate(-90deg);
`;
export const ChevronRightIcon = styled(ChevronUpOutline)`
  transform: rotate(90deg);
`;

export const HourglassIcon = styled(HourglassOutlineSvg)``;

export const InformationIcon = styled(InformationCircleOutlineSvg)``;

export const LocationIcon = styled(LocationOutlineSvg)``;

export const PeopleIcon = styled(PeopleOutlineSvg)``;

export const ClockIcon = styled(TimeOutlineSvg)``;
