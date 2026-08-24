import { Prisma } from "../generated/prisma/client";

interface AssignOrderInput {
    orderId: number;
    pickupAreaId: number;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}


function calculateDistance(
    point1: Coordinates,
    point2: Coordinates
): number {
    const R = 6371; // Earth radius in km

    const lat1 = (point1.latitude * Math.PI) / 180;
    const lat2 = (point2.latitude * Math.PI) / 180;

    const deltaLat =
        ((point2.latitude - point1.latitude) * Math.PI) / 180;

    const deltaLon =
        ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export async function assignOrder(
    tx: Prisma.TransactionClient,
    input: AssignOrderInput
) {
   //tx is transaction coming from caller, using tx object we are doing the queries 
    const pickupArea = await tx.area.findUnique({
        where: {
            id: input.pickupAreaId,
        },
        include: {
            zone: true,
        },
    });

    if (!pickupArea) {
        throw new Error("Pickup area not found");
    }

   
    const agentZones = await tx.agentZone.findMany({
        where: {
            zoneId: pickupArea.zoneId,
            agent: {
                isAvailable: true,
            },
        },
        include: {
            agent: true,
        },
    });

   
    const agentsWithLocation = agentZones.filter(
        ({ agent }) =>
            agent.latitude !== null &&
            agent.longitude !== null
    );

   
    if (agentsWithLocation.length === 0) {
        return null;
    }

   
    let nearestAgent = agentsWithLocation[0].agent;

    let nearestDistance = calculateDistance(
        {
            latitude: Number(pickupArea.latitude),
            longitude: Number(pickupArea.longitude),
        },
        {
            latitude: Number(nearestAgent.latitude),
            longitude: Number(nearestAgent.longitude),
        }
    );

    for (let i = 1; i < agentsWithLocation.length; i++) {
        const agent = agentsWithLocation[i].agent;

        const distance = calculateDistance(
            {
                latitude: Number(pickupArea.latitude),
                longitude: Number(pickupArea.longitude),
            },
            {
                latitude: Number(agent.latitude),
                longitude: Number(agent.longitude),
            }
        );

        if (distance < nearestDistance) {
            nearestAgent = agent;
            nearestDistance = distance;
        }
    }

    
    const updatedOrder = await tx.order.update({
        where: {
            id: input.orderId,
        },
        data: {
            agentId: nearestAgent.id,
            status: "ASSIGNED",
        },
    });

    
    await tx.orderStatusHistory.create({
        data: {
            orderId: input.orderId,
            status: "ASSIGNED",
            actorId: nearestAgent.userId,
        },
    });

    return {
        order: updatedOrder,
        agent: nearestAgent,
        distance: nearestDistance,
    };
}
