---
title: "Creating a full-stack kanban board: the Ruby on Rails API backend"
description: Step-by-step, create a full-stack kanban board with a Vue Single Page Application (SPA) and a Ruby on Rails API. In this part, we’ll be covering how to create the Ruby on Rails backend.
coverUrl: https://images.pexels.com/photos/301673/pexels-photo-301673.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260
alt: cover-image-creating-a-full-stack-kanban-board-the-ruby-on-rails-api-backend
createdAt: 2021-02-01
---

This is part 2 of a 2 part series, you can find the first part on creating the Vue frontend here: Creating a full-stack kanban board: [the Vue SPA frontend](/posts/creating-a-full-stack-kanban-board-the-vue-spa-frontend)

##### 💡 Demo

The app we're creating is a full-stack kanban board where you can manage the cards with all CRUD (i.e. Create, Read, Update, Delete) operations and the cards will automatically update in the database when moving it between different columns. 

You can find a demo of it here: [Demo Kanban Board](https://woetflow-demo-kanban-board.netlify.app/)

##### ⚙️ Code

The example project's code can be found in these repositories on Github:

Vue frontend: https://github.com/WoetDev/woetflow-demo-kanban-board-vue 

Ruby on Rails backend: https://github.com/WoetDev/woetflow-demo-kanban-board-api

-------
<br>

## 1. Setting up the Ruby on Rails API

### 1.1 Generating the Ruby on Rails project

We’ll be using Ruby on Rails as our API, with RoR we can get everything up and running extremely quickly and we’ll be able to generate the JSON responses with a minimal amount of code. 

Since we only need a simple API, we’ll exclude a lot of the default files and gems that are part of a standard new rails project. 

We’ll also setup a PostgreSQL database instead of the default SQLite3 database. Since I’ll be hosting the API on Heroku, the app will be running on PostgreSQL in production so it’s a good practice to be running on the same DBMS in development. 

To create the project, run: ```rails new woetflow-demo-kanban-board-api -T -C -M --skip-active-storage -d=postgresql --api```

This what all the options mean that we’re adding to the rails new command:

* ```-T``` → Skip test files

* ```-C``` → Skip ActionCable files

* ```-M``` → Skip ActionMailer files

* ```--skip-active-storage``` → Skip ActiveStorage files

* ```-d=postgresql``` →  Preconfigure for selected database: PostgreSQL

* ```--api``` → Controllers will inherit from ActionController::API instead of ActionController::Base and generators will not create views.

<br>

### 1.2 Creating the PostgreSQL database

Now, we’ll create the database. I’m running the commands from a Linux Ubuntu terminal. In case you’re running on Mac some of these commands might differ. 

Create database user ‘name' with password

```bash
sudo -u postgres createuser -s name -P
```

Add database user password as an environment variable

```bash
echo 'export WOETFLOW_DEMO_KANBAN_BOARD_DATABASE_PASSWORD="PostgreSQL_Role_Password"' >> ~/.bashrc
```

Export the variable for current session

```bash
source ~/.bashrc
```

Add user configuration to database.yml

```yml
...
default: &default
  adapter: postgresql
  encoding: unicode
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: name
  password: <%= ENV['WOETFLOW_DEMO_KANBAN_BOARD_DATABASE_PASSWORD'] %>

development:
  <<: *default
  database: woetflow_demo_kanban_board_api_development
...
```

Create databases from database.yml

```bash
rails db:create
```

If you might run into an error in the future with the database, the classic “have you tried turning it on & off again” usually helps me out. 

I do that with the command: 

```bash
sudo service postgresql restart
```

### 1.3 Add rack-cors gem

For our last step, we’ll also uncomment the rack-cors gem in the Gemfile, we’ll need this to make it possible to send our JSON responses from the API to our Vue app. 

```Gemfile:```

```ruby
...
\# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'rack-cors'
...
```

Run: ```bundle install```

Now our project and database should be setup! To test if everything is working correctly, let’s boot up our server by running ```rails s``` and navigate to localhost:3000 in the browser. If you’re seeing the “Yay! You’re on Rails!” message then we’re good to go!

## 2. Add columns endpoint

Since the cards belong to a user and column, we’ll first set up these endpoints. We also don’t need to support all CRUD operations for the columns and users, so this will only require an index route.

So let’s create the necessary model & controller.

### 2.1 Create the column model

To generate the model, run: ```rails g model column label value```

Both the label and value will be strings, this is the default value for the model generator so we don’t need to specify the data type for these columns. If we’d want a column to have another value then we’d need to define it as for example ```rails g model column label:text value:integer```

Once the generator is finished, run the migration: ```rails db:migrate```

The columns will be associated with cards in a one-to-many relationship, so we’ll already set that up in our model. 

```app/models/column.rb:```

```ruby
class Column < ApplicationRecord
  has_many :cards
end 
```

### 2.2 Create the columns controller

To generate the controller, run: ```rails g controller columns index```

The generator will add the columns_controller.rb in app/controllers and the necessary route in config/routes.rb. 

For the routes, we’ll make a small adjustment so the index action routes to /columns instead of columns/index.

```config/routes.rb:```

```ruby
Rails.application.routes.draw do
  get '/columns', to: 'columns#index'
end
```

Back to our columns_controller, we’ll add the logic of the index action. The index action will return a JSON with all the columns sorted by ids and will also contain the JSON for all the cards associated with that column sorted by updated_at. This way we can easily iterate the JSON in our Vue app and get all the columns and cards we need in one request. 

```app/controllers/columns_controller.rb:```

```ruby
class ColumnsController < ApplicationController
  def index
    @columns = Column.order(:id)

    render json: @columns, include: { cards: { include: [ :user, :column ], except: [:user_id, :column_id] }}
  end
end
```

And that's all we need to do to set-up the columns controller, although this won’t work just yet before we’ve added our user and card models. 

## 3. Add users endpoint

For the users, we’ll do the same as for our columns. The only difference is that we won’t return any of the associations in the JSON.

### 3.1 Create the user model

Run: ```rails g model user label value```

Run: ```rails db:migrate```

And lastly, also set-up the association again in the model.

```app/models/user.rb:```

```ruby
class User < ApplicationRecord
  has_many :cards
end
```

### 3.2 Create the users controller

Run: ```rails g controller users index```

Once the generator has run, we’ll also make the same adjustment to our routes file.

```config/routes.rb:```

```ruby
Rails.application.routes.draw do
  ...
  get '/users', to: 'users#index'
end
```

After that, we’ll make the index action return all users, sorted by their label (i.e. their name). 

```app/controllers/users_controller.rb:```

```ruby
class UsersController < ApplicationController
  def index
    @users = User.all.order(:label)

    render json: @users
  end
end
```

## 4. Add cards endpoint

For the cards we need to support all CRUD operations, so we’ll set this up with a scaffold.

Run: ```rails g scaffold card title date:datetime tag column:references user:references```

Run: ```rails db:migrate```

### 4.1 Create the card model

For the model, our associations will already be added to by declaring column:references & user:references in the scaffolding command. 

All we still need to add to the model are validations for values that shouldn’t be blank. We also have client-side validations for this, but it’s important that these validations are aligned on the server-side.

```app/models/card.rb:```

```ruby
class Card < ApplicationRecord
  ...
  validates :title, :date, :column_id, :user_id, presence: true
end
```

And that’s it for our card model. 

### 4.2 Create the cards controller

When going to the cards_controller.rb file, we’ll see that the scaffold has already created all the CRUD actions for us. 

Since we don’t show a detail of one specific card, we can delete the show action and prevent its route from being created.

```app/controllers/cards_controller.rb:```

```ruby
class CardsController < ApplicationController
  before_action :set_card, only: [:show, :update, :destroy]
  ...
  # GET /cards/1
  def show
    render json: @card
  end
  ...
end
```

```config/routes.rb:```

```ruby
Rails.application.routes.draw do
  resources :cards, except: [:show]
  ...
end
```

Once we’ve deleted the show action we just have one more thing to do in the controller. 

We’ll adjust the index, create and update actions so the JSON response also returns the full JSON body of the associations of the card instead of only the id.

```app/controllers/cards_controller.rb:```

```ruby
class CardsController < ApplicationController
  before_action :set_card, only: [:update, :destroy]

  # GET /cards
  def index
    @cards = Card.all

    render json: @cards, include: [:user, :column], except: [:user_id, :column_id]
  end

  # POST /cards
  def create
    @card = Card.new(card_params)

    if @card.save
      render json: @card, include: [:user, :column], except: [:user_id, :column_id], status: :created, location: @card
    else
      render json: @card.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /cards/1
  def update
    if @card.update(card_params)
      render json: @card, include: [:user, :column], except: [:user_id, :column_id]
    else
      render json: @card.errors, status: :unprocessable_entity
    end
  end
  
  ...
end
```

Nice! Now all the controllers and models we need are set-up! We only need to do some last adjustments for our API to be able to properly send data over to our frontend and we’ll add sample data in the database to test everything out. 

## 5. Update CORS configuration

In order for our API to not block incoming requests from the frontend, we need to enable Cross Origin Resource Sharing (CORS). We already have the support we need in our API for this by uncommenting the rack-cors gem during our project setup. 

To enable it, we simply need to add the domain of our frontend to the cors initializer.

```config/initializers/cors.rb:```

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:8080'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

## 6. Add seed data

And finally, let’s add sample data to our API and test if everything is working as expected. We’re gonna add sample data for our columns, users and cards in the seeds.rb file.

Once you’ve added the code to the seeds.rb file, you can run ```rails db:seed``` to add it to the database. If afterwards you would like to reset the values in the database with the seed file, you can run ```rails db:seed:replant```.

To test if everything is working after adding the seeds, you can boot up the server with ```rails s```. 

If you navigate to the paths /cards, /columns or /users on localhost, these should all return JSON responses now. 

To check out how your code should look at this point, you can refer to the repository in [this commit](https://github.com/WoetDev/woetflow-demo-kanban-board-api/tree/ed830d3df6e57321775655b854a23576a15150f1)

The seeds file is quite long so I’ll end the article here. If you haven’t set-up the Vue frontend of the application yet, you can hop back over to the other part to start or continue working on the board.

```db/seeds.rb:```

```ruby
columns = [
  {
    label: "TO-DO",
    value: "to_do"
  },
  {
    label: "IN PROGRESS",
    value: "in_progress"
  },
  {
    label: "REVIEW",
    value: "review"
  },
  {
    label: "DONE",
    value: "done"
  }
]

users = [
  {
    label: "Steve Jobs",
    value: "https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png",
  },
  {
    label: "Wally De Backer",
    value: "https://pickaface.net/gallery/avatar/HalcyonicBlues51d76e22316fb.png"
  },
  {
    label: "Indro Warkop",
    value: "https://pickaface.net/gallery/avatar/technostar2651dbbe73a502d.png"
  },
  {
    label: "Vincent Chase",
    value: "https://pickaface.net/gallery/avatar/Opi51c74f6c56e40.png"
  },
  {
    label: "Johnny Drama",
    value: "https://pickaface.net/gallery/avatar/Opi51c74f056fc74.png"
  },
  {
    label: "Johnny Depp",
    value: "https://pickaface.net/gallery/avatar/gs315535348ce076c6.png"
  },
  {
    label: "Bashir Hamdok",
    value: "https://pickaface.net/gallery/avatar/unr_bashir_210120_0314_cvj3.png"
  }
]

columns.each do |column|
  Column.create(label: column[:label], value: column[:value])
end

users.each do |user|
  User.create(label: user[:label], value: user[:value])
end

cards = [
  {
    title: "Add discount code to checkout page",
    date: "2020-12-14",
    tag: "Feature Request",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Provide documentation on integrations",
    date: "2021-01-12",
    tag: "Backend",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Design shopping cart dropdown",
    date: "2021-01-09",
    tag: "Design",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Test checkout flow",
    date: "2021-09-15",
    tag: "QA",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Design wishlist overview",
    date: "2021-01-09",
    tag: "Design",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Add paypal as a payment provider",
    date: "2021-01-14",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Update documentation on products endpoint",
    date: "2021-01-19",
    tag: "Backend",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Design products carousel",
    date: "2021-01-10",
    tag: "Design",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Add related products section",
    date: "2021-01-14",
    tag: "Feature Request",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Design wishlist dropdown",
    date: "2021-01-09",
    tag: "Design",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Add new properties to products endpoint",
    date: "2021-01-14",
    tag: "Backend",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Prepare product meeting",
    date: "2021-01-14",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  },
  {
    title: "Design discount code for checkout page",
    date: "2021-01-12",
    tag: "Design",
    column_id: Column.find_by(value: columns.sample[:value])[:id],
    user_id: User.find_by(label: users.sample[:label])[:id]
  }
]

cards.each do |card|
  Card.create(title: card[:title], date: card[:date], tag: card[:tag], column_id: card[:column_id], user_id: card[:user_id])
end
```