import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import {
  heading1FontSize,
  heading2FontSize,
  heading3FontSize,
  heading4FontSize,
  heading5FontSize,
  paragraphText,
} from './fonts';
import { cool_grey_050, cool_grey_900 } from './colours';
import MetropolisRegular from './fonts/Metropolis-Regular.woff2';

export const GlobalStyle = createGlobalStyle`
  @font-face {  
    font-family: 'Metropolis Regular';
    src: local('Metropolis Regular'), local('MetropolisRegular'), url(${MetropolisRegular}) format('woff2');
    font-weight: 300;
    font-style: normal;  
  }
  
  body {
    font-family: Metropolis Regular, sans-serif;
    background-color: ${cool_grey_050};
    color: ${cool_grey_900};
    display: flex;
    justify-content: center;
    font-size: ${paragraphText};
    
    #app {
      width: 100%;
      max-width: 800px;
    }
    
    input {
      font-size: ${paragraphText};
    }      
    
    label {
      font-size: ${paragraphText};
    }
    
    button {
      font-size: ${paragraphText};
    }
    
    h1{
      font-size: ${heading1FontSize};
    }    
    h2{
      font-size: ${heading2FontSize};
    }    
    h3{
      font-size: ${heading3FontSize};
    }    
    h4{
      font-size: ${heading4FontSize};
    }    
    h5{
      font-size: ${heading5FontSize};
    }
  }
`;
