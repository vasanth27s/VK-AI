import { useEffect, useRef, useState } from "react";
import "./styles.css";
import logo from "../image.png";

const API = "https://vk-ai-dozd.onrender.com";

function SearchIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function Notification({ notification, onClose }) {
  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 99999,
        minWidth: "320px",
        maxWidth: "480px",
        padding: "15px 18px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: isSuccess ? "#123d25" : "#461b20",
        border: `1px solid ${isSuccess ? "#27c96f" : "#ff4d5d"}`,
        color: "#ffffff",
        boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          minWidth: "28px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isSuccess ? "#27c96f" : "#ff4d5d",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "16px",
        }}
      >
        {isSuccess ? "✓" : "!"}
      </span>

      <span style={{ flex: 1 }}>
        {notification.message}
      </span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        style={{
          border: 0,
          background: "transparent",
          color: "#ffffff",
          opacity: 0.75,
          fontSize: "22px",
          lineHeight: 1,
          cursor: "pointer",
          padding: "0 2px",
        }}
      >
        ×
      </button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authPage, setAuthPage] = useState("login");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function showNotification(message, type = "success") {
    setNotification({ message, type });

    window.setTimeout(() => {
      setNotification(null);
    }, 3500);
  }

  function handleLogin(data, isSignup = false) {
    localStorage.setItem("token", data.token);
    setUser(data.user);

    if (isSignup) {
      showNotification(
        "Account created successfully! Login successful!",
        "success"
      );
    } else {
      showNotification(
        "Login successful!",
        "success"
      );
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setAuthPage("login");
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {!user ? (
        <AuthPage
          page={authPage}
          setPage={setAuthPage}
          onLogin={handleLogin}
          onNotify={showNotification}
        />
      ) : (
        <ChatPage
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

/* ============================================================
   LOGIN / SIGNUP
   ============================================================ */

function AuthPage({
  page,
  setPage,
  onLogin,
  onNotify,
}) {
  const isSignup = page === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();

    setError("");
    setSending(true);

    try {
      const endpoint = isSignup
        ? "/api/auth/signup"
        : "/api/auth/login";

      const body = isSignup
        ? {
            name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const response = await fetch(
        `${API}${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Something went wrong."
        );
      }

      onLogin(data, isSignup);

    } catch (err) {
      const message = err.message || "Something went wrong.";

      setError(message);

      onNotify(
        isSignup
          ? message
          : "Wrong email or password. Please check your credentials.",
        "error"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-background">

        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="grid-3d" />

      </div>

      <div className="auth-container">

        {/* ==================================================
            LEFT / SHOWCASE
            ================================================== */}

        <div className="auth-showcase">

          <div className="brand">

            <div
              className="brand-icon"
              style={{
                width: "56px",
                height: "56px",
                minWidth: "56px",
                minHeight: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "transparent",
              }}
            >
              <img
                src={logo}
                alt="VK AI"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <div>
              <strong>
                VK AI
              </strong>

              <span>
                Intelligent workspace
              </span>
            </div>

          </div>

          <div className="three-d-scene">

            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />

            <div className="cube">

              <div className="cube-face front cube-text-only">AI</div>

              <div className="cube-face back cube-text-only">AI</div>

              <div className="cube-face right cube-text-only">AI</div>

              <div className="cube-face left cube-text-only">AI</div>

              <div className="cube-face top cube-text-only">AI</div>

              <div className="cube-face bottom cube-text-only">AI</div>

            </div>

          </div>

          <div className="showcase-text">

            <h1>
              Your ideas.
              <br />

              <span>
                Powered by VK AI.
              </span>
            </h1>

            <p>
              Create conversations, solve problems,
              learn new things and build something amazing.
            </p>

          </div>

        </div>

        {/* ==================================================
            AUTH CARD
            ================================================== */}

        <div className="auth-card">

          <div className="auth-mobile-brand">

            <div
              className="brand-icon"
              style={{
                width: "50px",
                height: "50px",
                minWidth: "50px",
                minHeight: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "transparent",
              }}
            >
              <img
                src={logo}
                alt="VK AI"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <strong>
              VK AI
            </strong>

          </div>

          <div className="auth-heading">

            <span>
              {isSignup
                ? "GET STARTED"
                : "WELCOME BACK"}
            </span>

            <h2>
              {isSignup
                ? "Create your account"
                : "Sign in to VK AI"}
            </h2>

            <p>
              {isSignup
                ? "Create an account to start using your AI workspace."
                : "Enter your details to continue."}
            </p>

          </div>

          <form onSubmit={submit}>

            {isSignup && (

              <label>

                <span>
                  Name
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Your name"
                  required
                />

              </label>

            )}

            <label>

              <span>
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
              />

            </label>

            <label>

              <span>
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                minLength={6}
                required
              />

            </label>

            {error && (

              <div
                className="auth-error auth-error-red"
                style={{
                  color: "#ff5b6b",
                  background: "rgba(255, 77, 93, 0.10)",
                  border: "1px solid rgba(255, 77, 93, 0.35)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <span
                  className="auth-error-icon"
                  style={{
                    width: "20px",
                    height: "20px",
                    minWidth: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ff4d5d",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  !
                </span>
                <span>{error}</span>
              </div>

            )}

            <button
              type="submit"
              className="auth-button"
              disabled={sending}
            >

              {sending
                ? "Please wait..."
                : isSignup
                  ? "Create account →"
                  : "Sign in →"}

            </button>

          </form>

          <div className="auth-switch">

            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {

                setError("");

                setPage(
                  isSignup
                    ? "login"
                    : "signup"
                );

              }}
            >

              {isSignup
                ? "Sign in"
                : "Create account"}

            </button>

          </div>

          <div className="auth-security">
            🔒 Secure authentication
          </div>

        </div>

      </div>

    </div>
  );
}

function ProfileMenuItem({ icon, text, onClick, arrow = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: "44px",
        border: 0,
        borderRadius: "9px",
        background: "transparent",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "9px 10px",
        fontSize: "15px",
        textAlign: "left",
        cursor: "pointer",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = "#3b3b3b";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "transparent";
      }}
    >
      <span
        style={{
          width: "24px",
          minWidth: "24px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "21px",
          lineHeight: 1,
        }}
      >
        {icon}
      </span>

      <span style={{ flex: 1 }}>{text}</span>

      {arrow && (
        <span style={{ fontSize: "22px", opacity: 0.9 }}>
          ›
        </span>
      )}
    </button>
  );
}

/* ============================================================
   CHAT PAGE
   ============================================================ */

function ChatPage({
  user,
  onLogout,
}) {

  const token =
    localStorage.getItem("token");

  const [localUser, setLocalUser] =
    useState(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    function handleUserUpdated(event) {
      if (event.detail) {
        setLocalUser(event.detail);
      }
    }

    window.addEventListener(
      "vk-ai-user-updated",
      handleUserUpdated
    );

    return () => {
      window.removeEventListener(
        "vk-ai-user-updated",
        handleUserUpdated
      );
    };
  }, []);

  const [chats, setChats] =
    useState([]);

  const [activeChat, setActiveChat] =
    useState(null);

  const [input, setInput] =
    useState("");

  const [thinking, setThinking] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  // Voice typing
  const [isListening, setIsListening] =
    useState(false);

  const [voiceSupported, setVoiceSupported] =
    useState(true);

  const [voicePreview, setVoicePreview] =
    useState("");

  const [voiceError, setVoiceError] =
    useState("");

  const recognitionRef =
    useRef(null);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const bottomRef =
    useRef(null);

  const initialLoadRef =
    useRef(false);

  const creatingInitialChatRef =
    useRef(false);

  const profileInputRef =
    useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    activeChat?.messages,
    sending,
  ]);

  // Browser speech-to-text.
  // Chrome/Edge expose this as SpeechRecognition or webkitSpeechRecognition.
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0]?.transcript || "";

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalText.trim()) {
        setInput((previous) => {
          const cleaned =
            previous.trim();

          return cleaned
            ? `${cleaned} ${finalText.trim()}`
            : finalText.trim();
        });
      }

      // This is shown immediately in the message box
      // while the user is still speaking.
      setVoicePreview(
        interimText.trim()
      );
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoicePreview("");

      if (event.error === "not-allowed") {
        setVoiceError(
          "Microphone permission was blocked. Allow microphone access in Chrome."
        );
      } else if (
        event.error === "no-speech"
      ) {
        setVoiceError("");
      } else {
        setVoiceError(
          `Voice input error: ${event.error}`
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoicePreview("");
    };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Already stopped.
      }

      recognitionRef.current =
        null;
    };
  }, []);

  function toggleVoice() {
    setVoiceError("");

    if (!voiceSupported) {
      setVoiceError(
        "Voice typing is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    const recognition =
      recognitionRef.current;

    if (!recognition) {
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      // start() can throw if recognition is already running.
      if (
        !String(error?.message || "")
          .toLowerCase()
          .includes("already started")
      ) {
        setVoiceError(
          "Could not start the microphone."
        );
      }
    }
  }

  async function loadChats() {

    // React StrictMode can run effects twice in development.
    // This guard prevents creating two initial "New chat" records.
    if (initialLoadRef.current) {
      return;
    }

    initialLoadRef.current = true;

    try {

      const response = await fetch(
        `${API}/api/chats`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setChats(data);

      if (data.length > 0) {

        openChat(
          data[0].id
        );

      } else if (!creatingInitialChatRef.current) {

        creatingInitialChatRef.current = true;
        await createNewChat();

      }

    } catch (error) {

      console.error(error);

    } finally {

      creatingInitialChatRef.current = false;

    }
  }

  async function openChat(id) {

    try {

      const response = await fetch(
        `${API}/api/chats/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setActiveChat(data);

    } catch (error) {

      console.error(error);

    }
  }

  async function createNewChat() {

    try {

      const response = await fetch(
        `${API}/api/chats`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: "New chat",
          }),
        }
      );

      if (!response.ok) {
        return;
      }

      const chat =
        await response.json();

      setChats((previous) => [
        chat,
        ...previous,
      ]);

      setActiveChat({
        ...chat,
        messages: [],
      });

    } catch (error) {

      console.error(error);

    }
  }

  async function deleteChat(id) {

    try {

      const response = await fetch(
        `${API}/api/chats/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const remaining =
        chats.filter(
          (chat) =>
            chat.id !== id
        );

      setChats(remaining);

      if (
        activeChat?.id === id
      ) {

        if (
          remaining.length > 0
        ) {

          openChat(
            remaining[0].id
          );

        } else {

          createNewChat();

        }

      }

    } catch (error) {

      console.error(error);

    }
  }

  async function updateProfilePicture(file) {

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Profile picture must be 2 MB or smaller.");
      return;
    }

    setProfileSaving(true);

    try {

      const reader = new FileReader();

      reader.onload = async () => {

        try {

          const response = await fetch(
            `${API}/api/auth/profile-picture`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                profile_picture: reader.result,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.detail || "Could not update profile picture."
            );
          }

          // Keep the same user information, only replace the picture.
          if (data.user) {
            // ChatPage receives user as a prop, so this event is sent
            // to the parent through a custom browser event.
            window.dispatchEvent(
              new CustomEvent("vk-ai-user-updated", {
                detail: data.user,
              })
            );
          }

          setProfileOpen(false);
          window.alert("Profile picture updated successfully!");

        } catch (error) {
          window.alert(error.message || "Profile update failed.");
        } finally {
          setProfileSaving(false);
        }
      };

      reader.onerror = () => {
        setProfileSaving(false);
        window.alert("Could not read the selected image.");
      };

      reader.readAsDataURL(file);

    } catch (error) {
      setProfileSaving(false);
      window.alert(error.message || "Profile update failed.");
    }
  }

  function handleProfileFile(event) {
    const file = event.target.files?.[0];

    if (file) {
      updateProfilePicture(file);
    }

    event.target.value = "";
  }

  function getInitials(name) {
    return (
      name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U"
    );
  }

  async function sendMessage() {

    if (isListening) {
      recognitionRef.current?.stop();
      setVoicePreview("");
    }

    const content =
      input.trim();

    if (
      !content ||
      sending ||
      !activeChat
    ) {
      return;
    }

    setInput("");
    setSending(true);

    const temporaryMessage = {

      id:
        `temp-${Date.now()}`,

      role: "user",

      content,

      created_at:
        new Date().toISOString(),

    };

    setActiveChat(
      (previous) => ({
        ...previous,

        messages: [
          ...previous.messages,
          temporaryMessage,
        ],
      })
    );

    try {

      const response = await fetch(
        `${API}/api/chats/${activeChat.id}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            content,
            thinking,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "AI request failed."
        );

      }

      setActiveChat(
        (previous) => ({
          ...previous,

          title:
            data.chat.title,

          updated_at:
            data.chat.updated_at,

          messages: [
            ...previous.messages,
            data.message,
          ],
        })
      );

      setChats(
        (previous) =>
          previous.map(
            (chat) =>
              chat.id ===
              data.chat.id
                ? data.chat
                : chat
          )
      );

    } catch (error) {

      setActiveChat(
        (previous) => ({
          ...previous,

          messages: [
            ...previous.messages,

            {
              id:
                `error-${Date.now()}`,

              role:
                "assistant",

              content:
                `⚠️ ${error.message}`,

              created_at:
                new Date().toISOString(),
            },
          ],
        })
      );

    } finally {

      setSending(false);

    }
  }

  const filteredChats = chats.filter((chat) =>
    (chat.title || "New chat")
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  function handleSearchChat(chatId) {
    openChat(chatId);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function handleKeyDown(event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }
  }

  return (
    <div className="chat-app">

      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div
            className="brand-icon"
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "transparent",
            }}
          >
            <img
              src={logo}
              alt="VK AI"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <div>

            <strong>
              VK AI
            </strong>

            <small>
              AI Workspace
            </small>

          </div>

        </div>

        {/* NEW CHAT */}
        <button
          type="button"
          onClick={() => {
            setSearchOpen(false);
            setProfileOpen(false);
            createNewChat();
          }}
          style={{
            width: "100%",
            height: "44px",
            marginTop: "10px",
            border: 0,
            borderRadius: "10px",
            background: "#242424",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 13px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "#333333";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "#242424";
          }}
        >
          <span
            style={{
              fontSize: "23px",
              lineHeight: 1,
              width: "20px",
              display: "inline-flex",
              justifyContent: "center",
            }}
          >
            +
          </span>
          <span>New chat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSearchOpen((value) => !value);
            setProfileOpen(false);
          }}
          style={{
            width: "100%",
            height: "44px",
            marginTop: "10px",
            border: 0,
            borderRadius: "10px",
            background: searchOpen ? "#333333" : "transparent",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 13px",
            fontSize: "15px",
            cursor: "pointer",
            textAlign: "left",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "#2d2d2d";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = searchOpen ? "#333333" : "transparent";
          }}
        >
          <SearchIcon size={20} />
          <span>Search chats</span>
        </button>

        {searchOpen && (
          <div
            style={{
              marginTop: "8px",
              padding: "10px",
              borderRadius: "12px",
              background: "#242424",
              border: "1px solid #3a3a3a",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#181818",
                border: "1px solid #404040",
                borderRadius: "9px",
                padding: "0 10px",
                height: "40px",
              }}
            >
              <SearchIcon size={17} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search chats"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "#aaa",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ marginTop: "8px", maxHeight: "260px", overflowY: "auto" }}>
              {filteredChats.length === 0 ? (
                <div style={{ color: "#8d8d8d", padding: "12px 6px", fontSize: "13px" }}>
                  No chats found.
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    type="button"
                    key={chat.id}
                    onClick={() => handleSearchChat(chat.id)}
                    style={{
                      width: "100%",
                      border: 0,
                      background: "transparent",
                      color: "#ffffff",
                      borderRadius: "8px",
                      padding: "9px 7px",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background = "#333333";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ opacity: 0.7 }}>◇</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {chat.title || "New chat"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="history-title">
          RECENT CHATS
        </div>

        <div className="chat-history">

          {chats.map(
            (chat) => (

              <div
                key={chat.id}
                className={
                  `history-item ${
                    activeChat?.id ===
                    chat.id
                      ? "active"
                      : ""
                  }`
                }
                onClick={() =>
                  openChat(
                    chat.id
                  )
                }
              >

                <span>
                  ◇
                </span>

                <span className="history-name">
                  {chat.title}
                </span>

                <button
                  className="delete-chat"
                  onClick={(event) => {

                    event.stopPropagation();

                    deleteChat(
                      chat.id
                    );

                  }}
                >
                  ×
                </button>

              </div>

            )
          )}

        </div>

        <div className="sidebar-bottom" style={{ position: "relative" }}>

          <div className="user-box">

            <button
              type="button"
              className="avatar profile-avatar-button"
              style={{
                width: "44px",
                height: "44px",
                minWidth: "44px",
                minHeight: "44px",
                padding: 0,
                margin: 0,
                borderRadius: "10px",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
              onClick={() => setProfileOpen((value) => !value)}
              title="Edit profile"
            >
              {localUser?.profile_picture ? (
                <img
                  src={localUser.profile_picture}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    minWidth: "100%",
                    minHeight: "100%",
                    padding: 0,
                    margin: 0,
                    border: 0,
                    borderRadius: 0,
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              ) : (
                getInitials(localUser?.name)
              )}
            </button>

            <div
              className="user-info"
              onClick={() => setProfileOpen((value) => !value)}
              style={{ cursor: "pointer" }}
              title="Open account menu"
            >

              <strong>
                {localUser?.name}
              </strong>

              <small>
                {localUser?.email}
              </small>

            </div>

            <button
              type="button"
              className="profile-edit-button"
              onClick={() => setProfileOpen((value) => !value)}
              title="Profile"
            >
              ⋯
            </button>

          </div>

          {profileOpen && (
            <div
              className="profile-menu"
              style={{
                position: "absolute",
                left: "12px",
                right: "12px",
                bottom: "92px",
                zIndex: 50,
                padding: "8px",
                borderRadius: "14px",
                background: "#2f2f2f",
                border: "1px solid #444",
                boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
              }}
            >
              <ProfileMenuItem
                icon="◌"
                text="Personalization"
                onClick={() => {
                  setProfileOpen(false);
                  alert("Personalization settings will be available here.");
                }}
              />

              <ProfileMenuItem
                icon="◎"
                text="Profile"
                onClick={() => profileInputRef.current?.click()}
              />

              <ProfileMenuItem
                icon="⚙"
                text="Settings"
                onClick={() => {
                  setProfileOpen(false);
                  alert("Settings will be available here.");
                }}
              />

              <ProfileMenuItem
                icon="◉"
                text="Help"
                arrow
                onClick={() => {
                  setProfileOpen(false);
                  alert("How can we help? Please check your VK AI setup or contact support.");
                }}
              />

              <div
                style={{
                  height: "1px",
                  background: "#444",
                  margin: "7px 2px",
                }}
              />

              <ProfileMenuItem
                icon="↪"
                text="Log out"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
              />

              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileFile}
              />
            </div>
          )}

          <button
            className="logout-button"
            onClick={onLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN CHAT
          ================================================== */}

      <main className="chat-main">

        <header className="chat-header">

          <div className="chat-brand">

            <span className="online-dot" />

            VK AI

          </div>

          <div className="model-pill">
            VK AI
          </div>

        </header>

        <section className="conversation">

          {activeChat?.messages?.length === 0 && (

            <div className="welcome">

              <div
                className="welcome-orb"
                style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  background: "transparent",
                }}
              >
                <img
                  src={logo}
                  alt="VK AI"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <h1>
                What can I help you  
                <span>
                </span>
              </h1>

              <p>
                Ask anything. Build ideas.
                Solve problems.
              </p>

              <div className="suggestions">

                <button
                  onClick={() =>
                    setInput(
                      "Explain artificial intelligence simply"
                    )
                  }
                >
                  Explain AI simply
                </button>

                <button
                  onClick={() =>
                    setInput(
                      "Help me build a React project"
                    )
                  }
                >
                  Help me code
                </button>

                <button
                  onClick={() =>
                    setInput(
                      "Give me creative project ideas"
                    )
                  }
                >
                  Creative ideas
                </button>

              </div>

            </div>

          )}

          {activeChat?.messages?.map(
            (message) => (

              <div
                key={message.id}
                className={
                  `message-row ${
                    message.role
                  }`
                }
              >

                <div
                  className={
                    `message-avatar ${
                      message.role
                    }`
                  }
                >

                  {message.role ===
                  "user"

                    ? (localUser?.profile_picture ? (
                        <img
                          src={localUser.profile_picture}
                          alt="Profile"
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            objectPosition: "center",
                            transform: "none",
                            display: "block",
                          }}
                        />
                      ) : (
                        getInitials(localUser?.name)
                      ))

                    : (
                      <img
                        src={logo}
                        alt="VK AI"
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    )}

                </div>

                <div className="message-content">

                  <div className="message-label">

                    {message.role ===
                    "user"
                      ? "You"
                      : "VK AI"}

                  </div>

                  <div className="message-text">

                    {message.content}

                  </div>

                </div>

              </div>

            )
          )}

          {sending && (

            <div className="message-row assistant">

              <div className="message-avatar assistant">

                <img
                  src={logo}
                  alt="VK AI"
                  style={{
                    width: "36px",
                    height: "36px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />

              </div>

              <div className="typing">

                <span />
                <span />
                <span />

                <small>
                  Thinking...
                </small>

              </div>

            </div>

          )}

          <div ref={bottomRef} />

        </section>

        {/* ==================================================
            COMPOSER
            ================================================== */}

        {voiceError && (
          <div
            style={{
              width: "min(900px, calc(100% - 32px))",
              margin: "0 auto 8px",
              padding: "9px 12px",
              borderRadius: "9px",
              background: "#351b1f",
              border: "1px solid #70343b",
              color: "#ff9aa3",
              fontSize: "12px",
            }}
          >
            {voiceError}
          </div>
        )}

        <div className="composer-area">

          <div className="composer">

            <textarea
              value={
                voicePreview
                  ? `${input}${
                      input.trim()
                        ? " "
                        : ""
                    }${voicePreview}`
                  : input
              }
              onChange={(event) => {
                setInput(
                  event.target.value
                );
                setVoicePreview("");
              }}
              onKeyDown={
                handleKeyDown
              }
              placeholder={
                isListening
                  ? "Listening... speak now"
                  : "Message VK AI..."
              }
              rows={1}
              readOnly={isListening}
              style={{
                ...(isListening
                  ? {
                      borderColor:
                        "#6d62b5",
                      boxShadow:
                        "0 0 0 1px rgba(139,124,255,0.25)",
                    }
                  : {}),
              }}
            />

            <div className="composer-bottom">

              {isListening && (
                <span
                  style={{
                    color: "#a99fff",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#8b7cff",
                      boxShadow:
                        "0 0 10px #8b7cff",
                      animation:
                        "vkVoicePulse 1s infinite",
                    }}
                  />
                  Listening
                </span>
              )}

              <button
                className={
                  thinking
                    ? "tool active"
                    : "tool"
                }
                onClick={() =>
                  setThinking(
                    !thinking
                  )
                }
              >

                ✧

                {thinking
                  ? " Thinking on"
                  : " Think"}

              </button>

              <button
                type="button"
                className="voice-btn"
                onClick={toggleVoice}
                disabled={sending}
                title={
                  isListening
                    ? "Stop voice typing"
                    : "Voice typing"
                }
                aria-label={
                  isListening
                    ? "Stop voice typing"
                    : "Start voice typing"
                }
                style={{
                  width: "36px",
                  height: "36px",
                  border: "0",
                  borderRadius: "50%",
                  background: isListening
                    ? "#4d4678"
                    : "#303030",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: sending
                    ? "not-allowed"
                    : "pointer",
                  boxShadow: isListening
                    ? "0 0 0 2px #8b7cff, 0 0 20px rgba(139,124,255,0.35)"
                    : "none",
                  transition: "all 0.2s ease",
                  marginLeft: "auto",
                  marginRight: "0",
                  padding: 0,
                }}
              >
                {isListening ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="7"
                      y="7"
                      width="10"
                      height="10"
                      rx="2"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="3" width="6" height="12" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0" />
                    <path d="M12 18v3" />
                    <path d="M8 21h8" />
                  </svg>
                )}
              </button>

              <button
                className="send-button"
                onClick={sendMessage}
                disabled={
                  sending ||
                  !input.trim()
                }
              >
                ↑
              </button>

            </div>

          </div>

          <div className="composer-note">
            VK AI can make mistakes.
            Check important information.
          </div>

        </div>

      </main>

    </div>
  );
}

/* Professional compact composer buttons */
if (typeof document !== "undefined" && !document.getElementById("vk-ai-composer-buttons-style")) {
  const style = document.createElement("style");
  style.id = "vk-ai-composer-buttons-style";
  style.textContent = `
    .composer-bottom {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .composer-bottom .send-button {
      width: 36px !important;
      height: 36px !important;
      min-width: 36px !important;
      min-height: 36px !important;
      margin-left: 0 !important;
      border-radius: 50% !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }

    .composer-bottom .voice-btn {
      width: 36px !important;
      height: 36px !important;
      min-width: 36px !important;
      min-height: 36px !important;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .composer-bottom .voice-btn svg {
      width: 19px;
      height: 19px;
    }
  `;
  document.head.appendChild(style);
}

export default App;

if (
  typeof document !== "undefined" &&
  !document.getElementById("vk-ai-voice-style")
) {
  const style = document.createElement("style");
  style.id = "vk-ai-voice-style";
  style.textContent = `
    @keyframes vkVoicePulse {
      0%, 100% {
        opacity: 0.45;
        transform: scale(0.85);
      }
      50% {
        opacity: 1;
        transform: scale(1.15);
      }
    }
  `;
  document.head.appendChild(style);
}
