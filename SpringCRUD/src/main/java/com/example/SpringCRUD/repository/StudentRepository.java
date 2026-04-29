package com.example.SpringCRUD.repository;

import com.example.SpringCRUD.model.Student;

import java.util.List;
import java.util.Optional;

public interface StudentRepository {

    int save(Student student);
    List<Student> findAll();
    Optional<Student> findById(int id);
    int update(int id, Student student);
    int deleteById(int id);
}