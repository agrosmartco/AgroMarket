import {
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';
import _ from 'lodash';
import { UserProfile, securityId } from '@loopback/security';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      '_id',
      'roles',
    ]);

    currentUser = { [securityId]: user._id, roles: user.roles };

  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {

    return AuthorizationDecision.DENY;
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
 
    return AuthorizationDecision.ALLOW;
  }

  let roleIsAllowed = false;
  for (const role of currentUser.roles) {
    if (metadata.allowedRoles!.includes(role)) {
      roleIsAllowed = true;
      break;
    }
  }

  if (!roleIsAllowed) {

    return AuthorizationDecision.DENY;
  }

  // Admin and support accounts bypass id verification
  if (
    currentUser.roles.includes('admin') ||
    currentUser.roles.includes('support')
  ) {

    return AuthorizationDecision.ALLOW;
  }

  // Allow access only to model owners
  if (currentUser[securityId]) {

    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}