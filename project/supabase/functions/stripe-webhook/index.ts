import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
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

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    // In production, verify the webhook signature with Stripe
    // const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    
    // For demo purposes, parse the webhook payload directly
    const event = JSON.parse(body);

    console.log('Received webhook:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.id;
        
        // Update payment status in database
        const { error: updateError } = await supabaseClient
          .from('payments')
          .update({ status: 'completed' })
          .eq('stripe_payment_id', paymentId);

        if (updateError) {
          console.error('Error updating payment:', updateError);
          throw updateError;
        }

        // Get payment details to determine what to update
        const { data: payment, error: fetchError } = await supabaseClient
          .from('payments')
          .select('*')
          .eq('stripe_payment_id', paymentId)
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
              subscription_id: paymentId
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

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.id;
        
        await supabaseClient
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_id', paymentId);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await supabaseClient
          .from('users')
          .update({ 
            premium: false,
            subscription_status: 'cancelled'
          })
          .eq('subscription_id', subscription.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});