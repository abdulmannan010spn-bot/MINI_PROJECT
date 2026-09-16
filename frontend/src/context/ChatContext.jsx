import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  CONTACTS_DATA,
  SMART_REPLY_TEMPLATES
} from '../utils/mockData';
import { wsService } from '../services/websocket';
import { generateSmartReplies, scanContentModeration } from '../services/aiService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { currentUser, token } = useAuth();
  
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState('conv-1');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [contacts, setContacts] = useState(CONTACTS_DATA);
  const [filterType, setFilterType] = useState('all'); // 'all', 'direct', 'group'
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI Panels and Modals
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const [aiSuggestionModalData, setAiSuggestionModalData] = useState(null); // { text, type, originalText }
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  
  // Active smart replies
  const [smartReplies, setSmartReplies] = useState([]);
  const [isSmartRepliesLoading, setIsSmartRepliesLoading] = useState(false);

  // Active conversation object
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeMessages = messages[activeConversationId] || [];

  // Update smart replies when active conversation or messages change
  const refreshSmartReplies = useCallback(async () => {
    setIsSmartRepliesLoading(true);
    try {
      const msgs = messages[activeConversationId] || [];
      const replies = await generateSmartReplies(msgs, activeConversation?.title || '');
      setSmartReplies(replies);
    } catch (e) {
      const template = SMART_REPLY_TEMPLATES[activeConversationId] || SMART_REPLY_TEMPLATES.default;
      setSmartReplies(template);
    } finally {
      setIsSmartRepliesLoading(false);
    }
  }, [activeConversationId, messages, activeConversation]);

  useEffect(() => {
    refreshSmartReplies();
  }, [refreshSmartReplies]);

  // Connect WebSocket
  useEffect(() => {
    if (currentUser) {
      wsService.connect(token, () => {
        console.log('Real-time connection active');
      });

      const unsubscribe = wsService.subscribe('message', (incomingMsg) => {
        if (incomingMsg && incomingMsg.conversationId) {
          setMessages(prev => {
            const currentList = prev[incomingMsg.conversationId] || [];
            if (currentList.some(m => m.id === incomingMsg.id)) return prev;
            return {
              ...prev,
              [incomingMsg.conversationId]: [...currentList, incomingMsg]
            };
          });

          // Update last message in conversation
          setConversations(prev => prev.map(conv => {
            if (conv.id === incomingMsg.conversationId) {
              return {
                ...conv,
                lastMessage: {
                  text: incomingMsg.text,
                  timestamp: incomingMsg.timestamp,
                  senderId: incomingMsg.senderId,
                  status: 'delivered'
                }
              };
            }
            return conv;
          }));
        }
      });

      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    }
  }, [currentUser, token]);

  // Send message function (Person-to-Person)
  const sendMessage = (text, options = {}) => {
    if (!text || text.trim() === '' || !activeConversationId || !currentUser) return;

    // Scan for content safety
    const modScan = scanContentModeration(text);
    if (modScan.isFlagged) {
      alert(`⚠️ Content Moderation Warning: ${modScan.reason}`);
    }

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: activeConversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: timeString,
      status: 'sent',
      isAiAssisted: options.isAiAssisted || false,
      aiType: options.aiType || null
    };

    // Update local messages
    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg]
    }));

    // Update conversation last message
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          unreadCount: 0,
          lastMessage: {
            text: newMsg.text,
            timestamp: timeString,
            senderId: currentUser.id,
            status: 'sent'
          }
        };
      }
      return c;
    }));

    // Send via WebSocket broker
    wsService.sendMessage(`/app/chat/${activeConversationId}`, newMsg);

    // Auto-respond simulation in demo mode if chatting with another participant
    if (activeConversation?.type === 'direct' && activeConversation.participants) {
      const otherParticipantId = activeConversation.participants.find(id => id !== currentUser.id);
      const otherContact = contacts.find(c => c.id === otherParticipantId);
      
      if (otherContact) {
        setTimeout(() => {
          simulateIncomingReply(activeConversationId, otherContact, text);
        }, 1500);
      }
    }
  };

  const simulateIncomingReply = (convId, contact, userMessage) => {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    let replyText = `Thanks for your message: "${userMessage.substring(0, 25)}..." We are reviewing it!`;
    
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hey')) {
      replyText = `Hello ${currentUser.name}! How is the development progress going today?`;
    } else if (userMessage.toLowerCase().includes('synopsis') || userMessage.toLowerCase().includes('presentation')) {
      replyText = `The Project Synopsis looks well structured. The integration of React, Spring Boot, and AI moderation meets all academic requirements!`;
    } else if (userMessage.toLowerCase().includes('test') || userMessage.toLowerCase().includes('check')) {
      replyText = `All tests for WebSocket routing and AI translation are passing cleanly.`;
    }

    const incoming = {
      id: `msg-reply-${Date.now()}`,
      conversationId: convId,
      senderId: contact.id,
      senderName: contact.name,
      senderAvatar: contact.avatar,
      text: replyText,
      timestamp: timeString,
      status: 'delivered'
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), incoming]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          lastMessage: {
            text: replyText,
            timestamp: timeString,
            senderId: contact.id,
            status: 'delivered'
          }
        };
      }
      return c;
    }));
  };

  const selectConversation = (id) => {
    setActiveConversationId(id);
    setIsMobileSidebarOpen(false); // On mobile, close sidebar when conversation is selected
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const createNewConversation = (contactId, isGroup = false, groupTitle = '') => {
    if (isGroup) {
      const newGroup = {
        id: `conv-group-${Date.now()}`,
        type: 'group',
        title: groupTitle || 'New Study Group',
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
        participants: ['user-1', contactId],
        unreadCount: 0,
        isOnline: true,
        lastMessage: {
          text: 'Group conversation initialized',
          timestamp: 'Just now',
          senderId: currentUser.id,
          status: 'sent'
        }
      };
      setConversations(prev => [newGroup, ...prev]);
      setActiveConversationId(newGroup.id);
    } else {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;
      const existing = conversations.find(c => c.type === 'direct' && c.participants?.includes(contactId));
      if (existing) {
        setActiveConversationId(existing.id);
      } else {
        const newConv = {
          id: `conv-${Date.now()}`,
          type: 'direct',
          participants: [currentUser.id, contact.id],
          title: contact.name,
          avatar: contact.avatar,
          isOnline: contact.status === 'online',
          unreadCount: 0,
          lastMessage: {
            text: 'Started new conversation',
            timestamp: 'Just now',
            senderId: currentUser.id,
            status: 'sent'
          }
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
      }
    }
    setIsMobileSidebarOpen(false);
    setIsNewChatModalOpen(false);
  };

  // Filtered conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.text || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'direct') return conv.type === 'direct';
    if (filterType === 'group') return conv.type === 'group';
    return true;
  });

  return (
    <ChatContext.Provider value={{
      conversations: filteredConversations,
      allConversations: conversations,
      activeConversation,
      activeConversationId,
      activeMessages,
      contacts,
      filterType,
      setFilterType,
      searchQuery,
      setSearchQuery,
      selectConversation,
      sendMessage,
      smartReplies,
      isSmartRepliesLoading,
      refreshSmartReplies,
      isAiPanelOpen,
      setIsAiPanelOpen,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      aiSuggestionModalData,
      setAiSuggestionModalData,
      isSummaryModalOpen,
      setIsSummaryModalOpen,
      isNewChatModalOpen,
      setIsNewChatModalOpen,
      createNewConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
