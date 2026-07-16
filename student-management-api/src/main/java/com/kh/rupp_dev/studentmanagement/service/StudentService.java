package com.kh.rupp_dev.studentmanagement.service;

import java.io.IOException;

import com.kh.rupp_dev.studentmanagement.dto.response.ClassResponse;
import com.kh.rupp_dev.studentmanagement.dto.request.ImportStudentRequest;
import com.kh.rupp_dev.studentmanagement.dto.request.StudentRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.StudentResponse;
import com.kh.rupp_dev.studentmanagement.dto.response.StudentStatisticsResponse;
import com.kh.rupp_dev.studentmanagement.dto.response.UploadBatchesResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface StudentService {

	StudentResponse create(StudentRequest request);

	StudentResponse getById(Long id);

	Page<StudentResponse> getAll(Pageable pageable);

	StudentResponse update(Long id, StudentRequest request);

	void delete(Long id);

	ClassResponse getClassByStudentId(Long id);

	UploadBatchesResponse importStudents(ImportStudentRequest request) throws IOException;

	StudentStatisticsResponse statistics();

}
