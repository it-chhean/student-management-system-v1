package com.kh.rupp_dev.studentmanagement.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kh.rupp_dev.studentmanagement.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

	Optional<Role> findByName(String name);

	boolean existsByName(String name);

	List<Role> findByStatus(String status);

	Optional<Role> findByNameAndStatus(String name, String name1);

	boolean existsByNameAndIdNot(String roleName, Integer id);

	Set<Role> findByIdIn(Set<Integer> uuids);
}