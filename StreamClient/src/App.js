import React from 'react';
import { Text,ScrollView, View, StyleSheet,Image, Linking, Button,ActivityIndicator } from 'react-native';
import { gql, ApolloClient, createNetworkInterface, ApolloProvider, graphql,IntrospectionFragmentMatcher } from 'react-apollo';
import moment from 'moment'

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
          <FeedWithData />
        </View>
      </ApolloProvider>
    );
  }
}


const FeedWithData = graphql(gql`
  
  {
  search(query: "java-script", type: ISSUE, first: 100) {
    nodes {
      ... on Issue {
        createdAt
        title
        url
        repository {
          url
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

     
  console.log(data.search)
  const mydata=data.search.nodes.map((item,index)=>{
    var createdat=moment(item.createdAt).format('YYYY-DD-MM hh:mm a');

    if(item.__typename ==='Issue')

   { return(
        <View key={index} style={{height:130 ,backgroundColor:'rgba(255,255,255,.2)',borderWidth:2,borderColor:'white',borderRadius:15,margin:8}}>
            <View style={{height:60,flexDirection:'row',backgroundColor:'#c40525',borderTopLeftRadius:15,borderTopRightRadius:15}}>
                     <View style={{height:'100%',width:'20%',justifyContent:'center',alignItems:'center'}}>
                         <Image source={{uri:item.author.avatarUrl}} style={{height:50,width:50,borderRadius:30,borderColor:'white',borderWidth:2}}/>
                     </View>
                         <View style={{height:'70%',width:1,backgroundColor:'white',margin:8}}/>
                             <View style={{height:'100%',width:'80%',justifyContent:'center',alignItems:'flex-start'}}>
                                  <Text style={{fontSize:20,color:'white'}} >{item.author.login}</Text>
                            </View>

                          </View>
                             <View style={{height:70,width:'100%',justifyContent:'center',padding:10}}>
                                 <Text style={{color:'white'}} >Title : {item.title}</Text>
                                <Text style={{color:'white'}}>{createdat}</Text>
    
            </View>

      </View>

    )}
  })

return(
          <Image  source={{uri:'https://i.imgur.com/qlPWf6B.jpg'}} style={{height:height,width:width}}>
                 <ScrollView style={{height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.5)'}}>
                       {mydata}
                 </ScrollView>
          </Image>

)

}



