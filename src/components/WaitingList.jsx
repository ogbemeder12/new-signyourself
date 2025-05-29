
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function WaitingList() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("waitingListEmail", email);
      
      toast({
        title: "Successfully Joined!",
        description: "You've been added to our waiting list. We'll notify you when it's your turn!",
      });

      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="my-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join the Waiting List
          </h2>
          <p className="text-gray-600 mb-8">
            Be the first to know about exclusive offers and new rewards. Sign up
            now and get early access!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Now"}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

export default WaitingList;
