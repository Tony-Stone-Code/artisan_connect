const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ltusfbrautafcdurmryw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dXNmYnJhdXRhZmNkdXJtcnl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTk0MzY5MCwiZXhwIjoyMDk3NTE5NjkwfQ.A8m7i5O2tghVEF1qHGgVrsIaKxGHeZQlFQofFHP37fg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching customer...');
  const { data: users, error: userError } = await supabase.from('User').select('id, email, CustomerProfile(id), ArtisanProfile(id)').in('email', ['customer@demo.com', 'plumber@demo.com']);
  
  if (userError) throw userError;

  const customer = users.find(u => u.email === 'customer@demo.com');
  const plumber = users.find(u => u.email === 'plumber@demo.com');

  const customerId = customer.CustomerProfile[0].id;
  const artisanId = plumber.ArtisanProfile[0].id;

  const uniqueTitle = 'Escrow Perfect Screenshot ' + Date.now();

  console.log('Inserting Request...');
  const { data: req, error: reqError } = await supabase.from('ServiceRequest').insert({
    customer_id: customerId,
    artisan_id: artisanId,
    title: uniqueTitle,
    description: 'Fixing the sink today.',
    address: '123 Main St',
    status: 'QUOTED'
  }).select().single();

  if (reqError) throw reqError;

  console.log('Inserting Quote...');
  const { data: quote, error: quoteError } = await supabase.from('Quote').insert({
    request_id: req.id,
    artisan_id: artisanId,
    amount: 150.00,
    description: 'Will fix everything.',
    status: 'PENDING',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }).select().single();

  if (quoteError) throw quoteError;

  console.log('Done! Title is:', uniqueTitle);
}

main().catch(console.error);
