# 🤖 VK-AI — Full-Stack AI Assistant

VK-AI is a full-stack AI assistant application with a modern React user interface and a Python backend. It supports user authentication, AI conversations, voice interaction, profile management, and API-powered AI functionality.

---

## 📌 Features

* 🤖 AI-powered chat assistant
* 💬 Real-time conversation interface
* 🎤 Voice input support
* 🔊 AI voice responses
* 👤 User registration and login
* 🔐 Secure authentication
* 🗄️ MongoDB database integration
* 🔑 Environment-based API key configuration
* 🎨 Modern responsive UI
* ⚡ React frontend
* 🐍 Python backend
* 🌐 REST API communication
* 🛡️ API credentials kept outside source code

---

# 🏗️ Project Structure

```text
VK-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   ├── index.html
│   └── ...
│
├── .gitignore
├── README.md
└── ...
```

> The exact file names may vary depending on your current project structure.

---

# 💻 Requirements

Install the following before starting the project.

### Required

* Python 3.10+
* Node.js 18+
* npm
* Git
* MongoDB or MongoDB Atlas
* Internet connection

### Recommended

* VS Code
* Google Chrome
* Python virtual environment

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/vasanth27s/VK-AI.git
```

Enter the project:

```bash
cd VK-AI
```

---

# 🐍 Backend Setup

Open a terminal in the project root.

## 2. Create Python Virtual Environment

### Windows PowerShell

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then activate again:

```powershell
.\venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

# 📦 3. Install Backend Dependencies

Go to the backend directory:

```powershell
cd backend
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

If `requirements.txt` does not exist, install the packages required by your backend project.

Return to the project root when needed:

```powershell
cd ..
```

---

# 🔐 Environment Variables

## 4. Create Backend `.env`

Inside:

```text
backend/
```

create:

```text
.env
```

Example:

```env
MONGODB_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key

COHERE_API_KEY=your_cohere_api_key

HUGGINGFACE_API_KEY=your_huggingface_api_key

GCP_API_KEY=your_google_cloud_api_key

USERNAME=your_assistant_username

ASSISTANT_NAME=VK-AI

INPUT_LANGUAGE=en

ASSISTANT_VOICE=en-CA-LiamNeural
```

### ⚠️ IMPORTANT

Never upload your real `.env` file to GitHub.

Your `.gitignore` should contain:

```gitignore
.env
*.env
backend/.env

venv/
.venv/
__pycache__/
*.pyc

node_modules/
dist/
build/
```

---

# 🔑 API Keys

VK-AI may use several external services depending on the enabled features.

## Groq API

Used for AI/LLM functionality.

Create your API key from the Groq developer console.

Set:

```env
GROQ_API_KEY=your_key
```

---

## Cohere API

Used for supported AI/NLP functionality.

Set:

```env
COHERE_API_KEY=your_key
```

---

## Hugging Face API

Used for supported Hugging Face models/services.

Set:

```env
HUGGINGFACE_API_KEY=your_key
```

---

## Google Cloud API

If your project uses Google Cloud services, configure the required Google Cloud API and credentials.

Set:

```env
GCP_API_KEY=your_key
```

### ⚠️ Security

Never commit a Google Cloud API key to GitHub.

If a key has already been pushed or detected by GitHub Secret Scanning:

1. Revoke/delete the exposed key.
2. Create a new key.
3. Replace it in your local `.env`.
4. Remove the secret from Git history.
5. Push the cleaned repository.

---

# 🗄️ MongoDB Setup

VK-AI uses MongoDB for storing application data.

You can use:

* Local MongoDB
* MongoDB Atlas

## MongoDB Atlas

Create a MongoDB Atlas cluster and obtain your connection string.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/VKAI
```

Replace:

```text
USERNAME
PASSWORD
cluster.mongodb.net
VKAI
```

with your actual values.

### Important

Do not commit the MongoDB username/password to GitHub.

---

# ⚛️ Frontend Setup

Open a second terminal.

From the project root:

```powershell
cd frontend
```

Install Node dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Vite will normally display a URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🐍 Start the Backend

Open another terminal.

From the project root:

```powershell
cd backend
```

Activate the virtual environment if necessary:

```powershell
..\venv\Scripts\Activate.ps1
```

Then start the backend.

If the project uses FastAPI with `main.py`:

```powershell
uvicorn main:app --reload --port 8000  ```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is usually available at:

```text
http://127.0.0.1:8000/docs
```

---

# ▶️ Start the Complete Project

You normally need **two terminals**.

## Terminal 1 — Backend

```powershell
cd VK-AI
.\venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Terminal 2 — Frontend

```powershell
cd VK-AI\frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Then open the frontend URL in your browser.

---

# 🔗 Frontend → Backend Connection

The frontend must communicate with the backend API.

For example:

```javascript
const API_URL = "http://127.0.0.1:8000";
```

API requests can then use:

```javascript
fetch(`${API_URL}/your-endpoint`)
```

If your backend uses another port, update the frontend API URL accordingly.

---

# 🔐 Authentication

The application can provide:

* User registration
* User login
* Credential validation
* User profile
* Session/authentication handling

Make sure MongoDB is running and the backend environment variables are configured before testing authentication.

---

# 🎤 Voice Features

If voice functionality is enabled, the application may require:

* Browser microphone permission
* Supported browser
* Correct voice configuration
* Required API/service credentials

When the browser asks for microphone permission, select:

```text
Allow
```

---

# 🧪 Testing the Application

After starting both servers:

### 1. Open the frontend

```text
http://localhost:5173
```

### 2. Create an account

Register a new user.

### 3. Login

Enter your credentials.

### 4. Open AI Chat

Send a message to VK-AI.

### 5. Test voice

Allow microphone access and test voice input if enabled.

### 6. Check backend

Open:

```text
http://127.0.0.1:8000/docs
```

You can test available API endpoints from the Swagger interface.

---

# 🛠️ Common Problems

## Python is not recognized

If you see:

```text
'python' is not recognized
```

Install Python and make sure **Add Python to PATH** is enabled.

Check:

```powershell
python --version
```

---

## `source` is not recognized on Windows

Do not use:

```bash
source venv/bin/activate
```

That command is for Linux/macOS.

Use PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## PowerShell blocks virtual environment

Run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## `uvicorn` is not recognized

Make sure the virtual environment is activated:

```powershell
.\venv\Scripts\Activate.ps1
```

Then install:

```powershell
pip install uvicorn
```

Or run:

```powershell
python -m uvicorn main:app --reload
```

---

## `npm` is not recognized

Install Node.js.

Check:

```powershell
node --version
npm --version
```

---

## Frontend does not start

Run:

```powershell
cd frontend
npm install
npm run dev
```

If the problem continues:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

---

## MongoDB connection error

Check:

1. MongoDB is running.
2. `MONGODB_URI` is correct.
3. MongoDB Atlas allows your IP address.
4. Username/password are correct.
5. Database name is correct.

---

## API key error

Check your:

```text
backend/.env
```

Make sure the variable name exactly matches what your Python code expects.

For example:

```env
GROQ_API_KEY=...
```

is different from:

```env
GroqAPIKey=...
```

Environment variable names must match your application's code.

---

# 🔒 GitHub Security

## Never commit secrets

Do not commit:

```text
backend/.env
.env
API keys
MongoDB passwords
JWT secrets
private keys
service-account JSON files
```

Check Git status:

```powershell
git status
```

Make sure `.env` is not listed as a file that will be committed.

---

# 🧹 If `.env` Was Already Committed

If GitHub reports:

```text
GH013: Repository rule violations found
Push cannot contain secrets
```

do not simply bypass GitHub protection.

First revoke/rotate the exposed credential.

Then remove the secret from Git history.

For example, `git-filter-repo` can remove the entire environment file from history:

```powershell
pip install git-filter-repo
```

Then:

```powershell
git filter-repo --path backend/.env --invert-paths
```

After verifying the repository:

```powershell
git push origin main --force
```

Only force-push after confirming that rewriting the repository history is safe for your project/team.

---

# 📁 Recommended `.gitignore`

Use a `.gitignore` similar to:

```gitignore
# Environment variables
.env
*.env
backend/.env
frontend/.env
frontend/.env.local

# Python
__pycache__/
*.py[cod]
*.pyo
.venv/
venv/
env/

# Node
node_modules/
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Temporary files
*.tmp
*.temp
```

---

# 🌐 Production Deployment

Before deploying VK-AI:

1. Create production environment variables.
2. Never expose API keys in React frontend code.
3. Configure CORS correctly.
4. Use HTTPS.
5. Use a production MongoDB configuration.
6. Restrict Google Cloud API keys where possible.
7. Configure authentication securely.
8. Disable development/debug settings.
9. Store secrets in the hosting provider's secret/environment-variable manager.
10. Review GitHub Secret Scanning before deployment.

---

# 📋 Development Checklist

Before running the project:

```text
[ ] Python installed
[ ] Node.js installed
[ ] MongoDB configured
[ ] Backend .env created
[ ] API keys configured
[ ] Virtual environment created
[ ] Backend dependencies installed
[ ] Frontend dependencies installed
[ ] .gitignore configured
[ ] No secrets committed
```

---

# 🚀 Quick Start

For an already configured computer:

### Terminal 1

```powershell
cd VK-AI
.\venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --reload
```

### Terminal 2

```powershell
cd VK-AI\frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 📡 Default Development URLs

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | `http://localhost:5173`      |
| Backend      | `http://127.0.0.1:8000`      |
| FastAPI Docs | `http://127.0.0.1:8000/docs` |

> Ports may be different if your project configuration specifies other ports.

---

# 🧰 Technologies

### Frontend

* React
* JavaScript / JSX
* Vite
* CSS

### Backend

* Python
* FastAPI
* Uvicorn

### Database

* MongoDB

### AI / APIs

* Groq
* Cohere
* Hugging Face
* Google Cloud

---

# 👨‍💻 Development

Pull the latest changes:

```powershell
git pull origin main
```

Check the repository:

```powershell
git status
```

Create a commit:

```powershell
git add .
git commit -m "Update VK-AI"
```

Push:

```powershell
git push origin main
```

---

# ⚠️ Security Notice

Never publish real credentials in:

* GitHub repositories
* README files
* screenshots
* frontend JavaScript
* public configuration files
* API requests visible to users

Use environment variables and secure secret storage instead.

If a secret is accidentally exposed, **rotate/revoke it immediately**.

---

# 📄 License

Add your project's license information here.

Example:

```text
MIT License
```

---

# ⭐ VK-AI

Built with React, Python, MongoDB, and modern AI APIs.

**VK-AI — Your AI Assistant.**
