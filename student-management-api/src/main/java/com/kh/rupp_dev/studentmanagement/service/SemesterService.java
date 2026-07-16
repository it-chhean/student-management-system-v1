package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.dto.request.SemesterRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.SemesterResponse;

import java.util.List;

public interface SemesterService {

    SemesterResponse create(SemesterRequest request);

    SemesterResponse update(Long id , SemesterRequest request);

    void delete(Long id);

    List<SemesterResponse> getAll();

    SemesterResponse getById(Long id);

}
