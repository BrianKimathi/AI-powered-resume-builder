package com.resumebuilder;

import com.resumebuilder.model.Entities;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.resumebuilder.model.Template;
import com.resumebuilder.repository.TemplateRepository;

@SpringBootApplication
public class ResumeBuilderApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResumeBuilderApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder, TemplateRepository templateRepository, com.resumebuilder.repository.PlanRepository planRepository) {
        return args -> {
            if (planRepository.count() == 0) {
                planRepository.save(new com.resumebuilder.model.Plan(
                        "FREE_STARTER", "Free Starter", "Ideal for basic resume building and quick edits",
                        java.math.BigDecimal.ZERO, "USD", 10, 3, true, false, 1,
                        "[\"10 AI Generations\", \"3 PDF Exports\", \"Standard Templates\"]"
                ));
                planRepository.save(new com.resumebuilder.model.Plan(
                        "PRO_PROFESSIONAL", "Pro Professional", "Comprehensive plan for active job seekers",
                        new java.math.BigDecimal("5000"), "NGN", 500, 50, true, true, 2,
                        "[\"500 AI Generations\", \"50 PDF Exports\", \"All Premium Templates\", \"Priority Support\"]"
                ));
                planRepository.save(new com.resumebuilder.model.Plan(
                        "ENTERPRISE_UNLIMITED", "Enterprise Unlimited", "Maximum quota for recruiters and career coaches",
                        new java.math.BigDecimal("15000"), "NGN", 5000, 999, true, false, 3,
                        "[\"5000 AI Generations\", \"Unlimited PDF Exports\", \"Custom Branding\", \"Dedicated AI Architect\"]"
                ));
            }

            if (!userRepository.existsByEmail("admin@resumebuilder.com")) {
                User admin = new User();
                admin.setEmail("admin@resumebuilder.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("System Admin");
                admin.setRole(Entities.Role.ROLE_ADMIN);
                admin.setSubscriptionTier(Entities.SubscriptionTier.PRO_YEARLY);
                admin.setAiCreditsRemaining(9999);
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("user@resumebuilder.com")) {
                User user = new User();
                user.setEmail("user@resumebuilder.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setFullName("Alex Johnson");
                user.setRole(Entities.Role.ROLE_USER);
                user.setSubscriptionTier(Entities.SubscriptionTier.FREE);
                user.setAiCreditsRemaining(5);
                userRepository.save(user);
            }

            if (templateRepository.count() == 0) {
                templateRepository.save(new Template(
                        "Classic ATS Professional Resume",
                        "ATS Standard",
                        false,
                        true,
                        "# {{fullName}}\n**{{jobTitle}}** | {{location}} | {{email}} | {{phone}} | linkedin.com/in/alexjohnson\n\n## Executive Summary\n8+ years of proven expertise in talent acquisition, workforce management, labor compliance, and organizational development across enterprise teams.\n\n## Core Competencies & Skills\n* **HR & Operations**: Talent Acquisition, Employee Lifecycle Management, Workday HRIS, BambooHR, Labor Compliance\n* **Strategic Leadership**: Performance Appraisal Frameworks, Organizational Development, DEI Initiatives, Conflict Resolution\n\n## Professional Work Experience\n### Senior HR & Operations Manager | Summit Business Solutions (2021 - Present)\n* Spearheaded end-to-end talent strategy across 5 regional offices, hiring 120+ senior roles per year.\n* Reduced annual employee turnover by 18% through structured onboarding and retention workflows.\n* Implemented Workday HRIS database, boosting record accuracy to 99.8%.\n\n### Talent Acquisition Specialist | Apex Global Solutions (2018 - 2021)\n* Coordinated recruitment pipelines, screening 500+ candidates monthly across engineering and operations.\n* Led executive compensation reviews and managed employee benefits programs.\n\n## Education & Credentials\n* **Bachelor of Business Administration (BBA) in Human Resources** — University of California (Graduated 2018)\n\n## Professional Certifications & Licenses\n* **SHRM-CP** — Society for Human Resource Management (Certified 2020)\n* **CHRP** — Certified Human Resources Professional"
                ));

                templateRepository.save(new Template(
                        "Modern Technical Architecture Resume",
                        "Technology",
                        true,
                        true,
                        "# {{fullName}}\n### {{jobTitle}}\nSan Francisco, CA • {{email}} • github.com/alexjohnson-dev • +1 (555) 019-2834\n\n> Senior Full Stack Software Architect with 7+ years of experience engineering high-concurrency microservices, cloud infrastructure, and reactive UI platforms.\n\n--- \n### Technical Stack & Core Skills\n* **Languages & Frameworks**: Java 21, Spring Boot 3, TypeScript, React 18, Python, Node.js\n* **Cloud & Infrastructure**: PostgreSQL, Docker, Kubernetes, AWS (EC2, S3, ECS), Redis, Kafka\n\n--- \n### Professional Work Experience\n#### Lead Software Architect | CloudScale Systems Inc. (2021 - Present)\n* Reduced API response times by 38% by redesigning database queries and introducing Redis caching.\n* Architected distributed event-driven pipeline processing 85,000 requests/sec with 99.99% uptime.\n* Mentored a team of 8 software engineers across Spring Boot and React projects.\n\n#### Senior Backend Developer | Enterprise Solutions Corp (2018 - 2021)\n* Built reactive REST API services serving 200,000+ active daily users.\n* Streamlined CI/CD deployment pipelines using GitHub Actions and Kubernetes.\n\n--- \n### Featured Technical Projects\n* **Cloud Infrastructure Automation Engine**: Java / Docker based engine for real-time cluster provisioning.\n* **High-Frequency Transaction Processing Pipeline**: Spring Boot / PostgreSQL pipeline for financial ledgers.\n\n--- \n### Education & Certifications\n* **B.S. in Computer Science** — Stanford University (2014 - 2018)\n* **AWS Certified Solutions Architect – Associate** (2021)"
                ));

                templateRepository.save(new Template(
                        "Healthcare & Modern Dual-Column (Alex Ellison)",
                        "Healthcare",
                        false,
                        true,
                        "# Alex Ellison\n**Registered Nurse** | 6300 Villa Forte Road, Dallas, TX | (469) 203-1515 | alx_vcd_sd@gmail.com\n\n## Profile\nPassionate and dedicated nurse with over six years of healthcare experience in a variety of medical settings, including private family practices, emergency units, ICU, neonatal units, geriatric units, and rehabilitation centers.\n\n## Core Skills & Clinical Competencies\n* **Patient Advocacy**: High-level patient care and ethical advocacy\n* **Interpersonal Communication**: Effective team collaboration and patient communication\n* **Trauma & ER Experience**: Adept in emergency response and acute care protocols\n* **Medical Terminology**: Proficient in clinical documentation and procedures\n\n## Employment History\n### Nursing Assistant | St. Joseph's Medical Center, Dallas\n*October 2019 – July 2021*\n* Worked to the best of my ability with an interdisciplinary team to provide optimum care to patients.\n* Assisted patients with admittance and release.\n* Assisted an average of 12 patients per shift with daily living activities, maintaining a 100% satisfaction score.\n* Reduced patient call light response times by 30% through proactive rounding.\n\n### Float Nurse | University of Iowa Medical Center, Iowa City\n*September 2017 – September 2019*\n* Provided high level patient care during heavy patient load periods needing additional personnel.\n* Assisted hospital staff and other RNs in day-to-day tasks in accordance with patient care plans."
                ));
            }
        };
    }
}
