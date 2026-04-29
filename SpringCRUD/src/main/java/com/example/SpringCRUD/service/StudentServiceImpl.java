package com.example.SpringCRUD.service;

import com.example.SpringCRUD.exception.ResourceNotFoundException;
import com.example.SpringCRUD.model.Student;
import com.example.SpringCRUD.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public Student createStudent(Student student) {
        int generatedId = studentRepository.save(student);
        student.setId(generatedId);
        return student;
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Optional<Student> getStudentById(int id) {
        return studentRepository.findById(id);
    }

    @Override
    public Student updateStudent(int id, Student student) {
        studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + id));

        studentRepository.update(id, student);
        student.setId(id);
        return student;
    }

    @Override
    public void deleteStudent(int id) {
        studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with id: " + id));

        studentRepository.deleteById(id);
    }
}