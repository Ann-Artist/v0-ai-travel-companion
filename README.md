# 🌍 AI Travel Companion for the Differently-Abled


> An AI-powered travel companion that makes navigation and public transport accessible for **blind**, **deaf**, and **sighted (normal)** users.  
> Provides voice-based guidance, text-based instructions, object detection, and sign-language interpretation to enable safer, more inclusive travel.

---

## 🚀 Features

- **Three user modes (login):** `Blind` | `Deaf` | `Normal`
- **Blind mode**
  - Voice input for `From` and `To` (speech-to-text).
  - Camera button integrated with **YOLO** object detection.
  - Voice alerts for detected objects and places (e.g., “Bus stop ahead”, “Tree on the left”).
  - Audio navigation: “Turn left”, “Go straight”, etc.
- **Deaf mode**
  - Text input for `From` and `To`.
  - Live text navigation instructions (distance and direction).
  - Ambient announcement detection → speech-to-text conversion displayed on-screen.
- **Normal mode**
  - Regular map & text/voice navigation.
  - Camera + **Sign Language Recognition** to translate signs into text/voice to assist communication with deaf users.
- Real-time public transport updates (e.g., “Bus station at 2 min”).
- Configurable TTS / STT and map providers.

---

## 🧭 How to use (conceptual)

1. Open the app and choose a user mode: **Blind**, **Deaf**, or **Normal**.  

### 👨‍🦯 Blind Mode
- Use the **voice assistant** to speak your **From** and **To** locations.  
- Enable the **camera** for YOLO-based object detection.  
- Listen for **spoken alerts** and **audio navigation instructions** (e.g., "Turn left", "Bus stop ahead").  

### 🧏 Deaf Mode
- Type your **From** and **To** locations manually.  
- Read **on-screen text** that:  
  - Transcribes ambient announcements (e.g., bus station messages).  
  - Displays **step-by-step navigation directions**.  

### 🙂 Normal Mode
- Use the **map** and **voice navigation** for standard travel.  
- Enable the **camera/sign-language feature** to translate **sign gestures from a deaf person** into text or voice, enabling smoother communication.  

---
