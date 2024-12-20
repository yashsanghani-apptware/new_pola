import mongoose from 'mongoose';
import PolicyModel from '../models/policy';

async function createResourcePolicy() {
    await mongoose.connect('mongodb://localhost:27017/PolicyDB');

    try {
        const resourcePolicy = new PolicyModel({
            apiVersion: 'api.pola.dev/v1',
            name: 'DataroomPolicy',
            resourcePolicy: {
                resource: 'ari:agsiri:dataroom:us:448912311299-1:dataroom/cabinet/file/*',
                version: '1.0',
                rules: [
                    {
                        actions: ['read', 'update'],
                        effect: 'EFFECT_ALLOW',
                        condition: {
                            match: {
                                all: {
                                    of: [
                                        { expr: "R.attr.status == 'ACTIVE'" },
                                        { expr: "'US' in R.attr.geographies" }
                                    ]
                                }
                            }
                        }
                    }
                ]
            },
            auditInfo: {
                createdBy: 'admin',
                createdAt: new Date(),
            },
        });

        await resourcePolicy.save();
        console.log('Resource Policy created:', resourcePolicy);
    } catch (error) {
        console.error('Error creating resource policy:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createResourcePolicy().catch(err => console.error('Error:', err));

