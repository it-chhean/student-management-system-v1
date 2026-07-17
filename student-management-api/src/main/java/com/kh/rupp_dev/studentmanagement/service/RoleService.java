package com.kh.rupp_dev.studentmanagement.service;

import java.util.List;

import com.kh.rupp_dev.studentmanagement.dto.request.AssignPermissionRequest;
import com.kh.rupp_dev.studentmanagement.dto.request.RoleRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.RoleResponse;
import org.apache.poi.ss.formula.eval.IntersectionEval;

public interface RoleService {

	RoleResponse create(RoleRequest request);

	RoleResponse update(Integer id , RoleRequest request);

	List<RoleResponse> findAll();

	RoleResponse findById(Integer id);

	void updateStatus(Integer id, String status);

	List<RoleResponse> findByActive(String status);

	RoleResponse addPermission(Integer roleId , AssignPermissionRequest request);

	RoleResponse setPermission(Integer roleId , AssignPermissionRequest request);

	void deletePermission(Integer roleId , Integer permissionId);

}
