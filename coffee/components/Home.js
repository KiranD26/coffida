import React, { Component, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button, SafeAreaView, FlatList, StatusBar, Alert, TextInput, ScrollView, Footer, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends Component{

  constructor(props){
    super(props);

    this.state={
      isLoading: true,
      entries:[],
      modalVisible: false,
      location_name:""


    };

  }



  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }


  componentDidMount(){

    this.unsubscribe = this.props.navigation.addListener('focus', async() => {
      const value = await AsyncStorage.getItem('@session_token');
      console.log("hello", value);
      this.checkLoggedIn();
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('User');
    }
  };


  getData = async() => {
    console.log("getting data...");

    return fetch("http://10.0.2.2:3333/api/1.0.0/find", {method: "GET", headers: {
      'Content-Type': 'application/json',
      'X-Authorization': await AsyncStorage.getItem('@session_token')
    }})
    .then(async(response) => {
      if(response.status === 200){
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
            entries: responseJson
        })
    })

    .catch((error) => {
        console.log(error);
    });
  }





  getLocData = async() => {
    console.log("getting data...");

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.location_id, {method: "GET", headers: {
      'Content-Type': 'application/json',
      'X-Authorization': await AsyncStorage.getItem('@session_token')
    }})
    .then(async(response) => {
      if(response.status === 200){
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
            entries: responseJson,
            location_name: responseJson.location_name

        })
    })

    .catch((error) => {
        console.log(error);
    });
  }












  favourite = async (location_id) => {
    var token = await AsyncStorage.getItem('@session_token')
    console.log(token)
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite",
    {method: "POST", headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    }

  })
    .then((response) => {
      console.log(response.status)
      if(response.status === 200){
        return "ok"
      }else if(response.status === 401){
        throw 'Unauthorized';
      }else{
        throw 'Something went wrong';
      }
    })

    // .then((responseJson) => {
    //     console.log(responseJson);
    //     this.setState({
    //         entries: responseJson
    //     })
    //   })
    .catch((error) => {
        console.log("favourite");
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
    })
  }


  unfavourite = async (location_id) => {
    var token = await AsyncStorage.getItem('@session_token')
    console.log(token)
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite",
    {method: "DELETE", headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    }

  })
    .then((response) => {
      console.log(response.status)
      if(response.status === 200){
        return "ok"
      }else if(response.status === 401){
        throw 'Unauthorized';
      }else{
        throw 'Something went wrong';
      }
    })

    // .then((responseJson) => {
    //     console.log(responseJson);
    //     this.setState({
    //         entries: responseJson
    //     })
    //   })
    .catch((error) => {
        console.log("favourite");
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
    })
  }





render(){

  const { modalVisible } = this.state;
    if (this.state.isLoading) {
      return (
        <View>
        <Text>Loading</Text>
        </View>
      )
    }
    else{


    return (





      <View style={styles.page}>


      <Modal
          animationType="slide"

          visible={modalVisible}

          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >

        <Button
          title="go back"
          onPress={() => this.setModalVisible(false)}
        />

        <Button
          title="get name"
          onPress={() => this.getLocData(location_id)}

        />


        <TextInput value
          value={this.state.location_name}
        />


        </Modal>





      <View style={styles.header}>
        <Text style={styles.title}>COFFIDA</Text>






      </View>

      <View style={styles.container}>




        <FlatList

          keyExtractor={(item) => item.location_id.toString()}
          data={this.state.entries}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => this.setModalVisible(true)}>
              <Text style={styles.loc}>{item.location_name}</Text>

              </TouchableOpacity>

              <View style={styles.buttons}>
              <Button
                title="favourite"
                color="#339999"
                onPress={() => this.favourite(item.location_id)}
              />

              <Button
                title="unfavourite"
                color="#339999"
                onPress={() => this.unfavourite(item.location_id)}
              />
              </View>
            </View>

          )}
        />



      </View>
      </View>
    );
  }
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

  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,

  },

  loc: {
    fontSize: 24,
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    fontWeight: 'bold',
  }


});
