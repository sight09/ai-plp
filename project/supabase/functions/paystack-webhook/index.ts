import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    // In production, verify the webhook signature with Paystack
    // const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    // if (hash !== signature) throw new Error('Invalid signature');
    
    const event = JSON.parse(body);

    console.log('Received Paystack webhook:', event.event);

    switch (event.event) {
      case 'charge.success': {
        const charge = event.data;
        const paymentRef = charge.reference;
        
        // Update payment status in database
        const { error: updateError } = await supabaseClient
          .from('payments')
          .update({ status: 'completed' })
          .eq('stripe_payment_id', paymentRef);

        if (updateError) {
          console.error('Error updating payment:', updateError);
          throw updateError;
        }

        // Get payment details
        const { data: payment, error: fetchError } = await supabaseClient
          .from('payments')
          .select('*')
          .eq('stripe_payment_id', paymentRef)
          .single();

        if (fetchError || !payment) {
          console.error('Error fetching payment:', fetchError);
          throw fetchError;
        }

        // Update user or job based on payment type
        if (payment.type === 'subscription') {
          await supabaseClient
            .from('users')
            .update({ 
              premium: true,
              subscription_status: 'active',
              subscription_id: paymentRef
            })
            .eq('id', payment.user_id);
        } else if (payment.type === 'job_boost' && payment.job_id) {
          await supabaseClient
            .from('jobs')
            .update({ boosted: true })
            .eq('id', payment.job_id);
        }

        break;
      }

      case 'charge.failed': {
        const charge = event.data;
        const paymentRef = charge.reference;
        
        await supabaseClient
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_id', paymentRef);

        break;
      }

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Paystack webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});