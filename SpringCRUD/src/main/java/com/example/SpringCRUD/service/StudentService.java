package com.example.SpringCRUD.service;

import com.example.SpringCRUD.model.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {

    Student           createStudent(Student student);
    List<Student>     getAllStudents();
    Optional<Student> getStudentById(int id);
    Student           updateStudent(int id, Student student);
    void              deleteStudent(int id);
}