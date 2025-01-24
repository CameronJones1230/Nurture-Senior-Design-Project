import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../utils/UserContext';

const CreatePlantScreen = ({ navigation, route }) => {
    const { updatePlant } = useUser();
    const [nickname, setNickname] = useState('');
    const [species, setSpecies] = useState('Monstera');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [plantId, setPlantId] = useState(null);

    // Mapping species to their respective images
    const images = {
        'defaultplant': require('../assets/default plant 1.png'),
        'Monstera': require('../assets/monstera-leaf.png'),
        'Snake': require('../assets/snake-plant.png'),
        'ZZ': require('../assets/zz-plant.png'),
        'Rubber': require('../assets/rubber-plant.png'),
        'Pothos': require('../assets/pothos-plant.png'),
        'Spider': require('../assets/spider-plant.png'),
        'Peace Lily': require('../assets/peace-lily-plant.png'),
        'Fiddle Leaf Fig': require('../assets/fiddle-fig-plant.png'),
        'Aloe Vera': require('../assets/aloe-vera-plant.png'),
    };

    const speciesOptions = Object.keys(images);

    // Check if we're in edit mode and set initial values
    useEffect(() => {
        if (route.params?.plant) {
            const { plant } = route.params;
            setIsEditMode(true);
            setNickname(plant.name);
            setSpecies(plant.species);
            setPlantId(plant._id);
        }
    }, [route.params]);

    const handleSubmit = async () => {
        if (!nickname || !species) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }
    
        const plantData = {
            name: nickname,
            species: species,
            image: species,
            sensorData: [], // Add empty sensorData array
        };
    
        if (isEditMode) {
            plantData._id = plantId;
        }
    
        setIsLoading(true);
    
        try {
            await updatePlant(plantData, !isEditMode);
            Alert.alert(
                "Success", 
                isEditMode ? "Plant updated successfully!" : "Plant added successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.error('Error:', error);
            Alert.alert(
                "Error", 
                isEditMode ? "Failed to update plant." : "Failed to add plant."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image 
                    source={images[species]} 
                    style={styles.plantIcon} 
                />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter plant nickname"
                value={nickname}
                onChangeText={setNickname}
            />

            <Picker
                selectedValue={species}
                onValueChange={(itemValue) => setSpecies(itemValue)}
                style={styles.picker}>
                {speciesOptions.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))}
            </Picker>

            <View style={styles.create_container}>
                <TouchableOpacity
                    style={styles.create_button}
                    onPress={handleSubmit}
                    disabled={isLoading}>
                    <Text style={styles.create_text}>
                        {isEditMode ? 'Update Plant' : 'Create Plant'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFF',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    plantIcon: {
        width: 100,  // Size of the plant icon
        height: 100, // Size of the plant icon
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        alignSelf: 'center',
    },
    picker: {
        height: 50,
        marginBottom: 0,
        width: 200,
        alignSelf: 'center',
    },
    create_button: {
        padding: 10,
        width: 200,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00C134',
        alignItems: 'center',
    },
    create_text: {
        color: '#00C134',
        fontSize: 18,
        fontWeight: 'bold',
    },
    create_container: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 80,
    },
});

export default CreatePlantScreen;
