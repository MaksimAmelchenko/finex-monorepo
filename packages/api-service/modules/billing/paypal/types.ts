import { TDateTime } from '../../../types/app';

export interface Authorization {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  supported_authn_schemes: string[];
  nonce: string;
  client_metadata: ClientMetadata;
}

interface ClientMetadata {
  name: string;
  display_name: string;
  logo_uri: string;
  scopes: string[];
  ui_type: string;
}

export interface Subscription {
  status: SubscriptionStatus;
  status_update_time: TDateTime;
  id: string;
  plan_id: string;
  start_time: TDateTime;
  quantity: string;
  shipping_amount: Money;
  subscriber: Subscriber;
  billing_info: BillingInfo;
  create_time: TDateTime;
  update_time: TDateTime;
  custom_id: string;
  plan_overridden: boolean;
  links: Link[];
}

type SubscriptionStatus = 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';

interface Money {
  currency_code: string;
  value: string;
}

interface Subscriber {
  email_address: string;
  name: Name;
  payer_id: string;
  shipping_address: ShippingAddress;
}

interface Name {
  given_name: string;
  surname: string;
}

interface ShippingAddress {
  address: Address;
}

interface Address {
  address_line_1: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

interface BillingInfo {
  outstanding_balance: Money;
  cycle_executions: CycleExecution[];
  last_payment: LastPayment;
  failed_payments_count: number;
}

interface CycleExecution {
  tenure_type: string;
  sequence: number;
  cycles_completed: number;
  cycles_remaining: number;
  current_pricing_scheme_version: number;
  total_cycles: number;
}

interface LastPayment {
  amount: Money;
  time: string;
}

interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  category?: string;
  description?: string;
  image_url?: string;
  home_url?: string;
  create_time: string;
  update_time: string;
  links: Link[];
}

export interface CreateProductData {
  id?: string;
  name: string;
  type: string;
  category?: string;
  description?: string;
}

export interface Plan {
  id: string;
  product_id: string;
  name: string;
  status: 'CREATED' | 'INACTIVE' | 'ACTIVE';
  description: string;
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
  taxes: Taxes;
}

interface BillingCycle {
  frequency: Frequency;
  tenure_type: 'REGULAR' | 'TRIAL';
  sequence: number;
  total_cycles: number;
  pricing_scheme: PricingScheme;
}

interface Frequency {
  interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  interval_count: number;
}

interface PricingScheme {
  fixed_price: Money;
}

interface PaymentPreferences {
  auto_bill_outstanding: boolean;
  setup_fee?: Money;
  setup_fee_failure_action?: string;
  payment_failure_threshold: number;
}

interface Taxes {
  percentage: string;
  inclusive: boolean;
}

export interface CreatePlanData {
  product_id: string;
  name: string;
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
}

export interface TransactionsList {
  transactions: Transaction[];
  total_items: number;
  total_pages: number;
  links: Link[];
}

export interface Transaction {
  id: string;
  status: 'COMPLETED' | string;
  amount_with_breakdown: AmountWithBreakdown;
  payer_email: string;
  payer_name: Name;
  time: TDateTime;
}

interface AmountWithBreakdown {
  gross_amount: Money;
  fee_amount: Money;
  net_amount: Money;
}

export interface VerifyWebhookSignatureData {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: TDateTime;
  webhook_event: any;
  webhook_id: string;
}

export interface WebhookSignatureVerification {
  verification_status: 'SUCCESS' | 'FAILURE';
}

export interface CreateWebhookData {
  event_types: EventType[];
  url: string;
}

export interface Webhook {
  id: string;
  url: string;
  event_types: EventType[];
}

// https://developer.paypal.com/api/rest/webhooks/event-names/
interface EventType {
  name: 'BILLING.SUBSCRIPTION.CANCELLED' | 'PAYMENT.SALE.COMPLETED';
}
