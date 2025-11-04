package web.vn.ovi.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.vn.ovi.entity.dto.ServiceDto;
import web.vn.ovi.repository.ServiceRepository;
import web.vn.ovi.service.ServiceService;

import java.util.List;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private ServiceRepository serviceRepository;

    // Lấy toàn bộ services
    @GetMapping("/services")
    public ResponseEntity<List<ServiceDto>> getAllServices() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    // Lấy theo id
    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Integer id) {
        return ResponseEntity.ok(serviceService.findById(id));
    }

    // Tạo mới
    @PostMapping("/services")
    public ResponseEntity<ServiceDto> createService(@RequestBody ServiceDto serviceDto) {
        return ResponseEntity.ok(serviceService.create(serviceDto));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceDto> updateService(@PathVariable Integer id, @RequestBody ServiceDto serviceDto) {
        return ResponseEntity.ok(serviceService.update(id, serviceDto));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/services/search")
    public ResponseEntity<Page<ServiceDto>> searchServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(serviceService.search(keyword, page, size));
    }
}