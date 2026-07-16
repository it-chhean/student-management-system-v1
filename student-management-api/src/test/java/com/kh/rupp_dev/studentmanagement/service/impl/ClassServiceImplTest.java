package com.kh.rupp_dev.studentmanagement.service.impl;

import com.kh.rupp_dev.studentmanagement.dto.request.DepartmentRequest;
import com.kh.rupp_dev.studentmanagement.entity.Class;
import com.kh.rupp_dev.studentmanagement.repository.ClassRepository;
import com.kh.rupp_dev.studentmanagement.repository.DepartmentRepository;
import com.kh.rupp_dev.studentmanagement.service.ClassService;
import com.kh.rupp_dev.studentmanagement.service.DepartmentService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;

class ClassServiceImplTest {

    @Mock
    private ClassRepository classRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private ClassService classService;

    @InjectMocks
    private DepartmentService departmentService;

    @Test
    void create_shouldReturnSavedClass() {

        DepartmentRequest request = new DepartmentRequest();
        request.setName("Department Name");
        request.setDescription("Department Description");
        request.setThumbnail(null);



        Class clazz = new Class();
        clazz.setDepartment(null);
        clazz.setName("Class Name");

        Class saveClass = classRepository.save(clazz);

        assertEquals("Class Name", saveClass.getName());

    }
}