import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Modal, Alert, TouchableWithoutFeedback,TextInput } from 'react-native';

import axios from 'axios';
import ipAddress from '../utils/config';

import FractionText from '../Components/FractionText';
import PlantDetailSensorCard from '../Components/PlantDetailSensorCard';
import Calendar from '../Components/CalendarComponent';
import SensorGraph from '../Components/SensorGraph';
import moisture_png from '../assets/humidity.png';
import PAR_png from '../assets/sun.png';
import potassium_png from '../assets/potassium.png';
import nitrogen_png from '../assets/nitrogen.png';
import phosphorus_png from '../assets/phosphorus.png';
import temperature_png from '../assets/thermometer.png';
import SensorActionBar from '../Components/SensorActionBar'
import SensorContext from '../utils/SensorContext';
import defimage from '../assets/default plant 1.png';
import ec from '../assets/ec.png';
import ph from '../assets/ph-icon.png';

const moistureColor = '#D9F5FF';
const tempColor = '#FFEFEC';
const parColor = '#FBFFCA';
const nitrogenColor = '#FFD7CC';
const phosphorusColor = '#F5DBBC';
const potassiumColor = '#ffc7e3';
const phColor = '#B9E4C9';
const ecColor = '#D3DDE8';

const images = {
    'defaultplant': require('../assets/default plant 1.png'),
    'Monstera': require('../assets/monstera-leaf.png'),
    'Snake': require('../assets/snake-plant.png'),
    'ZZ': require('../assets/zz-plant.png'),
    'Rubber': require('../assets/rubber-plant.png'),
    'Pothos': require('../assets/pothos-plant.png'),
    'ZZ': require('../assets/zz-plant.png'),
    'Spider': require('../assets/spider-plant.png'),
    'Peace Lily': require('../assets/peace-lily-plant.png'),
    'Fiddle Leaf Fig': require('../assets/fiddle-fig-plant.png'),
    'Aloe Vera': require('../assets/aloe-vera-plant.png'),
};

const PlantDetailScreen = ({ route }) => {
    const { plant } = route.params;
    const { sensorData, selectedSensor, setSelectedSensor, updateSensorData } = useContext(SensorContext);
    const [latestReadings, setLatestReadings] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const imagePath = plant.species ? images[plant.species] : images['defaultplant'];

    useEffect(() => {
        console.log("Plant data on mount:", plant);
        if (plant && plant.sensorData && plant.sensorData.length > 0) {
            const sortedSensorData = plant.sensorData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setLatestReadings(sortedSensorData[0]);
            updateSensorData(plant.sensorData, selectedSensor, selectedDate);
        } else {
            //Alert.alert("No data for selected sensor");

        }

    }, [selectedSensor, selectedDate]);

    const handleDateSelected = (date) => {
        setSelectedDate(date);
    };


    const handleCardPress = (sensorType) => {
        setSelectedSensor(sensorType);
    };

    return (
        <View style={styles.background}>
        <View style={styles.headerContainer}>

            <View style={styles.textContainer}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantSpecies}>{plant.species}</Text>
            </View>
            <Image source={imagePath} style={styles.defaultImage} />
        </View>

        <View style={styles.container}>
                <View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={moisture_png}
                            metricLabel="Moist"
                            value={latestReadings && latestReadings.moisture !== undefined ? latestReadings.moisture : ''}
                            unit="%RH"
                            color={moistureColor}
                            onSelectSensor={() => handleCardPress('moisture')}
                            plantId={plant._id}
                            sensorType="moisture"
                            isSelected={selectedSensor === 'moisture'}
                        />
                    </View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={temperature_png}
                            metricLabel="Temp"
                            value={latestReadings && latestReadings.temperature !== undefined ? latestReadings.temperature : ''}
                            unit="°C"
                            color={tempColor}
                            onSelectSensor={() => handleCardPress('temperature')}
                            plantId={plant._id}
                            sensorType="temperature"
                            isSelected={selectedSensor === 'temperature'}
                        />
                    </View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={ec}
                            metricLabel="EC"
                            value={latestReadings && latestReadings.ec !== undefined ? latestReadings.ec : ''}
                            unit={<FractionText topText="µS/" bottomText="cm" fontSize={14} color="#000"  />}
                            color={ecColor}
                            onSelectSensor={() => handleCardPress('ec')}
                            plantId={plant._id}
                            sensorType="ec"
                            isSelected={selectedSensor === 'ec'}
                        />
                    </View>
                </View>
                <View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={nitrogen_png}
                            metricLabel="Ntg"
                            value={latestReadings && latestReadings.nitrogen !== undefined ? latestReadings.nitrogen : ''}
                            unit={<FractionText topText="mg/" bottomText="Kg" fontSize={14} color="#000"  />}
                            color={nitrogenColor}
                            onSelectSensor={() => handleCardPress('nitrogen')}
                            plantId={plant._id}
                            sensorType="nitrogen"
                            isSelected={selectedSensor === 'nitrogen'}
                        />
                    </View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={phosphorus_png}
                            metricLabel="Phos"
                            value={latestReadings && latestReadings.phosphorus !== undefined ? latestReadings.phosphorus : ''}
                            unit={<FractionText topText="mg/" bottomText="Kg" fontSize={14} color="#000"  />}
                            color={phosphorusColor}
                            onSelectSensor={() => handleCardPress('phosphorus')}
                            plantId={plant._id}
                            sensorType="phosphorus"
                            isSelected={selectedSensor === 'phosphorus'}
                        />
                    </View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={potassium_png}
                            metricLabel="Pot"
                            value={latestReadings && latestReadings.potassium !== undefined ? latestReadings.potassium : ''}
                            unit={<FractionText topText="mg/" bottomText="Kg" fontSize={14} color="#000"  />}
                            color={potassiumColor}
                            onSelectSensor={() => handleCardPress('potassium')}
                            plantId={plant._id}
                            sensorType="potassium"
                            isSelected={selectedSensor === 'potassium'}
                        />
                    </View>
                </View>

                <View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={PAR_png}
                            metricLabel="PAR"
                            value={latestReadings && latestReadings.par !== undefined ? latestReadings.par : ''}
                            unit={<FractionText topText="μmol" bottomText="m²s" fontSize={14} color="#000"  />}
                            color={parColor}
                            onSelectSensor={() => handleCardPress('par')}
                            plantId={plant._id}
                            sensorType="par"
                            isSelected={selectedSensor === 'par'}
                        />
                    </View>
                    <View style={styles.card}>
                        <PlantDetailSensorCard
                            icon={ph}
                            metricLabel="pH"
                            value={latestReadings && latestReadings.ph !== undefined ? latestReadings.ph : ''}
                            unit=""
                            color={phColor}
                            onSelectSensor={() => handleCardPress('ph')}
                            plantId={plant._id}
                            sensorType="ph"
                            isSelected={selectedSensor === 'ph'}
                        />
                    </View>

                </View>

            </View>


            <View style={styles.calendarStyle} >
                <Calendar onDateSelected={handleDateSelected} />
            </View>



            <View style={styles.graphBoarder}>
                <SensorGraph sensorData={sensorData} />
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    calendarStyle: {
        position: 'absolute',
        bottom: 290,
        right: 55,
    },
    container: {
        flexDirection: 'row',
        marginTop: 7,
        padding: 10,
    },
    background: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    column: {
        flexDirection: 'column',
    },
    card: {
        padding: 4,
    },

    plantName: {
        fontSize: 40,
        marginTop: 20,
        marginLeft: 15,
        fontFamily: 'Montserrat_Medium',
    },
    plantSpecies: {
        fontSize: 20,
        marginTop: 0,
        marginLeft: 15,
        color: '#626262',
        fontFamily: 'Montserrat_Regular',
    },
    graphBoarder: {
        padding: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    textContainer: {
        flex: 0, // Allows the text to take up as much space as needed
        paddingLeft: 5, // Adds some space between the text and the image
    },
    defaultImage: {
        width: 80, // Adjust the width as needed
        height: 80, // Adjust the height as needed
        resizeMode: 'contain', // Ensures the image scales correctly
        alignSelf: 'center',
        padding: 0,
        marginTop: 15,
    },
    
    // defaultImage: {
    //     flex: 1,
    //     width: undefined,
    //     height: undefined,
    //     resizeMode: 'contain',
    //     marginLeft: 0,
    //     marginTop: 0,
    //     marginBottom: -100,
    //     marginRight: -20,
    // },
});

export default PlantDetailScreen;


