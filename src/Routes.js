import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import { Image, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, CommonActions } from '@react-navigation/native';


import Onboarding from './screens/auth/Onboarding';
import Signin from './screens/auth/Signin';
import Signup from './screens/auth/Signup';
import AddTask from './screens/app/AddTask';
import DrawerContent from './components/DrawerContent'; 
import { setUser } from './store/invoices';
import ExportPdf from './screens/app/AddTask/ExportPDF';
import UpdatePdf from './screens/app/AddTask/UpdatePdf'; 
import ProductItem from './screens/app/AddTask/ProductItem';
import AllInvoices from './screens/app/ListInvoices/ListInvoices'; 
import Product from './screens/app/ListInvoices/Product'; 
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationContainer } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from './constants/colors';
import Summary from './screens/app/Summary/Summary';
import UpdateSummary from './screens/app/Summary/UpdateSummary';
import HomePage from './screens/app/HomePage/HomePage';
import SelectProduct from './screens/app/ListInvoices/SelectProduct';  
import ForgotPassword from './screens/auth/Signin/ForgotPassword';
import GeneratedInvoiceList from './screens/app/GeneratedInvoice/GeneratedInvoiceList';
import GeneratedInvoice from './screens/app/GeneratedInvoice/GeneratedInvoice';
import GeneratedProductEdit from './screens/app/GeneratedInvoice/GeneratedProductEdit';
import GeneratedInvoiceEdit from './screens/app/GeneratedInvoice/GeneratedInvoiceEdit';
import Update from 'react-native-vector-icons/MaterialIcons';
import ProductSelected from './screens/app/SelectedProduct/ProductSelected';
import AddProduct from './screens/app/AddTask/AddProduct';
import GeneratedAddProduct from './screens/app/GeneratedInvoice/GeneratedAddProduct';
import GeneratedSelectedProducts from './screens/app/GeneratedInvoice/GeneratedSelectedProducts';
import SelectGenProduct from './screens/app/GeneratedInvoice/SelectGenProduct';
import ProductSelect from './screens/app/ListInvoices/ProductSelect';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomePage" component={HomePage} />
    <Stack.Screen name="AddTask" component={AddTask} />
    <Stack.Screen name="UpdatePdf" component={UpdatePdf} />
    <Stack.Screen name="Product" component={Product} />
    <Stack.Screen name="SelectProduct" component={SelectProduct} />
    <Stack.Screen name="ProductSelect" component={ProductSelect} />
    <Stack.Screen name="ProductItem" component={ProductItem} />
    <Stack.Screen name="AddProduct" component={AddProduct} />
    <Stack.Screen name="Summary" component={Summary} />
    <Stack.Screen name="UpdateSummary" component={UpdateSummary} />
    <Stack.Screen name="GeneratedInvoice" component={GeneratedInvoice} />
    <Stack.Screen name="GeneratedProductEdit" component={GeneratedProductEdit} />
    <Stack.Screen name="GeneratedInvoiceEdit" component={GeneratedInvoiceEdit} />
    <Stack.Screen name="ExportPdf" component={ExportPdf} />
    <Stack.Screen name="ProductSelected" component={ProductSelected} />
  </Stack.Navigator>
);

const GeneratedInvoiceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GeneratedInvoiceList" component={GeneratedInvoiceList} />
    <Stack.Screen name="GeneratedInvoice" component={GeneratedInvoice} />
    <Stack.Screen name="GeneratedProductEdit" component={GeneratedProductEdit} />
    <Stack.Screen name="GeneratedInvoiceEdit" component={GeneratedInvoiceEdit} />
    <Stack.Screen name="GeneratedAddProduct" component={GeneratedAddProduct} />
    <Stack.Screen name="GeneratedSelectedProducts" component={GeneratedSelectedProducts} />
    <Stack.Screen name="SelectGenProduct" component={SelectGenProduct} />
  </Stack.Navigator>
);

const AllInvoicesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllInvoices" component={AllInvoices} />
    <Stack.Screen name="Product" component={Product} />
   <Stack.Screen name="ProductSelect" component={ProductSelect} />

  </Stack.Navigator>
);


const Tabs = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={25}
              color={focused ? colors.purple : colors.grey}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigation.navigate("Home", {
                  screen: "HomePage", // reset to HomePage within HomeStack
                });
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="GeneratedInvoices"
        component={GeneratedInvoiceStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Update
              name="update"
              size={25}
              color={focused ? colors.purple : colors.grey}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigation.navigate("GeneratedInvoices", {
                  screen: "GeneratedInvoiceList", // reset to GeneratedInvoiceList within GeneratedInvoiceStack
                });
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AllInvoicesTab"
        component={AllInvoicesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="shopping-bag"
              size={25}
              color={focused ? colors.purple : colors.grey}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigation.navigate("AllInvoicesTab", {
                  screen: "AllInvoices", // reset to AllInvoices within AllInvoicesStack
                });
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={Tabs} />
  </Stack.Navigator>
);

const Routes = () => { 
  const dispatch = useDispatch();
  const user = useSelector(state => state?.invoices?.user);
  const [initializing, setInitializing] = useState(true);

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

  if (user) {
    return (
      <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        drawerContent={props => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="MainStack" component={MainStack} />
      </Drawer.Navigator>
    );  
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />  
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
 





