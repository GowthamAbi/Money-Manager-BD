
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],        
    credentials: true                
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Example of emitting a message to the frontend
  socket.emit('message', 'Hello from the WebSocket server!');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
