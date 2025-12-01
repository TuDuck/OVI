package web.vn.ovi.entity.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_details")
@Getter
@Setter
public class ServiceDetailDto {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "service_details_seq")
    @SequenceGenerator(
            name = "service_details_seq",
            sequenceName = "service_details_seq",
            allocationSize = 1
    )
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "content_type", length = 50, nullable = false)
    private String contentType;

    @Column(name = "imagedata", columnDefinition = "text")
    private String imageData;

    @Column(name = "side_place")
    private Integer sidePlace = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
