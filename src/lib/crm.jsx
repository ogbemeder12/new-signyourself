
import { supabase } from './supabase';
import { siteConfig } from './config';
import { calculateLeadScore, assignLeadSegment } from './crm/leadScoring';

export const createLead = async (leadData) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating lead:', error.message);
    throw error;
  }
};

export const getLeads = async (filters = {}) => {
  try {
    let query = supabase.from('leads').select('*');
    if (filters.segment) {
      query = query.eq('segment', filters.segment);
    }
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.ascending !== undefined ? filters.ascending : true });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    throw error;
  }
};

export const updateLead = async (leadId, updates) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating lead:', error.message);
    throw error;
  }
};

export const getLeadSegmentsConfig = () => {
  return siteConfig.adminConfig.leadSegments;
};


export const getTopLeads = async (limit = 5) => {
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('lead_score', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching top leads:', error.message);
        throw error;
    }
};

export const getLeadConversionRate = async () => {
    try {
        const { count: totalLeads, error: totalError } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        const { count: convertedLeads, error: convertedError } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'converted'); 

        if (convertedError) throw convertedError;
        
        if (totalLeads === 0) return 0;
        return (convertedLeads / totalLeads) * 100;

    } catch (error) {
        console.error('Error fetching lead conversion rate:', error.message);
        throw error;
    }
};

export { calculateLeadScore, assignLeadSegment };
