import * as uuid from 'uuid';
import { IAmount, ICreatePayment } from '@a2seven/yoo-checkout/build/types';
import { Payment as YookassaPayment } from '@a2seven/yoo-checkout/build/models';
import { YooCheckout } from '@a2seven/yoo-checkout';

import config from '../../../libs/config';
import { IRequestContext, Locale } from '../../../types/app';
import { InternalError } from '../../../libs/errors';
import { userService } from '../../user/user.service';

const { shopId, secretKey } = config.get('yookassa');

interface ICreatePaymentData {
  amount: number;
  currency: string;
  description: string;
}

class YookassaServiceImpl {
  private shopId: string;
  private secretKey: string;
  private checkout: YooCheckout;

  constructor({ shopId, secretKey }: { shopId: string; secretKey: string }) {
    this.shopId = shopId;
    this.secretKey = secretKey;
    this.checkout = new YooCheckout({ shopId, secretKey });
  }

  async createPayment(
    ctx: IRequestContext<unknown, true>,
    userId: string,
    data: ICreatePaymentData
  ): Promise<YookassaPayment> {
    const { locale } = ctx.params;
    const { currency, description } = data;

    const amount: IAmount = {
      value: data.amount.toFixed(2),
      currency,
    };

    const user = await userService.getUser(ctx, userId);

    const createPayload: ICreatePayment = {
      amount,
      description,
      // https://yookassa.ru/developers/payment-acceptance/scenario-extensions/recurring-payments
      save_payment_method: true,
      confirmation: {
        type: 'embedded',
        locale: locale === Locale.Ru ? 'ru_RU' : 'en_US',
      },
      capture: true,
      metadata: {
        userId,
      },
      receipt: {
        customer: {
          email: user.email,
        },
        items: [
          {
            description,
            amount,
            quantity: '1',
            vat_code: 1,
          },
        ],
      },
    };

    const idempotenceKey = uuid.v4();
    try {
      const payment: YookassaPayment = await this.checkout.createPayment(createPayload, idempotenceKey);
      ctx.log.trace({ payment }, 'payment');
      return payment;
    } catch (err) {
      if ((err as any).response?.data) {
        throw new InternalError((err as any).response.data);
      }
      throw new InternalError();
    }
  }

  async getPayment(ctx: IRequestContext<unknown, true>, userId: string, paymentId: string): Promise<YookassaPayment> {
    try {
      const payment: YookassaPayment = await this.checkout.getPayment(paymentId);
      ctx.log.trace({ payment }, 'payment');
      return payment;
    } catch (err) {
      if ((err as any).response?.data) {
        throw new InternalError((err as any).response.data);
      }
      throw new InternalError();
    }
  }
}

export const yookassaService = new YookassaServiceImpl({
  shopId,
  secretKey,
});
