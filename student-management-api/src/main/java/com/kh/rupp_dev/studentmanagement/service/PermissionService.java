package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.dto.request.PermissionRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.PermissionResponse;

import java.util.List;

public interface PermissionService {

    PermissionResponse create(PermissionRequest request);

    PermissionResponse update(Long id , PermissionRequest request);

    void delete(Long id);

    List<PermissionResponse> getAll();

    PermissionResponse getById(Long id);

    List<PermissionResponse> findByModule(String module);
}