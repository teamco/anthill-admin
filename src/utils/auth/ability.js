import { AbilityBuilder, Ability } from '@casl/ability';
import { isAdmin } from '@/services/user.service';
import i18n from '@/utils/i18n';

/**
 * @export
 * @param user
 * @return {Ability}
 */
export async function defineAbilityFor({ user }) {
  const { can, cannot, build, rules } = new AbilityBuilder(Ability);

  can(['manage'], 'login');

  if (user) {
    if (isAdmin(user)) {

      // Read-write access to everything
      can('manage', 'all');
    }
  }

  return build();
}
