import React from 'react';
import {Image, Text, View} from 'react-native';
import Button from '../../../components/Button';
import styles from './styles';

const Onboarding = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
            <Image
          style={styles.image}
          source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/planify-1ce36.appspot.com/o/Cristo.JPG?alt=media&token=505360c1-a8c0-40d0-9df9-cc2b56df6b7c',
          }}
/>

        <View style={styles.footer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Cristo Invoices</Text>
        <Text style={styles.subtitle}>
        Take control of your invoices and boost your productivity   
        </Text>

        <Button onPress={() => navigation.navigate('Signin')}>Log in</Button>
        <Button onPress={() => navigation.navigate('Signup')} type={'blue'}>
          Get started
        </Button>
      </View>
    </View>
  );
};

export default React.memo(Onboarding);
