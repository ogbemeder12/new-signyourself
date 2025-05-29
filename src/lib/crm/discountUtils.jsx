
import { supabase } from '@/lib/supabase';

export const generateUniqueDiscountCode = async (prefix = 'EARLY') => {
  const code = `${prefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  try {
    const { data: existingCode } = await supabase
      .from('discount_codes')
      .select()
      .eq('code', code)
      .single();

    if (existingCode) {
      return generateUniqueDiscountCode(prefix);
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const { data: newCode, error } = await supabase
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
      .select()
      .single();

    if (error) throw error;
    return newCode.code;
  } catch (error) {
    console.error('Error generating discount code:', error);
    throw error;
  }
};
