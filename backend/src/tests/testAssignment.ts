import { prisma } from "../lib/prisma";
import { assignOrder } from "../services/assignmentService";

async function test() {
    try {
        const result = await prisma.$transaction(async (tx) => {
            return await assignOrder(tx, {
                orderId: 1,
                pickupAreaId: 1,
            });
        });

        console.log("Assignment result:");
        console.log(result);

        // Verify updated order
        const order = await prisma.order.findUnique({
            where: {
                id: 1,
            },
        });

        console.log("\nUpdated order:");
        console.log(order);

        // Verify status history
        const history = await prisma.orderStatusHistory.findMany({
            where: {
                orderId: 1,
            },
            orderBy: {
                timestamp: "asc",
            },
        });

        console.log("\nOrder status history:");
        console.log(history);

    } catch (error) {
        console.error("Assignment failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

test();