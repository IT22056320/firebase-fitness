import {View ,Text} from 'react-native'
import React, { useEffect } from 'react'

import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout = ()=>{
    const {isAuthenticated} = useAuth();
    const segements = useSegments();
    const router = useRouter();

    useEffect(()=>{
        //check if user is authencticated or not
     if(typeof isAuthenticated=='undefined') return;
     const inApp = segements[0]=='(app)';
     if(isAuthenticated && !inApp){
   //redirect to home
   router.replace('Home');
     }else if(isAuthenticated==false){
        //redirect to sign in
        router.replace('SignIn');
     }
    },[isAuthenticated])

    return <Slot />
}

export default function RootLayout(){
    return (
    <MenuProvider>
        <AuthContextProvider>
          <MainLayout />
        </AuthContextProvider>
    </MenuProvider>
    )
}