package com.kh.rupp_dev.studentmanagement.dto.response;

import com.kh.rupp_dev.studentmanagement.constant.UploadBatchesStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadBatchesResponse {

    private Long id;

    private Integer userId;

    private String username;

    private String fileName;

    private UploadBatchesStatus status;

    private Integer totalRow;

    private Integer successRow;

    private Integer failRow;

    private LocalDateTime createAt;

    private LocalDateTime completedAt;
}
