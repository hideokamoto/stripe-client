import Stripe from 'stripe'
import {
    Stage
} from './model'
export class ClientBase {
    protected stage: Stage
    protected client: Stripe
    protected isDebug: boolean
    public constructor (client: Stripe, stage: Stage = 'test', isDebug: boolean = false) {
        this.client = client
        this.stage = stage
        this.isDebug = isDebug
    }
}
export default ClientBase
