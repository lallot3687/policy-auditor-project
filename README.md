🛡️ PolicyAuditor: Full-Stack Insurance Oversight System
A modern, full-stack enterprise application designed to manage insurance policies with a high-integrity Audit Logging system. Built to demonstrate proficiency in Java Spring Boot, MySQL, and React.

🚀 Key Features
Automated Audit Trail: Every change to a policy (Premium or Status) is automatically detected and logged with "Old vs. New" value snapshots.

Real-time Dashboard: A responsive UI built with React and Tailwind CSS for instant policy oversight.

RESTful API: Robust backend endpoints handling CRUD operations and history retrieval.

Relational Persistence: Structured data management using MySQL and Spring Data JPA.

🛠️ Tech Stack
Backend: Java 21, Spring Boot 3, Spring Data JPA, Hibernate.

Frontend: React.js, Tailwind CSS, Axios, Lucide-React.

Database: MySQL 8.0.

Tools: VS Code, Git, Maven.

📸 System Preview
<img width="1030" height="923" alt="image" src="https://github.com/user-attachments/assets/fbeaac92-5a46-4c9a-84e3-a5a302339233" />

<img width="969" height="898" alt="image" src="https://github.com/user-attachments/assets/36e97800-1a50-4ecb-a79e-cea538485fd5" />

<img width="1070" height="928" alt="image" src="https://github.com/user-attachments/assets/b61946ed-1f66-4de6-9f96-ec068377faf0" />


⚙️ Logic Highlight: The Audit Service
The core value of this project is the AuditLogService. Instead of simply updating records, the system:

Fetches the existing record from MySQL.

Compares incoming changes against current values.

If a mismatch is found, it generates a log entry in the audit_logs table before saving.

SQL
-- Example Audit Log Entry
Field: premium_amount | Old: 1500.00 | New: 1750.00 | Action: UPDATE
🔨 Setup Instructions
Database: Create a MySQL database named policy_db.

Backend: Update application.properties with your MySQL password and run ./mvnw spring-boot:run.

Frontend: Run npm install followed by npm run dev in the frontend folder.
