import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import sunImage from '../assets/sun.png';
import humidityImage from '../assets/humidity.png';
import cloudyImage from '../assets/cloudy.png';
import overcastImage from '../assets/overcast.png';

const weatherIcons = {
    "Partly sunny": sunImage,
    "Mostly cloudy": cloudyImage,
    "Cloudy": overcastImage,
    "Overcast": overcastImage,
    "Clear": sunImage,
};
//IlV9kZIUq1ssJbErOBO3eAMZDNKaLWh8
//mzAx37KgKIMn7L40JfspE6YQQPuySvDd
//`http://dataservice.accuweather.com/currentconditions/v1/260820?apikey=mzAx37KgKIMn7L40JfspE6YQQPuySvDd&details=true`
const WeatherComponent = () => {
    const [currentTemperature, setCurrentTemperature] = useState({
        value: null,
        uvIndex: null,
        humidity: null,
        description: "",
    });
    const { value, uvIndex, humidity, description } = currentTemperature;
    const weatherIcon = weatherIcons[description] || sunImage; // Default icon if no specific match

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                const apiKey = "mzAx37KgKIMn7L40JfspE6YQQPuySvDd";
                const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${latitude},${longitude}`;
                const locationResponse = await axios.get(locationUrl);
                const locationKey = locationResponse.data.Key;

                const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`;
                const weatherResponse = await axios.get(weatherUrl);

                const weatherData = weatherResponse.data[0];
                setCurrentTemperature({
                    value: weatherData?.Temperature?.Imperial?.Value,
                    uvIndex: weatherData?.UVIndex,
                    humidity: weatherData?.RelativeHumidity,
                    description: weatherData?.WeatherText,
                });
            } catch (error) {
                console.error("Error fetching location or weather data:", error);
            }
        };

        fetchLocationAndWeather();
    }, []);

    return (
        <View style={styles.weather_background}>
            <View style={styles.temperature_section}>
                <Text style={styles.temperature}>
                    {currentTemperature.value ? `${currentTemperature.value}°` : '...'}
                    <Text style={styles.temperature_unit}>F</Text>
                </Text>
                <Text style={styles.weather_description}>
                    {currentTemperature.description || 'Loading'}
                </Text>
            </View>
    
            <View style={styles.weather_foreground}>
                <Image source={sunImage} style={styles.uvIcon} />
                <Text style={styles.weather_font}>UV Index</Text>
                <Text style={styles.weather_data}>{currentTemperature.uvIndex != null ? currentTemperature.uvIndex : '...'}</Text>
            </View>
    
            <View style={styles.weather_foreground}>
                <Image source={humidityImage} style={styles.humidityIcon} />
                <Text style={styles.weather_font}>Humidity</Text>
                <Text style={styles.humidity_data}>
                    {currentTemperature.humidity ? `${currentTemperature.humidity}%` : '...'}
                    <Text style={{ fontSize: 14, fontWeight: '400' }}></Text>
                </Text>
            </View>
    
            <Image source={weatherIcons[currentTemperature.description] || sunImage} style={styles.weather_icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    weather_background: {
        bottom: 0,
        top: 15,
        height: 110,
        backgroundColor: '#D8E1FF',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 12,
        marginLeft: 20,
        marginRight: 20,
    },
    temperature_section: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    temperature: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_Medium',
    },
    temperature_unit: {
        fontSize: 14,
        fontWeight: '400',
    },
    weather_description: {
        fontSize: 16,
        fontFamily: 'Montserrat_Medium',
        marginTop: 5,
        width: 60,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weather_foreground: {
        backgroundColor: '#8FB3EA',
        borderRadius: 10,
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon_image: {
        width: 30,
        height: 30,
    },
    weather_font: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
    },
    weather_data: {
        fontSize: 18,
        fontFamily: 'Montserrat_Medium',
    },
    humidity_data: {
        alignSelf: 'center',
        marginLeft: 12,
        fontSize: 18,
        fontFamily: 'Montserrat_Medium',
    },
    weather_icon: {
        marginTop: -20,
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    uvIcon: {
        alignSelf: 'center',
        width: 24,
        height: 24,
    },
    humidityIcon: {
        alignSelf: 'center',
        width: 30,
        height: 30,
    },
});

export default WeatherComponent;
