package com.kh.rupp_dev.studentmanagement.dto.response;

import java.time.DayOfWeek;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponse {

    private Long scheduleId;
    private String courseName; 
    private List<DayOfWeek> allowedDay;
    private String message;

}
