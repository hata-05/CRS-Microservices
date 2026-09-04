package vn.edu.crs.registrationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.crs.registrationservice.client.CourseClient;
import vn.edu.crs.registrationservice.dto.CourseDTO;
import vn.edu.crs.registrationservice.dto.RegistrationRequestDTO;
import vn.edu.crs.registrationservice.dto.RegistrationResponseDTO;
import vn.edu.crs.registrationservice.entity.Registration;
import vn.edu.crs.registrationservice.repository.RegistrationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String DA_DANG_KY = "DA_DANG_KY";
    private static final String DA_HUY = "DA_HUY";

    private final RegistrationRepository registrationRepository;
    private final CourseClient courseClient;

    public Registration register(RegistrationRequestDTO dto) {
        if (registrationRepository.existsByStudentIdAndCourseIdAndTrangThai(dto.getStudentId(), dto.getCourseId(), DA_DANG_KY)) {
            throw new IllegalStateException("Sinh vien da dang ky mon hoc nay roi");
        }

        courseClient.reserveSeat(dto.getCourseId());

        Registration registration = new Registration();
        registration.setStudentId(dto.getStudentId());
        registration.setCourseId(dto.getCourseId());
        registration.setTrangThai(DA_DANG_KY);
        registration.setNgayDangKy(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public void cancel(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay dang ky id = " + registrationId));

        if (DA_HUY.equals(registration.getTrangThai())) {
            throw new IllegalStateException("Dang ky nay da duoc huy truoc do");
        }

        courseClient.releaseSeat(registration.getCourseId());
        registration.setTrangThai(DA_HUY);
        registrationRepository.save(registration);
    }

    // Lấy danh sách đăng ký và ghép tên môn học + số tín chỉ từ course-service
    public List<RegistrationResponseDTO> getMyRegistrations(Long studentId) {
        List<Registration> registrations = registrationRepository.findByStudentId(studentId);

        return registrations.stream()
                .filter(reg -> DA_DANG_KY.equals(reg.getTrangThai()))
                .map(reg -> {
                    RegistrationResponseDTO dto = new RegistrationResponseDTO();
                    dto.setId(reg.getId());
                    dto.setStudentId(reg.getStudentId());
                    dto.setCourseId(reg.getCourseId());
                    dto.setTrangThai(reg.getTrangThai());
                    dto.setNgayDangKy(reg.getNgayDangKy());

                    // Gọi course-service xin thông tin chi tiết
                    CourseDTO course = courseClient.getCourseById(reg.getCourseId());
                    if (course != null) {
                        dto.setTenMonHoc(course.getTenMonHoc());
                        dto.setSoTinChi(course.getSoTinChi());
                    } else {
                        dto.setTenMonHoc("N/A");
                        dto.setSoTinChi(0);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}