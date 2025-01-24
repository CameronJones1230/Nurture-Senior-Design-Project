import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const SensorGraph = ({ sensorData }) => {
    const screenWidth = Dimensions.get('window').width;

    // Function to preprocess and ensure exactly 24 data points
    const preprocessData = (data) => {
        if (
            !data ||
            !data.datasets ||
            !Array.isArray(data.datasets) ||
            data.datasets.length === 0 ||
            !data.labels
        ) {
            return null;
        }


        const dataset = data.datasets[0].data;

        // Ensure 24 data points, fill missing values with 0
        const filledData = Array.from({ length: 24 }, (_, index) => dataset[index] || 0);
    
        // Adjust labels to show every other timestamp
        const adjustedLabels = data.labels.map((label, index) => 
            index % 2 === 0 ? label : "" // Keep only every other label
        );
    
        return {
            ...data,
            labels: adjustedLabels, // Update labels
            datasets: [
                {
                    ...data.datasets[0],
                    data: filledData,
                },
            ],
        };
    }

    // Preprocess sensor data
    const processedData = preprocessData(sensorData);

    if (!processedData) {
        return (
            <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 20 }}>
                No Valid Sensor Data Available
            </Text>
        );
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollView}>
            <LineChart
                data={processedData}
                width={screenWidth * 2.5}
                height={230}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                yLabelsOffset={5}
                xLabelsOffset={0}
                withDots={true}
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 2,
                    strokeWidth: 3,
                    color: (opacity = 0.5) => `rgba(67, 227, 64, ${opacity})`,
                    labelColor: (opacity = 0.5) => `rgba(0, 0, 0, ${opacity})`,
                    fillShadowGradient: 'rgba(67, 227, 64, 0.5)',
                    style: {
                        borderRadius: 0,
                    },
                    propsForDots: {
                        r: "3",
                    },
                }}
                bezier
                style={styles.chart}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        marginVertical: 5,
    },
    chart: {
        marginLeft: -15,
    },
});

export default SensorGraph;
