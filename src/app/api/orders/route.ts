import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { createOrder, getUserOrders } from '@/app/actions/orders';

const allowedOrigins = ['https://eclipseshop.xyz', 'https://www.eclipseshop.xyz'];

function setCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', 'null');
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response, origin);
  return response;
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && !allowedOrigins.includes(origin)) {
    const response = NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    setCorsHeaders(response, origin);
    return response;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    setCorsHeaders(response, origin);
    return response;
  }

  const token = authHeader.substring(7);
  let decodedToken;
  try {
    decodedToken = await adminAuth?.verifyIdToken(token);
  } catch (error) {
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    setCorsHeaders(response, origin);
    return response;
  }

  if (!decodedToken) {
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    setCorsHeaders(response, origin);
    return response;
  }

  const uid = decodedToken.uid;

  // Get user orders
  const result = await getUserOrders(token); // Pass token as in server action

  const response = NextResponse.json(result);
  setCorsHeaders(response, origin);
  return response;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && !allowedOrigins.includes(origin)) {
    const response = NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    setCorsHeaders(response, origin);
    return response;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    setCorsHeaders(response, origin);
    return response;
  }

  const token = authHeader.substring(7);
  let decodedToken;
  try {
    decodedToken = await adminAuth?.verifyIdToken(token);
  } catch (error) {
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    setCorsHeaders(response, origin);
    return response;
  }

  if (!decodedToken) {
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    setCorsHeaders(response, origin);
    return response;
  }

  const uid = decodedToken.uid;

  try {
    const body = await request.json();
    // Ensure userId matches
    body.userId = uid;
    body.userEmail = decodedToken.email;
    body.userName = decodedToken.name || '';

    const result = await createOrder(body);

    const response = NextResponse.json(result);
    setCorsHeaders(response, origin);
    return response;
  } catch (error) {
    const response = NextResponse.json({ error: 'Bad request' }, { status: 400 });
    setCorsHeaders(response, origin);
    return response;
  }
}
