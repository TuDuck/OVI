package web.vn.ovi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.vn.ovi.entity.ContactMessage;
import web.vn.ovi.entity.dto.ContactDto;
import web.vn.ovi.service.ContactService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/contact")
    public ResponseEntity<ContactMessage> createContact(@RequestBody ContactMessage contact) {
        return ResponseEntity.ok(contactService.save(contact));
    }

    @GetMapping("/contact")
    public ResponseEntity<List<ContactMessage>> getAllContacts() {
        return ResponseEntity.ok(contactService.findAll());
    }

    @GetMapping("/contact/{id}")
    public ResponseEntity<ContactMessage> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.findById(id));
    }
    @PutMapping("/contact/{id}")
    public ResponseEntity<ContactMessage> updateContact(@PathVariable Long id, @RequestBody ContactDto dto) {
        return ResponseEntity.ok(contactService.update(id, dto));
    }
    @GetMapping("/contact/search")
    public ResponseEntity<Page<ContactMessage>> searchContacts(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(contactService.search(status, name, page, size));
    }
    @DeleteMapping("/contact/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}