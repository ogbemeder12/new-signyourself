
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Key, Lock, UserPlus, Settings } from "lucide-react";

function UserRoleManager({ user, onUpdate }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(user.permissions || []);

  const availablePermissions = {
    content: {
      label: "Content Management",
      description: "Can edit and publish content",
      icon: Shield
    },
    users: {
      label: "User Management",
      description: "Can manage user accounts",
      icon: UserPlus
    },
    analytics: {
      label: "Analytics Access",
      description: "Can view analytics data",
      icon: Settings
    },
    admin: {
      label: "Admin Access",
      description: "Full administrative access",
      icon: Key
    }
  };

  const handlePermissionToggle = (permission) => {
    const newPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter(p => p !== permission)
      : [...selectedPermissions, permission];
    
    setSelectedPermissions(newPermissions);
  };

  const handleSave = async () => {
    try {
      await onUpdate({
        ...user,
        permissions: selectedPermissions
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "User permissions updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Role & Permissions</h3>
          <p className="text-gray-600">Manage user access levels</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Lock className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Key className="w-4 h-4" />
              Edit Permissions
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(availablePermissions).map(([key, permission]) => (
          <motion.div
            key={key}
            initial={isEditing ? { x: -20, opacity: 0 } : false}
            animate={isEditing ? { x: 0, opacity: 1 } : false}
            className={`p-4 rounded-lg border ${
              isEditing ? 'cursor-pointer hover:bg-gray-50' : ''
            } ${
              selectedPermissions.includes(key)
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => isEditing && handlePermissionToggle(key)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                selectedPermissions.includes(key)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <permission.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">{permission.label}</p>
                <p className="text-sm text-gray-600">{permission.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-end gap-4"
        >
          <Button
            variant="outline"
            onClick={() => {
              setSelectedPermissions(user.permissions || []);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UserRoleManager;
