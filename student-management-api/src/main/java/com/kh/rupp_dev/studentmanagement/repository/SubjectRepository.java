package com.kh.rupp_dev.studentmanagement.repository;

import com.kh.rupp_dev.studentmanagement.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    @Query(value = "SELECT nextval('subject_code_seq')" ,nativeQuery = true)
    Long getNextSequenceSubject();
}
