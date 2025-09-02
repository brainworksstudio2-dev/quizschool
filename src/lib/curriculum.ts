export const curriculum = {
  "HTML": [ "Introduction to HTML", "HTML Elements and Tags", "HTML Attributes", "HTML Forms", "Semantic HTML", "HTML5 APIs"],
  "CSS": ["Introduction to CSS", "Selectors and Specificity", "Box Model", "Flexbox", "Grid", "Responsive Design"],
  "Tailwind CSS": ["Getting Started", "Utility-First Fundamentals", "Customization", "Responsive Design", "Component-Based Styling", "Plugins"],
  "Git": ["Introduction to Git", "Basic Commands", "Branching and Merging"],
  "JavaScript": ["Variables and Data Types", "Operators", "Control Flow", "Functions", "Objects and Arrays", "DOM Manipulation", "Asynchronous JavaScript", "ES6+ Features", "Error Handling"],
  "Data Structures & Algorithms": ["Big O Notation", "Arrays and Strings", "Linked Lists", "Stacks and Queues", "Trees", "Graphs", "Sorting Algorithms", "Searching Algorithms", "Dynamic Programming"],
  "React": ["Introduction to React", "JSX and Components", "State and Props", "Lifecycle Methods", "Hooks (useState, useEffect)", "Conditional Rendering", "React Router", "State Management (Context API)", "Fetching Data"],
  "Firebase": ["Introduction to Firebase", "Authentication", "Firestore", "Realtime Database", "Cloud Functions", "Hosting"],
  "React Native": ["Introduction to React Native", "Core Components", "Styling", "Navigation", "Working with APIs", "Device Features"],
  "Node.js": ["Introduction to Node.js", "Modules and npm", "File System", "Express.js", "REST APIs", "Middleware"],
};

export type Subject = keyof typeof curriculum;
export type Topic<S extends Subject> = (typeof curriculum)[S][number];
