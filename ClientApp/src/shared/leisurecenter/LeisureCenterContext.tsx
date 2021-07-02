import { createContext } from 'react';
import { Class } from '../../models/class';
import { User } from '../../models/user';

export type LeisureCenterContextValue = {
  getUser: () => User | undefined;
  getClasses: () => Array<Class>;
  getSchedule: () => Array<Class>;
  updateClass: (uuid: string) => void;
  addToClass: (uuid: string) => void;
  removeFromClass: (uuid: string) => void;
  addToQueue: (uuid: string) => void;
  removeFromQueue: (uuid: string) => void;
  refreshData: () => void;
};

const throwError = () => {
  throw new Error('Leisure Center Context has not been initialised yet!');
};

export const LeisureCenterContext = createContext<LeisureCenterContextValue>({
  getUser: throwError,
  getClasses: throwError,
  getSchedule: throwError,
  updateClass: throwError,
  addToClass: throwError,
  removeFromClass: throwError,
  addToQueue: throwError,
  removeFromQueue: throwError,
  refreshData: throwError,
});
