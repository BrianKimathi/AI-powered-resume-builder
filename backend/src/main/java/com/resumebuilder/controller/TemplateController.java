package com.resumebuilder.controller;

import com.resumebuilder.model.Template;
import com.resumebuilder.repository.TemplateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/templates")
public class TemplateController {

    private final TemplateRepository templateRepository;

    public TemplateController(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates() {
        return ResponseEntity.ok(templateRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
        return templateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Template> createTemplate(@RequestBody Template template) {
        if (template.getIsActive() == null) template.setIsActive(true);
        if (template.getIsPremium() == null) template.setIsPremium(false);

        // Prevent 500 error on duplicate unique template name constraint
        List<Template> existing = templateRepository.findAll();
        for (Template t : existing) {
            if (t.getName() != null && t.getName().equalsIgnoreCase(template.getName())) {
                if (template.getCategory() != null) t.setCategory(template.getCategory());
                if (template.getDescription() != null) t.setDescription(template.getDescription());
                if (template.getIsPremium() != null) t.setIsPremium(template.getIsPremium());
                return ResponseEntity.ok(templateRepository.save(t));
            }
        }

        Template saved = templateRepository.save(template);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Template> updateTemplate(@PathVariable Long id, @RequestBody Template updated) {
        return templateRepository.findById(id)
                .map(existing -> {
                    if (updated.getName() != null) existing.setName(updated.getName());
                    if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
                    if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
                    if (updated.getThumbnailUrl() != null) existing.setThumbnailUrl(updated.getThumbnailUrl());
                    if (updated.getIsPremium() != null) existing.setIsPremium(updated.getIsPremium());
                    if (updated.getIsActive() != null) existing.setIsActive(updated.getIsActive());
                    if (updated.getDefaultStructureJson() != null) existing.setDefaultStructureJson(updated.getDefaultStructureJson());
                    return ResponseEntity.ok(templateRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        if (!templateRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        templateRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
