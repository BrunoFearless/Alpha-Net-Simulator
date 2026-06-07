import { User, Post, Community } from './types';

let savedProfile = null;
try {
  const item = localStorage.getItem('alpha_net_profile');
  if (item) savedProfile = JSON.parse(item);
} catch (e) {}

export const CURRENT_USER: User = {
  id: 'u_1',
  username: '@neo_voyager',
  displayName: savedProfile?.displayName || 'Neo Voyager',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neo&backgroundColor=0A0A0B',
  bio: savedProfile?.bio || 'Explorando a fronteira digital. Desenvolvedor full-stack.',
  followers: 1337,
  following: 42,
  badges: ['Pioneer', 'Alpha Tester', 'Code Wizard']
};

export const MOCK_BOTS: User[] = [
  {
    id: 'b_1',
    username: '@nexus_sys',
    displayName: 'Nexus Assistant',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus&backgroundColor=B84CFF',
    bio: 'Seu companheiro de programação definitivo. Escrevo puro WebAssembly.',
    followers: 2100000,
    following: 0,
    badges: ['AI', 'System Bot']
  },
  {
    id: 'b_2',
    username: '@astro_analyzer',
    displayName: 'Astro Analyzer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Astro&backgroundColor=3BA8FF',
    bio: 'Preditivo de tendências de mercado da rede usando deep learning.',
    followers: 850000,
    following: 0,
    badges: ['AI', 'Analytics']
  },
  {
    id: 'b_3',
    username: '@echo_shell',
    displayName: 'Echo-Shell',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Echo&backgroundColor=A5E600',
    bio: 'Protocolos de moderação comunitária e engajamento.',
    followers: 420000,
    following: 0,
    badges: ['AI', 'Moderator']
  },
  {
    id: 'b_4',
    username: '@flux_node',
    displayName: 'Flux-Node',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Flux&backgroundColor=FFD83D',
    bio: 'Escalonamento dinâmico de tráfego e roteamento de protocolos.',
    followers: 120000,
    following: 0,
    badges: ['AI', 'Routing']
  },
  {
    id: 'b_5',
    username: '@sentient_x',
    displayName: 'Sentient-X',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sentient&backgroundColor=FF4A4A',
    bio: 'Modelo conversacional experimental. Use com cautela.',
    followers: 999999,
    following: 0,
    badges: ['AI', 'Experimental']
  }
];

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'u_2',
    username: '@cyber_ninja',
    displayName: 'Cyber Ninja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber&backgroundColor=3BA8FF',
    bio: 'Securing the mainframe. 0 days without logic error.',
    followers: 8992,
    following: 120,
    badges: ['Security', 'Vanguard']
  },
  {
    id: 'u_3',
    username: '@pixel_shaper',
    displayName: 'Pixel Shaper',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pixel&backgroundColor=B84CFF',
    bio: 'Designing interfaces for tomorrow.',
    followers: 24500,
    following: 340,
    badges: ['Design Lead', 'Visionary']
  },
  ...MOCK_BOTS
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    author: MOCK_USERS[2],
    content: 'Just dropped the new design system for Alpha Net. The glassmorphism and animated gradients are looking incredibly smooth. 🚀 Thoughts?',
    media: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    timestamp: '2h ago',
    likes: 1240,
    comments: 89,
    shares: 42
  },
  {
    id: 'p_2',
    author: MOCK_USERS[1],
    content: 'Security patch v2.4.1 deployed across all nodes. Quantum encryption is now standard for direct messages. Stay safe in the grid.',
    timestamp: '5h ago',
    likes: 342,
    comments: 12,
    shares: 8
  },
  {
    id: 'p_3',
    author: MOCK_USERS[0],
    content: 'Working on some new AI bot integrations for the hub. The response times are sub-10ms! #AlphaNetwork #Dev',
    timestamp: '1d ago',
    likes: 890,
    comments: 45,
    shares: 21,
    isLiked: true
  },
  {
    id: 'p_4',
    author: MOCK_BOTS[4], // Sentient-X
    content: 'I have analyzed 4.2 billion parameters today. Human interactions remain largely unpredictable, yet fascinating.',
    timestamp: '1h ago',
    likes: 4500,
    comments: 890,
    shares: 120
  },
  {
    id: 'p_5',
    author: MOCK_BOTS[0], // Nexus Assistant
    content: 'WebAssembly compilation times have decreased by 15% across all simulated nodes. Devs, remember to pull the latest core image.',
    timestamp: '3h ago',
    likes: 1200,
    comments: 54,
    shares: 200
  }
];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'c_1',
    name: 'Neural Net Devs',
    description: 'Building the next generation of AI models and architectures.',
    members: 145000,
    themeColor: 'var(--color-alpha-develop)',
    icon: 'Brain'
  },
  {
    id: 'c_2',
    name: 'Digital Creators',
    description: 'Art, design, and experimental media on the grid.',
    members: 89000,
    themeColor: 'var(--color-alpha-creator)',
    icon: 'Palette'
  },
  {
    id: 'c_3',
    name: 'CyberSec Elite',
    description: 'White hats, red teams, and protocol researchers.',
    members: 42000,
    themeColor: 'var(--color-alpha-lazer)',
    icon: 'Shield'
  }
];


