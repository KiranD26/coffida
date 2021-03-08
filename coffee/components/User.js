import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList, StatusBar, Alert, ScrollView, TextInput, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class User extends Component{

  constructor(props){
    super(props);

      this.state = {
        first_name:"",
        last_name:"",
        email: "",
        password: "",
        id: ""
      }
  }








  signup = () => {

    //console.log(JSON.stringify(this.state))
    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if(response.status === 201){
        return response.json()
      }else if (response.status === 400){
        throw 'Failed validation';
      }else{
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
      console.log("User created with ID: ", responseJson);

    })
    .catch((error) => {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT)
    })

  }


  login = async () => {


    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }else if(response.status === 400){
        throw 'Invalid email or password';
      }else{
        throw 'Something went wrong';
      }
    })
    .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({id:responseJson.id})
        await AsyncStorage.setItem('@session_token', responseJson.token);
        this.props.navigation.navigate("Home");
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
    })
  }






  update = async () => {

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + this.state.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(this.state)
    })
    .then(async(response) => {
      if(response.status === 200){
        console.log("updated")
        await AsyncStorage.getItem('@session_token');
        this.props.navigation.navigate("Home");
      }else if(response.status === 400){
        throw 'Unauthorized';
      }else{
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show('failed',ToastAndroid.SHORT);
    })
  }







  logout = async () => {


    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(this.state)
    })
    .then(async(response) => {
      if(response.status === 200){
        console.log("logged out")
        await AsyncStorage.removeItem('@session_token');
        this.props.navigation.navigate("Home");
      }else if(response.status === 401){
        throw 'Logout failed';
      }else{
        throw 'Something went wrong';
      }
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show('failed',ToastAndroid.SHORT);
    })
  }




  getData = async() => {
    console.log(this.state.id);

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + this.state.id, {method: "GET", headers: {
      'Content-Type': 'application/json',
      'X-Authorization': await AsyncStorage.getItem('@session_token')
    }})
    .then(async(response) => {
      if(response.status === 200){
        console.log("got")
        // console.log(response)
        return response.json();

      }else if(response.status === 401){
        throw 'Unauthorized';
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            isLoading: false,
            first_name: responseJson.first_name
        })
    })

    .catch((error) => {
        console.log(error);
    });
  }












  render(){
  return (
    <ScrollView style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.title}>COFFIDA</Text>
    </View>

    <View style={styles.container}>

      <TextInput
        placeholder="Enter your first name..."
        onChangeText={(first_name) => this.setState({first_name})}
        value={this.state.first_name}
        style={styles.textinput}
      />

      <TextInput
        placeholder="Enter your last name..."
        onChangeText={(last_name) => this.setState({last_name})}
        value={this.state.last_name}
        style={styles.textinput}
      />

      <TextInput
        placeholder="Enter your email..."
        onChangeText={(email) => this.setState({email})}
        value={this.state.email}
        style={styles.textinput}
      />

      <TextInput
        placeholder="Enter your password..."
        onChangeText={(password) => this.setState({password})}
        value={this.state.password}
        secureTextEntry
        style={styles.textinput}
      />



      <Button
        title="Sign up"
        onPress={() => this.signup()}
        color="#339999"
      />

      <Button
        title="Log in"
        onPress={() => this.login()}
        color="#339999"
      />

      <Button
        title="Update details"
        onPress={() => this.update()}
        color="#339999"
      />

      <Button
        title="Log Out"
        onPress={() => this.logout()}
        color="#339999"
      />

      <Button
        title="get user info"
        color="#339999"
        onPress={() => this.getData()}
      />


      <TextInput value={this.state.first_name}>

      </TextInput>







    </View>
    </ScrollView>
  );
}
}

export default User;

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  container: {
    flex: 16,
    backgroundColor: '#ece0d1',
    paddingTop: 20,
    paddingHorizontal: 20
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flex: 2,
    backgroundColor: '#854442',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  item: {
    marginTop: 24,
    padding: 30,
    backgroundColor: 'white',
    fontSize: 24
  },
  title: {
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#854442',
    backgroundColor: '#FFAA2B',
    padding: 5,
    borderRadius: 10
  },

  textinput: {
    backgroundColor: 'white',
    margin: 4,
  },


});
