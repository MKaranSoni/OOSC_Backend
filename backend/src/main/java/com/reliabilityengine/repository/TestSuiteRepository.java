package com.reliabilityengine.repository;

import com.reliabilityengine.entity.TestSuite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TestSuiteRepository extends JpaRepository<TestSuite, UUID> {
}
