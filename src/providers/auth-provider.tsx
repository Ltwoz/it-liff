"use client";

import { createClient } from "@/lib/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLiff } from "./liff-provider";
import { IProfile } from "@/types/profile";
import { profile } from "console";

const AuthContext = createContext<{
  loading: boolean;
  profile: IProfile | undefined;
}>({
  loading: true,
  profile: undefined,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { liff } = useLiff();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<IProfile>();

  const privateRoutes = useMemo(() => [
    "/register",
  ], []);

  const checkAuth = useCallback(async () => {
    if (liff) {
      try {
        setLoading(true);

        const profile = await liff.getProfile();
        setProfile(profile);

        const { data: student } = await supabase
          .from("students")
          .select("*")
          .eq("line_uid", profile.userId)
          .single();

        if (!student) {
          router.push("/register");
        }

        if (privateRoutes.includes(pathname) && student) {
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [liff, pathname, privateRoutes, router, supabase]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
