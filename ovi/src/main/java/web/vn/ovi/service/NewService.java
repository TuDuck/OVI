package web.vn.ovi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.dto.NewsDto;
import web.vn.ovi.repository.NewRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewService {
    @Autowired
    private NewRepository newRepository;

    public NewsDto create(NewsDto news) {
        news.setCreatedAt(LocalDateTime.now());
        return newRepository.save(news);
    }

    public List<NewsDto> findAll() {
        return newRepository.findAll();
    }

    public NewsDto findById(Long id) {
        return newRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy news id = " + id));
    }

    public NewsDto update(Long id, NewsDto dto) {
        NewsDto existing = findById(id);
        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setAuthor(dto.getAuthor());
        existing.setSummary(dto.getSummary());
        existing.setImageData(dto.getImageData());
        existing.setStatus(dto.getStatus());
        existing.setCategory(dto.getCategory());
        existing.setViews(dto.getViews());
        existing.setFeatured(dto.getFeatured());
        existing.setLink(dto.getLink());
        existing.setUpdatedAt(LocalDateTime.now());
        return newRepository.save(existing);
    }

    public void delete(Long id) {
        newRepository.deleteById(id);
    }

    public Page<NewsDto> search(String keyword, int page, int size) {
        Specification<NewsDto> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return newRepository.findAll(spec, pageable);
    }
}
