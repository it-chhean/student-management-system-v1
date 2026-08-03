package com.kh.rupp_dev.studentmanagement.repository;

import java.util.Optional;

import com.kh.rupp_dev.studentmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

	boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

}
