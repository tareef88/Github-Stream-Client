# Github-Stream-Client
Overview

The idea of this App is to fetch data from github Api and display it in a list in the react-native application and let the user scroll the latest issues happens with (java-Script) in the github database
by querying:


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



and get a response in this form :

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



then populating each element in a good looking Card.






This App using 3 external Libraries :
1-react-apollo is an agent library that react native uses to communicate with a graphql API s where it allow react to send out the query to the server and get back the response . we can install this library by using this command :
npm install --save react-apolo 


2- moment to handle the date objects in human readable and to install this library use this command:
npm install --save moment

3- react-native-collapsible the aim of using this library is to provide the UI with an animatable touch after loading data from github .and we can install this library using :
npm install react-native-collapsible --save 

