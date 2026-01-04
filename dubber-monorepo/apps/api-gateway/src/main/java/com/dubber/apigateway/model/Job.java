package com.dubber.apigateway.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sourceObjectKey; // MinIO key for input video
    private String outputObjectKey; // MinIO key for output video
    private String targetLanguage;
    @Builder.Default
    private String optionsJson = "{}";

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Builder.Default
    private Integer progress = 0;

    @Builder.Default
    private String estimatedTimeRemaining = "Waiting...";

    @Builder.Default
    private String activity = "Queued";

    private Instant createdAt;
    private Instant updatedAt;
}
