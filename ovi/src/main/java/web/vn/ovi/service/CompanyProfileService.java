package web.vn.ovi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import web.vn.ovi.repository.CompanyProfileRepository;
import web.vn.ovi.entity.dto.CompanyProfileDto;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private final CompanyProfileRepository repository;

    public CompanyProfileDto uploadProfile(
            MultipartFile file,
            String companyName,
            String description
    ) throws IOException {

        CompanyProfileDto profile = new CompanyProfileDto();
        profile.setCompanyName(companyName);
        profile.setDescription(description);
        profile.setFileName(file.getOriginalFilename());
        profile.setFileType(file.getContentType());
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        profile.setFileData(base64);
        profile.setCreatedAt(LocalDateTime.now());

        return repository.save(profile);
    }

    public CompanyProfileDto getProfile(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<CompanyProfileDto> getAllProfiles() {
        return repository.findAll();
    }

    public boolean deleteProfile(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}
