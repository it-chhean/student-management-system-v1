package com.kh.rupp_dev.studentmanagement.controller;

import com.kh.rupp_dev.studentmanagement.dto.request.CreateScheduleRequest;
import com.kh.rupp_dev.studentmanagement.dto.request.StartSessionRequest;
import com.kh.rupp_dev.studentmanagement.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/schedule")
    public ResponseEntity<?> createSchedule(@RequestBody CreateScheduleRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.createSchedule(request));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/session/start")
    public ResponseEntity<?> startSession(
            @RequestBody StartSessionRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        try {
            String instructureId = userDetails.getUsername();
            return ResponseEntity.ok(attendanceService.startSession(request, instructureId));
        }catch (IllegalStateException e)  {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "INVALID_REQUEST", "message", e.getMessage()));
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "NOUT_FOUND", "message", e.getMessage()));
        }
    }

    @PatchMapping("/session/close")
    public ResponseEntity<?> closeSession(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        try {
            attendanceService.closeSession(id, userDetails.getUsername());
            return ResponseEntity.ok(Map.of("message", "Session closed successfully."));
        }catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "FORBIDDEN", "message", e.getMessage()));
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "NOT_FOUND", "message", e.getMessage()));
        }
    }
}