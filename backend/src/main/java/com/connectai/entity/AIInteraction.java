package com.connectai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long conversationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeatureType featureType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String promptText;

    @Column(columnDefinition = "TEXT")
    private String responseText;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum FeatureType {
        SMART_REPLY,
        REWRITE,
        TRANSLATE,
        SUMMARIZE,
        MODERATE
    }
}
