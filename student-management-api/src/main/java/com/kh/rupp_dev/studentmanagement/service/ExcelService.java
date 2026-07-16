package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.entity.Student;
import com.kh.rupp_dev.studentmanagement.entity.UploadBatches;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

public interface ExcelService {

    List<Student> importStudents(MultipartFile file , UploadBatches request) throws IOException;

    ByteArrayInputStream exportStudent(Long classId);

}
