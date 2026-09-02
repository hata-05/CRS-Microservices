package vn.edu.crs.course_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.course_service.service.CourseService;

@RestController
@RequestMapping("/internal/courses")
@RequiredArgsConstructor
public class InternalCourseController {

    private final CourseService courseService;

    @PutMapping("/{id}/reserve-seat")
    public ResponseEntity<Void> reserveSeat(@PathVariable Long id) {
        courseService.reserveSeat(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/release-seat")
    public ResponseEntity<Void> releaseSeat(@PathVariable Long id) {
        courseService.releaseSeat(id);
        return ResponseEntity.ok().build();
    }
}