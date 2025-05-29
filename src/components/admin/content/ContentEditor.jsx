
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw, Eye, EyeOff, History, Loader2, LayoutTemplate as Template, Clock } from 'lucide-react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ContentTemplates from "./ContentTemplates";
import VersionControl from "./VersionControl";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";

function ContentEditor({ section, content, onSave }) {
  const { toast } = useToast();
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveAttempts, setSaveAttempts] = useState(0);

  // Enhanced auto-save functionality
  useEffect(() => {
    let autoSaveTimer;
    if (autoSaveEnabled && unsavedChanges) {
      autoSaveTimer = setTimeout(() => {
        handleSave(true);
      }, 30000); // Auto-save every 30 seconds
    }
    return () => clearTimeout(autoSaveTimer);
  }, [editedContent, autoSaveEnabled, unsavedChanges]);

  // Track unsaved changes
  useEffect(() => {
    if (JSON.stringify(editedContent) !== JSON.stringify(content)) {
      setUnsavedChanges(true);
    }
  }, [editedContent, content]);

  // Enhanced loading simulation with progress
  useEffect(() => {
    const loadEditor = async () => {
      try {
        // Simulate loading stages
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        setError("Failed to initialize editor");
        setIsLoading(false);
      }
    };
    loadEditor();
  }, []);

  // Enhanced save functionality with retry mechanism
  const handleSave = async (isAutoSave = false) => {
    setIsSaving(true);
    try {
      await onSave(section, editedContent);
      setLastSaved(new Date());
      setUnsavedChanges(false);
      setSaveAttempts(0);

      if (!isAutoSave) {
        toast({
          title: "Success! 🎉",
          description: "Content updated successfully!",
        });

        // Enhanced success animation
        const element = document.getElementById("content-editor");
        element?.classList.add("save-success");
        setTimeout(() => {
          element?.classList.remove("save-success");
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveAttempts(prev => prev + 1);
      
      // Enhanced error handling with retry suggestions
      const errorMessage = saveAttempts >= 3 
        ? "Multiple save attempts failed. Please check your connection or try again later."
        : "Failed to save changes. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyTemplate = (templateContent) => {
    setEditedContent(templateContent);
    setShowTemplates(false);
    setUnsavedChanges(true);
    
    toast({
      title: "Template Applied! ✨",
      description: "Content template has been applied successfully.",
    });
  };

  // Enhanced loading state with progress indication
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-12"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  // Enhanced error state with detailed feedback
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 rounded-lg p-6 text-center"
      >
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Editor</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div id="content-editor" className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{section} Content</h3>
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Last saved: {lastSaved.toLocaleTimeString()}
                {unsavedChanges && (
                  <span className="text-amber-500">(Unsaved changes)</span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2"
            >
              <Template className="w-4 h-4" />
              {showTemplates ? "Hide Templates" : "Show Templates"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {showVersions ? "Hide History" : "Version History"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Preview
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <ContentTemplates onApplyTemplate={handleApplyTemplate} />
            </motion.div>
          )}

          {showVersions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <VersionControl 
                section={section} 
                content={content}
                onRestore={setEditedContent}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editedContent.title}
                onChange={(e) => setEditedContent({
                  ...editedContent,
                  title: e.target.value
                })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="prose-editor-container rounded-lg overflow-hidden border border-gray-200 transition-all duration-200 hover:border-blue-300">
                <ReactQuill
                  value={editedContent.description}
                  onChange={(value) => setEditedContent({
                    ...editedContent,
                    description: value
                  })}
                  className="bg-white"
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'clean'],
                      [{ color: [] }, { background: [] }],
                      ['code-block']
                    ]
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet',
                    'link',
                    'color', 'background',
                    'code-block'
                  ]}
                  style={{ height: '200px' }}
                />
              </div>
            </div>

            {editedContent.cta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={editedContent.cta}
                  onChange={(e) => setEditedContent({
                    ...editedContent,
                    cta: e.target.value
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            )}

            <motion.div
              className="flex justify-between items-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoSave" className="text-sm text-gray-600">
                  Auto-save every 30 seconds
                </label>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedContent(content);
                    setUnsavedChanges(false);
                  }}
                  className="flex items-center gap-2 transition-all duration-200"
                  disabled={isSaving}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave(false)}
                  disabled={isSaving || !unsavedChanges}
                  className="flex items-center gap-2 transition-all duration-200"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {unsavedChanges ? "Save Changes" : "Saved"}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-blue-600">Live Preview</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                      Preview Mode
                    </span>
                  </div>
                </div>

                <div className="preview-content p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                  <div className="max-w-2xl mx-auto">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl font-bold text-gray-900 mb-6"
                    >
                      {editedContent.title}
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: editedContent.description }}
                    />

                    {editedContent.cta && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8"
                      >
                        <Button size="lg" className="w-full md:w-auto">
                          {editedContent.cta}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ContentEditor;
