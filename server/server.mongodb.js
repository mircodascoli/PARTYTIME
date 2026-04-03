import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
  users: {
    get: getUsers,
    login: login,
    create: createUsers,
    update: updateUsers,
    search: searchUsers,
    addToRecipes: addToRecipes,
    delete: deleteUsers,
    DeleteFromCart: DeleteFromCart,
    clearCart: clearCart,
    clearRecipes: clearRecipes,
    deleteRecipe: deleteRecipe,
    deleteItem: deleteItem,
    addToCart: AddProductToCart,
    updateCart: UpdateProductInCart


  },
  botellas: {
    get: getBotellas,
    getInCart: DisplayBotellasInCart,
    search: searchBotellas,
    findByIds: findBotellasByIds,
    productPreview: productPreview

  }
  , cocktails: {
    get: getCocktails
  }
}

async function getBotellas(filter, projection) {
  console.log('hey from get bottellas')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();

}


async function DisplayBotellasInCart() {
  console.log('hey from get botellas in cartMONGODB')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const usersCollection = PartytimetDB.collection('Botellas');
  return await usersCollection.findOne({});
}

async function AddProductToCart(idProductQuantity, idUser) {
  const client = new MongoClient(URI);
  console.log('Adding product to cart in MongoDB...', idProductQuantity, 'for user', idUser);

  try {
    await client.connect();
    const db = client.db("Partytime");
    const users = db.collection("users");

    // 1️⃣ Try to update quantity if product already exists in cart
    const result = await users.updateOne(
      {
        _id: new ObjectId(idUser),
        "cart._id": idProductQuantity._id  // ← match the specific cart item
      },
      {
        $inc: {
          "cart.$.quantity": idProductQuantity.quantity
        }
      }
    );

    // 2️⃣ If product not in cart yet → push it
    if (result.matchedCount === 0) {
      await users.updateOne(
        { _id: new ObjectId(idUser) },
        {
          $push: {
            cart: { ...idProductQuantity }
          }
        }
      );
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
async function addToRecipes(recipe, idUser) {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db("Partytime");
    const users = db.collection("users");

    // 1️⃣ Provo a sostituire se esiste già stesso name
    const result = await users.updateOne(
      {
        _id: new ObjectId(idUser),
        "recipes.name": recipe.name
      },
      {
        $set: {
          "recipes.$": {
            _id: new ObjectId(),
            ...recipe
          }
        }
      }
    );

    // 2️⃣ Se non esiste → lo aggiungo
    if (result.matchedCount === 0) {
      await users.updateOne(
        { _id: new ObjectId(idUser) },
        {
          $push: {
            recipes: {
              _id: new ObjectId(),
              ...recipe
            }
          }
        }
      );
    }
  } catch (err) {
    console.error(err);

  } finally {
    await client.close();
  }
}

async function getUsers(filter, projection) {
  console.log('hey from get users')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const usersCollection = PartytimetDB.collection('users');
  return await usersCollection.find(filter).project(projection).toArray();

}
async function getCocktails() {
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const cocktailsCollection = PartytimetDB.collection('Cocktails');
  const cocktails = await cocktailsCollection.find({}).toArray();
  console.log(cocktails, 'cocktails from MONGOdb')
  return cocktails;

}

async function searchBotellas(filter, projection) {
  console.log('hey from search botellas', filter)
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('Botellas');
  return await botellasCollection.find(filter).project(projection).toArray();

}

async function searchUsers(filter) {
  console.log('hey from search users')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const usersCollection = PartytimetDB.collection('users');

  console.log({ id: new ObjectId(filter) })

  let UserFromDB = await usersCollection.findOne({ _id: new ObjectId(filter) });
  console.log(UserFromDB)
  return UserFromDB
}
async function findBotellasByIds(filter) {
  console.log('Cercando bottiglie con questi ID:', filter);

  const client = new MongoClient(URI);
  const db = client.db('Partytime');
  const botellasCollection = db.collection('Botellas');

  return await botellasCollection.find(filter).toArray();
}

async function login({ email, password }) {
  console.log('hey from login')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const usersCollection = PartytimetDB.collection('users');
  let collectionUsers = usersCollection.findOne({ email, password })
  return await collectionUsers

}

async function createUsers(user) {
  console.log('your email has been registred', user.email)
  const client = new MongoClient(URI);
  const PartytimeDB = client.db('Partytime');
  const usersCollection = PartytimeDB.collection('users');
  return await usersCollection.insertOne(user)
}

async function updateUsers(id, updates) {
  console.log('your recipe has been saved to your account',)
  const client = new MongoClient(URI);
  const PartytimeDB = client.db('Partytime');
  const usersCollection = PartytimeDB.collection('users');

  const returnValue = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log(returnValue)
  return returnValue
}
async function deleteUsers(id) {
  console.log('your account has been deleted from MONGOdb', id)
  const client = new MongoClient(URI);
  const PartytimeDB = client.db('Partytime');
  const usersCollection = PartytimeDB.collection('users');
  const returnValue = await usersCollection.deleteOne({ _id: new ObjectId(id) });
  console.log(returnValue)
  return returnValue
}

async function DeleteFromCart(idBotella, idUser) {
  console.log('Deleting from cart...');
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(idUser) },
      { $pull: { cart: idBotella } }
    );

    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from cart:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function clearCart(userId) {
  console.log('Clearing cart...');
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { cart: "" } }
    );

    console.log('Clear result:', result);
    return result;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function clearRecipes(userId) {
  console.log('Clearing recipes...');
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { recipes: [] } }
    );

    console.log('Clear result:', result);
    return result;
  } catch (error) {
    console.error('Error clearing recipe:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function deleteRecipe(userId, recipeId) {
  console.log('Deleting recipe in MONGOdb...', recipeId, 'for user', userId);
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: {
          recipes: { _id: new ObjectId(recipeId) }
        }
      }

      // RECIPE ID ARRIVA UNDEFINED 
    );
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function deleteItem(userId, itemId) {
  console.log('Deleting item in MONGOdb...', itemId, 'for user', userId);
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: {
          cart: { _id:(itemId) }
        }
      }

      // RECIPE ID ARRIVA UNDEFINED 
    );
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  } finally {
    await client.close();
  }
}
async function productPreview(filter, projection) {
  console.log('hey from previw in mongo DB')
  const client = new MongoClient(URI);
  const PartytimetDB = client.db('Partytime');
  const botellasCollection = PartytimetDB.collection('Botellas');
  const result = await botellasCollection.findOne(filter, { projection });
  return result;
}

async function UpdateProductInCart(productAndQuantity, idUser) {
  const client = new MongoClient(URI);
  console.log('Updating product in cart in MongoDB...', productAndQuantity, 'for user', idUser);
  try {
    await client.connect();
    const db = client.db('Partytime');
    const users = db.collection('users');

   const result = await users.updateOne(
  { 
    _id: new ObjectId(idUser),   // user _id is still an ObjectId
    'cart._id': productAndQuantity._id           // cart _id is a plain string
  },
  { $set: { 'cart.$.quantity': productAndQuantity.quantity } }
);;

    console.log('Update result:', result);
    return result;
  } catch (error) {
    console.error('Error updating product in cart:', error);
    throw error;
  } finally {
    await client.close();
  }
}

