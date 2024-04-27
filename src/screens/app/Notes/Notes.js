import { View, Text, FlatList, SafeAreaView, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import PlusIcon from '../../../components/PlusIcon'
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { setToUpdate } from '../../../store/tasks';
import Input from '../../../components/Input';
import NoteIcon from '../../../components/PlusIcon/NoteIcon';


const Notes = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation() 
    const [notes, setNotes] = useState([])
    const user = useSelector(state => state.user.data);
    const isFocused = useIsFocused();
    const characterLimit = 100; // Define the character limit
    const [filteredNotes, setFilteredNotes] = useState(notes)
    const [keyword, setKeyword] = useState("")

    useEffect(() => {
        if (keyword?.length > 2) {
            const filteredItems = notes?.filter(note => note?.title?.toLowerCase()?.includes(keyword?.toLowerCase()))
            setFilteredNotes(filteredItems);
        } else if (keyword.length < 1) {
            setFilteredNotes(notes)
        }
    }, [keyword])

    useEffect(() => {
        if (isFocused) {
            firestore()
                .collection('Notes')
                .where('userId', '==', user?.uid)
                .get()
                .then(querySnapshot => {
                    const newNotes = [];

                    querySnapshot.forEach(documentSnapshot => {
                        const { note, title } = documentSnapshot.data()
                        newNotes.unshift({ note, title, uid: documentSnapshot.id, });
                    });

                    setNotes(newNotes);
                });

            dispatch(setToUpdate());
        }
    }, [isFocused]);




    console.log(notes)
    return (
        <SafeAreaView>
   
            <View>
                <Header title="Your Notes" />
            </View>
            
          <ScrollView>

            <Input
                value={keyword}
                onChangeText={setKeyword}
                outlined
                placeholder="Search for Notes"
            />
                    
              <NoteIcon />
              <View >
            <FlatList 
                showsVerticalScrollIndicator={true}
                data={filteredNotes} numColumns={2}  keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (

                    <View style={styles.noteView}>
                        <Pressable onPress={() => navigation.navigate('Details', { item })}>
                            <Text style={styles.noteTitle}>{item?.title.substring(0, 19)}</Text>
                            {item?.title.length > characterLimit ? (
                                <Text style={styles.noteDescription}>{item?.note}</Text>
                            ) :
                                <Text style={styles.noteDescription}>{item?.title.substring(0, 20)} {'\n'}<Text style={styles.readMore}>Read More...</Text></Text>}
                        </Pressable>
                    </View>

                )}
            />
            </View>
            </ScrollView> 
       
             </SafeAreaView>

    )
}

export default Notes 