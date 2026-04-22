package com.sp.project.policy_auditor_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sp.project.policy_auditor_backend.model.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
    List<AuditLog> findByPolicyIdOrderByChangedAtDesc(Integer policyId);
}
