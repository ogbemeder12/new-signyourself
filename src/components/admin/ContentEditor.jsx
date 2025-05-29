
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, RefreshCw, Eye, EyeOff } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ContentEditor({ section, content, onSave }) {
  const { toast } = useToast();
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(section, editedContent);
      toast({
        title: "Success",
        description: "Content updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{section} Content</h3>
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="prose-editor-container rounded-lg overflow-hidden border border-gray-200">
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
            <div>
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditedContent(content)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </motion.div>

        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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

            <div className="preview-content p-6 max-h-[600px] overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {editedContent.title}
                </h2>
                
                <div 
                  className="prose max-w-none text-gray-700 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: editedContent.description }}
                />

                {editedContent.cta && (
                  <div className="mt-8">
                    <Button size="lg" className="w-full md:w-auto text-base px-8">
                      {editedContent.cta}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ContentEditor;
