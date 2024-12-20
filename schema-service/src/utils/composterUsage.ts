import { SchemaAnalyst } from '../services/schemaAnalyst'; // Correct import path for SchemaAnalyst
import { connectDB } from '../config/database'; // Assuming db.ts initializes MongoDB
import mongoose from 'mongoose';

async function runSchemaAnalyst() {
  try {
    // Initialize MongoDB connection
    await connectDB();

    // Instantiate the SchemaAnalyst
    const schemaAnalyst = new SchemaAnalyst();

    // 1. Detect Redundant Components
    console.log('Detecting redundant components...');
    const redundantComponents = await schemaAnalyst.detectRedundantComponents();
    console.log('Usage 1: Redundant Components:', redundantComponents);

    // 2. Analyze Component Versions
    const componentName = 'match'; // Example component name
    console.log(`Usage 2: Analyzing versions for component: ${componentName}`);
    const componentVersions = await schemaAnalyst.analyzeComponentVersions(componentName);
    console.log('Component Versions:', componentVersions);

    // 3. Circular Dependency Checker
    console.log('Detecting circular dependencies...');
    const circularDependencies = await schemaAnalyst.detectCircularDependencies();
    console.log('Usage 3: Circular Dependencies:', circularDependencies);

    // 4. Find Unused Components
    console.log('Finding unused components...');
    const unusedComponents = await schemaAnalyst.findUnusedComponents();
    console.log('Usage 4: Unused Components:', unusedComponents);

    // 5. Analyze Component Impact
    const definitionName = 'matchExprList'; // Example definition name
    const definitionVersion = '2.6'; // Example version
    console.log(`Analyzing impact of ${definitionName} v${definitionVersion}`);
    const componentImpact = await schemaAnalyst.analyzeComponentImpact(definitionName, definitionVersion);
    console.log('Usage 5: Component Impact:', componentImpact);

    // 6. Component Usage Frequency Analysis
    console.log('Analyzing component usage frequency...');
    const usageFrequency = await schemaAnalyst.componentUsageFrequency();
    console.log('Usage 6: Component Usage Frequency:', usageFrequency);

    // 7. Deprecate a Component
    console.log(`Deprecating component: ${definitionName} v${definitionVersion}`);
    await schemaAnalyst.deprecateComponent(definitionName, definitionVersion);
    console.log(`Usage 7: Component ${definitionName} v${definitionVersion} has been deprecated.`);

    // 8. Compare Component Versions
    const version1 = '2.7';
    const version2 = '2.6';
    console.log(`Comparing ${definitionName} versions: ${version1} and ${version2}`);
    const versionComparison = await schemaAnalyst.compareComponentVersions(definitionName, version1, version2);
    console.log('Usage 8: Version Comparison:', versionComparison);

    // 9. Get Audit Trail for Component
    console.log(`Fetching audit trail for ${definitionName} v${definitionVersion}`);
    const auditTrail = await schemaAnalyst.getAuditTrail(definitionName, definitionVersion);
    console.log('Usage 9: Audit Trail:', auditTrail);

  } catch (error) {
    console.error('Error:', (error as Error).message);
  } finally {
    // Step 3: Disconnect from MongoDB
    await mongoose.disconnect();
  }
}
runSchemaAnalyst();

