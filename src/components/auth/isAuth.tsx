import userStore from "@/store/user-store"
import Spinner from "../progress/spinner"
import { useQuery } from "@tanstack/react-query"
import { axiosPrivate } from "@/lib/axios"
import Login from "./Login"
import React from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isAuth(Component: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function IsAuth(props: any) {
    const { user, setUser } = userStore()

    const getAuthen = async () => {
      try {
        const res = await axiosPrivate.get('/api/me')
        setUser({ id: res.data.id, name: res.data.name })
        return res.data
      } catch (error) {
        console.log(error)
        return null
      }
    }
  
    const { isLoading } = useQuery({
      queryKey: ['authen'],
      queryFn: getAuthen,
      refetchOnWindowFocus: false,
    })

    return (user && !isLoading) ? (
      <Component {...props} />
    ) : (!user && !isLoading) ? (
      <>
        <Component {...props} />
        <Login />
      </>
    ) : (
      <div className="p-20">
        <Spinner loading={true}></Spinner>
      </div>
    )
  }
}