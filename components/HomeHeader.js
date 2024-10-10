import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Platform } from 'react-native';
import { useSafeAreaInsets} from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { useAuth } from '../app/context/AuthContext';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { MenuItem } from './CustomeMenuItems';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const ios = Platform.OS == 'ios';
export default function HomeHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const {top} = useSafeAreaInsets();
  const handleProfile = () => {
    router.push('profile');
  }
  const handleSettings = () => {
    router.push('settings');
  };  
  const handleGoals = async() => {
    router.push('CustomGoals');
  }
  const handleLogout = async() => {
    await logout();
  }

  const handleBloodPressure = () => {
    router.push('BloodPressureHeartRate');
  };
  return (
    <View style={{paddingTop: ios? top : top+10 }} className='flex-row justify-between px-5 bg-indigo-700 pb-6 rounded-b-3xl shadow'>
      <View>
        <Text style={{fontSize: hp(3)}} className='font-medium text-white'>Health360</Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger>
            <Image
              style={{height: hp(4.3), aspectRatio: 1, borderRadius: 100}}
              source={user?.profileUrl}
              placeholder={{ blurhash }}
              transition={500}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: 'continuous',
                marginTop: 40,
                marginLeft: -30,
                backgroundColor: 'white',
                shadowOpacity: 0.2,
                shadowOffset: {width: 0, height: 0},
                width: 160
              }
            }}
          >
            <MenuItem 
              text='profile'
              action={handleProfile}
              value={null}
              icon={<Feather name='user' size={hp(2.5)} color='#737373' />}
            />
            <Devider />
            <MenuItem 
              text='settings'
              action={handleSettings}
              value={null}
              icon={<Feather name='settings' size={hp(2.5)} color='#737373' />}
            />
            <Devider />
            <MenuItem 
              text='CustomGoals'
              action={handleGoals}
              value={null}
              icon={<Feather name='user-check' size={hp(2.5)} color='#737373' />}
            />
            <Devider />
            <MenuItem 
              text='sign Out'
              action={handleLogout}
              value={null}
              icon={<MaterialCommunityIcons name='logout' size={hp(2.5)} color='#737373' />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  )
}

const Devider = () => {
  return (
    <View className='p-[1] w-full bg-neutral-200' />
  )
}