import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { auth } from '../firebase'

const HomeScreen = () => {

    
  return (
    <KeyboardAvoidingView 
    style={styles.container}
    behavior="padding">
    <View style={styles.container}>
      <Text>Welcome {auth.currentUser?.email}!</Text>
      <TouchableOpacity
      style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>

    <View>

    </View>

</KeyboardAvoidingView>
  )
}

export default HomeScreen

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