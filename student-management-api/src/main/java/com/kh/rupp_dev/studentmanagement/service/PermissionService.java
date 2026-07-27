package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.dto.request.PermissionRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.PermissionResponse;

import java.util.List;

public interface PermissionService {

    PermissionResponse create(PermissionRequest request);

    PermissionResponse update(Integer id , PermissionRequest request);

    void delete(Integer id);

    List<PermissionResponse> getAll();

    PermissionResponse getById(Integer id);

    List<PermissionResponse> findByModule(String module);
}