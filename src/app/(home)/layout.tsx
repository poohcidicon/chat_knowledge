'use client'

import isAuth from "@/components/auth/isAuth";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return children
};

export default isAuth(HomeLayout);