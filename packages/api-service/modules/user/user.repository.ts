import { raw } from 'objection';

import { CreateUserRepositoryData, IUserDAO, UpdateUserRepositoryChanges, UserRepository } from './types';
import { IRequestContext } from '../../types/app';
import { UserDAO } from './models/user-dao';

class UserRepositoryImpl implements UserRepository {
  async createUser(ctx: IRequestContext, data: CreateUserRepositoryData): Promise<IUserDAO> {
    ctx.log.trace({ data }, 'try to create user');

    const { name, email, password, timeout = 'PT20M', householdId, currencyRateSourceId } = data;

    const userDAO = await UserDAO.query(ctx.trx).insert({
      name,
      email,
      password,
      timeout,
      idHousehold: Number(householdId),
      idCurrencyRateSource: Number(currencyRateSourceId),
      // Set temporary value. It will recalculate after adding 'access period' record, but this field is required
      accessUntil: new Date().toISOString(),
    });

    const userId = String(userDAO.idUser);

    ctx.log.info({ userId }, 'created user');

    return (await this.getUser(ctx, userId)) as IUserDAO;
  }

  async getUser(ctx: IRequestContext, userId: string): Promise<IUserDAO | undefined> {
    ctx.log.trace({ userId }, 'try to get user');

    return UserDAO.query(ctx.trx).findById(Number(userId));
  }

  async getUserByUsername(ctx: IRequestContext, username: string): Promise<IUserDAO | undefined> {
    ctx.log.trace({ username }, 'try to get user by username');
    return UserDAO.query(ctx.trx).findOne(raw('upper(email) = ?', [username.trim().toUpperCase()]));
  }

  async getUsers(ctx: IRequestContext, householdId: string): Promise<UserDAO[]> {
    ctx.log.trace({ householdId }, 'try to get users');
    return UserDAO.query(ctx.trx).where({ idHousehold: Number(householdId) });
  }

  async updateUser(ctx: IRequestContext, userId: string, changes: UpdateUserRepositoryChanges): Promise<IUserDAO> {
    ctx.log.trace({ userId, changes }, 'try to update user');
    const { name, password, timeout, projectId, currencyRateSourceId } = changes;

    const idCurrencyRateSource = currencyRateSourceId === undefined ? undefined : Number(currencyRateSourceId);

    const idProject = projectId === undefined ? undefined : Number(projectId);

    await UserDAO.query(ctx.trx)
      .patch({
        name,
        password,
        timeout,
        idCurrencyRateSource,
        idProject,
      })
      .where({
        idUser: Number(userId),
      });

    ctx.log.info({ userId }, 'updated user');

    return (await this.getUser(ctx, userId)) as IUserDAO;
  }

  async deleteUser(ctx: IRequestContext, userId: string): Promise<void> {
    ctx.log.trace({ userId }, 'try to delete user');

    // await User.query(ctx.trx)
    //   .del()
    //   .where({
    //     idUser: String(userId),
    //   });

    const trx = ctx.trx || (await UserDAO.knex().transaction());

    await trx.raw(`select context.set('isNotCheckPermit', '1')`);
    await trx('core$.user')
      .del()
      .where({
        idUser: String(userId),
      });
    await trx.raw(`select context.set('isNotCheckPermit', '')`);

    if (!ctx.trx) {
      trx.commit();
    }
  }
}

export const userRepository = new UserRepositoryImpl();
