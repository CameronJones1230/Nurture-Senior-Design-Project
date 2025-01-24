import React, { createContext, useState, useEffect } from 'react';
const moment = require('moment-timezone');


const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
    const [sensorData, setSensorData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });
    const [selectedSensor, setSelectedSensor] = useState('temperature');


    const updateSensorData = (plantSensorData, sensorType, selectedDate) => {
        if (!plantSensorData || !Array.isArray(plantSensorData)) {
            console.error("Invalid plant sensor data");
            return;
        }
    
        // Adjust to find the exact start and end of the selected date in UTC
        const startOfDay = moment.utc(selectedDate).startOf('day');
        const endOfDay = moment.utc(selectedDate).endOf('day');

        // Log the range being searched for debugging
        console.log(`Filtering data from ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

        // Filter sensor data for the entire day
        const filteredData = plantSensorData.filter(data => {
            const dataTime = moment.utc(data.timestamp);
            return dataTime.isBetween(startOfDay, endOfDay, null, '[]'); // Including both start and end times
        });

        // Debugging log for filtered data count
        console.log(`Filtered data count: ${filteredData.length}`);

        // If no data is found, clear sensor data to avoid displaying stale data
        if (filteredData.length === 0) {
            setSensorData({ labels: [], datasets: [{ data: [] }] });
            return;
        }

        // Sort data by timestamp using UTC
        filteredData.sort((a, b) => moment.utc(a.timestamp).diff(moment.utc(b.timestamp)));

        // Format the timestamps for the graph labels
        const labels = filteredData.map(data => moment.utc(data.timestamp).format('HH:mm'));
        const dataPoints = filteredData.map(data => data[sensorType]);

        // Update state with the new sensor data
        setSensorData({
            labels,
            datasets: [{ data: dataPoints }]
        });
    };




    return (
        <SensorContext.Provider value={{ sensorData, selectedSensor, setSelectedSensor, updateSensorData }}>
            {children}
        </SensorContext.Provider>
    );
};

export default SensorContext;