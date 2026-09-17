import { MongoClient, ObjectId } from 'mongodb';

const URI = process.env.MONGO_URI;

if (!URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}


const client = new MongoClient(URI);

let PartytimeDB;


export async function connectDB() {
  await client.connect();
  PartytimeDB = client.db('Partytime');
  console.log(' Connected to MongoDB (Partytime)');
}

export async function closeDB() {
  await client.close();
  console.log('MongoDB connection closed');
}

export const db = {
  users: {
    get: getUsers,
    login: login,
    create: createUsers,
    update: updateUsers,
    search: searchUsers,
    addToRecipes: addToRecipes,
    DeleteFromCart: DeleteFromCart,
    clearCart: clearCart,
    deleteRecipe: deleteRecipe,
    deleteItem: deleteItem,
    addToCart: AddProductToCart,
    updateCart: UpdateProductInCart,
  },
  botellas: {
    get: getBotellas,
    getInCart: DisplayBotellasInCart,
    search: searchBotellas,
    findByIds: findBotellasByIds,
    productPreview: productPreview,
  },
  cocktails: {
    get: getCocktails,
  },
};

// ---------- BOTELLAS ----------

async function getBotellas(filter = {}, projection = {}) {
  const botellasCollection = PartytimeDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();
}

async function DisplayBotellasInCart() {
  const botellasCollection = PartytimeDB.collection('Botellas');
  return await botellasCollection.findOne({});
}

async function searchBotellas(filter, projection = {}) {
  const botellasCollection = PartytimeDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();
}

async function findBotellasByIds(filter) {
  const botellasCollection = PartytimeDB.collection('Botellas');
  return await botellasCollection.find(filter).toArray();
}

async function productPreview(filter, projection = {}) {
  const botellasCollection = PartytimeDB.collection('Botellas');
  return await botellasCollection.findOne(filter, { projection });
}

// ---------- COCKTAILS ----------

async function getCocktails() {
  const cocktailsCollection = PartytimeDB.collection('Cocktails');
  return await cocktailsCollection.find({}).toArray();
}

// ---------- USERS ----------

async function getUsers(filter = {}, projection = {}) {
  const usersCollection = PartytimeDB.collection('users');
  return await usersCollection.find(filter).project(projection).toArray();
}

async function searchUsers(filter) {
  const usersCollection = PartytimeDB.collection('users');
  return await usersCollection.findOne({ _id: new ObjectId(filter) });
}

async function login(email) {
  const usersCollection = PartytimeDB.collection('users');
  return await usersCollection.findOne(email);
}

async function createUsers(user) {
  const usersCollection = PartytimeDB.collection('users');
  return await usersCollection.insertOne(user);
}

async function updateUsers(id, updates) {
  const usersCollection = PartytimeDB.collection('users');
  return await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
}

async function AddProductToCart(idProductQuantity, idUser) {
  const users = PartytimeDB.collection('users');

  // update quantity if product already exists in cart
  const result = await users.updateOne(
    {
      _id: new ObjectId(idUser),
      'cart._id': idProductQuantity._id,
    },
    {
      $inc: {
        'cart.$.quantity': idProductQuantity.quantity,
      },
    }
  );

  // If product not in cart yet, push it
  if (result.matchedCount === 0) {
    return await users.updateOne(
      { _id: new ObjectId(idUser) },
      { $push: { cart: { ...idProductQuantity } } }
    );
  }

  return result;
}

async function UpdateProductInCart(productAndQuantity, idUser) {
  const users = PartytimeDB.collection('users');
  return await users.updateOne(
    {
      _id: new ObjectId(idUser),
      'cart._id': productAndQuantity._id,
    },
    { $set: { 'cart.$.quantity': productAndQuantity.quantity } }
  );
}

async function DeleteFromCart(idBotella, idUser) {
  const users = PartytimeDB.collection('users');
  return await users.updateOne(
    { _id: new ObjectId(idUser) },
    { $pull: { cart: idBotella } }
  );
}

async function clearCart(userId) {
  const users = PartytimeDB.collection('users');
  return await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { cart: [] } }
  );
}

async function addToRecipes(recipe, idUser) {
  const users = PartytimeDB.collection('users');

  const result = await users.updateOne(
    {
      _id: new ObjectId(idUser),
      'recipes.name': recipe.name,
    },
    {
      $set: {
        'recipes.$': { _id: new ObjectId(), ...recipe },
      },
    }
  );

  if (result.matchedCount === 0) {
    return await users.updateOne(
      { _id: new ObjectId(idUser) },
      { $push: { recipes: { _id: new ObjectId(), ...recipe } } }
    );
  }

  return result;
}

async function deleteRecipe(userId, recipeId) {
  const users = PartytimeDB.collection('users');
  return await users.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { recipes: { _id: new ObjectId(recipeId) } } }
  );
}

async function deleteItem(userId, itemId) {
  const users = PartytimeDB.collection('users');
  return await users.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { cart: { _id: itemId } } }
  );
}