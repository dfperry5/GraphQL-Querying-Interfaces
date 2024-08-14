import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  interface Book {
    title: String!
    author: String!
  }

  type Textbook implements Book {
    title: String!
    author: String!
    courses: [String!]!
    gradeLevel: Int
  }

  type ColoringBook implements Book {
    title: String!
    author: String!
    colors: [String!]!
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
        courses: ["I Am", "A college", "TextBook"],
        gradeLevel: 12
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
        colors: ['Red', 'Orange']
    },
];
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Book: {
        __resolveType(book, contextValue, info) {
            // Only Textbook has a courses field
            if (book.courses) {
                return 'Textbook';
            }
            // Only ColoringBook has a colors field
            if (book.colors) {
                return 'ColoringBook';
            }
            return null; // GraphQLError is thrown
        },
    },
    Query: {
        books: () => books
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
