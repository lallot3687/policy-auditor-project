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
<img width="1262" height="933" alt="image" src="https://github.com/user-attachments/assets/ed15099a-0dd6-4ad8-bf54-f0dc37ffee40" />

<img width="1277" height="933" alt="image" src="https://github.com/user-attachments/assets/ce6b988f-8e8a-4a1f-9af2-9cd38d19d49a" />

<img width="1266" height="925" alt="image" src="https://github.com/user-attachments/assets/4bce2022-3421-4599-86d9-ad07360d0b11" />

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
