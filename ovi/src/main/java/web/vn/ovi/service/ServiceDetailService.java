package web.vn.ovi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.dto.ServiceDetailDto;
import web.vn.ovi.repository.ServiceDetailRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceDetailService {

    @Autowired
    private ServiceDetailRepository serviceDetailRepository;

    // Tạo mới
    public ServiceDetailDto create(ServiceDetailDto dto) {
        dto.setCreatedAt(LocalDateTime.now());
        return serviceDetailRepository.save(dto);
    }

    // Lấy tất cả
    public List<ServiceDetailDto> findAll() {
        return serviceDetailRepository.findAll();
    }

    // Lấy theo id
    public ServiceDetailDto findById(Long id) {
        return serviceDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ServiceDetail id = " + id));
    }

    // Cập nhật
    public ServiceDetailDto update(Long id, ServiceDetailDto dto) {
        ServiceDetailDto existing = findById(id);
        existing.setServiceId(dto.getServiceId());
        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setContentType(dto.getContentType());
        existing.setImageData(dto.getImageData());
        existing.setSidePlace(dto.getSidePlace());
        existing.setUpdatedAt(LocalDateTime.now());
        return serviceDetailRepository.save(existing);
    }

    // Xóa
    public void delete(Long id) {
        serviceDetailRepository.deleteById(id);
    }

    // Tìm kiếm
    public Page<ServiceDetailDto> search(String keyword, int page, int size) {
        Specification<ServiceDetailDto> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return serviceDetailRepository.findAll(spec, pageable);
    }

    // Lấy theo serviceId
    public List<ServiceDetailDto> findByServiceId(Long serviceId) {
        return serviceDetailRepository.findByServiceId(serviceId);
    }
}
