import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { HomeScreen } from './screens/HomeScreen';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
      />
      <HomeScreen />
    </>
  );
};

export default App;