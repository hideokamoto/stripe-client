/* eslint-disable @typescript-eslint/camelcase */
import { subscriptionItems, invoices, subscriptions } from 'stripe'
import ClientBase from './base'
export class SubscriptionClient extends ClientBase {
    /**
     * 税率の設定。提供国などでかわるので、適宜上書きする
     * @param planId {string}
     */
    public getTaxRate (planId: string): number {
        if (!planId) return 0
        return 0
    }
    protected async del (subscriptionId: string, params: subscriptions.ISubscriptionCancellationOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.del: %j', { subscriptionId, params })
        const result = await this.client.subscriptions.del(subscriptionId, params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.del: %j', result)
        return result
    }
    protected async update (subscriptionId: string, params: subscriptions.ISubscriptionUpdateOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.update: %j', { subscriptionId, params })
        const result = await this.client.subscriptions.update(subscriptionId, params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.update: %j', result)
        return result
    }
    protected async create (params: subscriptions.ISubscriptionCreationOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.create: %j', params)
        const result = await this.client.subscriptions.create(params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.create: %j', result)
        return result
    }
    public async getSubscriptionById (id: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.retrieve: %j', id)
        const result = await this.client.subscriptions.retrieve(id)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.retrieve: %j', result)
        return result
    }
    public async deleteSubscriptionItems (subscriptionItemId: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.del: %j', subscriptionItemId)
        const result = await this.client.subscriptionItems.del(subscriptionItemId)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.del: %j', result)
        return result
    }
    public async updateSubscritionItems (subscriptionItemId: string, planId: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.update: %j', { planId, subscriptionItemId })
        const result = await this.client.subscriptionItems.update(subscriptionItemId, { plan: planId })
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.update: %j', result)
        return result
    }
    protected getCreateSubscritionItemProps (subscriptionId: string, planId: string): subscriptionItems.ISubscriptionItemCreationOptions {
        return {
            subscription: subscriptionId,
            plan: planId,
            quantity: 1
        }
    }
    public async createSubscritionItems (subscriptionId: string, planId: string) {
        const param = this.getCreateSubscritionItemProps(subscriptionId, planId)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.create: %j', param)
        const result = await this.client.subscriptionItems.create(param)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.create: %j', result)
        return result
    }
    public async chargeUpdatedSubscription (customerId: string, subscriptionId: string, planId: string): Promise<{id: string}> {
        const param: invoices.IInvoiceCreationOptions = {
            customer: customerId,
            subscription: subscriptionId,
            tax_percent: this.getTaxRate(planId)
        }
        try {
            if (this.isDebug || this.stage === 'test') console.log('stripe.invoices.create: %j', param)
            const result = await this.client.invoices.create(param)
            if (this.isDebug || this.stage === 'test') console.log('stripe.invoices.create: %j', result)
            return {
                id: subscriptionId
            }
        } catch (e) {
            if (e.code !== 'invoice_no_subscription_line_items') {
                console.log('[ERROR] stripe.invoices.create: %j', e)
                throw e
            }
            return {
                id: subscriptionId
            }
        }
    }
}
export default SubscriptionClient
