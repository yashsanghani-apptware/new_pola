import mongoose from 'mongoose';
import PolicyModel from './models/policy';
import { connectDB } from './config/db';
import { Policy } from './models/policy';

async function createPolicies() {
  await connectDB();

  const policiesData: Omit<Policy, keyof mongoose.Document>[] = [
    {
      apiVersion: 'api.pola.dev/v1',
      name: 'PrincipalAccessPolicy',
      description: 'Policy defining access for a specific user',
      principalPolicy: {
        principal: 'user:1234567890',
        version: '1.0.0',
        rules: [
          {
            resource: 'ari:service:region:account-id:resource/project-management',
            actions: [
              {
                action: 'READ',
                effect: 'EFFECT_ALLOW',
                condition: {
                  match: {
                    all: {
                      of: [
                        { expr: "P.department === 'engineering'" },
                        { expr: "R.projectStatus === 'active'" }
                      ]
                    }
                  }
                }
              },
              {
                action: 'DELETE',
                effect: 'EFFECT_DENY',
                condition: {
                  match: {
                    any: {
                      of: [
                        { expr: "P.role !== 'admin'" },
                        { expr: "R.sensitivityLevel > 3" }
                      ]
                    }
                  }
                }
              }
            ]
          }
        ],
        scope: 'organization-wide',
        variables: {
          import: ['departmentName', 'roleName']
        }
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      }
    },
    {
      apiVersion: 'api.pola.dev/v1',
      name: 'ResourceAccessPolicy',
      description: 'Policy defining access to resources',
      resourcePolicy: {
        resource: 'ari:service:region:account-id:resource/api-endpoint',
        version: '1.0.0',
        rules: [
          {
            actions: ['INVOKE'],
            effect: 'EFFECT_ALLOW',
            condition: {
              match: {
                all: {
                  of: [
                    { expr: "P.apiQuota < 1000" },
                    { expr: "R.endpoint === '/v1/secure-data'" }
                  ]
                }
              }
            }
          }
        ],
        scope: 'service-wide',
        variables: {
          import: ['apiQuota', 'endpoint']
        }
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      }
    },
    {
      apiVersion: 'api.pola.dev/v1',
      name: 'RoleAccessPolicy',
      description: 'Policy defining access based on roles',
      rolePolicy: {
        role: 'manager',
        version: '1.0.0',
        rules: [
          {
            resource: 'ari:service:region:account-id:resource/financial-reports',
            actions: [
              {
                action: 'READ',
                effect: 'EFFECT_ALLOW',
                condition: {
                  match: {
                    all: {
                      of: [
                        { expr: "P.role === 'manager'" },
                        { expr: "R.isPublic === true" }
                      ]
                    }
                  }
                }
              }
            ]
          }
        ],
        scope: 'organization-wide',
        variables: {
          import: ['roleName', 'isPublic']
        }
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      }
    },
    {
      apiVersion: 'api.pola.dev/v1',
      name: 'DerivedRoleHierarchy',
      description: 'Policy defining derived role hierarchy',
      derivedRoles: {
        name: 'ProjectRoleHierarchy',
        definitions: [
          {
            name: 'SeniorManager',
            parentRoles: ['Manager'],
            condition: {
              match: {
                all: {
                  of: [
                    { expr: "P.yearsOfExperience >= 10" },
                    { expr: "P.teamSize > 50" }
                  ]
                }
              }
            }
          },
          {
            name: 'Manager',
            parentRoles: ['TeamLead'],
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
            name: 'TeamLead',
            parentRoles: ['Engineer'],
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
          },
          {
            name: 'Engineer',
            parentRoles: [],
            condition: {
              match: {
                expr: "P.role === 'engineer'"
              }
            }
          }
        ]
      },
      auditInfo: {
        createdBy: 'admin',
        createdAt: new Date(),
      }
    }
  ];

  // Insert all policies into the database using the Mongoose model
  for (const policyData of policiesData) {
    const policy = new PolicyModel(policyData);
    await policy.save();
  }

  console.log('Policies created successfully!');
  mongoose.connection.close();
}

createPolicies().catch((err) => {
  console.error('Error creating policies:', err);
  mongoose.connection.close();
});

