import { usageRecords } from 'stripe'
import ClientBase from './base'
export class UsageRecordClient extends ClientBase {
    public getTaxRate (planId: string): number {
        if (!planId) return 0
        return 0
    }
    public async createUsageRecords (subscriptionItemId: string, records: usageRecords.IUsageRecordCreationOptions) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.usageRecords.create: %j', { subscriptionItemId, records })
        const result = await this.client.usageRecords.create(subscriptionItemId, records)
        if (this.isDebug || this.stage === 'test') console.log('stripe.usageRecords.create: %j', result)
        return result
    }
    public async listUsageRecordSummaries (subscriptionItemId: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.usageRecordSummaries.list: %j', subscriptionItemId)
        const result = await this.client.usageRecordSummaries.list(subscriptionItemId)
        if (this.isDebug || this.stage === 'test') console.log('stripe.usageRecordSummaries.list: %j', result)
        return result
    }
}
export default UsageRecordClient
