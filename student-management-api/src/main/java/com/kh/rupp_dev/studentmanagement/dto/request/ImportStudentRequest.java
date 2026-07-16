package com.kh.rupp_dev.studentmanagement.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportStudentRequest {

    private String classId;
    private MultipartFile file;

}
