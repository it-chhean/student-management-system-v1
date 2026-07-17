package com.kh.rupp_dev.studentmanagement.service.impl;

import com.kh.rupp_dev.studentmanagement.dto.request.AssignPermissionRequest;
import com.kh.rupp_dev.studentmanagement.dto.request.RoleRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.RoleResponse;
import com.kh.rupp_dev.studentmanagement.entity.Permission;
import com.kh.rupp_dev.studentmanagement.entity.Role;
import com.kh.rupp_dev.studentmanagement.entity.User;
import com.kh.rupp_dev.studentmanagement.exception.DuplicateResourceException;
import com.kh.rupp_dev.studentmanagement.exception.ResourceNotFoundException;
import com.kh.rupp_dev.studentmanagement.mapper.RoleMapper;
import com.kh.rupp_dev.studentmanagement.repository.PermissionRepository;
import com.kh.rupp_dev.studentmanagement.repository.RoleRepository;
import com.kh.rupp_dev.studentmanagement.security.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.harmony.pack200.NewAttributeBands;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kh.rupp_dev.studentmanagement.service.RoleService;
import lombok.AllArgsConstructor;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepository;
	private final RoleMapper roleMapper;
	private final AuthService authService;
	private final PermissionRepository permissionRepository;

	@Override
	public RoleResponse create(RoleRequest request) {

		if (roleRepository.existsByName(request.getName())) {
			log.info("Role already exists with the name {}", request.getName());
			throw new DuplicateResourceException("Role name already exists");
		}

		Role role = roleMapper.toEntity(request);
		String roleName = request.getName().toUpperCase();
		if (!roleName.startsWith("ROLE_")) {
			roleName = "ROLE_" + roleName;
		}

		role.setName(roleName);
		if (request.getUserIds() != null) {
			Set<User> users = request.getUserIds().stream()
					.map(userId -> {
						User user = authService.getUser(userId);
                        if (user.getRoles().contains(role)) {
                            throw new DuplicateResourceException("Role already exists");
                        }
						return user;
					})
					.collect(Collectors.toSet());
			role.setUsers(users);
		}
		Role saved = roleRepository.save(role);
		log.info("Role created with id {}", saved.getId());
		return toResponse(saved);
	}

	@Override
	public RoleResponse update(Integer id, RoleRequest request) {
		Role role = findByOrThrow(id);

		if (request.getName() != null) {
			String roleName = request.getName().toUpperCase();
			if (!roleName.startsWith("ROLE_")) {
				roleName = "ROLE_" + roleName;
			}
			if (roleRepository.existsByNameAndIdNot(roleName, id)) {
				log.info("Role already exists with the name {}", roleName);
				throw new IllegalArgumentException("Role name already exists");
			}
			request.setName(roleName);
		}

		roleMapper.updateFromRequest(role, request);

		if(request.getUserIds() != null && !request.getUserIds().isEmpty()) {
			Set<User> users = request.getUserIds()
					.stream()
					.map(authService::getUser)
					.collect(Collectors.toSet());
			role.setUsers(users);
		}else {
			role.setUsers(new HashSet<>());
		}

		Role saved = roleRepository.save(role);
		log.info("Role updated with id {}", saved.getId());
		return toResponse(role);
	}

	@Override
	public List<RoleResponse> findAll() {
		List<Role> roles = roleRepository.findAll();
		log.info("Roles found with all {}", roles);
		return roles.stream()
				.map(this::toResponse)
				.toList();
	}

	@Override
	public RoleResponse findById(Integer id) {
		Role role = findByOrThrow(id);
		log.info("Role found with id {}", role.getId());
		return toResponse(role);
	}

	@Override
	public void updateStatus(Integer id, String status) {
		Role role = findByOrThrow(id);
		role.setStatus(status);
		roleRepository.save(role);
	}

	@Override
	public List<RoleResponse> findByActive(String status) {
		List<Role> roles = roleRepository.findByStatus(status);
		log.info("Roles found with status {}", roles);
		return roles.stream()
				.map(this::toResponse)
				.toList();
	}

	@Override
	public RoleResponse addPermission(Integer roleId, AssignPermissionRequest request) {
		Role role = findByOrThrow(roleId);
		Set<Permission> permissions = permissionRepository.findByIdIn(request.getPermissionIds());
		role.getPermissions().addAll(permissions);
		Role saved = roleRepository.save(role);
		log.info("Role added with id {}" , saved.getId());
		return toResponse(saved);
	}

	@Override
	public RoleResponse setPermission(Integer roleId, AssignPermissionRequest request) {
		Role role = findByOrThrow(roleId);
		Set<Permission> permissions = permissionRepository.findByIdIn(request.getPermissionIds());
		role.getPermissions().clear();
		role.getPermissions().addAll(permissions);
		log.info("Role added with id {}" , role.getId());
		Role saved = roleRepository
				.save(role);
		return toResponse(saved);
	}

	@Override
	public void deletePermission(Integer roleId, Integer permissionId) {
		Role role = findByOrThrow(roleId);
		role.getPermissions().removeIf(permission -> false);
		roleRepository.save(role);
	}

	private Role findByOrThrow(Integer roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
	}

	private RoleResponse toResponse(Role role) {
		RoleResponse response = roleMapper.toResponse(role);
		if(role.getUsers() != null && !role.getUsers().isEmpty()) {
			List<Integer> uuids = role.getUsers().stream()
					.map(User::getId)
					.toList();
			response.setUserIds(uuids);
		}
		return response;
	}
}
