
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Layout, FileText, Image } from "lucide-react";

function ContentTemplates({ onApplyTemplate }) {
  const templates = [
    {
      id: "hero",
      name: "Hero Section",
      description: "A bold hero section with image and CTA",
      icon: Layout,
      content: {
        title: "Welcome to Our Platform",
        description: "Experience the best in class service and rewards",
        cta: "Get Started"
      }
    },
    {
      id: "feature",
      name: "Feature Section",
      description: "Highlight key features or benefits",
      icon: FileText,
      content: {
        title: "Amazing Features",
        description: "Discover what makes us unique",
        cta: "Learn More"
      }
    },
    {
      id: "promotion",
      name: "Promotion Section",
      description: "Showcase special offers or promotions",
      icon: Image,
      content: {
        title: "Special Offer",
        description: "Limited time promotion for our valued customers",
        cta: "Claim Now"
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onApplyTemplate(template.content)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <template.icon className="w-5 h-5" />
            </div>
            <h3 className="font-medium">{template.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{template.description}</p>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onApplyTemplate(template.content);
            }}
          >
            <Plus className="w-4 h-4" />
            Use Template
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export default ContentTemplates;
