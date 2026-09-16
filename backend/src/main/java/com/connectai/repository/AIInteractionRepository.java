package com.connectai.repository;

import com.connectai.entity.AIInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIInteractionRepository extends JpaRepository<AIInteraction, Long> {

    List<AIInteraction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<AIInteraction> findByConversationIdOrderByCreatedAtDesc(Long conversationId);
}
