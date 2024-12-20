// src/services/UserService.ts
import { User, IUser } from '../models/user'; // Import the User model and the IUser interface
import PolicyModel from '../models/policy';
import { Role, IRole } from '../models/role';
import { Group, IGroup } from '../models/group';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { FilterQuery } from 'mongoose';
import { Beneficiary, IBeneficiary } from '../models/Beneficiary';
import { Subscription, SubscriptionCategory } from '../models/Subscription';
import { Account } from '../models/Account';
import { translate } from '../utils/i18n';
import { sendEmailOTP, verifyEmailOTP, initiateSocialLogin, verifySocialLogin, sendPasswordResetEmail, verifyPasswordResetEmail, } from '../utils/authService';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import { Accreditation, IAccreditation } from '../models/accreditation';

// Initialize Redis client using the REDIS_URL from environment variables
const redis = new Redis(process.env.REDIS_URL as string);


/**
 * UserService provides methods to interact with the User collection in MongoDB.
 * It supports operations such as finding, listing, adding, updating, deleting, searching,
 * and querying users.
 */
export class UserService {

  /**
   * Finds a user by their unique ID.
   * 
   * @param userId - The ID of the user to be found.
   * @returns A promise that resolves to the found user or null if not found.
   * @throws An error if the operation fails.
   */
  async findUserById(userId: Types.ObjectId): Promise<IUser | null> {
    try {
      return await User.findById(userId).exec();
    } catch (error) {
      console.error(`Error finding user by ID (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Finds a user by their unique username.
   * 
   * @param username - The username of the user to be found.
   * @returns A promise that resolves to the found user or null if not found.
   * @throws An error if the operation fails.
   */
  async getUserByName(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username }).exec();
    } catch (error) {
      console.error(`Error finding user by username (${username}):`, error);
      throw error;
    }
  }

  /**
   * Finds a user by their unique email.
   * 
   * @param email - The email of the user to be found.
   * @returns A promise that resolves to the found user or null if not found.
   * @throws An error if the operation fails.
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).exec();
    } catch (error) {
      console.error(`Error finding user by email (${email}):`, error);
      throw error;
    }
  }
  /**
   * Lists all users in the collection.
   * 
   * @returns A promise that resolves to an array of all users.
   * @throws An error if the operation fails.
   */
  async listAllUsers(): Promise<IUser[]> {
    try {
      return await User.find({}).exec();
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

  /**
   * Adds a new user to the collection.
   * 
   * @param user - The user to be added, following the IUser interface.
   * @returns A promise that resolves to the newly created user.
   * @throws An error if the operation fails.
   */
  async addUser(user: IUser): Promise<IUser> {
    try {
      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  static async createUserV2(user: IUser): Promise<IUser> {
    try {

      //check user already exist
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        throw new Error(translate('USER_ALREADY_EXIST'));
      }

      //send otp for email verification
      const isEmailSent = await sendEmailOTP(user.email);
      console.log("isEmailSent", isEmailSent);
      if (!isEmailSent.data?.ok) {
        throw new Error(translate('EMAIL_NOT_SENT'));
      }
      user.isEmailVerified = false;
      user.email  = user.email.toLowerCase();
      user.username = user.username.toLowerCase();
      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  static async sendEmailOTP(email: string): Promise<any> {
    try {
      //check user already exist
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error(translate('USER_ALREADY_EXIST'));
      }
  
      const isEmailSent = await sendEmailOTP(email);
      return isEmailSent;
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw error;
    }
  }

  static async verifyUserEmail(email: string, otp: string): Promise<any> {
    try {
      //check user already exist
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error(translate('USER_ALREADY_EXIST'));
      }

      const isEmailVerified = await verifyEmailOTP(email, otp);
      if (!isEmailVerified.data?.ok) {
        if (isEmailVerified.data?.error) {
          throw new Error(isEmailVerified.data?.error.errorDescription)
        }
        throw new Error(translate('EMAIL_VERIFICATION_FAILED'));
      }

      return { "isEmailVerified": true };
    } catch (error: any) {
      console.error('Error verifying user email:', error);
      throw error;
    }
  }

  static async initialSocialLogin(provider: string): Promise<any> {
    try {
      const url: any = await initiateSocialLogin(provider);
      console.log(url);
      if (url.data?.ok) {
        return url.data?.data?.url;
      }
      throw new Error(translate('ERROR_INITIATING_SOCIAL_LOGIN'));
    } catch (error) {
      console.error('Error initiating social login:', error);
      throw error;
    }
  }

  static async verifySocialLogin(code: string): Promise<any> {
    try {
      const response: any = await verifySocialLogin(code);
      console.log(response);
      if (!response.data?.ok) {
        if (response.data?.error) {
          throw new Error(response.data?.error.errorDescription)
        }
        throw new Error(translate('ERROR_VERIFYING_SOCIAL_LOGIN'));
      }

      let { email, name, familyName, picture, phone, OAuth } = response.data?.data.user;
      let user_details:any = {};

      //check user already exist
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        user_details.email = email.tolowerCase();
        user_details.username = email.tolowerCase();
        user_details.firstName = name;
        user_details.telephone = phone;
        user_details.familyName = familyName
        user_details.picture = picture;
        user_details.isSocialLoagin = true;
        user_details.socialLoginProvider = Object.keys(OAuth)[0];
        user_details.isEmailVerified = true;
        user_details = await User.create(user_details);
      } else {
        user_details = existingUser.toObject();
        user_details["isExistingUser"] = true;
      }

      const token = jwt.sign({ userId: user_details._id, username: user_details.username, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      user_details.password = "null"
      // Store the token in Redis with an expiration time of 1 hour (3600 seconds)
      await redis.set(`token:${token}`, JSON.stringify(user_details), 'EX', 3600);

      return { token, user_details };
    } catch (error) {
      console.error('Error verifying social login:', error);
      throw error;
    }
  }

  static async forgotPassword(email: string): Promise<any> {
    try {
      const isEmailSent = await sendPasswordResetEmail(email);
      if (!isEmailSent.data?.ok) {
        throw new Error(translate('EMAIL_NOT_SENT'));
      }
      return { "isEmailSent": true };
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw error;
    }
  }

  static async resetPassword(token: string, password: string): Promise<any> {
    try {
      const verifyPasswordReset : any = await verifyPasswordResetEmail(token);
      if (!verifyPasswordReset.data?.ok) {
        if (verifyPasswordReset.data?.error) {
          throw new Error(verifyPasswordReset.data?.error.errorDescription)
        }
        throw new Error(translate('PASSWORD_RESET_FAILED'));
      }

      const user: IUser | null = await User.findOne({ email:verifyPasswordReset?.data?.data?.user.email });
      if (!user) throw new Error(translate('USER_NOT_FOUND'));
      user.password = password;
      await user.save();
      return { "isPasswordReset": true };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Changes the password for a user with the given ID.
   * 
   * @param userId - The ID of the user to be updated.
   * @param current_password - The current password, which must match the user's existing password.
   * @param new_password - The new password to be set.
   * @returns A promise that resolves to the updated user or null if the operation fails.
   * @throws An error if the user is not found, the current password is incorrect, or the operation fails.
   */
  static async changePassword(userId: string, current_password: string, new_password: string): Promise<IUser | null> {
    // Find the user by ID
    const user: IUser | null = await User.findById(userId);
    if (!user) throw new Error(translate('USER_NOT_FOUND'));

    // Verify the current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) throw new Error(translate('CURRENT_PASSWORD_IS_INCORRECT'));

    // Update the user's password
    user.password = new_password;
    await user.save();
    return user;
  }



  /**
   * Creates a new accreditation with the given title.
   * 
   * @param {{ title: string }} - An object containing the title of the accreditation.
   * @returns A promise that resolves to the newly created accreditation.
   * @throws An error if the accreditation could not be created.
   */
  static async createAccreditation({ title }: { title: string }): Promise<IAccreditation> {
    const accreditation = new Accreditation({ title });
    await accreditation.save();
    return accreditation;
  }

  /**
   * Retrieves all accreditations from the database.
   * 
   * @returns A promise that resolves to an array of accreditations.
   */
  static async getAccreditations(): Promise<IAccreditation[]> {
    const accreditations = await Accreditation.find();
    return accreditations;
  }

  /**
   * Updates an existing user by their ID with the provided update data.
   * 
   * @param userId - The ID of the user to be updated.
   * @param updateData - The data to update the user with.
   * @returns A promise that resolves to the updated user, or null if not found.
   * @throws An error if the operation fails.
   */
  async updateUser(userId: Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    } catch (error) {
      console.error(`Error updating user by ID (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Deletes a user by their ID.
   * 
   * @param userId - The ID of the user to be deleted.
   * @returns A promise that resolves to true if the user was successfully deleted, otherwise false.
   * @throws An error if the operation fails.
   */
  async deleteUser(userId: Types.ObjectId): Promise<boolean> {
    try {
      const user = await User.findByIdAndDelete(userId).exec();
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error deleting user by ID (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Searches for users based on a provided query.
   * 
   * @param query - The query object used to search for matching users.
   * @returns A promise that resolves to an array of matching users.
   * @throws An error if the operation fails.
   */
  async searchUsers(query: FilterQuery<IUser>): Promise<IUser[]> {
    try {
      const users = await User.find(query).lean().exec();
      return users as IUser[];  // Use type assertion to assert the result as IUser[]
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Queries the users with additional options like sorting, skipping, and limiting.
   * 
   * @param filter - The filter object used to query for users.
   * @param sort - An optional sort object to determine the order of the results.
   * @param skip - An optional number of documents to skip in the result set.
   * @param limit - An optional maximum number of documents to return.
   * @returns A promise that resolves to an array of matching users.
   * @throws An error if the operation fails.
   */
  async queryUsers(
    filter: FilterQuery<IUser>,
    sort: FilterQuery<IUser> = {},
    skip: number = 0,
    limit: number = 10
  ): Promise<IUser[]> {
    try {
      const users = await User.find(filter).sort(sort).skip(skip).limit(limit).lean().exec();
      return users as IUser[];  // Use type assertion to assert the result as IUser[]
    } catch (error) {
      console.error('Error querying users:', error);
      throw error;
    }
  }

  /**
   * Counts the number of users that match a provided query.
   * 
   * @param query - The query object used to count matching users.
   * @returns A promise that resolves to the number of matching entries.
   * @throws An error if the operation fails.
   */
  async countUsers(query: FilterQuery<IUser>): Promise<number> {
    try {
      return await User.countDocuments(query).exec();
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }

  /**
   * Adds a group to a user's groups array.
   * 
   * @param userId - The ID of the user.
   * @param groupId - The ID of the group to add.
   * @returns A promise that resolves to the updated user document.
   * @throws An error if the operation fails.
   */
  async addGroupToUser(userId: Types.ObjectId, groupId: Types.ObjectId): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      if (!user.groups?.includes(groupId)) {
        user.groups?.push(groupId);
        await user.save();
      }

      return user;
    } catch (error) {
      console.error(`Error adding group to user (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Removes a group from a user's groups array.
   * 
   * @param userId - The ID of the user.
   * @param groupId - The ID of the group to remove.
   * @returns A promise that resolves to the updated user document.
   * @throws An error if the operation fails.
   */
  async removeGroupFromUser(userId: Types.ObjectId, groupId: Types.ObjectId): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      user.groups = user.groups || [];

      const groupIndex = user.groups.indexOf(groupId);
      if (groupIndex !== -1) {
        user.groups.splice(groupIndex, 1);
        await user.save();
      }

      return user;
    } catch (error) {
      console.error(`Error removing group from user (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Adds a role to a user's roles array.
   * 
   * @param userId - The ID of the user.
   * @param roleId - The ID of the role to add.
   * @returns A promise that resolves to the updated user document.
   * @throws An error if the operation fails.
   */
  async addRoleToUser(userId: Types.ObjectId, roleId: Types.ObjectId): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { roles: roleId } },
        { new: true }
      ).exec();

      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      return user;
    } catch (error) {
      console.error(`Error adding role to user (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Removes a role from a user's roles array.
   * 
   * @param userId - The ID of the user.
   * @param roleId - The ID of the role to remove.
   * @returns A promise that resolves to the updated user document.
   * @throws An error if the operation fails.
   */
  async removeRoleFromUser(userId: Types.ObjectId, roleId: Types.ObjectId): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      user.roles = user.roles || [];
      const roleIndex = user.roles.indexOf(roleId);
      if (roleIndex !== -1) {
        user.roles.splice(roleIndex, 1);
        await user.save();
      }

      return user;
    } catch (error) {
      console.error(`Error removing role from user (${userId}):`, error);
      throw error;
    }
  }

  /**
   * Grants a principal policy to a user, allowing specific actions on a resource.
   * 
   * @param userId - The ID of the user.
   * @param resourceAri - The ARI of the resource.
   * @param newActions - An array of actions to allow.
   * @returns A promise that resolves to the updated user document or the created policy.
   * @throws An error if the operation fails.
   */
  async grant(
    userId: Types.ObjectId,
    resourceAri: string,
    newActions: { action: string; effect: 'EFFECT_ALLOW' | 'EFFECT_DENY' }[]
  ): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).populate('policies').exec();
      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      let policy = await PolicyModel.findOne({
        'principalPolicy.principal': user._id,
        'principalPolicy.rules.resource': resourceAri,
      }).exec();

      if (policy && policy.principalPolicy) {
        const rule = policy.principalPolicy.rules.find(rule => rule.resource === resourceAri);

        if (rule) {
          newActions.forEach(newAction => {
            const existingActionIndex = rule.actions.findIndex(a => a.action === newAction.action);
            if (existingActionIndex > -1) {
              rule.actions[existingActionIndex].effect = newAction.effect;
            } else {
              rule.actions.push(newAction);
            }
          });
          policy.markModified('principalPolicy.rules');
        } else {
          policy.principalPolicy.rules.push({ resource: resourceAri, actions: newActions });
          policy.markModified('principalPolicy.rules');
        }
      } else {
        policy = new PolicyModel({
          apiVersion: 'api.pola.dev/v1',
          name: `PrincipalPolicy-${userId}`,
          principalPolicy: {
            principal: user._id,
            version: '1.1',
            rules: [{ resource: resourceAri, actions: newActions }],
          },
          auditInfo: { createdBy: 'system', createdAt: new Date() },
        });
      }

      await policy.save();

      const policyId = policy._id as Types.ObjectId;

      if (user.policies && !user.policies.some(p => p.equals(policyId))) {
        user.policies.push(policyId);
        await user.save();
      }

      return await User.findById(userId).populate('policies').exec();
    } catch (error) {
      console.error(`Error granting actions to resource (${resourceAri}) for user (${userId}):`, error);
      throw error;
    }
  }

  /**
     * Revokes a principal policy from a user, removing specific actions on a resource.
     * 
     * @param userId - The ID of the user.
     * @param resourceAri - The ARI of the resource.
     * @param actions - An array of actions to remove.
     * @returns A promise that resolves to the updated user document or confirmation of policy removal.
     * @throws An error if the operation fails.
     */
  async revoke(
    userId: Types.ObjectId,
    resourceAri: string,
    actions: string[]
  ): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).populate('policies').exec();
      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      const policyToRevoke = await PolicyModel.findOne({
        'principalPolicy.principal': user._id,
        'principalPolicy.rules.resource': resourceAri,
      }).exec();

      if (policyToRevoke && policyToRevoke.principalPolicy) {
        let hasRemainingActions = policyToRevoke.principalPolicy.rules.some(rule => {
          rule.actions = rule.actions.filter(action => !actions.includes(action.action));
          return rule.actions.length > 0;
        });

        policyToRevoke.markModified('principalPolicy.rules');

        if (hasRemainingActions) {
          await policyToRevoke.save();
        } else {
          await PolicyModel.deleteOne({ _id: policyToRevoke._id });
          if (user.policies) {
            user.policies = user.policies.filter(p =>
              p instanceof Types.ObjectId && !p.equals(policyToRevoke._id as Types.ObjectId)
            );
            await user.save();
          }
        }
      }

      return await User.findById(userId).populate('policies').exec();
    } catch (error) {
      console.error(`Error revoking actions on resource (${resourceAri}) for user (${userId}):`, error);
      throw error;
    }
  }


  /**
   * Finds a user by their ID and populates their policies.
   * 
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the found user with populated policies, or null if not found.
   * @throws An error if the operation fails.
   */
  async findUserByIdWithPolicies(userId: Types.ObjectId): Promise<IUser | null> {
    try {
      return await User.findById(userId).populate('policies').exec();
    } catch (error) {
      console.error(`Error finding user by ID with policies (${userId}):`, error);
      throw error;
    }
  }

  static async addBeneficiary(userId: string, beneficiaryData: any): Promise<IUser | null | IBeneficiary> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate('USER_NOT_FOUND', { id: userId }));

      beneficiaryData.userId = user._id as Types.ObjectId;
      const newBeneficiary = await Beneficiary.create(beneficiaryData);

      if (!user.baneficiaries) user.baneficiaries = [];
      user.baneficiaries.push(newBeneficiary._id as Types.ObjectId);
      await user.save();

      return newBeneficiary;
    } catch (error) {
      console.error(`Error adding beneficiary to user (${userId}):`, error);
      throw error;
    }
  }

  static async getBeneficiaries(userId: string): Promise<IBeneficiary[]> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND", { id: userId, default: "User not found" }));

      return await Beneficiary.find({ userId: user._id, isDeleted: false }).exec();

    } catch (error) {
      console.error(`Error getting beneficiaries for user (${userId}):`, error);
      throw error;
    }
  }

  static async updateBeneficiary(userId: string, beneficiary_id: string, beneficiaryData: any): Promise<IBeneficiary | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER"));

      const beneficiary = await Beneficiary.findById(beneficiary_id).exec();
      if (!beneficiary) throw new Error(`Beneficiary not found (ID: ${beneficiary_id})`);

      const updateBeneficiary = {
        type: beneficiaryData.type,
        firstName: beneficiaryData.firstName,
        lastName: beneficiaryData.lastName,
        email: beneficiaryData.email,
        phone: beneficiaryData.phone,
        dateOfBirth: beneficiaryData.dateOfBirth,
        address: beneficiaryData.address,
        socialSecurityNumber: beneficiaryData.socialSecurityNumber,
        acceptTermsAndConditions: beneficiaryData.acceptTermsAndConditions,
        relationship: beneficiaryData.relationship,
        isContingent: beneficiaryData.isContingent,
        isNonUSPerson: beneficiaryData.isNonUSPerson,
        isTrust: beneficiaryData.isTrust,
        isEntity: beneficiaryData.isEntity,
        trustDetails: beneficiaryData.trustDetails || {},
        entityDetails: beneficiaryData.entityDetails || {},
        nonUSPersonDetails: beneficiaryData.nonUSPersonDetails || {}
      };

      if (beneficiary.isNonUSPerson) {
        updateBeneficiary.nonUSPersonDetails = beneficiaryData.nonUSPersonDetails
      }

      if (beneficiary.isTrust) {
        updateBeneficiary.trustDetails = beneficiaryData.trustDetails
      }

      if (beneficiary.isEntity) {
        updateBeneficiary.entityDetails = beneficiaryData.entityDetails
      }

      if (updateBeneficiary.type) {
        updateBeneficiary.type = beneficiaryData.type
      }
      const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(beneficiary._id, updateBeneficiary, { new: true }).exec();
      return updatedBeneficiary;

    } catch (error) {
      console.error(`Error updating beneficiary for user (${userId}):`, error);
      throw error;
    }
  }

  static async deleteBeneficiary(userId: string, beneficiary_id: string): Promise<Boolean | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      const beneficiary = await Beneficiary.findById(beneficiary_id, { isDeleted: false }).exec();
      if (!beneficiary) throw new Error(`Beneficiary not found (ID: ${beneficiary_id})`);

      const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(beneficiary._id, { isDeleted: true }, { new: true }).exec();
      return updatedBeneficiary?.isDeleted != false; // Returns true if a document was deleted, otherwise false.

    } catch (error) {
      console.error(`Error deleting beneficiary for user (${userId}):`, error);
      throw error;
    }
  }

  static async createSubscriptionCategory(subscriptionCategoryData: any): Promise<any | null> {
    try {
      // const user = await User.findById(userId).exec();
      // if (!user) throw new Error(translate("USER"));

      // subscriptionCategoryData.userId = user._id as Types.ObjectId;
      const newSubscriptionCategory = await SubscriptionCategory.create(subscriptionCategoryData);

      return newSubscriptionCategory;
    } catch (error) {
      console.error(`Error creating subscription category :`, error);
      throw error;
    }
  }

  static async getSubscriptionCategories(): Promise<any | null> {
    try {
      return await SubscriptionCategory.find({}).exec();
    } catch (error) {
      console.error(`Error getting subscription categories :`, error);
      throw error;
    }
  }

  static async deleteSubscriptionCategory(category_id: string): Promise<any | null> {
    try {
      const subscriptionCategory = await SubscriptionCategory.findByIdAndDelete(category_id, { new: true }).exec();
      return subscriptionCategory;
    } catch (error) {
      console.error(`Error deleting subscription category :`, error);
      throw error;
    }
  }

  static async addOrUpdateSubscription(userId: string, category_id: string, subscriptionData: any): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      const subscriptionCategory = await SubscriptionCategory.findById(category_id).exec();
      if (!subscriptionCategory) throw new Error(translate("SUBSCRIPTION_CATEGORY_NOT_FOUND"));

      subscriptionData.userId = user._id as Types.ObjectId;
      subscriptionData.categoryId = subscriptionCategory._id as Types.ObjectId;
      const subscription = await Subscription.findOne({ userId: user._id, categoryId: subscriptionCategory._id }).exec();
      if (subscription) {
        const updatedSubscription = await Subscription.findByIdAndUpdate(subscription._id, subscriptionData, { new: true }).exec();
        return updatedSubscription;
      } else {
        const newSubscription = await Subscription.create(subscriptionData);
        return newSubscription;
      }
    } catch (error) {
      console.error(`Error adding or updating subscription for user (${userId}):`, error);
      throw error;
    }
  }

  static async getUserSubscriptions(userId: string): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      return await Subscription.find({ userId: user._id }).populate('categoryId').exec();
    } catch (error) {
      console.error(`Error getting user subscriptions for user (${userId}):`, error);
      throw error;
    }
  }

  static async createAccount(userId: string, accountData: any): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      accountData.userId = user._id as Types.ObjectId;
      const account = await Account.create(accountData);
      return account;
    } catch (error) {
      console.error(`Error creating account for user (${userId}):`, error);
      throw error;
    }
  }

  static async getAllAccounts(userId: string): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      return await Account.find({ userId: user._id, isDeleted: false }).exec();
    } catch (error) {
      console.error(`Error getting user accounts for user (${userId}):`, error);
      throw error;
    }
  }

  static async getAccount(userId: string, account_id: string): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      return await Account.findById(account_id).exec();
    } catch (error) {
      console.error(`Error getting user account for user (${userId}):`, error);
      throw error;
    }
  }

  static async updateAccount(userId: string, account_id: string, accountData: any): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));
      const account = await Account.findByIdAndUpdate({ _id: account_id }, accountData, { new: true }).exec();
      return account;
    } catch (error) {
      console.error(`Error updating user account for user (${userId}):`, error);
      throw error;
    }
  }

  static async deleteAccount(userId: string, account_id: string): Promise<any | null> {
    try {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error(translate("USER_NOT_FOUND"));

      const account = await Account.findByIdAndUpdate({ _id: account_id }, { isDeleted: true }, { new: true }).exec();
      return account;
    } catch (error) {
      console.error(`Error deleting user account for user (${userId}):`, error);
      throw error;
    }
  }

}
