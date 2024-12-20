import mongoose from 'mongoose';
import PolicyModel from '../src/models/policy';

async function createResourcePolicies() {
    await mongoose.connect('mongodb://localhost:27017/PolicyDB');

    const resources = [
        { name: 'DataroomPolicy', resource: 'ari:agsiri:dataroom:us:448912311299-1:dataroom/cabinet/file/*' },
        { name: 'PortfolioPolicy', resource: 'ari:agsiri:portfolio:us:448912311299-1:portfolio/folder/file/*' },
        { name: 'CampaignPolicy', resource: 'ari:agsiri:campaign:us:448912311299-1:campaign/ad/group/*' },
        { name: 'OfferingPolicy', resource: 'ari:agsiri:offering:us:448912311299-1:offering/package/deal/*' },
        { name: 'ListingPolicy', resource: 'ari:agsiri:listing:us:448912311299-1:listing/item/detail/*' },
        { name: 'UserPolicy', resource: 'ari:agsiri:user:us:448912311299-1:user/profile/data/*' },
        { name: 'RolePolicy', resource: 'ari:agsiri:role:us:448912311299-1:role/access/permissions/*' },
        { name: 'InvestorPolicy', resource: 'ari:agsiri:investor:us:448912311299-1:investor/portfolio/details/*' },
        { name: 'PolicyPolicy', resource: 'ari:agsiri:policy:us:448912311299-1:policy/document/details/*' },
        { name: 'FarmPolicy', resource: 'ari:agsiri:farm:us:448912311299-1:farm/field/data/*' }
    ];

    try {
        for (const resource of resources) {
            const resourcePolicy = new PolicyModel({
                apiVersion: 'api.pola.dev/v1',
                name: resource.name,
                resourcePolicy: {
                    resource: resource.resource,
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
            console.log(`Resource Policy created for ${resource.name}:`, resourcePolicy);
        }
    } catch (error) {
        console.error('Error creating resource policies:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createResourcePolicies().catch(err => console.error('Error:', err));

