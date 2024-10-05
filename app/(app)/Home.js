import {View ,Text, Pressable} from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'expo-router';


export default function Home(){

    const router = useRouter();
    const {logout,user} =useAuth();
    handleLogout = async()=>{
        await logout();
    }
   // console.log('user data',user);
    return (
        <View style={{paddingTop:40,backgroundColor: 'red'}} >
            <Text style={{textAlign:'center'}}>Home</Text>
           <Pressable onPress={handleLogout}>
            <Text>Sign Out</Text>
           </Pressable>
           <Pressable onPress={() => router.push('DiatPlanHome')}>
            <Text>Diat Plan</Text>
           </Pressable>
        </View>
    )
}