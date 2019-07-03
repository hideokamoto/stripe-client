/* eslint-disable @typescript-eslint/camelcase */
import { subscriptionItems, invoices, subscriptions, IMetadata } from 'stripe'
import ClientBase from './base'
export class SubscriptionClient extends ClientBase {
    /**
     * 税率の設定。提供国などでかわるので、適宜上書きする
     * @param {string} planId
     */
    public getTaxRate (planId: string): number {
        if (!planId) return 0
        return 0
    }
    protected async list (params: subscriptions.ISubscriptionListOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.list: %j', params)
        const result = await this.client.subscriptions.list(params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.list: %j', result)
        return result
    }
    protected async del (subscriptionId: string, params: subscriptions.ISubscriptionCancellationOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.del: %j', { subscriptionId, params })
        const result = await this.client.subscriptions.del(subscriptionId, params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.del: %j', result)
        return result
    }
    protected async update (subscriptionId: string, params: subscriptions.ISubscriptionUpdateOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.update: %j', { subscriptionId, params })
        const result = await this.client.subscriptions.update(subscriptionId, params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.update: %j', result)
        return result
    }
    protected async create (params: subscriptions.ISubscriptionCreationOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.create: %j', params)
        const result = await this.client.subscriptions.create(params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.create: %j', result)
        return result
    }
    protected getCreateSubscritionItemProps (subscriptionId: string, planId: string): subscriptionItems.ISubscriptionItemCreationOptions {
        return {
            subscription: subscriptionId,
            plan: planId,
            quantity: 1
        }
    }
    /**
     * subscriptionItem解約。解約したものは請求がでなくなるので要注意
     * @param {string} subscriptionItemId
     */
    public async deleteSubscriptionItems (subscriptionItemId: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.del: %j', subscriptionItemId)
        const result = await this.client.subscriptionItems.del(subscriptionItemId)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.del: %j', result)
        return result
    }
    /**
     * subscriptionItem更新
     * @param {string} subscriptionItemId
     * @param {string} planId
     */
    public async updateSubscritionItems (subscriptionItemId: string, planId: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.update: %j', { planId, subscriptionItemId })
        const result = await this.client.subscriptionItems.update(subscriptionItemId, { plan: planId })
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.update: %j', result)
        return result
    }
    /**
     * 新規にsubscriptionItemを追加
     * @param {string} subscriptionId
     * @param {string} planId
     */
    public async createSubscritionItems (subscriptionId: string, planId: string) {
        const param = this.getCreateSubscritionItemProps(subscriptionId, planId)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.create: %j', param)
        const result = await this.client.subscriptionItems.create(param)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscriptionItems.create: %j', result)
        return result
    }
    /**
     * subscription取得
     * @param {string} subscriptionId
     */
    public async getSubscriptionById (subscriptionId: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.retrieve: %j', subscriptionId)
        const result = await this.client.subscriptions.retrieve(subscriptionId)
        if (this.isDebug || this.stage === 'test') console.log('stripe.subscription.retrieve: %j', result)
        return result
    }
    /**
     * 新規のsubscription作成
     * @param {string} customerId
     * @param {string} planId
     * @param [subscriptions.ISubscriptionCustCreationOptions={}] options
     */
    public async createSubscription (customerId: string, planId: string, options: Partial<subscriptions.ISubscriptionCustCreationOptions> = {}) {
        const param = {
            customer: customerId,
            plan: planId
        }
        return this.create({ ...param, ...options })
    }
    /**
     * @param {string} subscriptionId
     * @param {subscriptions.ISubscriptionUpdateOptions} options
     */
    public async updateSubscription (subscriptionId: string, options: Partial<subscriptions.ISubscriptionUpdateOptions>) {
        return this.update(subscriptionId, options)
    }
    public async deleteSubscription (subscriptionId: string, options: Partial<subscriptions.ISubscriptionCancellationOptions>) {
        return this.del(subscriptionId, options)
    }
    /**
     * customeのsubscriptionを取得
     * @param {string} customerId
     * @param [subscriptions.ISubscriptionListOptions={}] options
     */
    public async listSubscriptionByCustomerId (customerId: string, options: Partial<subscriptions.ISubscriptionListOptions> = {}) {
        const params = { customer: customerId }
        return this.list({
            ...params,
            ...options
        })
    }
    /**
     * 契約更新後に即時決済したい場合実行する
     * @param {string} customerId
     * @param {string} subscriptionId
     * @param {string} planId
     */
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
    /**
     * Subscriptionのmetadataだけ更新する
     * できるだけどんな値があるか把握しやすくするため、updateSiteIdのようにラッパーを作ってください
     *
     * @access public
     * @param subscriptionId {string}
     * @param key {string}
     * @param value {string}
     * @param [string] customerId
     * @returns Promise<void>
     */
    public async updateMetadata (subscriptionId: string, key: string, value: string, customerId?: string): Promise<void> {
        await this.updateMetadatas(subscriptionId, { [key]: value }, customerId)
    }
    /**
     * Subscriptionのmetadataだけ更新する(複数)
     * customerIdをつけると一致した場合のみ処理する
     * できるだけどんな値があるか把握しやすくするため、updateSiteIdのようにラッパーを作ってください
     *
     * @access public
     * @param {string} subscriptionId
     * @param {Stripe.IMetadata} data
     * @param [string] customerId
     * @returns Promise<void>
     */
    public async updateMetadatas (subscriptionId: string, data: IMetadata, customerId?: string): Promise<void> {
        const subscription = await this.getSubscriptionById(subscriptionId)
        if (!subscription) throw new Error(`no such subscription: ${subscriptionId}`)
        if (customerId && subscription.customer !== customerId) throw new Error(`no such subscription: ${subscriptionId}`)
        const metadata = subscription.metadata || {}
        const param = {
            metadata: {
                ...metadata,
                ...data
            }
        }
        await this.updateSubscription(subscriptionId, param)
    }
}
export default SubscriptionClient
