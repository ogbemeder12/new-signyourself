
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitCommit, History, AlertCircle, Eye, DownloadCloud, UploadCloud, CheckCircle } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";


const VersionControl = ({ contentId, currentContent, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const fetchVersions = useCallback(async () => {
    if (!contentId) {
      setVersions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setVersions(data || []);
    } catch (err) {
      console.error("Error fetching versions:", err);
      setError(err.message || "Failed to fetch content versions.");
      toast({
        title: "Error",
        description: `Could not load versions: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contentId, toast]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleSaveNewVersion = async () => {
    if (!contentId || !currentContent) {
      toast({ title: "Error", description: "No content to save.", variant: "destructive" });
      return;
    }
    try {
      const { data, error: insertError } = await supabase
        .from('content_versions')
        .insert({
          content_id: contentId,
          content_data: currentContent,
          // user_id: (await supabase.auth.getUser()).data.user?.id, // Optional: add user who saved
          commit_message: `Manual save at ${new Date().toLocaleString()}`
        })
        .select();

      if (insertError) throw insertError;
      
      toast({
        title: "Version Saved",
        description: "Current content saved as a new version.",
        action: <CheckCircle className="text-green-500" />,
      });
      fetchVersions(); // Refresh versions list
    } catch (err) {
      console.error("Error saving new version:", err);
      toast({
        title: "Save Error",
        description: `Failed to save new version: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  const handleRestoreVersion = (versionData) => {
    if (onRestore && versionData) {
      onRestore(versionData.content_data);
      toast({
        title: "Content Restored",
        description: `Restored content from version created at ${new Date(versionData.created_at).toLocaleString()}`,
      });
    }
  };

  const handlePreviewVersion = (versionData) => {
    setSelectedVersion(versionData);
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Versions</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center text-xl text-gray-700">
          <History className="mr-2 h-6 w-6 text-indigo-600" /> Version Control
        </CardTitle>
        <CardDescription>Manage and restore previous versions of your content.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Button onClick={handleSaveNewVersion} className="mb-6 w-full bg-indigo-600 hover:bg-indigo-700">
          <UploadCloud className="mr-2 h-5 w-5" /> Save Current Content as New Version
        </Button>

        {versions.length === 0 && !loading && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-700">
            <GitCommit className="h-4 w-4" />
            <AlertTitle>No Versions Yet</AlertTitle>
            <AlertDescription>
              No versions have been saved for this content. Edits will create new versions automatically, or you can save one manually.
            </AlertDescription>
          </Alert>
        )}

        <AnimatePresence>
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="mb-3 p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    Version from: {new Date(version.created_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {version.commit_message || "Auto-saved version"}
                  </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handlePreviewVersion(version)}>
                    <Eye className="mr-1 h-4 w-4" /> Preview
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handleRestoreVersion(version)} className="bg-green-600 hover:bg-green-700">
                    <DownloadCloud className="mr-1 h-4 w-4" /> Restore
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 bg-gray-50 p-4">
        <p>Content versions are automatically created on major edits. You can also save versions manually.</p>
      </CardFooter>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-indigo-700">Preview Content Version</DialogTitle>
            <DialogDescription>
              Viewing version from: {selectedVersion ? new Date(selectedVersion.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 border rounded-md max-h-[400px] overflow-y-auto bg-gray-50 text-sm text-gray-700">
            <pre className="whitespace-pre-wrap">{selectedVersion ? JSON.stringify(selectedVersion.content_data, null, 2) : 'No content to display.'}</pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VersionControl;
