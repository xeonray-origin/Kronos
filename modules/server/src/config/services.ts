import { UserDAO } from '@/dao';
import { userValidator } from '@/utils';

export default {
  auth: {
    validator: userValidator,
    DAO: UserDAO,
  },
};
