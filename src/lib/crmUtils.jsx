
import { supabase } from '@/lib/supabase';
import { calculateLeadScore as calculateLeadScoreUtil } from './crm/leadScoring';

export const segmentLeadsWithScoring = async () => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*');

    if (error) throw error;

    const segments = {
      hot: leads.filter(lead => {
        const score = calculateLeadScoreUtil(lead);
        return score >= 30;
      }),
      warm: leads.filter(lead => {
        const score = calculateLeadScoreUtil(lead);
        return score >= 15 && score < 30;
      }),
      cold: leads.filter(lead => {
        const score = calculateLeadScoreUtil(lead);
        return score < 15;
      })
    };

    await Promise.all(
      Object.entries(segments).flatMap(([segment, segmentLeads]) =>
        segmentLeads.map(lead =>
          supabase
            .from('leads')
            .update({
              segment,
              updated_at: new Date().toISOString(),
              metadata: {
                ...(lead.metadata || {}),
                last_segmented: new Date().toISOString(),
                segment_reason: `Score: ${calculateLeadScoreUtil(lead)}`,
                segment_history: [
                  ...((lead.metadata?.segment_history) || []),
                  {
                    segment,
                    timestamp: new Date().toISOString(),
                    score: calculateLeadScoreUtil(lead)
                  }
                ]
              }
            })
            .eq('id', lead.id)
        )
      )
    );

    return segments;
  } catch (error) {
    console.error('Error segmenting leads:', error);
    throw error;
  }
};
