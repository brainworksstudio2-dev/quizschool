export const curriculum = {
  "HTML": {
    "Week 1": ["Introduction to HTML", "HTML Elements and Tags", "HTML Attributes"],
    "Week 2": ["HTML Forms", "Semantic HTML", "HTML5 APIs"],
  },
  "CSS": {
    "Week 1": ["Introduction to CSS", "Selectors and Specificity", "Box Model"],
    "Week 2": ["Flexbox", "Grid", "Responsive Design"],
  },
  "Tailwind CSS": {
    "Week 1": ["Getting Started", "Utility-First Fundamentals", "Customization"],
    "Week 2": ["Responsive Design", "Component-Based Styling", "Plugins"],
  },
  "Git": {
    "Week 1": ["Introduction to Git", "Basic Commands", "Branching and Merging"],
  },
  "JavaScript": {
    "Week 1": ["Variables and Data Types", "Operators", "Control Flow"],
    "Week 2": ["Functions", "Objects and Arrays", "DOM Manipulation"],
    "Week 3": ["Asynchronous JavaScript", "ES6+ Features", "Error Handling"],
  },
  "Data Structures & Algorithms": {
    "Week 1": ["Big O Notation", "Arrays and Strings", "Linked Lists"],
    "Week 2": ["Stacks and Queues", "Trees", "Graphs"],
    "Week 3": ["Sorting Algorithms", "Searching Algorithms", "Dynamic Programming"],
  },
  "React": {
    "Week 1": ["Introduction to React", "JSX and Components", "State and Props"],
    "Week 2": ["Lifecycle Methods", "Hooks (useState, useEffect)", "Conditional Rendering"],
    "Week 3": ["React Router", "State Management (Context API)", "Fetching Data"],
  },
  "Firebase": {
    "Week 1": ["Introduction to Firebase", "Authentication", "Firestore"],
    "Week 2": ["Realtime Database", "Cloud Functions", "Hosting"],
  },
  "React Native": {
    "Week 1": ["Introduction to React Native", "Core Components", "Styling"],
    "Week 2": ["Navigation", "Working with APIs", "Device Features"],
  },
  "Node.js": {
    "Week 1": ["Introduction to Node.js", "Modules and npm", "File System"],
    "Week 2": ["Express.js", "REST APIs", "Middleware"],
  },
};

export type Subject = keyof typeof curriculum;
// This weirdness is to make sure TS can infer the keys correctly
export type Week<S extends Subject> = keyof (typeof curriculum)[S];
export type Topic<S extends Subject, W extends Week<S>> = (typeof curriculum)[S][W][number];
