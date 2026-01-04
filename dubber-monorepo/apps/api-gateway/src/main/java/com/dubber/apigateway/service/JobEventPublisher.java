package com.dubber.apigateway.service;

import com.dubber.apigateway.model.Job;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.template.exchange:dubber-exchange}")
    private String exchange;

    @Value("${spring.rabbitmq.template.routing-key:job.created}")
    private String routingKey;

    public void publishJobCreatedCount(Job job) {
        log.info("Publishing Job Created Event for Job ID: {}", job.getId());

        Map<String, Object> event = new HashMap<>();
        event.put("jobId", job.getId());
        event.put("sourceObjectKey", job.getSourceObjectKey());
        event.put("targetLanguage", job.getTargetLanguage());
        event.put("optionsJson", job.getOptionsJson());
        event.put("status", job.getStatus());

        try {
            // Use default exchange for simplicity if not configured, or specific one
            rabbitTemplate.convertAndSend("job.created", event);
            // Note: In a real setup, we'd configure Exchange/Queue binding.
            // For now, simpler to send to queue 'job.created' directly (default exchange)
        } catch (Exception e) {
            log.error("Failed to publish job event", e);
            // Don't fail the request, just log.
            // In real world, we might want transactional outbox or retry.
        }
    }
}
