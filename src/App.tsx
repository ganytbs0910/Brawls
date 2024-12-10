import React, { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BrawlStarsCompatibility from './components/BrawlStarsCompatibility';
import TeamCompatibility from './components/TeamCompatibility';
import BrawlStarsRankings from './components/BrawlStarsRankings';
import CharacterDetails from './components/CharacterDetails';
import Home from './components/Home';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

export type RootStackParamList = {
  Rankings: undefined;
  CharacterDetails: { characterName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const RankingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false 
      }}
    >
      <Stack.Screen name="Rankings" component={BrawlStarsRankings} />
      <Stack.Screen 
        name="CharacterDetails" 
        component={CharacterDetails}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#65BBE9',
            elevation: 0, // Android
            shadowOpacity: 0, // iOS
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

const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'single' | 'team' | 'rankings'>('home');
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const animatedValues = useRef({
    home: new Animated.Value(1),
    single: new Animated.Value(0),
    team: new Animated.Value(0),
    rankings: new Animated.Value(0),
  }).current;

  const tabs = [
    {
      key: 'home',
      label: 'ホーム',
      icon: require('../assets/AppIcon/home.png'),
    },
    {
      key: 'single',
      label: 'キャラ相性',
      icon: require('../assets/AppIcon/compatibility.png'),
    },
    {
      key: 'team',
      label: 'チーム分析',
      icon: require('../assets/AppIcon/analysis.png'),
    },
    {
      key: 'rankings',
      label: 'ランキング',
      icon: require('../assets/AppIcon/ranking.png'),
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
        return <Home />;
      case 'single':
        return <BrawlStarsCompatibility />;
      case 'team':
        return <TeamCompatibility />;
      case 'rankings':
        return (
          <NavigationContainer independent>
            <RankingsStack />
          </NavigationContainer>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>

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
    borderTopWidth: 1,
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
    backgroundColor: '#65BBE9', // メインカラーに合わせて変更
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#666',
  },
  activeTabIcon: {
    tintColor: '#65BBE9', // メインカラーに合わせて変更
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#65BBE9', // メインカラーに合わせて変更
    fontWeight: 'bold',
  },
});

export default App;