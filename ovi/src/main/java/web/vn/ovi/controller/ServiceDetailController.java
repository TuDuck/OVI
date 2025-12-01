package web.vn.ovi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.vn.ovi.entity.dto.ServiceDetailDto;
import web.vn.ovi.repository.ServiceDetailRepository;
import web.vn.ovi.service.ServiceDetailService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServiceDetailController {

    @Autowired
    private ServiceDetailService serviceDetailService;

    @Autowired
    private ServiceDetailRepository serviceDetailRepository;

    // Lấy tất cả service details
    @GetMapping("/service-details")
    public ResponseEntity<List<ServiceDetailDto>> getAllServiceDetails() {
        return ResponseEntity.ok(serviceDetailService.findAll());
    }

    // Lấy theo id
    @GetMapping("/service-details/{id}")
    public ResponseEntity<ServiceDetailDto> getServiceDetailById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceDetailService.findById(id));
    }

    // Tạo mới
    @PostMapping("/service-details")
    public ResponseEntity<ServiceDetailDto> createServiceDetail(@RequestBody ServiceDetailDto serviceDetailDto) {
        return ResponseEntity.ok(serviceDetailService.create(serviceDetailDto));
    }

    // Cập nhật
    @PutMapping("/service-details/{id}")
    public ResponseEntity<ServiceDetailDto> updateServiceDetail(@PathVariable Long id,
                                                                @RequestBody ServiceDetailDto serviceDetailDto) {
        return ResponseEntity.ok(serviceDetailService.update(id, serviceDetailDto));
    }

    // Xóa
    @DeleteMapping("/service-details/{id}")
    public ResponseEntity<Void> deleteServiceDetail(@PathVariable Long id) {
        serviceDetailService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Tìm kiếm với paging
    @GetMapping("/service-details/search")
    public ResponseEntity<Page<ServiceDetailDto>> searchServiceDetails(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(serviceDetailService.search(keyword, page, size));
    }

    // Lấy tất cả service details theo service_id
    @GetMapping("/services/{serviceId}/details")
    public ResponseEntity<List<ServiceDetailDto>> getDetailsByServiceId(@PathVariable Long serviceId) {
        return ResponseEntity.ok(serviceDetailService.findByServiceId(serviceId));
    }
}
