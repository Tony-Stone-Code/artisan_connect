import prisma from './src/lib/prisma';
import { acceptQuoteAndPayEscrow, releaseEscrow } from './src/app/actions/escrow';
import { createQuote } from './src/app/actions/quotes';
// Note: We can't easily call server actions that rely on supabase.auth.getUser() 
// without a real request context or mocking the supabase client. 
