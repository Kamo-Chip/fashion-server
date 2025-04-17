# 👗 Fashion Feedback Server

This Node.js app receives outfit images via HTTP, uses OpenAI to generate fashion advice, converts the feedback into speech, and plays it aloud. Perfect for a smart mirror or AI fashion assistant setup.

## ✨ Features

- Upload JPEG images via POST requests
- Generate concise, AI-powered outfit feedback
- Convert text feedback to speech using OpenAI's TTS
- Autoplay the feedback on macOS using `afplay`

## 🛠 Tech Stack

- Node.js + Express
- OpenAI API (Vision + Speech)
- MacOS audio playback (`afplay`)
- `dotenv` for managing API keys
- `fs`, `path`, `child_process` for file and system operations

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Kamo-Chip/fashion-server.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key
```

## ▶️ Running Server

```bash
npm run dev
```

## 🗂️ Folder Structure
```
.
├── index.js               # Main server
├── utils.js               # OpenAI feedback + TTS functions
├── photos/                # Uploaded images
├── feedback_audio/        # Output MP3 files
├── .env                   # API key (not committed)
└── README.md              # You're here!

```

## 🗒️ Notes
- Requires macOS for automatic playback (afplay)

- .jpg images only

- OpenAI Vision + Speech endpoints must be enabled on your API key

## 🪪 License

MIT License