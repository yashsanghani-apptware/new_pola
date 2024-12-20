// src/routes/userRoutes.ts
// import { Router } from 'express';
import express, { Router } from "express";
import { UserController } from '../controllers/userController';
import { authorizeAction, isAuthenticated } from '../middleware/roleAuthorization';

// const router = Router();
const router: Router = express.Router();

const userController = new UserController();

// POST /v1/users - Create a new user
router.post('/',(req, res) => userController.createUser(req, res)); // new method userController.createUserV2

// POST /v1/users/verify/email/sendOTP
router.post('/email/verify/otp', (req, res) => userController.sendEmailOTP(req, res));

// POST /v1/users/verify/email/verifyOTP
router.put('/email/verify/otp', (req, res) => userController.verifyUserEmail(req, res));

// POST /v1/users/socialLogin/:provider
router.get('/socialLogin/:provider', (req, res) => userController.initialSocialLogin(req, res));

// PUT /v1/users/socialLogin/verify
router.put('/socialLogin/verify', (req, res) => userController.verifySocialLogin(req, res));

// POST /v1/users/forgot_password
router.post('/forgot_password', (req, res) => userController.forgotPassword(req, res));

// PUT /v1/users/reset_password
router.put('/reset_password', (req, res) => userController.resetPassword(req, res));

// Route to create a new accreditation
router.post('/accreditations', userController.createAccreditation);

// Route to get all accreditations
router.get('/accreditations', userController.getAccreditations);


// PUT /v1/users/:user_id/change_password
router.put('/:user_id/change_password',
    isAuthenticated,
    authorizeAction("user.change_password"),
    (req, res) => userController.changePassword(req, res));

// GET /v1/users - Get all users
router.get('/',
    isAuthenticated,
    authorizeAction("user.read"),
    (req, res) => userController.getAllUsers(req, res));

// GET /v1/users/:id - Get a user by ID
router.get('/:id',
    isAuthenticated,
    authorizeAction("user.read"),
    (req, res) => userController.getUserById(req, res));

// PUT /v1/users/:id - Update a user by ID
router.put('/:id',
    isAuthenticated,
    authorizeAction("user.update"),
    (req, res) => userController.updateUserById(req, res));

// DELETE /v1/users/:id - Delete a user by ID
router.delete('/:id',
    isAuthenticated,
    authorizeAction("user.delete"),
    (req, res) => userController.deleteUserById(req, res));

// POST /v1/users/:id/policies - Add policies to a user
router.post('/:id/policies',
    isAuthenticated,
    authorizeAction("policy.create"),
    (req, res) => userController.addPoliciesToUser(req, res));

// GET /v1/users/:id/groups - Get groups associated with a user
router.get('/:id/groups',
    isAuthenticated,
    authorizeAction("policy.read"),
    (req, res) => userController.getUserGroups(req, res));

// GET /v1/users/:id/roles - Get roles associated with a user
router.get('/:id/roles',
    isAuthenticated,
    authorizeAction("role.read"),
    (req, res) => userController.getUserRoles(req, res));

// POST /v1/users/:id/groups - Add groups to a user
router.post('/:id/groups',
    isAuthenticated,
    authorizeAction("group.create"),
    (req, res) => userController.addUserGroups(req, res));

// POST /v1/users/:id/roles - Add roles to a user
router.post('/:id/roles',
    isAuthenticated,
    authorizeAction("role.create"),
    (req, res) => userController.addUserRoles(req, res));


// Beneficiary routes
// GET /v1/users/:user_id/beneficiaries - Get all beneficiaries for a user
router.get('/:user_id/beneficiaries',
    isAuthenticated,
    authorizeAction("beneficiary.read"),
    (req, res) => userController.getBeneficiaries(req, res));

// POST /v1/users/:user_id/beneficiaries - Add a new beneficiary for a user
router.post('/:user_id/beneficiaries',
    isAuthenticated,
    authorizeAction("beneficiary.create"),
    (req, res) => userController.addBeneficiary(req, res));

// PUT /v1/users/:user_id/beneficiaries/:beneficiary_id - Update a specific beneficiary for a user
router.put('/:user_id/beneficiaries/:beneficiary_id',
    isAuthenticated,
    authorizeAction("beneficiary.update"),
    (req, res) => userController.updateBeneficiary(req, res));

// DELETE /v1/users/:user_id/beneficiaries/:beneficiary_id - Delete a specific beneficiary for a user
router.delete('/:user_id/beneficiaries/:beneficiary_id',
    isAuthenticated,
    authorizeAction("beneficiary.delete"),
    (req, res) => userController.deleteBeneficiary(req, res));

// Subscription routes
// POST /v1/admin/subscription-categories - Admin can add a new subscription category
router.post('/subscriptions/categories',
    isAuthenticated,
    authorizeAction("subscription.create"),
    (req, res) => userController.createSubscriptionCategory(req, res));

// GET /v1/subscription-categories - Get all available subscription categories
router.get('/subscriptions/categories',
    isAuthenticated,
    authorizeAction("subscription.read"),
    (req, res) => userController.getSubscriptionCategories(req, res));

// DELETE /v1/admin/subscription-categories/:category_id - Admin can delete a subscription category
router.delete('/subscriptions/categories/:category_id',
    isAuthenticated,
    authorizeAction("subscription.delete"),
    (req, res) => userController.deleteSubscriptionCategory(req, res));

// POST /v1/users/:user_id/subscriptions - Add or update subscription for a user
router.post('/:user_id/subscriptions/categories/:category_id',
    isAuthenticated,
    authorizeAction("subscription.create"),
    (req, res) => userController.addOrUpdateSubscription(req, res));

// GET /v1/users/:user_id/subscriptions - Get all subscriptions for a user
router.get('/:user_id/subscriptions/categories',
    isAuthenticated,
    authorizeAction("subscription.read"),
    (req, res) => userController.getUserSubscriptions(req, res));

//Accounts Routes
// GET /v1/users/:user_id/accounts
router.get('/:user_id/accounts',
    isAuthenticated,
    authorizeAction("account.read"),
    (req, res) => userController.getAllAccounts(req, res)); // Fetch all accounts

// GET /v1/users/:user_id/accounts/:accountId
router.get(
    '/:user_id/accounts/:account_id',
    isAuthenticated,
    authorizeAction("account.read"),
    (req, res) => userController.getAccount(req, res)); // Fetch a specific account by ID

// POST /v1/users/:user_id/accounts
router.post('/:user_id/accounts/',
    isAuthenticated,
    authorizeAction("account.create"),
    (req, res) => userController.createAccount(req, res)); // Create a new account

// PUT /v1/users/:user_id/accounts/:accountId
router.put('/:user_id/accounts/:account_id',
    isAuthenticated,
    authorizeAction("account.update"),
    (req, res) => userController.updateAccount(req, res)); // Update account details

// DELETE /v1/users/:user_id/accounts/:accountId
router.delete('/:user_id/accounts/:account_id',
    isAuthenticated,
    authorizeAction("account.delete"),
    (req, res) => userController.deleteAccount(req, res)); // Delete an account

export default router;

