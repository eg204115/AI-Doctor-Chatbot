// import { MongoClient, MongoClientOptions } from 'mongodb';

// // Get and validate the connection string
// function getMongoUri(): string {
//   const uri = process.env.MONGODB_URI;
  
//   console.log('🔍 Checking MONGODB_URI:', uri ? 'Present' : 'Missing');
  
//   if (!uri) {
//     throw new Error(
//       'MONGODB_URI is not defined. Please add it to .env.local\n' +
//       'Expected format: mongodb://username:password@host:port/database'
//     );
//   }

//   // Validate the URI format
//   if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
//     throw new Error(
//       `Invalid MongoDB URI format. Expected to start with "mongodb://" or "mongodb+srv://"\n` +
//       `Received: ${uri.substring(0, 50)}...`
//     );
//   }

//   return uri;
// }

// const uri = getMongoUri();
// console.log('✅ Using MongoDB URI:', uri.replace(/:[^:]*@/, ':****@'));

// const options: MongoClientOptions = {
//   serverSelectionTimeoutMS: 10000,
//   connectTimeoutMS: 10000,
//   socketTimeoutMS: 45000,
//   retryWrites: true,
//   w: 'majority'
// };

// declare global {
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === 'development') {
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClientPromise?: Promise<MongoClient>;
//   };

//   if (!globalWithMongo._mongoClientPromise) {
//     try {
//       client = new MongoClient(uri, options);
//       globalWithMongo._mongoClientPromise = client.connect()
//         .then((connectedClient) => {
//           console.log("✅ Connected to MongoDB successfully");
//           return connectedClient;
//         })
//         .catch((error) => {
//           console.error("❌ MongoDB connection failed:", error.message);
//           throw error;
//         });
//     } catch (error) {
//       console.error("❌ Failed to create MongoDB client:", error);
//       throw error;
//     }
//   }
//   clientPromise = globalWithMongo._mongoClientPromise;
// } else {
//   try {
//     client = new MongoClient(uri, options);
//     clientPromise = client.connect()
//       .then((connectedClient) => {
//         console.log("✅ Connected to MongoDB successfully");
//         return connectedClient;
//       })
//       .catch((error) => {
//         console.error("❌ MongoDB connection failed:", error.message);
//         throw error;
//       });
//   } catch (error) {
//     console.error("❌ Failed to create MongoDB client:", error);
//     throw error;
//   }
// }

// export default clientPromise;

import { MongoClient, MongoClientOptions } from 'mongodb';

// Get and validate the connection string
function getMongoUri(): string {
  // Use local MongoDB as fallback if env variable is not set
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-doctor";
  
  console.log('🔍 Checking MONGODB_URI:', uri ? 'Present' : 'Using default local MongoDB');
  
  // Validate the URI format
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      `Invalid MongoDB URI format. Expected to start with "mongodb://" or "mongodb+srv://"\n` +
      `Received: ${uri.substring(0, 50)}...`
    );
  }

  return uri;
}

const uri = getMongoUri();
console.log('✅ Using MongoDB URI:', uri.replace(/:[^:]*@/, ':****@'));

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Remove retryWrites and w for local MongoDB as they're Atlas-specific
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect()
        .then((connectedClient) => {
          console.log("✅ Connected to MongoDB successfully");
          // Test the connection
          return connectedClient.db().admin().ping()
            .then(() => {
              console.log("✅ MongoDB ping successful");
              return connectedClient;
            });
        })
        .catch((error) => {
          console.error("❌ MongoDB connection failed:", error.message);
          throw error;
        });
    } catch (error) {
      console.error("❌ Failed to create MongoDB client:", error);
      throw error;
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
      .then((connectedClient) => {
        console.log("✅ Connected to MongoDB successfully");
        // Test the connection
        return connectedClient.db().admin().ping()
          .then(() => {
            console.log("✅ MongoDB ping successful");
            return connectedClient;
          });
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        throw error;
      });
  } catch (error) {
    console.error("❌ Failed to create MongoDB client:", error);
    throw error;
  }
}

export default clientPromise;