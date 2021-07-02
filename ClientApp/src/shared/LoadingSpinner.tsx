import Spinner from '../styling/icons/spinner.svg';
import styled from 'styled-components';
import { cool_grey_300 } from '../styling/colours';

export const LoadingSpinner = styled(Spinner)`
  height: 150px;
  width: 150px;
  color: ${cool_grey_300};
`;

export const SmallLoadingSpinner = styled(LoadingSpinner)`
  height: 50px;
  width: 50px;
`;
