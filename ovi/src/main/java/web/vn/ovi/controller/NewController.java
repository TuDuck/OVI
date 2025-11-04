package web.vn.ovi.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.vn.ovi.service.NewService;
import web.vn.ovi.entity.dto.NewsDto;
import web.vn.ovi.repository.NewRepository;


import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NewController {
    @Autowired
    private NewService newService;
    @Autowired
    private NewRepository newRepository;

    @GetMapping("/news")
    public ResponseEntity<List<NewsDto>> getAllNews() {
        return ResponseEntity.ok(newService.findAll());
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<NewsDto> getNewById(@PathVariable Long id) {
        return ResponseEntity.ok(newService.findById(id));
    }

    @PostMapping("news")
    public ResponseEntity<NewsDto> create(@RequestBody NewsDto news) {
        return ResponseEntity.ok(newService.create(news));
    }

    @PutMapping("/news/{id}")
    public ResponseEntity<NewsDto> update(@PathVariable Long id, @RequestBody NewsDto news) {
        return ResponseEntity.ok(newService.update(id, news));
    }

    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/news/search")
    public ResponseEntity<Page<NewsDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(newService.search(keyword, page, size));
    }
}
