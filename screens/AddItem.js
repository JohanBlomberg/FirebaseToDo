import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import { React, useState } from 'react'
import { collection, addDoc, Timestamp} from "firebase/firestore"; 
import { db } from '../firebase';
import { getAuth } from "firebase/auth";
import SelectDropdown from 'react-native-select-dropdown'


const AddItem = () => {

  const [newItem, setnewItem] = useState('')
  const [invoice, setInvoice] = useState('')
  const invoiceCategories = ['Boende', 'Mat & Förbrukning', 'Transport', 'Telefoni & data', 'Nöjen', 'Sparande']
  const auth = getAuth();

  const addNewTask = async () => {
    try {
      const docRef = await addDoc(collection(db, auth.currentUser.email), {
        task: newItem,
        created: Timestamp.now(),
        completed: false,
        inProgress: false,
        filter: invoice
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    }


  return (
    <View 
    style={styles.container}>
      <TextInput 
      placeholder='Lägg till ny händelse'
      onChangeText={((obj) => { setnewItem(obj) })}
      style={styles.textInput}
      />
      <SelectDropdown
       data={invoiceCategories}
       onSelect={(selectedItem) => setInvoice(selectedItem)}
       defaultButtonText='Välj kategori'/>
  <Pressable 
  onPress={addNewTask}
  style={styles.button}>
     <Text style={styles.buttonText}>Lägg till</Text>
  </Pressable>

</View>
  )
}

export default AddItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContect: 'center',
        alignItems: 'center',
    },
    button: {
      backgroundColor: '#0782F9',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16
},

})