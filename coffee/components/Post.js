import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, FlatList, StatusBar, Alert, TextInput, ScrollView, Footer } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Post extends Component{


  constructor(props){
    super(props);

      this.state = {
        first_name:"",
        last_name:"",
        email: "",
        password: "",
        id: "",


      }
  }


  componentDidMount(){
    this.getData();
    this.unsubscribe = this.props.navigation.addListener('focus', async() => {
      const value = await AsyncStorage.getItem('@session_token');
      console.log("hello", value);

    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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

        })
    })

    .catch((error) => {
        console.log(error);
    });
  }


  delete = async() => {
    return fetch("http://10.0.2.2:3333/api/1.0.0/", {method: "DELETE", headers: {
      'Content-Type': 'application/json',
      'X-Authorization': await AsyncStorage.getItem('@session_token')
    }})

  }




render(){
    return (
      <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>COFFIDA</Text>






      </View>


      <View style={styles.container}>









      <FlatList
        ListHeaderComponent={
        <>




        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Write your review here" style={styles.textinput}
        />


        <Button
          title="get user info"
          color="#339999"
          onPress={() => this.getData()}
        />



      </>}





      keyExtractor={(item) => item.location_id.toString()}
      data={this.state.myEntries}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.location_name}</Text>
          <Button
            title="delete"
            onPress={() => this.delete()}
          />

        </View>

      )}
        />



      </View>
      </View>
    );
  }
}

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
    fontSize: 24,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  scroll: {
    backgroundColor: '#ece0d1',
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,


  },

  textinput: {
    textAlignVertical: "top",
    backgroundColor: 'white',
    margin: 4,
  },

});
