package com.dubber.apigateway.repository;

import com.dubber.apigateway.model.Job;
import com.dubber.apigateway.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatusIn(List<JobStatus> statuses);
}
