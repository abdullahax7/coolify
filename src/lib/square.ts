import { SquareClient, SquareEnvironment } from 'square';

const isSandbox = (process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? '').trim().startsWith('sandbox');

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: isSandbox ? SquareEnvironment.Sandbox : SquareEnvironment.Production,
});

export const SQUARE_LOCATION_ID = (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? '').trim();
