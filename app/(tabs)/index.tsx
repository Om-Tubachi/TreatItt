import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '../../constants/theme'
export default function index() {
  return (
    <View style={{
      backgroundColor:colors.tabsBackground,
      flex:1
    }}>
      <Text>index</Text>
    </View>
  )
}