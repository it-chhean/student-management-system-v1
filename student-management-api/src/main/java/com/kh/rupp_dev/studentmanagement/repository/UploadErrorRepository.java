package com.kh.rupp_dev.studentmanagement.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kh.rupp_dev.studentmanagement.entity.UploadError;

@Repository
public interface UploadErrorRepository extends JpaRepository<UploadError, Long> {

}
