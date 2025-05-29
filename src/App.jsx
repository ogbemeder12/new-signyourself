import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import CampaignHeader from "@/components/CampaignHeader";
import RewardsSection from "@/components/RewardsSection";
import EnhancedWaitingList from "@/components/enhanced/EnhancedWaitingList";
import Sweepstakes from "@/components/Sweepstakes";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/config";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

function App() {
  const [activeModules, setActiveModules] = useState(siteConfig.enabledSections);
  const [isAdminPath, setIsAdminPath] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const updateAdminPath = useCallback(() => {
    const currentPath = window.location.pathname;
    setIsAdminPath(currentPath.startsWith('/admin'));
  }, []);

  useEffect(() => {
    console.log('App initializing...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Site URL:', import.meta.env.VITE_SITE_URL);

    updateAdminPath();
    window.addEventListener('popstate', updateAdminPath);

    const adminAuthStatus = localStorage.getItem("isAdminAuthenticated");
    setIsAdminAuthenticated(adminAuthStatus === "true");

    let initialSessionFetched = false;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        console.log('Auth state changed:', _event, currentSession);
        setSession(currentSession);
        if (!initialSessionFetched) {
          initialSessionFetched = true; 
          setLoadingSession(false);
        } else if (loadingSession) {
          setLoadingSession(false);
        }
      }
    );
    
    const fetchInitialSession = async () => {
      try {
        console.log('Fetching initial session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching initial session:", error);
          setError(error.message);
          toast({ title: "Session Error", description: "Could not fetch initial session.", variant: "destructive" });
        }
        console.log('Initial session:', initialSession);
        setSession(initialSession);
      } catch (e) {
        console.error("Exception fetching initial session:", e);
        setError(e.message);
        toast({ title: "Session Exception", description: "An error occurred while fetching session.", variant: "destructive" });
      } finally {
        if (!initialSessionFetched) {
          initialSessionFetched = true;
          setLoadingSession(false);
        }
      }
    };

    if (!session && loadingSession) {
        fetchInitialSession();
    } else if (initialSessionFetched === false) {
        setLoadingSession(false); 
    }

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
      window.removeEventListener('popstate', updateAdminPath);
    };
  }, [toast, updateAdminPath, session, loadingSession]);

  const handleLogin = (status) => {
    setIsAdminAuthenticated(status);
    if (status) localStorage.setItem("isAdminAuthenticated", "true");
  };

  const handleLogout = async () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAdminAuthenticated(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast({ title: "Logout Error", description: error.message, variant: "destructive" });
    }
    setIsAdminPath(false); 
    window.location.href = "/";
  };

  const handleAdminAccess = () => {
    setIsAdminPath(true);
    window.history.pushState({}, "", "/admin");
  };

  const handleExitAdmin = () => {
    setIsAdminPath(false);
    window.history.pushState({}, "", "/");
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-red-600">
          <h1 className="text-2xl font-bold mb-4">Error Loading Application</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loadingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <LoadingSpinner text="Initializing App..." />
        <Toaster />
      </div>
    );
  }

  if (isAdminPath) {
    if (!isAdminAuthenticated) {
      return (
        <ErrorBoundary>
          <AdminLogin onLogin={handleLogin} />
          <Toaster />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
          <Toaster />
          <div className="fixed top-4 right-4 flex gap-4 z-50">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={handleExitAdmin}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
            >
              Exit Admin
            </button>
          </div>
          <AdminDashboard session={session} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Toaster />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!session && (
             <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
              className="fixed top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            >
              Login with Google
            </button>
          )}
          {session && (
             <button
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) console.error("Error signing out", error);
              }}
              className="fixed top-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50"
            >
              Logout User
            </button>
          )}
          <button
            onClick={handleAdminAccess}
            className="fixed top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
          >
            Admin Dashboard
          </button>
          <CampaignHeader />
          <main className="container mx-auto px-4 py-8">
            {activeModules.rewards && <RewardsSection session={session} />}
            {activeModules.sweepstakes && <Sweepstakes session={session} />}
            {activeModules.waitingList && <EnhancedWaitingList session={session} />}
          </main>
          <Footer />
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
