package com.dubber.apigateway.service;

import com.dubber.apigateway.model.Job;
import com.dubber.apigateway.model.JobStatus;
import com.dubber.apigateway.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
// No longer using @Service or @Component here as it's disabled for real flow

import java.util.List;
import java.util.Random;

// @Service
@RequiredArgsConstructor
@Slf4j
public class JobSimulationService {

    private final JobRepository jobRepository;
    private final Random random = new Random();

    @Scheduled(fixedRate = 2000) // Run every 2 seconds
    public void simulateProgress() {
        List<Job> activeJobs = jobRepository.findByStatusIn(List.of(JobStatus.QUEUED, JobStatus.PROCESSING));

        for (Job job : activeJobs) {
            updateJobProgress(job);
        }
    }

    private void updateJobProgress(Job job) {
        if (job.getStatus() == JobStatus.QUEUED) {
            job.setStatus(JobStatus.PROCESSING);
            job.setProgress(0);
            log.info("Job {} started processing", job.getId());
        }

        int currentProgress = job.getProgress() == null ? 0 : job.getProgress();
        int increment = 5 + random.nextInt(15); // Random increment 5-20%
        int newProgress = Math.min(100, currentProgress + increment);

        job.setProgress(newProgress);
        log.info("Job {} progress: {}%", job.getId(), newProgress);

        if (newProgress >= 100) {
            job.setStatus(JobStatus.COMPLETED);
            // Simulate output file generation
            if (job.getOutputObjectKey() == null) {
                // Use a dummy key if MinIO is disabled or for simulation
                job.setOutputObjectKey(job.getSourceObjectKey());
            }
            log.info("Job {} completed", job.getId());
        }

        jobRepository.save(job);
    }
}
