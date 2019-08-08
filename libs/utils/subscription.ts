import {
    subscriptionItems,
    subscriptions
} from 'stripe'

interface UpdatePlanIds {
    currentPlanId: string;
    nextPlanId: string;
}
interface UpdateTargetItems {
    item: subscriptionItems.ISubscriptionItem;
    targetItem?: subscriptionItems.ISubscriptionItem;
}
/**
 * Create option props to exec subcriptions.update()
 * @param {string} subscriptionItemId
 * @param {UpdatePlanIds} planIds
 * @param {UpdateTargetItems} targets
 */
export const createUpdateSubscriptionOptions = (subscriptionItemId: string, planIds: UpdatePlanIds, targets: UpdateTargetItems): subscriptions.ISubscriptionUpdateOptions => {
    const { nextPlanId, currentPlanId } = planIds
    const { item, targetItem } = targets
    if (item.quantity === 1) {
        if (!targetItem) {
            return {
                items: [{
                    id: subscriptionItemId,
                    deleted: true
                }, {
                    plan: nextPlanId,
                    quantity: 1
                }]
            }
        }
        return {
            items: [{
                id: subscriptionItemId,
                deleted: true
            }, {
                id: targetItem.id,
                plan: nextPlanId,
                quantity: targetItem.quantity + 1
            }]
        }
    }
    if (!targetItem) {
        return {
            items: [{
                id: subscriptionItemId,
                plan: currentPlanId,
                quantity: item.quantity - 1
            }, {
                plan: nextPlanId,
                quantity: 1
            }]
        }
    }
    return {
        items: [{
            id: subscriptionItemId,
            plan: currentPlanId,
            quantity: item.quantity - 1
        }, {
            id: targetItem.id,
            plan: nextPlanId,
            quantity: targetItem.quantity + 1
        }]
    }
}
