import Stripe from 'stripe'
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

export class StripeClient {
    protected client: Stripe
    public customers: CustomerClient
    public products: ProductClient
    public subscriptions: SubscriptionClient
    public usageRecords: UsageRecordClient
    protected stage: Stage
    protected isDebug: boolean
    public constructor (apiKey: string, stage: Stage = 'test', isDebug: boolean = false, client: Stripe = new Stripe(apiKey)) {
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
