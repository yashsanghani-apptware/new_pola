import { UserService } from './UserService';
import { RoleService } from './RoleService';
import { GroupService } from './GroupService';
import { ResourceService } from './ResourceService';
import { PolicyService } from './PolicyService';
import { Context } from '../models/context';
import { IUser } from '../models/user';
import { Policy } from '../models/policy';
import { IGroup } from '../models/group';
import { IRole } from '../models/role';
import { IResource } from '../models/resource';
import { Types } from 'mongoose';

export class MemberService {
    private context: Context;

    constructor(private identifier: string) {
        this.context = {
            user: {} as IUser,
            groups: [],
            roles: [],
            policies: [],
            environment: {},
            variables: {},
        };
    }
    async initializeContext(): Promise<void> {
        try {
            const userService = new UserService();
            let user: IUser | null = null;
    
            if (this.isEmail(this.identifier)) {
                user = await userService.getUserByEmail(this.identifier);
            } else if (this.isObjectId(this.identifier)) {
                user = await userService.findUserById(new Types.ObjectId(this.identifier));
            } else {
                user = await userService.getUserByName(this.identifier);
            }
    
            if (!user) throw new Error(`User not found for identifier: ${this.identifier}`);
            this.context.user = user;
    
            const groupService = new GroupService();
            const roleService = new RoleService();
            const policyService = new PolicyService();
    
            const groupObjects = await Promise.all(
                user.groups?.map(groupId => groupService.getGroupById(groupId.toString())) || []
            );
    
            this.context.groups = groupObjects
                .filter((group): group is IGroup => group !== null)
                .map((group) => group._id.toString());
    
            const roleObjects = await Promise.all(
                user.roles?.map(roleId => roleService.getRoleById(roleId.toString())) || []
            );
    
            this.context.roles = roleObjects
                .filter((role): role is IRole => role !== null)
                .map((role) => role._id.toString());
    
            // Fetch all relevant policies
            this.context.policies = await policyService.getEffectivePolicies(user._id.toString(), '') as Policy[];
    
            console.log('Initialized context with policies:', this.context);
    
        } catch (error) {
            console.error('Error initializing context:', error);
            throw error;
        }
    }
    
    async initializeContextXX(): Promise<void> {
        try {
            const userService = new UserService();
            let user: IUser | null = null;

            if (this.isEmail(this.identifier)) {
                user = await userService.getUserByEmail(this.identifier);
            } else if (this.isObjectId(this.identifier)) {
                user = await userService.findUserById(new Types.ObjectId(this.identifier));
            } else {
                user = await userService.getUserByName(this.identifier);
            }

            if (!user) throw new Error(`User not found for identifier: ${this.identifier}`);
            this.context.user = user;

            const groupService = new GroupService();
            const roleService = new RoleService();

            const groupObjects = await Promise.all(
                user.groups?.map(groupId => groupService.getGroupById(groupId.toString())) || []
            );

            // Update the context.groups to store string[] instead of ObjectId[]
            this.context.groups = groupObjects
                .filter((group): group is IGroup => group !== null) // Ensure group is not null
                .map((group) => group._id.toString()); // Convert ObjectId to string

            const roleObjects = await Promise.all(
                user.roles?.map(roleId => roleService.getRoleById(roleId.toString())) || []
            );

            this.context.roles = roleObjects
                .filter((role): role is IRole => role !== null) // Ensure role is not null
                .map((role) => role._id.toString()); // Convert ObjectId to string

            const policyService = new PolicyService();
            this.context.policies = await this.aggregatePolicies(policyService);

        } catch (error) {
            console.error('Error initializing context:', error);
            throw error;
        }
    }

    private isEmail(identifier: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    }

    private isObjectId(identifier: string): boolean {
        return /^[a-f\d]{24}$/i.test(identifier);
    }

    private async aggregatePolicies(policyService: PolicyService): Promise<Policy[]> {
        const userPolicies = await policyService.searchPolicies({ 'principalPolicy.principal': this.context.user._id });

        const groupPolicies = await Promise.all(
            this.context.groups.map(groupId => policyService.searchPolicies({ 'groupPolicy.group': groupId }))
        ).then(results => results.flat());

        const rolePolicies = await Promise.all(
            this.context.roles.map(roleId => policyService.searchPolicies({ 'rolePolicy.role': roleId }))
        ).then(results => results.flat());

        const aggregatedPolicies = [...userPolicies, ...groupPolicies, ...rolePolicies];
        return this.resolvePolicyConflicts(aggregatedPolicies);
    }

    private resolvePolicyConflicts(policies: Policy[]): Policy[] {
        return policies;
    }

    getPermittedActions(): string[] {
        console.log('Context Policies:', this.context.policies); // Log the entire policies array

        const actions = this.context.policies.flatMap(policy => {
            console.log('Inspecting policy:', JSON.stringify(policy, null, 2)); // Log each policy in detail

            // Aggregate actions from principalPolicy, groupPolicy, and rolePolicy
            const principalActions = policy.principalPolicy?.rules.flatMap(rule => {
                console.log('Inspecting Principal Rule:', JSON.stringify(rule, null, 2)); // Log each rule in principalPolicy
                return rule.actions.map(action => action.action);
            }) || [];

            const groupActions = policy.groupPolicy?.rules.flatMap(rule => {
                console.log('Inspecting Group Rule:', JSON.stringify(rule, null, 2)); // Log each rule in groupPolicy
                return rule.actions.map(action => action.action);
            }) || [];

            const roleActions = policy.rolePolicy?.rules.flatMap(rule => {
                console.log('Inspecting Role Rule:', JSON.stringify(rule, null, 2)); // Log each rule in rolePolicy
                return rule.actions.map(action => action.action);
            }) || [];

            console.log('Principal Actions:', principalActions); // Log actions from principalPolicy
            console.log('Group Actions:', groupActions); // Log actions from groupPolicy
            console.log('Role Actions:', roleActions); // Log actions from rolePolicy

            return [...principalActions, ...groupActions, ...roleActions];
        });

        console.log('Final Permitted Actions:', actions); // Log the final list of permitted actions

        return actions;
    }


    getPolicies(): Policy[] {
        return this.context.policies;
    }

    getGroups(): string[] {
        return this.context.groups;
    }

    getRoles(): string[] {
        return this.context.roles;
    }

    async getResources(): Promise<IResource[]> {
        const resourceService = new ResourceService();
        return await resourceService.listAllResources();
    }
}

