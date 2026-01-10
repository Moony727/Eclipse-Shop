"use server";

import { adminAuth, adminDb, isAdminInitialized } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import {
  createOrderSchema,
  type CreateOrderInput
} from "@/lib/validations/order.schema";
import { Order, Product } from "@/types";
import { sendTelegramNotification } from "@/lib/utils/telegram";
import { verifyAdmin } from "@/lib/utils/admin";

/**
 * Create a new order
 */
export async function createOrder(
  data: CreateOrderInput
): Promise<{ success: boolean; data?: { orderId: string }; error?: string }> {
  if (!isAdminInitialized || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    // Validate input
    const validation = createOrderSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors.map((e) => e.message).join(", ")
      };
    }

    const ordersRef = adminDb.collection("orders");
    const orderData = {
      userId: validation.data.userId,
      items: validation.data.items,
      contactId: validation.data.contactId,
      contactType: validation.data.contactType,
      customerName: validation.data.customerName || "",
      totalAmount: validation.data.totalAmount,
      status: "requested" as const,
      createdAt: Timestamp.now(),
      userEmail: validation.data.userEmail,
      userName: validation.data.userName,
      // Legacy fields for backward compatibility
      productId: validation.data.productId || validation.data.items[0]?.productId,
      productName: validation.data.productName || validation.data.items[0]?.productName,
    };

    const docRef = await ordersRef.add(orderData);

    // Send Telegram notification (non-blocking)
    const firstItem = validation.data.items[0];
    sendTelegramNotification({
      orderId: docRef.id,
      customerName: validation.data.customerName || validation.data.userName,
      contactId: validation.data.contactId,
      contactType: validation.data.contactType,
      productName: validation.data.items.length === 1
        ? `${firstItem.productName.en} (x${firstItem.quantity})`
        : `${firstItem.productName.en} and ${validation.data.items.length - 1} other item(s)`,
      totalAmount: validation.data.totalAmount,
      orderDate: new Date().toLocaleString(),
    }).catch(() => {
      // Notification failed, but don't fail the order
    });

    return { success: true, data: { orderId: docRef.id } };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order"
    };
  }
}

/**
 * Get a single order by ID (Order Owner)
 */
export async function getOrderById(
  orderId: string,
  token: string
): Promise<{ success: boolean; data?: Order; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    if (!orderId) {
      return { success: false, error: "Order ID is required" };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const ordersRef = adminDb.collection("orders");
    const orderDoc = await ordersRef.doc(orderId).get();

    if (!orderDoc.exists) {
      return { success: false, error: "Order not found" };
    }

    const data = orderDoc.data();
    if (!data || data.userId !== userId) {
      return { success: false, error: "Access denied" };
    }

    const order: Order = {
      id: orderDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Order;

    // Fetch product details for the order
    try {
      if (adminDb) {
        if (order.items && order.items.length > 0) {
          // New structure: fetch products for each item
          await Promise.all(order.items.map(async (item) => {
            const productDoc = await adminDb!.collection("products").doc(item.productId).get();
            if (productDoc.exists) {
              const productData = productDoc.data();
              if (productData) {
                item.product = {
                  id: productDoc.id,
                  ...productData,
                  createdAt: productData.createdAt?.toDate() || new Date(),
                } as Product;
              }
            }
          }));
        } else if (order.productId) {
          // Legacy structure: single product
          const productDoc = await adminDb!.collection("products").doc(order.productId).get();
          if (productDoc.exists) {
            const productData = productDoc.data();
            if (productData) {
              order.product = {
                id: productDoc.id,
                ...productData,
                createdAt: productData.createdAt?.toDate() || new Date(),
              } as Product;
            }
          }
        }
      }
    } catch {
      // Log error but don't fail the request
    }

    return { success: true, data: order };
  } catch {
    return {
      success: false,
      error: "Failed to fetch order"
    };
  }
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(
  token: string
): Promise<{ success: boolean; data?: Order[]; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders: Order[] = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const order: Order = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Order;

      // Fetch product details for the order
      try {
        if (adminDb) {
          if (order.items && order.items.length > 0) {
            // New structure: fetch products for each item
            await Promise.all(order.items.map(async (item) => {
              const productDoc = await adminDb!.collection("products").doc(item.productId).get();
              if (productDoc.exists) {
                const productData = productDoc.data();
                if (productData) {
                  item.product = {
                    id: productDoc.id,
                    ...productData,
                    createdAt: productData.createdAt?.toDate() || new Date(),
                  } as Product;
                }
              }
            }));
          } else if (order.productId) {
            // Legacy structure: single product
            const productDoc = await adminDb!.collection("products").doc(order.productId).get();
            if (productDoc.exists) {
              const productData = productDoc.data();
              if (productData) {
                order.product = {
                  id: productDoc.id,
                  ...productData,
                  createdAt: productData.createdAt?.toDate() || new Date(),
                } as Product;
              }
            }
          }
        }
      } catch {
        // Log error but don't fail the request
      }

      return order;
    }));

    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching user orders:", error as Error);
    return {
      success: false,
      error: "Failed to fetch user orders"
    };
  }
}

/**
 * Admin: Get all orders
 */
export async function getOrdersForAdmin(
  token: string
): Promise<{ success: boolean; data?: Order[]; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    await verifyAdmin(token);

    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef.orderBy("createdAt", "desc").get();

    const orders: Order[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Order;
    });

    return { success: true, data: orders };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized or failed to fetch orders";
    console.error("Error in getOrdersForAdmin:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Admin: Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    await verifyAdmin(token);

    await adminDb.collection("orders").doc(orderId).update({
      status,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized or failed to update order status";
    console.error("Error in updateOrderStatus:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
