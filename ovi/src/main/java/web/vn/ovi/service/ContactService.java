package web.vn.ovi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.ContactMessage;
import web.vn.ovi.entity.dto.ContactDto;
import web.vn.ovi.repository.ContactRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;
    public ContactMessage save(ContactDto dto) {
        ContactMessage message = ContactMessage.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .message(dto.getMessage())
                .createdAt(LocalDateTime.now())
                .status(0)
                .build();

        return contactRepository.save(message);
    }
    public ContactMessage save(ContactMessage contact) {
        contact.setStatus(0);
        return contactRepository.save(contact);
    }
    public List<ContactMessage> findAll() {
        return contactRepository.findAll();
    }
    public ContactMessage findById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contact id = " + id));
    }
    public ContactMessage update(Long id, ContactDto dto) {
        ContactMessage existing = findById(id);
        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setMessage(dto.getMessage());
        existing.setStatus(dto.getStatus());
        return contactRepository.save(existing);
    }
    public List<ContactMessage> searchByStatusAndName(int status, String name) {
        return contactRepository.findByStatusAndNameContainingIgnoreCase(status, name);
    }
    public void delete(Long id) {
        contactRepository.deleteById(id);
    }
}
