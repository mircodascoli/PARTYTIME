import express from 'express';
import { db } from "./server.mongodb.js";
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';

const app = express();
const port = process.env.PORT || 3000;;

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// CREATE

app.post('/api/create/botellas', async (req, res) => {
  console.log('server reate botellas')
  res.json(await db.botellas.get())
});

app.post('/api/create/users', async (req, res) => {
  const userExists = await db.users.get({ email: req.body.email })
  console.log("hello from create users")

  if (userExists.length === 0) {
    const newUser = req.body
    delete newUser._id
    res.json(await db.users.create(newUser))
    
  } else {
    res.status(400).send('User already exists from express')
  }
})

// READ

app.get('/api/read/users', async (req, res) => {
  console.log('server read users')
  res.json(await db.users.get())
});

app.get('/api/read/botellas', async (req, res) => {

  console.log('server read botellas')
  res.json(await db.botellas.get())
});

app.get('/api/read/cocktails', async (req, res) => {
  console.log('server read cocktails');

  try {
    const cocktails = await db.cocktails.get();
    console.log('cocktails from db:', cocktails);
    res.json(cocktails);
  } catch (err) {
    console.error('❌ ERROR IN db.cocktails.get:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE     
app.put('/api/update/users/:_id', async (req, res) => {
  res.json(await db.users.update(req.params._id, req.body))
  console.log('update', req.params._id, req.body)
})

// DELETE

app.delete('/api/delete/user/', async (req, res) => {
  console.log('server delete user', req.body, typeof req.body)

  res.json(await db.users.delete(req.body._id))
})

app.delete('/api/delete/from/cart', async (req, res) => {
  console.log('server delete from cart')

  res.json(await db.users.DeleteFromCart(req.body.idBotella, req.body.idUser))

})

app.delete('/api/delete/cart', async (req, res) => {
  console.log('server delete cart', req.body.userId, typeof req.body.userId)

  res.json(await db.users.clearCart(req.body.userId))
})

app.delete('/api/clear/recipes', async (req, res) => {
  console.log('server clear recipes')

  res.json(await db.users.clearRecipes(req.body.userId))
})

app.delete('/api/delete/recipe', async (req, res) => {
  console.log('server delete recipe', req.body)
  const { userId, recipeId } = req.body;
  res.json(await db.users.deleteRecipe(userId, recipeId));
});

app.delete('/api/delete/item', async (req, res) => {
  console.log('server delete item', req.body)
  const { userId, itemId } = req.body;
  res.json(await db.users.deleteItem(userId, itemId));
});

// FILTER

app.post('/api/search', async (req, res) => {
  console.log('search in express', req.body)
  //recuerda añadir la projeccion para filtrar los ampos que devolvemos
  res.json(await db.botellas.search({ $text: { $search: req.body.name } }, {}))
})

app.get('/api/product/preview/:name', async (req, res) => {
  console.log('preview for product', req.params.name)
  const result = await db.botellas.productPreview({ name: req.params.name }, {});
  res.json(result);
})

app.post('/api/busqueda/cart', async (req, res) => {
  try {
    const ids = req.body.ids;
    console.log('Ricevuti questi ID:', ids);
    const objectIds = ids.map(id => new ObjectId(id));
    const botellas = await db.botellas.findByIds({ _id: { $in: objectIds } });
    res.json(botellas);
  } catch (error) {
    console.error('Error in express', error);
  }
})

app.post('/api/busqueda/party', async (req, res) => {
  console.log('estamos en busqueda party', req.body);

  const keywords = req.body.keywords;
  console.log(keywords, typeof keywords, 'keywords in express');
  if (!Array.isArray(keywords)) {
    return res.status(400).json({ error: "Keywords should be an array of strings." });
  }

  try {
    const result = await db.botellas.findByNames(
      { name: { $in: keywords } },
      {}
    );
    res.json(result);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/api/push/to/cart', async (req, res) => {
  console.log('req.body push to cart EXPRESS', req.body)
  res.json(await db.users.addToCart(req.body.productAndQuantity, req.body.user))
})

app.post('/api/push/to/recipes', async (req, res) => {
  console.log('req.body push to recipes in express', req.body)
  res.json(await db.users.addToRecipes(req.body.recipe, req.body.idUser))
})

app.post('/api/buscar/usuario', async (req, res) => {
  console.log('estamos en busqueda', req.body)
  //recuerda añadir la projeccion para filtrar los ampos que devolvemos
  res.json(await db.users.search(req.body))
  console.log(res.json)
})

app.post('/api/login', async (req, res) => {
  console.log('estamos en login', req.body)
  const user = await db.users.login({ email: req.body.email, password: req.body.password })
  res.json(user)
})

app.post('/api/buy/ingredient', async (req, res) => {
  console.log('server buy ingredient', req.body)
  const { userId, ingDbname } = req.body;
  res.json(await db.users.buyIngredient(userId, ingDbname));
});

app.get('/api/find/bottles/:id', async (req, res) => {
  console.log('server find bottle by id', req.params.id);
  try {
    const botella = await db.botellas.productPreview(
      { _id: new ObjectId(req.params.id) },
      {}
    );
    res.json(botella);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})

app.put('/api/cart/item/update', async (req, res) => {
   console.log('req.body cart item update EXPRESS', req.body)
  res.json(await db.users.updateCart(req.body.productAndQuantity, req.body.user))
})
// Static server
app.use(express.static('src'));

app.listen(port, async () => {
  console.log(` listening on port ${port}`);
})



