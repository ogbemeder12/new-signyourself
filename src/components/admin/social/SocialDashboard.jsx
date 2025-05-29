
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Facebook, Twitter, Instagram, Calendar, BarChart2, Users, MessageCircle } from "lucide-react";
import PostScheduler from "./PostScheduler";
import AnalyticsOverview from "./AnalyticsOverview";
import EngagementMetrics from "./EngagementMetrics";
import ContentCalendar from "./ContentCalendar";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";

function SocialDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["facebook", "twitter", "instagram"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleError = (error) => {
    setError(error.message);
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-50 rounded-lg text-center"
      >
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Social Media Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your social media presence across platforms</p>
            </div>
            <div className="flex gap-2">
              {[
                { name: "facebook", icon: Facebook, color: "bg-blue-100 text-blue-600" },
                { name: "twitter", icon: Twitter, color: "bg-sky-100 text-sky-600" },
                { name: "instagram", icon: Instagram, color: "bg-pink-100 text-pink-600" }
              ].map(platform => (
                <Button
                  key={platform.name}
                  variant={selectedPlatforms.includes(platform.name) ? "default" : "outline"}
                  className={`flex items-center gap-2 ${
                    selectedPlatforms.includes(platform.name) ? platform.color : ""
                  }`}
                  onClick={() => handlePlatformToggle(platform.name)}
                >
                  <platform.icon className="w-4 h-4" />
                  {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="schedule"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Posts
              </TabsTrigger>
              <TabsTrigger 
                value="engagement"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Content Calendar
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <LoadingSpinner />
              </motion.div>
            ) : (
              <>
                <TabsContent value="overview" className="mt-6">
                  <AnalyticsOverview 
                    selectedPlatforms={selectedPlatforms}
                    onError={handleError}
                  />
                </TabsContent>

                <TabsContent value="schedule" className="mt-6">
                  <PostScheduler 
                    selectedPlatforms={selectedPlatforms}
                    onError={handleError}
                  />
                </TabsContent>

                <TabsContent value="engagement" className="mt-6">
                  <EngagementMetrics 
                    selectedPlatforms={selectedPlatforms}
                    onError={handleError}
                  />
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                  <ContentCalendar 
                    selectedPlatforms={selectedPlatforms}
                    onError={handleError}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}

export default SocialDashboard;
