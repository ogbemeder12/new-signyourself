
import { supabase } from '@/lib/supabase';

export const generateUniqueDiscountCode = async (prefix = 'EARLY') => {
  const code = `${prefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  try {
    const { data: existingCode, error: fetchError } = await supabase
      .from('discount_codes')
      .select('code')
      .eq('code', code)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { 
      console.error('Error checking existing discount code:', fetchError);
      throw fetchError;
    }

    if (existingCode) {
      return generateUniqueDiscountCode(prefix);
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { data: newCodeData, error: insertError } = await supabase
      .from('discount_codes')
      .insert([{
        code,
        type: 'percentage',
        value: 15,
        max_uses: 1,
        current_uses: 0,
        created_at: new Date().toISOString(),
        expires_at: expiryDate.toISOString(),
        conditions: {
          min_purchase: 0,
          excluded_products: [],
          stackable: false
        },
        metadata: {
          campaign: 'waiting_list',
          source: 'early_access'
        }
      }])
      .select('code')
      .single();

    if (insertError) {
      console.error('Error inserting new discount code:', insertError);
      throw insertError;
    }
    return newCodeData.code;
  } catch (error) {
    console.error('Error generating discount code:', error);
    
    if (!error.message.includes('duplicate key value violates unique constraint')) {
        throw error;
    } else {
        return generateUniqueDiscountCode(prefix);
    }
  }
};
