import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import {Image, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Onboarding from './screens/auth/Onboarding';
import Signin from './screens/auth/Signin';
import Signup from './screens/auth/Signup';
import AddTask from './screens/app/AddTask';
import DrawerContent from './components/DrawerContent';
import {setUser} from './store/user';
import ExportPdf from './screens/app/AddTask/ExportPDF';
import UpdatePdf from './screens/app/AddTask/UpdatePdf'; 

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const Routes = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    dispatch(setUser(user));
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  const Tabs = () => (
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
                  ? require('./assets/home_active.png')
                  : require('./assets/home_inactive.png')
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
                  ? require('./assets/invoice.png')
                  : require('./assets/invoice-outlined.png')
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
                ? require('./assets/calendar_active.png')
                : require('./assets/calendar_inactive.png')
              }
            /> 
          ),
        }}
      /> 

    </Tab.Navigator> 
  );

  if (user) {
    return (
      <Drawer.Navigator
        screenOptions={{headerShown: false}}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Tabs" component={Tabs} /> 
        <Drawer.Screen name="AddTask" component={AddTask} /> 
        <Drawer.Screen name="UpdatePdf" component={UpdatePdf} /> 
      </Drawer.Navigator>  
    ); 
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ExportPdf" component={ExportPdf} /> 
      <Stack.Screen name="UpdatePdf" component={UpdatePdf} />  

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default React.memo(Routes);

