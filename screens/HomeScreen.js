import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, LogBox, Pressable } from 'react-native'
import { React, useEffect, useState } from 'react'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { collection, getDocs  } from "firebase/firestore"; 
import { getAuth, signOut } from "firebase/auth";
import AddItem from './AddItem';
LogBox.ignoreLogs(['Warning: ...']); // 

const HomeScreen = () => {
    const navigation = useNavigation()
    const [tasks, setTasks] = useState([])
    const auth = getAuth();
    

   useEffect(() => {
      const getAllTasks = async () => {
        const todo = []
        const querySnapshot = await getDocs(collection(db, auth.currentUser.email));
        querySnapshot.forEach((doc) => {
            const heading = doc.data();
            const data = heading.task;
            todo.push({
              id: doc.id,
              task: data
            })
            setTasks(todo)
            
          });
        }
        getAllTasks();

   }, [])

   const logOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login')
    }).catch((error) => {
      console.log(error)
    });
                
    }
    
  return (
    <ScrollView>

    <KeyboardAvoidingView 
    style={styles.container}
    behavior="padding">
    <View style={styles.container}>
      <Text>Välkommen! {auth.currentUser?.email}!</Text>
    </View>

    <AddItem/>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.toDoRow}>
            <Text>Räkning: {item.task}</Text>
            <Pressable 
  onPress={logOut}
  style={styles.done}>
     <Text style={styles.doneText}>Klar</Text>
  </Pressable>
  <Pressable 
  onPress={logOut}
  style={styles.delete}>
     <Text style={styles.deleteText}>Radera</Text>
  </Pressable>
          </View>
        )}
      />
      <View>
      <TouchableOpacity
      style={styles.button}>
          <Text style={styles.buttonText} onPress={logOut}>Logga ut</Text>
      </TouchableOpacity>
      </View>
</KeyboardAvoidingView>
</ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContect: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 300
    },
 buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    toDoRow: {
     flexDirection: 'row'
    },
    done: {
      backgroundColor: '#00D100',
    },
    doneText: {

    },
    delete: {
      backgroundColor: '#BF181D'
    },
    deleteText: {

    }
})