package com.connectai.repository;

import com.connectai.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT DISTINCT c FROM Conversation c " +
           "JOIN c.participants p " +
           "WHERE p.user.id = :userId " +
           "ORDER BY c.updatedAt DESC")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c " +
           "WHERE c.isGroup = false AND " +
           "EXISTS (SELECT p1 FROM ConversationParticipant p1 WHERE p1.conversation = c AND p1.user.id = :user1Id) AND " +
           "EXISTS (SELECT p2 FROM ConversationParticipant p2 WHERE p2.conversation = c AND p2.user.id = :user2Id)")
    Optional<Conversation> findDirectConversationBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
