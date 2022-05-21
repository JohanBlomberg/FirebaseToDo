import { StyleSheet, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Button, TextInput } from 'react-native'
import { React, useState } from 'react'
import { firestore } from '../firebase'


const AddItem = () => {

  const [newItem, setnewItem] = useState('')

  const addNewTask = (object) => {
    setnewItem(object)
    console.log(newItem)
    
  }
  
  const testFirebase = () => {
    console.log(firestore.collection('posts'))

  }

  return (
    <KeyboardAvoidingView 
    style={styles.container}
    behavior="padding">
      <Text>Lägg till ny rad</Text>
      <TextInput 
      placeholder='Lägg till ny händelse'
      onChangeText={addNewTask}/>
  <Button title="test" onPress={testFirebase}/>


</KeyboardAvoidingView>
  )
}

export default AddItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContect: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40
    },
 buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
})