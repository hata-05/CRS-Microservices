package vn.edu.crs.registrationservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationResponseDTO {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String tenMonHoc;
    private Integer soTinChi;
    private String trangThai;
    private LocalDateTime ngayDangKy;
}