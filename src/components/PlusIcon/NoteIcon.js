import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {  Pressable, Image, View,Text } from 'react-native';
import NoteStyles from "./NoteStyles"

const NoteIcon = () => {
  const navigation = useNavigation();
  const onPress = () => {
      navigation.navigate('NotesAdd');
  };
  return (

        <View style={NoteStyles.bottom}>
          <Pressable style={NoteStyles.containerNote} onPress={onPress} hitSlop={8}>
            <Image style={NoteStyles.plusNote} source={require("../../assets/edit-text-inactive.png")} />
          </Pressable>
        </View>
  );
};

export default React.memo(NoteIcon);
