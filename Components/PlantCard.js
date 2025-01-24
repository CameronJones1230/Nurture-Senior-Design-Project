import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useUser } from '../utils/UserContext'; // Import useUser hook

const PlantCard = ({ navigation, plant }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { deletePlant, refreshUser } = useUser(); // Add refreshUser

  const images = {
    'Monstera': require('../assets/monstera-leaf.png'),
    'Snake': require('../assets/snake-plant.png'),
    'ZZ': require('../assets/zz-plant.png'),
    'Rubber': require('../assets/rubber-plant.png'),
    'Pothos': require('../assets/pothos-plant.png'),
    'Spider': require('../assets/spider-plant.png'),
    'Peace Lily': require('../assets/peace-lily-plant.png'),
    'Fiddle Leaf Fig': require('../assets/fiddle-fig-plant.png'),
    'Aloe Vera': require('../assets/aloe-vera-plant.png'),
    'defaultplant': require('../assets/default plant 1.png'),
  };

  const imagePath = images[plant.species] || images['defaultplant'];

  const handleLongPress = () => {
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Plant",
      `Are you sure you want to delete ${plant.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlant(plant._id);
              await refreshUser(true); // Force refresh after deletion
              setShowOptions(false);
            } catch (error) {
              console.error('Error deleting plant:', error);
              Alert.alert('Error', 'Failed to delete plant. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleOptionSelect = (option) => {
    setShowOptions(false);
    switch (option) {
      case 'Edit':
        navigation.navigate('Create Plant', { plant }); // Changed from 'EditPlant'
        break;
      case 'Delete':
        handleDelete();
        break;
      default:
        break;
    }
};

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate('PlantDetail', { plant })}
        onLongPress={handleLongPress}
      >
        <View style={styles.plant_card_style}>
          <View style={styles.text_container}>
            <Text style={styles.plant_nickname}>{plant.name}</Text>
            <Text style={styles.plant_scientific_name}>{plant.species}</Text>
          </View>
          <View style={styles.icon_container}>
            <Image source={require('../assets/sun.png')} style={styles.icon} />
            <Image source={require('../assets/humidity.png')} style={styles.icon} />
            <Image source={require('../assets/soil.png')} style={styles.icon} />
          </View>
          <Image source={imagePath} style={styles.plant_picture} />
        </View>
      </TouchableOpacity>

      {/* Modal for Options */}
      <Modal
        transparent={true}
        visible={showOptions}
        animationType="fade"
        onRequestClose={handleCloseOptions}
      >
        <TouchableWithoutFeedback onPress={handleCloseOptions}>
          <View style={styles.modalOverlay}>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleOptionSelect('Edit')}
              >
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={ styles.deleteButton}
                onPress={() => handleOptionSelect('Delete')}
              >
                <Text style={[styles.optionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  text_container: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  plant_nickname: {
    fontSize: 18,
    fontFamily: 'Montserrat_Medium',
    color: '#000',
  },
  plant_scientific_name: {
    fontSize: 16,
    color: '#626262',
    fontFamily: 'Montserrat_Regular',
  },
  plant_picture: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
    marginLeft: 60,
    marginTop: 40,
    marginBottom: -10,
    marginRight: 0,
  },
  icon: {
    width: 30,
    height: 30,
    flexDirection: 'column',
    marginBottom: 12,
  },
  icon_container: {
    position: 'absolute',
    left: 15,
    marginTop: 75,
  },
  plant_card_style: {
    flexDirection: 'row',
    marginTop: 14,
    marginLeft: 14,
    height: 220,
    width: 175,
    borderRadius: 10,
    backgroundColor: '#84E69C',
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  deleteButton: {
    borderBottomWidth: 0, // Remove border from last button
  },
  deleteText: {
    color: '#fff', // Red color for delete option
  },
  optionsContainer: {
    width: '65%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },

  optionText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Montserrat_Regular',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
},
buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
},
editButton: {
  backgroundColor: '#84E69C',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 3 },
  marginBottom:25,
},
});
export default PlantCard;
