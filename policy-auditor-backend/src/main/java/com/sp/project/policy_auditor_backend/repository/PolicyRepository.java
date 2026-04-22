package com.sp.project.policy_auditor_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sp.project.policy_auditor_backend.model.Policy;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Integer> {
    Optional<Policy> findByPolicyNumber(String policyNumber);
    
}
