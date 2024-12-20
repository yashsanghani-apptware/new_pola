// src/services/ActionExecutor.ts

import { Action, Condition, } from '../models/types';
import { IResource } from '../models/resource';
import { sendNotification, executeTask, logAction } from '../utils/actionUtils'; // Helper utilities for actions

export class ActionExecutor {
  // Method to execute an action
  public async executeAction(action: Action, context: any): Promise<void> {
    // Step 1: Evaluate the condition if it exists
    if (action.condition && !(await this.evaluateCondition(action.condition, context))) {
      console.log(`Condition not met for action: ${action.action}`);
      return; // Exit if the condition is not met
    }

    try {
      // Step 2: Execute the corresponding handler based on the action type
      switch (action.action) {
        case 'create':
          await this.createResource(context);
          break;
        case 'delete':
          await this.deleteResource(context);
          break;
        case 'update':
          await this.updateResource(context);
          break;
        case 'notify':
          if(action.notify){
          	await this.notifyAction(action, context);
          }
          break;
        case 'custom_action':
          await this.customActionHandler(action, context);
          break;
        default:
          console.log(`Unknown action type: ${action.action}`);
      }

      // Step 3: Log successful execution
      logAction(action, context);
    } catch (error) {
      console.error(`Error executing action ${action.action}:`, error);
      // Error handling and retry mechanism can be added here
    }
  }

  // Method to evaluate the condition for an action
  private async evaluateCondition(condition: Condition, context: any): Promise<boolean> {
    // Here you would implement the logic to evaluate the condition based on the context
    // For simplicity, assume a mock evaluation is performed
    console.log(`Evaluating condition: ${JSON.stringify(condition)} with context: ${JSON.stringify(context)}`);
    return true; // Mock result - replace with real evaluation logic
  }

  // Example action handler: Create Resource
  private async createResource(context: any): Promise<void> {
    console.log('Creating resource with context:', context);
    // Logic to create the resource
  }

  // Example action handler: Delete Resource
  private async deleteResource(context: any): Promise<void> {
    console.log('Deleting resource with context:', context);
    // Logic to delete the resource
  }

  // Example action handler: Update Resource
  private async updateResource(context: any): Promise<void> {
    console.log('Updating resource with context:', context);
    // Logic to update the resource
  }

  // Example action handler: Notify Action
  private async notifyAction(action: Action, context: any): Promise<void> {
    console.log('Notifying based on action:', action);
    if(action.notify){
    	await sendNotification(action.notify, context);
    }
  }

  // Example custom action handler
  private async customActionHandler(action: Action, context: any): Promise<void> {
    console.log('Executing custom action:', action);
    await executeTask(action, context);
  }
}

