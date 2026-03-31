import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  userName: string;
  isFirstLaunch: boolean;
  setUserName: (name: string) => Promise<void>;
  completeFirstLaunch: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_NAME_KEY = '@magen_avatar_user_name';
const FIRST_LAUNCH_KEY = '@magen_avatar_first_launch';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState<string>('ميجن غيلان');
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedName = await AsyncStorage.getItem(USER_NAME_KEY);
      const firstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);

      if (savedName) {
        setUserNameState(savedName);
      }
      if (firstLaunch === 'false') {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const setUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem(USER_NAME_KEY, name);
      setUserNameState(name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  const completeFirstLaunch = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving first launch state:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        isFirstLaunch,
        setUserName,
        completeFirstLaunch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
