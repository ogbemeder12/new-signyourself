
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Gift, Share2, CalendarClock, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { supabase } from '@/lib/supabase';
import { createLead } from '@/lib/crm';
import { generateUniqueDiscountCode } from '@/lib/crm/discountUtils';
import { trackSocialShare } from '@/lib/crm/socialReferralUtils';
import { sendWaitingListEmail } from '@/lib/emailService';
import CountdownTimer from '@/components/waiting-list/CountdownTimer.jsx';
import { siteConfig, waitingListConfig } from '@/lib/config';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import WaitingListForm from '@/components/enhanced/WaitingListForm.jsx';
import WaitingListSuccessMessage from '@/components/enhanced/WaitingListSuccessMessage.jsx';
import WaitingListHeader from '@/components/enhanced/WaitingListHeader.jsx';
import WaitingListSocialShare from '@/components/enhanced/WaitingListSocialShare.jsx';

const EnhancedWaitingList = ({ session }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
      setEmail(session.user.email || '');
      if (session.user.user_metadata?.full_name) {
        setName(session.user.user_metadata.full_name);
      }
    } else {
      setCurrentUser(null);
      setEmail('');
      setName('');
    }
    const generatedReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setReferralCode(generatedReferralCode);
  }, [session]);

  const getWaitingListPosition = useCallback(async (leadId) => {
    if (!leadId) return null;
    try {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('created_at')
        .eq('id', leadId)
        .single();

      if (leadError || !leadData) {
        console.error('Error fetching lead for position:', leadError);
        return null;
      }

      const { count, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .lte('created_at', leadData.created_at)
        .eq('source', 'waiting_list');

      if (countError) {
        console.error('Error fetching waiting list position:', countError);
        return null;
      }
      return count;
    } catch (e) {
      console.error('Exception fetching waiting list position:', e);
      return null;
    }
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    setEmail(formData.email);
    setName(formData.name);

    if (!formData.email) {
      setError('Email is required.');
      setIsLoading(false);
      toast({ title: 'Validation Error', description: 'Email is required.', variant: 'destructive' });
      return;
    }

    const newDiscountCode = generateUniqueDiscountCode();
    const leadData = {
      email: formData.email,
      name: formData.name || (currentUser?.user_metadata?.full_name) || 'Guest',
      source: 'waiting_list',
      status: 'new',
      discount_code: newDiscountCode,
      referral_code: referralCode,
      metadata: {
        joined_at: new Date().toISOString(),
      },
      user_id: currentUser?.id || null,
    };

    try {
      const lead = await createLead(leadData);
      if (lead && lead.id) {
        setIsSubmitted(true);
        const currentPosition = await getWaitingListPosition(lead.id);
        setPosition(currentPosition);
        
        toast({
          title: 'Successfully Joined!',
          description: `You're on the waiting list! ${currentPosition ? `Your position is #${currentPosition}.` : ''} Discount code: ${newDiscountCode}`,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          duration: 7000,
        });

        if (siteConfig.notifications?.emailOnWaitingListJoin) {
          await sendWaitingListEmail(formData.email, currentPosition, newDiscountCode, formData.name);
        }
      } else {
        throw new Error('Failed to create lead or lead ID not returned.');
      }
    } catch (submissionError) {
      console.error('Submission error:', submissionError);
      setError(submissionError.message || 'An error occurred. Please try again.');
      toast({
        title: 'Submission Failed',
        description: submissionError.message || 'Could not join the waiting list.',
        variant: 'destructive',
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialShare = async (platform) => {
    const shareUrl = `${window.location.origin}?ref=${referralCode}`;
    const text = `Join the waiting list for ${siteConfig.name || 'this amazing product'}!`;
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        url = `mailto:?subject=${encodeURIComponent(text)}&body=Join me on the waiting list here: ${encodeURIComponent(shareUrl)}`;
    }
    window.open(url, '_blank');

    if (!currentUser?.id && !isSubmitted) {
      toast({ title: "Join First or Login", description: "Please join the waiting list or sign in to track your shares.", variant: "default"});
      return;
    }
    
    if (currentUser?.id) {
        try {
            await trackSocialShare(currentUser.id, platform, shareUrl);
            toast({
                title: 'Shared Successfully!',
                description: `Thanks for sharing! Your referral code is ${referralCode}.`,
                icon: <Zap className="h-5 w-5 text-yellow-500" />
            });
        } catch(shareError){
            console.error("Error tracking social share:", shareError);
            toast({
                title: 'Share Tracking Error',
                description: 'Could not track your share action.',
                variant: 'destructive'
            });
        }
    } else if (isSubmitted) {
         toast({
            title: 'Shared!',
            description: `Your referral code is ${referralCode}. Sign up to track points!`,
            icon: <Zap className="h-5 w-5 text-yellow-500" />
        });
    }
  };
  
  const launchDate = waitingListConfig.launchDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); 

  if (isSubmitted) {
    return (
      <WaitingListSuccessMessage 
        position={position} 
        referralCode={referralCode} 
        onSocialShare={handleSocialShare} 
      />
    );
  }

  return (
    <motion.section
      id="waiting-list"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="py-16 bg-gradient-to-tr from-purple-700 via-pink-600 to-orange-500 text-white"
    >
      <div className="container mx-auto px-6 text-center">
        <WaitingListHeader 
            title={waitingListConfig.title || "Be the First to Know!"}
            description={waitingListConfig.description || "Join our waiting list for exclusive early access, special discounts, and updates on our launch."}
        />

        {waitingListConfig.showCountdown && launchDate && (
          <CountdownTimer targetDate={launchDate} />
        )}

        <WaitingListForm
          initialEmail={email}
          initialName={name}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        {waitingListConfig.showSocialShare && (
          <WaitingListSocialShare 
            onSocialShare={handleSocialShare}
            referralBonusPoints={waitingListConfig.referralBonus.points || 100}
          />
        )}
         <div className="mt-12 text-center">
            <p className="text-sm opacity-80">
                Launch Date: <CalendarClock className="inline-block h-4 w-4 mr-1" /> 
                {new Date(launchDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
      </div>
    </motion.section>
  );
};

export default EnhancedWaitingList;
