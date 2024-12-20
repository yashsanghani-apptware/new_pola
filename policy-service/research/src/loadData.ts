import mongoose from 'mongoose';
import PolicyModel from './models/policy';
import { connectDB } from './config/db';

const insertSampleData = async () => {
  await connectDB();

  const policy = new PolicyModel({
    apiVersion: "api.pola.dev/v1",
    name: "ProjectManagementPolicy",
    description: "Policy for managing project roles",
    metadata: {
      annotations: {
        author: "admin",
        purpose: "Define project management roles"
      },
      hash: "abcd1234",
      sourceFile: "/path/to/source/file"
    },
    derivedRoles: {
      name: "ProjectRoleHierarchy",
      definitions: [
        {
          name: "Manager",
          parentRoles: ["TeamLead"],
          condition: {
            match: {
              all: {
                of: [
                  { expr: "P.yearsOfExperience >= 5" },
                  { expr: "P.teamSize > 10" }
                ]
              }
            }
          }
        },
        {
          name: "TeamLead",
          parentRoles: ["Engineer"],
          condition: {
            match: {
              all: {
                of: [
                  { expr: "P.yearsOfExperience >= 2" },
                  { expr: "P.certifications.includes('leadership-training')" }
                ]
              }
            }
          }
        }
      ]
    },
    auditInfo: {
      createdBy: "admin",
      createdAt: new Date(),
      updatedBy: "admin",
      updatedAt: new Date()
    }
  });

  await policy.save();
  console.log('Sample policy inserted');
  mongoose.connection.close();
};

insertSampleData().catch((err) => {
  console.error('Error inserting sample data:', err);
  mongoose.connection.close();
});

