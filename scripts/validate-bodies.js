#!/usr/bin/env node

/**
 * Body Configuration Validation Script
 * 
 * This script validates all JSON files in the /bodies directory
 * against the BodyConfiguration schema defined in @yellorn/types
 */

const fs = require('fs');
const path = require('path');

// Import schema validation
// Note: In production, this would import from the built types package
const validateBodyConfiguration = (config) => {
  // Basic validation - replace with actual schema validation
  const required = ['id', 'name', 'version', 'metadata', 'embodiment', 'behaviors', 'permissions'];
  
  for (const field of required) {
    if (!config[field]) {
      return { isValid: false, errors: [`Missing required field: ${field}`] };
    }
  }
  
  // Validate ID format
  if (!/^[a-zA-Z0-9_-]+$/.test(config.id)) {
    return { isValid: false, errors: ['ID must contain only alphanumeric characters, underscores, and hyphens'] };
  }
  
  // Validate version format
  if (!/^\d+\.\d+\.\d+$/.test(config.version)) {
    return { isValid: false, errors: ['Version must follow semantic versioning (e.g., 1.0.0)'] };
  }
  
  return { isValid: true, errors: [] };
};

const validateBodies = () => {
  const bodiesDir = path.join(__dirname, '../bodies');
  
  if (!fs.existsSync(bodiesDir)) {
    console.error('❌ Bodies directory not found!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(bodiesDir).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('ℹ️  No body configuration files found in /bodies directory');
    return;
  }
  
  console.log(`🔍 Validating ${files.length} body configuration file(s)...\n`);
  
  let totalErrors = 0;
  let validFiles = 0;
  
  for (const file of files) {
    const filePath = path.join(bodiesDir, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(content);
      
      const validation = validateBodyConfiguration(config);
      
      if (validation.isValid) {
        console.log(`✅ ${file} - Valid`);
        validFiles++;
      } else {
        console.log(`❌ ${file} - Invalid:`);
        validation.errors.forEach(error => {
          console.log(`   • ${error}`);
        });
        totalErrors += validation.errors.length;
      }
    } catch (error) {
      console.log(`❌ ${file} - JSON Parse Error:`);
      console.log(`   • ${error.message}`);
      totalErrors++;
    }
  }
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`   ✅ Valid files: ${validFiles}`);
  console.log(`   ❌ Invalid files: ${files.length - validFiles}`);
  console.log(`   🐛 Total errors: ${totalErrors}`);
  
  if (totalErrors > 0) {
    console.log(`\n💡 Please fix the errors above before submitting your contribution.`);
    console.log(`📖 See /bodies/README.md for schema documentation.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All body configurations are valid!`);
  }
};

// Additional validation functions
const validateSchema = (config) => {
  // TODO: Implement full schema validation using Zod or Joi
  return { isValid: true, errors: [], warnings: [] };
};

const validateSecurity = (config) => {
  const warnings = [];
  
  // Check for potential security issues
  if (config.permissions?.canModifyEnvironment) {
    warnings.push('Agent has environment modification permissions - ensure this is intentional');
  }
  
  if (config.permissions?.canAccessExternalAPIs) {
    warnings.push('Agent has external API access - ensure proper rate limiting');
  }
  
  if (config.permissions?.maxResourceUsage?.maxCpuUsage > 50) {
    warnings.push('High CPU usage limit - may impact performance');
  }
  
  return { warnings };
};

const validatePerformance = (config) => {
  const warnings = [];
  
  // Check for performance concerns
  if (config.embodiment?.appearance?.materials?.particleCount > 10000) {
    warnings.push('High particle count may impact performance');
  }
  
  if (config.behaviors?.movement?.maxSpeed > 100) {
    warnings.push('Very high movement speed may cause physics issues');
  }
  
  return { warnings };
};

// Run validation if script is called directly
if (require.main === module) {
  validateBodies();
}

module.exports = {
  validateBodies,
  validateBodyConfiguration,
  validateSchema,
  validateSecurity,
  validatePerformance
};
