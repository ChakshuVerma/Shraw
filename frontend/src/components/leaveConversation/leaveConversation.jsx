/* eslint-disable react/prop-types */
// import React from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const LeaveConversation = ({ conversationName, conversationId }) => {
  const handleClick = async () => {
    const answer = confirm(
      `Are you sure you want to leave this ${conversationName}?
      You won't be able to retrieve the data from this conversation`
    );

    if (answer) {
      try {
        const res = await fetch("/api/conversations/leave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
          }),
        });

        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Button variant="destructive" className="m-4" onClick={handleClick}>
        Leave Conversation
      </Button>
    </>
  );
};

export default LeaveConversation;
