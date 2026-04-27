# HCI Experiment: Target Selection Lab 🎯

This project is a Human-Computer Interaction (HCI) experiment designed to model and measure the human information processing cycle: **Perception → Decision → Motor Execution**.

## 🚀 Overview
The lab simulates a complex target selection task in a dynamic environment. Unlike static Fitts's Law tests, this experiment introduces **active distractors** and **visual cues** to analyze how cognitive load affects user performance.

![Target Selection Lab](assets/preview.png) *(Note: Add your screenshot here)*

---

## 🧠 The HCI Model

### 1. Perception (Selective Attention)
Users must identify the **Shaking Green Target** while ignoring **Moving Maroon Ghosts** (decoys). This measures the time required to perceive specific visual signals in a crowded UI.

### 2. Decision (Path Planning)
A visual dashed line represents the chosen path, modeling the cognitive stage where the trajectory is planned before physical movement begins.

### 3. Motor Execution (Acquisition)
The final acquisition phase where the user moves the cursor to click the target. Movement Time (MT) is recorded to analyze efficiency.

---

## 📊 Fitts's Law Analytics

We utilize **Shannon’s Formula** to calculate the **Index of Difficulty (ID)**:

$$ID = \log_2\left(\frac{D}{W} + 1\right)$$

| Parameter | Description |
| :--- | :--- |
| **D (Distance)** | Pixels from starting position to target |
| **W (Width)** | Hitbox size of the target (Fixed at 40px) |
| **ID** | Bits of information processed |

---

## 🛠️ Technical Implementation
- **Core:** Vanilla JavaScript & HTML5 Canvas
- **Performance:** 60 FPS rendering for micro-second accurate timing
- **Styling:** Modern, responsive CSS with glassmorphism effects
- **Zero Dependencies:** Built entirely with standard web APIs

## 🛠️ How to Run
1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. Click **"Start Trial"** to begin the experiment.

---

## 📝 HCI Insights
By introducing "Ghosts" (visual distractors), the experiment demonstrates how **Visual Interference** increases cognitive load, leading to higher Movement Time (MT) and potential errors in target acquisition.
