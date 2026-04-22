package com.sp.project.policy_auditor_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sp.project.policy_auditor_backend.model.AuditLog;
import com.sp.project.policy_auditor_backend.model.Policy;
import com.sp.project.policy_auditor_backend.service.PolicyService;

@RestController
@RequestMapping("/api/policies")
// CrossOrigin allows your React app (on port 5173) to talk to this Java API
@CrossOrigin(origins = "http://localhost:5173") 
public class PolicyController {

    private final PolicyService policyService;

    // Manual Constructor for Dependency Injection
    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    // 1. Get all policies for the dashboard
    @GetMapping
    public List<Policy> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    // 2. Get the audit history for a specific policy
    @GetMapping("/{id}/history")
    public List<AuditLog> getHistory(@PathVariable Integer id) {
        return policyService.getAuditHistory(id);
    }

    // 3. Update a policy (this triggers the audit logic in the service)
    @PutMapping("/{id}")
    public Policy updatePolicy(@PathVariable Integer id, @RequestBody Policy policy) {
        return policyService.updatePolicy(id, policy);
    }
}