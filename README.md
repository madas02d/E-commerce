# Fullstack-e-commerce

This is a full-stack group project

## 1. Project workflow

- **Browse Categories**
- **Browse Clothes**
- **Manage a cart (also as guest until the user has to pay)**
- **Register/Login**

---

## 2. Define Core Features & User Stories

**Formula:**

1. Persona + need + purpose
2. I [user], need to [do something] to [achieve something]
3. As a [persona], I [want to], [so that].

- _As a guest user, I want to Browse categories and clothes_
- _As a guest user, I want to add one or multiple items to my cart_
- _As a guest user, I want to remove one or multiple items from my cart_
- _As a user I want to create an account so that I can buy items_
- _As a user I want to log in and out securely_

---

## 3. Wireframe Planning

Before diving into the actual coding, it's helpful to sketch out a wireframe of how our app will look. Wireframes help visualize the layout and flow of the application before implementing the UI.

[Wireframe](https://www.figma.com/design/lyYlJEpikk1G634WzQ3tqx/Untitled?node-id=16-349&p=f&t=duGLhvkYx78bEyVt-0)

### Main pages and UI elements

- Homepage (Categories landing page - ex. Men, Women, Kids or Winter/summer, or )
- Sign up page
- Login page
- Search page
- Product-item page
- Cart sidebar

---

## 4. Database Schemas

#### User Schema (User.js):

```js

{
 fullName: {String, required, unique}
 email: {String, required, unique}
 password: {String, required}

//  createdAt: {Date, default: Date.now}
 cartId: {type: Schema.Types.ObjectId, ref:"Cart"}
}
```

#### Products Schema (Product.js)

```js

{
  title: { type: String, required: true, unique: true },
  image: { type: String, required: true, unique: true },
  brandName: { type: String, required: true },
  category: {
    type: String,
    enum: ["Women", "Men", "Unisex", "Kids"], // The only four possible values
    required: true,
  },
  price: { type: Number, required: true },
  size: {
    xs: { type: Number },
    s: { type: Number },
    m: { type: Number },
    // ... etc.
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  }
}
```

### Cart Collection: to store user cart items

```js
{
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ];
}
```

### Orders Collection: to store ordered items from the user

```js
{
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
       product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    }
  ],
   address: {type: String, required: true},
 phone: {type: String},
}
```

---

## 5. Backend API Design

### User Routes (`/users`)

| Method | Endpoint    | Description                    | Auth Required? |
| ------ | ----------- | ------------------------------ | -------------- |
| POST   | `/register` | Create a new user              | No             |
| POST   | `/login`    | Authenticate user & return JWT | No             |
| GET    | `/logout`   | Log out user                   | Yes            |

### Records Routes (`/products`)

| Method | Endpoint | Description     | Auth Required? |
| ------ | -------- | --------------- | -------------- |
| GET    | `/`      | Get all records | No             |

### Cart Routes (`/carts`)

| Method | Endpoint          | Description              | Auth Required? |
| ------ | ----------------- | ------------------------ | -------------- |
| GET    | `/:cartId`        | Get cart details         | No             |
| POST   | `/:cartId/add`    | Add a product to cart    | No             |
| PATCH  | `/:cartId/update` | Update quantity in cart  | No             |
| DELETE | `/:cartId/remove` | Remove product from cart | No             |

### Order Routes(`/orders`) <!-- If we have time and energy -->

| Method | Endpoint        | Description            | Auth Required? |
| ------ | --------------- | ---------------------- | -------------- |
| GET    | `/:orderId`     | Get orders details     | Yes            |
| POST   | `/:orderId/add` | Add an order (confirm) | Yes            |

---

## 6. Thinking The Frontend Structure (React)

- What components do we need?

| Component          | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `Navbar.jsx`       | Displays navigation links, login status (Global)           |
| `Footer.jsx`       | Displays links, social, "rights reserved" (Global)         |
| `ProductCard.jsx`  | Displays individual record details (Part from Desktop - 4) |
| `CartItemList.jsx` | Lists cart items (Part from Desktop - 6)                   |
| `CartItem.jsx`     | Displays an individual cart item (Part from Desktop - 6)   |
| ------------------ | ---------------------------------------                    |
| Pages              | Purpose                                                    |
| ------------------ | ---------------------------------------                    |
| `HomePage.jsx`     | Landing page (Desktop - 1)                                 |
| `SearchPage.jsx`   | Filters out the products (Desktop - 4)                     |
| `ProductPage.jsx`  | Lists all records (Desktop - 5)                            |
| `Login.jsx`        | Login form (Desktop - 2)                                   |
| `Signup.jsx`       | Registration form (Desktop - 3)                            |
| `CartPage.jsx`     | Cart Page (Desktop - 7)                                    |
| `PaymentPage.jsx`  | Payment Page (Desktop - \*\*)                              |

### State Management

State structure is always matching the collections in our database

- **Users** (`usersReducer.js`)
- **Products** (`productsReducer.js`)
- **Cart** (`cartReducer.js`)
- **Order** (`orderReducer.js`)
- These are managed in `Context.jsx` to provide a **global state**.

---

## 7. Step-by-Step Implementation Plan
