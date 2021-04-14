import * as Stripe from 'stripe'
import { Agent } from 'http'
import {
    Stage
} from './model'
import CustomerClient from './customer'
import ProductClient from './product'
import SubscriptionClient from './subscriptions'
import UsageRecordClient from './usageRecord'

export * from './model'
export * from './product'
export * from './customer'
export * from './base'
export * from './plan'
export * from './subscriptions'
export * from './usageRecord'
export * from './utils/index'

/**
 * Ref: https://github.com/stripe/stripe-node/blob/master/lib/stripe.js#L30
 */
export interface StripeAllowedConfig {
    apiVersion: string;
    maxNetworkRetries: number;
    httpAgent: Agent;
    timeout: number;
    host: string;
    port: string | number;
    telemetry: boolean;
}
export interface ClientConfig extends Partial<StripeAllowedConfig> {
    stage?: Stage;
    debugMode?: 'enabled' | 'disabled';
}
export const defaultClientConfig: ClientConfig = {
    stage: 'test',
    debugMode: 'disabled',
    maxNetworkRetries: 2
}
export class StripeClient {
    protected client: Stripe
    public customers: CustomerClient
    public products: ProductClient
    public subscriptions: SubscriptionClient
    public usageRecords: UsageRecordClient
    protected stage: Stage
    protected isDebug: boolean
    public constructor (apiKey: string, config: ClientConfig = defaultClientConfig, client: Stripe = new Stripe(apiKey)) {
        const conf = {
            ...defaultClientConfig,
            ...config
        }
        const stage = conf.stage || 'test'
        const isDebug = conf.debugMode === 'enabled'

        if (conf.apiVersion) client.setApiVersion(conf.apiVersion)
        if (conf.maxNetworkRetries) client.setMaxNetworkRetries(conf.maxNetworkRetries)
        if (conf.httpAgent) client.setHttpAgent(conf.httpAgent)
        if (conf.timeout) client.setTimeout(conf.timeout)
        if (conf.host) client.setHost(conf.host)
        if (conf.port) client.setPort(conf.port)
        if (conf.telemetry) client.setTelemetryEnabled(conf.telemetry)

        this.client = client
        this.stage = stage
        this.isDebug = isDebug
        this.customers = new CustomerClient(this.client, stage, isDebug)
        this.products = new ProductClient(this.client, stage, isDebug)
        this.subscriptions = new SubscriptionClient(this.client, stage, isDebug)
        this.usageRecords = new UsageRecordClient(this.client, stage, isDebug)
    }
    public getClient () {
        return this.client
    }
}

export default StripeClient
