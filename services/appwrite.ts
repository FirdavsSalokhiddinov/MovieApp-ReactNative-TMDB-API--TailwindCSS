import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_TABLE_ID!;

// define the Movie type based on your database schema
const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID

const database = new Databases(client);

// track the searches made by a user
export const updateSearchCount = async(query: string, movie: Movie) => {
   
    try{
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal('searchTerm', query)
        ])

        // check if a record of that search has already been stored
        // if a doc is found increment the search count field
        if(result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(DATABASE_ID, TABLE_ID, existingMovie.$id, {
                count: existingMovie.count + 1
            });
        }
        
        // if no doc is found, create a new doc in table

        else{
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), { 
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title,
            });
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        // Query for existing document
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(10),
            Query.orderDesc('count'),
        ]);
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        return undefined;
    }
}