import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UpdatePdf from '../../screens/app/AddTask/UpdatePdf';
import AddTask from '../../screens/app/AddTask';
import ExportPdf from '../../screens/app/AddTask/ExportPDF';
import { Image, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    return (
    <Tab.Navigator screenOptions={{tabBarShowLabel: false, headerShown: false}}>
      <Tab.Screen
        name="ExportPdf"
        component={ExportPdf}   
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/home_active.png')
                  : require('../../assets/home_inactive.png')
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddTask"
        component={AddTask}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/calendar_active.png')
                  : require('../../assets/calendar_inactive.png')
              }
            />
          ),
        }}
      />

      <Tab.Screen
        name="UpdatePdf"
        component={UpdatePdf} 
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              style={styles.icon}
              source={
                focused
                  ? require('../../assets/calculator.png') 
                  : require('../../assets/calculator-inactve.png')
              }
            /> 
          ),
        }}
      />   

    </Tab.Navigator>   
    )
}

const styles = StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
  });

  