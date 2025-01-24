import React, { useState } from 'react';
import axios from 'axios';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Switch,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Import for icons
import headerImage from '../assets/coniferous-trees-hill.jpg'; // Adjust the path as needed
import ipAddress from '../utils/config';


const SettingsScreen = ({ navigation }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [username, setUsername] = useState('');
    //const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toggleNotifications = () => {
        setNotificationsEnabled((previousState) => !previousState);
        alert(
            `Notifications have been ${!notificationsEnabled ? 'enabled' : 'disabled'}.`
        );
    };

    const handleSaveChanges = async () => {
        try {
            // Retrieve the logged-in user from AsyncStorage
            const currentUser = await AsyncStorage.getItem('@user');
            const parsedUser = JSON.parse(currentUser);
    
            if (!parsedUser || !parsedUser._id) {
                Alert.alert('Error', 'User not found in AsyncStorage.');
                return;
            }
    
            const userId = parsedUser._id; // Use the user's ID from storage
    
            // Prepare data for the update
            const updates = {};
            if (username) updates.username = username;
            if (password) updates.password = password;
    
            if (!Object.keys(updates).length) {
                Alert.alert('Error', 'Please provide a username or password to update.');
                return;
            }
    
            // Send update request to the backend
            const response = await axios.put(`${ipAddress}/user/${userId}/update`, updates);
    
            if (response.status === 200) {
                const updatedUser = response.data.user;
    
                // Update the user in AsyncStorage
                await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
    
                Alert.alert('Success', 'User updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update user.');
            }
        } catch (error) {
            console.error('Error in handleSaveChanges:', error);
            Alert.alert('Error', 'An error occurred while updating user details.');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('@user');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            alert('Failed to log out.');
            console.error('Logout error:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header with text and image */}
            <View style={styles.headerBox}>
            <Image
                source={headerImage}
                style={styles.headerImage}
                resizeMode="cover"
            />
                {/* <Text style={styles.headerText}>Settings</Text> */}
            </View>

            {/* Settings content */}
            <View style={styles.contentContainer}>
                {/* Notifications Toggle */}
                <View style={styles.settingRow}>
                    <Ionicons name="notifications" size={24} color="#333" />
                    <Text style={styles.label}>Enable Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={toggleNotifications}
                        thumbColor={notificationsEnabled ? '#4CAF50' : '#ccc'}
                        trackColor={{ true: '#A5D6A7', false: '#E0E0E0' }}
                    />
                </View>

                {/* Username Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Change Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new username"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                {/* Email Input */}
                {/* <View style={styles.inputContainer}>
                    <Text style={styles.label}>Change Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View> */}

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {/* Save Changes Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>

                {/* Log Out Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#A5D6A7', // Light green
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        height: 200,
    },
    headerImage: {
        width: 345,
        height: 150,
        borderRadius: 10,
        marginRight: 15,
        alignItems:'center'
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Arial',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 12,
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        marginLeft: 10,
    },
    inputContainer: {
        width: '100%',
        marginVertical: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
    },
    saveButton: {
        marginVertical: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    logoutButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;
