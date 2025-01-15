import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BrawlStarsCompatibility from './components/BrawlStarsApp';
import TeamBoard from './components/TeamBoard';
import BrawlStarsRankings from './components/BrawlStarsRankings';
import CharacterDetails from './components/CharacterDetails';
import PickPrediction from './components/PickPrediction';
import Home from './components/Home';
import News from './components/News';
import { BannerAdComponent } from './components/BannerAdComponent';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 6;

export type RootStackParamList = {
  Main: undefined;
  Rankings: undefined;
  CharacterDetails: { characterName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const RankingsStack = ({ isAdFree }: { isAdFree: boolean }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Rankings" 
        component={(props) => <BrawlStarsRankings {...props} isAdFree={isAdFree} />} 
      />
      <Stack.Screen 
        name="CharacterDetails" 
        component={CharacterDetails}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#21A0DB',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = ({ isAdFree }: { isAdFree: boolean }) => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Main" 
          component={(props) => <Home {...props} isAdFree={isAdFree} />}
        />
        <Stack.Screen 
          name="CharacterDetails" 
          component={CharacterDetails}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#21A0DB',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'single' | 'team' | 'rankings' | 'prediction' | 'news'>('home');
  const [isAdFree, setIsAdFree] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  
  const animatedValues = useRef({
    home: new Animated.Value(1),
    single: new Animated.Value(0),
    team: new Animated.Value(0),
    rankings: new Animated.Value(0),
    prediction: new Animated.Value(0),
    news: new Animated.Value(0),
  }).current;

  useEffect(() => {
    const checkAdFreeStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('adFreeStatus');
        setIsAdFree(status === 'true');
      } catch (error) {
        console.error('Failed to check ad-free status:', error);
      }
    };

    checkAdFreeStatus();
  }, []);

  const tabs = [
    {
      key: 'home',
      label: 'ホーム',
      icon: require('../assets/AppIcon/home.png'),
    },
    {
      key: 'single',
      label: 'プレイヤー分析',
      icon: require('../assets/AppIcon/compatibility.png'),
    },
    {
      key: 'team',
      label: 'チーム募集',
      icon: require('../assets/AppIcon/analysis.png'),
    },
    {
      key: 'prediction',
      label: 'ピック想定',
      icon: require('../assets/AppIcon/prediction.png'),
    },
    {
      key: 'rankings',
      label: 'ランキング',
      icon: require('../assets/AppIcon/ranking.png'),
    },
    {
      key: 'news',
      label: 'ニュース',
      icon: require('../assets/AppIcon/loudspeaker_icon.png'),
    },
  ];

  const handleTabPress = (tabKey: typeof activeTab, index: number) => {
    const animations = Object.keys(animatedValues).map((key) =>
      Animated.timing(animatedValues[key], {
        toValue: key === tabKey ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    );

    Animated.parallel([
      ...animations,
      Animated.spring(slideAnimation, {
        toValue: index * TAB_WIDTH,
        tension: 68,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(tabKey);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeStack isAdFree={isAdFree} />;
      case 'single':
        return <BrawlStarsCompatibility isAdFree={isAdFree} />;
      case 'team':
        return <TeamBoard isAdFree={isAdFree} />;
      case 'prediction':
        return <PickPrediction isAdFree={isAdFree} />;
      case 'rankings':
        return (
          <NavigationContainer independent>
            <RankingsStack isAdFree={isAdFree} />
          </NavigationContainer>
        );
      case 'news':
        return <News isAdFree={isAdFree} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>

      {!isAdFree && <BannerAdComponent />}
      <View style={styles.tabBar}>
        <Animated.View 
          style={[
            styles.activeIndicator,
            {
              transform: [{ translateX: slideAnimation }],
            },
          ]} 
        />
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabPress(tab.key as typeof activeTab, index)}
          >
            <Animated.View
              style={[
                styles.tabContent,
                {
                  transform: [
                    {
                      scale: animatedValues[tab.key].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                  opacity: animatedValues[tab.key].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ]}
            >
              <Image
                source={tab.icon}
                style={[
                  styles.tabIcon,
                  activeTab === tab.key && styles.activeTabIcon,
                ]}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 0,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: TAB_WIDTH,
    height: 2,
    backgroundColor: '#65BBE9',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#666',
  },
  activeTabIcon: {
    tintColor: '#65BBE9',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#65BBE9',
    fontWeight: 'bold',
  },
});

export default App;