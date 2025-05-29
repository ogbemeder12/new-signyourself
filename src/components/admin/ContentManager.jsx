
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ContentEditor from "@/components/admin/ContentEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Save, Eye } from "lucide-react";

function ContentManager({ sections, onUpdate }) {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  const [versionHistory] = useState([
    { date: "2025-04-03", author: "Admin", changes: "Updated rewards description" },
    { date: "2025-04-02", author: "Moderator", changes: "Modified sweepstakes rules" },
    { date: "2025-04-01", author: "Admin", changes: "Initial content setup" }
  ]);

  const handleUpdate = async (section, content) => {
    try {
      await onUpdate(section, content);
      toast({
        title: "Success",
        description: "Content updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Content Management</h2>
            <p className="text-gray-600">Edit and manage website content</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? "Exit Preview" : "Preview"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="space-y-8">
              {Object.entries(sections).map(([section, content]) => (
                <ContentEditor
                  key={section}
                  section={section}
                  content={content}
                  onSave={handleUpdate}
                  previewMode={previewMode}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {versionHistory.map((version, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <History className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{version.changes}</p>
                      <p className="text-sm text-gray-500">
                        By {version.author} on {version.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      /* Implement version restore */
                      toast({
                        title: "Restore Version",
                        description: "This feature will be available soon!",
                      });
                    }}
                  >
                    Restore
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default ContentManager;
