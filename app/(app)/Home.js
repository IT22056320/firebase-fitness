import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../../components/BottomNav';

export default function Home() {
  const { logout, user } = useAuth();

  console.log('user data: ', user);
  return (
    <View className='flex-1 bg-white'>
      <BottomNav />
    </View>
  )
}