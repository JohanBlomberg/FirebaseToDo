import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Pressable, Image, TextInput } from 'react-native'
import { React, useEffect, useState } from 'react'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { collection, addDoc, getDoc, Timestamp, getDocs, doc, deleteDoc , query, updateDoc, where, onSnapshot } from "firebase/firestore"; 
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

    const getSnapshotNewInvoices = () => {
      const todo = []
      const q = query(collection(db, auth.currentUser.email), where("completed", "==", false));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const heading = doc.data();
          const data = heading.task;
          todo.push({
            id: doc.id,
            task: data
          })
          setTasks(todo)
        })
      })
    }

    const renderFilter =  (filter) => {
      const todo = [];
      
      const q = query(collection(db, auth.currentUser.email), where("filter", "==", filter), where('completed', '==', false));
       
          const unsubscribe = onSnapshot(q, (querySnapshot) => {

            if( querySnapshot.empty) {
              todo.push({
                message: 'Här var det tomt',
              })
              setTasks(todo)
            } else { 
              querySnapshot.forEach((doc) => {
              const heading = doc.data();
              const data = heading.task;
              todo.push({
                id: doc.id,
                task: data
              })
            setTasks(todo)
          })}
      })
    }


    const getSnapshotInProgressInvoices = () => {
      const progress = []
      const q = query(collection(db, auth.currentUser.email), where("inProgress", "==", true));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const heading = doc.data();
          const data = heading.task;
          progress.push({
            id: doc.id,
            task: data
          })
          setProgress(progress)
        })
      })
    }

    const getSnapshotDoneQuery = () => {
      const done = []
      const q = query(collection(db, auth.currentUser.email), where("done", "==", true));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const heading = doc.data();
          const data = heading.task;
          done.push({
            id: doc.id,
            task: data
          })
          setDone(done)
        })
      })
    }
    
    const getAllTasks = async () => {
      
      const done = []
      const progress = []
      const todo = []

      const completedDone = query(collection(db, auth.currentUser.email), where("done", "==", true));
      const inProgress = query(collection(db, auth.currentUser.email), where("inProgress", "==", true));
      const completedFalse = query(collection(db, auth.currentUser.email), where("completed", "==", false));
     

      const querySnapshotDone = await getDocs(completedDone);
      const querySnapshotInProgress = await getDocs(inProgress);
      const querySnapshotFalse = await getDocs(completedFalse);

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

        querySnapshotDone.forEach((doc) => {
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
            done: false,
            filter: invoice
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }     
        getSnapshotNewInvoices()
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
        getSnapshotDoneQuery();
        getSnapshotNewInvoices()
        getSnapshotInProgressInvoices()
      }


      const doneData = async (id) => {
      
        const docRef = doc(db, auth.currentUser.email, id);
        await updateDoc(docRef, {
          inProgress: true,
          completed: true
        });
        getSnapshotNewInvoices()
        getSnapshotInProgressInvoices()
        setTimeout( async () => {
          await updateDoc(docRef, {
            inProgress: false,
            done: true
          })
          getSnapshotInProgressInvoices()
      }, 5000)
      setTimeout( () => {
        getSnapshotDoneQuery();
        getSnapshotNewInvoices()
        getSnapshotInProgressInvoices()
      }, 6000);
      }

     
  return (
    <ScrollView>
    <View style={styles.container}>
        <View style={styles.header}>
       <Text>Välkommen, {auth.currentUser?.email}!</Text>

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
                style={styles.dropdown}
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
  <View style={styles.newInvoices}>
    <Text style={styles.title}>Nya fakturor</Text>
    <SelectDropdown
       data={invoiceCategories}
       onSelect={(selectedItem) => renderFilter(selectedItem)}
       defaultButtonText='Filtrera'/>
      <View style={styles.title2Container}>
      <Text style={styles.title2}>Namn</Text>
      <Text style={styles.title2}>Klar</Text>
      <Text style={styles.title2}>Radera</Text>
      </View>
      <FlatList
        data={tasks}
          renderItem={({ item }) => (
              item.task == null   ? 
              <View>
                <Text>{item.message}</Text>
              </View>
              :
              <View style={styles.toDoRow}>
                  
                <Text style={styles.itemStyle}>{item.task}</Text>
                                    
                  <TouchableOpacity 
                    onPress={() => doneData(item.id)}
                    style={styles.itemStyle}>
                        <Image style={styles.doneButton} source={doneIcon}/>
                  </TouchableOpacity>


                  <TouchableOpacity 
                    onPress={() => deleteData(item.id)}
                    style={styles.itemStyle}>
                        <Image style={styles.deleteButton} source={deleteIcon}/>
                  </TouchableOpacity>

              </View>
            )}
        />
    </View>
    <View
         style={styles.border}
      />
  <View style={styles.invoicesInProgress}>
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
  <View style={styles.invoicesInProgress}>
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
  <View style={styles.logoutButtonView}>
    <TouchableOpacity
        onPress={logOut}>
          <Image style={styles.logoutButton} source={logoutIcon}/>
     </TouchableOpacity>
    </View>
  </View>
  </ScrollView>
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
     flexDirection: 'row',
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
      height: 80,
      alignItems: 'center'
    },
    border: {
      paddingTop: 10,
      borderBottomColor: '#0782F9',
      borderBottomWidth: 1,
    },
    addEventField: {
      paddingTop: 10,
      alignItems: 'center',
      width: '80%',
      height: 40,
      padding: 10,
      marginBottom: 10
    },
    addEventIcons: {
      flexDirection: 'row'
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      padding: 10,
    },   
    title2: {
      flex: 1,
      paddingLeft: 30,
      paddingBottom: 20,
      fontSize: 12,
     color: '#969799'
    },
    title2Container: {
      flexDirection: 'row'
    },
    newInvoices: {
      alignItems: 'center'
    },
    invoicesInProgress: {
      alignItems: 'center'
    },
    logoutButtonView: {
      alignItems: 'center'
    },
    itemStyle: {
  
    },
})