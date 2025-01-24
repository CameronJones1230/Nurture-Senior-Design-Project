import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const NavBar = ({ navigation, user }) => {
    return (
        <View style={styles.nav_bar_background_icon}>
            <TouchableOpacity
                style={styles.nav_bar_icon}
                onPress={() => navigation.navigate("Home")}
            >
                <Image
                    source={require("../assets/house.png")}
                    style={styles.inputIcon}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.nav_bar_icon}
                onPress={() => navigation.navigate("Create Plant", { user })}
            >
                <Image
                    source={require("../assets/leaf.png")}
                    style={styles.inputIconLeafandHam}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.nav_bar_icon}
                onPress={() => navigation.navigate("Settings")}
            >
                <Image
                    source={require("../assets/hamburger.png")}
                    style={styles.inputIconLeafandHam}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    nav_bar_background_icon: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        height: 50,
        backgroundColor: "#D8E1FF",
        borderTopColor: "white",
        borderTopWidth: 0,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    nav_bar_icon: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    inputIconLeafandHam: {
        width: 20,
        height: 26,
        marginRight: 10,
    },
    inputIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
});

export default NavBar;
