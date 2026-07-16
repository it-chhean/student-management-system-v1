package com.kh.rupp_dev.studentmanagement.service;


import com.kh.rupp_dev.studentmanagement.dto.request.ClassRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.ClassResponse;
import com.kh.rupp_dev.studentmanagement.dto.response.DepartmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClassService {

	ClassResponse create(ClassRequest request);

	Page<ClassResponse> getAll(Pageable pageable);

	ClassResponse getById(Long id);

	ClassResponse update(Long id, ClassRequest request);

    void delete(Long id);

	@Deprecated
	DepartmentResponse findByDepartmentId(Long departmentId , Long classId);

}
