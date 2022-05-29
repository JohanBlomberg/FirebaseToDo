import { StyleSheet, Text, KeyboardAvoidingView, Button, TextInput, View, FlatList } from 'react-native'
import { React, useState, useEffect } from 'react'
import { collection, query, getDocs, where } from "firebase/firestore"; 
import { db, auth } from '../firebase';
import SelectDropdown from 'react-native-select-dropdown'


const FilterItem = () => {

  const [tasks, setTasks] = useState([])
  const invoiceCategories = ['Boende', 'Mat & Förbrukning', 'Transport', 'Telefoni & data', 'Nöjen', 'Sparande']



const renderFilter = async (filter) => {
  const task = [];

  const filterQuery = query(collection(db, auth.currentUser.email), where("filter", "==", filter));
  const querySnapshot = await getDocs(filterQuery);
  querySnapshot.forEach((doc) => {
    const heading = doc.data();
    const data = heading.task;
    task.push({
      task: data
    })
    setTasks(task)
  });
}


  return (
    <KeyboardAvoidingView 
    style={styles.container}>
      <View>
       <SelectDropdown
       data={invoiceCategories}
       onSelect={(selectedItem) => renderFilter(selectedItem)}
       defaultButtonText='Välj kategori'/>
</View>

<View style={styles.payed}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.toDoRow}>
            <Text>{item.task}</Text>
          </View>
        )}
      />
</View>

</KeyboardAvoidingView>
  )
}

export default FilterItem

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