# BS Buster - Real-time Fact Checking Application

BS Buster is a real-time fact-checking application that transcribes speech and verifies claims on the fly.

## Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Project Structure

The project consists of two main parts:

- Frontend: React application with TypeScript
- Backend: FastAPI server with real-time audio processing

## Backend Setup

1. Create and activate a virtual environment:

bash
python -m venv venv
source venv/bin/activate # On Windows use: venv\Scripts\activate

2. Install dependencies:

bash
cd backend
pip install -r requirements.txt

3. Create a `.env` file in the backend directory with your API keys

bash
OPENAI_API_KEY=your_openai_api_key

4. Start the backend server:

bash
python main.py

The backend server will run on `http://localhost:8000`

## Frontend Setup

1. Install dependencies:

bash
cd frontend
npm install

2. Start the development server:

bash
npm start

The frontend will run on `http://localhost:3000`

## Features

- Real-time speech transcription
- Automatic claim detection
- Fact checking with source verification
- Live transcript display
- Metrics dashboard

## API Endpoints

### Backend

- `POST /start` - Start audio recording
- `POST /stop` - Stop audio recording
- `POST /transcript` - Get latest transcription
- `POST /fact-check` - Verify a specific claim
- `WS /ws/transcript` - WebSocket endpoint for live transcription

## Technology Stack

### Frontend

- React with TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- WebSocket for real-time updates

### Backend

- FastAPI
- OpenAI Whisper for transcription
- SoundDevice for audio capture
- NumPy and SciPy for audio processing
- OpenAI GPT-4 for claim extraction and verification

## Development Notes

- The frontend connects to the backend via WebSocket for real-time updates
- Audio is processed in chunks for optimal performance
- The application requires microphone permissions to function
- Fact-checking is performed using OpenAI's GPT-4 model

## Common Issues and Troubleshooting

1. **Audio Permission Denied**

   - Ensure your browser has permission to access the microphone
   - Check if another application is using the microphone

2. **Backend Connection Failed**

   - Verify both frontend and backend servers are running
   - Check if ports 8000 and 8080 are available
   - Ensure your firewall isn't blocking the connections

3. **Missing Dependencies**

   - Run `pip install -r requirements.txt` in the backend directory
   - Run `npm install` in the frontend directory

4. **OpenAI API Issues**
   - Verify your API key is correctly set in the `.env` file
   - Check your API usage limits and billing status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Notes

- Never commit your `.env` file or expose API keys
- The application processes audio locally before sending to OpenAI
- WebSocket connections are unencrypted - use in trusted networks only
