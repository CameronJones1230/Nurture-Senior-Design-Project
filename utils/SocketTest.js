import React, { useEffect, useState, useContext } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import io from 'socket.io-client';

const SocketContext = React.createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketTest = ({ onSendCommand }) => {
    const [socket, setSocket] = useState(null);
    const [commandInput, setCommandInput] = useState('');

    useEffect(() => {
        const socketIo = io('wss://nurture.glitch.me/'); // Adjust the URL as needed

        socketIo.on('connect', () => {
            console.log('Connected to server');
        });

        socketIo.on('serverMessage', (message) => {
            console.log('Message from server:', message);
        });

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        };
    }, []);

    const handleSendCommand = () => {
        if (socket && commandInput) {
            socket.emit('message', commandInput);
            setCommandInput('');
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Enter command"
                value={commandInput}
                onChangeText={setCommandInput}
            />
            <Button title="Send Command" onPress={handleSendCommand} />
            <Text>Socket is ready. Check your console for messages.</Text>
        </View>
    );
};


export default SocketTest;
