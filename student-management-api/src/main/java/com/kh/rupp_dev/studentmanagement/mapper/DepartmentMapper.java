package com.kh.rupp_dev.studentmanagement.mapper;

import com.kh.rupp_dev.studentmanagement.dto.request.DepartmentRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.DepartmentResponse;
import com.kh.rupp_dev.studentmanagement.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequest request) {
        if (request == null) {
            return null;
        }

        Department department = new Department();
        department.setName(request.getName());
        department.setDescription(request.getDescription());
        return department;
    }

    public DepartmentResponse toResponse(Department department) {
        if (department == null) {
            return null;
        }

        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .code(department.getCode())
                .thumbnail(department.getThumbnail())
                .description(department.getDescription())
                .build();
    }

    public void updateFromRequest(DepartmentRequest request, Department department) {
        if (request == null) {
            return;
        }

        if (request.getName() != null) {
            department.setName(request.getName());
        }
        if (request.getDescription() != null) {
            department.setDescription(request.getDescription());
        }
    }
}
