
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Image as ImageIcon, Link, Send } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function PostScheduler({ selectedPlatforms }) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedulePost = async () => {
    if (!postContent || !scheduledDate || !scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would integrate with your social media APIs
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

      toast({
        title: "Success!",
        description: "Post has been scheduled successfully",
      });

      // Reset form
      setPostContent("");
      setScheduledDate("");
      setScheduledTime("");
      setMedia([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Create Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <div className="prose-editor-container rounded-lg overflow-hidden border border-gray-200">
                  <ReactQuill
                    value={postContent}
                    onChange={setPostContent}
                    className="bg-white"
                    theme="snow"
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        ['link', 'image'],
                        [{ list: 'bullet' }],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Drag and drop files here, or click to select files
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSchedulePost}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  "Scheduling..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Schedule Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            <div className="space-y-4">
              {selectedPlatforms.map(platform => (
                <div
                  key={platform}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-medium capitalize mb-2">{platform} Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: postContent }} />
                    {media.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {media.map((file, index) => (
                          <div key={index} className="bg-gray-200 rounded-lg aspect-video" />
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{scheduledDate}</span>
                      <Clock className="w-4 h-4 ml-4 mr-1" />
                      <span>{scheduledTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
            <div className="text-center text-gray-500 py-8">
              No posts scheduled yet
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PostScheduler;
