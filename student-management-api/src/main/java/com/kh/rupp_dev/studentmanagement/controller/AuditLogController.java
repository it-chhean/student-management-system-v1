package com.kh.rupp_dev.studentmanagement.controller;

import com.kh.rupp_dev.studentmanagement.dto.response.AuditLogResponse;
import com.kh.rupp_dev.studentmanagement.service.AuditLogService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("audit")
public class AuditLogController {
    private final AuditLogService auditLogService;
    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAll() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }
}
