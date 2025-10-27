Thiết kế OVI website:

+ BE: Spring 3.4.3
+ JDK 21 hoặc 17
+ Apache Maven 3.8.8
+ Dependency: Lombok, spring-boot-starter-web, spring-boot-devtools
+ FE: html, css, js, bootstrap, template coolAdmin
+ DB: postgres
+ Tool: intellij IDEA community edition(BE), postman, docker, vscode(FE), github

+ Luu ý: 
+  git:
+ nhánh main : all project only TUHA push into this branch
+ FE branch : FE (DUCNV)
+ BE branch : BE (**TUHA AND KIENNV) pull befor push, ping orther befor push

+ chức năng cơ bản:
🖼 Hiển thị nội dung động	FE gọi API để lấy danh sách dịch vụ, tin tức
📧 Form liên hệ	Gửi dữ liệu qua API POST /api/contact
📱 Responsive	Dùng Bootstrap để hiển thị tốt trên điện thoại
🛠 Quản trị (admin)	(Tùy chọn) login + dashboard CRUD nội dung
☁️ Triển khai	Deploy  server công ty 

Chi tiết giao diện trên file Vbis profile.pdf

+ Tài liệu tham khảo cho:
BE: https://github.com/TuDuck/face_id.git nhánh main
FE: https://github.com/TuDuck/face_id.git nhánh fe

Quy tắc dùng git:
+ commit chức năng + ngày push + tên
+ Pull trước khi push
+ BE trước khi push phải nhắn cho người dev cùng check nếu có thay đổi liên quan đên file khác