package com.dubber.apigateway.web;

import com.dubber.apigateway.model.Job;
import com.dubber.apigateway.model.JobStatus;
import com.dubber.apigateway.repository.JobRepository;
import com.dubber.apigateway.service.MinioService;
import com.dubber.apigateway.service.JobEventPublisher;
import lombok.Data; // Added
// import com.dubber.apigateway.service.JobSimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Covers PatchMapping, RequestBody
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UploadController {

    private final JobRepository jobRepository;
    private final MinioService minioService;
    private final JobEventPublisher jobEventPublisher;
    // private final JobSimulationService jobSimulationService; // Removed for real
    // flow
    private static final long MAX_FILE_SIZE = 5L * 1024L * 1024L * 1024L; // 5GB
    private static final String[] ALLOWED_EXTENSIONS = { "mp4", "avi", "mkv", "mov", "flv", "webm" };

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("targetLang") String targetLang,
            @RequestParam(value = "options", required = false) String optionsJson) {

        try {
            // Validate file is not empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File is empty", "code", "FILE_EMPTY"));
            }

            // Validate file extension
            String filename = file.getOriginalFilename();
            if (filename == null || !isAllowedFile(filename)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file type. Allowed: mp4, avi, mkv, mov, flv, webm", "code",
                                "INVALID_FILE_TYPE"));
            }

            // Validate file size
            long fileSize = file.getSize();
            if (fileSize > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                        .body(Map.of(
                                "error", "File too large. Maximum size is 5GB",
                                "code", "FILE_TOO_LARGE",
                                "maxSize", "5GB",
                                "uploadedSize", String.format("%.2fMB", fileSize / (1024.0 * 1024.0))));
            }

            // Upload file
            String objectKey = minioService.upload(file);

            // Create job record
            Job.JobBuilder jobBuilder = Job.builder()
                    .sourceObjectKey(objectKey)
                    .targetLanguage(targetLang)
                    .status(JobStatus.QUEUED)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now());

            if (optionsJson != null && !optionsJson.isEmpty()) {
                jobBuilder.optionsJson(optionsJson);
            }

            Job job = jobBuilder.build();

            job = jobRepository.save(job);

            // Publish Event to RabbitMQ
            jobEventPublisher.publishJobCreatedCount(job);

            return ResponseEntity.ok(Map.of(
                    "status", "QUEUED",
                    "jobId", job.getId(),
                    "message", "File uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Upload failed: " + e.getMessage(),
                            "code", "UPLOAD_ERROR"));
        }
    }

    @GetMapping("/job/{id}")
    public ResponseEntity<?> getJob(@PathVariable("id") Long id) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Job not found", "code", "JOB_NOT_FOUND"));
        }
    }

    @GetMapping("/job/{id}/download")
    public ResponseEntity<?> getDownloadUrl(@PathVariable("id") Long id) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            if (job.getOutputObjectKey() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Output not ready yet", "code", "OUTPUT_NOT_READY"));
            }

            String url = minioService.getDownloadUrl(job.getOutputObjectKey());
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Download failed: " + e.getMessage(), "code", "DOWNLOAD_ERROR"));
        }
    }

    private boolean isAllowedFile(String filename) {
        int dotIndex = filename.lastIndexOf(".");
        if (dotIndex == -1 || dotIndex == filename.length() - 1) {
            return false; // No extension or dot at end
        }
        String extension = filename.substring(dotIndex + 1).toLowerCase();
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equals(extension)) {
                return true;
            }
        }
        return false;
    }

    @Data
    public static class UpdateJobRequest {
        private String status;
        private Integer progress;
        private String outputObjectKey;
        private String estimatedTimeRemaining;
        private String activity;
    }

    @PatchMapping("/job/{id}")
    public ResponseEntity<?> updateJob(@PathVariable("id") Long id, @RequestBody UpdateJobRequest request) {
        try {
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            if (request.getStatus() != null) {
                job.setStatus(JobStatus.valueOf(request.getStatus()));
            }
            if (request.getProgress() != null) {
                job.setProgress(request.getProgress());
            }
            if (request.getOutputObjectKey() != null) {
                job.setOutputObjectKey(request.getOutputObjectKey());
            }
            if (request.getEstimatedTimeRemaining() != null) {
                job.setEstimatedTimeRemaining(request.getEstimatedTimeRemaining());
            }
            if (request.getActivity() != null) {
                job.setActivity(request.getActivity());
            }

            job.setUpdatedAt(java.time.Instant.now());
            jobRepository.save(job);

            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Update failed: " + e.getMessage()));
        }
    }
}
