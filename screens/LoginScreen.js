import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import ipAddress from '../utils/config';
import { useUser } from '../utils/UserContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useUser();
  
  const handleLogin = async () => {
    console.log(username);
    console.log(password);
    try {
      // Pass credentials directly to loginUser
      await loginUser({ username, password });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error during login:', error);
      
      let errorMessage = 'Please check your username and password and try again.';
      if (error.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      Alert.alert(
        'Login Failed',
        errorMessage
      );
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: 100 }} />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image source={require('../assets/plant.png')} style={styles.login_plant_logo} />
        <Text style={styles.nurture_logo_login}>Nurture</Text>

        <View style={styles.user_image}>
          <Image source={require('../assets/user.png')} style={styles.inputIcon} />
          <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.inputText} />
        </View>



        <View
          style={styles.user_image}>
          <Image source={require('../assets/lock.png')} style={styles.inputIcon} />
          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.inputText}/>
        </View>

        <View style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>

          <TouchableOpacity style={styles.login_button} onPress={handleLogin}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold',fontFamily: 'Montserrat_Regular', }}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.create_account_button}
            onPress={() => navigation.navigate('Create Account')}
          >
            <Text style={{ color: '#00C134', fontSize: 18, fontWeight: 'bold', fontFamily: 'Montserrat_Regular', }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  user_image: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  login_plant_logo: {
    width: 200,
    height: 200,
  },
  login_button: {
    backgroundColor: '#00C134',
    padding: 10,
    width: 200,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  create_account_button: {
    padding: 10,
    width: 200,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00C134',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    flex: 1,
    height: '100%',
    textAlignVertical: 'center',
    paddingLeft: 25,
    fontFamily: 'Montserrat_Regular',
  },
  nurture_logo_login: {
    fontFamily: 'Montserrat_Regular',
    color: '#00C134',
    fontSize: 50,
    marginVertical: 10
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default LoginScreen;
