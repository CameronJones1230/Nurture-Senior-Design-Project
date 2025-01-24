import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import calendarImage from '../assets/calendar.png'; 

const CalendarComponent = ({ onDateSelected  }) => {
    const [date, setDate] = useState(new Date());


    const onChange = (event, selectedDate) => {
        //console.log('Received date from picker:', selectedDate);
        const currentDate = selectedDate || date;
        //onsole.log('Resolved currentDate:', currentDate);
        setDate(currentDate);
        if (onDateSelected) {
            onDateSelected(currentDate);
        }
        console.log('Date picked:', currentDate);
    };


    return (
        <View style={styles.container}>
            <Image source={calendarImage} style={styles.calendarImage} />
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                style={styles.transparentPicker}
            />
                
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: 50,
        height: 50,
    },
    transparentPicker: {
        width: '100%',
        height: '100%',
        opacity: 0.011,
        position: 'absolute',
    },
    calendarImage: {
        position: 'absolute',
        backgroundColor: 'white',
        width: 40,
        height: 40,
    },
});

export default CalendarComponent;