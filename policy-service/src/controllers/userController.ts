import { Request, Response } from 'express';
import { User } from '../models/user';
import Policy from '../models/policy';
import { Group } from '../models/group';
import { Role } from '../models/role';
import { handleError } from '../middleware/errorHandler';
import { UserService } from '../services/UserService';
import { translate } from '../utils/i18n';
import { url } from 'inspector';
/**
 * UserController handles CRUD operations for User documents in MongoDB,
 * as well as management of user policies, groups, and roles.
 */
export class UserController {

  /**
   * Creates a new user.
   * @param req - Express request object containing the new user data in req.body.
   * @param res - Express response object used to send back the created user or an error message.
   */
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      req.body.email = req.body.email.toLowerCase();
      req.body.username = req.body.username.toLowerCase();

      //check user already exist
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        throw new Error(translate('USER_ALREADY_EXIST'));
      }

      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      handleError(res, error);
    }
  }

  public async createUserV2(req: Request, res: Response): Promise<void> {
    try {

      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: translate("EMAIL_REQUIRED") });
      }
      const newUser = await UserService.createUserV2(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      handleError(res, error);
    }
  }

  public async sendEmailOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: translate("EMAIL_REQUIRED") });
      }
      await UserService.sendEmailOTP(email);
      res.status(200).json({ message: translate("EMAIL_OTP_SENT_SUCCESSFULLY") });
    } catch (error: any) {
      console.error("Error sending email OTP:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async verifyUserEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!otp) {
        res.status(400).json({ message: translate("OTP_REQUIRED") });
        return
      }
      await UserService.verifyUserEmail(email, otp);
      res.status(200).json({ message: translate("EMAIL_VERIFIED_SUCCESSFULLY") });
    } catch (error: any) {
      console.error("Error verifying user email:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async initialSocialLogin(req: Request, res: Response): Promise<void> {
    try {
      const { provider } = req.params;
      const url = await UserService.initialSocialLogin(provider);
      res.status(200).json({ url });
    } catch (error: any) {
      console.error("Error initialSocialLogin:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
  public async verifySocialLogin(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;
      const user = await UserService.verifySocialLogin(code);
      res.status(200).json(user);
    } catch (error: any) {
      console.error("Error verifySocialLogin:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: translate("EMAIL_REQUIRED") });
      }
      const isEmailSent = await UserService.forgotPassword(email);
      res.status(200).json(isEmailSent);
    } catch (error: any) {
      console.error("Error forgotPassword:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        res.status(400).json({ message: translate("EMAIL_OTP_PASSWORD_REQUIRED") });
        return
      }
      const isPasswordReset = await UserService.resetPassword(token, password);
      res.status(200).json(isPasswordReset);
    } catch (error: any) {
      console.error("Error resetPassword:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const { current_password, new_password } = req.body;

      // Call the service to change the password
      await UserService.changePassword(user_id, current_password, new_password);

      // Send a success response
      res.status(200).json({ message: translate("PASSWORD_CHANGED_SUCCESSFULLY") });
    } catch (error: any) {
      console.error("Error changing password:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Creates a new accreditation with the given title.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  public async createAccreditation(req: Request, res: Response){
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const newAccreditation = await UserService.createAccreditation({ title });
      res.status(201).json(newAccreditation);
    } catch (error) {
      res.status(500).json({ message: 'Error creating accreditation', error });
    }
  }

  /**
   * @api {get} /accreditions Get all accreditations
   * @apiName getAccreditations
   * @apiGroup User
   * @apiSuccess {Object[]} accreditations Array of accreditation objects
   * @apiError {Object} 500 Error fetching accreditations
   */
  public async getAccreditations(req: Request, res: Response){
    try {
      const accreditations = await UserService.getAccreditations();
      res.status(200).json(accreditations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching accreditations', error });
    }
  };
  


  /**
   * Gets all users.
   * @param req - Express request object.
   * @param res - Express response object used to send back the list of users or an error message.
   */
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Gets a user by ID.
   * @param req - Express request object containing the user ID in req.params.id.
   * @param res - Express response object used to send back the user or an error message.
   */
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: translate("USER_NOT_FOUND") });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Updates a user by ID.
   * @param req - Express request object containing the user ID in req.params.id and the updated data in req.body.
   * @param res - Express response object used to send back the updated user or an error message.
   */
  public async updateUserById(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        res.status(404).json({ message: translate("USER_NOT_FOUND") });
      } else {
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Deletes a user by ID.
   * @param req - Express request object containing the user ID in req.params.id.
   * @param res - Express response object used to send back a confirmation message or an error message.
   */
  public async deleteUserById(req: Request, res: Response): Promise<void> {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        res.status(404).json({ message: translate("USER_NOT_FOUND") });
      } else {
        res.status(200).json({ message: translate("USER_DELETED_SUCCESSFULLY") });
      }
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Adds policies to a user.
   * @param req - Express request object containing the user ID in req.params.id and the policy IDs in req.body.policies.
   * @param res - Express response object used to send back the updated user or an error message.
   */
  public async addPoliciesToUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { policies } = req.body;

      // Check if policies array exists and has items
      if (!policies || !Array.isArray(policies) || policies.length === 0) {
        res.status(400).json({ message: translate("POLICY_ARRAY_MUST_BE_PROVIDED_AND_CANNOT_BE_EMPTY") });
        return;
      }

      // Check if all policy IDs exist
      const policyDocs = await Policy.find({ _id: { $in: policies } });
      if (policyDocs.length !== policies.length) {
        res.status(400).json({ message: translate("ONE_OR_MORE_POLICY_IDS_DO_NOT_EXIST") });
        return;
      }

      // Update user with new policies
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { policies: { $each: policies } } },  // Add policies without duplicates
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: translate("USER_NOT_FOUND") });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Gets groups associated with a user.
   * @param req - Express request object containing the user ID in req.params.id.
   * @param res - Express response object used to send back the user's groups or an error message.
   */
  public async getUserGroups(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id).populate('groups');

      if (!user || !user.groups || user.groups.length === 0) {
        res.status(404).json({ message: translate("NO_GROUPS_FOUND_FOR_THIS_USER") });
        return;
      }

      res.status(200).json(user.groups);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Gets roles associated with a user.
   * @param req - Express request object containing the user ID in req.params.id.
   * @param res - Express response object used to send back the user's roles or an error message.
   */
  public async getUserRoles(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.id).populate('roles');

      if (!user || !user.roles || user.roles.length === 0) {
        res.status(404).json({ message: translate("NO_ROLES_FOUND_FOR_THIS_USER") });
        return;
      }

      res.status(200).json(user.roles);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Adds groups to a user.
   * @param req - Express request object containing the user ID in req.params.id and the group IDs in req.body.groupIds.
   * @param res - Express response object used to send back the updated user or an error message.
   */
  public async addUserGroups(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { groupIds } = req.body;

      // Find the user
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: translate("USER_NOT_FOUND") });
        return;
      }

      // Check if all group IDs exist
      const existingGroups = await Group.find({ _id: { $in: groupIds } });
      if (existingGroups.length !== groupIds.length) {
        res.status(400).json({ message: translate("ONE_OR_MORE_GROUP_IDS_DO_NOT_EXIST") });
        return;
      }

      // Add groups to the user ensuring no duplicates
      user.groups = Array.from(new Set([...(user.groups ?? []), ...groupIds]));
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Adds roles to a user.
   * @param req - Express request object containing the user ID in req.params.id and the role IDs in req.body.roleIds.
   * @param res - Express response object used to send back the updated user or an error message.
   */
  public async addUserRoles(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { roleIds } = req.body;

      // Find the user
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ message: translate("USER_NOT_FOUND") });
        return;
      }

      // Check if all role IDs exist
      const existingRoles = await Role.find({ _id: { $in: roleIds } });
      if (existingRoles.length !== roleIds.length) {
        res.status(400).json({ message: translate("ONE_OR_MORE_ROLE_IDS_DO_NOT_EXIST") });
        return;
      }

      // Add roles to the user ensuring no duplicates
      user.roles = Array.from(new Set([...(user.roles ?? []), ...roleIds]));
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      handleError(res, error);
    }
  }

  //Beneficiary controller:
  public async getBeneficiaries(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      const beneficiaries = await UserService.getBeneficiaries(user_id);
      res.status(200).json(beneficiaries);
    } catch (error: any) {
      console.error("Error getting beneficiary:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async addBeneficiary(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const beneficiaryData = req.body;

      const createdBeneficiary = await UserService.addBeneficiary(user_id, beneficiaryData);
      res.status(200).json(createdBeneficiary);
    } catch (error: any) {
      console.error("Error adding beneficiary:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async updateBeneficiary(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, beneficiary_id } = req.params;
      const beneficiaryData = req.body;

      const updatedBeneficiary = await UserService.updateBeneficiary(user_id, beneficiary_id, beneficiaryData);
      res.status(200).json(updatedBeneficiary);
    } catch (error: any) {
      console.error("Error updating beneficiary:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async deleteBeneficiary(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, beneficiary_id } = req.params;
      const deletedBeneficiary = await UserService.deleteBeneficiary(user_id, beneficiary_id);

      if (!deletedBeneficiary) {
        res.status(404).json({ message: translate("BENEFICIARY_NOT_FOUND") });
        return;
      }

      res.status(200).json({ message: translate("BENEFICIARY_DELETED_SUCCESSFULLY") });
    } catch (error: any) {
      console.error("Error deleting beneficiary:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async createSubscriptionCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = req.body;

      const createdCategory = await UserService.createSubscriptionCategory(categoryData);
      res.status(200).json(createdCategory);
    } catch (error: any) {
      console.error("Error creating subscription category:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async getSubscriptionCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await UserService.getSubscriptionCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      console.error("Error getting subscription categories:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async deleteSubscriptionCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category_id } = req.params;
      const deletedCategory = await UserService.deleteSubscriptionCategory(category_id);

      if (!deletedCategory) {
        res.status(404).json({ message: translate("SUBSCRIPTION_CATEGORY_NOT_FOUND") });
        return;
      }

      res.status(200).json({ message: translate("SUBSCRIPTION_CATEGORY_DELETED_SUCCESSFULLY") });
    } catch (error: any) {
      console.error("Error deleting subscription category:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async addOrUpdateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, category_id } = req.params;
      const subscriptionData = req.body;

      const createdSubscription = await UserService.addOrUpdateSubscription(user_id, category_id, subscriptionData);
      res.status(200).json(createdSubscription);
    } catch (error: any) {
      console.error("Error adding or updating subscription:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const subscriptions = await UserService.getUserSubscriptions(user_id);
      res.status(200).json(subscriptions);
    } catch (error: any) {
      console.error("Error getting user subscriptions:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  public async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const accounts = await UserService.getAllAccounts(user_id);
      res.status(200).json(accounts);
    } catch (error: any) {
      console.error("Error getting all accounts:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
  public async getAccount(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, account_id } = req.params;
      const account = await UserService.getAccount(user_id, account_id);
      res.status(200).json(account);
    } catch (error: any) {
      console.error("Error getting account:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
  public async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;
      const accountData = req.body;
      const createdAccount = await UserService.createAccount(user_id, accountData);
      res.status(201).json(createdAccount);
    } catch (error: any) {
      console.error("Error creating account:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
  public async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, account_id } = req.params;
      const accountData = req.body;
      const updatedAccount = await UserService.updateAccount(user_id, account_id, accountData);
      res.status(200).json(updatedAccount);
    } catch (error: any) {
      console.error("Error updating account:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
  public async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, account_id } = req.params;
      const deletedAccount = await UserService.deleteAccount(user_id, account_id);
      if (!deletedAccount) {
        res.status(404).json({ message: translate("ACCOUNT_NOT_FOUND") });
        return;
      }
      res.status(200).json({ message: translate("ACCOUNT_DELETED_SUCCESSFULLY") });
    } catch (error: any) {
      console.error("Error deleting account:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

