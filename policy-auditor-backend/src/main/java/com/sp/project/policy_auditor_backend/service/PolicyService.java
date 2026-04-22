package com.sp.project.policy_auditor_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sp.project.policy_auditor_backend.model.AuditLog;
import com.sp.project.policy_auditor_backend.model.Policy;
import com.sp.project.policy_auditor_backend.repository.AuditLogRepository;
import com.sp.project.policy_auditor_backend.repository.PolicyRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor // Automatically injects the repositories

public class PolicyService {
    private final PolicyRepository policyRepository;
    private final AuditLogRepository auditLogRepository;

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    public List<AuditLog> getAuditHistory(Integer policyId) {
        return auditLogRepository.findByPolicyIdOrderByChangedAtDesc(policyId);
    }

    @Transactional // Ensures either both tables update or none (Data Integrity)
    public Policy updatePolicy(Integer id, Policy updatedData) {
        Policy existingPolicy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        // Audit check for Premium Amount
        if (updatedData.getPremiumAmount() != null && 
            !updatedData.getPremiumAmount().equals(existingPolicy.getPremiumAmount())) {
            
            saveAuditTrail(id, "premium_amount", 
                           existingPolicy.getPremiumAmount().toString(), 
                           updatedData.getPremiumAmount().toString());
            
            existingPolicy.setPremiumAmount(updatedData.getPremiumAmount());
        }

        // Audit check for Status
        if (updatedData.getStatus() != null && 
            !updatedData.getStatus().equals(existingPolicy.getStatus())) {
            
            saveAuditTrail(id, "status", 
                           existingPolicy.getStatus(), 
                           updatedData.getStatus());
            
            existingPolicy.setStatus(updatedData.getStatus());
        }

        return policyRepository.save(existingPolicy);
    }

    private void saveAuditTrail(Integer policyId, String field, String oldVal, String newVal) {
        AuditLog log = new AuditLog();
        log.setPolicyId(policyId);
        log.setActionType("UPDATE");
        log.setFieldName(field);
        log.setOldValue(oldVal);
        log.setNewValue(newVal);
        log.setChangedBy("Admin_User"); // In a real app, this would come from Spring Security
        auditLogRepository.save(log);
    }
}
