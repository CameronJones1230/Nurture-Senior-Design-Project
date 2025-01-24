import React, { useState, useEffect, useContext } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SensorContext from '../utils/SensorContext';

const SensorActionBar = () => {
  const { setSelectedSensor, selectedSensor } = useContext(SensorContext);

  const handleSelectSensor = (sensorType) => {
    console.log('Selecting sensor:', sensorType);

    setSelectedSensor(sensorType);
    //onSelectSensor(sensorType);
  };
  console.log('Current selected sensor:', selectedSensor);


  return (
    <View style={styles.bar}>
      <CustomButton
        title="Moist"
        onPress={() => handleSelectSensor('moisture')}
        isSelected={selectedSensor === 'moisture'}
      />
      <CustomButton
        title="Temp"
        onPress={() => handleSelectSensor('temperature')}
        isSelected={selectedSensor === 'temperature'}
      />
      <CustomButton
        title="Ntg"
        onPress={() => handleSelectSensor('nitrogen')}
        isSelected={selectedSensor === 'nitrogen'}
      />
      <CustomButton
        title="Phos"
        onPress={() => handleSelectSensor('phosphorus')}
        isSelected={selectedSensor === 'phosphorus'}
      />
      <CustomButton
        title="Pot"
        onPress={() => handleSelectSensor('potassium')}
        isSelected={selectedSensor === 'potassium'}
      />
    </View>
  );
};

const CustomButton = ({ title, onPress, isSelected }) => {
  return (

    <TouchableOpacity
      onPress={onPress}
      style={isSelected ? styles.selectedButtonContainer : styles.buttonContainer}
    >
      <View style={styles.textContainer}>
        <Text style={styles.buttonText}>
          {title}
        </Text>
      </View>
      {isSelected && <View style={styles.overlay} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    fontFamily: 'Montserrat_Bold',

  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',  // Ensures vertical centering
    alignItems: 'center',  
    height: 40,
    width: 60,    // Ensures horizontal centering
  },
  selectedButtonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    height: 40,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',

  },
  textContainer: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_Medium',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(200, 295, 206, 0.6)',
    borderRadius: 10,
  },
});

export default SensorActionBar;