import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';

export class RegistryValidator {
  private ajv: Ajv;
  private schema: any;

  constructor(schemaPath: string) {
    this.ajv = new Ajv();
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  }

  public validateSkill(skillYaml: any): boolean {
    const validate = this.ajv.compile(this.schema);
    const valid = validate(skillYaml);
    if (!valid) {
      console.error(validate.errors);
      return false;
    }
    return true;
  }
}
