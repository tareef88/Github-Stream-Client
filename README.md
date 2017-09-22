# Github-Stream-Client
## Overview

The idea of this App is to fetch data from github Api and display it in a list in the react-native application and let the user scroll the latest issues happens with (java-Script) in the github database
by querying:

```

{
  search(query: "java-script", type: ISSUE, first: 30) {
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

```



and get a response in this form :

```

{
          "createdAt": "2017-08-17T08:08:31Z",
          "title": "kurs Java Script",
          "url": "https://github.com/media3-0/apki.org/issues/144",
          "bodyText": "Wiesza się na ćwiczeniu w lekcji 10 (błędy).",
          "repository": {
            "url": "https://github.com/media3-0/apki.org",
            "descriptionHTML": "<div>Platforma edukacyjna z dziedziny programowania</div>"
          },
          "author": {
            "avatarUrl": "https://avatars3.githubusercontent.com/u/31032762?v=4",
            "url": "https://github.com/bibipl",
            "login": "bibipl"
  }

```


then populating each element in a good looking Card.

## Released Versions

### 1-version1 (v1.0)


in order to be able to connect with graphql server we need to use a third library which will allow us to query our input in order to get back the response from the server and in this situation we are using react-apollo .

First ,to initiate connecten we need to  create a client that contains our information and id 
```
  new ApolloClient({
  networkInterface,
    });
  }
```

and in order to be able to set the client info we need to use a constant networkInerface the include the Api and our log in information to the github
```
const networkInterface = createNetworkInterface({ uri: 'https://api.github.com/graphql' });
```
some Api requries a header component call 'authorization' that contains either a Token or encrypted username and password
so for the network interface we need to applyMiddleware in order to give our communication with the server an authorization 
```
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  
    }
    req.options.headers['authorization'] = 'Basic '+'dGFyZWVmODg6dGFyZWVmMjAwOQ==';
    next();
  }
}]);
```

no the communication with the server is done and we can send out quires 

buy wrapping the root elments of the project with the <ApolloProvider> component and inject the client function we have created above :
  
  ```
   <ApolloProvider client={this.createClient()}>
        <View >  
           <FeedWithData />
        </View>
   </ApolloProvider>
```

<FeedwithData/> is the root element const that we create and it will exported along with the graphq(query)(Feed);
Feed is the function that will be retured and the UI 

```
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

```

Feed will contain the data in the response of the query :
```
function feed({data}){

}
```
and the data will be retrived by maping through the data to get the array of object that we will display it in the UI
```
const mydata=data.search.nodes
```
### Note:
since we are using fragment in the query we need to inject a Fragment match into the Client with the name "Issue"  that we have created before, and to create that fragment  :

```
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
```
and then added it to the Client

```
   return new ApolloClient({
         networkInterface,
         fragmentMatcher:myFragmentMatcher  
    });
  }
```
now we have feteched the data from the server and will display it in the A list the will be returned in the Feed Function 
where we can map throw the nodes array and return each object in a view with text as its below :

```
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
```
and the array of views will be insert into the main view as ScrollView of objects :
```
return(
          <ScrollView style={{height:'100%',width:'100%'}}>
              {mydata}
          </ScrollView>

)
```



### 1-version1 (v1.1)


In this release we Improve the UI in a nicer view possible we have created a nice looking card view that contains :
-Background color with white color and  the opacity of 0.2 by using rgba(255,255,255,.2).
-Rounded edges by applying borderra borderRadius:15.
-Thin width with a white color borderColor:'white' and borderwidth:2.
-Rounded photo for avatarUrl by using borderRadius:30 on the image style elments.

In order to be able to display date as a string we need to use moment library and format the output of the date using this line
moment(createdAt).format('YYYY-DD-MM hh:mm a');
and will display the day in the format like : 2017-22-09 10:49 am

### 2-version1 (v1.2)

In this version we have added a new library to add some animations to the list that we have created . The user can press on the 
card and then the card will expand (slide down) to be able to read the repository and the slide down height will be flex with the size of the  repository body text .
The Library called 
react-native-collapsible
and we use <Accordion> element this has three parameters : 
  1-sections ( the data we retrived from github)
  2-renderHeader(the top part that will show first when oppening the app) and will return a function called(_renderHeader)
  3- renderContent (the expandable part) that will contain in our example the bodyText  and will return a function called(_renderContent)
  
  it will be written this way :
  
  ```
  
   <ScrollView style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                       <Accordion
                        sections={thedata}
                       renderContent={_renderContent}
                       renderHeader={_renderHeader}
                          />  
    </ScrollView>
  
  
```

_renderHeader function is smiller to the card in the v1.1

_renderContent 

```
function _renderContent(section){

     return(  <View style={{padding:10,backgroundColor:'rgba(255,255,255,.2)',borderBottomLeftRadius:15,borderBottomRightRadius:15,marginLeft:8,marginRight:8,marginRight:8,marginBottom:8}}>
                         <Text style={{color:'white'}}>Issue :</Text> 
              <Text style={{color:'white'}}>{section.bodyText}</Text>      

      </View>)

}
```




we have added also a tabbar on top the displays the App Name



## 3d Party Libraries used in the Application
1-react-apollo is an agent library that react native uses to communicate with a graphql API s where it allow react to send out the query to the server and get back the response . we can install this library by using this command :
```npm install --save react-apolo ```


2- moment to handle the date objects in human readable and to install this library use this command:
```npm install --save moment```

3- react-native-collapsible the aim of using this library is to provide the UI with an animatable touch after loading data from github .and we can install this library using :
```npm install react-native-collapsible --save ```

