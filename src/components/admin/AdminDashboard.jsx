
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import LeadsList from "@/components/admin/LeadsList";
import AnalyticsOverview from "@/components/admin/AnalyticsOverview";
import LeadSegments from "@/components/admin/LeadSegments";
import ContentManager from "@/components/admin/ContentManager";
import UserManagement from "@/components/admin/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { segmentLeadsWithScoring } from "@/lib/crmUtils";

function AdminDashboard() {
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState({
    hot: [],
    warm: [],
    cold: []
  });
  const [contentSections, setContentSections] = useState({
    rewards: {
      title: "Exclusive Rewards & Sweepstakes",
      description: "Join our exclusive rewards program and enter exciting sweepstakes for a chance to win amazing prizes!",
      cta: "Join Now"
    },
    sweepstakes: {
      title: "Monthly Prize Draw",
      description: "Enter our exclusive monthly sweepstakes for a chance to win amazing prizes!",
      cta: "Enter Now"
    },
    waitingList: {
      title: "Join the VIP Waiting List",
      description: "Be the first to know about exclusive offers and new rewards. Sign up now and get early access!",
      cta: "Join VIP List"
    }
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);

      const segmentedLeads = await segmentLeadsWithScoring();
      setSegments(segmentedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentUpdate = async (section, content) => {
    try {
      setContentSections(prev => ({
        ...prev,
        [section]: content
      }));

      await supabase
        .from('content')
        .upsert({ 
          section, 
          content,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Success",
        description: "Content updated successfully!",
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-5 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsOverview leads={leads} loading={loading} />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsList leads={leads} loading={loading} onRefresh={fetchLeads} />
          </TabsContent>

          <TabsContent value="segments">
            <LeadSegments segments={segments} loading={loading} />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager 
              sections={contentSections}
              onUpdate={handleContentUpdate}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
