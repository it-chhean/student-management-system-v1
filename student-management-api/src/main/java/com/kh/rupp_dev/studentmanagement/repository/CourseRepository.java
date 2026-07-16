package com.kh.rupp_dev.studentmanagement.repository;

import com.kh.rupp_dev.studentmanagement.entity.Course;
import com.kh.rupp_dev.studentmanagement.entity.composite.CourseId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course , CourseId> {
}
