package com.connectai.config;

import com.connectai.entity.*;
import com.connectai.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with initial data.");
            return;
        }

        log.info("Seeding database with initial demo users and project conversations...");

        // 1. Seed Users
        User abdul = User.builder()
                .fullName("Abdul Mannan")
                .username("abdulmannan")
                .email("abdul@connectai.app")
                .passwordHash(passwordEncoder.encode("pass123"))
                .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .bio("AKGEC IT Final Year | Full Stack Developer | ConnectAI Lead")
                .provider(User.AuthProvider.LOCAL)
                .online(true)
                .lastSeen(LocalDateTime.now())
                .build();

        User aditya = User.builder()
                .fullName("Aditya Maurya")
                .username("adityamaurya")
                .email("aditya@connectai.app")
                .passwordHash(passwordEncoder.encode("pass123"))
                .profileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .bio("AKGEC IT Final Year | AI/ML & Distributed Systems Enthusiast")
                .provider(User.AuthProvider.LOCAL)
                .online(true)
                .lastSeen(LocalDateTime.now())
                .build();

        User mentor = User.builder()
                .fullName("Mr. Sudhakar Dwivedi")
                .username("sudhakardwivedi")
                .email("sudhakar@connectai.app")
                .passwordHash(passwordEncoder.encode("pass123"))
                .profileImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150")
                .bio("Assistant Professor, Department of IT, AKGEC | Project Mentor")
                .provider(User.AuthProvider.LOCAL)
                .online(false)
                .lastSeen(LocalDateTime.now().minusMinutes(45))
                .build();

        User coordinator = User.builder()
                .fullName("Dr. Neha Sharma")
                .username("nehasharma")
                .email("neha@connectai.app")
                .passwordHash(passwordEncoder.encode("pass123"))
                .profileImage("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                .bio("Project Evaluation Head & Coordinator, AKGEC")
                .provider(User.AuthProvider.LOCAL)
                .online(true)
                .lastSeen(LocalDateTime.now())
                .build();

        User demoUser = User.builder()
                .fullName("Demo Evaluator")
                .username("demouser")
                .email("demo@connectai.app")
                .passwordHash(passwordEncoder.encode("pass123"))
                .profileImage("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150")
                .bio("Reviewer / Evaluator Account for ConnectAI Demonstration")
                .provider(User.AuthProvider.LOCAL)
                .online(true)
                .lastSeen(LocalDateTime.now())
                .build();

        userRepository.saveAll(Arrays.asList(abdul, aditya, mentor, coordinator, demoUser));

        // 2. Seed 1-on-1 Direct Conversation between Abdul & Aditya
        Conversation directConv = Conversation.builder()
                .isGroup(false)
                .createdBy(abdul)
                .build();
        directConv = conversationRepository.save(directConv);

        ConversationParticipant part1 = ConversationParticipant.builder()
                .conversation(directConv)
                .user(abdul)
                .role(ConversationParticipant.ParticipantRole.MEMBER)
                .build();

        ConversationParticipant part2 = ConversationParticipant.builder()
                .conversation(directConv)
                .user(aditya)
                .role(ConversationParticipant.ParticipantRole.MEMBER)
                .build();
        participantRepository.saveAll(Arrays.asList(part1, part2));

        Message m1 = Message.builder()
                .conversation(directConv)
                .sender(aditya)
                .content("Hey Abdul! Have you integrated the AI smart replies and translation suite for our ConnectAI presentation?")
                .type(Message.MessageType.TEXT)
                .isRead(true)
                .build();

        Message m2 = Message.builder()
                .conversation(directConv)
                .sender(abdul)
                .content("Yes Aditya! All AI features (Smart Reply, 6-Tone Rewrite, 7+ Language Translation, Conversation Summarization) are fully working with human-in-the-loop review.")
                .type(Message.MessageType.TEXT)
                .isRead(true)
                .build();

        messageRepository.saveAll(Arrays.asList(m1, m2));

        // 3. Seed Group Chat: "AKGEC IT Major Project 2026-27"
        Conversation groupConv = Conversation.builder()
                .title("AKGEC IT Major Project 2026-27")
                .isGroup(true)
                .createdBy(abdul)
                .build();
        groupConv = conversationRepository.save(groupConv);

        Group group = Group.builder()
                .conversation(groupConv)
                .name("AKGEC IT Major Project 2026-27")
                .description("Official project group for ConnectAI B.Tech IT Final Year 2026-2027.")
                .groupImage("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150")
                .createdBy(abdul)
                .build();
        groupRepository.save(group);

        List<ConversationParticipant> groupParts = Arrays.asList(
                ConversationParticipant.builder().conversation(groupConv).user(abdul).role(ConversationParticipant.ParticipantRole.ADMIN).build(),
                ConversationParticipant.builder().conversation(groupConv).user(aditya).role(ConversationParticipant.ParticipantRole.MEMBER).build(),
                ConversationParticipant.builder().conversation(groupConv).user(mentor).role(ConversationParticipant.ParticipantRole.MEMBER).build(),
                ConversationParticipant.builder().conversation(groupConv).user(coordinator).role(ConversationParticipant.ParticipantRole.MEMBER).build()
        );
        participantRepository.saveAll(groupParts);

        Message gm1 = Message.builder()
                .conversation(groupConv)
                .sender(mentor)
                .content("Good afternoon team. Please ensure all architectural artifacts and live WebSocket latency metrics are ready for review.")
                .type(Message.MessageType.TEXT)
                .isRead(true)
                .build();

        Message gm2 = Message.builder()
                .conversation(groupConv)
                .sender(abdul)
                .content("Good afternoon sir! The Spring Boot 3.2 backend with STOMP WebSockets, PostgreSQL/H2, JWT security, and React frontend is fully verified.")
                .type(Message.MessageType.TEXT)
                .isRead(true)
                .build();

        messageRepository.saveAll(Arrays.asList(gm1, gm2));

        // 4. Seed Initial Notification
        Notification notif = Notification.builder()
                .user(abdul)
                .title("Welcome to ConnectAI")
                .content("Your AI-assisted human communication workspace is active. Explore smart replies, rewrites, and translations.")
                .type(Notification.NotificationType.SYSTEM)
                .isRead(false)
                .build();
        notificationRepository.save(notif);

        log.info("Database seeding completed successfully.");
    }
}
