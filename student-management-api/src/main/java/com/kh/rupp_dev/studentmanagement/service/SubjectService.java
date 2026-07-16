package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.dto.request.SubjectRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.SubjectResponse;

import java.util.List;

public interface SubjectService {

    SubjectResponse create(SubjectRequest request);

    List<SubjectResponse> getAll();

    SubjectResponse getById(Long id);

    SubjectResponse update(Long id, SubjectRequest request);

    void delete(Long id);
}
