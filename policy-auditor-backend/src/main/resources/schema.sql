-- 1. Create the database (Optional - run if you haven't created one yet)
-- CREATE DATABASE policy_auditor;
-- USE policy_auditor;

-- 2. Drop tables if they exist (For clean re-initialization during development)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS policies;

-- 3. Create the main Policies table
CREATE TABLE policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    holder_name VARCHAR(100) NOT NULL,
    premium_amount DECIMAL(15, 2) NOT NULL,
    policy_type VARCHAR(50) NOT NULL, -- LIFE, MEDICAL, MOTOR, TRAVEL
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, LAPSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Create the Audit Logs table
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    field_name VARCHAR(50), 
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(50) DEFAULT 'System_Admin',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
);

-- 5. Seed Data for Policies (10 Records)
INSERT INTO policies (policy_number, holder_name, premium_amount, policy_type, status) VALUES
('POL-2026-001', 'Ahmad Razak', 1500.00, 'LIFE', 'ACTIVE'),
('POL-2026-002', 'Siti Aminah', 450.50, 'MOTOR', 'ACTIVE'),
('POL-2026-003', 'Tan Wei Kiat', 2100.00, 'MEDICAL', 'ACTIVE'),
('POL-2026-004', 'Letchumi Devi', 320.00, 'TRAVEL', 'INACTIVE'),
('POL-2026-005', 'Kevin Wong', 1800.75, 'LIFE', 'ACTIVE'),
('POL-2026-006', 'Nurul Izzah', 550.00, 'MOTOR', 'LAPSED'),
('POL-2026-007', 'Chong Ming', 3000.00, 'MEDICAL', 'ACTIVE'),
('POL-2026-008', 'Sarah Jenkins', 120.00, 'TRAVEL', 'ACTIVE'),
('POL-2026-009', 'Muhammad Ali', 1650.00, 'LIFE', 'INACTIVE'),
('POL-2026-010', 'Deepak Kumar', 680.20, 'MOTOR', 'ACTIVE');

-- 6. Seed Data for Audit Logs (10 Records showing realistic history)
INSERT INTO audit_logs (policy_id, action_type, field_name, old_value, new_value, changed_by) VALUES
(1, 'INSERT', 'ALL', NULL, 'Initial Record Created', 'System'),
(2, 'UPDATE', 'premium_amount', '400.00', '450.50', 'admin_siti'),
(3, 'UPDATE', 'status', 'PENDING', 'ACTIVE', 'manager_tan'),
(4, 'UPDATE', 'status', 'ACTIVE', 'INACTIVE', 'system_auto'),
(5, 'UPDATE', 'premium_amount', '1700.00', '1800.75', 'agent_kevin'),
(6, 'UPDATE', 'status', 'ACTIVE', 'LAPSED', 'billing_dept'),
(7, 'INSERT', 'ALL', NULL, 'New Medical Policy Added', 'System'),
(2, 'UPDATE', 'status', 'INACTIVE', 'ACTIVE', 'admin_siti'),
(9, 'UPDATE', 'status', 'ACTIVE', 'INACTIVE', 'user_request'),
(10, 'UPDATE', 'premium_amount', '650.00', '680.20', 'system_adjust');