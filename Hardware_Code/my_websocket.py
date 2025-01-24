import socketio

# Create a Socket.IO client
sio = socketio.Client(logger=True, engineio_logger=True)

# Define event handlers for various Socket.IO events
@sio.event
def connect():
    print('Connection established')
    sio.emit('message', 'Hello from Raspberry Pi!')

@sio.event
def serverMessage(data):
    print('Message from server:', data)

@sio.event
def disconnect():
    print('Disconnected from server')

# Connect to the WebSocket server
try:
    sio.connect('wss://nurture.glitch.me/')  # Replace 'localhost' with your server's IP or hostname
    sio.wait()
except Exception as e:
    print('Error connecting to server:', e)
