from pymongo import MongoClient
from bson import ObjectId 
import requests

# MongoDB setup
client = MongoClient('mongodb+srv://user:Nurture@nurture.9lc0wop.mongodb.net/')
db = client.test
users_collection = db.users

def get_user_id_by_username(username):
    user = users_collection.find_one({"username": username})
    if user:
        print(f"User ID for {username} is {user['_id']}")
        return str(user['_id'])
    else:
        print(f"No user found with username: {username}")
        return None

# Sample usage
username = "H"
user_id = get_user_id_by_username(username)
if user_id:
    print("The user ID for {username} is {user_id}")
else:
    print("User not found.")

# Function to add a plant to a user
def add_plant_to_user(user_id, plant_data):
    user_id = ObjectId(user_id)  # Convert user_id string to ObjectId
    user = users_collection.find_one({"_id": user_id})
    if not user:
        print("User not found")
        return False
    
    if "sensorData" in plant_data:
        plant_data["sensorData"] = [plant_data["sensorData"]]
    
    if "plants" not in user:
        user["plants"] = []
    
    user["plants"].append(plant_data)
    users_collection.update_one({"_id": user_id}, {"$set": {"plants": user["plants"]}})
    print("Plant added successfully")
    return True


# Example usage
plant_data = {
  "plantData": {
    "name": "Python Test",
    "species": "Monstera",
  }
}

add_plant_to_user('66270ef73eb4bdc332d1640c', plant_data)

# Fetch all users
def fetch_all_users():
    users = list(users_collection.find({}))
    for user in users:
        print(user)

fetch_all_users()
