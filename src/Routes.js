import auth from '@react-native-firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';


import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Update from 'react-native-vector-icons/MaterialIcons';
import DrawerContent from './components/DrawerContent';
import LatestInvoice from './components/LatestSliderInfo/LatestInvoice';
import LatestReceipt from './components/LatestSliderInfo/LatestReceipt';
import LatestRefurb from './components/LatestSliderInfo/LatestRefurb';
import colors from './constants/colors';
import AddTask from './screens/app/AddTask';
import AddProduct from './screens/app/AddTask/AddProduct';
import ExportPdf from './screens/app/AddTask/ExportPDF';
import ProductItem from './screens/app/AddTask/ProductItem';
import RefurbishmentPdf from './screens/app/AddTask/RefurbishmentPdf';
import RefurbishProduct from './screens/app/AddTask/RefurbishProduct';
import GeneratedAddProduct from './screens/app/GeneratedInvoice/GeneratedAddProduct';
import GeneratedInvoice from './screens/app/GeneratedInvoice/GeneratedInvoice';
import GeneratedInvoiceEdit from './screens/app/GeneratedInvoice/GeneratedInvoiceEdit';
import GeneratedInvoiceList from './screens/app/GeneratedInvoice/GeneratedInvoiceList';
import GeneratedProductEdit from './screens/app/GeneratedInvoice/GeneratedProductEdit';
import GeneratedSelectedProducts from './screens/app/GeneratedInvoice/GeneratedSelectedProducts';
import SelectGenProduct from './screens/app/GeneratedInvoice/SelectGenProduct';
import HomePage from './screens/app/HomePage/HomePage';
import AllInvoices from './screens/app/ListInvoices/ListInvoices';
import Product from './screens/app/ListInvoices/Product';
import ProductSelect from './screens/app/ListInvoices/ProductSelect';
import SelectProduct from './screens/app/ListInvoices/SelectProduct';
import EditReceipt from './screens/app/Receipt/EditReceipt';
import GeneratedReceiptPdf from './screens/app/Receipt/GeneratedReceiptPdf';
import ReceiptForm from './screens/app/Receipt/ReceiptForm';
import ReceiptPdfList from './screens/app/Receipt/ReceiptPdfList';
import GeneratedRefurbishInvoice from './screens/app/Refurbish/GeneratedRefurbishInvoice';
import GeneratedRefurbishInvoiceEdit from './screens/app/Refurbish/GeneratedRefurbishInvoiceEdit';
import GeneratedRefurbishInvoiceList from './screens/app/Refurbish/GeneratedRefurbishInvoiceList';
import GeneratedRefurbishProductEdit from './screens/app/Refurbish/GeneratedRefurbishProductEdit';
import ProductSelected from './screens/app/SelectedProduct/ProductSelected';
import RefurbishSummary from './screens/app/Summary/RefurbishSummary';
import Summary from './screens/app/Summary/Summary';
import Onboarding from './screens/auth/Onboarding';
import Signin from './screens/auth/Signin';
import ForgotPassword from './screens/auth/Signin/ForgotPassword';
import Signup from './screens/auth/Signup';
import { setUser } from './store/invoices';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
 
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomePage" component={HomePage} />
    <Stack.Screen name="AddTask" component={AddTask} />
    <Stack.Screen name="Product" component={Product} />
    <Stack.Screen name="SelectProduct" component={SelectProduct} />
    <Stack.Screen name="ProductSelected" component={ProductSelected} />
    <Stack.Screen name="ProductSelect" component={ProductSelect} />  
    <Stack.Screen name="ProductItem" component={ProductItem} /> 
    <Stack.Screen name="AddProduct" component={AddProduct} />
    <Stack.Screen name="Summary" component={Summary} />
    <Stack.Screen name="GeneratedInvoice" component={GeneratedInvoice} />
    <Stack.Screen name="GeneratedProductEdit" component={GeneratedProductEdit} />
    <Stack.Screen name="GeneratedInvoiceEdit" component={GeneratedInvoiceEdit} />
    <Stack.Screen name="ExportPdf" component={ExportPdf} />
    <Stack.Screen name="RefurbishProduct" component={RefurbishProduct} />
    <Stack.Screen name="RefurbishSummary" component={RefurbishSummary} />
    <Stack.Screen name="RefurbishmentPdf" component={RefurbishmentPdf} />   

    <Stack.Screen name="GeneratedRefurbishInvoiceList" component={GeneratedRefurbishInvoiceList} />  
    <Stack.Screen name="GeneratedRefurbishInvoice" component={GeneratedRefurbishInvoice} />
    <Stack.Screen name="GeneratedRefurbishProductEdit" component={GeneratedRefurbishProductEdit} />
    <Stack.Screen name="GeneratedRefurbishInvoiceEdit" component={GeneratedRefurbishInvoiceEdit} />  
    <Stack.Screen name="GeneratedInvoiceList" component={GeneratedInvoiceList} /> 


    <Stack.Screen name="ReceiptForm" component={ReceiptForm} /> 
    <Stack.Screen name="EditReceipt" component={EditReceipt} />
    <Stack.Screen name="GeneratedReceiptPdf" component={GeneratedReceiptPdf} />
    <Stack.Screen name="ReceiptPdfList" component={ReceiptPdfList} />   
    <Stack.Screen name="AllInvoices" component={AllInvoices} /> 
 
    <Stack.Screen name="GeneratedAddProduct" component={GeneratedAddProduct} />
    <Stack.Screen name="GeneratedSelectedProducts" component={GeneratedSelectedProducts} />
    <Stack.Screen name="SelectGenProduct" component={SelectGenProduct} /> 
  
    <Stack.Screen name="LatestInvoice" component={LatestInvoice} /> 
    <Stack.Screen name="LatestRefurb" component={LatestRefurb} /> 
    <Stack.Screen name="LatestReceipt" component={LatestReceipt} /> 
 
 
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

const GeneratedRefurbishInvoiceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
     <Stack.Screen name="GeneratedRefurbishInvoiceList" component={GeneratedRefurbishInvoiceList} />  
    <Stack.Screen name="GeneratedRefurbishInvoice" component={GeneratedRefurbishInvoice} />
    <Stack.Screen name="GeneratedRefurbishProductEdit" component={GeneratedRefurbishProductEdit} />
    <Stack.Screen name="GeneratedRefurbishInvoiceEdit" component={GeneratedRefurbishInvoiceEdit} />  
    <Stack.Screen name="GeneratedInvoiceList" component={GeneratedInvoiceList} /> 
  </Stack.Navigator>
);


const AllInvoicesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}> 
  {/* <Stack.Screen name="ExportPdf" component={ExportPdf} />  */}
     {/* <Stack.Screen name="RefurbishmentPdf" component={RefurbishmentPdf} />      */}
    <Stack.Screen name="AllInvoices" component={AllInvoices} />      
    <Stack.Screen name="Product" component={Product} />
    <Stack.Screen name="ProductSelected" component={ProductSelected} />
    <Stack.Screen name="ProductSelect" component={ProductSelect} />   
  </Stack.Navigator>
); 


const Tabs = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name="HomeTab"
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
                navigation.navigate("HomeTab", {
                  screen: "HomePage", // reset to HomePage within HomeStack
                });
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="GeneratedInvoicesTab"
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
                navigation.navigate("GeneratedInvoicesTab", {
                  screen: "GeneratedInvoiceList",
                });
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="GeneratedRefurbishInvoiceTab" 
        component={GeneratedRefurbishInvoiceStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Update
              name="history-edu"
              size={25}
              color={focused ? colors.purple : colors.grey}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                navigation.navigate("GeneratedRefurbishInvoiceTab", {
                  screen: "GeneratedRefurbishInvoiceList", 
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
 





