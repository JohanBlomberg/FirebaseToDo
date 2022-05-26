import { StyleSheet, Text, KeyboardAvoidingView, Pressable, TextInput } from 'react-native'
import { React, useState } from 'react'
import { collection, addDoc, Timestamp} from "firebase/firestore"; 
import { db } from '../firebase';
import { getAuth } from "firebase/auth";


const AddItem = () => {

  const [newItem, setnewItem] = useState('')
  const auth = getAuth();

  const addNewTask = async () => {
    try {
      const docRef = await addDoc(collection(db, auth.currentUser.email), {
        task: newItem,
        created: Timestamp.now(),
        completed: false,
        inProgress: false
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    }


  return (
    <KeyboardAvoidingView 
    style={styles.container}>
      <TextInput 
      placeholder='Lägg till ny händelse'
      onChangeText={((obj) => { setnewItem(obj) })}
      style={styles.textInput}
      />
  <Pressable 
  onPress={addNewTask}
  style={styles.button}>
     <Text style={styles.buttonText}>Lägg till</Text>
  </Pressable>

</KeyboardAvoidingView>
  )
}

export default AddItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContect: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    button: {
      backgroundColor: '#0782F9',
      padding: 10,
      borderRadius: 10,
      marginLeft: 10

  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
},

})