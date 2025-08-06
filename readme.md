# 🚀 Mini Java Projects

Welcome to my collection of small Java projects! This repository is a growing archive of beginner-to-intermediate level projects created to practice core Java concepts like OOP, threading, file handling, user interaction, and more.

---

## 📂 Project Structure

```
Mini_Projects/
│
├── 1_Slot_machine/           🎰 Project 01: Slot Machine Game  
│   └── project-01/           📆 Java code for a console-based slot machine simulation
│
├── 2_Alarm_clock/            ⏰ Project 02: Alarm Clock  
│   └── project-02/           📆 Java code for an alarm clock with sound notification
│
├── .idea/                    ⚙️ IntelliJ project settings (optional, Git-ignored)
├── mini_projects.iml         📄 IntelliJ module config file
└── README.md                 📝 This file
```

---

## 📌 Projects

### 🎰 1. Slot Machine
- A simple console-based slot machine game.
- Randomly generates symbols, and the user wins or loses based on the match.
- Focus: Random numbers, loops, simple game logic.

### ⏰ 2. Alarm Clock
- A console alarm clock that:
  - Takes user input for a future time
  - Shows live ticking time
  - Plays a `.wav` sound when the time is reached
- Focus: `LocalTime`, `Thread`, `Scanner`, sound playback with `javax.sound.sampled`.

---

## ✅ Requirements

- Java 8 or higher
- (Optional) IntelliJ IDEA for easy project navigation
- `.wav` file for alarm sound (placed at `src/alarm.wav`)

---

## 🛠️ How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Mini_Projects.git
   cd Mini_Projects
   ```

2. Open in IntelliJ or compile via terminal:
   ```bash
   javac path/to/YourClass.java
   java YourClass
   ```

3. For Alarm Clock, ensure the `.wav` file exists in the correct path.

---

## 🔒 License

This repository is for learning and demonstration purposes. No license is attached — feel free to explore, fork, and build upon it.

---

## 🙌 Contributions Welcome

Have ideas or want to add your own mini-project? Fork the repo and submit a pull request!

