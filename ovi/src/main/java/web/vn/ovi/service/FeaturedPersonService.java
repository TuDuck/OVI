package web.vn.ovi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.dto.FeaturedPersonDto;
import web.vn.ovi.repository.FeaturedPersonRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FeaturedPersonService {
    @Autowired
    private FeaturedPersonRepository featuredPersonRepository;

    public List<FeaturedPersonDto> getAll(){
        return featuredPersonRepository.findAll();
    }

    // 🟢 Lấy theo ID
    public Optional<FeaturedPersonDto> getById(Integer id) {
        return featuredPersonRepository.findById(id);
    }

    // 🟢 Thêm mới
    public FeaturedPersonDto create(FeaturedPersonDto personDto) {
        personDto.setId(null); // tránh ghi đè ID cũ
        return featuredPersonRepository.save(personDto);
    }

    // 🟢 Cập nhật
    public FeaturedPersonDto update(Integer id, FeaturedPersonDto personDto) {
        return featuredPersonRepository.findById(id)
                .map(existing -> {
                    existing.setName(personDto.getName());
                    existing.setRole(personDto.getRole());
                    existing.setDescription(personDto.getDescription());
                    existing.setImageData(personDto.getImageData());
                    existing.setType(personDto.getType());
                    existing.setStatus(personDto.getStatus());
                    existing.setUpdatedAt(personDto.getUpdatedAt());
                    return featuredPersonRepository.save(existing);
                })
                .orElse(null);
    }

    // 🟢 Xóa
    public boolean delete(Integer id) {
        if (featuredPersonRepository.existsById(id)) {
            featuredPersonRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
