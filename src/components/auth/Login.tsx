'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "./types/zodTypes";
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosPrivate } from "@/lib/axios";
import userStore from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../progress/spinner";

const Login = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(true);

  const { setUser } = userStore()

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const { register, handleSubmit, formState: { errors }, setError } = form;

  const getAuthen = async () => {
    try {
      const res = await axiosPrivate.get('/api/me')
      setUser({ id: res.data.id, name: res.data.name })
      setIsDeleteDialogOpen(false)
      return res.data
    } catch (error) {
      console.log(error)
      setIsDeleteDialogOpen(true)
      return null
    }
  }

  const { isLoading } = useQuery({
    queryKey: ['authen'],
    queryFn: getAuthen,
    refetchOnWindowFocus: false,
  })

  const onSubmit = async (data: LoginSchemaType) => {
    try{
      const res = await axiosPrivate.post('/api/login', data)
      if (res.status === 200) {
        setIsDeleteDialogOpen(false)
      } else {
        setError('password', {
          type: 'manual',
          message: 'Invalid username or password'
        })
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch(err){
      setError('password', {
        type: 'manual',
        message: 'Invalid username or password'
      })
    }
  }

  return (
    <Dialog 
      open={isDeleteDialogOpen} 
      onOpenChange={(e) => {
        setIsDeleteDialogOpen(e)
      }}
    >
      <DialogContent 
        className="[&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader> 
        <Spinner loading={isLoading}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 gap-2 px-6 py-4">
            <Input
              placeholder="Username"
              {...register('username')}
            />
            <Input
              placeholder="Password"
              type="password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <Button>Sign in</Button>
            <Button variant="outline" type='button'>Sign up</Button>
            <Link href='#'>Forgot password?</Link>
          </form>
        </Spinner>
      </DialogContent>
    </Dialog>
  )
}

export default Login;