package com.kh.rupp_dev.studentmanagement.repository;

import com.kh.rupp_dev.studentmanagement.entity.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {

    Optional<ClassSchedule> findByCourseId(Long courseId);

}
