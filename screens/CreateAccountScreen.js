import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useUser } from '../utils/UserContext';
import axios from 'axios';
import ipAddress from '../utils/config';


const CreateAccountScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useUser(); // Get loginUser from context

    const handleCreateAccount = async () => {
        try {
            // Basic validation
            if (!username || !password) {
                setError('Please fill in all fields');
                return;
            }

            // First, register the user
            const response = await axios.post(`${ipAddress}/user/register`, {
                username,
                password,
            });

            if (response.status === 201) {
                // After successful registration, log them in automatically
                await loginUser({ username, password });
                navigation.navigate('Home');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Alert.alert(
                    'Registration Error',
                    'Username already exists. Please choose another username.'
                );
            } else {
                Alert.alert(
                    'Error',
                    'Failed to create account. Please try again.'
                );
            }
            console.error('Error creating account:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 100 }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/plant.png')} style={styles.login_plant_logo} />
                <Text style={styles.nurture_logo_login}>Nurture</Text>

                <View style={styles.user_image}>
                    <Image source={require('../assets/user.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Username"
                        value={username}
                        onChangeText={text => {
                            setUsername(text);
                            setError(''); // Clear error when user types
                        }}
                    />
                </View>

                <View style={styles.user_image}>
                    <Image source={require('../assets/lock.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Password"
                        value={password}
                        onChangeText={text => {
                            setPassword(text);
                            setError(''); // Clear error when user types
                        }}
                        secureTextEntry
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                        style={styles.create_account_button}
                        onPress={handleCreateAccount}
                    >
                        <Text style={{ color: '#00C134', fontSize: 18, fontWeight: 'bold' }}>
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
      marginBottom: 20
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
    },
    nurture_logo_login: {
      fontFamily: 'Montserrat',
      color: '#00C134',
      fontSize: 50,
      marginVertical: 10
    },
    inputIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
  });
  

export default CreateAccountScreen;
