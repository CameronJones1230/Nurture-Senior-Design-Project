import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ipAddress from '../utils/config';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (credentials) => {
    try {
        const response = await axios.post(`${ipAddress}/user/register`, credentials);
        if (response.status === 201) {
            // After successful registration, log them in
            return await loginUser(credentials);
        }
        throw new Error('Registration failed');
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

  const updateUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      setUser(userData);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const refreshUser = async (force = false) => {
    try {
      if (!user?._id) return null;
      if (!force && lastUpdate && Date.now() - lastUpdate < 2000) {
        return user;
      }

      const response = await axios.get(`${ipAddress}/user/${user._id}`);
      const updatedUser = response.data;
      await updateUserData(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return user;
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${ipAddress}/user/login`, credentials);
      if (response.data.user) {
        await updateUserData(response.data.user);
        return response.data.user;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
      setLastUpdate(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };


  const updatePlant = async (plantData, isNew = false) => {
    try {
      if (!user?._id) throw new Error('No user logged in');
      console.log("testing user context", plantData._id, user._id);
  
      const endpoint = isNew 
        ? `${ipAddress}/user/${user._id}/plants`
        : `${ipAddress}/user/${user._id}/plant/${plantData._id}/update`;
  
      const method = isNew ? 'post' : 'put';
      const response = await axios[method](endpoint, plantData);
  
      if (response.data.user) {
        await updateUserData(response.data.user);
        return response.data.user;
      } else {
        // If we don't get a user object back, refresh the user data
        const refreshedUser = await refreshUser(true);
        return refreshedUser;
      }
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  };

  const deletePlant = async (plantId) => {
    try {
      if (!user?._id) throw new Error('No user logged in');
  
      const response = await axios.delete(
        `${ipAddress}/user/${user._id}/plant/${plantId}`
      );
  
      if (response.data.user) {
        await updateUserData(response.data.user);
        return response.data.user;
      } else if (response.data.message === "Plant deleted successfully") {
        // If we don't get the user object back, manually update the user state
        const updatedUser = {
          ...user,
          plants: user.plants.filter(p => p._id !== plantId)
        };
        await updateUserData(updatedUser);
        return updatedUser;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    loginUser,
    logoutUser,
    refreshUser,
    updatePlant,
    deletePlant,
    registerUser,
    lastUpdate,
    updateUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};