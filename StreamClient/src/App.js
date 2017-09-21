import React from 'react';
import { Text,ScrollView, View, StyleSheet, Linking, Button } from 'react-native';
import { gql, ApolloClient, createNetworkInterface, ApolloProvider, graphql,IntrospectionFragmentMatcher } from 'react-apollo';


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
  search(query: "java-script", type: ISSUE, first: 30) {
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
        }
      }
    }
  }
}
`)(Feed);

function Feed({ data }) {
    if (data.loading) {
        return <Text >Loading...</Text>;
    }
    
    if (data.error) {
        return <Text>Error! {data.error.message}</Text>;
    }

     console.log('data',data.search.nodes)
    const mydata=data.search.nodes.map((item,index)=>{

    if(item.__typename ==='Issue')

    return(
      <View key={index}>
         <Text> title : {item.title}</Text>
        <Text>author url : {item.author.url}</Text>
        <Text> author avatarUrl: {item.author.avatarUrl}</Text>
        <Text> createdAt : {item.createdAt}</Text>
        <Text>repository url: {item.repository.url}</Text>
        <Text> item.url : {item.url}</Text>
        <View style={{height:3,backgroundColor:'black'}}></View>

      </View>

    )
  })

return(
          <ScrollView style={{height:'100%',width:'100%'}}>
              {mydata}

          </ScrollView>

)

}




