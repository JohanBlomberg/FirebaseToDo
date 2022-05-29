import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Pressable, Image, TextInput } from 'react-native'
import { React, useEffect, useState } from 'react'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { collection, addDoc, getDoc, Timestamp, getDocs, doc, deleteDoc , query, updateDoc, where } from "firebase/firestore"; 
import { getAuth, signOut } from "firebase/auth";
import doneIcon from '../assets/done.png';
import deleteIcon from '../assets/delete.png';
import filterIcon from '../assets/filter.png';
import addIcon from '../assets/addItem.png';
import logoutIcon from '../assets/logout.png';
import SelectDropdown from 'react-native-select-dropdown'


const HomeScreen = () => {
    const navigation = useNavigation()
    const [tasks, setTasks] = useState([])
    const [done, setDone] = useState([])
    const [progress, setProgress] = useState([])
    const auth = getAuth();
    const [newItem, setnewItem] = useState('')
    const [invoice, setInvoice] = useState('')
    const invoiceCategories = ['Boende', 'Mat & Förbrukning', 'Transport', 'Telefoni & data', 'Nöjen', 'Sparande']

    useEffect(() => {
     getAllTasks()

    }, [])
    
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
        getAllTasks()
        }

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
        getAllTasks()
      }


      const doneData = async (id) => {
        const docRef = doc(db, auth.currentUser.email, id);
        await updateDoc(docRef, {
          inProgress: true
        });
          getAllTasks()
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
    <View style={styles.container}>
        <View style={styles.header}>
       <Text>Välkommen, {auth.currentUser?.email}!</Text>
        <TouchableOpacity 
          onPress={filter}>
                <Image style={styles.filterIcon} source={filterIcon}/>
        </TouchableOpacity>
          </View>
         <View 
           style={styles.addEventField}>
           <TextInput 
             placeholder='Lägg till ny händelse'
               onChangeText={((obj) => { setnewItem(obj) })}
                style={styles.textInput}
            />
        
</View>
            <View style={styles.addEventIcons}>
            <SelectDropdown
              data={invoiceCategories}
                 onSelect={(selectedItem) => setInvoice(selectedItem)}
                  defaultButtonText='Välj kategori'/>
              <TouchableOpacity 
                onPress={addNewTask}>
                  <Image style={styles.filterIcon} source={addIcon}/>
              </TouchableOpacity>
               
      </View>

      <View
         style={styles.border}
      />
  <View>
    <Text style={styles.title}>Nya fakturor</Text>
      <FlatList
        data={tasks}
          renderItem={({ item }) => (
              <View style={styles.toDoRow}>
                <Text>{item.task}</Text>

                  <TouchableOpacity 
                    onPress={() => doneData(item.id)}
                      style={styles.done}>
                        <Image style={styles.doneButton} source={doneIcon}/>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => deleteData(item.id)}
                      style={styles.delete}>
                        <Image style={styles.deleteButton} source={deleteIcon}/>
                  </TouchableOpacity>
              </View>
            )}
        />
    </View>
    <View
         style={styles.border}
      />
  <View style={styles.inProgressStyle}>
    <Text style={styles.title}>Behandlar</Text>
      <FlatList
        data={progress}
          renderItem={({ item }) => (
            <View style={styles.toDoRow}>
              <Text>{item.task}</Text>
                <TouchableOpacity 
                  onPress={() => deleteData(item.id)}
                    style={styles.delete}>
                      <Image style={styles.deleteButton} source={deleteIcon}/>
                </TouchableOpacity>
            </View>
        )}
      />
  </View>
  <View
         style={styles.border}
      />
  <View style={styles.payed}>
    <Text style={styles.title}>Betalda</Text>
      <FlatList
        data={done}
          renderItem={({ item }) => (
            <View style={styles.toDoRow}>
              <Text>{item.task}</Text>
                <TouchableOpacity 
                  onPress={() => deleteData(item.id)}
                    style={styles.delete}>
                      <Image style={styles.deleteButton} source={deleteIcon}/>
                </TouchableOpacity>
            </View>
        )}
      />
  </View>
  <View
         style={styles.border}
      />
  <View>
    <TouchableOpacity
        onPress={logOut}>
          <Image style={styles.logoutButton} source={logoutIcon}/>
     </TouchableOpacity>
    </View>
  </View>
  )
}

export default  HomeScreen

const styles = StyleSheet.create({
    container: {
      marginTop: 10,
        flex: 1,
       },
       addEventContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    header: {
      flexDirection: 'row',
      padding: 15
    },
    button: {
        backgroundColor: '#0782F9',
        width: '30%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
 buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    toDoRow: {
     flexDirection: 'row'
    },
    doneButton: {
      width: 25,
      height: 20
    },
    deleteButton: {
      width: 25,
      height: 20
    },
    filterIcon: {
      marginLeft: 30,
      width: 40,
      height: 40
    },
    logoutButton: {
      width: 80,
      height: 80
    },
    border: {
      paddingTop: 10,
      borderBottomColor: '#0782F9',
      borderBottomWidth: 1,
    },
    addEventField: {
      paddingTop: 10,
      alignItems: 'center',
      flexDirection: 'row',
    },
    addEventIcons: {
      flexDirection: 'row'
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold'
    },
})