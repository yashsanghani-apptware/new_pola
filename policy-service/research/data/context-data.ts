// context-data.ts

const context = {
  user: {
    roles: ['admin'],
    age: 28,
    experienceYears: 5,
    department: 'IT',
    permissions: ['read', 'write'],
    location: 'remote',
    lastLogin: new Date('2023-08-01T14:48:00Z'),
    createdAt: new Date('2020-01-15T09:30:00Z'),
    hasMFA: true,
    preferredLanguage: 'en-US',
    completedTrainings: ['security', 'compliance'],
    certifications: ['AWS Certified Solutions Architect'],
    isActive: true,
    manager: 'user456',
    lastPasswordChange: new Date('2024-01-10T10:00:00Z'),
    securityClearance: 'top-secret',
    jobTitle: 'Senior Developer',
    employeeId: 'E12345',
    officeLocation: 'Building A',
    projectAssignments: ['ProjectX', 'ProjectY'],
    skills: ['JavaScript', 'TypeScript', 'Python'],
    securityGroups: ['groupA', 'groupB'],
    timeZone: 'PST',
    hireDate: new Date('2018-07-01T09:00:00Z'),
    probationStatus: 'Completed',
    directReports: ['user789', 'user101'],
    favoriteTech: ['Docker', 'Kubernetes'],
    deviceId: 'D98765',
    hasAccessToSensitiveData: true,
    completedCourses: ['Ethics', 'Data Privacy'],
    salaryBand: 'G8',
    performanceRating: 'Exceeds Expectations',
    vacationBalanceDays: 15,
    hasPendingApprovals: false,
    languageProficiency: ['English', 'Spanish'],
    isOnCall: true,
    workFromHomeEligibility: true
  },
  resource: {
    type: 'image',
    size: 500,
    accessLevel: 'confidential',
    owner: 'admin',
    createdBy: 'user123',
    tags: ['internal', 'projectA'],
    lastAccessed: new Date('2024-08-01T18:30:00Z'),
    retentionPeriodDays: 365,
    isEncrypted: true,
    region: 'us-west-2',
    category: 'classified',
    sharedWith: ['user789', 'user101'],
    isBackedUp: true,
    replicationStatus: 'completed',
    lastModifiedBy: 'user456',
    classificationLevel: 'high',
    originatingService: 'dataLake',
    fileType: 'jpeg',
    storageTier: 'Standard',
    complianceStatus: 'Compliant',
    associatedProjects: ['ProjectA', 'ProjectB'],
    archiveStatus: 'Active',
    encryptionType: 'AES-256',
    backupFrequency: 'Daily',
    isVersioned: true,
    lastRestored: new Date('2024-07-28T12:00:00Z'),
    associatedRisks: ['Risk1', 'Risk2'],
    contentHash: 'abc123xyz',
    ownerDepartment: 'IT',
    accessAuditStatus: 'Passed',
    backupRetentionPeriodDays: 180,
    snapshotIds: ['snap123', 'snap456'],
    hasPendingSecurityReview: false,
    recoveryPointObjectiveMinutes: 15,
    restoreTimeObjectiveMinutes: 30,
    filePermissions: ['read', 'write', 'delete']
  },
  context: {
    timeOfDay: 'night',
    currentHour: 23,
    isHoliday: true,
    weekDay: 'Friday',
    event: 'maintenance'
  },
  system: {
    uptime: 250,
    loadAverage: 1.2,
    maintenanceMode: true
  }
};

export default context; // Export the context object

