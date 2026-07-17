import { describe, it, expect } from 'vitest';
import { RegistryValidator } from '../src/index';
import path from 'path';

describe('RegistryValidator', () => {
  it('should validate a correct skill YAML object', () => {
    const schemaPath = path.resolve(__dirname, '../../../registry/schema/skill.schema.json');
    const validator = new RegistryValidator(schemaPath);
    
    const validSkill = {
      name: 'test-skill',
      version: '1.0.0',
      status: 'STABLE',
      description: 'A test skill',
      categories: ['test'],
      triggers: ['test trigger'],
      related_skills: [],
      conflicting_skills: [],
      primary_tools: ['test-tool'],
      minimum_inputs: ['test input'],
      verification_required: true,
      last_reviewed: '2026-07-17'
    };
    
    expect(validator.validateSkill(validSkill)).toBe(true);
  });

  it('should reject an invalid skill YAML object', () => {
    const schemaPath = path.resolve(__dirname, '../../../registry/schema/skill.schema.json');
    const validator = new RegistryValidator(schemaPath);
    
    const invalidSkill = {
      name: 'test-skill',
      // missing version, status
      description: 'A test skill'
    };
    
    expect(validator.validateSkill(invalidSkill)).toBe(false);
  });
});
