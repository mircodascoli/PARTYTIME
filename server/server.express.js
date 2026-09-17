import express from 'express';
import bodyParser from 'body-parser';
import { db, connectDB, closeDB } from './server.mongodb.js';
import { sendOrderEmail } from './mailer.js';

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- HELPERS ----------


const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// ---------- HEALTH ----------

// utile per Render/Railway e per verificare al volo che il deploy sia vivo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ---------- CREATE ----------

app.post(
  '/api/create/botellas',
  asyncHandler(async (req, res) => {
    res.json(await db.botellas.get());
  })
);

app.post(
  '/api/create/users',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new AppError('Email is required', 400);

    const userExists = await db.users.get({ email });
    if (userExists.length > 0) {
      throw new AppError('User already exists', 409);
    }

    const newUser = { ...req.body };
    delete newUser._id;
    res.status(201).json(await db.users.create(newUser));
  })
);

// ---------- READ ----------

app.get(
  '/api/read/users',
  asyncHandler(async (req, res) => {
    res.json(await db.users.get());
  })
);

app.get(
  '/api/read/botellas',
  asyncHandler(async (req, res) => {
    res.json(await db.botellas.get());
  })
);

app.get(
  '/api/read/cocktails',
  asyncHandler(async (req, res) => {
    res.json(await db.cocktails.get());
  })
);


app.put(
  '/api/cart/item/update',
  asyncHandler(async (req, res) => {
    const { productAndQuantity, user } = req.body;
    if (!productAndQuantity || !user) {
      throw new AppError('productAndQuantity and user are required', 400);
    }
    res.json(await db.users.updateCart(productAndQuantity, user));
  })
);

// ---------- DELETE ----------

app.delete(
  '/api/delete/from/cart',
  asyncHandler(async (req, res) => {
    const { idBotella, idUser } = req.body;
    if (!idBotella || !idUser) {
      throw new AppError('idBotella and idUser are required', 400);
    }
    res.json(await db.users.DeleteFromCart(idBotella, idUser));
  })
);

app.delete(
  '/api/clear/cart',
  asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) throw new AppError('userId is required', 400);
    res.json(await db.users.clearCart(userId));
  })
);

app.delete(
  '/api/delete/recipe',
  asyncHandler(async (req, res) => {
    const { userId, recipeId } = req.body;
    if (!userId || !recipeId) {
      throw new AppError('userId and recipeId are required', 400);
    }
    res.json(await db.users.deleteRecipe(userId, recipeId));
  })
);

app.delete(
  '/api/delete/item',
  asyncHandler(async (req, res) => {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      throw new AppError('userId and itemId are required', 400);
    }
    res.json(await db.users.deleteItem(userId, itemId));
  })
);

// ---------- SEARCH / FILTER ----------

app.post(
  '/api/search',
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) throw new AppError('Search term is required', 400);
    res.json(await db.botellas.search({ $text: { $search: name } }, {}));
  })
);

app.get(
  '/api/product/preview/:name',
  asyncHandler(async (req, res) => {
    const result = await db.botellas.productPreview(
      { name: req.params.name },
      {}
    );
    if (!result) throw new AppError('Product not found', 404);
    res.json(result);
  })
);

app.get(
  '/api/find/bottles/:id',
  asyncHandler(async (req, res) => {
    const _id = toObjectId(req.params.id, 'bottle id');
    const botella = await db.botellas.productPreview({ _id }, {});
    if (!botella) throw new AppError('Bottle not found', 404);
    res.json(botella);
  })
);

app.post(
  '/api/busqueda/cart',
  asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      throw new AppError('ids should be an array', 400);
    }
    const objectIds = ids.map((id) => toObjectId(id, 'cart item id'));
    res.json(await db.botellas.findByIds({ _id: { $in: objectIds } }));
  })
);


app.post(
  '/api/buscar/usuario',
  asyncHandler(async (req, res) => {
    const user = await db.users.search(req.body);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
  })
);

// ---------- CART / RECIPES ----------

app.post(
  '/api/push/to/cart',
  asyncHandler(async (req, res) => {
    const { productAndQuantity, user } = req.body;
    if (!productAndQuantity || !user) {
      throw new AppError('productAndQuantity and user are required', 400);
    }
    res.json(await db.users.addToCart(productAndQuantity, user));
  })
);

app.post(
  '/api/push/to/recipes',
  asyncHandler(async (req, res) => {
    const { recipe, idUser } = req.body;
    if (!recipe || !idUser) {
      throw new AppError('recipe and idUser are required', 400);
    }
    res.json(await db.users.addToRecipes(recipe, idUser));
  })
);

// ---------- AUTH ----------

app.post(
  '/api/login',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new AppError('Email is required', 400);

    const user = await db.users.login({ email });
    if (!user) throw new AppError('Invalid credentials', 401);
    res.json(user);
  })
);

// ---------- ORDER ----------

app.post(
  '/api/order',
  asyncHandler(async (req, res) => {
    const { name, email, products, total } = req.body;

    if (!name || !email || !products?.length) {
      throw new AppError('Incomplete order data', 400);
    }

    await sendOrderEmail({ name, email, products, total });
    res.json({ success: true, message: 'Order received, emails sent' });
  })
);

// ---------- STATIC ----------

app.use(express.static('src'));

// ---------- ERROR HANDLING (sempre in fondo) ----------

// 404 per qualsiasi rotta /api non riconosciuta
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});


app.use((err, req, res, next) => {
  const status = err.statusCode || 500;


  console.error(` ${status} ${req.method} ${req.originalUrl}:`, err.message);
  if (status === 500) console.error(err.stack);

  
  const message =
    err.isOperational || !isProd ? err.message : 'Internal server error';

  res.status(status).json({ success: false, error: message });
});

// ---------- STARTUP / SHUTDOWN ----------

const server = app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`listening on port ${port}`);
  } catch (err) {
    console.error(' Failed to connect to MongoDB, shutting down:', err);
    process.exit(1);
  }
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await closeDB();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});