import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import  React, { navigation } from 'react';
import { useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.db");

db.transaction(tx => {
    tx.executeSql(
      'create table if not exists alarms (id integer primary key not null, timeforfirststation int, transportation text, timeforbuilding int, timeformyseat int);');
    });

let alarm = [];

//데이터 메모리에 만들어 놓고 press 때마다 입력받은 후에
//마지막에 async await 함수 만들어서 데이터베이스에 쿼리문 넣고 메인 문 호출!
//데이터베이스 정의 필요!
function settingHelpSplashImage({navigation}) {
    return (
        <View>
            <Image source={require('./assets/settingHelp.png')}></Image>
            <Button title='다음' onPress={()=>{navigation.navigate('settingHelpTimeForFirstStation')}}></Button>
        </View>
        )
}
//변수의 변화가 아니라 prop이나 state의 변화가 있어야 re-render가 진행된다. 
function settingHelpTimeForFirstStation({navigation}) {
    let [minute, setMinute] = useState(0);
    return(
        <View>
            <Text>첫 정류장까지 걸리는 도보 시간은 몇 분입니까?</Text>
            <Text>{minute}분</Text>
            <Button onPress={ () =>{setMinute(minute + 1);}} title="올려" ></Button>
            <Button onPress={()=>{setMinute(minute - 1);}} title="내려" ></Button>
            <Button title='다음' onPress={() =>{
                alarm.push(minute);
                navigation.navigate('settingFirstTransportation')}}></Button>
        </View>
    )
}

function settingFirstTransportation({navigation}) {
    let [value, onChangeText] = useState('Useless Placeholder');
    return (
        <View>
           <Text>{value} 정류장</Text>
           <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => onChangeText(text)}
        value={value}
      /> 
      <Button title='다음' onPress={()=>{
          alarm.push(value);
          navigation.navigate('settingTimeForBuilding')}}></Button>
        </View>    
    );
  }
  
  function settingTimeForBuilding({navigation}) {
    let [minute, setMinute] = useState(0);
    return(
        <View>
            <Text>당신의 사무실 건물 또는 빌딩까지 걸리는 시간은?</Text>
            <Text>{minute}분</Text>
            <Button onPress={()=>{setMinute(minute + 1);}} title="올려" ></Button>
            <Button onPress={()=>{setMinute(minute - 1);}} title="내려" ></Button>
            <Button title='다음' onPress={()=>{
                alarm.push(minute);
                navigation.navigate('settingTimeForMySeat')}}></Button>
        </View>
    )
  }

  function settingTimeForMySeat({navigation}) {
    let [minute, setMinute] = useState(0);
    return(
        <View>
            <Text>건물 안에서 내 자리까지 걸리는 시간은??</Text>
            <Text>{minute}분</Text>
            <Button onPress={()=>{setMinute(minute + 1);}} title="올려" ></Button>
            <Button onPress={()=>{setMinute(minute - 1);}} title="내려" ></Button>
            <Button title='다음' onPress={ async ()=>{
                await alarm.push(minute);
                await saveAlarm(alarm);
                navigation.navigate('settingTimeForMySeat')}}></Button>
        </View>
    )
  }

  let saveAlarm = function (alarmArray) {
      db.transaction(tx => {
          tx.executeSql('insert into alarms (timeforfirststation, transportation, timeforbuilding, timeformyseat) values(?, ?, ?, ?)', alarmArray);
          tx.executeSql('select * from alarms', [], (_,{rows}) => {
              console.log(JSON.stringify(rows));
          })
      })
  }

const appNavigator = createStackNavigator({
    settingHelpSplashImage : settingHelpSplashImage,
    settingHelpTimeForFirstStation : settingHelpTimeForFirstStation,
    settingFirstTransportation : settingFirstTransportation,
    settingTimeForBuilding : settingTimeForBuilding,
    settingTimeForMySeat : settingTimeForMySeat,
});

const outPutApp = createAppContainer(appNavigator);

export default outPutApp;