package web.vn.ovi.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.dto.ServiceDto;
import web.vn.ovi.repository.ServiceRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public ServiceDto create(ServiceDto serviceDto) {
        serviceDto.setCreatedAt(LocalDateTime.now());
        return serviceRepository.save(serviceDto);
    }

    public List<ServiceDto> findAll() {
        return serviceRepository.findAll();
    }

    public ServiceDto findById(Integer id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy service id = " + id));
    }

    public ServiceDto update(Integer id, ServiceDto dto) {
        ServiceDto existing = findById(id);
        existing.setTitle(dto.getTitle());
        existing.setShortDescription(dto.getShortDescription());
        existing.setDescription(dto.getDescription());
        existing.setImageData(dto.getImageData());
        existing.setStatus(dto.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        return serviceRepository.save(existing);
    }

    public void delete(Integer id) {
        serviceRepository.deleteById(id);
    }

    public Page<ServiceDto> search(String keyword, int page, int size) {
        Specification<ServiceDto> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return serviceRepository.findAll(spec, pageable);
    }
}
