package com.kh.rupp_dev.studentmanagement.dto.request;


public record CheckInRequest(
        Long classId,
        Long studentId,
        String token
) {}
