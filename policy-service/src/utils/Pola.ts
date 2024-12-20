// exampleUsage.ts
import mongoose from 'mongoose';
import context from '../data/context-data'; // Import the context data
import { PolaEvaluator } from './PolaEvaluator';
import { PolicyService } from '../services/PolicyService';

async function main() {

  try {
    await mongoose.connect('mongodb://localhost:27017/PolicyDB');


  const evaluator = new PolaEvaluator();
  const service = new PolicyService();
  const requestParams = {
  principalId: '66ca4231c5efaed97f50fc32',
  resourceId: 'ari:agsiri:dataroom:us:123456789012:resource/file001',
  actions: ['edit'],
  environment: {
    timeOfDay: 'day',
    location: 'US'
  },
  variables: {
    jwt: {
      aud: ['agsirian'],
      iss: 'agsiri'
    }
  }
};
   const decision = await service.evaluate(requestParams);
    console.log('Final Decision:', decision);  

   await evaluator.evaluateScenariosFromFile('scenarios.yaml', context);
  } catch (error) {
    console.error('Error during evaluation:', error);
  } finally {
    await mongoose.connection.close();
  }
}

main().catch(console.error);
