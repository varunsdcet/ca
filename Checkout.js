import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    TextInput,
    NativeModules,
   NativeEventEmitter, DeviceEventEmitter,

    ImageBackground, Image, Dimensions,
} from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
var randomString = require('random-string');
const paytmConfig = {
    MID: 'TENONF96554424959710',
    WEBSITE: 'DEFAULT',
    CHANNEL_ID: 'WAP',
    INDUSTRY_TYPE_ID: 'Retail',
    CALLBACK_URL: 'https://securegw.paytm.in/theia/paytmCallback?ORDER_ID='
};
import paytm from '@philly25/react-native-paytm';
import AsyncStorage from '@react-native-community/async-storage';

import NetInfo from "@react-native-community/netinfo";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Button from 'react-native-button';
const window = Dimensions.get('window');

const GLOBAL = require('./Global');
import {NavigationActions,StackActions, DrawerActions} from 'react-navigation';
const styles = StyleSheet.create({
    wrapper: {
    },
    AndroidSafeArea: {
        flex: 0,
        backgroundColor: GLOBAL.COLOR.PURPLE,
        paddingTop: Platform.OS === "android" ? 0 : 0
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    loading: {
       position: 'absolute',
       left: window.width/2 - 30,

       top: window.height/2,

       opacity: 0.5,

       justifyContent: 'center',
       alignItems: 'center'
   },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})

export default class Checkout extends Component {
    state = {
        selectedIndex: 0,
        userDetails:[],
        service:'',
        gst:'',
        loading:false,
        connected:true,
        amount:'',
        cash :false,
        paytm:false,
        paymentSummary:'',
        visible:false,
        discount:'',
        coupan_id:'',
        zip:'',
        myTax:'',
        gstPayment:'',
        userDetail:[],
        landmark:'',
        address:'',
        FlatListItems:[],
        speciality : [
         {
           name :'Manage Address',
           image:require('./address.png'),
         },
         {
           name :'About Us',
           image:require('./about.png'),
         },
         {
           name :'Share Tenon Prime',
           image:require('./share.png'),
         },
         {
           name :'Rate us on Play Store',
           image:require('./rate.png'),
         },
         {
           name :'Support',
           image:require('./support.png'),
         },
         {
           name :'Terms & Conditions',
           image:require('./tc.png'),
         },
         {
           name :'Privacy Policy',
           image:require('./tc.png'),
         },

         {
           name :'Sign Out',
           image:require('./logout.png'),
         },







        ]

    };


    myPayments = (res) => {
      this.showLoading()


      const url = GLOBAL.BASE_URL +  'booking'

                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
      'x-api-key':GLOBAL.header,
                            },
                           body: JSON.stringify({
                               BANKNAME:res["BANKNAME"],
                               BANKTXNID:res["BANKTXNID"],
                                 CHECKSUMHASH:res["CHECKSUMHASH"],
                                   CURRENCY:res["CURRENCY"],
                                     GATEWAYNAME:res["GATEWAYNAME"],
                                       MID:res["MID"],
                                         ORDERID:res["ORDERID"],
                                           PAYMENTMODE:res["PAYMENTMODE"],
                                             RESPCODE:res["RESPCODE"],
                                               RESPMSG:res["RESPMSG"],
                                                 STATUS:res["STATUS"],
                                                   TXNAMOUNT:res["TXNAMOUNT"],
                                                     TXNDATE:res["TXNDATE"],
                                                       TXNID:res["TXNID"],
                                                       user_id:GLOBAL.user_id,
                                                       address_id:GLOBAL.addid,
                                                       appointment_date:GLOBAL.date,
                                                       appointment_time:GLOBAL.time,
                                                       total_amount:this.state.amount,
                                                       payment_mode:'online',
                                                       discount:this.state.discount,
                                                       coupan_id:this.state.coupan_id,
                                                       coupan_discount:'',
                                                       wallet_discount:'',







                           }),
                       }).then((response) => response.json())
                           .then((responseJson) => {



this.hideLoading()





                            if (responseJson.status == true) {

    this.props.navigation.navigate('Confirm')
                                // this.setState({wallet:responseJson.wallet})

                               }else {
                                   alert('Unable to get Connect You. Please try again after Sometime.')
                               }
                           })
                           .catch((error) => {
       this.hideLoading()
                               console.error(error);
                           });
   }

selection = (item,index) => {
var a = this.state.userDetail[index]
if (a.is_selected == ""){
  a.is_selected  = "Y"
}else{
    a.is_selected  = ""
}
this.state.userDetail[index] = a
this.setState({userDetail:this.state.userDetail})


}
onPayTmResponse = (resp) => {
       const {STATUS, status, response} = resp;


       if (Platform.OS === 'android') {
           this.setState({out:resp})

           const jsonResponse =resp;
           const {STATUS} = jsonResponse;
           console.log(JSON.stringify(jsonResponse))
           if (jsonResponse.STATUS == 'TXN_SUCCESS') {
               console.log(jsonResponse)
             this.myPayments(jsonResponse)
            //   this.myPayments(jsonResponse.TXNAMOUNT,'SUCCESS',jsonResponse.TXNID)
           } else if (jsonResponse.STATUS  == 'PENDING'){
              // alert(JSON.stringify(jsonResponse))
              // this.myPayments(jsonResponse.TXNAMOUNT,'PENDING',jsonResponse.TXNID)
           }
           else if (jsonResponse.STATUS  == 'TXN_FAILURE'){
               alert('Transaction is Failure')

              // this.myPayments(jsonResponse.TXNAMOUNT,'FAILURE',jsonResponse.TXNID)
           }



       } else {
           if (STATUS && STATUS === 'TXN_SUCCESS') {
               // Payment succeed!
           }
       }
   };
hideLoading() {
      this.setState({loading: false})
  }



  showLoading() {

      this.setState({loading: true})
  }
navigateToScreen1 = (route) =>  {


      Alert.alert('Logout!','Are you sure you want to Logout?',
          [{text:"Cancel"},
              {text:"Yes", onPress:()=>this._YesLogout()
              },
          ],
          {cancelable:false}
      )

  }
_YesLogout=()=>{

//        const url = GLOBAL.BASE_URL +  'logout'
// //      this.showLoading()
//       fetch(url, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     user_id : GLOBAL.userid,
//   }),
// }).then((response) => response.json())
//     .then((responseJson) => {

// //    alert(JSON.stringify(responseJson))
//   //     this.hideLoading()
//        if (responseJson.status == true) {
      AsyncStorage.removeItem('userID');

      this.props
          .navigation
          .dispatch(StackActions.reset({
              index: 0,
              actions: [
                  NavigationActions.navigate({
                      routeName: 'Login',
                      params: { someParams: 'parameters goes here...' },
                  }),
              ],
          }))




      //    }else {
      //        alert('Something Went Wrong.')
      //    }
      // })
      // .catch((error) => {
      //   console.error(error);
      // });
  }
    renderRowItem2 = (itemData) => {

        return (

            <View style={{backgroundColor:'white',color :'white', flex: 1 ,margin: 2,borderRadius :9,width : window.width - 30,flexDirection:'row',
              justifyContent:'space-between'}}>

                <View style = {{flexDirection:'row',width:'90%'}}>
                <Image   source={itemData.item.image}
                         style  = {{width:30, height:30,resizeMode:'stretch',margin:10
                         }}

                />
                <Text style={{fontFamily:GLOBAL.medium,fontSize:16,marginLeft:6,marginTop:14,color:GLOBAL.COLOR.GREY}}>
                    {itemData.item.name}

                </Text>
                </View>

                  <Image   source={require('./arrows.png')}
                           style  = {{width:15, height:15,resizeMode:'contain',marginRight:8,marginTop:16
                           }}

                  />















            </View>


        )
    }

 _handleStateChange = (state) =>{
   this.showLoading()

   const url = GLOBAL.BASE_URL +  'get_payment_summary'

                     fetch(url, {
                         method: 'POST',
                         headers: {
     'x-api-key':GLOBAL.header,
        'Content-Type': 'application/json',
                         },
                         body: JSON.stringify({
                             user_id:GLOBAL.user_id,


                         }),
                     }).then((response) => response.json())
                         .then((responseJson) => {


this.hideLoading()


                             if (responseJson.status == true) {
                               this.setState({service:responseJson.service_total})
    this.setState({gst:responseJson.gst})
      this.setState({amount:responseJson.total_amount})
      this.setState({discount:responseJson.coupan_discount})
          this.setState({coupan_id:responseJson.coupan_id})
//coupan_id
                             }else {
                                // alert('Unable to get Connect You. Please try again after Sometime.')
                             }
                         })
                         .catch((error) => {
     this.hideLoading()
                             console.error(error);
                         });
 }
 getInfo = () =>{
   const url = GLOBAL.BASE_URL +  'get_tax_details'

                     fetch(url, {
                         method: 'POST',
                         headers: {
                             'Content-Type': 'application/json',
   'x-api-key':GLOBAL.header,
                         },
                         body: JSON.stringify({
                             user_id:GLOBAL.user_id,
   name:"gst",




                         }),
                     }).then((response) => response.json())
                         .then((responseJson) => {
  //  alert(JSON.stringify(responseJson))





                             if (responseJson.status == true) {
     this.setState({visible:true})
     this.setState({myTax:responseJson.data.tax})
  //   var s  =   responseJson.data.tax  + responseJson.data.tax_type
  var s  =   responseJson.data.description

var paymentSummary = `${this.state.service}* ${responseJson.data.tax}% = ${this.state.gst}`;
this.setState({paymentSummary:paymentSummary})
                             //  alert('Address Add Successfully')

                             }else {
                                 alert('Unable to get Connect You. Please try again after Sometime.')
                             }
                         })
                         .catch((error) => {
                             console.error(error);
                         });
 }

    componentDidMount(){
      const unsubscribe = NetInfo.addEventListener(state => {
        this.setState({connected:state.isConnected})

      });
      this.getDetail()
      if (Platform.OS === 'ios') {
         const { RNPayTm } = NativeModules;

         this.emitter = new NativeEventEmitter(RNPayTm);
         this.emitter.addListener('PayTMResponse', this.onPayTmResponse);
     } else {

         DeviceEventEmitter.addListener('PayTMResponse', this.onPayTmResponse);
     }

this.props.navigation.addListener('willFocus', this._handleStateChange);
    }


    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };

buttonClickListener = () =>{
  if (this.state.address == ''){
    alert('Please Enter Address')
  } else if (this.state.landmark == ''){
      alert('Please Enter Landmark')
    }else if (this.state.zip == ''){
        alert('Please Enter ZipCode')
      }else{
        const url = GLOBAL.BASE_URL +  'add_address'

                          fetch(url, {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json',
        'x-api-key':GLOBAL.header,
                              },
                              body: JSON.stringify({
                                  user_id:GLOBAL.user_id,
        location:this.state.address,
        landmark:this.state.landmark,
        pincode:this.state.zip,
        latitude:'',
        longitude:'',



                              }),
                          }).then((response) => response.json())
                              .then((responseJson) => {





                                  if (responseJson.status == true) {
                                    alert('Address Add Successfully')

                                  }else {
                                    //  alert('Unable to get Connect You. Please try again after Sometime.')
                                  }
                              })
                              .catch((error) => {
                                  console.error(error);
                              });
      }
}

getDetail = () =>{
  const url = GLOBAL.BASE_URL +  'get_profile'

                    fetch(url, {
                        method: 'POST',
                        headers: {
    'x-api-key':GLOBAL.header,
       'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id:GLOBAL.user_id,


                        }),
                    }).then((response) => response.json())
                        .then((responseJson) => {






                            if (responseJson.status == true) {
                              this.setState({userDetails:responseJson.user})

                            }else {
                           //     alert('Unable to get Connect You. Please try again after Sometime.')
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
}

runTransaction(amount, customerId, orderId, mobile, email, checkSum) {
       const callbackUrl = `${paytmConfig.CALLBACK_URL}${orderId}`;
       const details = {
           mode: 'Production', // 'Staging' or 'Production'
           MID: paytmConfig.MID,
           INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
           EMAIL: this.state.userDetails.email_id,
           MOBILE_NO:  this.state.userDetails.phone_no,
           WEBSITE: paytmConfig.WEBSITE,
           CHANNEL_ID: paytmConfig.CHANNEL_ID,
           TXN_AMOUNT: this.state.amount.toString(), // String
           ORDER_ID: orderId, // String
           CUST_ID: GLOBAL.user_id, // String
           CHECKSUMHASH: checkSum, //From your server using PayTM Checksum Utility
           CALLBACK_URL: callbackUrl,
       };
       console.log(JSON.stringify(details))

       paytm.startPayment(details);
   }

checkout = () =>{
  if (this.state.cash == false && this.state.paytm == false){
    alert('Please Select any Mode of Booking')
  } else if (this.state.cash == true){
  this.showLoading()
  const url = GLOBAL.BASE_URL +  'booking'

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
  'x-api-key':GLOBAL.header,
                        },
                        body: JSON.stringify({
                            user_id:GLOBAL.user_id,
  address_id:GLOBAL.addid,
  appointment_date:GLOBAL.date,
  appointment_time:GLOBAL.time,
  total_amount:this.state.amount,
  payment_mode:'cash',
  discount:this.state.discount,
  coupan_id:this.state.coupan_id,
  coupan_discount:'',
  wallet_discount:'',
  BANKNAME:'',
                            BANKTXNID:'',
                              CHECKSUMHASH:'',
                                CURRENCY:'',
                                  GATEWAYNAME:'',
                                    MID:'',
                                      ORDERID:'',
                                        PAYMENTMODE:'cash',
                                          RESPCODE:'',
                                            RESPMSG:'',
                                              STATUS:'',
                                                TXNAMOUNT:'',
                                                  TXNDATE:'',
                                                    TXNID:'',



                        }),
                    }).then((response) => response.json())
                        .then((responseJson) => {



this.hideLoading()

                            if (responseJson.status == true) {
    this.props.navigation.navigate('Confirm')
                              //alert('Appointment Booked Successfully')

                            }else {
                                alert('Unable to get Connect You. Please try again after Sometime.')
                            }
                        })
                        .catch((error) => {
    this.hideLoading()
                            console.error(error);
                        });
}else {
  var x = randomString({
        length: 10,
        numeric: true,
        letters: false,
        special: false,

    });
    var commonHtml = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${x}`;


    const url = 'https://tenonprime.com/paytm/generateChecksum.php'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            MID: "TENONF96554424959710",
            ORDER_ID: x,
            INDUSTRY_TYPE_ID: "Retail",
            EMAIL: this.state.userDetails.email_id,
            MOBILE_NO:  this.state.userDetails.phone_no,
            CHANNEL_ID: "WAP",
            TXN_AMOUNT: this.state.amount.toString(),
            WEBSITE: "DEFAULT",
            CUST_ID: GLOBAL.user_id,
            CALLBACK_URL: commonHtml,


        }),
    }).then((response) => response.json())
        .then((responseJson) => {
            const callbackUrl = commonHtml;
      //      alert(JSON.stringify(responseJson))

           this.runTransaction('199', '1', x, '9896904632', "varun.singhal78@gmail.com", responseJson.CHECKSUMHASH)


        })
        .catch((error) => {
   alert(error);

            alert('Unable to process your request Please try again after some time')

        });
}
}

delete = (item,index) =>{
  const url = GLOBAL.BASE_URL +  'remove_address'

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
  'x-api-key':GLOBAL.header,
                        },
                        body: JSON.stringify({
                            user_id:GLOBAL.user_id,
  address_id:item.id,




                        }),
                    }).then((response) => response.json())
                        .then((responseJson) => {
    alert(JSON.stringify(responseJson))





                            if (responseJson.status == true) {
    var array = [...this.state.userDetail]; // make a separate copy of the array

  if (index !== -1) {
    array.splice(index, 1);
    this.setState({userDetail: array});
  }

                              alert('Address Delete Successfully')

                            }else {
                                alert('Unable to get Connect You. Please try again after Sometime.')
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
}

cashcheck = ()=>{
  this.setState({cash:!this.state.cash})
      this.setState({paytm:false})
}
paycashcheck = ()=>{
  this.setState({paytm:!this.state.paytm})
      this.setState({cash:false})
}

renderItem=({item,index}) => {

return(
<TouchableOpacity onPress= {()=>this.selection(item,index)}>
  <View style={{backgroundColor:'white',color :'white', flex: 1 ,margin: 10,borderRadius :9,width : window.width - 30, shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 5 }}>




<View style = {{flexDirection:'row'}}>

{item.is_selected == "" && (
  <Image
      source={require('./check.png')}
      style={{width: 26, height: 26,marginLeft:20,marginTop:22,resizeMode:'contain'}}


  />
)}
{item.is_selected != "" && (
  <Image
      source={require('./checks.png')}
      style={{width: 26, height: 26,marginLeft:20,marginTop:22,resizeMode:'contain'}}


  />
)}


 <View>
         <Text style={{fontSize:20,fontFamily:GLOBAL.medium,color:GLOBAL.COLOR.BLACK,width:'70%',marginLeft:'5%',marginTop:5}}>{item.location}</Text>

         <Text style={{fontSize:14,fontFamily:GLOBAL.medium,color:GLOBAL.COLOR.GREY,width:'70%',marginLeft:'5%',marginTop:2}} multiline={true}>{item.landmark}</Text>

         <Text style={{fontSize:14,fontFamily:GLOBAL.medium,color:GLOBAL.COLOR.GREY,marginLeft:'5%',marginTop:2}}>{item.pincode}</Text>


         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,marginLeft:'5%',width:'50%'}}>

           <TouchableOpacity onPress={()=>this.props.navigation.navigate('EditAddress',item)}>
             <Text style={{fontSize:22,fontFamily:GLOBAL.medium,color:GLOBAL.COLOR.PURPLE}}>Edit</Text>
           </TouchableOpacity>

                 <TouchableOpacity onPress={()=>this.delete(item,index)}>
             <Text style={{fontSize:22,fontFamily:GLOBAL.medium,color:GLOBAL.COLOR.PURPLE}}>Delete</Text>
           </TouchableOpacity>
         </View>


       </View>
       </View>
       </View>
</TouchableOpacity>

 );
}

    render(){
      if(this.state.connected == false){
          return(
              <View style={{flex:1}}>

              <Image source={require('./cat.png')}
                     style  = {{width:'40%', height:80,alignSelf:'center',marginLeft:15,marginRight:15,marginTop:10,resizeMode:'contain',marginTop:'30%'}}
              />
              <Text style = {{marginTop:20,textAlign:'center',color:'black',fontFamily:GLOBAL.medium}}>
    No Internet Connection
              </Text>
              </View>
          )
      }

      if(this.state.loading){
           return(
               <View style={{flex:1,backgroundColor:'white'}}>
                   <ActivityIndicator style = {styles.loading}

                                      size="large" color='#7B2672' />
               </View>
           )
       }

        return (
          <SafeAreaView style={styles.AndroidSafeArea}>
              <StatusBar backgroundColor="#7B2672" barStyle="light-content" />

              <View style = {{height:70,backgroundColor:GLOBAL.COLOR.PURPLE,flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                  <View style = {{flexDirection:'row'}}>
                  <TouchableOpacity onPress= {()=>this.props.navigation.goBack()}>
                      <Image
                          source={require('./white-back.png')}
                          style={{width: 22, height: 22,marginLeft:20,marginTop:22,resizeMode:'contain'}}


                      />
                  </TouchableOpacity>

                  <Image
                      source={require('./logot.png')}
                      style={{width: 22, height: 22,marginLeft:10,marginTop:22,resizeMode:'contain'}}


                  />

                  <Text style = {{alignSelf:'center',textAlign:'center',color:'white',fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:10}}>
                  Payment
                  </Text>
                    </View>


                    <Text style = {{alignSelf:'center',textAlign:'center',color:'white',fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:10}}>

                    </Text>

              </View>

                <KeyboardAwareScrollView style={{ backgroundColor: '#f7f7f7',marginTop:0,height:window.height - 70 }} >
                <Text style = {{color:GLOBAL.COLOR.BLACK,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:30}}>
                Payment Summary
                </Text>


                <View style = {{marginTop:20,width:window.width,borderColor:'#eeeeee',backgroundColor:'white',height:180,borderWidth:1}}>

            <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:10}}>
          Service Total
            </Text>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:10}}>
₹ {this.state.service}
            </Text>
            </View>

            <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:10}}>
          Discount
            </Text>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:10}}>
₹ {this.state.discount}
            </Text>
            </View>

            <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
       <View style = {{flexDirection:'row'}}>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:10}}>
          GST/Taxes
            </Text>
            <TouchableOpacity onPress= {()=>this.getInfo()}>
            <Image
                source={require('./info.png')}
                style={{width: 20, height: 20,marginLeft:0,marginTop:14,resizeMode:'contain'}}


            />
            </TouchableOpacity>
            </View>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:10}}>
₹ {this.state.gst}
            </Text>
            </View>

              <View style = {{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#eeeeee',height:1,marginTop:20}}>

              </View>
              <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style = {{color:GLOBAL.COLOR.PURPLE,fontFamily:GLOBAL.medium,fontSize: 18,paddingRight:30,marginLeft:20,marginTop:10}}>
          Total
              </Text>
              <Text style = {{color:GLOBAL.COLOR.PURPLE,fontFamily:GLOBAL.medium,fontSize: 18,paddingRight:30,marginLeft:20,marginTop:10}}>
₹ {this.state.amount}
              </Text>
              </View>

                </View>

                <Text style = {{color:GLOBAL.COLOR.BLACK,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:30}}>
                Payment Mode
                </Text>
                <View style = {{marginTop:20,width:window.width,borderColor:'#eeeeee',backgroundColor:'white',height:50,borderWidth:1}}>

            <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:13}}>
          Pay on service delivery
            </Text>
            {this.state.cash == false && (
              <TouchableOpacity onPress= {()=>this.cashcheck()}>
              <Image
                  source={require('./check.png')}
                  style={{width: 20, height: 20,marginLeft:0,marginTop:14,resizeMode:'contain',marginRight:20}}


              />
              </TouchableOpacity>
            )}

            {this.state.cash == true && (
                            <TouchableOpacity onPress= {()=>this.cashcheck()}>
              <Image
                  source={require('./checks.png')}
                  style={{width: 20, height: 20,marginLeft:0,marginTop:14,resizeMode:'contain',marginRight:20}}


              />
                </TouchableOpacity>
            )}

            </View>

            </View>



            <View style = {{marginTop:20,width:window.width,borderColor:'#eeeeee',backgroundColor:'white',height:50,borderWidth:1}}>

          <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style = {{color:GLOBAL.COLOR.GREY,fontFamily:GLOBAL.medium,fontSize: 16,paddingRight:30,marginLeft:20,marginTop:13}}>
          Pay With Paytm
          </Text>
          {this.state.paytm == false && (
            <TouchableOpacity onPress= {()=>this.paycashcheck()}>
            <Image
                source={require('./check.png')}
                style={{width: 20, height: 20,marginLeft:0,marginTop:14,resizeMode:'contain',marginRight:20}}


            />
            </TouchableOpacity>
          )}

          {this.state.paytm == true && (
                          <TouchableOpacity onPress= {()=>this.paycashcheck()}>
            <Image
                source={require('./checks.png')}
                style={{width: 20, height: 20,marginLeft:0,marginTop:14,resizeMode:'contain',marginRight:20}}


            />
              </TouchableOpacity>
          )}

          </View>

          </View>



           <Button
               style={{marginLeft:28,paddingTop: 10 ,fontSize: 15,backgroundColor:'#7B2672', color: 'white',fontFamily:'KastelovAxiformaMedium',marginTop:30,height:45,width:window.width - 56,borderRadius:30}}
               styleDisabled={{color: 'red'}}
               onPress={() => this.checkout()}>
               Submit
           </Button>

           <Dialog
    visible={this.state.visible}
    onTouchOutside={() => {
      this.setState({ visible: false });
    }}
  >
    <DialogContent style = {{width:window.width - 40}}>
      <View style = {{backgroundColor:'white',height:110,width:window.width - 40}}>

      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style = {{color:'grey',fontSize:16,fontFamily:GLOBAL.medium,margin:10}}>
      Amount

      </Text>

      <Text style = {{color:'grey',fontSize:16,fontFamily:GLOBAL.medium,margin:10,marginRight:40}}>
    ₹  {this.state.service}

      </Text>



      </View>


      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style = {{color:'grey',fontSize:16,fontFamily:GLOBAL.medium,margin:10}}>
      Gst {this.state.myTax} %

      </Text>

      <Text style = {{color:'grey',fontSize:16,fontFamily:GLOBAL.medium,margin:10,marginRight:40}}>
  +  ₹  {this.state.gst}

      </Text>



      </View>


      <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
      <Text style = {{color:'grey',fontSize:16,fontFamily:GLOBAL.medium,margin:10}}>
  Total  Amount

      </Text>

      <Text style = {{color:'grey',fontSize:16,fontFamily:GLOBAL.medium,margin:10,marginRight:40}}>
    ₹  {this.state.amount}

      </Text>



      </View>

      </View>
    </DialogContent>
  </Dialog>
<Text style ={{height:100}}>
</Text>
                </KeyboardAwareScrollView>
            </SafeAreaView>

        );
    }
}
