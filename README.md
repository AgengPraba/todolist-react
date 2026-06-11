# TODOLIST APP

A task management application built with React and TypeScript. This application provides an intuitive interface for adding, managing, and tracking the completion status of your tasks, with persistent data storage in the browser.

## KEY FEATURES

### 1. Todo Task Management

* Add new todo tasks with task descriptions
* Mark tasks as completed or active
* Delete individual tasks from the list
* Input validation to ensure task descriptions are not empty

### 2. Advanced Filtering System

* View all tasks (All)
* View only active tasks (Active)
* View only completed tasks (Completed)
* Filters can be switched at any time without losing data

### 3. Completed Task Management

* Button to clear all completed tasks at once
* Only appears when there is at least one completed task
* Safe operation with visual feedback

### 4. Persistent Data Storage

* All tasks are automatically saved in the browser's localStorage
* Data remains available even after closing or refreshing the page
* Robust error handling if storage operations fail

### 5. Responsive Interface

* Clean and user-friendly design
* Input form with real-time validation
* Easy-to-read task list
* Clear and accessible filter controls

## INSTALLATION

### System Requirements

Make sure you have installed:

* Node.js version 16 or higher
* npm or yarn as the package manager

### Installation Steps

1. Clone or download this project

```bash
git clone https://github.com/AgengPraba/todolist-react.git
cd todolist-app
```

2. Install dependencies

```bash
npm install
```

3. Run the application in development mode

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

4. Create a production build

```bash
npm run build
```

5. Preview the production build

```bash
npm run preview
```

## USAGE

### 1. Adding a New Todo

* Type a task description into the input field
* Click the **"Add"** button or press **Enter**
* The new task will appear in the list

### 2. Marking a Task as Completed

* Click the checkbox next to a task to mark it as completed
* Completed tasks will be displayed with different styling
* Click again to mark the task as active

### 3. Deleting a Task

* Click the delete button (delete icon) next to the task you want to remove
* The task will be immediately removed from the list

### 4. Using Filters

* Click the **"All"** tab to view all tasks
* Click the **"Active"** tab to view only active tasks
* Click the **"Completed"** tab to view only completed tasks

### 5. Clearing All Completed Tasks

* Click the **"Clear Completed"** button to remove all completed tasks
* This button will only appear when there are completed tasks

## LICENSE

This project is available under the MIT License. Please refer to the LICENSE file for more details.
