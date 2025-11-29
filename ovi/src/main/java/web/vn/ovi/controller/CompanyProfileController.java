package web.vn.ovi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import web.vn.ovi.entity.dto.CompanyProfileDto;
import web.vn.ovi.service.CompanyProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class CompanyProfileController {

    private final CompanyProfileService service;

    // UPLOAD FILE
    @PostMapping("/company-profile")
    public ResponseEntity<?> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("companyName") String companyName,
            @RequestParam(value = "description", required = false) String description
    ) {
        try {
            CompanyProfileDto saved = service.uploadProfile(file, companyName, description);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    // DOWNLOAD FILE
    @GetMapping("/company-profile/{id}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        CompanyProfileDto profile = service.getProfile(id);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        // Trả về JSON chứa base64
        return ResponseEntity.ok(profile.getFileData());
    }

    // GET ALL
    @GetMapping("/company-profile")
    public ResponseEntity<List<CompanyProfileDto>> getAll() {
        return ResponseEntity.ok(service.getAllProfiles());
    }

    // DELETE
    @DeleteMapping("/company-profile/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean deleted = service.deleteProfile(id);
        if (!deleted) {
            return ResponseEntity.badRequest().body("Profile not found");
        }
        return ResponseEntity.ok("Deleted successfully");
    }
}
