import { UserDAO } from '@/dao';
import { userValidator } from '@/utils';

export default {
  auth: {
    validators: userValidator,
    DAO: UserDAO,
  },
};
