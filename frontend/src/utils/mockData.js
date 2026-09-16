// Initial Seed Data for AI-Integrated People Chat Application
// Authors: Aditya Maurya, Abdul Mannan, Aditya Vishwakarma, Abhishek Gangwar
// Guide: Mr. Sudhakar Dwivedi (AKGEC)

export const CURRENT_USER_DEFAULT = {
  id: 'user-1',
  name: 'Abdul Mannan',
  rollNo: '2400270130006',
  email: 'abdul.mannan@akgec.ac.in',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'online',
  department: 'Information Technology',
  preferredAiTone: 'Professional & Friendly',
  preferredLanguage: 'English'
};

export const CONTACTS_DATA = [
  {
    id: 'user-2',
    name: 'Aditya Maurya',
    rollNo: '2400270130018',
    email: 'aditya.maurya@akgec.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    department: 'Information Technology',
    lastSeen: 'Active now',
    about: 'Working on Spring Boot backend & AI API microservice'
  },
  {
    id: 'user-3',
    name: 'Aditya Vishwakarma',
    rollNo: '2400270130021',
    email: 'aditya.vishwakarma@akgec.ac.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    department: 'Information Technology',
    lastSeen: 'Active now',
    about: 'Frontend React & Media Queries UI/UX developer'
  },
  {
    id: 'user-4',
    name: 'Abhishek Gangwar',
    rollNo: '2400270130011',
    email: 'abhishek.gangwar@akgec.ac.in',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    status: 'away',
    department: 'Information Technology',
    lastSeen: '15 mins ago',
    about: 'Testing WebSocket channels and AI moderation policies'
  },
  {
    id: 'user-5',
    name: 'Mr. Sudhakar Dwivedi',
    designation: 'Project Guide / Assistant Professor',
    email: 'sudhakar.dwivedi@akgec.ac.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    department: 'Information Technology',
    lastSeen: 'Active now',
    about: 'B.Tech IT Project Guide | AKGEC Ghaziabad'
  },
  {
    id: 'user-6',
    name: 'Elena Rostova',
    designation: 'Global Research Collaborator',
    email: 'elena.rostova@international-lab.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    department: 'AI Research',
    lastSeen: '2 hours ago',
    about: 'Speaking Russian and English | Needs live translation'
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    type: 'direct',
    participants: ['user-1', 'user-2'],
    title: 'Aditya Maurya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    unreadCount: 0,
    lastMessage: {
      text: 'Have you verified the Spring Boot WebSocket broker endpoints?',
      timestamp: '14:32',
      senderId: 'user-2',
      status: 'read'
    }
  },
  {
    id: 'conv-group-1',
    type: 'group',
    title: 'AKGEC Major Project Team (2026-27)',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    participants: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    isOnline: true,
    unreadCount: 2,
    lastMessage: {
      text: 'Mr. Sudhakar Dwivedi: Please share the synopsis and architecture diagram.',
      timestamp: '14:28',
      senderId: 'user-5',
      status: 'delivered'
    }
  },
  {
    id: 'conv-2',
    type: 'direct',
    participants: ['user-1', 'user-5'],
    title: 'Mr. Sudhakar Dwivedi (Guide)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    unreadCount: 0,
    lastMessage: {
      text: 'Good progress on the human-in-the-loop AI suggestion safety design.',
      timestamp: '13:50',
      senderId: 'user-5',
      status: 'read'
    }
  },
  {
    id: 'conv-3',
    type: 'direct',
    participants: ['user-1', 'user-3'],
    title: 'Aditya Vishwakarma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    unreadCount: 0,
    lastMessage: {
      text: 'Added Lucide icons and responsive media queries for mobile view!',
      timestamp: '12:15',
      senderId: 'user-3',
      status: 'read'
    }
  },
  {
    id: 'conv-4',
    type: 'direct',
    participants: ['user-1', 'user-6'],
    title: 'Elena Rostova (Multilingual)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    unreadCount: 1,
    lastMessage: {
      text: 'Привет! Можете прислать документацию по проекту на русском?',
      timestamp: '10:40',
      senderId: 'user-6',
      status: 'delivered'
    }
  }
];

export const INITIAL_MESSAGES = {
  'conv-1': [
    {
      id: 'm1',
      conversationId: 'conv-1',
      senderId: 'user-2',
      senderName: 'Aditya Maurya',
      text: 'Hey Abdul! How is the AI-Integrated People Chat application coming along?',
      timestamp: '14:20',
      status: 'read'
    },
    {
      id: 'm2',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Abdul Mannan',
      text: 'Hey Aditya! We have finalized the architecture. The frontend uses React with Lucide icons and React Router, and backend uses Spring Boot with WebSocket & REST.',
      timestamp: '14:25',
      status: 'read'
    },
    {
      id: 'm3',
      conversationId: 'conv-1',
      senderId: 'user-2',
      senderName: 'Aditya Maurya',
      text: 'Have you verified the Spring Boot WebSocket broker endpoints?',
      timestamp: '14:32',
      status: 'read'
    }
  ],
  'conv-group-1': [
    {
      id: 'mg1',
      conversationId: 'conv-group-1',
      senderId: 'user-5',
      senderName: 'Mr. Sudhakar Dwivedi',
      text: 'Welcome team. Please outline the core difference between our project and a standalone chatbot.',
      timestamp: '14:00',
      status: 'read'
    },
    {
      id: 'mg2',
      conversationId: 'conv-group-1',
      senderId: 'user-1',
      senderName: 'Abdul Mannan',
      text: 'Sir, our platform is primarily for human-to-human communication. The AI operates strictly as an assistant providing Smart Replies, Rewriting, Translation, and Summaries with human confirmation.',
      timestamp: '14:05',
      status: 'read'
    },
    {
      id: 'mg3',
      conversationId: 'conv-group-1',
      senderId: 'user-3',
      senderName: 'Aditya Vishwakarma',
      text: 'Yes sir, and the UI has full responsive media queries support so it adapts smoothly on desktop, tablets, and phones.',
      timestamp: '14:10',
      status: 'read'
    },
    {
      id: 'mg4',
      conversationId: 'conv-group-1',
      senderId: 'user-4',
      senderName: 'Abhishek Gangwar',
      text: 'I have tested the moderation filter and smart reply suggestions. They are working reliably.',
      timestamp: '14:15',
      status: 'read'
    },
    {
      id: 'mg5',
      conversationId: 'conv-group-1',
      senderId: 'user-5',
      senderName: 'Mr. Sudhakar Dwivedi',
      text: 'Mr. Sudhakar Dwivedi: Please share the synopsis and architecture diagram.',
      timestamp: '14:28',
      status: 'delivered'
    }
  ],
  'conv-2': [
    {
      id: 'mgd1',
      conversationId: 'conv-2',
      senderId: 'user-5',
      senderName: 'Mr. Sudhakar Dwivedi',
      text: 'Good progress on the human-in-the-loop AI suggestion safety design.',
      timestamp: '13:50',
      status: 'read'
    }
  ],
  'conv-3': [
    {
      id: 'mgd2',
      conversationId: 'conv-3',
      senderId: 'user-3',
      senderName: 'Aditya Vishwakarma',
      text: 'Added Lucide icons and responsive media queries for mobile view!',
      timestamp: '12:15',
      status: 'read'
    }
  ],
  'conv-4': [
    {
      id: 'mru1',
      conversationId: 'conv-4',
      senderId: 'user-6',
      senderName: 'Elena Rostova',
      text: 'Привет! Можете прислать документацию по проекту на русском?',
      timestamp: '10:40',
      status: 'delivered'
    }
  ]
};

export const SMART_REPLY_TEMPLATES = {
  'conv-1': [
    'Yes, the Spring Boot STOMP endpoints `/ws/chat` are fully active.',
    'I am running the integration tests right now.',
    'Let me share the Postman collection and WebSocket logs with you.'
  ],
  'conv-group-1': [
    'Sure Sir, sharing the project synopsis and architecture diagram right away.',
    'Uploading the documentation and schema files now.',
    'We have prepared the presentation slides as well.'
  ],
  'conv-2': [
    'Thank you Sir! We ensured all AI suggestions require explicit user confirmation.',
    'We will present the demo in the next review session.'
  ],
  'conv-3': [
    'Great job Aditya! The responsive navigation and icons look crisp.',
    'Let us test it on multiple device breakpoints.'
  ],
  'conv-4': [
    'Конечно! Я переведу документацию и отправлю ее вам. (Sure! I will translate the docs and send them to you.)',
    'Yes, our app has built-in AI translation. Let me send it.'
  ],
  'default': [
    'Thanks for the update!',
    'Sounds good to me, let us proceed.',
    'Could you provide more details on this?'
  ]
};
