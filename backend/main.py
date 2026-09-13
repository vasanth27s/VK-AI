import os
from datetime import datetime, timedelta

import bcrypt
import httpx

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "chatbot")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "change-this-secret"
)

JWT_ALGORITHM = "HS256"


if not MONGODB_URL:
    raise RuntimeError(
        "MONGODB_URL is missing in backend/.env"
    )


if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing in backend/.env"
    )


# ============================================================
# MONGODB
# ============================================================

mongo_client = MongoClient(MONGODB_URL)

db = mongo_client[MONGODB_DATABASE]

users_collection = db["users"]
chats_collection = db["chats"]
messages_collection = db["messages"]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="AI Chat API",
    version="2.0"
)


app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://vk-ai-gamma.vercel.app",
]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChatCreate(BaseModel):
    title: str = "New chat"


class MessageCreate(BaseModel):
    content: str
    thinking: bool = False


class ProfilePictureUpdate(BaseModel):
    profile_picture: str


# ============================================================
# AUTHENTICATION HELPERS
# ============================================================

def create_token(user_id: str):

    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7),
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )


def get_current_user(
    authorization: str | None
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authentication required."
        )

    if not authorization.startswith("Bearer "):

        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header."
        )

    token = authorization[7:]

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:

            raise HTTPException(
                status_code=401,
                detail="Invalid token."
            )

        try:

            object_id = ObjectId(user_id)

        except Exception:

            raise HTTPException(
                status_code=401,
                detail="Invalid user ID."
            )

        user = users_collection.find_one(
            {
                "_id": object_id
            }
        )

        if not user:

            raise HTTPException(
                status_code=401,
                detail="User not found."
            )

        return user

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )


def user_to_dict(user):

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "profile_picture": user.get("profile_picture"),
    }


# ============================================================
# AUTH - SIGNUP
# ============================================================

@app.post("/api/auth/signup")
def signup(body: SignupRequest):

    name = body.name.strip()
    email = str(body.email).lower().strip()
    password = body.password

    if len(name) < 2:

        raise HTTPException(
            status_code=400,
            detail="Name must contain at least 2 characters."
        )

    if len(password) < 6:

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )

    existing_user = users_collection.find_one(
        {
            "email": email
        }
    )

    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    now = datetime.utcnow()

    user = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "created_at": now,
    }

    result = users_collection.insert_one(
        user
    )

    user["_id"] = result.inserted_id

    token = create_token(
        str(user["_id"])
    )

    return {
        "token": token,
        "user": user_to_dict(user)
    }


# ============================================================
# AUTH - LOGIN
# ============================================================

@app.post("/api/auth/login")
def login(body: LoginRequest):

    email = str(body.email).lower().strip()

    user = users_collection.find_one(
        {
            "email": email
        }
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    password_valid = bcrypt.checkpw(
        body.password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    token = create_token(
        str(user["_id"])
    )

    return {
        "token": token,
        "user": user_to_dict(user)
    }


# ============================================================
# AUTH - CURRENT USER
# ============================================================

@app.get("/api/auth/me")
def get_me(
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    return {
        "user": user_to_dict(user)
    }


# ============================================================
# UPDATE PROFILE PICTURE
# ============================================================

@app.put("/api/auth/profile-picture")
def update_profile_picture(
    body: ProfilePictureUpdate,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    picture = body.profile_picture.strip()

    if not picture:
        raise HTTPException(
            status_code=400,
            detail="Profile picture is required."
        )

    # Accept only browser data URLs for this simple app.
    if not picture.startswith("data:image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid profile picture format."
        )

    # Keep MongoDB user documents reasonably small.
    if len(picture) > 2_800_000:
        raise HTTPException(
            status_code=413,
            detail="Profile picture is too large. Maximum size is about 2 MB."
        )

    users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "profile_picture": picture,
                "updated_at": datetime.utcnow(),
            }
        }
    )

    updated_user = users_collection.find_one(
        {"_id": user["_id"]}
    )

    return {
        "ok": True,
        "user": user_to_dict(updated_user)
    }


# ============================================================
# GEMINI
# ============================================================

async def ask_gemini(
    messages: list[dict],
    thinking: bool
):

    system_prompt = (
        "You are a helpful AI assistant. "
        "Give accurate, practical answers. "
        "Use clear formatting and concise explanations."
    )

    if thinking:

        system_prompt += (
            " Spend extra effort checking your answer "
            "before responding."
        )

    contents = []

    for message in messages:

        role = (
            "user"
            if message["role"] == "user"
            else "model"
        )

        contents.append(
            {
                "role": role,
                "parts": [
                    {
                        "text": message["content"]
                    }
                ]
            }
        )

    payload = {
        "system_instruction": {
            "parts": [
                {
                    "text": system_prompt
                }
            ]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 4096
        }
    }

    url = (
        "https://generativelanguage.googleapis.com/"
        f"v1beta/models/{GEMINI_MODEL}:generateContent"
    )

    async with httpx.AsyncClient(
        timeout=90
    ) as client:

        response = await client.post(
            url,
            params={
                "key": GEMINI_API_KEY
            },
            json=payload
        )

    if response.status_code >= 400:

        try:

            detail = response.json().get(
                "error",
                {}
            ).get(
                "message",
                response.text
            )

        except Exception:

            detail = response.text

        raise HTTPException(
            status_code=502,
            detail=f"Gemini error: {detail}"
        )

    data = response.json()

    try:

        return (
            data["candidates"][0]
            ["content"]["parts"][0]["text"]
        )

    except (KeyError, IndexError):

        raise HTTPException(
            status_code=502,
            detail="Gemini returned an unexpected response."
        )


async def ask_ai(
    messages: list[dict],
    thinking: bool
):

    return await ask_gemini(
        messages,
        thinking
    )


# ============================================================
# CHAT HELPERS
# ============================================================

def chat_to_dict(chat):

    return {
        "id": str(chat["_id"]),
        "title": chat.get(
            "title",
            "New chat"
        ),
        "created_at": chat[
            "created_at"
        ].isoformat(),
        "updated_at": chat[
            "updated_at"
        ].isoformat(),
    }


def message_to_dict(message):

    return {
        "id": str(message["_id"]),
        "role": message["role"],
        "content": message["content"],
        "created_at": message[
            "created_at"
        ].isoformat(),
    }


def get_object_id(chat_id: str):

    try:

        return ObjectId(chat_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid chat ID."
        )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "name": "AI Chat API",
        "status": "ok"
    }


# ============================================================
# GET CHATS
# ============================================================

@app.get("/api/chats")
def get_chats(
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    chats = chats_collection.find(
        {
            "user_id": user["_id"]
        }
    ).sort(
        "updated_at",
        -1
    )

    return [
        chat_to_dict(chat)
        for chat in chats
    ]


# ============================================================
# CREATE CHAT
# ============================================================

@app.post("/api/chats")
def create_chat(
    body: ChatCreate,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    now = datetime.utcnow()

    chat = {
        "user_id": user["_id"],
        "title": body.title.strip() or "New chat",
        "created_at": now,
        "updated_at": now,
    }

    result = chats_collection.insert_one(
        chat
    )

    chat["_id"] = result.inserted_id

    return chat_to_dict(chat)


# ============================================================
# GET CHAT
# ============================================================

@app.get("/api/chats/{chat_id}")
def get_chat(
    chat_id: str,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    object_id = get_object_id(
        chat_id
    )

    chat = chats_collection.find_one(
        {
            "_id": object_id,
            "user_id": user["_id"]
        }
    )

    if not chat:

        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    messages = messages_collection.find(
        {
            "chat_id": object_id,
            "user_id": user["_id"]
        }
    ).sort(
        "created_at",
        1
    )

    return {
        **chat_to_dict(chat),
        "messages": [
            message_to_dict(message)
            for message in messages
        ]
    }


# ============================================================
# DELETE CHAT
# ============================================================

@app.delete("/api/chats/{chat_id}")
def delete_chat(
    chat_id: str,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    object_id = get_object_id(
        chat_id
    )

    chat = chats_collection.find_one(
        {
            "_id": object_id,
            "user_id": user["_id"]
        }
    )

    if not chat:

        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    chats_collection.delete_one(
        {
            "_id": object_id,
            "user_id": user["_id"]
        }
    )

    messages_collection.delete_many(
        {
            "chat_id": object_id,
            "user_id": user["_id"]
        }
    )

    return {
        "ok": True
    }


# ============================================================
# SEND MESSAGE
# ============================================================

@app.post("/api/chats/{chat_id}/messages")
async def send_message(
    chat_id: str,
    body: MessageCreate,
    authorization: str | None = Header(default=None)
):

    user = get_current_user(
        authorization
    )

    content = body.content.strip()

    if not content:

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    object_id = get_object_id(
        chat_id
    )

    chat = chats_collection.find_one(
        {
            "_id": object_id,
            "user_id": user["_id"]
        }
    )

    if not chat:

        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    # --------------------------------------------------------
    # Save user message
    # --------------------------------------------------------

    now = datetime.utcnow()

    user_message = {
        "chat_id": object_id,
        "user_id": user["_id"],
        "role": "user",
        "content": content,
        "created_at": now,
    }

    messages_collection.insert_one(
        user_message
    )

    # --------------------------------------------------------
    # Update chat title
    # --------------------------------------------------------

    if chat.get("title") == "New chat":

        chats_collection.update_one(
            {
                "_id": object_id,
                "user_id": user["_id"]
            },
            {
                "$set": {
                    "title": content[:60]
                }
            }
        )

    # --------------------------------------------------------
    # Get conversation history
    # --------------------------------------------------------

    history = messages_collection.find(
        {
            "chat_id": object_id,
            "user_id": user["_id"]
        }
    ).sort(
        "created_at",
        1
    )

    ai_messages = []

    for message in history:

        ai_messages.append(
            {
                "role": message["role"],
                "content": message["content"]
            }
        )

    # --------------------------------------------------------
    # Gemini
    # --------------------------------------------------------

    answer = await ask_ai(
        ai_messages,
        body.thinking
    )

    # --------------------------------------------------------
    # Save AI message
    # --------------------------------------------------------

    assistant_now = datetime.utcnow()

    assistant_message = {
        "chat_id": object_id,
        "user_id": user["_id"],
        "role": "assistant",
        "content": answer,
        "created_at": assistant_now,
    }

    result = messages_collection.insert_one(
        assistant_message
    )

    assistant_message["_id"] = result.inserted_id

    # --------------------------------------------------------
    # Update chat
    # --------------------------------------------------------

    chats_collection.update_one(
        {
            "_id": object_id,
            "user_id": user["_id"]
        },
        {
            "$set": {
                "updated_at": assistant_now
            }
        }
    )

    updated_chat = chats_collection.find_one(
        {
            "_id": object_id,
            "user_id": user["_id"]
        }
    )

    return {
        "chat": chat_to_dict(
            updated_chat
        ),
        "message": message_to_dict(
            assistant_message
        )
    }
