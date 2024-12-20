import mongoose from 'mongoose';
import { User, IUser } from '../src/models/user'; // Adjust the path according to your project structure

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/PolicyDB';

async function createUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Array of 25 users to be created
        const users: IUser[] = [
            {
                name: 'Alice Smith',
                givenName: 'Alice',
                familyName: 'Smith',
                email: 'alice.smith@example.com',
                telephone: '123-456-7890',
                jobTitle: 'Investor',
                username: 'alicesmith',
                password: 'password123',
                address: {
                    streetAddress: '123 Elm St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62701',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7890',
                    contactType: 'home',
                    email: 'alice.smith@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Bob Johnson',
                givenName: 'Bob',
                familyName: 'Johnson',
                email: 'bob.johnson@example.com',
                telephone: '123-456-7891',
                jobTitle: 'Analyst',
                username: 'bobjohnson',
                password: 'password123',
                address: {
                    streetAddress: '456 Oak St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62702',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7891',
                    contactType: 'work',
                    email: 'bob.johnson@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Charlie Brown',
                givenName: 'Charlie',
                familyName: 'Brown',
                email: 'charlie.brown@example.com',
                telephone: '123-456-7892',
                jobTitle: 'Farm Manager',
                username: 'charliebrown',
                password: 'password123',
                address: {
                    streetAddress: '789 Pine St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62703',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7892',
                    contactType: 'mobile',
                    email: 'charlie.brown@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'David Green',
                givenName: 'David',
                familyName: 'Green',
                email: 'david.green@example.com',
                telephone: '123-456-7893',
                jobTitle: 'Realtor',
                username: 'davidgreen',
                password: 'password123',
                address: {
                    streetAddress: '101 Maple St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62704',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7893',
                    contactType: 'work',
                    email: 'david.green@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Emma White',
                givenName: 'Emma',
                familyName: 'White',
                email: 'emma.white@example.com',
                telephone: '123-456-7894',
                jobTitle: 'Compliance Officer',
                username: 'emmawhite',
                password: 'password123',
                address: {
                    streetAddress: '202 Birch St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62705',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7894',
                    contactType: 'work',
                    email: 'emma.white@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Frank Miller',
                givenName: 'Frank',
                familyName: 'Miller',
                email: 'frank.miller@example.com',
                telephone: '123-456-7895',
                jobTitle: 'Auditor',
                username: 'frankmiller',
                password: 'password123',
                address: {
                    streetAddress: '303 Cedar St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62706',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7895',
                    contactType: 'home',
                    email: 'frank.miller@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Grace Lee',
                givenName: 'Grace',
                familyName: 'Lee',
                email: 'grace.lee@example.com',
                telephone: '123-456-7896',
                jobTitle: 'Realtor',
                username: 'gracelee',
                password: 'password123',
                address: {
                    streetAddress: '404 Spruce St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62707',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7896',
                    contactType: 'work',
                    email: 'grace.lee@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Henry Adams',
                givenName: 'Henry',
                familyName: 'Adams',
                email: 'henry.adams@example.com',
                telephone: '123-456-7897',
                jobTitle: 'Investor',
                username: 'henryadams',
                password: 'password123',
                address: {
                    streetAddress: '505 Chestnut St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62708',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7897',
                    contactType: 'mobile',
                    email: 'henry.adams@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Isabella King',
                givenName: 'Isabella',
                familyName: 'King',
                email: 'isabella.king@example.com',
                telephone: '123-456-7898',
                jobTitle: 'Analyst',
                username: 'isabellaking',
                password: 'password123',
                address: {
                    streetAddress: '606 Walnut St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62709',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7898',
                    contactType: 'work',
                    email: 'isabella.king@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Jack Harris',
                givenName: 'Jack',
                familyName: 'Harris',
                email: 'jack.harris@example.com',
                telephone: '123-456-7899',
                jobTitle: 'Farm Manager',
                username: 'jackharris',
                password: 'password123',
                address: {
                    streetAddress: '707 Hickory St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62710',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7899',
                    contactType: 'home',
                    email: 'jack.harris@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Karen Turner',
                givenName: 'Karen',
                familyName: 'Turner',
                email: 'karen.turner@example.com',
                telephone: '123-456-7810',
                jobTitle: 'Realtor',
                username: 'karenturner',
                password: 'password123',
                address: {
                    streetAddress: '808 Birch St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62711',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7810',
                    contactType: 'work',
                    email: 'karen.turner@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Leo Walker',
                givenName: 'Leo',
                familyName: 'Walker',
                email: 'leo.walker@example.com',
                telephone: '123-456-7811',
                jobTitle: 'Auditor',
                username: 'leowalker',
                password: 'password123',
                address: {
                    streetAddress: '909 Elm St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62712',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7811',
                    contactType: 'home',
                    email: 'leo.walker@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Mia Scott',
                givenName: 'Mia',
                familyName: 'Scott',
                email: 'mia.scott@example.com',
                telephone: '123-456-7812',
                jobTitle: 'Investor',
                username: 'miascott',
                password: 'password123',
                address: {
                    streetAddress: '1010 Maple St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62713',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7812',
                    contactType: 'work',
                    email: 'mia.scott@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Nathan Brooks',
                givenName: 'Nathan',
                familyName: 'Brooks',
                email: 'nathan.brooks@example.com',
                telephone: '123-456-7813',
                jobTitle: 'Analyst',
                username: 'nathanbrooks',
                password: 'password123',
                address: {
                    streetAddress: '1111 Pine St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62714',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7813',
                    contactType: 'home',
                    email: 'nathan.brooks@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Olivia Parker',
                givenName: 'Olivia',
                familyName: 'Parker',
                email: 'olivia.parker@example.com',
                telephone: '123-456-7814',
                jobTitle: 'Farm Manager',
                username: 'oliviaparker',
                password: 'password123',
                address: {
                    streetAddress: '1212 Oak St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62715',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7814',
                    contactType: 'work',
                    email: 'olivia.parker@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Paul Cooper',
                givenName: 'Paul',
                familyName: 'Cooper',
                email: 'paul.cooper@example.com',
                telephone: '123-456-7815',
                jobTitle: 'Realtor',
                username: 'paulcooper',
                password: 'password123',
                address: {
                    streetAddress: '1313 Cedar St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62716',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7815',
                    contactType: 'mobile',
                    email: 'paul.cooper@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Quinn Baker',
                givenName: 'Quinn',
                familyName: 'Baker',
                email: 'quinn.baker@example.com',
                telephone: '123-456-7816',
                jobTitle: 'Auditor',
                username: 'quinnbaker',
                password: 'password123',
                address: {
                    streetAddress: '1414 Spruce St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62717',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7816',
                    contactType: 'work',
                    email: 'quinn.baker@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Ryan Moore',
                givenName: 'Ryan',
                familyName: 'Moore',
                email: 'ryan.moore@example.com',
                telephone: '123-456-7817',
                jobTitle: 'Investor',
                username: 'ryanmoore',
                password: 'password123',
                address: {
                    streetAddress: '1515 Birch St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62718',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7817',
                    contactType: 'home',
                    email: 'ryan.moore@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Sophia Hill',
                givenName: 'Sophia',
                familyName: 'Hill',
                email: 'sophia.hill@example.com',
                telephone: '123-456-7818',
                jobTitle: 'Analyst',
                username: 'sophiahill',
                password: 'password123',
                address: {
                    streetAddress: '1616 Hickory St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62719',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7818',
                    contactType: 'work',
                    email: 'sophia.hill@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Thomas Clark',
                givenName: 'Thomas',
                familyName: 'Clark',
                email: 'thomas.clark@example.com',
                telephone: '123-456-7819',
                jobTitle: 'Farm Manager',
                username: 'thomasclark',
                password: 'password123',
                address: {
                    streetAddress: '1717 Walnut St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62720',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7819',
                    contactType: 'home',
                    email: 'thomas.clark@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Uma Davis',
                givenName: 'Uma',
                familyName: 'Davis',
                email: 'uma.davis@example.com',
                telephone: '123-456-7820',
                jobTitle: 'Realtor',
                username: 'umadavis',
                password: 'password123',
                address: {
                    streetAddress: '1818 Maple St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62721',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7820',
                    contactType: 'work',
                    email: 'uma.davis@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Violet Johnson',
                givenName: 'Violet',
                familyName: 'Johnson',
                email: 'violet.johnson@example.com',
                telephone: '123-456-7821',
                jobTitle: 'Auditor',
                username: 'violetjohnson',
                password: 'password123',
                address: {
                    streetAddress: '1919 Pine St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62722',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7821',
                    contactType: 'work',
                    email: 'violet.johnson@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'William Martinez',
                givenName: 'William',
                familyName: 'Martinez',
                email: 'william.martinez@example.com',
                telephone: '123-456-7822',
                jobTitle: 'Investor',
                username: 'williammartinez',
                password: 'password123',
                address: {
                    streetAddress: '2020 Cedar St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62723',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7822',
                    contactType: 'home',
                    email: 'william.martinez@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Xander Brown',
                givenName: 'Xander',
                familyName: 'Brown',
                email: 'xander.brown@example.com',
                telephone: '123-456-7823',
                jobTitle: 'Analyst',
                username: 'xanderbrown',
                password: 'password123',
                address: {
                    streetAddress: '2121 Spruce St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62724',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7823',
                    contactType: 'work',
                    email: 'xander.brown@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Yara Lee',
                givenName: 'Yara',
                familyName: 'Lee',
                email: 'yara.lee@example.com',
                telephone: '123-456-7824',
                jobTitle: 'Farm Manager',
                username: 'yaralee',
                password: 'password123',
                address: {
                    streetAddress: '2323 Birch St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62725',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7824',
                    contactType: 'home',
                    email: 'yara.lee@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
            {
                name: 'Zoe Wright',
                givenName: 'Zoe',
                familyName: 'Wright',
                email: 'zoe.wright@example.com',
                telephone: '123-456-7825',
                jobTitle: 'Realtor',
                username: 'zoewright',
                password: 'password123',
                address: {
                    streetAddress: '2525 Hickory St',
                    addressLocality: 'Springfield',
                    addressRegion: 'IL',
                    postalCode: '62726',
                    addressCountry: 'US',
                },
                contactPoint: {
                    telephone: '123-456-7825',
                    contactType: 'work',
                    email: 'zoe.wright@example.com',
                },
                groups: [],
                roles: [],
                policies: [],
                organization: '',
                attr: { version: '1.1' },
            },
        ];

        // Insert users into the database
        await User.insertMany(users);

        console.log('25 users created successfully.');
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

createUsers();
