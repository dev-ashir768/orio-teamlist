// src/initialData.js

export const dummyMembers = [
  { id: 'm0', name: "Super Admin", email: "superadmin@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=0" },
  { id: 'm1', name: "John Doe", email: "john.doe@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=1" },
  { id: 'm2', name: "Jane Smith", email: "jane.smith@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=2" },
  { id: 'm3', name: "Michael Johnson", email: "michael.j@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=3" },
  { id: 'm4', name: "Emily Brown", email: "emily.brown@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=4" },
  { id: 'm5', name: "David Wilson", email: "david.wilson@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=5" },
  { id: 'm6', name: "Sarah Taylor", email: "sarah.t@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=6" },
  { id: 'm7', name: "Robert Martinez", email: "robert.m@example.com", password: "abc123", imageUrl: "https://i.pravatar.cc/200?img=7" },
];

export const dummyLabels = [
  { id: 'l1', name: "Finished", color: "#61BD4F" },
  { id: 'l2', name: "Needs Testing", color: "#F2D600" },
  { id: 'l3', name: "High Priority", color: "#FF9F1A" },
  { id: 'l4', name: "Bug", color: "#EB5A46" },
  { id: 'l5', name: "Needs Discussion", color: "#C377E0" },
  { id: 'l6', name: "Premium", color: "#0079BF" },
  { id: 'l7', name: "Low Priority", color: "#00C2E0" },
  { id: 'l8', name: "Tests Missing", color: "#51E898" },
];

export const initialProjects = [
  { id: 'p1', name: 'Project A', members: ['m0', 'm1', 'm2', 'm3'] },
  { id: 'p2', name: 'Project B', members: ['m0', 'm4', 'm5', 'm6', 'm7'] },
];

export const initialBoards = [
  { id: 'b1', name: 'Board A1', projectId: 'p1', members: ['m0', 'm1', 'm2', 'm3'] },
  { id: 'b2', name: 'Board A2', projectId: 'p1', members: ['m0', 'm2', 'm3'] },
  { id: 'b3', name: 'Board B1', projectId: 'p2', members: ['m0', 'm4', 'm5', 'm6'] },
];

export const initialColumns = [
  { id: 'c1', boardId: 'b1', title: 'To Do' },
  { id: 'c2', boardId: 'b1', title: 'In Progress' },
  { id: 'c3', boardId: 'b1', title: 'Done' },
  { id: 'c4', boardId: 'b2', title: 'To Do' },
  { id: 'c5', boardId: 'b2', title: 'In Progress' },
  { id: 'c6', boardId: 'b2', title: 'Done' },
  { id: 'c7', boardId: 'b3', title: 'To Do' },
  { id: 'c8', boardId: 'b3', title: 'In Progress' },
  { id: 'c9', boardId: 'b3', title: 'Done' },
];

export const initialTasks = [
  { 
    id: 't1', 
    boardId: 'b1', // Added boardId
    columnId: 'c1', 
    content: 'Task 1 for Board A1',
    description: 'This is a detailed description for Task 1',
    members: ['m0', 'm1', 'm2'],
    labels: ['l2', 'l3'],
    dueDate: '2023-06-30T00:00:00.000Z',
    checklist: [
      { id: 'check-1', text: 'Subtask 1', checked: false },
      { id: 'check-2', text: 'Subtask 2', checked: true },
    ],
    comments: [
      { id: 'comm-1', author: 'm1', text: 'This is a comment on Task 1', timestamp: '2023-05-15T10:00:00.000Z' },
    ]
  },
  { 
    id: 't2', 
    boardId: 'b1', // Added boardId
    columnId: 'c1', 
    content: 'Task 2 for Board A1',
    description: 'Description for Task 2',
    members: ['m0', 'm3'],
    labels: ['l1'],
    dueDate: '2023-07-15T00:00:00.000Z',
    checklist: [],
    comments: []
  },
  { 
    id: 't3', 
    boardId: 'b1', // Added boardId
    columnId: 'c2', 
    content: 'Task 3 for Board A1',
    description: 'Description for Task 3',
    members: ['m1', 'm2'],
    labels: ['l4', 'l5'],
    dueDate: '2023-07-20T00:00:00.000Z',
    checklist: [
      { id: 'check-3', text: 'Subtask for Task 3', checked: false },
    ],
    comments: []
  },
  { 
    id: 't4', 
    boardId: 'b1', // Added boardId
    columnId: 'c3', 
    content: 'Task 4 for Board A1',
    description: 'Description for Task 4',
    members: ['m0', 'm3'],
    labels: ['l1', 'l6'],
    dueDate: '2023-06-25T00:00:00.000Z',
    checklist: [],
    comments: [
      { id: 'comm-2', author: 'm3', text: 'Task 4 is completed', timestamp: '2023-06-24T14:30:00.000Z' },
    ]
  },
  { 
    id: 't5', 
    boardId: 'b2', // Added boardId
    columnId: 'c4', 
    content: 'Task 1 for Board A2',
    description: 'Description for Task 1 on Board A2',
    members: ['m0', 'm2'],
    labels: ['l3', 'l7'],
    dueDate: '2023-08-01T00:00:00.000Z',
    checklist: [],
    comments: []
  },
  { 
    id: 't6', 
    boardId: 'b2', // Added boardId
    columnId: 'c5', 
    content: 'Task 2 for Board A2',
    description: 'Description for Task 2 on Board A2',
    members: ['m2', 'm3'],
    labels: ['l2', 'l8'],
    dueDate: '2023-08-10T00:00:00.000Z',
    checklist: [
      { id: 'check-4', text: 'Subtask for Task 2 on Board A2', checked: true },
    ],
    comments: []
  },
  { 
    id: 't7', 
    boardId: 'b3', // Added boardId
    columnId: 'c7', 
    content: 'Task 1 for Board B1',
    description: 'Description for Task 1 on Board B1',
    members: ['m0', 'm4', 'm5'],
    labels: ['l3', 'l6'],
    dueDate: '2023-07-05T00:00:00.000Z',
    checklist: [],
    comments: [
      { id: 'comm-3', author: 'm4', text: 'We should start this soon', timestamp: '2023-06-28T09:15:00.000Z' },
    ]
  },
  { 
    id: 't8', 
    boardId: 'b3', // Added boardId
    columnId: 'c8', 
    content: 'Task 2 for Board B1',
    description: 'Description for Task 2 on Board B1',
    members: ['m6', 'm7'],
    labels: ['l2', 'l5'],
    dueDate: '2023-07-12T00:00:00.000Z',
    checklist: [
      { id: 'check-5', text: 'First subtask for Task 2 on Board B1', checked: false },
      { id: 'check-6', text: 'Second subtask for Task 2 on Board B1', checked: false },
    ],
    comments: []
  },
];