import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export function useInactivityLogout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const logout = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "You have been logged out due to inactivity.",
      });
      window.location.href = "/auth";
    }
  }, [toast]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

    const handleActivity = () => {
      resetTimer();
    };

    // Check if user is logged in before setting up listeners
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        resetTimer();
        events.forEach((event) => {
          window.addEventListener(event, handleActivity);
        });
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        resetTimer();
        events.forEach((event) => {
          window.addEventListener(event, handleActivity);
        });
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
      }
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      subscription.unsubscribe();
    };
  }, [resetTimer]);
}
