'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";

const Login = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e)}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader> 
        <div className="flex flex-col space-y-2 gap-2 px-6 py-4">
          <Input
            placeholder="Username"
          />
          <Input
            placeholder="Password"
          />
          <Button>Sign in</Button>
          <Button variant="outline" type='button'>Sign up</Button>
          <Link href='#'>Forgot password?</Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Login;