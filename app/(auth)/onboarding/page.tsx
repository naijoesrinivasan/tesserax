import React from 'react'
import AccountProfile from '@/components/forms/AccountProfile'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

export default async function Page({ params } : { params: { id: string }}) {
  console.log("Onboarding page: ", params)
  const user = await currentUser()
  if(!user) return null;
  const userInfo = await fetchUser(user.id)

  if(userInfo?.onboarded) redirect('/');

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user?.username,
    name: userInfo ? userInfo?.name || user?.firstName : "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user?.imageUrl,
  }

  console.log("User data passed to Account Profile: ", userData, typeof userData.objectId)

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <p className='mt-3 text-heading2-semibold text-light-1'>Complete your profile now to use tesserax</p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  )
}
