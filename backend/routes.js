const express = require("express");
const router = express.Router();
const User = require("./User");
const mongoose = require("mongoose");
const util = require("util");

// Fetch all users with their plants populated
router.get("/user/users", async (req, res) => {
  try {
    const usersWithPlants = await User.find();
    console.log(
      util.inspect(usersWithPlants, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
    res.json(usersWithPlants);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server Error");
  }
});


router.get('/user/:plantId/sensor-settings/:sensorType', async (req, res) => {
  const { plantId, sensorType } = req.params;

  try {
    const user = await User.findOne({ 'plants._id': plantId }, { 'plants.$': 1 });
    if (!user) return res.status(404).send('Plant not found');

    const plant = user.plants[0];
    const sensorSetting = plant.sensorSettings.find(setting => setting.sensorType === sensorType);

    if (!sensorSetting) return res.status(404).send('Sensor settings not found');
    res.json(sensorSetting);
  } catch (error) {
    console.error('Error fetching sensor settings:', error);
    res.status(500).send('Internal server error');
  }
});


router.post('/user/:plantId/sensor-settings', async (req, res) => {
  const { plantId } = req.params;
  const { sensorType, min, max, hold } = req.body;

  try {
    // Update the specific sensor setting for the given plant
    const updateResult = await User.updateOne(
      { 'plants._id': plantId, 'plants.sensorSettings.sensorType': sensorType },
      {
        $set: {
          'plants.$.sensorSettings.$[elem].min': min,
          'plants.$.sensorSettings.$[elem].max': max,
          'plants.$.sensorSettings.$[elem].hold': hold,
        },
      },
      {
        arrayFilters: [{ 'elem.sensorType': sensorType }],
      }
    );

    // If no matching document is found, add a new sensor setting
    if (updateResult.matchedCount === 0) {
      await User.updateOne(
        { 'plants._id': plantId },
        {
          $push: {
            'plants.$.sensorSettings': { sensorType, min, max, hold },
          },
        }
      );
    }

    res.json({ message: 'Sensor settings updated successfully' });
  } catch (error) {
    console.error('Error updating sensor settings:', error);
    res.status(500).send('Internal server error');
  }
});


// Route to update username and password
router.put('/user/:userId/update', async (req, res) => {
    const { userId } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ error: 'No update fields provided.' });
    }

    try {
        // Find and update the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (username) user.username = username;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Route to add a single sensor data point with the current date
router.post(
  "/user/:userId/plant/:plantId/sensor-data/current",
  async (req, res) => {
    const { userId, plantId } = req.params;
    const newSensorData = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).send("User not found");

      const plant = user.plants.id(plantId);
      if (!plant) return res.status(404).send("Plant not found");

      // Filter out null values before adding
      const filteredSensorData = Object.fromEntries(
        Object.entries(newSensorData).filter(
          ([key, value]) => value !== null && value !== undefined
        )
      );

      // Add timestamp by default to current date/time if not provided
      plant.sensorData.push({
        timestamp: Date.now(),
        ...filteredSensorData,
      });

      await user.save();
      res.status(201).json(plant);
    } catch (error) {
      console.error("Error adding sensor data:", error);
      res.status(500).send("Server Error");
    }
  }
);



// Route to create a plant for a user
router.post("/user/:userId/plants", async (req, res) => {
  const { userId } = req.params;
  const { name, species, sensorData } = req.body; // Get name and species directly

  try {
    const user = await User.findById(userId); // Find the user by ID
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create a new plant with the provided name and species
    const newPlant = {
      name: name,
      species: species,
      image: "defaultplant",
      sensorData: sensorData || [], // Default to an empty array if not provided
    };

    // Add the new plant to the user's plants array
    user.plants.push(newPlant);

    await user.save(); // Save the user with the new plant

    // Send back the created plant details with a 201 status
    res.status(201).json(newPlant);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding plant", error: error.message });
  }
});


// Route to receive sensor data for a plant
router.post("/user/:userId/plant/:plantId/sensor-data", async (req, res) => {
  const { userId, plantId } = req.params;
  const newSensorData = req.body.sensorData; // Ensure this matches the expected structure

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const plant = user.plants.id(plantId);
    if (!plant) return res.status(404).send("Plant not found");

    console.log("Before adding new sensor data:", plant);
    console.log("New Sensor Data:", newSensorData);

    plant.sensorData.push(newSensorData);
    await user.save();

    console.log("After adding new sensor data:", plant);

    res.status(201).json(plant);
  } catch (error) {
    console.error("Error adding sensor data:", error);
    res.status(500).send("Server Error");
  }
});



// Fetch a user with their plants populated
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a user by ID http://localhost:3000/user/66158829292ad7c66325c8b7
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user exists, delete it
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
});

// Register a new user
router.post("/user/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        user = new User({ username, password });
        await user.save();

        // Send the user with the password back in the response
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
        console.error(error);
    }
});


// Login user
router.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username }).populate("plants");
    if (!user) {
      return res.status(400).send("Invalid Credentials");
    }
    // Compare the provided password with the stored password (stored in plain text)
    if (user.password !== password) {
      return res.status(400).send("Invalid Credentials");
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send("Server error");
    console.error(error);
  }
});

// give a user random sensor data
router.post(
  "/user/:userId/plant/:plantId/add-generated-sensor-data",
  async (req, res) => {
    const { userId, plantId } = req.params;

    // Generate 24 hours of data with 30-minute intervals
    const newSensorData = generate30MinuteSensorData();

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const plant = user.plants.id(plantId);
      if (!plant) {
        return res.status(404).send("Plant not found");
      }

      // Add generated data to the plant's sensorData array
      plant.sensorData.push(...newSensorData); // Use spread operator to merge arrays
      await user.save();

      res
        .status(201)
        .json({ message: "Sensor data added successfully", plant });
    } catch (error) {
      console.error("Error adding sensor data:", error);
      res.status(500).send("Server Error");
    }
  }
);

function generate30MinuteSensorData() {
  const sensorData = [];
  const baseTime = new Date(); // Start from the current day
  baseTime.setHours(0, 0, 0, 0); // Set time to 00:00:00

  for (let i = 0; i < 48; i++) { // 48 intervals for 30 minutes over 24 hours
    const timestamp = new Date(baseTime.getTime() + i * 30 * 60 * 1000).toISOString();
    sensorData.push({
      timestamp: timestamp,
      moisture: Math.floor(Math.random() * 11) + 40, // Random moisture between 40 and 50
      nitrogen: Math.floor(Math.random() * 6) + 15, // Random nitrogen between 15 and 20
      phosphorus: Math.floor(Math.random() * 6) + 5, // Random phosphorus between 5 and 10
      potassium: Math.floor(Math.random() * 6) + 25, // Random potassium between 25 and 30
      temperature: Math.floor(Math.random() * 6) + 20, // Random temperature between 20 and 25
      ph: (Math.random() * (8 - 5) + 5).toFixed(1), // Random pH between 5.0 and 8.0
      par: Math.floor(Math.random() * 1000) + 500, // Random PAR between 500 and 1500
      ec: (Math.random() * 5).toFixed(2), // Random EC between 0.00 and 5.00
    });
  }

  return sensorData;
}



// DELETE a user's plant by user ID and plant ID
router.delete("/user/:userId/plant/:plantId", async (req, res) => {
  const { userId, plantId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the plant to be deleted
    user.plants = user.plants.filter(
      (plant) => plant._id.toString() !== plantId
    );

    await user.save();

    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res
      .status(500)
      .json({ message: "Failed to delete plant", error: error.message });
  }
});

// DELETE all sensor data from a plant by user ID and plant ID
router.delete("/user/:userId/plant/:plantId/sensorData", async (req, res) => {
  const { userId, plantId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the plant from the user's plants list
    const plant = user.plants.id(plantId);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // Clear the sensor data array
    plant.sensorData = [];
    
    //plant.sensorSettings = [];

    // Save the updated user document
    await user.save();
    res.json({ message: "All sensor data deleted successfully for plant" });
  } catch (error) {
    console.error("Error deleting sensor data:", error);
    res
      .status(500)
      .json({ message: "Failed to delete sensor data", error: error.message });
  }
});

// DELETE a user's plant by user ID and plant ID
router.delete("/user/:userId/plant/:plantId", async (req, res) => {
  const { userId, plantId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the plant to be deleted
    user.plants = user.plants.filter(
      (plant) => plant._id.toString() !== plantId
    );

    await user.save();

    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res
      .status(500)
      .json({ message: "Failed to delete plant", error: error.message });
  }
});

module.exports = router;
