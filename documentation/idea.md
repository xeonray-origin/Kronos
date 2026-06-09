# Kronos: Smart Task Management for Focused Work

## What is Kronos?

Kronos is a modern task management application that combines **agile productivity principles** with **focused work methodology**. It's designed to solve three specific problems that generic to-do apps don't address well:

1. **Visual task organization** — seeing the big picture of what's in progress
2. **Time accountability** — tracking actual focus time spent on tasks
3. **Friction reduction** — getting tasks into the system as fast as possible

---

## Core Features

### **Kanban Board View with Drag-and-Drop**

Move tasks between columns (`Backlog → In Progress → In Review → Done`) with smooth drag-and-drop interactions. Get a visual overview of your workflow at a glance, just like modern team collaboration tools.

### **In-App Pomodoro Focus Timer**

Built-in timer attached to each task that logs focus sessions directly to the database. Track how much actual focused time you've spent on work and build better habits with Pomodoro methodology.

### **Command-Line Style Quick Inputs**

Capture tasks lightning-fast using intuitive text parsing. Type `/high Buy milk #groceries` to create a task with priority and tags in one go—no clicking through forms.

**Examples:**

```
/high Buy milk #groceries
/critical Fix deployment bug #devops due:tomorrow
/medium Review PR #code-review
```

---

## Why Kronos Stands Out

| Feature       | Generic Apps    | Kronos                        |
| ------------- | --------------- | ----------------------------- |
| Task entry    | Forms + buttons | CLI-style text parsing        |
| Organization  | Flat lists      | Interactive Kanban board      |
| Time tracking | Manual or none  | Integrated Pomodoro + history |
| Speed         | Slow            | Fast—seconds, not minutes     |

---

## Technology

Built with React, Node.js, MongoDB, and tested with Jest. The Kanban board uses `@hello-pangea/dnd` for smooth, accessible drag-and-drop interactions.

---

## The Vision

Kronos bridges the gap between powerful team collaboration tools and personal productivity. It's for anyone who wants to manage tasks visually, build focus habits, and capture ideas without friction.
