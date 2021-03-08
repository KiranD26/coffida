import 'react-native-gesture-handler';
import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Text, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './components/Home';
import Post from './components/Post';

import User from './components/User';


const Tab = createBottomTabNavigator();



class App extends Component {

  constructor(props){
    super(props);
  }


  render(){
    return(

      <NavigationContainer>
        <View style={{flex: 1}}>




          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Post') {
                  iconName = focused ? 'add-circle' : 'add-circle-outline';
                } else if (route.name === 'User') {
                  iconName = focused ? 'person' : 'person-outline';
                }else{
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: '#7ABBBD',
              inactiveTintColor: 'white',
              labelStyle:{
                fontSize: 15,
                fontWeight: 'bold',
              },
              style: {
                backgroundColor: '#854442',
              },
            }}
          >
            <Tab.Screen name ="Home" component={Home} />
            <Tab.Screen name ="Post" component={Post} />
            <Tab.Screen name ="User" component={User} />

          </Tab.Navigator>
        </View>
      </NavigationContainer>
    );
  }
}


export default App;
