package vn.edu.crs.registrationservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import vn.edu.crs.registrationservice.dto.CourseDTO;

@Component
@RequiredArgsConstructor
public class CourseClient {

    private final RestTemplate restTemplate;

    @Value("${course-service.base-url}")
    private String courseServiceBaseUrl;

    /**
     * Gọi sang course-service để lấy chi tiết môn học (tên, số tín chỉ)
     */
    public CourseDTO getCourseById(Long courseId) {
        String url = courseServiceBaseUrl + "/courses/" + courseId;
        try {
            return restTemplate.getForObject(url, CourseDTO.class);
        } catch (Exception e) {
            return null;
        }
    }

    public void reserveSeat(Long courseId) {
        String url = courseServiceBaseUrl + "/internal/courses/" + courseId + "/reserve-seat";
        try {
            restTemplate.exchange(url, HttpMethod.PUT, null, Void.class);
        } catch (HttpClientErrorException.Conflict e) {
            throw new IllegalStateException("Mon hoc da het cho");
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalStateException("Mon hoc khong ton tai");
        } catch (HttpClientErrorException e) {
            throw new IllegalStateException("Loi tu course-service: " + e.getStatusCode());
        } catch (HttpServerErrorException | org.springframework.web.client.ResourceAccessException e) {
            throw new IllegalStateException("Khong the ket noi toi course-service, vui long thu lai sau");
        }
    }

    public void releaseSeat(Long courseId) {
        String url = courseServiceBaseUrl + "/internal/courses/" + courseId + "/release-seat";
        try {
            restTemplate.exchange(url, HttpMethod.PUT, null, Void.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalStateException("Mon hoc khong ton tai");
        } catch (HttpClientErrorException e) {
            throw new IllegalStateException("Loi tu course-service: " + e.getStatusCode());
        } catch (HttpServerErrorException | org.springframework.web.client.ResourceAccessException e) {
            throw new IllegalStateException("Khong the ket noi toi course-service, vui long thu lai sau");
        }
    }
}