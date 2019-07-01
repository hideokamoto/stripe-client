import ClientBase from './base'
export class CustomerClient extends ClientBase {
    public async getCustomerById (id: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.customers.retrieve: %j', id)
        const result = await this.client.customers.retrieve(id)
        if (this.isDebug || this.stage === 'test') console.log('stripe.customers.retrieve: %j', result)
        return result
    }
}
export default CustomerClient
