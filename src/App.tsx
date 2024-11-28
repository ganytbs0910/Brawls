import React from 'react';
import { SafeAreaView } from 'react-native';
import BrawlStarsCompatibility from './components/BrawlStarsCompatibility';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BrawlStarsCompatibility />
    </SafeAreaView>
  );
};

export default App;