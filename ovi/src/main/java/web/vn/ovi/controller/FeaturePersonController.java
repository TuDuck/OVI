package web.vn.ovi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.vn.ovi.entity.dto.FeaturedPersonDto;
import web.vn.ovi.entity.dto.ServiceDto;
import web.vn.ovi.service.FeaturedPersonService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FeaturePersonController {
    @Autowired
    private FeaturedPersonService featuredPersonService;

    @GetMapping("/featuredPerson")
    public ResponseEntity<List<FeaturedPersonDto>> findByType(@RequestParam String type) {
        return ResponseEntity.ok(featuredPersonService.findByType(type));
    }

    // 🟢 Lấy theo ID
    @GetMapping("featuredPerson/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return featuredPersonService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Tạo mới
    @PostMapping("/featuredPerson")
    public ResponseEntity<FeaturedPersonDto> create(@RequestBody FeaturedPersonDto person) {
        return ResponseEntity.ok(featuredPersonService.create(person));
    }

    // 🟢 Cập nhật
    @PutMapping("featuredPerson/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody FeaturedPersonDto person) {
        FeaturedPersonDto updated = featuredPersonService.update(id, person);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // 🟢 Xóa
    @DeleteMapping("featuredPerson/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        boolean deleted = featuredPersonService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping("/featuredPerson/search")
    public ResponseEntity<Page<FeaturedPersonDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(featuredPersonService.search(keyword,type, page, size));
    }

}
