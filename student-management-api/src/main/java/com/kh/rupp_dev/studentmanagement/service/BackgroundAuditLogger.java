package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.entity.AuditLog;
import com.kh.rupp_dev.studentmanagement.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BackgroundAuditLogger {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(AuditLog auditLog) {
        auditLogRepository.save(auditLog);
    }

}
