package com.kh.rupp_dev.studentmanagement.service.impl;

import com.kh.rupp_dev.studentmanagement.dto.response.AuditLogResponse;
import com.kh.rupp_dev.studentmanagement.mapper.AuditLogMapper;
import com.kh.rupp_dev.studentmanagement.repository.AuditLogRepository;
import com.kh.rupp_dev.studentmanagement.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    public List<AuditLogResponse> getAllLogs() {
        return auditLogRepository.findAll()
                .stream()
                .map(auditLogMapper::toResponse)
                .toList();
    }
}

