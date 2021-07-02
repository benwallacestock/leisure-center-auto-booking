import React, { useEffect, useState } from 'react';
import { Class } from '../../models/class';
import { LeisureCenterContext } from './LeisureCenterContext';
import {
  apiRequest,
  createRequestInit,
  isApiRequestError,
} from '../../utils/api';
import { LoadingSpinner } from '../LoadingSpinner';
import { User } from '../../models/user';

type Props = {
  children: React.ReactNode;
};

export const LeisureCenterProvider = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [classes, setClasses] = useState<Array<Class>>();
  const [schedule, setSchedule] = useState<Array<Class>>();

  useEffect(() => {
    refreshData();
  }, []);

  const getUser = () => {
    if (user) {
      return user;
    } else {
      return undefined;
    }
  };

  const getClasses = () => {
    if (classes) {
      return classes;
    } else {
      return new Array<Class>();
    }
  };

  const getSchedule = () => {
    if (schedule) {
      return schedule;
    } else {
      return new Array<Class>();
    }
  };

  const updateClassState = (newClass: Class) => {
    setClasses((x) => {
      return x?.map((c) => {
        if (newClass.brief.id === c.brief.id) {
          return newClass;
        }
        return c;
      });
    });
  };

  const updateClass = (uuid: string) => {
    apiRequest<Class>(`/api/class/${uuid}`, createRequestInit('GET')).then(
      (res) => {
        if (!isApiRequestError(res)) {
          updateClassState(res);
        }
      }
    );
  };

  const addToClass = (uuid: string) => {
    apiRequest<Class>(`/api/class/${uuid}/add`, createRequestInit('GET')).then(
      (res) => {
        if (!isApiRequestError(res)) {
          updateClassState(res);
        }
      }
    );
  };

  const removeFromClass = (uuid: string) => {
    apiRequest<Class>(
      `/api/class/${uuid}/remove`,
      createRequestInit('GET')
    ).then((res) => {
      if (!isApiRequestError(res)) {
        updateClassState(res);
      }
    });
  };

  const addToQueue = (uuid: string) => {
    apiRequest<Class>(
      `/api/class/${uuid}/queue/add`,
      createRequestInit('GET')
    ).then((res) => {
      if (!isApiRequestError(res)) {
        updateClassState(res);
      }
    });
  };

  const removeFromQueue = (uuid: string) => {
    apiRequest<Class>(
      `/api/class/${uuid}/queue/remove`,
      createRequestInit('GET')
    ).then((res) => {
      if (!isApiRequestError(res)) {
        updateClassState(res);
      }
    });
  };

  const refreshData = () => {
    Promise.all([
      apiRequest<User>('api/user', createRequestInit('GET')),
      apiRequest<Array<Class>>('api/class', createRequestInit('GET')),
      apiRequest<Array<Class>>('api/user/schedule', createRequestInit('GET')),
    ]).then(([userRes, classesRes, scheduleRes]) => {
      if (
        !isApiRequestError(userRes) &&
        !isApiRequestError(classesRes) &&
        !isApiRequestError(scheduleRes)
      ) {
        setUser(userRes);
        setClasses(
          classesRes
            .sort((a, b) => {
              if (a.brief.startDateTime == b.brief.startDateTime) {
                return a.brief.name.localeCompare(b.brief.name);
              } else if (a.brief.startDateTime < b.brief.startDateTime) {
                return -1;
              } else {
                return 1;
              }
            })
            .map((c) => {
              for (const s of scheduleRes) {
                if (s.brief.id === c.brief.id) {
                  return s;
                }
              }
              return c;
            })
        );
        setSchedule(scheduleRes);
        setIsLoading(false);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <LeisureCenterContext.Provider
      value={{
        getUser,
        getClasses,
        getSchedule,
        updateClass,
        addToClass,
        removeFromClass,
        addToQueue,
        removeFromQueue,
        refreshData,
      }}
    >
      {props.children}
    </LeisureCenterContext.Provider>
  );
};
