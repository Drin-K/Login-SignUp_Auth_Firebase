# 🔐 Login & SignUp Authentication – Firebase + GitHub OAuth

## 📖 Overview

This project demonstrates a **modern authentication system** built with **React Native (Expo)** and **Firebase Authentication**, including two secure login methods:

1. **Email & Password Login / Signup** (via Firebase Auth)  
2. **GitHub OAuth Login** (via a secure Node.js backend server)

The combination of Firebase and OAuth2.0 provides a flexible and secure login system that works across both web and mobile devices.

---

## ⚙️ How Authentication Works

### 1️⃣ Email & Password Authentication

- The user provides their first name, last name, email, and password.  
- The app uses Firebase’s `createUserWithEmailAndPassword()` to register a new account.  
- Additional user data (`firstName`, `lastName`, `email`, `createdAt`) is stored in **Firestore** under the `users/` collection.  
- The user is then redirected to the `/home` screen.

**Files involved:**  
- `signup.jsx` → Handles user registration  
- `login.jsx` → Handles email/password login

---

### 2️⃣ GitHub OAuth Login

GitHub login uses a **two-step process** between the frontend and backend.

#### 🧭 (a) Frontend – Expo React Native
- The app opens the **GitHub Authorization page** using `expo-auth-session`.  
- After successful login, GitHub returns an `authorization code`.  
- This code is sent to our backend server (`server.js`) to exchange it for an `access_token`.

#### ⚙️ (b) Backend – Node.js Server
- The `server.js` file acts as a **secure middleware** between GitHub and Firebase.  
- It receives the `authorization_code`, calls GitHub’s API, and exchanges it for an `access_token`.  
- The access token is then returned to the mobile app, which uses:
  ```js
  const credential = GithubAuthProvider.credential(access_token);
  await signInWithCredential(auth, credential);

## 📡 Local Network Setup (Testing on Real Devices)

When testing on a real phone using **Expo Go**, you must make sure the app can reach your backend server.

1. **Connect both your laptop and your phone** to the same Wi-Fi or Hotspot.  
2. Run the following command to find your local IP address:  
   - **Windows:** `ipconfig`  
   - **Mac/Linux:** `ifconfig`

   Example output:


IPv4 Address: 172.20.10.3


Update the backend URL in your login.jsx file:
```js
const res = await fetch("http://172.20.10.3:3000/exchange_github_token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code }),
});
```

Start your backend server:

node server.js


Open the Expo Go app on your phone and try “Login with GitHub”.

✅ If both devices are connected properly, the login will complete successfully and the user will be redirected to /home.
