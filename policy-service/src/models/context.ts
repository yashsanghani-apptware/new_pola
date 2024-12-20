import { IUser } from '../models/user';
import { Policy } from '../models/policy';
import { IGroup } from '../models/group';
import { IRole } from '../models/role';

export interface Context {
  user: IUser;                          // The user object containing detailed user information
  groups: string[];                      // Array of group IDs or names the user is part of
  roles: string[];                       // Array of role IDs or names assigned to the user
  policies: Policy[];                    // Array of policies applicable to the user
  environment: Record<string, any>;      // Key-value pairs representing environmental variables
  variables: Record<string, any>;        // Key-value pairs representing custom variables associated with the user or policies
}

