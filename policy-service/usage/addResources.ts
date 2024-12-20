import mongoose from 'mongoose';
import { Resource } from '../src/models/resource';

// Function to connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ResourceDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Function to create and save resources
async function createResources() {
    const resources = [
        {
            typeName: 'Dataroom::Main::DocumentStorage',
            ari: 'ari:agsiri:dataroom:us:1234567890:dataroom/main',
            description: 'Primary document storage for dataroom',
            properties: { encryption: 'AES256', sizeLimit: '100GB' },
            required: ['encryption', 'sizeLimit'],
            handlers: {
                create: { permissions: ['create:document'], timeoutInMinutes: 120 },
                read: { permissions: ['read:document'], timeoutInMinutes: 60 },
                update: { permissions: ['update:document'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:document'], timeoutInMinutes: 60 },
                list: { permissions: ['list:documents'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['dataroom/main'],
        },
        {
            typeName: 'Farm::Agriculture::CropStorage',
            ari: 'ari:agsiri:farm:us:1234567890:farm/crop',
            description: 'Storage for agricultural crops',
            properties: { climateControl: 'Yes', capacity: '5000 tons' },
            required: ['climateControl', 'capacity'],
            handlers: {
                create: { permissions: ['create:crop'], timeoutInMinutes: 120 },
                read: { permissions: ['read:crop'], timeoutInMinutes: 60 },
                update: { permissions: ['update:crop'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:crop'], timeoutInMinutes: 60 },
                list: { permissions: ['list:crops'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['farm/crop'],
        },
        {
            typeName: 'Listing::RealEstate::Property',
            ari: 'ari:agsiri:listing:us:1234567890:listing/property',
            description: 'Real estate property listing',
            properties: { location: 'New York', price: '1M USD' },
            required: ['location', 'price'],
            handlers: {
                create: { permissions: ['create:property'], timeoutInMinutes: 120 },
                read: { permissions: ['read:property'], timeoutInMinutes: 60 },
                update: { permissions: ['update:property'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:property'], timeoutInMinutes: 60 },
                list: { permissions: ['list:properties'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['listing/property'],
        },
        {
            typeName: 'Offer::Retail::Discount',
            ari: 'ari:agsiri:offer:us:1234567890:offer/discount',
            description: 'Retail discount offer',
            properties: { percentage: '15%', validUntil: '2025-12-31' },
            required: ['percentage', 'validUntil'],
            handlers: {
                create: { permissions: ['create:offer'], timeoutInMinutes: 120 },
                read: { permissions: ['read:offer'], timeoutInMinutes: 60 },
                update: { permissions: ['update:offer'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:offer'], timeoutInMinutes: 60 },
                list: { permissions: ['list:offers'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['offer/discount'],
        },
        {
            typeName: 'Campaign::Marketing::Email',
            ari: 'ari:agsiri:campaign:us:1234567890:campaign/email',
            description: 'Email marketing campaign',
            properties: { audience: '5000 recipients', startDate: '2024-01-01' },
            required: ['audience', 'startDate'],
            handlers: {
                create: { permissions: ['create:campaign'], timeoutInMinutes: 120 },
                read: { permissions: ['read:campaign'], timeoutInMinutes: 60 },
                update: { permissions: ['update:campaign'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:campaign'], timeoutInMinutes: 60 },
                list: { permissions: ['list:campaigns'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['campaign/email'],
        },
        {
            typeName: 'Portfolio::Investment::Fund',
            ari: 'ari:agsiri:portfolio:us:1234567890:portfolio/fund',
            description: 'Investment fund portfolio',
            properties: { fundSize: '10M USD', riskLevel: 'Medium' },
            required: ['fundSize', 'riskLevel'],
            handlers: {
                create: { permissions: ['create:portfolio'], timeoutInMinutes: 120 },
                read: { permissions: ['read:portfolio'], timeoutInMinutes: 60 },
                update: { permissions: ['update:portfolio'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:portfolio'], timeoutInMinutes: 60 },
                list: { permissions: ['list:portfolios'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['portfolio/fund'],
        },
        {
            typeName: 'Dataroom::Financial::ReportStorage',
            ari: 'ari:agsiri:dataroom:us:1234567890:dataroom/reports',
            description: 'Storage for financial reports',
            properties: { accessLevel: 'Confidential', reportCount: '1000' },
            required: ['accessLevel', 'reportCount'],
            handlers: {
                create: { permissions: ['create:report'], timeoutInMinutes: 120 },
                read: { permissions: ['read:report'], timeoutInMinutes: 60 },
                update: { permissions: ['update:report'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:report'], timeoutInMinutes: 60 },
                list: { permissions: ['list:reports'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['dataroom/reports'],
        },
        {
            typeName: 'Farm::Livestock::Cattle',
            ari: 'ari:agsiri:farm:us:1234567890:farm/cattle',
            description: 'Cattle farm management',
            properties: { herdSize: '200', breed: 'Angus' },
            required: ['herdSize', 'breed'],
            handlers: {
                create: { permissions: ['create:cattle'], timeoutInMinutes: 120 },
                read: { permissions: ['read:cattle'], timeoutInMinutes: 60 },
                update: { permissions: ['update:cattle'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:cattle'], timeoutInMinutes: 60 },
                list: { permissions: ['list:cattle'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['farm/cattle'],
        },
        {
            typeName: 'Listing::Ecommerce::Product',
            ari: 'ari:agsiri:listing:us:1234567890:listing/product',
            description: 'Ecommerce product listing',
            properties: { price: '25 USD', stock: '1000 units' },
            required: ['price', 'stock'],
            handlers: {
                create: { permissions: ['create:product'], timeoutInMinutes: 120 },
                read: { permissions: ['read:product'], timeoutInMinutes: 60 },
                update: { permissions: ['update:product'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:product'], timeoutInMinutes: 60 },
                list: { permissions: ['list:products'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['listing/product'],
        },
        {
            typeName: 'Offer::Subscription::Membership',
            ari: 'ari:agsiri:offer:us:1234567890:offer/membership',
            description: 'Subscription membership offer',
            properties: { duration: '12 months', fee: '99 USD' },
            required: ['duration', 'fee'],
            handlers: {
                create: { permissions: ['create:membership'], timeoutInMinutes: 120 },
                read: { permissions: ['read:membership'], timeoutInMinutes: 60 },
                update: { permissions: ['update:membership'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:membership'], timeoutInMinutes: 60 },
                list: { permissions: ['list:memberships'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['offer/membership'],
        },
        {
            typeName: 'Campaign::SocialMedia::Influencer',
            ari: 'ari:agsiri:campaign:us:1234567890:campaign/influencer',
            description: 'Social media influencer campaign',
            properties: { influencer: 'John Doe', platform: 'Instagram' },
            required: ['influencer', 'platform'],
            handlers: {
                create: { permissions: ['create:campaign'], timeoutInMinutes: 120 },
                read: { permissions: ['read:campaign'], timeoutInMinutes: 60 },
                update: { permissions: ['update:campaign'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:campaign'], timeoutInMinutes: 60 },
                list: { permissions: ['list:campaigns'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['campaign/influencer'],
        },
        {
            typeName: 'Portfolio::RealEstate::Commercial',
            ari: 'ari:agsiri:portfolio:us:1234567890:portfolio/commercial',
            description: 'Commercial real estate portfolio',
            properties: { propertyCount: '5', totalValue: '50M USD' },
            required: ['propertyCount', 'totalValue'],
            handlers: {
                create: { permissions: ['create:portfolio'], timeoutInMinutes: 120 },
                read: { permissions: ['read:portfolio'], timeoutInMinutes: 60 },
                update: { permissions: ['update:portfolio'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:portfolio'], timeoutInMinutes: 60 },
                list: { permissions: ['list:portfolios'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['portfolio/commercial'],
        },
        {
            typeName: 'Dataroom::Legal::ContractStorage',
            ari: 'ari:agsiri:dataroom:us:1234567890:dataroom/contracts',
            description: 'Storage for legal contracts',
            properties: { encryption: 'AES256', retentionPeriod: '7 years' },
            required: ['encryption', 'retentionPeriod'],
            handlers: {
                create: { permissions: ['create:contract'], timeoutInMinutes: 120 },
                read: { permissions: ['read:contract'], timeoutInMinutes: 60 },
                update: { permissions: ['update:contract'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:contract'], timeoutInMinutes: 60 },
                list: { permissions: ['list:contracts'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['dataroom/contracts'],
        },
        {
            typeName: 'Farm::Aquaculture::Fishery',
            ari: 'ari:agsiri:farm:us:1234567890:farm/fishery',
            description: 'Fishery management',
            properties: { species: 'Salmon', tankSize: '20000 gallons' },
            required: ['species', 'tankSize'],
            handlers: {
                create: { permissions: ['create:fishery'], timeoutInMinutes: 120 },
                read: { permissions: ['read:fishery'], timeoutInMinutes: 60 },
                update: { permissions: ['update:fishery'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:fishery'], timeoutInMinutes: 60 },
                list: { permissions: ['list:fishery'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['farm/fishery'],
        },
        {
            typeName: 'Listing::Rental::Vehicle',
            ari: 'ari:agsiri:listing:us:1234567890:listing/vehicle',
            description: 'Vehicle rental listing',
            properties: { vehicleType: 'SUV', dailyRate: '50 USD' },
            required: ['vehicleType', 'dailyRate'],
            handlers: {
                create: { permissions: ['create:vehicle'], timeoutInMinutes: 120 },
                read: { permissions: ['read:vehicle'], timeoutInMinutes: 60 },
                update: { permissions: ['update:vehicle'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:vehicle'], timeoutInMinutes: 60 },
                list: { permissions: ['list:vehicles'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['listing/vehicle'],
        },
        {
            typeName: 'Offer::Healthcare::Insurance',
            ari: 'ari:agsiri:offer:us:1234567890:offer/insurance',
            description: 'Healthcare insurance offer',
            properties: { coverage: 'Comprehensive', premium: '300 USD/month' },
            required: ['coverage', 'premium'],
            handlers: {
                create: { permissions: ['create:insurance'], timeoutInMinutes: 120 },
                read: { permissions: ['read:insurance'], timeoutInMinutes: 60 },
                update: { permissions: ['update:insurance'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:insurance'], timeoutInMinutes: 60 },
                list: { permissions: ['list:insurances'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['offer/insurance'],
        },
        {
            typeName: 'Campaign::Advertising::Digital',
            ari: 'ari:agsiri:campaign:us:1234567890:campaign/digital',
            description: 'Digital advertising campaign',
            properties: { budget: '5000 USD', platform: 'Google Ads' },
            required: ['budget', 'platform'],
            handlers: {
                create: { permissions: ['create:campaign'], timeoutInMinutes: 120 },
                read: { permissions: ['read:campaign'], timeoutInMinutes: 60 },
                update: { permissions: ['update:campaign'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:campaign'], timeoutInMinutes: 60 },
                list: { permissions: ['list:campaigns'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['campaign/digital'],
        },
        {
            typeName: 'Portfolio::Art::Collection',
            ari: 'ari:agsiri:portfolio:us:1234567890:portfolio/art',
            description: 'Art collection portfolio',
            properties: { pieceCount: '50', insuranceValue: '10M USD' },
            required: ['pieceCount', 'insuranceValue'],
            handlers: {
                create: { permissions: ['create:portfolio'], timeoutInMinutes: 120 },
                read: { permissions: ['read:portfolio'], timeoutInMinutes: 60 },
                update: { permissions: ['update:portfolio'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:portfolio'], timeoutInMinutes: 60 },
                list: { permissions: ['list:portfolios'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['portfolio/art'],
        },
        {
            typeName: 'Dataroom::RD::PatentStorage',
            ari: 'ari:agsiri:dataroom:us:1234567890:dataroom/patents',
            description: 'Storage for research and development patents',
            properties: { patentCount: '500', retentionPeriod: '20 years' },
            required: ['patentCount', 'retentionPeriod'],
            handlers: {
                create: { permissions: ['create:patent'], timeoutInMinutes: 120 },
                read: { permissions: ['read:patent'], timeoutInMinutes: 60 },
                update: { permissions: ['update:patent'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:patent'], timeoutInMinutes: 60 },
                list: { permissions: ['list:patents'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['dataroom/patents'],
        },
        {
            typeName: 'Farm::Dairy::MilkProduction',
            ari: 'ari:agsiri:farm:us:1234567890:farm/milk',
            description: 'Dairy farm milk production',
            properties: { dailyProduction: '2000 liters', breed: 'Holstein' },
            required: ['dailyProduction', 'breed'],
            handlers: {
                create: { permissions: ['create:milk'], timeoutInMinutes: 120 },
                read: { permissions: ['read:milk'], timeoutInMinutes: 60 },
                update: { permissions: ['update:milk'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:milk'], timeoutInMinutes: 60 },
                list: { permissions: ['list:milk'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['farm/milk'],
        },
        {
            typeName: 'Listing::Auction::Item',
            ari: 'ari:agsiri:listing:us:1234567890:listing/auction',
            description: 'Auction item listing',
            properties: { startingBid: '100 USD', auctionEndDate: '2024-12-31' },
            required: ['startingBid', 'auctionEndDate'],
            handlers: {
                create: { permissions: ['create:item'], timeoutInMinutes: 120 },
                read: { permissions: ['read:item'], timeoutInMinutes: 60 },
                update: { permissions: ['update:item'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:item'], timeoutInMinutes: 60 },
                list: { permissions: ['list:items'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['listing/auction'],
        },
        {
            typeName: 'Offer::Finance::Loan',
            ari: 'ari:agsiri:offer:us:1234567890:offer/loan',
            description: 'Finance loan offer',
            properties: { interestRate: '5%', loanAmount: '500K USD' },
            required: ['interestRate', 'loanAmount'],
            handlers: {
                create: { permissions: ['create:loan'], timeoutInMinutes: 120 },
                read: { permissions: ['read:loan'], timeoutInMinutes: 60 },
                update: { permissions: ['update:loan'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:loan'], timeoutInMinutes: 60 },
                list: { permissions: ['list:loans'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['offer/loan'],
        },
        {
            typeName: 'Campaign::PublicRelations::Event',
            ari: 'ari:agsiri:campaign:us:1234567890:campaign/event',
            description: 'Public relations event campaign',
            properties: { eventDate: '2024-09-01', location: 'San Francisco' },
            required: ['eventDate', 'location'],
            handlers: {
                create: { permissions: ['create:event'], timeoutInMinutes: 120 },
                read: { permissions: ['read:event'], timeoutInMinutes: 60 },
                update: { permissions: ['update:event'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:event'], timeoutInMinutes: 60 },
                list: { permissions: ['list:events'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['campaign/event'],
        },
        {
            typeName: 'Portfolio::Technology::Startup',
            ari: 'ari:agsiri:portfolio:us:1234567890:portfolio/startup',
            description: 'Technology startup portfolio',
            properties: { startupCount: '10', totalInvestment: '5M USD' },
            required: ['startupCount', 'totalInvestment'],
            handlers: {
                create: { permissions: ['create:portfolio'], timeoutInMinutes: 120 },
                read: { permissions: ['read:portfolio'], timeoutInMinutes: 60 },
                update: { permissions: ['update:portfolio'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:portfolio'], timeoutInMinutes: 60 },
                list: { permissions: ['list:portfolios'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['portfolio/startup'],
        },
        {
            typeName: 'Dataroom::MA::DealStorage',
            ari: 'ari:agsiri:dataroom:us:1234567890:dataroom/deals',
            description: 'Storage for MA deal documents',
            properties: { documentCount: '2000', dealType: 'Acquisition' },
            required: ['documentCount', 'dealType'],
            handlers: {
                create: { permissions: ['create:deal'], timeoutInMinutes: 120 },
                read: { permissions: ['read:deal'], timeoutInMinutes: 60 },
                update: { permissions: ['update:deal'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:deal'], timeoutInMinutes: 60 },
                list: { permissions: ['list:deals'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['dataroom/deals'],
        },
        {
            typeName: 'Farm::Viticulture::Vineyard',
            ari: 'ari:agsiri:farm:us:1234567890:farm/vineyard',
            description: 'Vineyard management',
            properties: { grapeVariety: 'Pinot Noir', acreage: '100 acres' },
            required: ['grapeVariety', 'acreage'],
            handlers: {
                create: { permissions: ['create:vineyard'], timeoutInMinutes: 120 },
                read: { permissions: ['read:vineyard'], timeoutInMinutes: 60 },
                update: { permissions: ['update:vineyard'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:vineyard'], timeoutInMinutes: 60 },
                list: { permissions: ['list:vineyards'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['farm/vineyard'],
        },
        {
            typeName: 'Listing::Art::Artwork',
            ari: 'ari:agsiri:listing:us:1234567890:listing/artwork',
            description: 'Art listing',
            properties: { artist: 'Van Gogh', price: '10M USD' },
            required: ['artist', 'price'],
            handlers: {
                create: { permissions: ['create:artwork'], timeoutInMinutes: 120 },
                read: { permissions: ['read:artwork'], timeoutInMinutes: 60 },
                update: { permissions: ['update:artwork'], timeoutInMinutes: 60 },
                delete: { permissions: ['delete:artwork'], timeoutInMinutes: 60 },
                list: { permissions: ['list:artworks'], timeoutInMinutes: 30 },
            },
            primaryIdentifier: ['listing/artwork'],
        }
    ];

    await Resource.insertMany(resources);
    console.log('25 resources created successfully');
}

// Main function to run the script
async function main() {
    await connectToDatabase();
    await createResources();
    mongoose.disconnect();
}

main().catch((err) => console.error('Error in main execution:', err));

