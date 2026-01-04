package com.dubber.apigateway.service;

import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${app.minio.bucket:videos}")
    private String bucket;

    @Value("${minio.enabled:true}")
    private boolean minioEnabled;

    public String upload(MultipartFile file) {
        if (!minioEnabled) {
            return "dummy-key-" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        }
        try {
            // Check if bucket exists
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }

            String objectName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            try (InputStream is = file.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucket)
                                .object(objectName)
                                .stream(is, file.getSize(), -1)
                                .contentType(file.getContentType())
                                .build());
            }
            return objectName;
        } catch (Exception e) {
            throw new RuntimeException("MinIO upload failed: " + e.getMessage(), e);
        }
    }

    public String getDownloadUrl(String objectName) {
        if (!minioEnabled) {
            return "http://localhost:8080/dummy-download/" + objectName;
        }
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .method(Method.GET)
                            .expiry(1, TimeUnit.HOURS)
                            .build());
        } catch (Exception e) {
            throw new RuntimeException("Presigned URL failed", e);
        }
    }
}
