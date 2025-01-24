import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import ipAddress from "../utils/config";

const PlantDetailSensorCard = ({
  icon,
  metricLabel,
  value,
  unit,
  color,
  onSelectSensor,
  plantId,
  sensorType,
  isSelected,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [holdValue, setHoldValue] = useState("");
  const [showLearnMore, setShowLearnMore] = useState(false);

  const fetchSensorSettings = async () => {
    try {
      const response = await fetch(
        `${ipAddress}/user/${plantId}/sensor-settings/${sensorType}`
      );
      //if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      setMinValue(data.min !== -1 ? String(data.min) : "");
      setMaxValue(data.max !== -1 ? String(data.max) : "");
      setHoldValue(data.hold !== -1 ? String(data.hold) : "");
    } catch (error) {
      //console.error('Error fetching sensor settings:', error);
    }
  };

  const handleSave = async () => {
    const payload = {
      sensorType, // Use the provided sensorType directly
      min: minValue ? parseFloat(minValue) : -1,
      max: maxValue ? parseFloat(maxValue) : -1,
      hold: holdValue ? parseFloat(holdValue) : -1,
    };

    try {
      const response = await fetch(
        `${ipAddress}/user/${plantId}/sensor-settings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to save settings");
      console.log("Settings saved:", payload);
      setShowOptions(false);
    } catch (error) {
      console.error("Error saving sensor settings:", error);
    }
  };

  useEffect(() => {
    if (showOptions) fetchSensorSettings();
  }, [showOptions]);

  return (
    <>
      <TouchableOpacity
        style={[
          PlantDetailSensorCardStyles.card,
          { backgroundColor: color },
          isSelected && PlantDetailSensorCardStyles.selectedCard, // Add highlight when selected
        ]}
        onPress={onSelectSensor}
        onLongPress={() => setShowOptions(true)}
      >
        <View style={PlantDetailSensorCardStyles.topSection}>
          <Image source={icon} style={PlantDetailSensorCardStyles.icon} />
          <Text style={PlantDetailSensorCardStyles.metricLabel}>
            {metricLabel}
          </Text>
        </View>
        <View style={PlantDetailSensorCardStyles.bottomSection}>
          <Text style={PlantDetailSensorCardStyles.value}>{value}</Text>
          <Text style={PlantDetailSensorCardStyles.unit}>{unit}</Text>
        </View>
      </TouchableOpacity>

      {showOptions && (
        <Modal
          transparent
          visible={showOptions}
          animationType="fade"
          onRequestClose={() => setShowOptions(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
            <View style={styles.modalOverlay}>
              <View
                style={[styles.optionsContainer, { backgroundColor: "#fff" }]}
              >
                <Text style={styles.optionTitle}>Set {metricLabel} Limits</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="Min"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={minValue}
                    onChangeText={setMinValue}
                  />
                  <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="Max"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={maxValue}
                    onChangeText={setMaxValue}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Hold"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={holdValue}
                  onChangeText={setHoldValue}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.customButton, { backgroundColor: color }]}
                    onPress={handleSave}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.customButton, { backgroundColor: color }]}
                    onPress={() => setShowOptions(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setShowLearnMore(true)}
                  style={styles.learnMoreButton}
                >
                  <Text style={styles.learnMoreText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      <Modal
        transparent
        visible={showLearnMore}
        animationType="fade"
        onRequestClose={() => setShowLearnMore(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowLearnMore(false)}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>

          <View style={[styles.optionsContainer, { backgroundColor: "#fff" }]}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.learnMoreTitle}>
                {sensorEducationalContent[sensorType]?.title}
              </Text>
              <Text style={styles.learnMoreDescription}>
                {sensorEducationalContent[sensorType]?.description}
              </Text>
              <Text style={styles.learnMoreSubtitle}>
                Notification Settings
              </Text>
              <Text style={styles.learnMoreSettings}>
                {sensorEducationalContent[sensorType]?.settings}
              </Text>
              <Text style={styles.learnMoreSubtitle}>Optimal Range</Text>
              <Text style={styles.learnMoreOptimalRange}>
                {sensorEducationalContent[sensorType]?.optimalRange}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.customButton, { backgroundColor: color }]}
              onPress={() => setShowLearnMore(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const PlantDetailSensorCardStyles = StyleSheet.create({
  // card: {
  //   borderRadius: 20,
  //   padding: 14,
  //   width: 110,
  //   height: 110,
  // },
  card: {
    borderRadius: 20,
    padding: 14,
    width: 110,
    height: 110,
    borderWidth: 2, // Add border width
    borderColor: "transparent", // Make border transparent by default
  },
  selectedCard: {
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: -10,
  },
  metricLabel: {
    fontSize: 20,
    marginLeft: 5,
    fontFamily: "Montserrat_Regular",
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 12,
  },
  value: {
    fontSize: 24,
    fontFamily: "Montserrat_Medium",
  },
  unit: {
    fontSize: 14,
    marginTop: 0,
    marginLeft: 4,
    fontFamily: "Montserrat_Regular",
  },
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
  inputHalf: {
    width: "48%",
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  customButton: {
    width: 90,
    height: 50,
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  learnMoreButton: {
    marginTop: 10,
    alignItems: "center",
  },
  learnMoreText: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  learnMoreTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  learnMoreSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  learnMoreDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
  },
  learnMoreSettings: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 400,
    marginBottom: 15,
  },
  learnMoreTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  learnMoreSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#444",
  },
  learnMoreDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
    color: "#555",
  },
  learnMoreSettings: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: "#555",
  },
  learnMoreOptimalRange: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: "italic",
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionsContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    maxHeight: "70%", // Limit height on smaller screens
  },
  scrollView: {
    maxHeight: "90%",
    marginBottom: 15,
  },
});
const sensorEducationalContent = {
  moisture: {
    title: "Soil Moisture Management",
    description:
      "Soil moisture is crucial for nutrient uptake and overall plant health. Water in soil helps dissolve nutrients, making them accessible to plant roots. Both too little and too much water can harm your plants.",
    settings:
      "Customize your moisture alerts:\n\n" +
      "• Min: Get notified when soil is too dry and plants risk dehydration\n" +
      "• Max: Receive alerts when soil is oversaturated, which can lead to root rot\n" +
      "• Hold: Target moisture level for automated watering system activation",
    optimalRange:
      "Optimal range varies by plant species, but generally 40-60% moisture content is ideal for most plants.",
  },
  par: {
    title: "Photosynthetically Active Radiation (PAR)",
    description:
      "PAR measures the light spectrum (400-700nm) that plants use for photosynthesis. This is crucial for plant growth, flowering, and fruit production. PAR readings help ensure your plants receive optimal light for photosynthesis.",
    settings:
      "Monitor light levels effectively:\n\n" +
      "• Min: Alerts when light levels drop below plant requirements\n" +
      "• Max: Warns of potential light stress or burning\n" +
      "• Hold: Target PAR level for automated grow light adjustment",
    optimalRange:
      "Most plants thrive between 100-1000 µmol/m²/s, depending on species and growth stage.",
  },
  ph: {
    title: "pH Level Monitoring",
    description:
      "pH affects nutrient availability in soil. Different nutrients are more or less available at different pH levels. Maintaining proper pH ensures your plants can access the nutrients they need.",
    settings:
      "Keep pH balanced:\n\n" +
      "• Min: Get alerts when pH becomes too acidic\n" +
      "• Max: Notifications when pH becomes too alkaline\n" +
      "• Hold: Target pH for automated pH adjustment systems",
    optimalRange:
      "Most plants prefer pH between 6.0-7.0, with some species having specific requirements.",
  },
  phosphorus: {
    title: "Phosphorus (P) Levels",
    description:
      "Phosphorus is essential for energy transfer, photosynthesis, and root development. It's particularly important during flowering and fruiting stages.",
    settings:
      "Monitor phosphorus levels:\n\n" +
      "• Min: Alerts for phosphorus deficiency risks\n" +
      "• Max: Warnings about excess phosphorus\n" +
      "• Hold: Target level for automated fertilizer systems",
    optimalRange:
      "Optimal ranges vary by plant, but maintaining 20-50 ppm is typical for most plants.",
  },
  potassium: {
    title: "Potassium (K) Management",
    description:
      "Potassium regulates water uptake, helps with disease resistance, and is crucial for fruit quality. It's essential for overall plant strength and health.",
    settings:
      "Track potassium levels:\n\n" +
      "• Min: Notifications for potassium deficiency\n" +
      "• Max: Alerts for excessive potassium\n" +
      "• Hold: Target level for automated nutrient dosing",
    optimalRange:
      "Most plants need 100-300 ppm of potassium for optimal growth.",
  },
  electricalConductivity: {
    title: "Electrical Conductivity (EC)",
    description:
      "EC measures the total dissolved salts in soil or water, indicating overall nutrient concentration. It's crucial for preventing nutrient burn or deficiency.",
    settings:
      "Monitor nutrient concentration:\n\n" +
      "• Min: Alerts for insufficient nutrient levels\n" +
      "• Max: Warnings about dangerous salt buildup\n" +
      "• Hold: Target EC for automated nutrient management",
    optimalRange:
      "Most plants prefer EC between 0.8-2.0 mS/cm, varying by growth stage.",
  },
  nitrogen: {
    title: "Nitrogen (N) Levels",
    description:
      "Nitrogen is essential for leaf growth and chlorophyll production. It's key for vegetative growth and overall plant vigor. Proper nitrogen levels ensure healthy, green foliage.",
    settings:
      "Track nitrogen levels:\n\n" +
      "• Min: Get alerts for nitrogen deficiency\n" +
      "• Max: Notifications about excess nitrogen\n" +
      "• Hold: Target level for automated fertilizer systems",
    optimalRange:
      "Most plants thrive with nitrogen levels between 100-200 ppm.",
  },
  temperature: {
    title: "Temperature Management",
    description:
      "Temperature affects growth rate, nutrient uptake, and overall plant metabolism. Both too high and too low temperatures can stress plants and affect their development.",
    settings:
      "Monitor temperature effectively:\n\n" +
      "• Min: Alerts when temperature drops too low\n" +
      "• Max: Warnings about dangerous heat levels\n" +
      "• Hold: Target temperature for climate control systems",
    optimalRange:
      "Most plants prefer temperatures between 65-80°F (18-27°C), with specific requirements varying by species.",
  },
};
export default PlantDetailSensorCard;
