import * as uuid from 'uuid';
import { add, sub } from 'date-fns';

import {
  Authorization,
  CreatePlanData,
  CreateProductData,
  CreateWebhookData,
  Plan,
  Product,
  Subscription,
  Transaction,
  TransactionsList,
  VerifyWebhookSignatureData,
  Webhook,
  WebhookSignatureVerification,
} from './types';
import config from '../../../libs/config';
import { ILogger } from '../../../types/app';
import { fetch, FetchOptions } from '../../../libs/fetch';

const { baseUrl, clientId, secret } = config.get('paypal');

class PaypalServiceImpl {
  private baseUrl: string;
  private clientId: string;
  private secret: string;

  constructor({ baseUrl, clientId, secret }: { baseUrl: string; clientId: string; secret: string }) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.secret = secret;
  }

  // https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_get
  async getSubscription(log: ILogger, subscriptionId: string): Promise<Subscription> {
    log.trace({ subscriptionId }, 'try to get subscription');
    const subscription = this.fetch<Subscription>(log, `/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
    });
    // log.trace({ subscription });
    return subscription;
  }

  // https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_transactions
  async getSubscriptionTransactions(log: ILogger, subscriptionId: string): Promise<Transaction[]> {
    log.trace({ subscriptionId }, 'try to get list transactions for subscription');
    const start_time = sub(new Date(), { months: 1 }).toISOString();
    const end_time = add(new Date(), { hours: 1 }).toISOString();

    const { transactions = [] } = await this.fetch<TransactionsList>(
      log,
      `/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${start_time}&end_time=${end_time}`,
      {
        method: 'GET',
      }
    );
    return transactions;
  }

  // https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_cancel
  async cancelSubscription(log: ILogger, subscriptionId: string): Promise<void> {
    await this.fetch<void>(log, `/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    });
  }

  // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature_post
  async verifyWebhookSignature(log: ILogger, data: VerifyWebhookSignatureData): Promise<WebhookSignatureVerification> {
    log.trace({ data }, 'try to verify webhook signature');

    const webhookSignatureVerification = await this.fetch<WebhookSignatureVerification>(
      log,
      `/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    log.trace({ webhookSignatureVerification }, 'verified webhook signature');
    return webhookSignatureVerification;
  }

  private async fetch<T>(log: ILogger, url: string, options?: FetchOptions): Promise<T> {
    // TODO cache access_token
    // https://developer.paypal.com/api/rest/authentication/
    const { access_token } = await fetch<Authorization>(log, `${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      username: this.clientId,
      password: this.secret,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        grant_type: 'client_credentials',
        ignoreCache: 'true',
        return_authn_schemes: 'true',
        return_client_metadata: 'true',
        return_unconsented_scopes: 'true',
      },
    });

    return fetch<T>(log, `${this.baseUrl}${url}`, {
      ...options,
      headers: {
        'PayPal-Request-Id': uuid.v4(),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        ...options?.headers,
      },
    });
  }

  async initPlans(log: ILogger): Promise<any> {
    const product = await this.createProduct(log, {
      name: 'FINEX.io',
      type: 'SERVICE',
    });

    const annualEurPlan = await this.createPlan(log, {
      name: 'Annual subscription to FINEX.io',
      product_id: product.id,
      billing_cycles: [
        {
          tenure_type: 'REGULAR',
          sequence: 1,
          frequency: {
            interval_unit: 'YEAR',
            interval_count: 1,
          },
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: '35.5',
              currency_code: 'EUR',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 5,
      },
      taxes: {
        percentage: '19',
        inclusive: true,
      },
    });

    const monthlyEurPlan = await this.createPlan(log, {
      name: 'Monthly subscription to FINEX.io',
      product_id: product.id,
      billing_cycles: [
        {
          tenure_type: 'REGULAR',
          sequence: 1,
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: '3.70',
              currency_code: 'EUR',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 5,
      },
      taxes: {
        percentage: '19',
        inclusive: true,
      },
    });

    return {
      monthlyEurPlanId: monthlyEurPlan.id,
      annualEurPlan: annualEurPlan.id,
    };
  }

  async initWebhook(log: ILogger, callbackUrl: string): Promise<any> {
    return this.createWebhook(log, {
      event_types: [{ name: 'BILLING.SUBSCRIPTION.CANCELLED' }, { name: 'PAYMENT.SALE.COMPLETED' }],
      url: callbackUrl,
    });
  }

  // https://developer.paypal.com/docs/api/catalog-products/v1/#products_create
  private async createProduct(log: ILogger, data: CreateProductData): Promise<Product> {
    const product = await this.fetch<Product>(log, '/v1/catalogs/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    log.trace({ product }, 'created product');
    return product;
  }

  // https://developer.paypal.com/docs/api/subscriptions/v1/#plans_create
  private async createPlan(log: ILogger, data: CreatePlanData): Promise<Plan> {
    const plan = await this.fetch<Plan>(log, '/v1/billing/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    log.trace({ plan }, 'created plan');
    return plan;
  }

  // https://developer.paypal.com/docs/api/webhooks/v1/#webhooks_post
  private async createWebhook(log: ILogger, data: CreateWebhookData): Promise<Webhook> {
    const webhook = await this.fetch<Webhook>(log, '/v1/notifications/webhooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    log.trace({ webhook }, 'created webhook');
    return webhook;
  }
}

export const paypalService = new PaypalServiceImpl({
  baseUrl,
  clientId,
  secret,
});
