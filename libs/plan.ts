import { plans, IMetadata } from 'stripe'
import {
    IPlans
} from './model'
export class PlanList {
    protected plans: IPlans
    public constructor (plans: IPlans) {
        this.plans = plans
    }
    public getPlans (): IPlans {
        return this.plans
    }
}

export class PlanDetail {
    protected plan: plans.IPlan
    public constructor (plan: plans.IPlan) {
        this.plan = plan
    }
    public getPlans (): plans.IPlan {
        return this.plan
    }
    public getPlanMetadata (): IMetadata {
        return this.plan.metadata
    }
}
