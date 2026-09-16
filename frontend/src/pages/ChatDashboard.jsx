import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import AiAssistantPanel from '../components/AiAssistantPanel';
import AiSuggestionModal from '../components/AiSuggestionModal';
import SummaryModal from '../components/SummaryModal';
import NewChatModal from '../components/NewChatModal';

export default function ChatDashboard() {
  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar />

      {/* Main 3-Column Workspace (Adaptive via CSS Media Queries) */}
      <div className="dashboard-layout">
        {/* Left: Contacts / Conversation List */}
        <Sidebar />

        {/* Center: Real-time Chat Feed & Message Composer */}
        <ChatArea />

        {/* Right: AI Assistance Tools Drawer / Side-panel */}
        <AiAssistantPanel />
      </div>

      {/* Human-in-the-Loop AI Suggestion Confirmation Modal */}
      <AiSuggestionModal />

      {/* AI Conversation Summary Modal */}
      <SummaryModal />

      {/* New Conversation Modal */}
      <NewChatModal />
    </div>
  );
}
