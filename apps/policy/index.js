const { AbilityBuilder, Ability } = require('@casl/ability');

const policies = {
  guest(user, { can }) {
    can('read', 'Products');
  },

  user(user, { can }) {
    can('view', 'Orders');
    can('create', 'Orders');
    can('read', 'Orders', { user_id: user._id });
    can('update', 'Users', { _id: user._id });
    can('read', 'Carts', { user_id: user._id });
    can('update', 'Carts', { _id: user._id });
    can('view', 'DeliveryAddress');
    can('create', 'DeliveryAddress', { user_id: user._id });
    can('read', 'DeliveryAddress', { user_id: user._id });
    can('update', 'DeliveryAddress', { user_id: user._id });
    can('delete', 'DeliveryAddress', { user_id: user._id });
    can('read', 'Invoice', { user_id: user._id });
  },

  admin(user, { can }) {
    can('manage', 'all');
  },
};

function policyFor(user) {
  const builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === 'function') {
    policies[user.role](user, builder);
  } else {
    policies.guest(user, builder);
  }

  return new Ability(builder.rules);
}

module.exports = {
  policyFor,
};
