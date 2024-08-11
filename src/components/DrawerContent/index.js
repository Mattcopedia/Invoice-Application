import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import {Image, Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Printer from 'react-native-vector-icons/AntDesign';
import  Update from 'react-native-vector-icons/MaterialIcons';

import colors from '../../constants/colors';
import {
  PRIVACY_POLICY_LINK,
  TERMS_CONDITIONS_LINK,
} from '../../constants/links';

function DrawerContent(props) {

  const {navigation} = props;
 

  const logout = () => {
    auth() 
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const onCancelPress = () => {
    navigation.closeDrawer(); // Close the drawer
  };

  return (
    <DrawerContentScrollView {...props}>
         <View style={styles.container}>
         <Pressable style={styles.cancel} onPress={onCancelPress} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <MaterialIcons name={'cancel'} size={25} color={colors.black} />
        </Pressable>
   
         <Text style={styles.invoiceText3}> Cristo Invoices</Text>
         <Image
          style={styles.image}
          source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/planify-1ce36.appspot.com/o/Cristo.JPG?alt=media&token=505360c1-a8c0-40d0-9df9-cc2b56df6b7c',
          }}
     />
         </View>

         <Pressable style={styles.IconContainer}onPress={() => navigation.navigate('HomePage')}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          > 
       <AntDesign name={'home'}  size={25}  color={ colors.purple} />
       <Text style={styles.link} > 
       Dashboard
      </Text> 
       </Pressable>
     
      
       <Pressable style={styles.IconContainer} onPress={() => navigation.navigate('AllInvoices')}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
       <Entypo name={'shopping-bag'}  size={25}  color={colors.purple} />
       <Text style={styles.link} >
        Products
      </Text>  
       </Pressable>

       <Pressable style={styles.IconContainer} onPress={() => navigation.navigate('GeneratedInvoiceList')}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
       <Update name={'update'}  size={25}  color={colors.purple} />
       <Text style={styles.link} >
        History
      </Text>  
       </Pressable>
       
         
       <Pressable style={styles.IconContainer} onPress={() => navigation.navigate('ExportPdf')}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
       <Printer name={'printer'}  size={25}  color={ colors.purple} />
       <Text style={styles.link}>
       Invoice Preview 
      </Text> 
       </Pressable>

       <Pressable style={styles.IconContainer} onPress={() => Linking.openURL(PRIVACY_POLICY_LINK)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
       <MaterialIcons  name={'privacy-tip'}  size={25}  color={colors.purple} />
       <Text style={styles.link1} >
       Privacy Policy
      </Text>  
      </Pressable> 

   
      <Pressable style={styles.IconContainer}  onPress={logout}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      >
       <Entypo  name={'log-out'}  size={25}  color={colors.purple} />
       <Text style={styles.link}>
        Log out
      </Text>  
       </Pressable>

    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  link: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 16,
    margin: 8,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  link1: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 16,
    margin: 8,
    marginHorizontal: 16,
    marginVertical: 20,
    paddingLeft: 3,
  },
  invoiceText: {
    fontSize: 30, 
    color: colors.black,
    fontWeight: '500',
    textAlign: "center",
    marginRight: 10,
    paddingBottom: 3
  },
  invoiceText3: {
    fontSize: 20, 
    color: colors.black,
    fontWeight: '500',
    textAlign: "center",
    marginRight: 10,
    marginBottom:3,
  },
  image: {
    height: 50,
    width: 50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  IconContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  cancel: {
    paddingRight: 20
  }
});

export default React.memo(DrawerContent);
