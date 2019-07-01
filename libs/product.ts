import { products } from 'stripe'
import ClientBase from './base'

export class ProductClient extends ClientBase {
    public async getProductById (id: string) {
        return this.client.products.retrieve(id)
    }
    public async listActiveProducts () {
        return this.listProducts({
            active: true
        })
    }
    private async listProducts (query: products.IProductListOptions) {
        if (this.isDebug || this.stage === 'test') console.log(query)
        const result = await this.client.products.list(query)
        if (this.isDebug || this.stage === 'test') console.log(result)
        return result
    }
    public async listProductPlans (productId: string) {
        const params = {
            product: productId,
            active: true
        }
        if (this.isDebug || this.stage === 'test') console.log('stripe.plans.list: %j', params)
        const result = await this.client.plans.list(params)
        if (this.isDebug || this.stage === 'test') console.log('stripe.plans.list: %j', result)
        return result
    }
    public async getPlanById (id: string) {
        if (this.isDebug || this.stage === 'test') console.log('stripe.plans.retrieve: %j', id)
        const result = await this.client.plans.retrieve(id)
        if (this.isDebug || this.stage === 'test') console.log('stripe.plans.retrieve: %j', result)
        return result
    }
}
export default ProductClient
