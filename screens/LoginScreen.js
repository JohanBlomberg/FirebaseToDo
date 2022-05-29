import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { React, useState, useEffect } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import logo from './assets/Logo.PNG'



const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = getAuth();
   
    const navigation = useNavigation()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                navigation.navigate('Home')
            }
            else {
                navigation.navigate('Login')
            }
        })

        return unsubscribe
    }, [])

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
        })
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
 
            navigation.navigate('Home')
        })
        .catch(error => alert(error.message))
    }



  return (
      <ScrollView>
      <View style={styles.inputContainer}>
       
          <TextInput 
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text) }
            style={styles.input}
          />
          <TextInput 
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input} 
            secureTextEntry
          />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}>
            <Text style={styles.buttonText}>
                Login
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={handleSignUp}
        style={[styles.button, styles.buttonOutline]}>
            <Text style={styles.buttonOutlineText}>
                Register
            </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    
  )
  
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        marginTop: 230
    },
    input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    },
})