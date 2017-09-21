import React from 'react';
import { Text,ScrollView, View, StyleSheet,Image, Linking, Button,ActivityIndicator } from 'react-native';
import { gql, ApolloClient, createNetworkInterface, ApolloProvider, graphql,IntrospectionFragmentMatcher } from 'react-apollo';
import moment from 'moment'
import Accordion from 'react-native-collapsible/Accordion'
const Dimensions = require('Dimensions');

const {height,width} = Dimensions.get('window');


export default class App extends React.Component {

  createClient() {
const myFragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: "INTERFACE",
          name: "Character",
          possibleTypes: [
            { name: "Issue" },
          ],
        }, 
      ],
    },
  }
})

    const networkInterface = createNetworkInterface({ uri: 'https://api.github.com/graphql' });

    networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  
    }
    req.options.headers['authorization'] = 'Basic '+'dGFyZWVmODg6dGFyZWVmMjAwOQ==';
    next();
  }
}]);

    return new ApolloClient({
         networkInterface,
         fragmentMatcher:myFragmentMatcher  
    });
  }


  render() {
    return (
      <ApolloProvider client={this.createClient()}>
        <View >
            <View style={{height:65,width:width,backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'white',fontSize:18}}>Github Stream Client</Text>
            </View>
          <FeedWithData />
        </View>
      </ApolloProvider>
    );
  }
}


const FeedWithData = graphql(gql`
   {search(query: "java-script", type: ISSUE, first: 30) {
    nodes {
      ... on Issue {
        createdAt
        title
        url
        bodyText
        
        repository {
          url
          descriptionHTML
        }
        author {
          avatarUrl
          url
          login
        }
      }
    }
  }
  }
`)(Feed);

function Feed({ data }) {

 
  if (data.loading) {
    return      <View style={{height:'100%',width:'100%',backgroundColor:'black' ,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator animating={true} color='white' size='large'/>
               </View>
  }
  
  if (data.error) {
    return <Text>Error! {data.error.message}</Text>;
  }
  const currentdata=data.search.nodes
  const thedata=[]
   const newdata=data.search.nodes.map((item,index)=>{
 if(item.__typename ==='Issue') {        

       thedata.push(item)
   }
})



return(
          <Image  source={{uri:'https://i.imgur.com/qlPWf6B.jpg'}} style={{height:height-88,width:width}}>
                 <ScrollView style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                       <Accordion
                        sections={thedata}
                       renderContent={_renderContent}
                       renderHeader={_renderHeader}
                          />  
                 </ScrollView>
          </Image>

)

}

function _renderHeader(item){

        return(
        <View style={{height:130 ,backgroundColor:'rgba(255,255,255,.2)',borderRightColor:2,borderTopWidth:2,borderRightWidth:2,borderBottomWidth:0,borderLeftColor:'white',borderTopRightRadius:15,borderTopLeftRadius:15,marginTop:8,marginLeft:8,marginRight:8}}>
            <View style={{height:60,flexDirection:'row',backgroundColor:'#c40525',borderTopLeftRadius:15,borderTopRightRadius:15}}>
                     <View style={{height:'100%',width:'20%',justifyContent:'center',alignItems:'center'}}>
                         <Image source={{uri:item.author.avatarUrl}} style={{height:50,width:50,borderRadius:30,borderColor:'white',borderWidth:2}}/>
                     </View>
                         <View style={{height:'70%',width:1,backgroundColor:'white',margin:8}}/>
                             <View style={{height:'100%',width:'80%',justifyContent:'center',alignItems:'flex-start'}}>
                                  <Text style={{fontSize:20,color:'white'}} onPress={()=>{Linking.openURL(item.author.url)}} >{item.author.login}</Text>
                            </View>

                          </View>
                             <View style={{height:70,width:'100%',justifyContent:'center',padding:10}}>
                                 <Text style={{color:'white'}} >Title : {item.title}</Text>
                                <Text style={{color:'white'}}>{moment(item.createdAt).format('YYYY-DD-MM hh:mm a')}</Text>
    
            </View>

      </View>

    
    )

  

}



function _renderContent(section){

     return(  <View style={{padding:10,backgroundColor:'rgba(255,255,255,.2)',borderBottomLeftRadius:15,borderBottomRightRadius:15,marginLeft:8,marginRight:8,marginRight:8,marginBottom:8}}>
                         <Text style={{color:'white'}}>Issue :</Text> 
              <Text style={{color:'white'}}>{section.bodyText}</Text>      

      </View>)

}