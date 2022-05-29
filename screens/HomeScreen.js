import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList, Pressable, Image } from 'react-native'
import { React, useEffect, useState } from 'react'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { collection, getDoc, getDocs, doc, deleteDoc , query, updateDoc, where } from "firebase/firestore"; 
import { getAuth, signOut } from "firebase/auth";
import AddItem from './AddItem';
import done from '../assets/done.png';

const HomeScreen = () => {
    const navigation = useNavigation()
    const [tasks, setTasks] = useState([])
    const [done, setDone] = useState([])
    const [progress, setProgress] = useState([])
    const auth = getAuth();
    

   useEffect(() => {
      const getAllTasks = async () => {
        const todo = []
        const done = []
        const progress = []

        const completedTrue = query(collection(db, auth.currentUser.email), where("completed", "==", true));
        const inProgress = query(collection(db, auth.currentUser.email), where("inProgress", "==", true));
        const completedFalse = query(collection(db, auth.currentUser.email), where("completed", "==", false));

        const querySnapshotTrue = await getDocs(completedTrue);
        const querySnapshotFalse = await getDocs(completedFalse);
        const querySnapshotInProgress = await getDocs(inProgress);

        querySnapshotFalse.forEach((doc) => {
            const heading = doc.data();
            const data = heading.task;
            todo.push({
              id: doc.id,
              task: data
            })
            setTasks(todo)
          });

        querySnapshotInProgress.forEach((doc) => {
            const heading = doc.data();
            const data = heading.task;
            progress.push({
              id: doc.id,
              task: data
            })
            setProgress(progress)
          });

          querySnapshotTrue.forEach((doc) => {
            const heading = doc.data();
            const data = heading.task;
            done.push({
              id: doc.id,
              task: data
            })
            setDone(done)
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

    const deleteData = async (id) => {
      const docRef = doc(db, auth.currentUser.email, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef)
      } else {
        console.log("No such document!");
        }
      }


      const doneData = async (id) => {
        const docRef = doc(db, auth.currentUser.email, id);
        await updateDoc(docRef, {
          inProgress: true
        });

        setTimeout( async () => {
          await updateDoc(docRef, {
            completed: true,
            inProgress: false
          })
      }, 7000);
        
      }

      const filter = () => {
        navigation.navigate('FilterItem')
      }
    
    
  return (
    <KeyboardAvoidingView>
          <View style={styles.container}>
             <Text>Välkommen! {auth.currentUser?.email}!</Text>
           </View>

    <AddItem/>

    <View>
      <Pressable 
      onPress={filter}>
      <Text>Filter</Text>
      </Pressable>
    </View>

    <View>
        <Text>Nya fakturor</Text>
         <FlatList
            data={tasks}
              renderItem={({ item }) => (
                 <View style={styles.toDoRow}>
                     <Text>{item.task}</Text>
                        <TouchableOpacity 
                          onPress={() => doneData(item.id)}
                           style={styles.done}>
                             <Image source={done}/>
                         </TouchableOpacity>
                          <Pressable 
                             onPress={() => deleteData(item.id)}
                               style={styles.delete}>
                                <Text style={styles.deleteText}>Radera</Text>
                           </Pressable>
                      </View>
                   )}
                 />
      </View>

<View>
    <Text>Behandlar</Text>
      <FlatList
        data={progress}
        renderItem={({ item }) => (
          <View style={styles.toDoRow}>
            <Text>{item.task}</Text>
        <Pressable 
  onPress={() => deleteData(item.id)}
  style={styles.delete}>
     <Text style={styles.deleteText}>Radera</Text>
  </Pressable>  
          </View>
        )}
      />
</View>

<View style={styles.payed}>
    <Text>Betalda</Text>
      <FlatList
        data={done}
        renderItem={({ item }) => (
          <View style={styles.toDoRow}>
            <Text>{item.task}</Text>
        <Pressable 
  onPress={() => deleteData(item.id)}
  style={styles.delete}>
     <Text style={styles.deleteText}>Radera</Text>
  </Pressable>
          </View>
        )}
      />
</View>

      <View>
      <TouchableOpacity
      style={styles.button}>
          <Text style={styles.buttonText} onPress={logOut}>Logga ut</Text>
      </TouchableOpacity>
      </View>
</KeyboardAvoidingView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContect: 'center',
        alignItems: 'center',   
       },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 300
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

    },
    payed: {
      marginBottom: 300
    }
})