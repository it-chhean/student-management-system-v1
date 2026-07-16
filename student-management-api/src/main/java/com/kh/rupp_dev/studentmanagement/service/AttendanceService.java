package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.dto.request.CreateScheduleRequest;
import com.kh.rupp_dev.studentmanagement.dto.request.StartSessionRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.AttendanceSessionResponse;
import com.kh.rupp_dev.studentmanagement.dto.response.ScheduleResponse;

public interface AttendanceService {

    ScheduleResponse createSchedule(CreateScheduleRequest request);

    AttendanceSessionResponse startSession(StartSessionRequest request, String instructorId);

    void closeSession(Long sessionId, String instructorId);

}
