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

    // Send Telegram notification asynchronously (non-blocking)
    setImmediate(async () => {
      try {
        const success = await sendTelegramNotification({
          orderId: docRef.id,
          customerName: validation.data.customerName || validation.data.userName,
          contactId: validation.data.contactId,
          contactType: validation.data.contactType,
          items: validation.data.items,
          totalAmount: validation.data.totalAmount,
          orderDate: new Date().toLocaleString(),
        });

        if (!success) {
          console.warn(`Failed to send Telegram notification for order ${docRef.id}`);
        }
      } catch (error) {
        console.error(`Error sending Telegram notification for order ${docRef.id}:`, error);
      }
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
 * Get a single order by ID (Order Owner) with batch product fetching
 */
export async function getOrderById(
  orderId: string,
  token: string,
  includeProducts: boolean = true
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

    // Batch fetch product details if requested
    if (includeProducts && adminDb) {
      const productIds = new Set<string>();

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => productIds.add(item.productId));
      } else if (order.productId) {
        productIds.add(order.productId);
      }

      if (productIds.size > 0) {
        const productsRef = adminDb.collection("products");
        const productPromises = Array.from(productIds).map(id => productsRef.doc(id).get());
        const productDocs = await Promise.all(productPromises);

        const productMap = new Map<string, Product>();
        productDocs.forEach(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              productMap.set(doc.id, {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
              } as Product);
            }
          }
        });

        // Assign products
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => {
            item.product = productMap.get(item.productId);
          });
        } else if (order.productId) {
          order.product = productMap.get(order.productId);
        }
      }
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}

/**
 * Get all orders for a user with batch product fetching and optional pagination
 */
export async function getUserOrders(
  token: string,
  options?: { limit?: number; offset?: number; includeProducts?: boolean }
): Promise<{ success: boolean; data?: Order[]; error?: string; total?: number }> {
  const { limit = 50, offset = 0, includeProducts = true } = options || {};

  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const ordersRef = adminDb.collection("orders");

    // Get total count for pagination (simplified approach)
    let total = 0;
    try {
      const countSnapshot = await ordersRef.where("userId", "==", userId).get();
      total = countSnapshot.size;
    } catch (countError) {
      console.warn("Could not get total count:", countError);
      // Continue without total count
    }

    // Get orders with simple pagination
    let query = ordersRef
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc");

    // For now, just use limit and handle offset client-side if needed
    // Firestore doesn't support offset with orderBy easily
    query = query.limit(Math.min(limit + offset, 100)); // Cap at 100 to prevent abuse

    const snapshot = await query.get();

    if (snapshot.empty) {
      return { success: true, data: [], total: 0 };
    }

    // Apply offset if needed (client-side pagination)
    const docs = offset > 0 ? snapshot.docs.slice(offset) : snapshot.docs;

    const orders: Order[] = docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Order;
    });

    // Batch fetch products if requested
    if (includeProducts && adminDb) {
      const productIds = new Set<string>();

      // Collect all product IDs
      orders.forEach(order => {
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => productIds.add(item.productId));
        } else if (order.productId) {
          productIds.add(order.productId);
        }
      });

      if (productIds.size > 0) {
        // Batch fetch products
        const productsRef = adminDb.collection("products");
        const productPromises = Array.from(productIds).map(id => productsRef.doc(id).get());
        const productDocs = await Promise.all(productPromises);

        const productMap = new Map<string, Product>();
        productDocs.forEach(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              productMap.set(doc.id, {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
              } as Product);
            }
          }
        });

        // Assign products to orders
        orders.forEach(order => {
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              item.product = productMap.get(item.productId);
            });
          } else if (order.productId) {
            order.product = productMap.get(order.productId);
          }
        });
      }
    }

    return { success: true, data: orders, total };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: "Failed to fetch user orders" };
  }
}

/**
 * Admin: Get all orders with optional batch product fetching and pagination
 */
export async function getOrdersForAdmin(
  token: string,
  options?: { limit?: number; offset?: number; includeProducts?: boolean }
): Promise<{ success: boolean; data?: Order[]; error?: string; total?: number }> {
  const { limit = 100, offset = 0, includeProducts = false } = options || {};

  if (!isAdminInitialized || !adminAuth || !adminDb) {
    return { success: false, error: "Server configuration error" };
  }

  try {
    await verifyAdmin(token);

    const ordersRef = adminDb.collection("orders");

    // Get total count (simplified approach)
    let total = 0;
    try {
      const countSnapshot = await ordersRef.get();
      total = countSnapshot.size;
    } catch (countError) {
      console.warn("Could not get total count:", countError);
      // Continue without total count
    }

    // Get orders with pagination
    let query = ordersRef.orderBy("createdAt", "desc");

    if (offset > 0) {
      query = query.limit(limit + offset);
    } else {
      query = query.limit(limit);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return { success: true, data: [], total: 0 };
    }

    const docs = offset > 0 ? snapshot.docs.slice(offset) : snapshot.docs;

    const orders: Order[] = docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Order;
    });

    // Batch fetch products if requested
    if (includeProducts && adminDb) {
      const productIds = new Set<string>();

      orders.forEach(order => {
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => productIds.add(item.productId));
        } else if (order.productId) {
          productIds.add(order.productId);
        }
      });

      if (productIds.size > 0) {
        const productsRef = adminDb.collection("products");
        const productPromises = Array.from(productIds).map(id => productsRef.doc(id).get());
        const productDocs = await Promise.all(productPromises);

        const productMap = new Map<string, Product>();
        productDocs.forEach(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              productMap.set(doc.id, {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
              } as Product);
            }
          }
        });

        orders.forEach(order => {
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              item.product = productMap.get(item.productId);
            });
          } else if (order.productId) {
            order.product = productMap.get(order.productId);
          }
        });
      }
    }

    return { success: true, data: orders, total };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized or failed to fetch orders";
    console.error("Error in getOrdersForAdmin:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Admin: Update order status with validation
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
    if (!orderId || !status) {
      return { success: false, error: "Order ID and status are required" };
    }

    // Validate status
    const validStatuses: Order['status'][] = ['requested', 'process', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    await verifyAdmin(token);

    // Check if order exists
    const orderDoc = await adminDb.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      return { success: false, error: "Order not found" };
    }

    await adminDb.collection("orders").doc(orderId).update({
      status,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unauthorized or failed to update order status";
    console.error("Error in updateOrderStatus:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
