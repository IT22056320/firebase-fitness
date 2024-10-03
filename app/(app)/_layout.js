import {View,Text} from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../components/HomeHeader'

export default function _layout(){
    return (
        <Stack>
          <Stack.Screen
            name='home'
            options={{
              header: () => <HomeHeader />
            }} 
          />
    
          {/* Profile Screen */}
          <Stack.Screen
            name='profile'
            options={{
              headerShown: false,  // This will remove the header
            }}
          />
    
          {/* Settings Screen */}
          <Stack.Screen
            name="settings"
            options={{
              headerShown: false,  // This will remove the header
            }}
          />
    
          {/* Settings Screen */}
          <Stack.Screen
              name="bmiCalculator"
              options={{
              headerShown: false,  // This will remove the header
            }}
          />
    
          <Stack.Screen
              name="avatarCreator"
              options={{
              headerShown: false,  // This will remove the header
            }}
          />
        </Stack>
    
      )
}